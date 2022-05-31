<script lang="ts">
    import TreePrimitive from "./TreePrimitive.svelte";
    import TreeArray from "./TreeArray.svelte";
    import { slide } from 'svelte/transition';
    import type { Node } from 'estree';
    import { arrayHighlight } from "../Stores.svelte";

    export let obj: Node
    export let expanded = true
    let hfrom: number, hto: number, hsrc: string
    $: [[hfrom, hto], hsrc] = $arrayHighlight

    let from: number, to: number, src: string
    $: [from, to] = obj.range

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
        arrayHighlight.set([obj.range, "tree"])
    }

    function handleMouseLeave() {
        arrayHighlight.set([[0, 0], "tree"])
    }
</script>

<li class="entry togglable {expanded ? "open" : ""} {(hfrom <= from) && (to <= hto) && (hsrc == "arr") ? "highlighted" : ""}">
    <span class="value" on:click={toggle} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
        <span class="tokenName nc">
            {obj.type}
        </span>
    </span>
    <span class="prefix p">{' {'}</span>
    {#if expanded}
        <ul class="value-body" transition:slide|local>
            {#each Object.entries(obj) as [k, v]}
                {#if isPrimitive(v)}
                    <TreePrimitive key={k} value={v}/>
                {:else if Array.isArray(v) && k != 'range'}
                    <TreeArray key={k} value={v}/>
                {:else if k != 'range'}
                    <svelte:self obj={v} />
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{'}'}</div>
</li>
