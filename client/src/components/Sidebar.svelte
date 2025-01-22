<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { gameResult, numberBoxes, number5Clicked, resetBox } from "../store";
    
  import type { GuessData, ScoreData, Box } from "../types";
  import { get } from "svelte/store";

  export let socket: WebSocket;
  export let currentUser: number;
  
  let boxes: Box[];
  let datas: ScoreData[] = [];
  const boxesUnsubscribe = numberBoxes.subscribe(value => {
    boxes = value;
  })
  const datasUnsubscribe = gameResult.subscribe(value => {
    datas = value;
  })

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSend();
      return;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    const temp = [...datas];
    // while(temp.length < 18) {
    //   temp.push({
    //     type: "score",
    //     data: {
    //       id: temp.length,
    //       value: "0000"+temp.length,
    //       strike: 0,
    //       ball: 0
    //     }
    //   })
    // }

    datas = temp;
  })

  onDestroy(() => {
    // datasUnsubscribe();
    boxesUnsubscribe();
    window.removeEventListener('keydown', handleKeyDown);
  })

  function onSend() {
    if (get(number5Clicked) === 5) {
      number5Clicked.set(-1);
    } else {
      number5Clicked.set(0);
    }

    if (socket.readyState === WebSocket.OPEN) {
      const boxNumbers = boxes.map(box => box.number);
      
      if (boxNumbers.includes(-1)) {
        return;
      }

      const data: GuessData = {
        type: 'guess',
        data: {
          guess: boxNumbers.join("")
        }
      };
      socket.send(JSON.stringify(data));

      resetBox();
    }
  }
</script>

<div
  class="absolute right-10 w-[10rem] h-[26rem] flex flex-col justify-center items-center"
>
  <div class="font-bold text-sm">
    <p>Current Connecting: {currentUser}</p>
  </div>
  <div
    class="border-2 border-[#FFE5E5] rounded-lg w-full h-4/5 flex flex-col justify-start items-start overflow-y-auto"
  >
    {#if datas.length !== 0}
      {#each datas as data (data.data.id)}
        <div
          class="w-full h-10 flex justify-center items-center border-b-2 border-[#FFE5E5]"
        >
          <p class="text-sm font-bold text-center text-[#918282]">
            {data.data.value}:&nbsp&nbsp
          </p>
          <p class="text-base font-bold text-center">
            {data.data.strike}S {data.data.ball ? data.data.ball : 0}B
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
