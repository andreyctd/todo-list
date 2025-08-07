import React from 'react';
import { useRef } from 'react';  

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef(null);            // Ref for the input field

    function handleAddTodo(event) {
        event.preventDefault();                   // Prevent the default form submission behavior

        const title = event.target.title.value;   // Get the value from the input field
        onAddTodo(title);                         // Call the function passed via props to add the new todo
        event.target.title.value = '';            // Clear input field after submission
        todoTitleInput.current.focus();           // Focus back on the input field
    }

    return (
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input type="text" id="todoTitle" name="title" ref={todoTitleInput} />
        <button type="submit">Add Todo</button>
      </form>
    );
}

export default TodoForm