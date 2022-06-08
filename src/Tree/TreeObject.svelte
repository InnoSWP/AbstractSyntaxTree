<script lang="ts">
    import TreePrimitive from "./TreePrimitive.svelte";
    import TreeArray from "./TreeArray.svelte";
    import { slide } from 'svelte/transition';
    import type { Node } from 'estree';
    import {contextMenu, arrayHighlight } from "../Stores.svelte";
    import Menu from "../CustomContextMenu/Menu.svelte";
    import CodeMirror from "../CodeMirror.svelte";
import type { EditorView } from "@codemirror/basic-setup";

    export let obj: Node
    export let expanded = true
    export let key: string = ""

    export let view: EditorView;

    let hfrom: number, hto: number, hsrc: string
    $: [[hfrom, hto], hsrc] = $arrayHighlight

    let from: number, to: number, src: string
    $: {
        if(obj.range != undefined) {
            [from, to] = obj.range
        } else {
            [from, to] = [0, 0]
        }
    }

    function toggle() {
        expanded = !expanded
    }

    function isPrimitive(val) {
        if(val == null) {
            return true;
        }

        if(typeof val == "object" || Array.isArray(val)) {
            return false;
        }
        
        return true;
    }

    function handleMouseEnter() {
        arrayHighlight.set([[from, to], "tree"])
    }

    function handleMouseLeave() {
        arrayHighlight.set([[0, 0], "tree"])
    }

    function getFoldConstantsFunction():null|(()=>void){
        if (obj.type != "BinaryExpression")
            return null;
        let operator = obj.operator;
        if (obj.left.type == "Literal" && obj.right.type == "Literal"){
            let left = obj.left;
            let right = obj.right;
            return ()=>{
                let evaluatedExpression = JSON.stringify(eval(left.raw+" "+ operator +" "+ right.raw))
                let transaction = view.state.update({changes: {from: left.range[0], to: right.range[1], insert:  evaluatedExpression}})
                view.dispatch(transaction)
                view = view
               };
        }
        return null;
    }

    function rightClick(e){
        let folding = getFoldConstantsFunction();
        if (folding == null)
            return;
        let pos = { x: e.clientX, y: e.clientY };
        let options = [{title:"Fold constants",callback:folding}]
        contextMenu.set([options,pos])
    }

</script>

<li class="entry togglable {expanded ? "open" : ""} {(hfrom <= from) && (to <= hto) && (hsrc == "arr") ? "highlighted" : ""}">
    <span class="value" on:click={toggle} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} on:contextmenu|preventDefault={rightClick}>
        <span class="tokenName nc">
            {obj.type != undefined ? obj.type : key}
        </span>
    </span>

    <span class="prefix p">{' {'}</span>
    {#if expanded}
        <ul class="value-body" transition:slide|local>
            {#each Object.entries(obj) as [k, v]}
                {#if isPrimitive(v)}
                    <TreePrimitive key={k} value={v}/>
                {:else if Array.isArray(v) && k != 'range'}
                    <TreeArray bind:view key={k} value={v}/>
                {:else if k != 'range'}
                    <svelte:self bind:view obj={v} key={k} />
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{'}'}</div>
</li>
