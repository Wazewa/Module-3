<template>
  <div class="emoji-mixer">
    <h3>Миксер эмоджи</h3>
    
    <div class="mixer-container">
      <div class="emoji-slot">
        <div class="slot-label">Первый смайл</div>
        <Emoji v-if="firstEmoji" :emoji="firstEmoji" />
        <div v-else class="empty-slot">❓</div>
      </div>
      
      <div class="mixer-plus">+</div>
      
      <div class="emoji-slot">
        <div class="slot-label">Второй смайл</div>
        <Emoji v-if="secondEmoji" :emoji="secondEmoji" />
        <div v-else class="empty-slot">❓</div>
      </div>
      
      <div class="mixer-equals">=</div>
      
      <div class="emoji-result">
        <div class="slot-label">Результат</div>
        <div v-if="kitchenEmoji" class="result-image">
          <img :src="kitchenEmoji" alt="Mixed emoji" width="96" height="96">
        </div>
        <div v-else class="empty-slot">❓</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Emoji from './Emoji.vue';

const props = defineProps({
  firstEmoji: {
    type: Object,
    default: null
  },
  secondEmoji: {
    type: Object,
    default: null
  }
});

const kitchenEmoji = computed(() => {
  if (props.firstEmoji && props.secondEmoji) {
    const unicodeFirst = props.firstEmoji.unicode[0].replace('U+', '').toLowerCase();
    const unicodeSecond = props.secondEmoji.unicode[0].replace('U+', '').toLowerCase();
    return `https://emk.vercel.app/s/${unicodeFirst}_${unicodeSecond}?size=96`;
  }
  return null;
});
</script>

<style scoped>
.emoji-mixer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 25px;
  margin-top: 20px;
  color: white;
}

.emoji-mixer h3 {
  text-align: center;
  margin: 0 0 20px 0;
  font-size: 1.5rem;
}

.mixer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.emoji-slot, .emoji-result {
  text-align: center;
}

.slot-label {
  font-size: 12px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.empty-slot {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  font-size: 32px;
}

.mixer-plus, .mixer-equals {
  font-size: 32px;
  font-weight: bold;
}

.result-image {
  width: 96px;
  height: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 10px;
}

.result-image img {
  max-width: 100%;
  height: auto;
}
</style>