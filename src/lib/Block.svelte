<script>
  import { _ } from "svelte-i18n"
  import { colors } from "../stores/global"
  import { range, scaleBand } from "d3";
  export let i
  export let id
  export let curStep

  let width = 1280
  let height = 800

  const flag = {}
  flag.nBands = 3
  flag.heightP = .5

  $: nColors = Object.values($colors).length

  $: x = scaleBand()
    .domain(range(0, 9))
    .range([0, Math.min(2600, width)])

  $: flag.width = x.bandwidth() * flag.nBands
  $: flag.height = height * flag.heightP

</script>

<div 
class="block block-{id}"
class:selected={curStep === i}
bind:clientWidth={width}
bind:clientHeight={height}
>

  {#if id === 'intro'}
    <svg class="svg">

      <rect 
      class="bg"
      x={40}
      y={40}
      width={width-80}
      height={height-80}
      transform="rotate(-7.5 {width/2} {height/2})"
      />

      <g 
      class="flag"
      transform="translate({width/2 - flag.width/2}, 0)"
      >
        {#each Object.values($colors) as color, i}
          <rect 
          x={i*flag.width/nColors} 
          y=0 
          width={flag.width/nColors} 
          height={flag.height} 
          fill={color} />
        {/each}
      </g>

    </svg>

    <div class="content">
      <div 
      class="text"
      style="top: {flag.height*1.075}px;"
      >
        <h1>{$_("entry.title")}</h1>
        <h4>{$_("entry.month")}</h4>
      </div>
    </div>
  {/if}

</div>

<style>
  .block {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
  }

  .block.selected {
    z-index: 1;
  }

  .svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .svg .bg {
    stroke: var(--black);
    stroke-width: 1px;
    fill: none;
  }

  .content {
    max-width: 2600px;
    height: 100%;
    margin: 0 auto;
    grid-template-columns: repeat(10, 1fr);
  }

  .block-intro .text {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
    color: var(--text-gray);

    display: flex;
    flex-direction: column;

  }

  .block-intro .text h1 {
    font-family: 'Braah One', sans-serif;
    font-size: 4rem;
    text-transform: uppercase;
  }

  
</style>