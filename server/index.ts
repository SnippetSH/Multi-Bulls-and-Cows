import express from 'express';
import ws from 'ws';
import cors from 'cors';

let game = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let sockets: Array<ws & { id: string | undefined }> = [];

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE']
}
app.use(cors(corsOptions));
app.use(express.json());
app.set('view engine', 'ejs');
app.get("/", (req, res) => res.render('./index.ejs'));
app.listen(3000);

interface Data {
  value: string;
  strike: number;
  ball: number;
}

const wss = new ws.Server({ port: 80 });

wss.on('connection', (_ws, req) => {
  const ws = _ws as ws & { id: string | undefined };
  ws.id = req.headers['sec-websocket-key'];
  sockets.push(ws);
  console.log("현재 연결된 소켓 수: " + sockets.length);

  const error = (msg: string) => {
    console.error(msg);
    sockets.find(v => ws.id === v.id)?.send(JSON.stringify({ error: msg }));
  }
  
  ws.on('close', (code, reason) => {
    sockets = sockets.filter(v => ws.id !== v.id);
    console.log("현재 연결된 소켓 수: " + sockets.length);
  });

  ws.on('message', resp => {
    const value = resp.toString();
    if (value === 'new_game:admin') {
      game = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // TODO: make new list
      return;
    }

    if (value.length !== 9)
      return error('숫자야구의 입력값은 9자리 정수여야 합니다!');
    if (new Set(value).size !== 9)
      return error('입력값의 9자리는 모두 다른 숫자여야 합니다!');

    let strike = 0, ball = 0;
    for (let i = 0; i < 9; i++) {
      if (value[i] < '0' || value[i] > '9')
        return error('숫자야구의 입력값은 9자리 정수여야 합니다!');

      if (value[i] === '' + game[i]) strike++;
      else if (game.includes(Number(value[i]))) ball++;
    }

    const data: Data = {
      value,
      strike,
      ball
    }
    const result = JSON.stringify(data);
    sockets.forEach(v => v.send(result));
  });
});
