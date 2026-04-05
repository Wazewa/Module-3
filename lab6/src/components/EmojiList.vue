<template>
  <div class="emoji-list">
    <div class="emoji-list-header">
      <h3>{{ title }}</h3>
      <span v-if="selectedEmoji" class="selected-indicator">
        ✅ Выбрано: {{ selectedEmoji.htmlCode[0] }}
      </span>
    </div>
    <div class="emoji-grid">
      <Emoji
        v-for="(emoji, index) in emojis"
        :key="index"
        :emoji="emoji"
        @click="handleSelect(emoji)"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Emoji from './Emoji.vue';

const props = defineProps({
  emojis: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Выберите эмоджи'
  },
  selectedEmoji: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['selectEmoji']);

const handleSelect = (emoji) => {
  emit('selectEmoji', emoji);
};
</script>

<style scoped>
.emoji-list {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.emoji-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.emoji-list-header h3 {
  margin: 0;
  color: #333;
}

.selected-indicator {
  font-size: 14px;
  color: #28a745;
  background: #d4edda;
  padding: 5px 12px;
  border-radius: 20px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding: 5px;
}

.emoji-grid::-webkit-scrollbar {
  width: 8px;
}

.emoji-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.emoji-grid::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
</style>