<template>
  <div>
    <h2>굿즈 수량 결과</h2>
    <div v-if="loading">로딩 중...</div>
    <table v-else border="1" cellpadding="8">
      <thead>
        <tr>
          <th>굿즈명</th>
          <th>수량</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="good in goods" :key="good.id">
          <td>{{ good.name }}</td>
          <td>{{ good.count }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="fetchResults" style="margin-top:1em;">새로고침</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GoodsResults',
  data() {
    return {
      goods: [],
      loading: true
    };
  },
  async created() {
    await this.fetchResults();
  },
  methods: {
    async fetchResults() {
      this.loading = true;
      const res = await axios.get('http://localhost:3001/api/results');
      this.goods = res.data;
      this.loading = false;
    }
  }
};
</script>

