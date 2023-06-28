<script>
  import { _, locale } from 'svelte-i18n'
  import { fade } from 'svelte/transition';
  
  import Category from "./Category.svelte"
  import Flag from './Flag.svelte'
  import IndexBan from './IndexBan.svelte'
  import GlobalRank from './GlobalRank.svelte';
  import Comparison from './Comparison.svelte';
  import Switch from './Switch.svelte';
  import ColorBar from './ColorBar.svelte';
  import Tour from "./Tour.svelte";
  
  import { colors, data, continents } from './stores/global'
  import ImgBanRectEN from "./assets/banrect-en.png"
  import ImgBanRectBR from "./assets/banrect-br.png"
  
  export let showTour
  
  const transitions = {
    pole: { y: '100%', opacity: 1, duration: 750 },
    flag: { y: '50%', duration: 1000, delay: 350 },
    others: { delay: 1250, duration: 1000 }
  }

  let tourStep = 0

  let idH = null
  let idA = null
  let idB = null
  let cmdOn = false
  let interval

  $: nodeH = idH ? $data.find(d => d.regionId === idH) : null
  $: nodeA = idA ? $data.find(d => d.regionId === idA) : null
  $: nodeB = idB ? $data.find(d => d.regionId === idB) : null

  $: onTour(showTour, tourStep)

  function getRandomId(ids=[]) {
    const frame = ids.length 
    ? $data.filter(d => !ids.includes(d.regionId))
    : $data
    return frame[Math.random() * frame.length | 0].regionId
  }

  function onTour(showTour, tourStep) {
    if (interval) clearInterval(interval)

    setTimeout(() => {
      idH = null
    }, 0)
    

    if (showTour) {
      if (tourStep === 0 || tourStep === 2) {
        setTimeout(() => idH = getRandomId(), 0)
        interval = setInterval(() => idH = getRandomId([idA, idB]), 1000)
        return
      }
      else if (tourStep === 3) {
        if(!idA) {
          interval = setTimeout(() => idA = getRandomId([idB]), 0)
        }
      }
      else if (tourStep === 4) {
        setTimeout(() => {
          const nextA = getRandomId([idB])
          const nextB = getRandomId([idA, nextA])
          if (!idA) idA = nextA
          if (!idB) idB = nextB
        }, 0)
      }
    }
    
  }


  function onClick (id) {
    if (cmdOn) {
      if (!idB && (!idA || idA !== id)) {
        idB = id
      } else if (idB && idB !== id && (!idA || idA !== id)) {
        idB = id
      } else if (idB && idB === id) {
        idB = null
      }
    } else {
      if (!idA && (!idB || idB !== id)) {
        idA = id
      } else if (idA && idA !== id && (!idB || idB !== id)) {
        idA = id
      } else if (idA && idA === id) {
        idA = null
      }
    }
  }

  function onMouseEnter (id) {
    idH = id
  }

  function onMouseLeave () {
    idH = null
  }

  function onKeyDown (e) {
    cmdOn = e.metaKey || e.ctrlKey
  }

  function onKeyUp () {
    cmdOn = false
  }


