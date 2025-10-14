import { useEffect, useCallback, useReducer, useState } from 'react';
import './App.css';
import styles from './App.module.css';
/*   import TodoForm from './features/TodoForm';
import TodosViewForm from './features/TodosViewForm';
import TodoList from './features/TodoList/TodoList';   */
import {
  reducer as todosReducer,
  actions as todoActions,
  initialState as initialTodosState,
} from './reducers/todos.reducer';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './shared/Header';
import TodosPage from './pages/TodosPage';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Base URL without query params
const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;

function App() {

  /*   // OLD useState hooks to remove
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);   */

  const [todoState, dispatch] = useReducer(todosReducer, initialTodosState);
  const location = useLocation();     // To get current route path
  const [ title, setTitle ] = useState('Todo List');   // State for header title

  // Destructure state for cleaner usage
  const { todoList, isLoading, errorMessage, isSaving, sortField, sortDirection, queryString, 
  } = todoState;

  useEffect(() => {
    // Update title based on current route
    if (location.pathname === '/') setTitle('Todo List');
    else if (location.pathname === '/about') setTitle('About');
    else setTitle('Not Found');
  }, [location]);

  /*   // New state for Airtable sorting parameters
  const [sortField, setSortField] = useState('createdTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [queryString, setQueryString] = useState('');   */

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

  // Fetch todos from Airtable on component mount and when sort/query params change
  useEffect(() => {
    const fetchTodos = async () => {
      dispatch({ type: todoActions.fetchTodos });

      /*   setIsLoading(true);
           setErrorMessage('');   */

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

        /*   const todos = data.records.map((record) => ({
          id: record.id,
          title: record.fields.title || '',
          isCompleted: record.fields.isCompleted || false,
        }));

        setTodoList(todos);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);   */

        dispatch({ type: todoActions.loadTodos, records: data.records });
      } catch (error) {
        dispatch({ type: todoActions.setLoadError, error });
      }
    };

    fetchTodos();
  }, [encodeUrl, token]);

  // Function to add a new todo
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

    dispatch({ type: todoActions.startRequest });

    try {
      //   setIsSaving(true);

      const resp = await fetch(encodeUrl(), options);

      if (!resp.ok) {
        throw new Error(
          `Failed to add todo: ${resp.status} ${resp.statusText}`
        );
      }

      const { records } = await resp.json();

      /*   const savedTodo = {
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
      setIsSaving(false);   */

      dispatch({ type: todoActions.addTodo, record: records[0] });
    } catch (error) {
      dispatch({ type: todoActions.setLoadError, error });
    } finally {
      dispatch({ type: todoActions.endRequest });
    }
  };

  // Function to mark a todo as complete
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((todo) => todo.id === id);
    //   const updatedTodo = { ...originalTodo, isCompleted: true };

    // Optimistically update UI

    //   setTodoList(todoList.map((todo) => (todo.id === id ? updatedTodo : todo)));

    dispatch({ type: todoActions.completeTodo, id });

    // Send the update to the server

    const payload = {
      records: [
        {
          id: originalTodo.id,
          fields: {
            title: originalTodo.title,
            isCompleted: true,
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

      /*   console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList(
        todoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );   */
      
      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
      });
    }
  };

  // Function to update a todo's title
  const updateTodo = async (editedTodo) => {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    // Optimistically update the UI

    /*   setTodoList(
      todoList.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo))
    );   */

    dispatch({ type: todoActions.updateTodo, editedTodo });

    // Send the update to the server

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

      /*   console.error(error);
      setErrorMessage(`${error.message}. Reverting todo...`);
      setTodoList(
        todoList.map((todo) =>
          todo.id === originalTodo.id ? originalTodo : todo
        )
      );   */

      dispatch({
        type: todoActions.revertTodo,
        editedTodo: originalTodo,
        error,
       });
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.appContent}>

        {/*   <h1>My Todos</h1>
        <TodoForm
          onAddTodo={addTodo}
          isSaving={isSaving}
          //   setIsSaving={setIsSaving}
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
          setSortField={(value) => dispatch({ type: todoActions.setSortField, value })}
          sortDirection={sortDirection}
          setSortDirection={(value) => dispatch({ type: todoActions.setSortDirection, value })}
          queryString={queryString}
          setQueryString={(value) => dispatch({ type: todoActions.setQueryString, value })}
        />   */}

        <Header title={title} />
        <Routes>
          <Route 
            path="/" 
            element={
              <TodosPage
                todoList={todoList}
                onAddTodo={addTodo}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                isLoading={isLoading}
                isSaving={isSaving}
                errorMessage={errorMessage}
                sortField={sortField}
                setSortField={(value) => dispatch({ type: todoActions.setSortField, value: value })}
                sortDirection={sortDirection}
                setSortDirection={(value) => dispatch({ type: todoActions.setSortDirection, value: value })}
                queryString={queryString}
                setQueryString={(value) => dispatch({ type: todoActions.setQueryString, value: value })}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Error message display */}

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
            <button onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
