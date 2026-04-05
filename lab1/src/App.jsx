import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [[10, 10], [9, 10], [8, 10]];
const INITIAL_DIRECTION = 'right';
const INITIAL_SPEED = 800;

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState([15, 10]);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  
  const gameLoopRef = useRef();
  // FIX: Храним следующее направление отдельно
  const nextDirectionRef = useRef(INITIAL_DIRECTION);
  // FIX: Блокировка обработки нескольких нажатий за тик
  const isMovingRef = useRef(false);

  // Генерация еды в свободной клетке
  const generateRandomFood = useCallback((currentSnake) => {
    const totalCells = GRID_SIZE * GRID_SIZE;
    const snakeSet = new Set(currentSnake.map(segment => `${segment[0]},${segment[1]}`));
    
    if (snakeSet.size === totalCells) return null;
    
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ];
    } while (snakeSet.has(`${newFood[0]},${newFood[1]}`));
    
    return newFood;
  }, []);

  // Движение змейки
  const moveSnake = useCallback(() => {
    // FIX: Если уже движемся или игра окончена - выходим
    if (gameOver || isMovingRef.current) return;
    
    isMovingRef.current = true;
    
    // FIX: Применяем накопленное направление
    const currentDirection = nextDirectionRef.current;
    
    const newSnake = [...snake];
    const head = newSnake[0];
    let newHead = [...head];

    switch (currentDirection) {
      case 'right': newHead[0]++; break;
      case 'left': newHead[0]--; break;
      case 'up': newHead[1]--; break;
      case 'down': newHead[1]++; break;
      default: break;
    }

    // Проверка на еду
    const ateFood = newHead[0] === food[0] && newHead[1] === food[1];

    if (ateFood) {
      newSnake.unshift(newHead);
      setScore(prev => prev + 10);
      const newFood = generateRandomFood(newSnake);
      if (newFood) {
        setFood(newFood);
      } else {
        setGameOver(true);
        alert('Победа! Вы заполнили всё поле!');
        isMovingRef.current = false;
        return;
      }
    } else {
      newSnake.unshift(newHead);
      newSnake.pop();
    }

    // Проверка столкновений
    const headPos = newSnake[0];
    const collision = 
      headPos[0] < 0 || headPos[0] >= GRID_SIZE ||
      headPos[1] < 0 || headPos[1] >= GRID_SIZE ||
      newSnake.slice(1).some(segment => segment[0] === headPos[0] && segment[1] === headPos[1]);

    if (collision) {
      setGameOver(true);
      isMovingRef.current = false;
      return;
    }

    setSnake(newSnake);
    isMovingRef.current = false;
  }, [snake, food, gameOver, generateRandomFood]);

  // Игровой цикл
  useEffect(() => {
    if (gameOver) return;
    
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(moveSnake, speed);
    
    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, speed, gameOver]);

  // Сброс игры
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;  // FIX: Сбрасываем накопленное направление
    setScore(0);
    setGameOver(false);
    isMovingRef.current = false;  // FIX: Сбрасываем блокировку
    const newFood = generateRandomFood(INITIAL_SNAKE);
    if (newFood) setFood(newFood);
  }, [generateRandomFood]);

  // FIX: Обновлённая функция смены направления с проверкой на противоположное
  const changeDirection = useCallback((newDirection) => {
    if (gameOver) return;
    
    // Проверка на противоположное направление
    const opposite = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };
    
    const currentDir = nextDirectionRef.current;
    
    // Нельзя повернуть на 180 градусов
    if (opposite[newDirection] === currentDir) return;
    
    // Обновляем следующее направление
    nextDirectionRef.current = newDirection;
    setDirection(newDirection);
  }, [gameOver]);

  // Управление с клавиатуры (стрелки + R)
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key;
      const newDirection = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
      }[key];
      
      if (newDirection) {
        e.preventDefault();
        changeDirection(newDirection);
      }
      
      if (key === 'r' || key === 'R') {
        resetGame();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, resetGame]);

  // Рендер игрового поля
  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
        const isHead = snake[0] && snake[0][0] === x && snake[0][1] === y;
        const isFood = food[0] === x && food[1] === y;
        
        let cellClass = 'cell';
        if (isSnake) cellClass += ' snake';
        if (isHead) cellClass += ' head';
        if (isFood) cellClass += ' food';
        
        board.push(<div key={`${x}-${y}`} className={cellClass}></div>);
      }
    }
    return board;
  };

  return (
    <div className="game-container">
      <h1>🐍 Змейка на React</h1>
      
      <div className="score">
        Счёт: {score}
      </div>
      
      <div className="game-board">
        {renderBoard()}
      </div>
      
      {gameOver && (
        <div className="game-over">
          💀 Игра окончена! Нажми R для перезапуска 💀
        </div>
      )}
      
      <div className="controls">
        <div className="joystick">
          <div></div>
          <button onClick={() => changeDirection('up')}>↑</button>
          <div></div>
          <button onClick={() => changeDirection('left')}>←</button>
          <button onClick={() => changeDirection('down')}>↓</button>
          <button onClick={() => changeDirection('right')}>→</button>
        </div>
        
        <div className="speed-control">
          <label>
            Скорость (мс): 
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span> {speed} мс</span>
          </label>
        </div>
        
        <button onClick={resetGame} style={{padding: '10px 20px', fontSize: '16px'}}>
          🔄 Сброс (R)
        </button>
      </div>
    </div>
  );
}

export default App;