<script lang="ts">
  export let title: string;
  export let description: string;
  export let period: string;
</script>

<div class="bg-white/30 p-4 rounded-lg">
  <h4 class="font-medium text-stone-900">{title}</h4>
  <p class="text-stone-700">{description}</p>
  <p class="text-sm text-stone-600">{period}</p>
</div> 