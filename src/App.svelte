<script lang="ts">
  import Button from "./Button.svelte";
  import Logo from "./Logo.svelte";
  import Tailwind from "./Tailwind.svelte";
</script>

<Tailwind />
<main class="container mx-auto">
  <div class="bg-gray-200 px-4 py-2 rounded">Hello Tailwind!</div>
  <Button>A Button</Button>
  <Logo name={"A Logo"} />
</main>
