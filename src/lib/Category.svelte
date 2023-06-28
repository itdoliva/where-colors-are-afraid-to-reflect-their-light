<script>
  import { onDestroy } from "svelte";
  import { _ } from "svelte-i18n";
  import { range, arc } from "d3";
  import { categories } from "./stores/global";

  let width = 0
  let height = 0
  let category = getRandomCategory()
  let curPos = 0

  const pal = {
    out: '#E3E3E3',
    zero: '#ABAAA6',
    positive: '#94C277',
    negative: '#DB8E8E'
  }

  const interval = setInterval(incrementPos, 1500)
  onDestroy(() => clearInterval(interval))

  const arcGenerator = arc()
    .startAngle(p => p !== 0 ? -Math.PI/2 : 0)
    .endAngle(p => p !== 0 ? Math.PI/2 : 2*Math.PI) 

  $: extent = category?.range
  $: points = range(extent[0], extent[1]+1, 1)
  $: arcWidth = height / 22
  $: pointsData = genPointsData(points, curPos, arcWidth)
  $: arcGenerator
    .innerRadius(p => Math.abs(p) * arcWidth * 1.75)
    .outerRadius(p => Math.abs(p) * arcWidth * 1.75 + arcWidth)



  function getRandomCategory() {
    return $categories[Math.random() * $categories.length | 0]
  }

  function incrementPos() {
    if (curPos >= points.length -1) {
      category = getRandomCategory()
      curPos = 0
      return
    }

    curPos++
  }


  function genPointsData(points, curPos, arcWidth) {
    return points.map((p) => ({
      p,
      tY: p === 0 ? 0 : p < 0 ? arcWidth/3 : -arcWidth/3,
      rotate: p < 0 ? 180 : 0,
      d: arcGenerator(p),
      fill: color(p, points[curPos])
    }))
  }


  function color(p, v) {
    

    if (p < 0 && v < 0 && p >= v) {
      return pal.negative
    } 

    else if (p > 0 && v > 0 && p <= v) {
      return pal.positive
    } 

    else if (p === 0 && v === 0) {
      return pal.zero
    }

    return pal.out
  }
</script>



<div 
class="category-wrapper"
bind:clientWidth={width}
bind:clientHeight={height}
> 
  <div class="category-header">
    <div class="category-header__child top">
      <span>{$_("tour.category")}</span>
      <h4>{$_(category.id)}</h4>
    </div>

    <div class="category-header__child bottom">
      <span>{$_("tour.points")}</span>
      <h4
      style="color: {color(points[curPos], points[curPos])};"
      >
        {(points[curPos] > 0 ? '+' : '') + points[curPos]}
      </h4>
    </div>
  </div>


  <svg>
      <g transform="translate({width/2}, {height/2})">

        {#each pointsData as { d, tY, rotate, fill }}
          <path 
          d={d}
          transform="translate(0, {tY}) rotate({rotate})"
          fill={fill}
          stroke={pal.zero}
          stroke-width=1
          stroke-opacity=".25"
          />
        {/each}

      </g>  
  </svg>
</div>


<style>
  .category-wrapper {
    position: relative;
    height: 18rem;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin: 1rem 0;
  }

  .category-header {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    gap: 1.6rem;

    z-index: 1;
  }

  .category-header__child {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  .category-header__child.bottom {
    margin-left: auto;
  }

  .category-header__child.bottom > span,
  .category-header__child.bottom > h4 {
    text-align: right;
  }

  .category-header__child.bottom > h4 {
    font-size: 6rem;
    line-height: 100%;
  }


  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>