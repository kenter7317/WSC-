<template>
  <div>
    <h2>이메일 인증</h2>
    <div v-if="step === 1">
      <input v-model="email" type="email" placeholder="이메일 입력" />
      <button @click="requestCode" :disabled="loading || !email">인증코드 받기</button>
    </div>
    <div v-else-if="step === 2">
      <div>이메일로 전송된 인증코드를 입력하세요.</div>
      <input v-model="code" type="text" maxlength="6" placeholder="인증코드 입력" />
      <button @click="verifyCode" :disabled="loading || !code">인증하기</button>
      <button @click="step = 1" style="margin-left:1em;">이메일 변경</button>
    </div>
    <div v-else-if="step === 3">
      <div style="color:green;">인증이 완료되었습니다!</div>
      <button @click="$emit('authed', email)">굿즈 선택하러 가기</button>
    </div>
    <div v-if="error" style="color:red; margin-top:1em;">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EmailAuth',
  data() {
    return {
      email: '',
      code: '',
      step: 1,
      loading: false,
      error: ''
    };
  },
  methods: {
    async requestCode() {
      this.loading = true;
      this.error = '';
      try {
        await axios.post('http://localhost:3001/wsc-goods/api/auth/request', { email: this.email });
        this.step = 2;
        this.code = '';
      } catch (e) {
        this.error = e.response?.data?.error || '오류 발생';
        // 차단/만료 등 에러 발생 시 인증코드 입력 단계로 진입하지 않음
        this.step = 1;
      }
      this.loading = false;
    },
    async verifyCode() {
      this.loading = true;
      this.error = '';
      try {
        await axios.post('http://localhost:3001/wsc-goods/api/auth/verify', { email: this.email, code: this.code });
        this.step = 3;
      } catch (e) {
        this.error = e.response?.data?.error || '오류 발생';
        // 인증 만료/차단 시 인증코드 입력 단계에서 벗어나도록
        if (this.error.includes('만료') || this.error.includes('차단')) {
          this.step = 1;
        }
      }
      this.loading = false;
    }
  }
};
</script>
