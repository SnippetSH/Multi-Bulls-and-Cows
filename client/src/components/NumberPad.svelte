<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { get } from "svelte/store";
  import { numberPads, numberBoxes, number5Clicked, cursor } from "../store";
  
  import type { Box } from "../types";
  
  let currentCursor: number;
  const cursorUnsubscribe = cursor.subscribe(value => {
    currentCursor = value;
  })

  let pads: Box[], boxes: Box[];
  const boxesUnsubscribe = numberBoxes.subscribe(value => {
    boxes = value;
  })
  const padsUnsubscribe = numberPads.subscribe(value => {
    pads = value;
  })

  function onClickPad(pad: Box) {
    const temp = [...boxes];

    currentCursor = get(cursor);
    // console.log(currentCursor);
    if(pad.number === 5) {
      number5Clicked.update(value => value+1);
      console.log(get(number5Clicked));
    }

    if (currentCursor < 9 && !pad.isClicked) {
      pad.isClicked = true;
      const tempPad = [...pads];

      numberPads.set(tempPad);

      temp[currentCursor].number = pad.number;
      currentCursor++;
    }

    numberBoxes.set(temp);
    cursor.set(currentCursor);
  }

  function onDelPad() {
    const temp = [...boxes];
    const tempPad = [...pads];

    currentCursor = get(cursor);
    if (currentCursor > 0) {
      tempPad.forEach(pad => {
        if (pad.number === temp[currentCursor-1].number) {
          pad.isClicked = false;
        }
      })
      temp[currentCursor-1].number = -1;
      currentCursor--;
    }

    numberPads.set(tempPad);
    numberBoxes.set(temp);
    cursor.set(currentCursor);
  }

  function handleKeyDown(e: KeyboardEvent) {
    // console.log(e.key);
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      onDelPad();
      return;
    }
    let pressedKey = Number(e.key);
    const pad = pads.find(pad => pad.number === pressedKey);
    if (pad) onClickPad(pad);
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
  })

  onDestroy(() => {
    boxesUnsubscribe();
    padsUnsubscribe();
    cursorUnsubscribe();

    window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<div class="number-pad-grid">
  {#each pads as pad (pad.id)}
    <div class:zero={pad.number === 0}>
      {#if pad.id !== 2307}
      <button 
        class="font-bold text-3xl text-center w-16 h-16 flex justify-center items-center border-2 rounded-md border-[#FFE5E5] "
        class:button-pad-animation={!pad.isClicked}
        class:clicked-pad={pad.isClicked}
        on:click={() => onClickPad(pad)}
      >{pad.number}</button>
      {:else}
      <button 
        class="button-animation font-bold text-3xl text-center w-16 h-16 flex justify-center items-center bg-[#FF6F6F]/85 hover:bg-[#FF6F6F] hover:scale-95 hover:translate-y-0.5 border-2 rounded-md border-[#FFE5E5]"
        on:click={() => onDelPad()}
      >⌫</button>
      {/if}
    </div>
  {/each}
</div>

<style>
  .number-pad-grid {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, auto);
    gap: 1rem;
  }
  .zero {
    grid-column: 2;
    /* background-color: black; */
  }

  .clicked-pad {
    background-color: #ffe4e4;
    transform: scale(1) translateY(0);
    transition: all 0.2s ease-in-out;
  }

  .button-pad-animation {
    transition: all 0.2s ease-in-out;
  }

  .button-pad-animation:hover {
    transform: scale(0.95) translateY(0.5px);
    background-color: #fff5fe;
  }
</style>
