import React from 'react';
import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');  // State to manage the input value
  const todoTitleInput = useRef(null);                           // Ref for the input element

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
        todoTitleInput.current.focus();
    };

    return (
      <form onSubmit={handleSubmit}>
        <TextInputWithLabel
          ref={todoTitleInput}
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
          elementId="todoTitle"
          labelText="Todo"
        />
        <button disabled={workingTodoTitle.trim() === ''}>
          {isSaving ? 'Saving...' : 'Add Todo'}
        </button>
      </form>
    );
}

export default TodoForm