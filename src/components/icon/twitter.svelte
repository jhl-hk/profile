<script>
  export let className = '';
  export let size = '24';
  export let color = 'currentColor';
  
  $$restProps;
</script>

<svg 
  viewBox="0 0 24 24" 
  aria-hidden="true" 
  class={className}
  width={size}
  height={size}
  fill={color}
  {...$$restProps}
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z"
  />
</svg>