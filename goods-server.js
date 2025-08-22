// 간단한 굿즈 수량조사 서버
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'goods.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// 굿즈 데이터 초기화 (최초 1회)
function initData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      goods: [
        { id: 1, name: '텀블러', count: 0 },
        { id: 2, name: '에코백', count: 0 },
        { id: 3, name: '스티커', count: 0 }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function initUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]');
  }
}

function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Gmail API 기반 인증 메일 발송
async function sendMail(email, code) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  const accessToken = await oAuth2Client.getAccessToken();
  const transporter = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_SENDER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  });
  await transporter.sendMail({
    from: `굿즈 수량조사 <${process.env.GMAIL_SENDER}>`,
    to: email,
    subject: '[굿즈 수량조사] 인증코드 안내',
    text: `인증코드: ${code}\n\n굿즈 수량조사 서비스에 인증코드를 입력해 주세요.`
  });
}

// 굿즈 목록 조회
app.get('/wsc-goods/api/goods', (req, res) => {
  const data = readData();
  res.json(data.goods);
});

// 굿즈 수량 입력(증가)
app.post('/wsc-goods/api/goods/:id', (req, res) => {
  const { id } = req.params;
  const { count } = req.body;
  const data = readData();
  const good = data.goods.find(g => g.id === Number(id));
  if (!good) return res.status(404).json({ error: 'Not found' });
  good.count += Number(count);
  writeData(data);
  res.json(good);
});

// 전체 결과 조회
app.get('/wsc-goods/api/results', (req, res) => {
  const data = readData();
  res.json(data.goods);
});

const ALLOWED_EMAILS = [
  "hwon3330@naver.com",
  "junhaiankim@gmail.com",
  "spacexixix@gmail.com",
  "hyunsu080207@naver.com",
  "kshlemon00@gmail.com",
  "winstoninho1019@gmail.com",
  "pandora6722@gmail.com",
  "winterreise94@gmail.com",
  "Nbnkr3909@gmail.com",
  "Snowtie. 7597@gmail.com",
  "chan34321@gmail.com",
  "thatgaydid@naver.com",
  "answjddns0808@gmail.com",
  "woqud09@gmail.com",
  "dnalsrla1234@gmail.com",
  "studioliberum@gmail.com",
  "gorani124171@gmail.com",
  "kukuku0517@gmail.com",
  "sweetcandy0110gm@gmail.com",
  "wjjeon77@gmail.com",
  "eunseo1802@naver.com",
  "yee154517@naver.com",
  "snowland.dev@gmail.com",
  "crunchycat129@gmail.com",
  "kudong0909@gmail.com",
  "1202hyunjin@naver.com",
  "ekfrifajfl2019@gmail.com",
  "serendipity7.dev",
  "younghoon99999@gmail.com",
  "dbtkddnr2004@gmail.com",
  "1000_yj@naver.com",
  "qwertyuiop123djd@gmail.com",
  "braywyatt1102@gmail.com",
  "jhl1179@naver.com",
  "noobnuby77@gmail.com",
  "me@JangUniverse.dev",
  "gayeong897@gmail.com",
  "p24806115@gmail.com",
  "yoonjh0240@gmail.com",
  "jh.kwon7942@gmail.com",
  "azassy40@gmail.com",
  "your4marimo@gmail.com",
  "hune0329@gmail.com",
  "hhaje2008@gmail.com",
  "donggyugim321@gmail.com",
  "leusin@naver.com",
  "gkaehdrlf12@gmail.com",
  "teuwinyt@gmail.com",
  "ahsquareffect@gmail.com",
  "500000co@naver.com",
  "asdzxcjjkcurp@gmail.com",
  "jinstarkor@gmail.com",
  "aki_shy@naver.com",
  "ranghi2357@gmail.com",
  "louie07230723@gmail.com",
  "s24028@gsm.hs.kr",
  "a01080080329@gmail.com",
  "ck66661254@gmail.com",
  "gjghj6525@naver.com",
  "james777261@gmail.com",
  "flashnia@gmail.com",
  "chocoyam03@naver.com",
  "winstoninho1019@gmail.com",
  "juminham123@gmail.com",
  "shinetiger2010@gmail.com",
  "chriskim2020@naver.com",
  "slappymj@gmail.com",
  "tlgus4729@gmail.com",
  "euan.hur@gmail.com",
  "jm82301012@gmail.com",
  "satcoff28@gmail.com",
  "hjhun0504@gmail.com",
  "hjkim32880@gmail.com",
  "yoonga87@naver.com",
  "vegahouse102@naver.com",
  "yd10312@naver.com",
  "pkh676872@gmail.com",
  "tjdi146534@gmail.com",
  "nurguri11@gmail.com",
  "jadam41817@gmail.com",
  "sbcow97@naver.com",
  "wns6615@gmail.com",
  "tangent09mail@gmail.com",
  "yllow6@naver.com",
  "rabitleaf@gmail.com",
  "jo02250@naver.com",
  "purpledev7714@gmail.xom",
  "slswkdkqkdl@naver.com",
  "kdo37162@naver.com",
  "songwooseong9663@gmail.com",
  "longlivekoon@gmail.com",
  "sjc0725090709@gmail.com",
  "wow2658@naver.com",
  "leeharang2542@gmail.com",
  "bj1008k@gmail.com",
  "gkssk3408@gmail.com",
  "guilty.o.o.k@gmail.com",
  "e015751@gmail.com",
  "jhram10150@gmail.com",
  "jqyu125@gmail.com",
  "99909990zxcvbnm@gmail.com",
  "jjm13.dev@gmail.com",
  "yoonjaemyung0728@gmail.com",
  "seyoungpark@hanyang.ac.kr",
  "dbsgns6088@gmail.com",
  "amumalbot4@gmail.com",
  "koo06101@gmail.com",
  "junsung12071@gmail.com",
  "b612ex@gmail.com",
  "jmhmmy0915@gmail.com",
  "agek434@gmail.com",
  "limwr706@gmail.com",
  "muggie1379@gmail.com",
  "loard969@gmail.com",
  "keunem4@gmail.com",
  "keumen000@gmail.com",
  "uyeoli248@gmail.com",
  "jkc9670@gmail.com",
  "yanggogi1423@gmail.com",
  "rlatjdgus2008@gmail.com",
  "your5marimo@gmail.com"
];

