<script>
  import { _ } from "svelte-i18n";
  import { emphasized } from "./stores/global";

  function toggleEmphasis(e) {
    emphasized.set(e.target.checked)
  }

</script>

<label class="switch">
  <input 
  type="checkbox" 
  checked={$emphasized}
  on:click={toggleEmphasis}
  >
  <div>
    <span></span>
  </div>
  <p>{$_("flag.emphasize")}</p>
</label>

<style>
  /* https://codepen.io/aaroniker/pen/rNNLQVe?editors=1100 */
  .switch {
    --line: var(--line-gray);
    --dot: var(--text-black);
    --circle: var(--text-gray);
    --duration: .3s;
    --text: #9EA0BE;
    cursor: pointer;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5em;
  }

  .switch input {
    display: none;
  }

  .switch input + div {
    position: relative;
  }

  .switch input + div:before,
  .switch input + div:after {
    --s: 1;
    content: '';
    position: absolute;
    height: 4px;
    top: 10px;
    width: 24px;
    background: var(--line);
    transform: scaleX(var(--s));
    transition: transform var(--duration) ease;
  }

  .switch input + div:before {
    --s: 0;
    left: 0;
    transform-origin: 0 50%;
    border-radius: 2px 0 0 2px;
  }

  .switch input + div:after {
    left: 28px;
    transform-origin: 100% 50%;
    border-radius: 0 2px 2px 0;
  }

  .switch input + div span {
    padding-left: 56px;
    line-height: 24px;
    color: var(--text);
  }

  .switch input + div span:before {
    --x: 0;
    --b: var(--circle);
    --s: 4px;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 24px;
    height: 24px;
    border-radius: 0;
    box-shadow: inset 0 0 0 var(--s) var(--b); 
    transform: translateX(var(--x));
    transition: box-shadow var(--duration) ease, transform var(--duration) ease;
  }

  .switch input + div span:not(:empty) {
    padding-left: 64px;
  }

  .switch input:checked + div:before {
    --s: 1;
  }

  .switch input:checked + div:after {
    --s: 0;
  }

  .switch input:checked + div span:before {
    --x: 28px;
    --s: 12px;
    --b: var(--dot);
  }

  .switch p {
    margin: 0;
  }

  
</style>