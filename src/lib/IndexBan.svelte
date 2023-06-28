<script>
  import { createEventDispatcher } from 'svelte';
  import { toOrdinal } from '../utils/toOrdinal'
  import { scales } from "../stores/global";
  import { _, locale } from 'svelte-i18n'
  import Dropdown from './Dropdown.svelte';
  import { fade } from 'svelte/transition';

  export let id
  export let node
  export let first = true
  

  const dispatch = createEventDispatcher()

  $: rectColor = node ? `background: ${$scales[node.continentId](node.score)};` : ''

</script>

<div id="ban-wrapper" class="ban-wrapper">

  <div class="ban-wrapper-inside">

    <div class="ban__rect" class:bottom={!first} style={rectColor}>

      <span class="ban__rect--bar"/>

      {#if node}

        <div transition:fade={{ duration: 150 }} class="ban__rect--ranks">
          <span class="number">{@html toOrdinal(node.rank, $locale)}</span>
          <span class="number">{@html toOrdinal(node.rankContinent, $locale)}</span>
        </div>

        <div transition:fade={{ duration: 150 }} class="ban__rect--gti number" class:neg-number={node.score < 0}>
          {Math.abs(node.score)}
        </div>

      {/if}

    </div>

    <div class="ban__text">
      <div class="ban__text--inside">

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

  </div>

</div>


<style>
  .ban-wrapper {
    width: 100%;
  }

  .ban-wrapper-inside {
    width: 100%;
    display: grid;
    gap: 1rem;
    grid-template-columns: 33% minmax(0, 1fr);
  }

  .ban__text--inside {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: stretch;
  }


  .ban__rect {
    position: relative;
    background: var(--gray-out);
    aspect-ratio: 1/1;
    color: var(--off-white);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.15);
  }

  .ban__rect--ranks {
    position: absolute;
    bottom: 10%;
    left: 0;
    right: 0;
    padding: 0 7.5%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;


    font-weight: 600;
    font-size: min(max(11.6px, calc(0.7875rem + (22 - 11.6) * ((100vw - 1280px) / (3440 - 1280)))), 22px);
    min-height: 0vw;
  }

  .ban__rect--ranks > span {
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  }

  .ban__rect.bottom .ban__rect--ranks {
    top: 10%;
  }

  .ban__rect--bar {
    position: absolute;
    top: 10%;
    left: 17.5%;
    right: 17.5%;
    height: 4px;
    background-color: var(--off-white);
    opacity: .8;
  }

  .ban__rect.bottom .ban__rect--bar  {
    bottom: calc(10%);
    top: auto;
  }

  .ban__rect--gti {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);

    font-size: min(max(28px, calc(2rem + (60 - 28) * ((100vw - 1280px) / (3440 - 1280)))), 60px);
    min-height: 0vw;

    letter-spacing: -0.055em;
    line-height: 1em;
  }

  .ban__rect--gti.neg-number::before {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-130%, -50%);
    content: '-';
  }

  .instruction {
    margin: .5rem 0 0 0;
    color: var(--text-gray);
    font-size: .9rem;
  }

</style>