<script lang="ts">
    import TreeObject from "./TreeObject.svelte";
    import { slide } from 'svelte/transition';
    import { highlight, deselectAll } from '../MarkerPlugin.svelte'
    import { arrayHighlight } from "../Stores.svelte";

    export let expanded: boolean = true
    export let key: string = "", value = []
    $: if(key == 'range') expanded = false;

    function calculateRange(): {from: number, to: number} {
        let from, to
        for(let el of value) {
            if(typeof el != 'object') {
                continue;
            }

            if(!from) {
                from = el.range[0]
            }
            if(!to) {
                to = el.range[0]
            }
            from = Math.min(from, el.range[0])
            to = Math.max(to, el.range[1])
        }

        return {from:from, to:to}
    }

    function toggle() {
        expanded = !expanded
    }

    function isPrimitive(val): boolean {
        if(val == null) {
            return true;
        }

        if(typeof val == "object" || Array.isArray(val)) {
            return false;
        }
        
        return true;
    }

    function isObject(val): boolean {
        return typeof val == "object";
    }

    function handleMouseEnter() {
        let range = calculateRange()
        highlight(range)
        arrayHighlight.set([range.from, range.to])
    }

    function handleMouseLeave() {
        deselectAll()
        arrayHighlight.set([0, 0])
    }
</script>

<li class="entry togglable {expanded ? "open" : ""}">
    <span class="key" on:click={toggle} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
        <span class="name nb">
            {key}
        </span>
        <span class="p">{': '}</span>
    </span>
    <span class="prefix p">{" ["}</span>
    {#if expanded}
        <ul class="value-body" transition:slide|local>
            {#each value as e}
                {#if isPrimitive(e)}
                    <li>
                        <span class="entry">
                            <span class="value">
                                <span class="s">{e}</span>
                            </span>
                        </span>
                    </li>
                {:else}
                    <TreeObject obj={e} expanded={false}/>
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{"]"}</div>
</li>