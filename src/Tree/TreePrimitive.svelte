<script lang="ts">
    import {contextMenu} from '../Stores.svelte'
    export let key = "", value = null
    if(typeof value == "string") {
        value = `"${value}"`
    }
    function rightClick(e){
        // let pos = { x: e.clientX, y: e.clientY };
        // let options = [{title:"TreePrimitive sample option",callback:()=>console.log("tree primitive option clicked")}]
        // contextMenu.set([options,pos])
    }
</script>

<li>
    <span class="entry">
        <span class="key"  on:contextmenu|preventDefault={rightClick}>
            <span class="name nb">{key}</span>
            <span class="p">{': '}</span>
        </span>
        <span class="value">
            <span class="s">{value}
            </span>
        </span>
    </span>
</li>



<style lang="postcss"> 
    
</style>
