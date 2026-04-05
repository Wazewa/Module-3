import { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Сделать лабораторную работу №2', completed: false },
    { id: 2, text: 'Добавить удаление задач', completed: false }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [nextId, setNextId] = useState(4);

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const renameTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newText = prompt('✏ Введите новое название задачи:', task.text);
      if (newText && newText.trim() !== '') {
        setTasks(tasks.map(t =>
          t.id === id ? { ...t, text: newText.trim() } : t
        ));
      }
    }
  };

  const addTask = () => {
    if (inputValue.trim() === '') {
      alert('Введите текст задачи!');
      return;
    }
    
    setTasks([...tasks, {
      id: nextId,
      text: inputValue.trim(),
      completed: false
    }]);
    setNextId(nextId + 1);
    setInputValue('');
  };

  return (
    <div className="container">
      <h1>Список задач</h1>
      
      <div className="add-task">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Введите новую задачу..."
        />
        <button onClick={addTask}>➕ Добавить</button>
      </div>
      
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            <span
              className={`task-text ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              {task.text}
            </span>
            <button
              className="task-edit"
              onClick={() => renameTask(task.id)}
            >
              ✏
            </button>
            <button
              className="task-delete"
              onClick={() => deleteTask(task.id)}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;