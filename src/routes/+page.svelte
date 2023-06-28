<script>
  import { _, locale } from "svelte-i18n";
  import { fade } from 'svelte/transition';

  import { colors, data, continents } from '$lib/stores/global'

  import Category from "$lib/Category.svelte"
  import Flag from '$lib/Flag.svelte'
  import IndexBan from '$lib/IndexBan.svelte'
  import GlobalRank from '$lib/GlobalRank.svelte';
  import Comparison from '$lib/Comparison.svelte';
  import Switch from '$lib/Switch.svelte';
  import ColorBar from '$lib/ColorBar.svelte';
  import Tour from "$lib/Tour.svelte";
  
  import ImgBanRectEN from "$lib/assets/banrect-en.png"
  import ImgBanRectBR from "$lib/assets/banrect-br.png"

  let width = 0
  let showTour = false

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

  function swapLocation() {
    locale.update(cur => cur.slice(0, 2) === 'en' ? 'pt' : 'en')
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

<svelte:head>
   <title>
      {$locale 
        ? $_("title.1") + " " + $_("title.2") 
        : 'Where Colors are Afraid to Reflect their Light'}
       | Italo Doliva
    </title>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-YN3X31E9D5"></script>

    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-YN3X31E9D5');
    </script>

</svelte:head>

<svelte:window 
  bind:innerWidth={width} 
  on:keydown={onKeyDown} 
  on:keyup={onKeyUp} 
/>



<div class="root">

  {#if width >= 768}

  <div class="app">

    <!-- GLOBAL RANKING -->
    <GlobalRank 
    {nodeH} {idH}
    on:click={e => onClick(e.detail.id)} 
    on:mousemove={e => onMouseEnter(e.detail.id)}
    on:mouseleave={onMouseLeave}
    />
    
    <div class="app-grid">
  
      <!-- LEFT PANEL -->
      <div 
      class="side-panel left"
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
  
          <div class="source-header">
            <h4>Gay Travel Index</h4>
            <span>2023</span>
          </div>
  
          <div class="source-body">
            <p>{$_("source.p.1")}</p>
            <p>{$_("source.p.2")}</p>
            <p>{$_("source.p.3")}</p>
            <p>{$_("source.p.4")}</p>
            <p>
              {$_("source.p.5")} 
              <a target="_blank" href="https://spartacus.gayguide.travel/blog/spartacus-gay-travel-index/">Spartacus International Gay Guide</a>
            </p>
          </div>
  
        </div>
  
        <div class="buttons-wrapper">
          <button class="button" on:click={() => showTour = true}>
            {$_("button.tour")}
          </button>
          <button class="button" on:click={swapLocation}>
            {$_("language.name")}
          </button>
        </div>
  
      </div>
  
      <!-- MAIN PANEL -->
      <div class="main-panel">
  
        <h1>
          <span class="avoidwrap">{$_("title.1")}</span><br/>
          <span class="avoidwrap">{$_("title.2")}</span>
        </h1>
      
        <div class="chart-wrapper">

          <div 
          class="switch-wrapper"
          in:fade={transitions.others}
          >
            <div class="switch-inner">
              <Switch />
            </div>

          </div>
        
          <Flag 
          {idA} {idB} {idH} {nodeH} {transitions} {showTour} {tourStep}
          on:click={e => onClick(e.detail.id)} 
          on:mouseenter={e => onMouseEnter(e.detail.id)}
          on:mouseleave={onMouseLeave}
          />

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
                <span class="continent-square" style="background-color: {$colors[contId]};" />
                <p class="continent-name">{$_(contId)}</p>
              </div>
            {/each}
          </div>

        </div>
        
        <div class="credits-wrapper">
          <p>
            {$_("credits")}
            <a target="_blank" href="https://italodoliva.com.br">Italo Doliva</a>
          </p>
        </div>

  
  
      </div>
  
      <!-- RIGHT PANEL -->
      <div 
      class="side-panel right"
      in:fade={transitions.others}
      >
        <Comparison {nodeA} {nodeB} />
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

  </div>

  {:else}

  <div class="nosup-wrapper">

    <div class="nosup-bg">
      {#each Object.values($colors) as color}
        <span style="background-color: {color};" />
      {/each}
    </div>
  
    <div class="nosup-wrapper-inner">
      <div class="nosup-text">
        <h3>{$_("nosup.1")}</h3>
        <h3>{$_("nosup.2")}</h3>
        <h3>🏳️‍🌈</h3>
      </div>
    </div>  
  
    
  </div>

  {/if}



</div> 


<style>


  .root {
    position: relative;
    margin: 0;
    min-width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app-grid {
    position: relative;
    height: 100vh;
    width: 100%;
    max-width: 2600px;
    margin: 0 auto;
    display: grid;
    padding: 5.4rem 1rem 1rem 2rem;
    grid-template-columns: repeat(10, 1fr);
    gap: .4em;
    overflow: auto;
  }


  /* ////////////////////////////////// */
  /* /////////// LEFT PANEL /////////// */
  /* ////////////////////////////////// */
  
  .side-panel.left {
    grid-column: 1/3;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    gap: 2em;
    overflow: hidden;
  }

  .selection-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1.2em;
  }

  .source-wrapper {
    padding: .85rem 0;
    background: rgba(255, 255, 255, 0.3);
    border-top: 2px solid var(--line-gray);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);
    overflow: hidden;

    display: flex;
    flex-direction: column;

    flex-shrink: 1;
  }

  .source-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    margin: 0 1rem;

    font-family: 'Signika Negative', sans-serif;
  }

  .source-body {
    flex-shrink: 1;
    flex-grow: 0;
    min-height: 0;
    overflow: auto;
    padding: 1rem;
  }

  .buttons-wrapper {
    display: flex;
    flex-direction: column;
    gap: .75rem;
  }


  /* /////////////////////////////////// */
  /* /////////// RIGHT PANEL /////////// */
  /* /////////////////////////////////// */


  .side-panel.right {
    grid-column: 8/11;
  }



  /* ////////////////////////////////// */
  /* /////////// MAIN PANEL /////////// */
  /* ////////////////////////////////// */

  .main-panel {
    grid-column: 4/8;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .main-panel > h1 {
    text-align: center;
  }

  .chart-wrapper {
    position: relative;
    gap: .8rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }

  .continent-cap-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    column-gap: 1em;
    row-gap: .3em;
  }

  .continent-cap {
    display: flex;
    flex-direction: row;
    align-items: center;

    margin: 0;
    gap: .4em;
    color: var(--text-gray);
    text-transform: uppercase;
  }

  .continent-cap .continent-square {
    aspect-ratio: 1/1;
    width: 1em;
  }

  .continent-cap .continent-name {
    font-weight: 400;
    margin: 0;
  }


  .credits-wrapper {
    width: 100%;
    text-align: center;
  }

  .credits-wrapper > p {
    text-align: center;
    margin: 0;
  }





  /* ////////////////////////////////// */
  /* /////////// NO SUPPORT /////////// */
  /* ////////////////////////////////// */

  .nosup-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: stretch;
    background-color: red;
  }

  .nosup-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    backdrop-filter: blur(50px);
  }

  .nosup-bg > span {
    flex-grow: 1;
  }

  .nosup-wrapper-inner { 
    z-index: 10;

    flex-grow: 1;
    backdrop-filter: blur(20px);
    
    background-color: rgba(239, 239, 238, 0.2);
    padding: 1.6rem;

  }

  .nosup-text { 
    width: 100%;
    height: 100%;
    background-color: rgba(52, 51, 49, 1);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .nosup-text > h3 {
    margin: .5rem 2rem;
    text-align: center;
    line-height: 130%;
    color: var(--off-white);
  }


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

  

</style>