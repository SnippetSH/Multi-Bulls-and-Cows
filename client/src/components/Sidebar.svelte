<script lang="ts">
  import { onDestroy } from "svelte";
  import { gameResult, numberBoxes } from "../store";
    
  import type { Data, Box } from "../types";

  export let socket: WebSocket;
  
  let boxes: Box[];
  let datas: Data[];
  const boxesUnsubscribe = numberBoxes.subscribe(value => {
    boxes = value;
  })
  const datasUnsubscribe = gameResult.subscribe(value => {
    datas = value;
  })

  onDestroy(() => {
    datasUnsubscribe();
    boxesUnsubscribe();
  })

  function onSend() {
    if (socket.readyState === WebSocket.OPEN) {
      const boxNumbers = boxes.map(box => box.number);
      
      if (boxNumbers.includes(-1)) {
        return;
      }

      const sendValue = boxNumbers.join("");
      socket.send(sendValue);
    }
  }
</script>

<div
  class="absolute right-10 w-40 h-96 flex flex-col justify-center items-center"
>
  <div
    class="border-2 border-[#FFE5E5] rounded-lg w-40 h-80 flex flex-col justify-center items-center"
  >
    {#if datas.length !== 0}
      {#each datas as data (data.id)}
        <div
          class="w-full h-10 flex justify-center items-center border-b-2 border-[#FFE5E5]"
        >
          <p class="text-sm font-bold text-center text-[#918282]">
            {data.value}:&nbsp&nbsp
          </p>
          <p class="text-base font-bold text-center">
            {data.strike}S {data.ball ? data.ball : 0}B
          </p>
        </div>
      {/each}
    {/if}
  </div>

  <div>
    <button
      class="button-animation w-20 h-12 hover:scale-97 hover:translate-y-[0.1rem] bg-[#FFD1E1] border-2 border-[#FFE5E5] hover:bg-[#FFBCD3] rounded-lg m-1.5 flex justify-center items-center"
      on:click={() => onSend()}
    >
      <p class="text-lg font-bold text-center">전송</p>
    </button>
  </div>
</div>
