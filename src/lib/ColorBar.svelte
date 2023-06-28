<script>
  import { range, scaleLinear } from "d3";
  import { tweened } from "svelte/motion";
  import { fly } from "svelte/transition";
  import { scales } from "./stores/global";

  export let nodeH

  let width = 0
  let height = 0

  const wPad = 6
  const extent = [-19, 13]
  const scores = range(extent[0], extent[1]+1)

  const tickPos = tweened(0)

  $: x = scaleLinear()
    .domain(extent)
    .range([wPad, width - wPad*2])

  $: tickPos.set(nodeH ? x(nodeH.score) : 0)

</script>


<div 
class="colorbar-wrapper"
bind:clientWidth={width}
bind:clientHeight={height}
>
  {#if width > 0}
  <svg in:fly|local={{ y: -20, x: 0 }}>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">

        {#each [...Array(scores.length).keys()] as i}
          <stop 
          offset="{100*i/(scores.length-1)}%" 
          stop-color={$scales[nodeH ? nodeH.continentId : 'c0'](scores[i])}/>
        {/each}

      </linearGradient>
    </defs>

    <rect
    x={wPad}
    y={height*.2}
    width={width-wPad*2}
    height={height*.8}
    fill="url(#gradient)"/>

    <line 
    x1={$tickPos} 
    y1={height*.1} 
    x2={$tickPos} 
    y2={height} 
    stroke-width="4" 
    opacity={$tickPos > 0 ? 1 : 0}
    />
  </svg>
  {/if}
</div>


<style>
  .colorbar-wrapper {
    height: 3rem;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  svg line {
    stroke: var(--text-black);
  }
</style>