// 인증코드 요청
app.post('/wsc-goods/api/auth/request', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: '이메일 필요' });
  if (!ALLOWED_EMAILS.includes(email)) return res.status(400).json({ error: '허용되지 않은 이메일입니다.' });
  const users = readUsers();
  let user = users.find(u => u.email === email);
  const now = Date.now();
  if (user && user.blockedUntil && user.blockedUntil > now) {
    const min = Math.ceil((user.blockedUntil - now) / 60000);
    return res.status(429).json({ error: `인증 시도 제한. ${min}분 후 다시 시도하세요.` });
  }
  const code = generateCode();
  const codeExpires = now + 5 * 60 * 1000; // 5분
  if (!user) {
    user = { email, verified: false, code, codeExpires, attempts: 0, blockedUntil: null, selectedGoodId: null };
    users.push(user);
  } else {
    user.code = code;
    user.codeExpires = codeExpires;
    user.verified = false;
    user.attempts = 0;
    user.blockedUntil = null;
  }
  writeUsers(users);
  await sendMail(email, code);
  res.json({ ok: true });
});

// 인증코드 확인
app.post('/wsc-goods/api/auth/verify', (req, res) => {
  const { email, code } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  const now = Date.now();
  if (!user) return res.status(400).json({ error: '인증 실패' });
  if (user.blockedUntil && user.blockedUntil > now) {
    const min = Math.ceil((user.blockedUntil - now) / 60000);
    return res.status(429).json({ error: `인증 시도 제한. ${min}분 후 다시 시도하세요.` });
  }
  if (!user.code || !user.codeExpires || user.codeExpires < now) {
    return res.status(400).json({ error: '인증코드가 만료되었습니다. 다시 요청해 주세요.' });
  }
  if (user.code !== code) {
    user.attempts = (user.attempts || 0) + 1;
    if (user.attempts >= 5) {
      user.blockedUntil = now + 10 * 60 * 1000; // 10분 차단
      writeUsers(users);
      return res.status(429).json({ error: '인증 5회 실패로 10분간 차단되었습니다.' });
    }
    writeUsers(users);
    return res.status(400).json({ error: `인증 실패. 남은 시도: ${5 - user.attempts}` });
  }
  user.verified = true;
  user.code = null;
  user.codeExpires = null;
  user.attempts = 0;
  user.blockedUntil = null;
  writeUsers(users);
  res.json({ ok: true });
});

// 유저 상태 조회
app.get('/wsc-goods/api/user/status', (req, res) => {
  const { email } = req.query;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.json({ exists: false });
  res.json({ exists: true, verified: user.verified, selectedGoodId: user.selectedGoodId });
});

// 굿즈 선택(선착순)
app.post('/wsc-goods/api/goods/select', (req, res) => {
  const { email, goodId } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user || !user.verified) return res.status(403).json({ error: '인증 필요' });
  if (user.selectedGoodId) return res.status(400).json({ error: '이미 선택함' });
  const data = readData();
  const good = data.goods.find(g => g.id === Number(goodId));
  if (!good || good.count <= 0) return res.status(400).json({ error: '품절' });
  good.count -= 1;
  user.selectedGoodId = good.id;
  writeData(data);
  writeUsers(users);
  res.json({ ok: true, good });
});

initData();
initUsers();

app.listen(PORT, () => {
  console.log(`Goods server listening on port ${PORT}`);
});
