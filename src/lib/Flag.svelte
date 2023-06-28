<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { interpolateLab } from 'd3';
	import { fade, fly, slide } from 'svelte/transition';
  import { data, continents, scales, colors, emphasized } from "../stores/global";
  import { _ } from 'svelte-i18n'
  import { tweened } from 'svelte/motion';

  export let idA
  export let idB
  export let idH
  export let nodeH
  export let transitions
  export let showTour
  export let tourStep

  let width = 600
  let cursor = { active: false, x: 0, y: 0 }
  let ttip

  const dispatch = createEventDispatcher()
  
  const poleWidth = 8 // Pole width
  const count = 15 // Number of squares by row
  const hovSWidth = 2
  const selSWidth = 4
  const refs = {}
  const colorStore = {}


  $: ttipPos = getTooltipPos(nodeH)

  $: sorted = [...$data].sort((a, b) => (
    $continents.indexOf(a.continentId) - $continents.indexOf(b.continentId) ||
    b.score - a.score || 
    $_(a.regionId).localeCompare($_(b.regionId))
  )).map((d, index) => ({ ...d, index }))

  $: size = ((width - poleWidth) / 15) // Square size
  $: poleHeight = (Math.ceil($data.length/count) | 0) * size * 1.08
  $: x = (i) => (i % count) * size
  $: y = (i) => (i / count | 0) * size
  $: selSize = size*.75

  $: setColorTween($data, $emphasized)


  function setColorTween() {
    sorted.forEach(({ regionId, continentId, score }, i) => {

      const color = $scales[continentId](score)

      if (colorStore[regionId]) {
        return colorStore[regionId].tween.set(color, { 
          delay: (x(i)*30 + y(i)*25 - Math.random()*1000)/size,
          duration: 300 + Math.random()*150,
        })
      }

      colorStore[regionId] = {
        tween: tweened(color, {
          interpolate: interpolateLab
        })
      }

      let unsubscribe = colorStore[regionId].tween.subscribe((value) => {
        colorStore[regionId].color = value
      })

      onDestroy( unsubscribe )
        
    })
  }

  function getTooltipPos(node) {
    const pos = { x: 0, y: 0}
    if (node) {
      const wrapper = refs.wrapper.getBoundingClientRect()
      const bbox = refs[node.regionId].getBoundingClientRect()
      
      pos.x = bbox.x + bbox.width/2 - wrapper.x
      pos.y = bbox.y + bbox.height - wrapper.y
    }
    return pos
  }

  function selectTransition(node, { 
    delay = 0,
    duration = 150
  }) {
    return {
      delay,
      duration,
      css: (t, u) => {
        const width = hovSWidth*u + selSWidth*t
        return `stroke-width: ${width}px`
      }
    }
  }

  function transitionColor(node, {
    delay = 0,
    duration = 150,
    init,
    final
  }) {
    const color = interpolateLab(init, final)
    return {
      delay,
      duration,
      css: t => `fill: ${color(t)}; stroke: ${color(t)}`
    }
  }

  function onMouseEnter(id) {
    return () => {
      cursor.active = true
      dispatch('mouseenter', { id })
    }
  }

  function onMouseMove(e) {
    cursor.x = e.offsetX
    cursor.y = e.offsetY
  }

  function onMouseLeave() {x
    cursor.active = false
    dispatch('mouseleave')
  }
  

</script>

