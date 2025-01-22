<script lang="ts">
  // 메인 색상 : #FFFAFA
  // 버튼 색상 : #FFD1D1 
  // 외곽선 색상 : #FFE5E5
  import { onDestroy, onMount } from 'svelte';
  import { numberBoxes, numberPads, gameResult } from './store';
  
  import type { Box, Data } from './types';
  import MainBox from './components/MainBox.svelte';
  import NumberPad from './components/NumberPad.svelte';
  import NewGame from './components/NewGame.svelte';
    import Sidebar from './components/Sidebar.svelte';
  
  let boxes: Box[];
  let pads: Box[];
  let datas: Data[];
  const boxesUnsubscribe = numberBoxes.subscribe(value => {
    boxes = value;
  })
  const padsUnsubscribe = numberPads.subscribe(value => {
    pads = value;
  })
  const datasUnsubscribe = gameResult.subscribe(value => {
    datas = value;
  })
  
  let socket: WebSocket;

  onMount(() => {
    const boxesTemp: Box[] = [];
    const padTemp: Box[] = [];
    for (let i = 1; i <= 9; i++) {
      padTemp.push({ id: i, number: i, isClicked: false });
      boxesTemp.push({ id: i-1, number: -1 });
    } 

    padTemp.push({ id: 0, number: 0, isClicked: false});
    padTemp.push({ id: 2307, number: -1});
    numberBoxes.set(boxesTemp);
    numberPads.set(padTemp);

    socket = new WebSocket("ws://localhost");
    socket.onopen = () => {
      console.log("Connected");
    }

    socket.onmessage = (event) => {
      const data: Data = JSON.parse(event.data);
      console.log(data);
      data.id = datas.length;
      gameResult.set([...datas, data]);
    }

    return () => { 
      socket.close();
    }
  });

  onDestroy(() => {
    boxesUnsubscribe();
    padsUnsubscribe();
    datasUnsubscribe();
  })
  
  
  
</script>

<div class="pretendard bg-[#FFFAFA] w-screen h-screen flex flex-col justify-center gap-24 items-center relative">
  <NewGame {socket} />
  <MainBox />
  <NumberPad />
  <Sidebar {socket} />
</div>
