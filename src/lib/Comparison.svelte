<script>
  import { _ } from 'svelte-i18n'
  import Categories from "./Categories.svelte"
  import { categories } from "./stores/global";

  export let nodeA
  export let nodeB

  let width = 0
  let height = 0

  $: margin = height * .105
  $: yTicks = $categories.map(d => $_(d.id))

</script>

<div 
id='comparison-wrapper'
class='comparison-wrapper'
bind:clientWidth={width}
bind:clientHeight={height}
>

  <div 
  class="y-ticklabels" 
  style="margin: {margin}px 0 0 0;"
  >
    {#each yTicks as yTick}
      <div class="y-ticklabel">
        <p>{yTick}</p>
      </div>
    {/each}

  </div>

  <Categories node={nodeA} {margin} first={true} />
  <Categories node={nodeB} {margin} first={false} />
</div>


<style>
  .comparison-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 1rem 1rem 1rem;

    display: grid;
    grid-template-columns: 44% 1fr 1fr;
    grid-template-rows: 1fr;
    gap: 1rem;
  }

  .y-ticklabels {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-content: flex-end;
    text-align: right;
  }

  .y-ticklabel {
    position: relative;
    flex-grow: 1;
    flex-shrink: 0;
  }

  .y-ticklabel > p {
    position: absolute;
    right: 0;
    top: 0;
    margin: 0;
    display: block;
    width: 100%;
    transform: translate(0, -50%);
    line-height: 110%;
  }


</style>