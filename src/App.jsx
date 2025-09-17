import { useState, useEffect } from 'react';
import './App.css';
import TodoForm from './features/TodoForm';
import TodoList from './features/TodoList/TodoList';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  useEffect(() => {
    const fetchTodos = async () => {
          setIsLoading(true);

          const options = {
            method: 'GET',
            headers: {
              Authorization: token,
            },
          };

          try {
            const resp = await fetch(url, options);

            if (!resp.ok) {
              throw new Error(resp.message);
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
  }, [ url, token ]);

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

      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error('Failed to add todo');
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

  /*const addTodo = async (title) => {
    setIsSaving(true);

    const newTodo = { fields: { title, id: Date.now(), isCompleted: false }};
    setTodoList([...todoList, newTodo]);
  };

  const completeTodo = (id) => {
    const updatedTodos = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    );
    setTodoList(updatedTodos);
  }; */

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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error('Failed to mark todo complete');
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
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error('Failed to update todo');
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
  /* const updateTodo = (editedTodo) => {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }; */

  return (
    <div>
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

      {errorMessage && (
        <div className="error-message">
          <hr />
          <p>{errorMessage}</p>
          <button onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App;
