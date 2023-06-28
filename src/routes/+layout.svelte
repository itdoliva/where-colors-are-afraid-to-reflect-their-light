<script>
  import './styles.css';
  import { register, init, getLocaleFromNavigator, isLoading, _, locale } from "svelte-i18n";
  import Spinner from "$lib/Spinner.svelte";

  register('en', () => import('$lib/i18n/en.json'));
  register('en-us', () => import('$lib/i18n/en.json'));
  register('pt', () => import('$lib/i18n/br.json'));
  register('pt-br', () => import('$lib/i18n/br.json'));

  init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
  });

</script>


{#if $isLoading}
  <Spinner />
{:else}
  <slot></slot>
{/if}