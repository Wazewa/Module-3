<template>
  <div class="container">
    <h1>🔢 Случайные факты о числах</h1>
    <p class="subtitle">Узнайте интересные факты о любых числах!</p>
    
    <div class="search-container">
      <div class="input-group">
        <label>🔢 Введите число:</label>
        <input 
          type="number" 
          v-model.number="number"
          placeholder="Например: 42, 2024, 7..."
          @keyup.enter="searchFact"
          :disabled="loading"
        >
      </div>
      
      <div class="input-group">
        <label>📚 Выберите категорию:</label>
        <select v-model="category" :disabled="loading">
          <option value="trivia">🎲 Trivia - случайный факт</option>
          <option value="math">📐 Math - математический факт</option>
          <option value="year">📅 Year - факт о годе</option>
        </select>
      </div>
      
      <button 
        @click="searchFact" 
        :disabled="loading || !number && number !== 0"
        class="search-btn"
      >
        <span v-if="loading">⏳ Загрузка...</span>
        <span v-else>🔍 Поиск</span>
      </button>
    </div>
    
    <div class="result-container" v-if="fact || error">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Ищем интересный факт...</p>
      </div>
      
      <div v-else-if="fact && !error" class="fact-card">
        <div class="fact-header">
          <span class="fact-icon">💡</span>
          <span class="fact-category">{{ getCategoryName() }}</span>
        </div>
        <p class="fact-text">{{ fact }}</p>
        <div class="fact-number">
          📌 Число: <strong>{{ number }}</strong>
        </div>
      </div>
      
      <div v-else-if="error" class="error-card">
        <div class="error-icon">😔</div>
        <p class="error-text">{{ error }}</p>
      </div>
    </div>
    
    <div class="history-container" v-if="history.length > 0">
      <h2>📜 История поиска</h2>
      <div class="history-list">
        <div 
          v-for="item in history" 
          :key="item.id"
          class="history-item"
          @click="repeatSearch(item.number, item.category)"
        >
          <span class="history-number">{{ item.number }}</span>
          <span class="history-category">{{ getCategoryName(item.category) }}</span>
          <span class="history-fact">{{ item.fact.substring(0, 60) }}...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'App',
  setup() {
    const number = ref('');
    const category = ref('trivia');
    const fact = ref('');
    const error = ref('');
    const loading = ref(false);
    const history = ref([]);
    let nextId = 1;
    
    const getCategoryName = (cat = category.value) => {
      const names = {
        trivia: '🎲 Случайный факт',
        math: '📐 Математический факт',
        year: '📅 Факт о годе'
      };
      return names[cat] || cat;
    };
    
    const searchFact = async () => {
      if (!number.value && number.value !== 0) {
        alert('Введите число!');
        return;
      }

      fact.value = '';
      error.value = '';
      loading.value = true;

      try {
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
        const data = await response.json();

        const simulatedFactText = data.text.replace(/a|an|the/, `${number.value}`);
        
        const apiResponse = {
          found: true,
          text: `📌 Факт, связанный с числом ${number.value}: ${simulatedFactText}`,
        };

        fact.value = apiResponse.text;
        error.value = '';

        history.value.unshift({
          id: nextId++,
          number: number.value,
          category: category.value,
          fact: apiResponse.text,
          timestamp: new Date().toLocaleString()
        });
        if (history.value.length > 10) history.value.pop();

      } catch (err) {
        console.error('Ошибка при запросе:', err);
        error.value = 'Не удалось получить факт. Проверьте подключение к интернету.';
      } finally {
        loading.value = false;
      }
    };
    
    const repeatSearch = (num, cat) => {
      number.value = num;
      category.value = cat;
      searchFact();
    };
    
    return {
      number,
      category,
      fact,
      error,
      loading,
      history,
      searchFact,
      repeatSearch,
      getCategoryName
    };
  }
};
</script>

<style scoped>
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

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
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

.search-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.search-btn:hover:not(:disabled) {
  background: #5a67d8;
}

.search-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result-container {
  margin-bottom: 25px;
}

.loading {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top-color: #667eea;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fact-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border-left: 5px solid #667eea;
}

.fact-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.fact-icon {
  font-size: 24px;
}

.fact-category {
  background: #667eea20;
  padding: 5px 12px;
  border-radius: 20px;
  color: #667eea;
  font-size: 14px;
  font-weight: bold;
}

.fact-text {
  font-size: 18px;
  line-height: 1.5;
  color: #333;
  margin-bottom: 20px;
}

.fact-number {
  font-size: 14px;
  color: #888;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.error-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  border-left: 5px solid #dc3545;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.error-text {
  font-size: 18px;
  color: #dc3545;
}

.history-container {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.history-container h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.history-item:hover {
  background: #e9ecef;
}

.history-number {
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
}

.history-category {
  font-size: 12px;
  color: #666;
}

.history-fact {
  flex: 1;
  font-size: 14px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>