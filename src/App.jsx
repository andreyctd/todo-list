import { useState, useEffect, useCallback } from 'react';
import './App.css';
import styles from './App.module.css';
import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import TodoList from './features/TodoList/TodoList';

// Base URL without query params
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // New state for Airtable sorting parameters
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');

  // Function to construct the full URL with query parameters
  const encodeUrl = useCallback(() => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`;
    let searchQuery = '';

    if (queryString) {
      searchQuery = `&filterByFormula=SEARCH("${queryString}", title)`;
    }

    return encodeURI(`${url}?${sortQuery}${searchQuery}`);
  }, [sortField, sortDirection, queryString]);

  // const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setErrorMessage('');

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(encodeUrl(), options);

        if (!resp.ok) {
          throw new Error(
            `Request failed with status ${resp.status}: ${resp.statusText}`
          );
        }

        const data = await resp.json();

        const todos = data.records.map((record) => ({
          id: record.id,
          title: record.fields.title || '',
          isCompleted: record.fields.isCompleted || false,
        }));

        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [encodeUrl, token]);

  const addTodo = async (newTodo) => {
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted,
          },
        },
      ],
    };
    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      setIsSaving(true);

      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(
          `Failed to add todo: ${resp.status} ${resp.statusText}`
        );
      }

      const { records } = await resp.json();

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields,
      };

      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false;
      }

      setTodoList([...todoList, savedTodo]);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const updatedTodo = { ...originalTodo, isCompleted: true };

    // Optimistically update UI
    setTodoList(todoList.map((todo) => (todo.id === id ? updatedTodo : todo)));

    const payload = {
      records: [
        {
          id: updatedTodo.id,
          fields: {
            title: updatedTodo.title,
            isCompleted: updatedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(
          `Failed to mark todo complete: ${resp.status} ${resp.statusText}`
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList(
        todoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }
  };

  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    // Optimistically update the UI
    setTodoList(
      todoList.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo))
    );

    const payload = {
      records: [
        {
          id: editedTodo.id,
          fields: {
            title: editedTodo.title,
            isCompleted: editedTodo.isCompleted,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(encodeUrl(), options);
      if (!resp.ok) {
        throw new Error(
          `Failed to update todo: ${resp.status} ${resp.statusText}`
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList(
        todoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.appContent}>
        <h1>My Todos</h1>
        <TodoForm
          onAddTodo={addTodo}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
        <TodoList
          todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
          isLoading={isLoading}
        />

        <hr />

        <TodosViewForm
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          queryString={queryString}
          setQueryString={setQueryString}
        />

        {errorMessage && (
          <div className={styles.errorMessage}>
            <hr />
            <p>
              <span
                role="img"
                aria-label="error"
                style={{ marginRight: '0.5rem' }}
              >
                ❗⚠️❗
              </span>
              {errorMessage}
            </p>
            <button onClick={() => setErrorMessage('')}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
