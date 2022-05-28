<script lang="ts">
    import TreeObject from "./TreeObject.svelte";
    import { slide } from 'svelte/transition';

    export let expanded = true
    export let key = "", value = []

    $: console.log(value)

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

    function isObject(val) {
        return typeof val == "object";
    }
</script>

<li class="entry togglable {expanded ? "open" : ""}">
    <span class="key" on:click={toggle}>
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
                    <TreeObject obj={e} />
                {/if}
            {/each}
        </ul>
    {/if}
    <div class="suffix p">{"]"}</div>
</li>