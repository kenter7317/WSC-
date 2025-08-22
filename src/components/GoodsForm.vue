<template>
  <div>
    <h2>굿즈 선택</h2>
    <div v-if="loading">로딩 중...</div>
    <div v-else>
      <div v-if="selectedGood">
        <div style="color:green;">이미 선택한 굿즈: <b>{{ selectedGood.name }}</b></div>
      </div>
      <form v-else @submit.prevent="submitSelect">
        <div v-for="good in goods" :key="good.id" style="margin-bottom: 1em;">
          <label>
            <input type="radio" :value="good.id" v-model="selectedId" :disabled="good.count === 0" />
            {{ good.name }} (남은 수량: {{ good.count }})
          </label>
        </div>
        <button type="submit" :disabled="!selectedId">선택하기</button>
      </form>
      <div v-if="message" :style="{ color: error ? 'red' : 'green', marginTop: '1em' }">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GoodsForm',
  props: ['email'],
  data() {
    return {
      goods: [],
      selectedId: null,
      selectedGood: null,
      loading: true,
      message: '',
      error: false
    };
  },
  async created() {
    await this.fetchGoods();
    await this.fetchUser();
  },
  methods: {
    async fetchGoods() {
      this.loading = true;
      const res = await axios.get('http://localhost:3001/wsc-goods/api/goods');
      this.goods = res.data;
      this.loading = false;
    },
    async fetchUser() {
      if (!this.email) return;
      const res = await axios.get('http://localhost:3001/wsc-goods/api/user/status', { params: { email: this.email } });
      if (res.data.selectedGoodId) {
        this.selectedGood = this.goods.find(g => g.id === res.data.selectedGoodId);
      }
    },
    async submitSelect() {
      this.message = '';
      this.error = false;
      try {
        const res = await axios.post('http://localhost:3001/wsc-goods/api/goods/select', { email: this.email, goodId: this.selectedId });
        this.message = '굿즈가 성공적으로 선택되었습니다!';
        await this.fetchGoods();
        await this.fetchUser();
      } catch (e) {
        this.error = true;
        this.message = e.response?.data?.error || '오류 발생';
      }
    }
  },
  watch: {
    email() {
      this.fetchGoods();
      this.fetchUser();
    }
  }
};
</script>