</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<div class="wrapper">
  <!-- GLOBAL RANKING -->
  <GlobalRank 
  {nodeH} {idH}
  on:click={e => onClick(e.detail.id)} 
  on:mousemove={e => onMouseEnter(e.detail.id)}
  on:mouseleave={onMouseLeave}
  />

  <div class="inner-wrapper">

    <!-- LEFT PANEL -->
    <div 
    class="left-panel side-panel"
    in:fade={transitions.others}
    >

      <div class="selection-wrapper"
      >
        <IndexBan bind:id={idA} node={nodeA} first={true} 
        on:mouseenter={e => onMouseEnter(e.detail.id)}
        on:mouseleave={onMouseLeave}
        />
        <IndexBan bind:id={idB} node={nodeB} first={false} 
        on:mouseenter={e => onMouseEnter(e.detail.id)}
        on:mouseleave={onMouseLeave}
        />
      </div>

      <div class="source-wrapper">

        <div class="source__header">
          <h4>Gay Travel Index</h4>
          <span>2023</span>
        </div>

        <div class="source__body">
          <p>{$_("source.p.1")}</p>
          <p>{$_("source.p.2")}</p>
          <p>{$_("source.p.3")}</p>
          <p>{$_("source.p.4")}</p>
          <p>{$_("source.p.5")} <a target="_blank" href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/">Spartacus International Gay Guide</a></p>
        </div>

      </div>

    </div>

    <!-- MAIN PANEL -->
    <div class="main-panel">

      <!-- Project title -->
      <h1>
        <span class="avoidwrap">{$_("title.1")}</span>
        <span class="avoidwrap">{$_("title.2")}</span>
      </h1>
    
      <!-- Flag -->
      <div class="main-chart-wrapper">
        <div 
        class="switch-wrapper"
        in:fade={transitions.others}>
          <div class="switch-wrapper-inner">
            <Switch />
          </div>
        </div>
        <Flag 
        {idA} {idB} {idH} {nodeH} {transitions} {showTour} {tourStep}
        on:click={e => onClick(e.detail.id)} 
        on:mouseenter={e => onMouseEnter(e.detail.id)}
        on:mouseleave={onMouseLeave}
        />
      </div>
      

      <!-- Continent caption -->
      <div 
      id="continent-cap-wrapper" 
      class="continent-cap-wrapper"
      in:fade={transitions.others}
      >
        {#each $continents as contId}
          <div 
          class="continent-cap"
          style="opacity: 1;"
          >
            <span style="background-color: {$colors[contId]};" />
            <h5>{$_(contId)}</h5>
          </div>
        {/each}
      </div>

      

    </div>

    <!-- RIGHT PANEL -->
    <div 
    class="right-panel"
    in:fade={transitions.others}
    >
      <Comparison {nodeA} {nodeB} />
    </div>

  </div>

</div>

<Tour bind:showTour bind:currentStepPos={tourStep} nSteps=5>
  
  <div data-target="flag-wrapper" class="tour-step step1">
    <p>{$_("tour.step1")}</p>
  </div>
  <div data-target="continent-cap-wrapper" class="tour-step step2">
    <p>{$_("tour.step2")}</p>
  </div>
  <div data-target="flag-wrapper" class="tour-step step3">
    <p>{$_("tour.step3.1")}</p>
    <p>{$_("tour.step3.2")}</p>

    <div class="colobar-wrapper">
      <h5>GTI</h5>
      <ColorBar {nodeH} />

      <div class="xticklabels">
        <span>{$_("tour.risky")}</span>
        <span>{$_("tour.safer")}</span>
      </div>

    </div>

  </div>
  <div data-target="ban-wrapper" class="tour-step step4">
    <p>{$_("tour.step4")}</p>
    <img src={$locale.slice(0, 2) == 'en' ? ImgBanRectEN : ImgBanRectBR} alt=""/>
  </div>
  <div data-target="comparison-wrapper" class="tour-step step5">
    <p>{$_("tour.step5")}</p>
    <Category />
  </div>
</Tour>

<style>

  .tour-step.step4 > img {
    margin: 0 auto;
    aspect-ratio: 465/230;
    width: 100%;
  }

  .tour-step.step3 .colobar-wrapper {
    margin: 1rem 0;
  }

  .tour-step.step3 .colobar-wrapper .xticklabels {
    display: flex;
    justify-content: space-between;
  }

  .tour-step.step3 .colobar-wrapper .xticklabels span {
    font-weight: 400;
    color: var(--text-gray);
    margin: .5rem 0;
  }

  .wrapper {
    width: 100vw;
    height: 100vh;
  }
  

  .inner-wrapper {
    position: relative;
    max-width: 2600px;
    height: 100%;
    margin: 0 auto;
    display: grid;
    padding: 5.4rem 1rem 1rem 2rem;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: minmax(0, 1fr);
    gap: 1rem;
    overflow: auto;
  }


  .continent-cap-wrapper {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .continent-cap {
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: visible;
    margin: 0;
    gap: .4rem;
    
    color: var(--text-gray);
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .continent-cap > span {
    aspect-ratio: 1/1;
    width: 1rem;
  }

  .continent-cap h5 {
    font-weight: 400;
    display: inline;
  }


  .side-panel {
    padding-top: 2rem;
  }

  .left-panel {
    grid-column: 1/3;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12%;

    margin-bottom: 4rem;
  }

  .selection-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 2.2rem;
  }

  .source-wrapper {
    border-top: 2px solid var(--line-gray);
    padding: .85rem 0;
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
    max-height: 60%;
    overflow: hidden;

    display: flex;
    flex-direction: column;

    flex-shrink: 1;
  }

  .source__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    margin: 0 1rem;

    font-family: 'Signika Negative', sans-serif;
  }

  .source__header > h4 {
    font-weight: 400;
  }

  .source__body {
    flex-shrink: 1;
    flex-grow: 0;
    min-height: 0;
    overflow: auto;
    padding: 1rem;
  }

  .main-panel {
    grid-column: 4/8;
    min-width: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 3.6rem;
  }

  .right-panel {
    grid-column: 8/11;
  }

  .main-panel > h1 {
    font-family: 'Braah One', sans-serif;
    text-transform: uppercase;
    font-size: clamp(36px, calc(2.25rem + ((1vw - 12.8px) * 1.8519)), 76px);
    min-height: 0vw;
    text-align: center;
    line-height: 85%;
    color: var(--text-gray);
  }

  .main-chart-wrapper {
    position: relative;
    margin: 2rem 0;
    gap: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  
  span.avoidwrap {
    display: inline-block;
    white-space: nowrap;
  }



</style>