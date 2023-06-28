<script>
  import "@fontsource-variable/open-sans";
  import "@fontsource-variable/signika";
  import "@fontsource-variable/signika-negative";
  import "@fontsource/braah-one";

  import { register, init, getLocaleFromNavigator, isLoading, _, locale } from "svelte-i18n";
  import Spinner from "../lib/Spinner.svelte";

  export const prerender = true;

  register('en', () => import('../i18n/en.json'));
  register('en-us', () => import('../i18n/en.json'));
  register('pt', () => import('../i18n/br.json'));
  register('pt-br', () => import('../i18n/br.json'));

  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
  });

  $: title = $locale 
    ? $_("title.1") + " " + $_("title.2") 
    : 'Where Colors are Afraid to Reflect their Light'

  
</script>



<svelte:head>
   <title>{title} | Italo Doliva</title>
</svelte:head>

{#if $isLoading}
  <Spinner />
{:else}
  <slot></slot>
{/if}


<style>
  :global(*) {
    --black: #1F1E1D;
    --text-black: #343331;
    --text-gray: #696863;
    --off-white: #EFEFEE;
    --off-white-light: #FAFAF9;
    --line-gray: #A1A09C;
    --gray-out: #E3E3E3;

    box-sizing: border-box;
    font-family: 'Signika', sans-serif;
  }

  :global(:root) {
    font-size: clamp(12.6px, calc(0.7875rem + (22 - 12.6) * ((100vw - 1280px) / (3440 - 1280))), 22px);
  }

  :global(body) {
    margin: 0;
    padding: 0;
    background-color: var(--off-white);
    color: var(--text-black);
  }
  
  :global(h1, h2, h3, h4, h5, h6) {
    margin: 0;
  }

  :global(h3) {
    font-size: 1.6rem;
  }

  :global(h4) {
    font-size: 1.2rem;
  }

  :global(h5) {
    font-size: .85rem;
  }

  :global(span) {
    font-family: inherit;
    text-transform: inherit;
    font-size: inherit;
    text-align: inherit;
  }

  :global(p) {
    font-weight: 300;
    font-size: 1rem;
    min-height: 0vw;
    color: var(--text-black);
    line-height: 130%;
  }

  :global(.number) {
    font-family: 'Open Sans', sans-serif;
  }

  :global(.number sup) {
    font-weight: 400;
    font-size: .7em;
    margin-left: .05em;
  }

  :global(a) {
    display: inline-block;
    font-weight: 500;
    color: var(--text-gray);
    text-decoration: none;
    padding: .2em .3em;
    background: rgba(31, 30, 29, 0.05);
    cursor: default;
  }

  :global(a:hover) {
    background: rgba(31, 30, 29, .85);
    color: var(--off-white);
  }

  :global(.button) {
    background: rgba(31, 30, 29, 0.05);
    color: var(--text-gray);
    text-transform: uppercase;
    width: 10rem;
    height: 2rem;
    outline: none;
    border: none;
    z-index: 1000;
    font-size: 1rem;
  }

  :global(.button:hover) {
    background: rgba(31, 30, 29, .85);
    color: var(--off-white);
  }

  :global(.dis-none) {
    display: none !important;
  }

  :global(::-webkit-scrollbar) {
    width: .3rem;
  }
    
  :global(::-webkit-scrollbar-thumb) {
    background-color: var(--line-gray);
  }

  </style>