<template>
  <div class="emoji" @click="$emit('click')">
    <span class="emoji-code">{{ emoji.htmlCode[0] }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  emoji: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);
</script>

<style scoped>
.emoji {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  font-size: 32px;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  border-radius: 12px;
  background: #f8f9fa;
}

.emoji:hover {
  transform: scale(1.1);
  background: #e9ecef;
}

.emoji-code {
  font-size: 36px;
}
</style>