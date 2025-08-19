import React from 'react';
import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');  // State to manage the input value
  const Ref = useRef(null);                                      // Reference to the input element

    function handleAddTodo(event) {
        event.preventDefault();                   // Prevent the default form submission behavior

        {/*if (!workingTodoTitle.trim()) return;*/}     // Ignore empty submissions

        onAddTodo(workingTodoTitle);              // Call the parent function to add the todo
        setWorkingTodoTitle('');                  // Clear the input field
    }

    return (
      <form onSubmit={handleAddTodo}>
        <TextInputWithLabel                                       
          elementId="todoTitle"                                  // ID for the input field
          labelText="Todo"                                       // Label for the input field
          value={workingTodoTitle}                               // Controlled input
          onChange={(e) => setWorkingTodoTitle(e.target.value)}  // Update state on input change
          ref={Ref}
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