import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/todo';
import './TodoItem.css';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (todo: Todo) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onUpdate,
  onToggle,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleUpdate = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onUpdate(todo.id, trimmedText);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 30) return `${days}日前`;
    return new Date(date).toLocaleDateString('ja-JP');
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={() => onDragStart(todo)}
      onDragEnd={onDragEnd}
    >
      <button
        className="checkbox"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'タスクを未完了にする' : 'タスクを完了にする'}
      >
        {todo.completed && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8L6 12L14 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="todo-content">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleUpdate}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <>
            <span className="todo-text" onClick={() => setIsEditing(true)}>
              {todo.text}
            </span>
            <span className="todo-date">
              {formatDate(todo.updatedAt)}
            </span>
          </>
        )}
      </div>

      <div className="todo-actions">
        <button
          className="action-button edit"
          onClick={() => setIsEditing(true)}
          aria-label="編集"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.5 2.5L13.5 4.5M2 14L2 11.5L10.5 3L12.5 5L4 13.5L2 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className="action-button delete"
          onClick={() => onDelete(todo.id)}
          aria-label="削除"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H10M2 4H14M12.6667 4L12.1991 11.0129C12.129 12.065 12.094 12.5911 11.8319 12.99C11.6002 13.3412 11.2492 13.6235 10.8171 13.7998C10.3221 14 9.70005 14 8.45593 14H7.54407C6.29995 14 5.67789 14 5.18289 13.7998C4.75083 13.6235 4.39976 13.3412 4.16808 12.99C3.90603 12.5911 3.871 12.065 3.80095 11.0129L3.33333 4M6.66667 7V10.3333M9.33333 7V10.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="drag-handle">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4H6.01M10 4H10.01M6 8H6.01M10 8H10.01M6 12H6.01M10 12H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;