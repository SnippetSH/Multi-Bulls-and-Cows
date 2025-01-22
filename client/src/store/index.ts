import { writable } from "svelte/store";

import type { ScoreData, Box } from "../types";

export let numberBoxes = writable<Box[]>([]);
export let numberPads = writable<Box[]>([]);
export let gameResult = writable<ScoreData[]>([]);
export let number5Clicked = writable<number>(0);
export let cursor = writable<number>(0);

export function initStore(windowWidth: number) {
    const boxesTemp: Box[] = [];
    const padTemp: Box[] = [];
    for (let i = 1; i <= 9; i++) {
        padTemp.push({ id: i, number: i, isClicked: false });
        boxesTemp.push({ id: i - 1, number: -1 });
    }

    if (windowWidth < 400) {
        padTemp.push({ id: 2308, number: -1});
    }
    padTemp.push({ id: 0, number: 0, isClicked: false });
    padTemp.push({ id: 2307, number: -1 });
    
    numberBoxes.set(boxesTemp);
    numberPads.set(padTemp);
    gameResult.set([]);
}

export function resetBox() {
    const boxesTemp: Box[] = [];
    const padTemp: Box[] = [];
    for (let i = 1; i <= 9; i++) {
        boxesTemp.push({ id: i - 1, number: -1 });
        padTemp.push({ id: i, number: i, isClicked: false });
    }
    padTemp.push({ id: 0, number: 0, isClicked: false });
    padTemp.push({ id: 2307, number: -1 });

    numberBoxes.set(boxesTemp);
    numberPads.set(padTemp);
    cursor.set(0);
}