<script lang="ts">
  import Button from "./Button.svelte";
  import Logo from "./Logo.svelte";
  import Tailwind from "./Tailwind.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import TreeRepresentation from "./TreeRepresentation.svelte";

  let view
  let tree

  let defaultDoc: string = 'const a = 1;\nlet f = (x) => {\nreturn 0 + a;\n}\nf(2)'
</script>

<Tailwind />

<div class="h-screen flex items-stretch">
  <CodeMirror classes="h-full w-1/3" bind:view bind:tree doc={defaultDoc} />
  
  <div class="h-screen w-1/3 tree">
    <TreeRepresentation tree={tree} />
  </div>


  <div class="h-screen w-1/3">
    <div class="bg-gray-200 px-4 py-2 rounded">Hello Tailwind!</div>
    <Button>A Button</Button>
    <Logo name={"A Logo"} />
  </div>

</div>

<style lang="postcss">
  :global(html, body) {
    height: 100vh;
  }

  div.tree {
    background-color: #efefef;
  }
</style>