#!/bin/bash
# 굿즈 수량조사 서버 실행 스크립트

# 1. .env 파일 체크
echo "[INFO] .env 파일 존재 여부 확인..."
if [ ! -f .env ]; then
  echo "[ERROR] .env 파일이 없습니다. .env.example을 참고해 .env 파일을 만들어주세요."
  exit 1
fi

# 2. Node.js, npm 설치 안내
echo "[INFO] Node.js와 npm이 설치되어 있어야 합니다. (node -v, npm -v로 확인)"

# 3. 의존성 설치
echo "[INFO] npm install 실행..."
npm install

# 4. 서버 실행
echo "[INFO] 서버를 실행합니다. (Ctrl+C로 중지)"
node goods-server.js

# 백그라운드 실행 예시:
# nohup node goods-server.js &
# 또는 pm2 사용 권장: pm2 start goods-server.js --name goods-server

