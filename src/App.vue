<script setup>
import { ref, onMounted } from 'vue';
import GoodsForm from './components/GoodsForm.vue';
import GoodsResults from './components/GoodsResults.vue';
import EmailAuth from './components/EmailAuth.vue';
import axios from 'axios';

const view = ref('form');
const email = ref('');
const verified = ref(false);

function saveAuth() {
  localStorage.setItem('goods_email', email.value);
}

async function checkStatus() {
  if (!email.value) return;
  try {
    const res = await axios.get('http://localhost:3001/api/user/status', { params: { email: email.value } });
    verified.value = res.data.verified;
  } catch {
    verified.value = false;
  }
}

function onAuthed(e) {
  email.value = e;
  saveAuth();
  checkStatus();
}

onMounted(() => {
  const saved = localStorage.getItem('goods_email');
  if (saved) {
    email.value = saved;
    checkStatus();
  }
});
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <div v-if="verified" style="margin-top: 1em;">
      <button @click="view = 'form'" :disabled="view === 'form'">수량 입력</button>
      <button @click="view = 'results'" :disabled="view === 'results'" style="margin-left: 1em;">결과 조회</button>
      <span style="margin-left:2em; color:gray;">{{ email }}</span>
    </div>
  </header>
  <main>
    <EmailAuth v-if="!verified" @authed="onAuthed" />
    <template v-else>
      <GoodsForm v-if="view === 'form'" :email="email" />
      <GoodsResults v-else />
    </template>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
