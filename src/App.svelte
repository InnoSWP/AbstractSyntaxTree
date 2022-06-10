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
  import {contextMenu} from "./Stores.svelte";
import ConstantFolderPlugin from "./ConstantFolderPlugin.svelte";

  let view: EditorView = null
  let tree: Program
  $: _view = view

  const params = new URLSearchParams(window.location.search)

  let doc: string = `console.log(a+b)`
  if(params.has('program')) {
    let decoded: string = window.atob(params.get('program'))
    doc = decoded
  }

  function openShare() {
    let raw: string = view.state.doc.toString()
    let encoded: string = window.btoa(raw)
    let url: string = new URL(`?program=${encoded}`, window.location.href).toString()
    openModal(Modal, {
      "title": "Share this code with others!",
      "link": url,
    })
  }

  function closeContextMenu() {
    contextMenu.set([[],{x:0,y:0}])
  }


  let contextMenuOptions: {title:string,callback: () => void}[], contextMenuPosition:{x:number,y:number}
  $: [contextMenuOptions, contextMenuPosition] = $contextMenu
</script>

<script lang="ts" context="module">

  export let _view: EditorView = null


</script>

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
      </div>
  </div>
  
  <div class="h-screen w-4/12 bg-treebg">
     <TreeRepresentation bind:tree />
  </div>

  <div class="h-screen w-4/12">
     <ArrayRepresentation bind:tree />
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