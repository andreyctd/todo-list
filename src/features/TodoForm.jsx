import React from 'react';
import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
padding: 1rem 0;`

const StyledButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    font-style: italic;
    color: #666;
    background-color: #ccc;
    cursor: not-allowed;
  }
`

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
      <StyledForm onSubmit={handleSubmit}>
        <TextInputWithLabel
          ref={todoTitleInput}
          value={workingTodoTitle}
          onChange={(e) => setWorkingTodoTitle(e.target.value)}
          elementId="todoTitle"
          labelText="Todo"
        />
        <StyledButton disabled={workingTodoTitle.trim() === ''}>
          {isSaving ? 'Saving...' : 'Add Todo'}
        </StyledButton>
      </StyledForm>
    );
}

export default TodoForm