<script>
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n'
  import { continents, data, colors } from "./stores/global";

  export let id = 0
  export let node

  let hidden = true
  let component

  const dispatch = createEventDispatcher()


  $: sorted = [...$data].sort((a, b) => (
    $continents.indexOf(a.continentId) - $continents.indexOf(b.continentId) ||
    $_(a.regionId).localeCompare($_(b.regionId))
  ))
  

  function toggleDropdown () {
    hidden = !hidden
  }

  function selectOption (newId) {
    if (id !== newId) {
      id = newId
    } else {
      id = 0
    }
    toggleDropdown()
  }

  function closeDropdown(e) {
    if (!hidden && !component.contains(e.target)) {
      toggleDropdown()
    }
  }

</script>


<svelte:document on:click={closeDropdown} />

<div 
class="dropdown-wrapper" 
bind:this={component}
>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div 
  class="input" 
  class:input__active={!hidden} 
  on:click={toggleDropdown}
  >

    <div class="placeholder-wrapper">
      {#if !node}
        <p class="placeholder">{$_("region.select")}</p>
      {:else}
        <p class="placeholder continent">{$_(node.continentId)}</p>
        <p class="placeholder region">{$_(node.regionId)}</p>
      {/if}
    </div>

    <svg 
    class="chevron" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 -960 960 960"
    >
      <path d="M480-360 280-559h400L480-360Z"/>
    </svg>

  </div>

  <div 
  class="structure" 
  class:hide={hidden}
  on:mouseleave={() => dispatch('mouseleave')}
  >

    {#each sorted as node}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div 
        id={node.regionId} 
        style="border-color: {$colors[node.continentId]}"
        on:click={e => selectOption(node.regionId)} 
        on:mouseenter={() => dispatch('mouseenter', { id: node.regionId })}
        >
          <p>{$_(node.regionId)}</p>
        </div>

    {/each}
    
  </div>

</div>


<style>
  .dropdown-wrapper {
    position: relative;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    min-height: 0vw;
  }

  /* Input styling */
  .input {
    display: grid;
    grid-template-columns: minmax(0, 1fr) max-content;

    padding: .25rem 0 .25rem .5rem;
    background-color: rgba(255, 255, 255, 0.3);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.05);

    cursor: default;
    transition: background-color .1s ease-in-out;
    
  }

  .input:not(.input__active):hover {
    background-color: rgba(255, 255, 255, .8);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  }

  .input__active {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  }

  .input .chevron {
    fill: var(--text-gray);
    transform: rotate(0);
    width: 1.4em;
    align-self: center;
  }

  .input.input__active .chevron {
    transform: rotate(180deg);
  }

  .placeholder-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    min-height: 2.4em;
    padding: .05em 0;
    gap: .25em;
    font-size: 1em;
  }

  .placeholder {
    color: var(--text-black);
    font-weight: 400;
    margin: 0 .15em;
  }

  .placeholder.continent {
    font-size: .65em;
  }

  /* Dropdown styling */
  .structure {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 100;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    height: 14em;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--off-white-light);
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.25);
  }

  .structure > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 1.1em;
    color: var(--text-black);
    border-left-width: 4px;
    border-left-style: solid;
    transition: border-left-width .15s ease-in-out;
  }

  .structure > div:hover {
    cursor: default;
    border-left-width: 10px;
  }

  .structure > div > p {
    margin: .3em 0;
  }

  .hide {
    display: none;
  }
</style>