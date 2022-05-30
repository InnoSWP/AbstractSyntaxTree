<script lang="ts">
  import Tailwind from "./Tailwind.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import TreeRepresentation from "./TreeRepresentation.svelte";
  import ArrayRepresentation from "./ArrayRepresentation.svelte";
  import Stores from "./Stores.svelte";
  import type { Program } from "esprima";
  import type { EditorView } from '@codemirror/view';

  let view: EditorView
  let tree: Program
  $: _view = view

  let defaultDoc: string = 'const a = 1;\nlet f = (x) => {\n   return 0 + a;\n}\nf(2)'
</script>

<script lang="ts" context="module">
  export let _view: EditorView 
</script>

<Tailwind />
<Stores />

<div class="h-screen flex items-stretch">
  <CodeMirror classes="h-full w-3/12" bind:view bind:tree doc={defaultDoc} />
  
  <div class="h-screen w-5/12 bg-treebg">
    <TreeRepresentation bind:tree />
  </div>

  <div class="h-screen w-4/12">
    <ArrayRepresentation bind:tree />
  </div>

</div>

<style lang="postcss">
  :global(html, body) {
    height: 100vh;
  }
</style>