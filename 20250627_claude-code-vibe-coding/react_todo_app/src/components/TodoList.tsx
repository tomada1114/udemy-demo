import React, { useState } from 'react';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (todos: Todo[]) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onUpdate,
  onToggle,
  onDelete,
  onReorder
}) => {
  const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (todo: Todo) => {
    setDraggedTodo(todo);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedTodo) return;
    
    const dragIndex = todos.findIndex(todo => todo.id === draggedTodo.id);
    if (dragIndex === dropIndex) return;
    
    const newTodos = [...todos];
    newTodos.splice(dragIndex, 1);
    newTodos.splice(dropIndex, 0, draggedTodo);
    
    onReorder(newTodos);
    setDraggedTodo(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedTodo(null);
    setDragOverIndex(null);
  };

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p className="empty-text">タスクがありません</p>
        <p className="empty-subtext">新しいタスクを追加して始めましょう！</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo, index) => (
        <div
          key={todo.id}
          className={`todo-item-wrapper ${
            dragOverIndex === index ? 'drag-over' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
        >
          <TodoItem
            todo={todo}
            onUpdate={onUpdate}
            onToggle={onToggle}
            onDelete={onDelete}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDragging={draggedTodo?.id === todo.id}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList;