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
  let windowWidth: number = window.innerWidth;

  onMount(() => {
    initStore(windowWidth);

    socket = new WebSocket("ws://seungh.org:3000");
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
            initStore(windowWidth);
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
  class="pretendard bg-[#FFFAFA] w-screen h-screen flex flex-col mw-400 items-center relative"
>
  {#if NewGameTrigger}
    <NewGame {socket} />
  {/if}
  <MainBox />
  <NumberPad {socket} />

  {#if windowWidth > 400}
    <Sidebar {socket} {currentUser}/>
  {:else}
    <div class="absolute bottom-16 w-[10rem] h-[5rem] flex flex-col justify-center items-center border-[1.4px] border-[#FFD1D1] rounded-lg">
      기록지

    </div>
  {/if}

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

  @media (max-width: 400px) {
    .mw-400 {
      gap: 2rem;
      justify-content: start;
      margin-top: 3rem;
    }
  }

  @media (min-width: 400px) {
    .mw-400 {
      gap: 6rem;
      justify-content: center;
    }
  }
</style>
