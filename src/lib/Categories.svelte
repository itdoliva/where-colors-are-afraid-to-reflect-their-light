<script>
  import { fade, fly } from "svelte/transition"
  import { scaleBand, arc, range, interpolateLab } from "d3"
  import { categories, scales } from "../stores/global"
  import { _ } from 'svelte-i18n'
  import { tweened } from "svelte/motion";
  import { onDestroy } from "svelte";

  export let node
  export let margin
  export let first = true
  let width = 0
  let height = 0

  const nCategories = $categories.length

  const pal = {
    out: '#E3E3E3',
    zero: '#ABAAA6',
    positive: '#94C277',
    negative: '#DB8E8E'
  }

  const colorStore = {}

  $: arcWidth = Math.min(height / (nCategories * (14)), width/20)
  $: headerRectSize = Math.max(width*.15, 15)


  $: y = scaleBand()
    .domain([...Array(nCategories).keys()])
    .range([margin, height])

  $: arcGenerator = arc()
    .innerRadius(p => Math.abs(p) * arcWidth * 1.75)
    .outerRadius(p => Math.abs(p) * arcWidth * 1.75 + arcWidth)
    .startAngle(p => p !== 0 ? -Math.PI/2 : 0)
    .endAngle(p => p !== 0 ? Math.PI/2 : 2*Math.PI)

  $: col = $categories.map((category, i) => genPointsData(category, node, i, height))


  function genPointsData(category, node, i) {
    return range(category.range[0], category.range[1]+1, 1)
      .map((p) => {
        const d = arcGenerator(p)
        
        const id = `${category.id}-${p}`
        const fill = color(node, p, node && node.categories[category.id])

        if (colorStore[id]) {
          colorStore[id].tween.set(fill)

        } else {
          colorStore[id] = {
            tween: tweened(fill, {
              delay: 75 * Math.abs(p) + 20*i,
              duration: 300,
              interpolate: interpolateLab
            })
          }

          const unsubscribe = colorStore[id].tween.subscribe((value) => {
            colorStore[id].color = value
          })

          onDestroy(unsubscribe)
        }

        return {
          id,
          p,
          tY: p === 0 ? 0 : p < 0 ? 2 : -2,
          rotate: p < 0 ? 180 : 0,
          d,
        }
      })
  }

  function color(node, p, v) {
    if (node && p < 0 && v < 0 && p >= v) {
      return pal.negative
    } 

    else if (node && p > 0 && v > 0 && p <= v) {
      return pal.positive
    } 

    else if (node && p === 0 && v === 0) {
      return pal.zero
    }

    return pal.out
  }


</script>

<div 
class="categories-wrapper"
class:active={node}
>

  {#if node}
    <div class="f-region-name">
      <p
      title={$_(node.regionId)}
      transition:fly={{ duration: 300, y: -6 }}
      >
        {$_(node.regionId)}
      </p>
    </div>
  {/if}

  <div 
  bind:clientWidth={width}
  bind:clientHeight={height}
  class="categories-wrapper-inner">
  <svg>

    <g
    class="header"
    transform="translate({width/2}, 0)"
    transition:fly={{ duration: 300, y: -6 }}
    >
      
      <g
      transform="translate(0, {headerRectSize})"
      >
        <rect 
        x={-headerRectSize/2} 
        y={-headerRectSize/2} 
        width={headerRectSize} 
        height={headerRectSize} 
        fill={node ? $scales[node.continentId](node.score) : 'transparent'}
        />

        <line
        x1={-headerRectSize/4}
        x2={+headerRectSize/4}
        y1={headerRectSize*.25 * (first ? -1 : 1)} 
        y2={headerRectSize*.25 * (first ? -1 : 1)}
        stroke-width=2
        stroke={node ? 'white' : 'transparent'} />
      </g>
    </g>


    <g 
    class="column"
    transform="translate({width/2}, 0)"
    >

      {#each col as points, j}
        <g transform="translate(0, {y(j)})">

          {#each points as point}
            <path 
            d={point.d}
            transform="translate(0, {point.tY}) rotate({point.rotate})"
            fill={colorStore[point.id].color}
            />
          {/each}

        </g>  
      {/each}

    </g>

  </svg>
</div>

</div>


<style>
  .categories-wrapper {
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.0);
    transition: all .15s ease-in-out;

    display: flex;
    align-items: stretch;
  }

  .categories-wrapper.active {
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
  }

  .categories-wrapper-inner {
    margin: 0 2.5%;
    flex-grow: 1;
  }

  .f-region-name {
    position: absolute;
    top: 3.55%;
    left: 0;
    right: 0;

    padding: 0 7.5%;
  }

  .f-region-name > p {
    margin: 0;
    color: var(--text-gray);
    font-weight: 400;
    text-align: center;

    overflow: hidden;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
  }


  svg {
    width: 100%;
    height: 100%;
  }

</style>