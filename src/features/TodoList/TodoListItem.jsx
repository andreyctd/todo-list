import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoListItem.module.css';
// import CheckIcon from '../CheckIcon';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {   // Component to display each todo item   
  const [isEditing, setIsEditing] = useState(false);              // State to manage editing mode
  const [workingTitle, setWorkingTitle] = useState(todo.title);   // State to manage the title being edited


  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  /* const handle = () => {
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }; */

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
    <li className={styles.todoItem}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              value={workingTitle}
              onChange={handleEdit}
              elementId={`editTodo${todo.id}`}
              labelText="Edit Todo"
            />
            <div className={styles.formActions}>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
              <button type="button" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </>
        ) : (
            <>
               <label className={styles.checkbox}>
                   <input
                       type="checkbox"
                       id={`checkbox${todo.id}`}
                       checked={todo.isCompleted}
                       onChange={() => onCompleteTodo(todo.id)}
                   />
               </label>
              <span className={styles.todoTitle}
                onClick={() => setIsEditing(true)}>{todo.title}</span>
            </>
              /* <>
              <CheckIcon
              checked={todo.isCompleted}
              onClick={() => onCompleteTodo(todo.id)}
              />
              <span className={styles.todoTitle}
              onClick={() => setIsEditing(true)}>{todo.title}</span>
              </> */
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
