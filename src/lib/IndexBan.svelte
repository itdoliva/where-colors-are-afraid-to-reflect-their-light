<script>
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { _, locale } from 'svelte-i18n'
  import { toOrdinal } from './utils/toOrdinal'
  import { scales } from "./stores/global";
  import Dropdown from './Dropdown.svelte';

  export let id
  export let node
  export let first = true
  

  const dispatch = createEventDispatcher()

  $: rectColor = node ? `background: ${$scales[node.continentId](node.score)};` : ''

</script>


<div id="ban-wrapper" class="ban-wrapper">

  <div class="ban-container" class:bottom={!first} style={rectColor}>

    <span class="ban-mark"/>

    {#if node}

      <div transition:fade={{ duration: 150 }} class="ban-ranks">
        <span class="number">{@html toOrdinal(node.rank, $locale)}</span>
        <span class="number">{@html toOrdinal(node.rankContinent, $locale)}</span>
      </div>

      <div transition:fade={{ duration: 150 }} class="ban-gti number" class:neg-number={node.score < 0}>
        {Math.abs(node.score)}
      </div>

    {/if}

  </div>

  <div class="dropdown-wrapper">
    <Dropdown 
    {node} 
    bind:id={id} 
    on:mouseenter={e => dispatch('mouseenter', { id: e.detail.id })}
    on:mouseleave={() => dispatch('mouseleave')}
    />

    <p class="instruction">
      {@html $_("instruction", { values: { 
        command: !first ? 'Ctrl / ⌘ + ' : ''
      }})}
    </p>

  </div>

</div>



<style>

  .ban-wrapper {
    width: 100%;
    display: grid;
    gap: .8em;
    grid-template-columns: 33% minmax(0, 1fr);
  }


  .ban-container {
    position: relative;
    background: var(--gray-out);
    aspect-ratio: 1/1;
    color: var(--off-white);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.15);
  }

  .ban-container .ban-ranks {
    position: absolute;
    bottom: 10%;
    left: 0;
    right: 0;
    padding: 0 7.5%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    font-weight: 600;
    min-height: 0vw;
  }

  .ban-container.bottom .ban-ranks {
    top: 10%;
  }

  .ban-container .ban-ranks > span {
    font-size: .85em;
  }


  .ban-mark {
    position: absolute;
    top: 10%;
    left: 17.5%;
    right: 17.5%;
    height: 4px;
    background-color: var(--off-white);
    opacity: .8;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  }
  
  .ban-container.bottom .ban-mark  {
    bottom: calc(10%);
    top: auto;
  }

  .ban-gti {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

    font-size: 2.4em;
    min-height: 0vw;
    letter-spacing: -0.055em;
    line-height: 1em;
  }

  .ban-gti.neg-number::before {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-130%, -50%);
    content: '-';
  }



  .dropdown-wrapper {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: stretch;
  }



  .instruction {
    margin: .5rem 0 0 0;
    color: var(--text-gray);
    font-size: .7em;
  }

</style>