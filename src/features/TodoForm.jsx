import React from 'react';
import { useState } from 'react';                 // Import useState hook from React

function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');  // State to manage the input value

    function handleAddTodo(event) {
        event.preventDefault();                   // Prevent the default form submission behavior

        {/*if (!workingTodoTitle.trim()) return;*/}     // Ignore empty submissions

        onAddTodo(workingTodoTitle);              // Call the parent function to add the todo
        setWorkingTodoTitle('');                  // Clear the input field
    }

    return (
      <form onSubmit={handleAddTodo}>
        <label htmlFor="todoTitle">Todo</label>
        <input                                                     // Input field for the todo title
            type="text"                                            // Input type for text                                        
            id="todoTitle"                                         // ID for the input field
            name="title"                                           // Name attribute for form submission
            value={workingTodoTitle}                               // Controlled input
            onChange={(e) => setWorkingTodoTitle(e.target.value)}  // Update state on input change
        />
        <button                                                    // Button to submit the form
            type="submit"                                          // Submit type for the button
            disabled={workingTodoTitle.trim() === ''}>            {/* Disable button if input is empty */}
            Add Todo
        </button>
      </form>
    );
}

export default TodoForm