import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Check, X } from 'lucide-react';
import './App.css';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  // Cargar todos desde localStorage al iniciar
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Guardar todos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <h1>Mi To-Do List</h1>
          <p>Organiza tus tareas de forma simple</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-number">{todos.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card stat-active">
            <div className="stat-number">{activeCount}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completadas</div>
          </div>
        </div>

        {/* Input */}
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Añadir nueva tarea..."
              className="todo-input"
            />
            <button onClick={addTodo} className="add-button">
              <Plus size={20} />
              Añadir
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          >
            Completadas
          </button>
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              {filter === 'all' && '¡No hay tareas! Añade una para empezar.'}
              {filter === 'active' && 'No hay tareas pendientes.'}
              {filter === 'completed' && 'No hay tareas completadas.'}
            </div>
          ) : (
            filteredTodos.map(todo => (
              <div key={todo.id} className="todo-item">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`checkbox ${todo.completed ? 'checked' : ''}`}
                >
                  {todo.completed && <Check size={16} />}
                </button>
                
                <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
                  {todo.text}
                </span>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Clear Completed */}
        {completedCount > 0 && (
          <div className="clear-completed-container">
            <button onClick={clearCompleted} className="clear-completed-button">
              <X size={18} />
              Eliminar completadas ({completedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
