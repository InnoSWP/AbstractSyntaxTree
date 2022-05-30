<script lang="ts" context="module">
    import { TransactionSpec, StateEffect, StateField, RangeSet, EditorState, Transaction, RangeSetBuilder } from '@codemirror/state';
    import { Decoration, DecorationSet, ViewPlugin, ViewUpdate, EditorView } from '@codemirror/view';
    import { _view } from './App.svelte'

    export {}

    export let markerUpdate = StateEffect.define<{from: number, to: number}>()

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

    export function highlight(range: {from: number, to: number}) {
        let thisEffectType = markerUpdate
        let eff = thisEffectType.of(range);
        let spec: TransactionSpec = {
        effects: [eff],
        }
        _view.dispatch(spec)
    }

    export function deselectAll() {
        let thisEffectType = markerUpdate
        let eff = thisEffectType.of({from: -1, to: -1});
        let spec: TransactionSpec = {
        effects: [eff],
        }
        _view.dispatch(spec)
    }

    export const markerPlugin = ViewPlugin.fromClass(class {
        decorations: DecorationSet

        constructor(view: EditorView) {
            this.decorations = view.state.field(markerField)
        }

        update(update: ViewUpdate) {
            if(update.transactions.length != 0) {
                this.decorations = update.view.state.field(markerField)
            }
        }
    }, {
        decorations: v => v.decorations
    })
</script>
