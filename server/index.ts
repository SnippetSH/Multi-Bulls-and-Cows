import { join } from 'path';
import express from 'express';
import { createServer } from 'http';
import ws from 'ws';
import cors from 'cors';

import type { ScoreData, LinkData, ClientData } from './types';

let game = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let sockets: Array<ws & { id: string | undefined }> = [];

const app = express();
const server = createServer(app);

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE']
}
app.use(cors(corsOptions));
app.use(express.json());

const wss = new ws.Server({ server });

const distPath = join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (rq, rs) => {
  rs.sendFile(join(distPath, 'index.html'));
})

wss.on('connection', (_ws, req) => {
  // New socket connected
  // Update current socket list & Announce new socket count to all client
  const ws = _ws as ws & { id: string | undefined };
  ws.id = req.headers['sec-websocket-key'];
  sockets.push(ws);
  console.log("현재 연결된 소켓 수: " + sockets.length);

  const socketData: LinkData = {
    type: 'links',
    data: {
      links: sockets.length
    }
  };
  sockets.forEach(v => v.send(JSON.stringify(socketData)));

  ws.on('close', (code, reason) => {
    sockets = sockets.filter(v => ws.id !== v.id);
    console.log("현재 연결된 소켓 수: " + sockets.length);
  });

  ws.on('message', resp => {
    const data = JSON.parse(resp.toString()) as ClientData;

    if (!data) return;

    if (data.type === 'new_game') {
      const { pw } = data.data;
      console.log(pw);
      if (pw !== "admin") return;
      
      console.log("New Game Start!");
      newGame();
    }
    else if (data.type === 'guess') {
      const { guess } = data.data;
      if (guess.length !== 9) return;
      if (new Set(guess).size !== 9) return;

      let strike = 0, ball = 0;
      for (let i = 0; i < 9; i++) {
        if (guess[i] < '0' || guess[i] > '9') return;

        if (guess[i] === '' + game[i]) strike++;
        else if (game.includes(Number(guess[i]))) ball++;
      }

      if (strike === 9) newGame();

      const result: ScoreData = {
        type: 'score',
        data: {
          value: guess,
          strike,
          ball 
        }
      }
      const stringResult = JSON.stringify(result);
      sockets.forEach(v => v.send(stringResult));
    }
  });
});
 
function newGame() {
  game = [];
  for (let i = 0; i < 9; i++) {
    let num = Math.floor(Math.random() * 10);
    while (game.includes(num)) num = Math.floor(Math.random() * 10);
    game.push(num);
  }

  console.log(game);
}

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})