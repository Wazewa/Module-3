<template>
  <div class="app-container">
    <h1>Emoji Kitchen</h1>
    <p class="subtitle">Выберите два эмоджи, чтобы создать микс!</p>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка эмоджи...</p>
    </div>
    

    <div v-else>
      <EmojiList
        :emojis="emojis"
        title="Выберите первый смайл"
        :selectedEmoji="selectedSmiles[0]"
        @selectEmoji="(emoji) => selectedSmiles[0] = emoji"
      />
      
      <EmojiList
        :emojis="emojis"
        title="Выберите второй смайл"
        :selectedEmoji="selectedSmiles[1]"
        @selectEmoji="(emoji) => selectedSmiles[1] = emoji"
      />
      
      <EmojiMixer
        :firstEmoji="selectedSmiles[0]"
        :secondEmoji="selectedSmiles[1]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EmojiList from './components/EmojiList.vue';
import EmojiMixer from './components/EmojiMixer.vue';

const emojis = ref([]);
const loading = ref(true);

const selectedSmiles = ref([null, null]);

const fetchEmojis = async () => {
  try {
    const response = await fetch('https://emojihub.yurace.pro/api/all');
    const data = await response.json();
    emojis.value = data;
  } catch (error) {
    console.error('Ошибка при загрузке эмоджи:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEmojis();
});
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

h1 {
  text-align: center;
  color: white;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: rgba(255,255,255,0.9);
  margin-bottom: 30px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: white;
  border-radius: 20px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  margin-bottom: 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>