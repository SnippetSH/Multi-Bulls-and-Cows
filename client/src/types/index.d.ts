interface Box {
    id: number,
    number: number,
    isClicked?: boolean,
}

interface InnerData {
    id?: number,
    value: string,
    strike: number,
    ball: number,
}

interface ScoreData {
    type: 'score';
    data: InnerData;
}

interface LinkData {
    type: 'links';
    data: {
        links: number;
    };
}

interface BulkScoreData {
    type: 'bulkscore';
    data: InnerData[];
  }
  
  type ServerData = ScoreData | LinkData | BulkScoreData;

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

export type { Box, ScoreData, ServerData, LinkData, BulkScoreData, NewGameData, GuessData, InnerData, ClientData };
