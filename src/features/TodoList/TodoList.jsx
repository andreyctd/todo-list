import TodoListItem from './TodoListItem';
import styles from './TodoList.module.css';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
  const filteredTodoList = todoList.filter((todo) => !todo.isCompleted);

  if (isLoading) {
    return <p className={styles.loading}>Todo list loading...</p>;
  }

  return filteredTodoList.length === 0 ? (
    <p className={styles.emptyMessage}>Add todo above to get started</p>
  ) : (
    <ul className={styles.todoList}>
      {filteredTodoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
