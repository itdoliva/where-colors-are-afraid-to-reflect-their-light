<script>
	import { _ } from 'svelte-i18n';
  import { range } from 'd3';
	import tourAction from '../utils/tourAction'

	export let showTour = false
	export let currentStepPos = 0
	export let nSteps


	function startStep(stepPos) {
		if (stepPos >= nSteps || stepPos < 0) {
			return reset()
		}
		currentStepPos = stepPos
	}


  function reset() {
		showTour = false
		currentStepPos = 0
	}

	function onNext() {
    startStep(currentStepPos + 1)
	}

	function onBack() {
    startStep(currentStepPos - 1)
	}

	function onSkip() {
    reset()
	}

</script>


{#if showTour}

<div class='tour-backdrop'>

		<div use:tourAction={currentStepPos}>
			
			<div class='tour-spotlight'>

        <div class='tour-prompt' >
				
				<!-- <div class='tour-arrow' /> -->
				
				<div class='tour-body'>

          <div class='tour-nav'>
            {#each range(nSteps) as pos}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-missing-attribute -->
              <!-- svelte-ignore a11y-missing-content -->
              <a 
              class:selected={pos === currentStepPos} 
              on:click={() => startStep(pos)} 
              />
            {/each}
          </div>

					<div class='tour-content'>
            <slot />
					</div>

					<div class='tour-footer'>
						
						<div class='tour-footer-left'>
							
							{#if currentStepPos < nSteps - 1}
								<button on:click={onSkip}>{$_("tour.skip")}</button>
							{/if}
							
						</div>
						
						<div class='tour-footer-right'>
							
							{#if currentStepPos !== 0}
								<button on:click={onBack}>{$_("tour.back")}</button>
							{/if}
							
							<button on:click={onNext}>
                {currentStepPos < nSteps - 1 ? $_("tour.next") : $_("tour.done")}
							</button>
							
						</div>
						
					</div>
					
				</div>

			</div>


      </div>
			
			

		</div>
</div>
{/if}



<style>
	.tour-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999999;
	}

	.tour-spotlight {
		position: fixed;
		box-shadow: 0 0 6px rgba(0, 0, 0, .33), 0 0 0 calc(999vw + 999vh) rgba(0, 0, 0, .5);
		border: 2px solid var(--text-gray, #696863);
    transition: all .3s ease-in-out;
	}

	.tour-prompt {
		position: absolute;
		width: 25em;
		box-shadow: 0 0 6px rgba(0, 0, 0, .33);
    transition: left .3s ease-in-out;
	}

	/* .tour-arrow {
		position: absolute;
		margin-top: .1em;
		border-style: solid;
		border-width: 0 .5em .5em .5em;
		border-color: #334 transparent;
	} */

	.tour-body {
		/* margin-top: .6rem; */
		background: var(--off-white, #EFEFEE);
		border: 2px solid var(--text-gray, #696863);
    padding: .5em .25rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 1rem;
	}

  .tour-nav {
    display: flex;
    justify-content: center;
    gap: .3rem;
  }

  .tour-nav > a {
    width: .75rem;
    height: .75rem;
    background-color: var(--text-black);
    opacity: .35;
    cursor: pointer;

    transform: opacity .15s ease-in-out;
  }

  .tour-nav > a:hover {
    opacity: .65;
  }
  
  .tour-nav > a.selected {
    opacity: 1;
  }

	.tour-content {
		padding: 0 1em;
	}

  :global(.tour-step) {
    display: none;
  }

  :global(.tour-step.active) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  :global(.tour-step > p) {
    font-weight: 300;
    font-size: 1rem;
  }

	.tour-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* padding: .5em .25em; */
	}

	button {
		margin: 0 .25em;
    background: rgba(31, 30, 29, 0.05);
    color: var(--text-black);
    padding: .5rem;
    text-transform: uppercase;
    outline: none;
    border: none;
    font-size: .8rem;
	}

  button:hover {
    background: rgba(31, 30, 29, .85);
    color: var(--off-white);
  }

	:global(.tour-prompt.tour-prompt-top) {
		display: flex;
		flex-direction: column-reverse;
	}

	:global(.tour-prompt.tour-prompt-top>.tour-arrow) {
		border-width: .5em .5em 0 .5em;
		margin-top: 0;
		margin-bottom: .1em;
	}

	:global(.tour-prompt.tour-prompt-top>.tour-body) {
		margin-top: 0;
		margin-bottom: .6em;
	}

	:global(.tour-prompt.tour-prompt-center>.tour-arrow) {
		border-width: 0 .5em;
		margin-top: 0;
		margin-bottom: 0;
	}

	:global(.tour-prompt.tour-prompt-center>.tour-body) {
		margin-top: 0;
		margin-bottom: 0;
	}
</style>
