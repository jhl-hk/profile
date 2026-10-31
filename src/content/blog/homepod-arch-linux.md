---
title: 'Using a HomePod 2 as a Speaker on Arch Linux'
description: 'Stream Arch Linux desktop audio to a HomePod (2nd generation) with PipeWire and Nyx Refrain.'
pubDate: 2026-10-29
lang: en
translationKey: 'homepod-arch-linux'
topics: ["System", "Linux"]
featured: false
draft: false
---

As a deep Apple user, it feel so awkward to left the Apple Eco system. Since on the road persuing more efficiency and pure experienc with control of the device. I started switching to Arch Linux instead of using MacOS/Windows. I came up a question as the most community powered and open-sourced Arch Linux, is there an opportunity to use Apple accessaries on a non-Apple device? Seems like answer is yes.

# Using a HomePod 2 as a Speaker on Arch Linux

Apple's HomePod is designed mainly for Apple devices, but it can also play audio from Linux over **AirPlay 2**. I tested this with a **HomePod (2nd generation)** and an Arch Linux desktop running **Niri, DMS, PipeWire, and WirePlumber**.

This guide explains how I connected it, fixed the audio stuttering, and configured an optional service to start streaming without typing a long command every time.

> **Note:** This is a community-built, experimental solution, not official Apple support. The added audio latency makes it more suitable for listening to music than for gaming or latency-sensitive video.

## Requirements

- Arch Linux with PipeWire and WirePlumber
- A HomePod (2nd generation) already set up in Apple's Home app
- The computer and HomePod able to communicate on the same local network
- Working mDNS/Bonjour device discovery

**The Linux computer does not need Wi-Fi.** It can use Ethernet while the HomePod uses Wi-Fi.

## 1. Discover the HomePod

Install and enable Avahi:

```bash
sudo pacman -S --needed avahi pipewire wireplumber
sudo systemctl enable --now avahi-daemon
```

Find AirPlay devices:

```bash
avahi-browse -rt _airplay._tcp
avahi-browse -rt _raop._tcp
```

My HomePod was advertised as `Living Room` at `192.168.2.237`. **Replace that address with the address of your own HomePod** in the commands below.

If the device does not appear, confirm it is online and that your router or Wi-Fi access point is not blocking mDNS or isolating wireless clients.

## 2. Install Nyx Refrain

