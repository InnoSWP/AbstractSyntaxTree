<script lang="ts">
  import Tailwind from "./Tailwind.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import TreeRepresentation from "./TreeRepresentation.svelte";
  import ArrayRepresentation from "./ArrayRepresentation.svelte";
  import Stores from "./Stores.svelte";
  import type { Program } from "esprima";
  import type { EditorView } from '@codemirror/view';
import MarkerPlugin from "./MarkerPlugin.svelte";

  let view: EditorView = null
  let tree: Program
  $: _view = view

  let defaultDoc: string = `function inOrderTraversal(tree) {
        function aux(n, depth, current) {
            if(n == null) {
                return;
            }
            let value = extractValue(n);
            current.push([depth, n.type, value, n.range]);
            for(let child of extractChildren(n)) {
                current.concat(aux(child, depth+1, current));
            }
            return current;
        }

        return aux(tree, 0, []);
    }`
</script>

<script lang="ts" context="module">
  export let _view: EditorView = null
</script>

<Tailwind />
<Stores />
<MarkerPlugin />

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