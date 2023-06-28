<script>
  import { createEventDispatcher } from 'svelte';
  import { _, locale } from 'svelte-i18n'
  import { data, colors, continents } from "./stores/global";
  import { toOrdinal } from './utils/toOrdinal';

  export let idH
  export let nodeH
  let innerWidth
  let ttip
  const refs = {}

  const dispatch = createEventDispatcher()
  
  $: ttipPos = getTooltipPos(nodeH)

  $: sorted = [...$data].sort((a, b) => 
    b.score - a.score ||
    $continents.indexOf(a.continentId) - $continents.indexOf(b.continentId) ||
    $_(a.regionId).localeCompare($_(b.regionId))
  )

  function getTooltipPos(node) {
    const pos = { x: 0, offset: 0 }

    if (node) {
      const nodeBbox = refs[node.regionId].getBoundingClientRect()
      const nodeCenter = nodeBbox.x + nodeBbox.width/2

      const ttipBbox = ttip.getBoundingClientRect()
      const ttipHalfWidth = ttipBbox.width/2

      const leftSide = nodeCenter < innerWidth/2 

      const diff = leftSide
        ? nodeCenter - ttipHalfWidth
        : innerWidth - (nodeCenter + ttipHalfWidth)

      pos.x = (diff >= 0 ? nodeCenter : leftSide
        ? nodeCenter - diff
        : nodeCenter + diff) - ttipHalfWidth
      
      pos.offset = diff >= 0 ? ttipHalfWidth : leftSide
        ? ttipHalfWidth + diff
        : ttipHalfWidth - diff
    }

    return pos
  }



</script>

<svelte:window bind:innerWidth />

<div id="grank-wrapper" class="grank-wrapper">

  <div class="grank-inner">

      <div 
      class="grank__tooltip" 
      class:hidden={!idH}
      style="transform: translate({nodeH ? ttipPos.x : innerWidth/2}px, 0);"
      bind:this={ttip}>

        <div 
        class="triangle-wrapper"
        style="transform: translate({ttipPos.offset}px, 0);"
        >
          <div 
          class="triangle" 
          style="border-bottom-color: {nodeH && $colors[nodeH.continentId]};"/>
        </div>

        <div 
        class="grank__tooltip-inner" 
        style="border-top-color: {nodeH && $colors[nodeH.continentId]};"
        >
          <h5>{nodeH && $_(nodeH.regionId)}</h5>
          <p>{@html nodeH && toOrdinal(nodeH.rank, $locale)}</p>
        </div>
        
      </div>

    <div class="grank__nodes">
      {#each sorted as node }
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <span 
      class="grank__nodes--node grank__node-{node.regionId}" 
      style="background: {$colors[node.continentId]};"
      on:click={() => dispatch('click', { id: node.regionId })}
      on:mousemove={() => dispatch('mousemove', { id: node.regionId })}
      on:mouseleave={() => dispatch('mouseleave')}
      bind:this={refs[node.regionId]}
      />
      {/each}
    </div>

 
    
  </div>
    
  <p class="grank__title" class:hidden={idH}>
    {$_("ranking.global")}
  </p>

</div>


<style>
 .grank-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    z-index: 10000;
  }

  .grank-inner {
    position: relative;
    width: 100%;
    height: .5em;
  }

  .grank__nodes {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    box-sizing: border-box;
    transition: padding .15s ease-in-out;
  }

  .grank__nodes--node {
    flex-grow: 1;
    border: none;
  }

  .grank__tooltip {
    position: absolute;
    width: 8em;
    top: calc(100% + .25em);
    opacity: 1;
    transition: transform .15s ease-in-out;
  }

  .grank__tooltip.hidden {
    opacity: 0;
  }

  .grank__tooltip .triangle-wrapper {
    transition: transform .1s ease-in-out;
  }

  .grank__tooltip .triangle {
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-top: 0;
    border-bottom-width: 6px;
    border-bottom-style: solid;
    transform: translate(-50%, 0);
  }

  .grank__tooltip-inner {
    width: 100%;
    padding: 4px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .25em;

    border-top-width: 4px;
    border-top-style: solid;
  
    color: var(--text-black);
  }
  
  .grank__tooltip-inner > h5 {
    text-align: center;
  }
  
  .grank__tooltip-inner > p {
    text-align: center;
    margin: 0;
  }

  .grank__title {
    margin: 0;

    position: absolute;
    top: 1em;
    left: 50%;

    font-size: .7em;
    font-weight: 500;
    text-transform: uppercase;
    text-align: center;
    color: var(--text-black);

    opacity: 1;
    transform: translate(-50%, 0);
    transition: opacity .15s ease-in-out, transform .15s ease-in-out;
    cursor: default;
  }

  .grank__title.hidden, 
  .grank-inner:hover .grank__title {
    transform: translate(-50%, 2px);
    opacity: 0;
  }
</style>