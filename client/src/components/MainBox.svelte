<script lang="ts">
  import { onDestroy } from "svelte";
  import { numberBoxes, cursor } from "../store";

  import type { Box } from "../types";
  
  let boxes: Box[];
  let currentCursor: number;
  const boxesUnsubscribe = numberBoxes.subscribe(value => {
    boxes = value;
  })
  const cursorUnsubscribe = cursor.subscribe(value => {
    currentCursor = value;
  })

  onDestroy(() => {
    boxesUnsubscribe();
    cursorUnsubscribe();
  })

  import { fade } from "svelte/transition";
</script>

<div class="flex #FF6F6F">
  {#each boxes as box (box.id)}
    <div
      class="box-animation w-20 h-20 bg-[#FFD1D1] border-2 border-[#FFE5E5] rounded-lg m-1.5 flex justify-center items-center"
      class:more-saturation={box.number !== -1}
    >
      {#if box.number !== -1}
        <p
          class="text-3xl font-bold text-center"
          in:fade
          out:fade={{ duration: 180 }}
        >
          {box.number}
        </p>
      {/if}
    </div>
  {/each}
</div>

<style>
  .more-saturation {
    background-color: #ffbcbc;
  }
</style>
