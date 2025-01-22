<script lang="ts">
  export let socket: WebSocket;

  import { fade } from "svelte/transition";
  import type { NewGameData } from "../types";
  import { number5Clicked } from "../store";

  let inputPassword = "";
  let isNewGameClicked = false;

  function onNewGame() {
    if(isNewGameClicked && inputPassword !== "") {

      const data: NewGameData = {
        type: 'new_game',
        data: {
          pw: inputPassword
        }
      };
      socket.send(JSON.stringify(data));
      inputPassword="";
      number5Clicked.set(0);
    }
    isNewGameClicked = !isNewGameClicked;
  }
</script>

<div class="absolute top-3 left-3 flex justify-center items-center">
  <button
    class="overflow-hidden button-animation w-16 h-12 flex justify-center items-center font-bold hover:scale-97 hover:translate-y-[0.1rem] bg-[#FFD1E1] border-2 border-[#FFE5E5] hover:bg-[#FFBCD3] rounded-lg"
    on:click={() => onNewGame()}
  >
    <p>
      {#if isNewGameClicked}
        확인
      {:else}
        새 게임
      {/if}
    </p>
  </button>
  {#if isNewGameClicked}
    <div
      class="relative width-24 ml-4 mt-2 box-animation"
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 170 }}
    >
      <input
        type="text"
        class="input-label"
        bind:value={inputPassword}
        required
      />
      <label for="password" class="label-label">Password</label>
      <span class="span-label"></span>
    </div>
  {/if}
</div>

<style>
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
    left: 0%; 
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