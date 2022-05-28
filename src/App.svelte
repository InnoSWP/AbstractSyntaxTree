<script lang="ts">
  import Button from "./Button.svelte";
  import Logo from "./Logo.svelte";
  import Tailwind from "./Tailwind.svelte";
  import CodeMirror from "./CodeMirror.svelte";

  let view
  let tree
  $: console.log(tree)
</script>

<Tailwind />

<div class="h-full flex items-stretch">
  <CodeMirror classes="h-full w-1/3" bind:view bind:tree/>
  
  <div class="h-full w-1/3">
    <div class="bg-gray-200 px-4 py-2 rounded">Hello Tailwind!</div>
    <Button>A Button</Button>
    <Logo name={"A Logo"} />
  </div>
  <div class="h-full w-1/3">
    <div class="bg-gray-200 px-4 py-2 rounded">Hello Tailwind!</div>
    <Button>A Button</Button>
    <Logo name={"A Logo"} />
  </div>
</div>

<style lang="postcss">
  :global(html, body) {
    height: 100%;
  }
</style>