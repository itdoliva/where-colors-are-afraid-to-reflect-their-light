<script>
  import { createEventDispatcher, onDestroy } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { _ } from 'svelte-i18n'
  import { interpolateLab, min } from 'd3';
  import { data, continents, scales, colors, emphasized } from "./stores/global";

  export let idA
  export let idB
  export let idH
  export let nodeH
  export let transitions
  export let showTour
  export let tourStep

  let wrapperWidth
  let windowHeight
  let cursor = { active: false, x: 0, y: 0 }

  const dispatch = createEventDispatcher()
  
  const poleWidth = 8 // Pole width
  const count = 15 // Number of squares by row
  const refs = {}
  const colorStore = {}


  $: selSWidth = size/12
  $: hovSWidth = selSWidth/2

  $: ttipPos = getTooltipPos(nodeH)

  $: flagWidth = min([wrapperWidth, windowHeight*.65])
  $: size = ((flagWidth - poleWidth) / count) // Square size
  $: poleHeight = (Math.ceil($data.length/count) | 0) * size * 1.08
  $: x = (i) => (i % count) * size
  $: y = (i) => (i / count | 0) * size
  $: selSize = size*.75

  $: sorted = [...$data].sort((a, b) => (
    $continents.indexOf(a.continentId) - $continents.indexOf(b.continentId) ||
    b.score - a.score || 
    $_(a.regionId).localeCompare($_(b.regionId))
  )).map((d, index) => ({ ...d, index }))

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

<svelte:window bind:innerHeight={windowHeight} />

{#if flagWidth > 0}
  <div 
  id="flag-wrapper" 
  class="flag-wrapper" 
  bind:clientWidth={wrapperWidth}
  >

    <div
    class="flag-inner"
    style="width: {flagWidth}px; height: {poleHeight}px;"
    bind:this={refs['wrapper']}
    >
      <div 
      class="tooltip"
      class:hidden={!idH}
      style="transform: translate({nodeH && ttipPos.x}px, {nodeH && ttipPos.y}px);"
      >
        <div class="tooltip-inner">
          <h5>{nodeH && $_(nodeH.regionId)}</h5>
        </div>

      </div>

      <svg>

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
{/if}

<style>

  .flag-wrapper {
    flex-grow: 1;
  }

  .flag-inner {
    position: relative;
    margin: 0 auto;
  }

  /* /////////////////////////// */
  /* /////////// SVG /////////// */
  /* /////////////////////////// */

  svg {
    width: 100%;
    height: 100%;
  }

  svg g {
    cursor: none;
  }

  .pointer {
    pointer-events: none;
    opacity: .75;
  }

  .pointer.hidden {
    opacity: 0;
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

  .over-square.hover text {
    fill: var(--off-white);
    font-size: .75em;
    text-anchor: middle;
  }

  .pole {
    fill: var(--text-gray)
  }


  /* /////////////////////////////// */
  /* /////////// TOOLTIP /////////// */
  /* /////////////////////////////// */

  .tooltip {
    position: absolute;
    opacity: 1;
    pointer-events: none;
  }

  .tooltip.hidden {
    opacity: 0;
  }

  .tooltip-inner {
    transform: translate(-50%, .4em);
  }

  .tooltip-inner > h5 {
    font-size: .8em;
    color: var(--off-white);
    text-shadow: 0 0 6px var(--text-black), 0 0 2px var(--text-black);
  }

  
</style>