[Nyx Refrain](https://github.com/pStrikeZ/Nyx-Refrain) can create a virtual PipeWire audio output and transmit its audio using AirPlay 2.

I used version **0.9.5** on `x86_64`. Check the [releases page](https://github.com/pStrikeZ/Nyx-Refrain/releases) for newer versions and review or verify third-party packages before installation.

```bash
cd ~/Downloads
curl -fLO \
  https://github.com/pStrikeZ/Nyx-Refrain/releases/download/v0.9.5/nyx-refrain-0.9.5-1-x86_64.pkg.tar.zst
sudo pacman -U ./nyx-refrain-0.9.5-1-x86_64.pkg.tar.zst
```

Verify that Nyx Refrain can see your speaker:

```bash
nyxr --help
nyxr discover
```

## 3. Stream Linux audio to the HomePod

This is the command that worked well in my setup:

```bash
nyxr stream \
  --target 192.168.2.237 \
  --audible \
  --ap2-sync-latency-ms 500 \
  --stats
```

Nyx Refrain creates a virtual sink named **Nyx Refrain (AirPlay)**. It should become the default output for apps such as Spotify and Firefox.

Check the audio routing:

```bash
wpctl status
pactl list short sinks
```

In `wpctl status`, look under **Audio → Sinks**, then confirm that the music application's stream points to **Nyx Refrain (AirPlay)**. DMS audio controls can also show the output.

Keep this terminal open while streaming; press `Ctrl+C` to stop. The `--stats` flag is optional.

## 4. Fix audio stuttering

Initially, AirPlay 2 connected successfully, but the audio kept cutting out. I tested the built-in latency profiles and an explicit synchronization delay.

The most useful change was adding:

```text
--ap2-sync-latency-ms 500
```

That setting produced smooth playback during my tests. It increases playback delay, so the result is better suited to music than to low-latency use.

I also tested a temporary PipeWire quantum of 1024:

```bash
pw-metadata -n settings 0 clock.force-quantum 1024
```

Because both settings were involved in my testing, I did not isolate which one was responsible for the improvement. **Try the AirPlay delay first**, and only adjust PipeWire quantum if needed.

Restore the PipeWire default afterward:

```bash
pw-metadata -n settings 0 clock.force-quantum 0
```

If audio still stutters, inspect PipeWire for processing errors:

```bash
pw-top
```

A synthetic tone can help distinguish an audio-capture problem from an AirPlay transmission problem:

```bash
nyxr stream \
  --target 192.168.2.237 \
  --source sine \
  --audible \
  --volume 20 \
  --latency-profile stable \
  --stats
```

If the tone is smooth but desktop audio stutters, investigate the PipeWire capture path. In my logs, `pw-top` showed no steadily increasing `ERR` count, and Nyx Refrain reported very few retransmission issues; that did not conclusively identify a single root cause.

## 5. Optional: start streaming automatically with systemd

You can create a **systemd user service** to start Nyx Refrain when you log in. Stop any manually running stream first.

Create the service:

```bash
mkdir -p ~/.config/systemd/user

cat > ~/.config/systemd/user/homepod.service <<'EOF_SERVICE'
[Unit]
Description=HomePod AirPlay 2 streaming
Wants=pipewire.service wireplumber.service
After=pipewire.service wireplumber.service

[Service]
Type=simple
ExecStart=/usr/bin/nyxr stream --target 192.168.2.237 --audible --ap2-sync-latency-ms 500
Restart=on-failure
RestartSec=10

[Install]
WantedBy=default.target
EOF_SERVICE
```

Update the HomePod IP and verify the executable path using `command -v nyxr` if necessary.

Enable and start it:

```bash
systemctl --user daemon-reload
systemctl --user enable --now homepod.service
systemctl --user status homepod.service
```

Useful commands:

```bash
# Connect
systemctl --user start homepod

# Disconnect
systemctl --user stop homepod

# Reconnect
systemctl --user restart homepod

# View logs
journalctl --user -u homepod -n 50 --no-pager

# Disable automatic connection
systemctl --user disable --now homepod
```

### A problem I encountered: Host is unreachable

My user service sometimes exited with:

```text
Error: io: Host is unreachable (os error 113)
```

Nyx Refrain had already created the PipeWire sink, but it could not reach the HomePod. This is a connectivity issue, **not** evidence that the `500` ms argument is unsupported.

To investigate:

```bash
ping -c 5 192.168.2.237
ip -4 route get 192.168.2.237
nyxr discover
```

Check whether the HomePod is awake, reachable, and still has the same IP. Reserving its IP in DHCP may help. The `Restart=on-failure` setting retries temporary failures but cannot resolve a permanently unreachable device. **Automatic startup is optional and should be verified separately from manual streaming.**

## 6. Alternative: use the tray application

Nyx Refrain also has a tray interface:

```bash
nyx-refrain
```

If your DMS system tray supports it, you can manage playback from there. Avoid running a tray-managed stream and the systemd service at the same time; they may compete for the same HomePod. Also check whether the tray version preserves your custom latency setting.

## Conclusion

A HomePod 2 can work as a wireless speaker for Arch Linux using **AirPlay 2, PipeWire, and Nyx Refrain**. For my setup, the combination of a working local network and a **500 ms synchronization delay** made music playback usable without stuttering.

The practical takeaway: successful AirPlay discovery and connection do not guarantee smooth audio, and automatic streaming still requires the HomePod to be reachable.

**References:** [Nyx Refrain](https://github.com/pStrikeZ/Nyx-Refrain) · [Releases](https://github.com/pStrikeZ/Nyx-Refrain/releases)

*Tested October 29, 2026, on Arch Linux, Niri + DMS, HomePod (2nd generation), and Nyx Refrain 0.9.5.*
