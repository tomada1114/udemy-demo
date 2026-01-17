import React, { useState, useEffect } from 'react';
import './App.css';
import { Todo } from './types/todo';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Confetti from './components/Confetti';

const App: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [todos, setTodos] = useState<Todo[]>(() => {
    // LocalStorageから初期データを読み込む
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        return parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
      } catch (error) {
        console.error('Failed to parse todos from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // todosが変更されたらLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 新しいTodoを追加
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTodos([newTodo, ...todos]);
  };

  // Todoを更新
  const updateTodo = (id: string, text: string) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, text, updatedAt: new Date() }
        : todo
    ));
  };

  // Todoの完了状態を切り替え
  const toggleTodo = (id: string) => {
    const targetTodo = todos.find(todo => todo.id === id);
    
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));

    // 未完了から完了に変わった場合のみ紙吹雪を表示
    if (targetTodo && !targetTodo.completed) {
      setShowConfetti(true);
    }
  };

  // Todoを削除
  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Todoの順序を変更
  const reorderTodos = (reorderedTodos: Todo[]) => {
    setTodos(reorderedTodos);
  };

  // 完了したTodoをクリア
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">Todo App</h1>
          <p className="subtitle">タスクを管理してスマートに仕事をこなそう</p>
        </header>

        <TodoForm onAdd={addTodo} />

        <div className="stats">
          <div className="stat">
            <span className="stat-label">アクティブ</span>
            <span className="stat-value">{activeCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">完了</span>
            <span className="stat-value">{completedCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">合計</span>
            <span className="stat-value">{todos.length}</span>
          </div>
        </div>

        <TodoList
          todos={todos}
          onUpdate={updateTodo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onReorder={reorderTodos}
        />

        {completedCount > 0 && (
          <button className="clear-button" onClick={clearCompleted}>
            完了したタスクをクリア ({completedCount})
          </button>
        )}

        <Confetti 
          show={showConfetti} 
          onComplete={() => setShowConfetti(false)}
        />
      </div>
    </div>
  );
};

export default App;