<script lang="ts">
    export let key = "", value = null
    if(typeof value == "string") {
        value = `"${value}"`
    }
</script>

<li>
    <span class="entry">
        <span class="key">
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
