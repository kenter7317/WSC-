#!/bin/bash
# 굿즈 수량조사 서버 실행 스크립트

# 1. .env 파일 체크
echo "[INFO] .env 파일 존재 여부 확인..."
if [ ! -f .env ]; then
  echo "[ERROR] .env 파일이 없습니다. .env.example을 참고해 .env 파일을 만들어주세요."
  exit 1
fi

# 2. service-account.json 파일 체크 (SERVICE_ACCOUNT_KEY_PATH 환경변수 사용)
SERVICE_ACCOUNT_KEY_PATH=$(grep SERVICE_ACCOUNT_KEY_PATH .env | cut -d '=' -f2 | tr -d '\r')
if [ -z "$SERVICE_ACCOUNT_KEY_PATH" ]; then
  SERVICE_ACCOUNT_KEY_PATH=./service-account.json
fi
if [ ! -f "$SERVICE_ACCOUNT_KEY_PATH" ]; then
  echo "[ERROR] 서비스 계정 키 파일($SERVICE_ACCOUNT_KEY_PATH)이 없습니다. 관리자에게 문의하세요."
  exit 1
fi

# 3. Node.js, npm 설치 안내
echo "[INFO] Node.js와 npm이 설치되어 있어야 합니다. (node -v, npm -v로 확인)"

# 4. 의존성 설치
echo "[INFO] npm install 실행..."
npm install

# 5. 서버 실행
echo "[INFO] 서버를 실행합니다. (Ctrl+C로 중지)"
node goods-server.js

# 백그라운드 실행 예시:
# nohup node goods-server.js &
# 또는 pm2 사용 권장: pm2 start goods-server.js --name goods-server
