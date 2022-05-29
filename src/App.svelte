<script lang="ts">
  import Tailwind from "./Tailwind.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import TreeRepresentation from "./TreeRepresentation.svelte";

  import type { EditorView } from '@codemirror/view';

  let view: EditorView
  let tree
  $: _view = view

  let defaultDoc: string = 'const a = 1;\nlet f = (x) => {\n   return 0 + a;\n}\nf(2)'
</script>

<script lang="ts" context="module">
  export let _view: EditorView 
</script>

<Tailwind />

<div class="h-screen flex items-stretch">
  <CodeMirror classes="h-full w-1/3" bind:view bind:tree doc={defaultDoc} />
  
  <div class="h-screen w-1/3 tree">
    <TreeRepresentation tree={tree} />
  </div>


  <div class="h-screen w-1/3">
    <div class="bg-gray-200 px-4 py-2 rounded">A placeholder</div>
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