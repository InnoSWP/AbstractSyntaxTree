<script lang="ts">
  import Tailwind from "./Tailwind.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import TreeRepresentation from "./TreeRepresentation.svelte";
  import ArrayRepresentation from "./ArrayRepresentation.svelte";
  import Stores from "./Stores.svelte";
  import Modal from "./Modal.svelte";
  import { Modals, closeModal, openModal} from 'svelte-modals';
  import type { Program } from "esprima";
  import type { EditorView } from '@codemirror/view';
  import MarkerPlugin from "./MarkerPlugin.svelte";
  import Menu from "./CustomContextMenu/Menu.svelte";
  import { contextMenu } from "./Stores.svelte";
  import { compress, decompress } from 'lzw-compressor';
  import { generateGraphviz } from "./Tree/treeExport"
  import ConstantFolderPlugin from "./ConstantFolderPlugin.svelte";
  import { saveAs } from 'file-saver';

  let view: EditorView = null
  let tree: Program
  $: _view = view

  const params = new URLSearchParams(window.location.search)

  let doc: string = `console.log(a+b)`
  if(params.has('program')) {
    let decoded: string = decompress(params.get('program'));
    doc = decoded
  }

  // Function to show share dialog to user
  function openShare() {
    let raw: string = view.state.doc.toString();
    let encoded: string = encodeURIComponent(compress(raw));
    console.log(encoded);
    let url: string = new URL(`?program=${encoded}`, window.location.href).toString();
    openModal(Modal, {
      "title": "Share this code with others!",
      "link": url,
    })
  }
  
  // Function to close context menu
  function closeContextMenu() {
    contextMenu.set([[],{x:0,y:0}])
  }

  let contextMenuOptions: {title:string,callback: () => void}[], contextMenuPosition:{x:number,y:number}
  $: [contextMenuOptions, contextMenuPosition] = $contextMenu
  
    async function Download(tree: Program) {
      var blob = new Blob([generateGraphviz(tree)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "AST.dot");
    }
  
</script>

<script lang="ts" context="module">

  export let _view: EditorView = null


</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon.gif">
</svelte:head>
<Tailwind />
<Stores />
<MarkerPlugin />
<ConstantFolderPlugin />
<Modals>
  <div slot="backdrop" class="backdrop" on:click={closeModal}/>
</Modals>

<div class="h-screen flex items-stretch">
  <div class="h-screen w-4/12 flex code-container">
      <CodeMirror bind:view bind:tree bind:doc />

      <div class="absolute bottom-0 bg-treebg w-4/12">
        <button on:click={openShare} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 m-2 rounded">
          Share
        </button>
        <button on:click={() => Download(tree)} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 m-2 rounded">
          Export
        </button>
      </div>
  </div>

  <div class="h-screen w-4/12 bg-treebg">
     <TreeRepresentation bind:tree />
  </div>

  <div class="h-screen w-4/12">
     <ArrayRepresentation bind:tree />
     <div class="absolute bottom-0 bg-treebg w-4/12">
        <iframe src="https://ghbtns.com/github-btn.html?user=innoswp&repo=asbtractsyntaxtree&type=star&count=true&size=large" frameborder="0" scrolling="0" width="170" height="30" title="GitHub"></iframe>
      </div>
  </div>


  {#if contextMenuOptions.length > 0}
    <Menu {...contextMenuPosition} options={contextMenuOptions}  on:click={closeContextMenu} on:clickoutside={closeContextMenu}/>
  {/if}

</div>

<style lang="postcss">
  :global(html, body) {
    height: 100vh;
  }

  .code-container {
    height: calc(100% - 48px);
  }

  .backdrop {
    @apply fixed top-0 bottom-0 left-0 right-0 z-40;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
