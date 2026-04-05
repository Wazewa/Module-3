<template>
  <div class="container">
    <h1>Семейный бюджет</h1>
    
    <!-- Форма добавления операции -->
    <div class="form-container">
      <h2>Добавить операцию</h2>
      
      <div class="form-group">
        <label>Название операции:</label>
        <input 
          type="text" 
          v-model.trim="title"
          placeholder="Например: зарплата, продукты, такси..."
          @keyup.enter="addTransaction"
        >
      </div>
      
      <div class="form-group">
        <label>Сумма (₽):</label>
        <input 
          type="number" 
          v-model.number="amount"
          placeholder="Доход: +1000, Расход: -500"
          @keyup.enter="addTransaction"
        >
        <div class="hint">
          Доход указывайте с плюсом (+1000), расход с минусом (-500)
        </div>
      </div>
      
      <button @click="addTransaction" :disabled="!title || !amount">
        Добавить операцию
      </button>
    </div>
    
    <!-- Статистика -->
    <div class="stats" v-if="history.length > 0">
      <div class="stat-card income">
        <span>Доходы:</span>
        <strong>+{{ totalIncome }} ₽</strong>
      </div>
      <div class="stat-card expense">
        <span>Расходы:</span>
        <strong>{{ totalExpense }} ₽</strong>
      </div>
      <div class="stat-card balance">
        <span>Баланс:</span>
        <strong :class="balance >= 0 ? 'positive' : 'negative'">
          {{ balance }} ₽
        </strong>
      </div>
    </div>
    
    <!-- Список операций -->
    <div class="history-container">
      <h2>История операций</h2>
      
      <!-- Если операций нет -->
      <div v-if="history.length === 0" class="empty-state">
        Вы не совершали финансовых операций
      </div>
      
      <!-- Если операции есть -->
      <ul v-else class="history-list">
        <li 
          v-for="transaction in history" 
          :key="transaction.id"
          class="transaction-item"
          :class="transaction.amount > 0 ? 'income-item' : 'expense-item'"
        >
          <span class="transaction-text">{{ transaction.text }}</span>
          <span class="transaction-amount">
            {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }} ₽
          </span>
          <button 
            class="delete-btn"
            @click="deleteTransaction(transaction.id)"
            title="Удалить операцию"
          >
            ❌
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'App',
  setup() {
    const history = ref([]);
    
    const title = ref('');
    const amount = ref(null);
    
    let nextId = 1;
    
    const addTransaction = () => {
      if (!title.value || amount.value === null || amount.value === '') {
        alert('Заполните все поля!');
        return;
      }
      
      if (isNaN(amount.value)) {
        alert('Сумма должна быть числом!');
        return;
      }
      
      history.value.push({
        id: nextId++,
        text: title.value,
        amount: amount.value
      });
      
      title.value = '';
      amount.value = null;
    };
    
    const deleteTransaction = (id) => {
      history.value = history.value.filter(t => t.id !== id);
    };
    
    const totalIncome = computed(() => {
      return history.value
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    });
    
    const totalExpense = computed(() => {
      return history.value
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + t.amount, 0);
    });
    
    const balance = computed(() => {
      return totalIncome.value + totalExpense.value;
    });
    
    return {
      history,
      title,
      amount,
      addTransaction,
      deleteTransaction,
      totalIncome,
      totalExpense,
      balance
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
  padding: 30px;
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.form-container {
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.hint {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

button {
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

button:hover:not(:disabled) {
  background: #5a67d8;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.stat-card span {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 20px;
}

.income strong {
  color: #28a745;
}

.expense strong {
  color: #dc3545;
}

.balance strong.positive {
  color: #28a745;
}

.balance strong.negative {
  color: #dc3545;
}

.history-container {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 18px;
}

.history-list {
  list-style: none;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 10px;
  transition: background 0.3s;
}

.transaction-item:hover {
  background: #e9ecef;
}

.transaction-text {
  font-size: 16px;
  color: #333;
  flex: 1;
}

.transaction-amount {
  font-size: 18px;
  font-weight: bold;
  margin: 0 15px;
}

.income-item .transaction-amount {
  color: #28a745;
}

.expense-item .transaction-amount {
  color: #dc3545;
}

.delete-btn {
  width: 36px;
  padding: 8px;
  background: #dc3545;
  border-radius: 8px;
  font-size: 14px;
}

.delete-btn:hover {
  background: #c82333;
}
</style>