<div id="flag-wrapper" class="flag-wrapper" >

  <div class="flag-wrapper-inner" bind:clientWidth={width} bind:this={refs['wrapper']}>

    <div 
    class="flag__tooltip"
    class:hidden={!idH}
    style="transform: translate({nodeH && ttipPos.x}px, {nodeH && ttipPos.y}px);"
    bind:this={ttip}>

      <div class="flag__tooltip-inner">
        <h5>{nodeH && $_(nodeH.regionId)}</h5>
      </div>

    </div>

    <svg height={poleHeight}>

      <g
      class="flag-outer"
      transform="translate({poleWidth}, 0)"
      >
        <g 
        class="flag" 
        on:mouseleave={onMouseLeave}
        in:fly={transitions.flag}
        >

          {#each sorted as d, i}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <g 
          class="node flag-node-{d.regionId}"
          transform="translate({x(i)}, {y(i)})"
          on:click={() => dispatch('click', { id: d.regionId })}
          on:mouseenter={onMouseEnter(d.regionId)}
          on:mousemove={onMouseMove}
          bind:this={refs[d.regionId]}
          >
          
            <rect
            class="region-square"
            width={size} 
            height={size}
            fill={colorStore[d.regionId].color}
            stroke={colorStore[d.regionId].color}
            />


            {#if [idA, idB].includes(d.regionId)}
              <g
              class="over-square selected"
              transform="translate({size*.5}, {size*.5})"
              >
                <rect
                x={-selSize/2}
                y={-selSize/2}
                width={selSize}
                height={selSize}
                stroke-width={selSWidth}
                in:selectTransition
                out:fade={{ duration: 150 }}
                />

                <line
                x1={-size*.2}
                x2={size*.2}
                y1={size*.175 * (d.regionId === idA ? -1 : 1)}
                y2={size*.175 * (d.regionId === idA ? -1 : 1)}
                stroke-width={selSWidth}
                in:fade|local={{ duration: 150 }}
                out:fade|local={{ duration: 150 }}
                />
              </g>
            {/if}

            {#if idH === d.regionId && ![idA, idB].includes(idH)}
              <g 
              class="over-square hover"
              transform="translate({size*.5}, {size*.5})"
              in:fade|local={{ duration: 150 }}
              out:fade|local={{ duration: 100 }} 
              >
                <rect 
                x={-selSize/2}
                y={-selSize/2}
                width={selSize}
                height={selSize}
                stroke-width={hovSWidth}
                />  

                <text
                dy={size*.015}
                text-anchor="middle"
                dominant-baseline="middle" 
                opacity={showTour && tourStep === 0 ? '0' : '1'}
                >
                  {nodeH?.score}
                </text>
              </g>
            {/if}

          </g>
          {/each}
        </g>
      </g>


      <circle 
      class="pointer" 
      class:hidden={!cursor.active} 
      fill="white" 
      r=3 
      cx={cursor.x} 
      cy={cursor.y}/>

      <rect
      class="pole"
      x="0"
      y="0"
      width={poleWidth}
      height={poleHeight}
      in:fly={transitions.pole}
      />
    </svg>
  </div>
</div>

<style>

  .flag-wrapper {
    width: 100%;
    flex-grow: 1;
  }

  .flag-wrapper-inner {
    position: relative;
    margin: 0 auto;
    max-width: 900px;
    margin: 0 auto;
    flex-grow: 1;
  }

  .emphasize {
    position: absolute;

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
  }



  .flag__tooltip {
    position: absolute;
    opacity: 1;
    pointer-events: none;
  }

  .flag__tooltip.hidden {
    opacity: 0;
  }

  .flag__tooltip-inner {
    transform: translate(-50%, 0);
  }

  .flag__tooltip-inner > h5 {
    color: var(--off-white);
    text-shadow: 0 0 6px var(--text-black), 0 0 2px var(--text-black);
  }

  svg {
    width: 100%;
  }

  .pointer {
    pointer-events: none;
    opacity: .75;
  }

  .pointer.hidden {
    opacity: 0;
  }

  svg g {
    cursor: none;
  }

  .region-square {
    stroke-width: 1;
  }

  .over-square rect {
    fill: none;
    stroke: var(--off-white);
  }
  
  .over-square line {
    stroke: var(--off-white);
  }

  .over-square text {
    fill: var(--off-white);
  }

  .pole {
    fill: var(--text-gray)
  }
</style>