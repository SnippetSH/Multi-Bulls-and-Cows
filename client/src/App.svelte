<script lang="ts">
  // 메인 색상 : #FFFAFA
  // 버튼 색상 : #FFD1D1
  // 외곽선 색상 : #FFE5E5
  import { onDestroy, onMount } from "svelte";
  import { numberBoxes, numberPads, gameResult, number5Clicked, initStore } from "./store";

  import type { Box, ScoreData, ServerData } from "./types";
  import { NewGame, MainBox, NumberPad, Sidebar } from "./components";

  let boxes: Box[];
  let pads: Box[];
  let datas: ScoreData[];
  let NewGameTrigger: boolean = false;
  const numb5Unsubscribe = number5Clicked.subscribe((value) => {
    if (value < 0) {
      NewGameTrigger = true;
    } else {
      NewGameTrigger = false;
    }
  })
  const boxesUnsubscribe = numberBoxes.subscribe((value) => {
    boxes = value;
  });
  const padsUnsubscribe = numberPads.subscribe((value) => {
    pads = value;
  });
  const datasUnsubscribe = gameResult.subscribe((value) => {
    datas = value;
  });

  let socket: WebSocket;
  let currentUser: number = 0;
  let isWin: boolean = false;

  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.host;

  onMount(() => {
    initStore();

    socket = new WebSocket(`${wsProtocol}://${host}`);
    socket.onopen = () => {
      console.log("Connected");
    };

    socket.onmessage = (event) => {
      const data: ServerData = JSON.parse(event.data);
      // console.log(data);
      if (!data) return;

      if (data.type === "links") {
        currentUser = data.data.links;
      } else if (data.type === "score") {
        data.data.id = datas.length;
        gameResult.set([...datas, data]);

        if (data.data.strike === 9) {
          isWin = true;
          
          setTimeout(() => {
            isWin = false;
            initStore();
          }, 1000) 
        }
      }
    };

    return () => {
      socket.close();
    };
  });

  onDestroy(() => {
    boxesUnsubscribe();
    padsUnsubscribe();
    datasUnsubscribe();
    numb5Unsubscribe();
  });
</script>

<div
  class="pretendard bg-[#FFFAFA] w-screen h-screen flex flex-col justify-center gap-24 items-center relative"
>
  {#if NewGameTrigger}
    <NewGame {socket} />
  {/if}
  <MainBox />
  <NumberPad />
  <Sidebar {socket} {currentUser}/>

  <dialog 
    open={isWin} 
    class="font-bold text-3xl text-center w-screen h-screen bg-[#FFFAFA] flex justify-center items-center rounded-lg"
    class:disable={!isWin}
  >
    <p>You Win!</p>
  </dialog>
</div>

<style>
  .disable {
    display: none;
  }
</style>
