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

<div class="flex #FF6F6F mw-400:grid">
  {#each boxes as box (box.id)}
    <div
      class="box-animation mw-400 bg-[#FFD1D1] border-2 border-[#FFE5E5] rounded-lg m-1.5 flex justify-center items-center"
      class:more-saturation={box.number !== -1}
    >
      {#if box.number !== -1}
        <p
          class="mw-400 font-bold text-center"
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

  @media (max-width: 400px) {
    .mw-400\:grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
    }

    .mw-400 {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 3rem;
      height: 3rem;
      font-size: 1.2rem;
    }

  }

  @media (min-width: 400px) {
    .mw-400 {
      width: 5rem;
      height: 5rem;
      font-size: 2.5rem;
    }
  }
</style>
