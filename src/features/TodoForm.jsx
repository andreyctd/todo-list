import React from 'react';
import { useState } from 'react';
// import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');  // State to manage the input value

    const handleSubmit = async (event) => {
        event.preventDefault();                   // Prevent the default form submission behavior

      const trimmedTitle = workingTodoTitle.trim();
      if (!trimmedTitle) return;
    
        const newTodo = {
          title: trimmedTitle,
          isCompleted: false,
        };
    
        await onAddTodo(newTodo);
        setWorkingTodoTitle('');
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
          placeholder="Enter todo"
        />
        <button disabled={workingTodoTitle.trim() === ''}>
          {isSaving ? 'Saving...' : 'Add Todo'}
        </button>
      </form>
    );
}

export default TodoForm