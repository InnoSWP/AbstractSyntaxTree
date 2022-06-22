<script lang="ts">
    import TreePrimitive from "./TreePrimitive.svelte";
    import TreeArray from "./TreeArray.svelte";
    import { slide } from 'svelte/transition';
    import type {  Node } from "../Estree/estreeExtension";
    import {contextMenu, arrayHighlight, constantFolding, highlightStates, nodeIndex } from "../Stores.svelte";
    import CodeMirror from "../CodeMirror.svelte";
    import { get } from "svelte/store";

    export let obj: Node
    export let expanded = true
    export let key: string = ""

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
        $highlightStates[$nodeIndex.get(obj)] = "highlightedRoot"
    }

    function handleMouseLeave() {
        arrayHighlight.set([[0, 0], "tree"])
        clearHighlight()
    }

    function clearHighlight() {
        for (let i = 0; i < get(highlightStates).length; i++)
            $highlightStates[i] = ""
    }

    function getFoldConstantsFunction():null|(()=>void){
        return ()=>{
            constantFolding.set(obj)
        };
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

<li class="entry togglable {expanded ? "open" : ""} {$highlightStates[$nodeIndex.get(obj)]}">
    <span class="value" on:click={toggle} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave} on:contextmenu|preventDefault={rightClick}>
        <span class="tokenName nc">
            {obj.type != undefined ? obj.type : key}
        </span>
    </span>

    <span class="prefix p">{' {'}</span>
    {#if expanded}
        <ul class="value-body" transition:slide|local>
            {#each Object.entries(obj) as [k, v]}
                {#if isPrimitive(v) && k != 'type' && k != 'sourceType'}
                    <TreePrimitive key={k} value={v}/>
                {:else if Array.isArray(v) && k != 'range'}
                    <TreeArray key={k} value={v} parent={obj}/>
                {:else if k != 'range' && k != 'type' && k != 'sourceType'}
                    <svelte:self obj={v} key={k} />
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{'}'}</div>
</li>
