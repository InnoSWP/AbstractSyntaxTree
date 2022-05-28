<script lang="ts">
  import Button from "./Button.svelte";
  import Logo from "./Logo.svelte";
  import Tailwind from "./Tailwind.svelte";
  import CodeMirror from "./CodeMirror.svelte";
  import TreeRepresentation from "./TreeRepresentation.svelte";

  import { TransactionSpec, StateEffect, StateField, RangeSet, EditorState, Transaction, RangeSetBuilder } from '@codemirror/state';
  import { Decoration, DecorationSet } from '@codemirror/view';
  import type { EditorView } from '@codemirror/view';

  let view: EditorView
  let tree
  $: otherView = view

  let defaultDoc: string = 'const a = 1;\nlet f = (x) => {\n   return 0 + a;\n}\nf(2)'
</script>

<script lang="ts" context="module">
  let otherView: EditorView 
  export let markerUpdate = StateEffect.define<{from: number, to: number}>()

  export function highlight(range: {from: number, to: number}) {
    console.log(range)
    let thisEffectType = markerUpdate
    let eff = thisEffectType.of(range);
    let spec: TransactionSpec = {
      effects: [eff],
    }
    otherView.dispatch(spec)
  }

  export function deselectAll() {
    let thisEffectType = markerUpdate
    let eff = thisEffectType.of({from: -1, to: -1});
    let spec: TransactionSpec = {
      effects: [eff],
    }
    otherView.dispatch(spec)
  }

  let markerConfig = {
        create: function(state: EditorState): DecorationSet {
            return RangeSet.empty
        },
        update: function(value: DecorationSet, transaction: Transaction) {
            let dec = Decoration.mark({
                class: "highlighted"
            })
            if(transaction.effects.length == 0) {
                return value;
            }
            let builder = new RangeSetBuilder<Decoration>();
            for(let eff of transaction.effects) {
                if(eff.is(markerUpdate)) {
                    if(eff.value.to < 0) {
                        return RangeSet.empty
                    }
                    
                    let from = eff.value.from, to = eff.value.to
                    builder.add(from, to, dec)
                }
            }

            return builder.finish();
        }
    }
    export let markerField = StateField.define<DecorationSet>(markerConfig);
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