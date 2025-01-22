import { writable } from "svelte/store";

import type { Data, Box } from "../types";

export let numberBoxes = writable<Box[]>([]);
export let numberPads = writable<Box[]>([]);
export let gameResult = writable<Data[]>([]);