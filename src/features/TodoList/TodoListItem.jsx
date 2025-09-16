import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {   // Component to display each todo item   
  const [isEditing, setIsEditing] = useState(false);              // State to manage editing mode
  const [workingTitle, setWorkingTitle] = useState(todo.title);   // State to manage the title being edited

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleCancel () {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleUpdate(event) {
    if (!isEditing) return;
    event.preventDefault();

    onUpdateTodo({ ...todo, title: workingTitle });

    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              value={workingTitle}
              onChange={handleEdit}
              elementId={`editTodo${todo.id}`}
              labelText="Edit Todo"
            />
            <button
              type="button"
              onClick={handleCancel}
            >Cancel</button>
            <button 
              type="button"
              onClick={handleUpdate}
            >Update</button>
          </>
        ) : (
            <>
               <label>
                   <input
                       type="checkbox"
                       id={`checkbox${todo.id}`}
                       checked={todo.isCompleted}
                       onChange={() => onCompleteTodo(todo.id)}
                   />
               </label>
               <span onClick={() => setIsEditing(true)}>{todo.title}</span>
            </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
