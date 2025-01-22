<script lang="ts">
  // 메인 색상 : #FFFAFA
  // 버튼 색상 : #FFD1D1
  // 외곽선 색상 : #FFE5E5
  import { onDestroy, onMount } from "svelte";
  import { numberBoxes, numberPads, gameResult, number5Clicked, initStore } from "./store";

  import type { Box, ScoreData, ServerData } from "./types";
  import { NewGame, MainBox, NumberPad, Sidebar } from "./components";
  import githubPng from "./assets/github_logo.png";

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
  let winNumber: string = "";

  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.host;

  let isSocketOpened = false;

  onMount(() => {
    initStore();

    socket = new WebSocket(`${wsProtocol}://${host}`);
    socket.onopen = () => {
      console.log("Connected");
      isSocketOpened = true;
      window.dispatchEvent(new Event('wsopen'));
    };

    window.addEventListener('wsopen', () => {
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
            winNumber = data.data.value;
            
            setTimeout(() => {
              isWin = false;
              initStore();
            }, 1000) 
          }
        } else if (data.type === "bulkscore") {
          gameResult.set(data.data.map((d, i) => ({ type: 'score', data: { ...d, id: i } })));
        }
      };
    }, false);


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
    class="font-bold text-3xl text-center w-screen h-screen bg-[#FFFAFA] flex flex-col justify-center items-center rounded-lg"
    class:disable={!isWin}
  >
    <p>You Win!</p>
    
    <p>Answer: {winNumber}</p>
  </dialog>

  <div id="logo" class="absolute top-3 right-3 flex items-center gap-2">
    <a href="https://github.com/SnippetSH/Multi-Bulls-and-Cows" class="flex items-center gap-2">
      <img src={githubPng} alt="logo" class="w-10 h-10" />
      <p>Bulls & Cows</p>
    </a>
    
  </div>
</div>

<style>
  .disable {
    display: none;
  }
</style>
