<script lang="ts">
    import axios from 'axios';
  // 메인 색상 : #FFFAFA
  // 버튼 색상 : #FFD1D1 
  // 외곽선 색상 : #FFE5E5
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  interface Box {
    id: number,
    number: number,
  }

  interface Data {
    value: string,
    strike: number,
    balls: number,
  }

  let boxes: Box[] = [];
  let numberPads: Box[] = [];
  let datas: Data[] = [];
  let socket: WebSocket;

  let currentCursor = 0;
  onMount(() => {
    const boxesTemp: Box[] = [];
    const padTemp: Box[] = [];
    for (let i = 1; i <= 9; i++) {
      padTemp.push({ id: i, number: i});
      boxesTemp.push({ id: i-1, number: -1});
    } 

    padTemp.push({ id: 0, number: 0});
    padTemp.push({ id: 2307, number: -1});
    boxes = boxesTemp;
    numberPads = padTemp;

    socket = new WebSocket("ws://localhost");
    socket.onopen = () => {
      console.log("Connected");
    }

    socket.onmessage = (event) => {
      const data: Data = JSON.parse(event.data);
      console.log(data);
      datas = [...datas, data];
    }

    return () => { 
      socket.close();
    }
  });
  
  function onClickPad(padNumber: number) {
    const temp = [...boxes];
    if (currentCursor < 9) {
      temp[currentCursor].number = padNumber;
      currentCursor++;
    }

    boxes = temp;
  }

  function onDelPad() {
    const temp = [...boxes];
    if (currentCursor > 0) {
      temp[currentCursor-1].number = -1;
      currentCursor--;
    }

    boxes = temp;
  }

  function onSend() {
    // 전송 로직
    // 여기서 temp에 Data를 추가

    if (socket.readyState === WebSocket.OPEN) {
      const boxNumbers = boxes.map(box => box.number);
      if (boxNumbers.includes(-1)) {
        return;
      }

      const sendValue = boxNumbers.join("");
      socket.send(sendValue);
    }
  }

  let isNewGameClicked = false;

  function onNewGame() {
    isNewGameClicked = !isNewGameClicked;
  }
</script>

<div class="pretendard bg-[#FFFAFA] w-screen h-screen flex flex-col justify-center gap-24 items-center relative">
  <div class="absolute top-3 left-3 flex justify-center items-center">
    <button class="w-16 h-12 flex justify-center items-center font-bold hover:scale-97 hover:translate-y-[0.1rem] bg-[#FFD1E1] border-2 border-[#FFE5E5] hover:bg-[#FFBCD3] rounded-lg" on:click={() => onNewGame()}>
      새 게임
    </button>
    {#if isNewGameClicked}
      <div class="relative width-24 ml-4 mt-2 box-animation" in:fade={{ duration: 200 }} out:fade={{ duration: 170 }}>
          <input type="text" class="input-label" required>
          <label for="password" class="label-label">Password</label>
          <span class="span-label"></span>
      </div>
    {/if}
  </div>

  <div class="flex #FF6F6F">
    {#each boxes as box (box.id)}
      <div 
        class="box-animation w-20 h-20 bg-[#FFD1D1] border-2 border-[#FFE5E5] rounded-lg m-1.5 flex justify-center items-center"
        class:more-saturation={box.number !== -1}
      >
        {#if box.number !== -1}
          <p class="text-3xl font-bold text-center" in:fade out:fade={{ duration: 180 }}>{box.number}</p>
        {/if}
      </div>
    {/each}
  </div>
  
  <div class="number-pad-grid">
    {#each numberPads as pad (pad.id)}
      <div class:zero={pad.number === 0}>
        {#if pad.id !== 2307}
        <button 
          class="button-animation font-bold text-3xl text-center w-16 h-16 flex justify-center items-center hover:scale-95 hover:translate-y-0.5 border-2 rounded-md border-[#FFE5E5] hover:bg-[#FFF5FE]"
          on:click={() => onClickPad(pad.number)}
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
  

  <div class="absolute right-10 w-40 h-96 flex flex-col justify-center items-center">
    <div class="border-2 border-[#FFE5E5] rounded-lg w-40 h-80 flex flex-col justify-center items-center">
      {#if datas.length !== 0}
        {#each datas as data (data.value)}
          <div class="w-full h-16 flex justify-center items-center">
            <p class="text-lg font-bold text-center">{data.strike}S {data.balls ?? 0}B</p>
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

  .more-saturation {
    background-color: #FFBCBC;
  }

  .zero {
    grid-column: 2;
    /* background-color: black; */
  }

  .button-animation {
    transition: all 0.2s ease-in-out;
  }

  .box-animation {
    transition: all 0.3s ease-in-out;
  }

  .input-label {
    font-size: 15px;
    color: #222222;
    width: 100px;
    border: none;
    border-bottom: solid #aaaaaa 1px;
    padding-bottom: 2px;
    padding-left: 2px;
    position: relative;
    background: none;
    z-index: 5;
  }

  .input-label::placeholder { color: #aaaaaa; }
  .input-label:focus { outline: none; }

  .span-label {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0%;  /* right로만 바꿔주면 오 - 왼 */
    background-color: #666;
    width: 0;
    height: 2px;
    border-radius: 2px;
    transition: 0.5s;
  }

  .label-label {
    position: absolute;
    color: #aaa;
    left: 5px;
    font-size: 12px;
    bottom: 8px;
    transition: all .2s;
  }

  .input-label:focus ~ .label-label, .input-label:valid ~ .label-label {
    font-size: 13px;
    bottom: 23px;
    color: #666;
    font-weight: bold;
  }

  .input-label:focus ~ .span-label, .input-label:valid ~ .span-label {
    width: 100%;
  }
</style>