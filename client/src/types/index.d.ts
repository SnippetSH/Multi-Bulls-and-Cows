interface Box {
    id: number,
    number: number,
    isClicked?: boolean,
  }

  interface Data {
    id: number,
    value: string,
    strike: number,
    ball: number,
  }

export type { Box, Data };