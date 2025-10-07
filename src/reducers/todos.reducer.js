// Export actions for todos reducer
export const actions = {          // found in addTodo and in useEffect that loads todos

  // actions in useEffect that loads todos
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',

  // found in useEffect and addTodo to handle failed requests
  setLoadError: 'setLoadError',

  // actions found in addTodo
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',

  // found in helper functions
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',

  // reverts todos when requests fail
  revertTodo: 'revertTodo',

  // action on Dismiss Error button
  clearError: 'clearError',
  
  // actions for sort and search
    setSortField: 'setSortField',
    setSortDirection: 'setSortDirection',
    setQueryString: 'setQueryString',
};

// Export initial state for todos reducer
export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortDirection: 'desc',
  sortField: 'createdTime',
  queryString: '',
};

// Create reducer function
export function reducer(state = initialState, action) {
  switch (action.type) {
    // === PESSIMISTIC UI: useEffect ===
    case actions.fetchTodos:
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };

    case actions.loadTodos: {
        const todos = action.records.map((record) => ({
          id: record.id,
          title: record.fields.title || '',
          isCompleted: record.fields.isCompleted || false,
        }));

      return {
        ...state,
        todoList: todos,
        isLoading: false,
      };
    }

    case actions.setLoadError:
      return {
        ...state,
        errorMessage: action.error.message,
        isLoading: false,
        isSaving: false,
      };

    // === PESSIMISTIC UI: addTodo ===
    case actions.startRequest:
      return {
        ...state,
        isSaving: true,
        errorMessage: '',
      };

    case actions.addTodo:
      {
        const record = action.record;
        const savedTodo = {
          id: record.id,
          ...record.fields,
          isCompleted: record.fields.isCompleted || false,
        };

      return {
        ...state,
        todoList: [...state.todoList, savedTodo],
        isSaving: false,
      };
    }

    case actions.endRequest:
      return {
        ...state,
        isLoading: false,
        isSaving: false,
      };

    // === OPTIMISTIC UI: updateTodo, completeTodo, revertTodo ===
    case actions.revertTodo:
    // fallthrough to updateTodo
    case actions.updateTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.editedTodo.id ? action.editedTodo : todo
      );

      const updatedState = {
        ...state,
        todoList: updatedTodos,
      };

      if (action.error) {
        updatedState.errorMessage = action.error.message;
      }

      return updatedState;
    }

    case actions.completeTodo: {
      const updatedTodos = state.todoList.map((todo) =>
        todo.id === action.id ? { ...todo, isCompleted: true } : todo
      );

      return {
        ...state,
        todoList: updatedTodos,
      };
    }

    // === UI action: dismiss error ===
    case actions.clearError:
      return {
          ...state,
          errorMessage: '',
      };

    // === UI actions: sort and search ===
    case actions.setSortField:
      return {
        ...state,
        sortField: action.value,
      };

    case actions.setSortDirection:
      return {
        ...state,
        sortDirection: action.value,
      };

    case actions.setQueryString:
      return {
        ...state,
        queryString: action.value,
      };

    // === default ===
    default:
      return state;
  }
}