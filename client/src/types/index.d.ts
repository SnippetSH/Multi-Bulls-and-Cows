interface Box {
    id: number,
    number: number,
    isClicked?: boolean,
}

interface ScoreData {
    type: 'score';
    data: {
        id: number,
        value: string,
        strike: number,
        ball: number,
    };
}

interface LinkData {
    type: 'links';
    data: {
        links: number;
    };
}

type ServerData = ScoreData | LinkData;

interface NewGameData {
    type: 'new_game';
    data: {
        pw: string;
    }
}
  
interface GuessData {
    type: 'guess';
    data: {
        guess: string;
    }
}
  
type ClientData = NewGameData | GuessData;

export type { Box, ScoreData, ServerData, LinkData, NewGameData, GuessData };
