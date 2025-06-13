<script lang="ts">
  export let title: string;
  export let description: string;
  export let period: string;
</script>

<div class="bg-white/10 p-4 rounded-lg">
  <h4 class="font-medium text-stone-800">{title}</h4>
  <p class="text-stone-600">{description}</p>
  <p class="text-sm text-stone-500">{period}</p>
</div> 