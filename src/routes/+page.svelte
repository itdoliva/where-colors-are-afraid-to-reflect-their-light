<script>
  import { _, locale } from "svelte-i18n";
  import App from "$lib/App.svelte";
  import { colors } from "$lib/stores/global";

  let width = 0
  let showTour = false

  function swapLocation() {
    locale.update(cur => cur.slice(0, 2) === 'en' ? 'pt' : 'en')
  }


</script>

<svelte:head>
   <title>{$locale 
    ? $_("title.1") + " " + $_("title.2") 
    : 'Where Colors are Afraid to Reflect their Light'} | Italo Doliva</title>
</svelte:head>

<svelte:window bind:innerWidth={width} />

<div 
id="root"
class="root"
>

  <div class="app" class:nodisplay={width<1280}>

    <!-- BUTTONS -->
    <div class="buttons-wrapper">
      <button class="button" on:click={() => showTour = true}>
        {$_("button.tour")}
      </button>
      <button class="button" on:click={swapLocation}>
        {$_("language.name")}
      </button>
    </div>

    <!-- CREDITS -->
    <div class="credits-wrapper">
      <p>
        {$_("credits")}
        <a target="_blank" href="https://italodoliva.com.br">Italo Doliva</a>
      </p>
    </div>

    <App bind:showTour />

  </div>

  <div class="no-support-wrapper" class:nodisplay={width>=1280}>

    <div class="no-support-bg">
      {#each Object.values($colors) as color}
        <span style="background-color: {color};" />
      {/each}
    </div>
  
    <div class="no-support-wrapper-inner">
      <div class="no-support-text">
        <h3>{$_("no-support.1")}</h3>
        <h3>{$_("no-support.2")}</h3>
        <h3>🏳️‍🌈</h3>
      </div>
    </div>  
  
    
  </div>

</div> 


<style>


  .root {
    position: relative;
    margin: 0;
    min-width: 100vw;
    min-height: 100vh;

    overflow-x: hidden;
  }

  .nodisplay {
    display: none !important;
  }

  .buttons-wrapper {
    position: fixed;
    bottom: 1rem;
    left: 2rem;
    display: flex;
    flex-direction: column;
    gap: .75rem;
    z-index: 10;
  }

  .credits-wrapper {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 10;
  }

  .credits-wrapper > p {
    text-align: center;
    margin: 0;
  }

  .no-support-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;

    display: flex;
    align-items: stretch;
    background-color: red;
  }

  .no-support-bg {
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

  .no-support-bg > span {
    flex-grow: 1;
  }

  .no-support-wrapper-inner { 
    z-index: 10;

    flex-grow: 1;
    backdrop-filter: blur(20px);
    
    background-color: rgba(239, 239, 238, 0.2);
    padding: 1.6rem;

  }

  .no-support-text { 
    width: 100%;
    height: 100%;
    background-color: rgba(52, 51, 49, 1);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .no-support-text > h3 {
    margin: .5rem 2rem;
    text-align: center;
    line-height: 130%;
    color: var(--off-white);
  }
</style>