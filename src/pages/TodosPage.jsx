import React from 'react';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';

function TodosPage({
  todoList,
  isLoading,
  isSaving,
  sortField,
  sortDirection,
  queryString,
  onAddTodo,
  onCompleteTodo,
  onUpdateTodo,
  setSortField,
  setSortDirection,
  setQueryString,
}) {
  // react-router hooks for managing URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemsPerPage = 15;     // Define how many items per page
  const currentPage = parseInt(searchParams.get('page') || '1', 10); // Current page from URL, default to 1

  // Fallback in case there are no todos yet
  const filteredTodoList = todoList;     // You can add filtering logic here if needed

  // Calculate pagination details
  const indexOfFirstTodo = (currentPage - 1) * itemsPerPage;
  const indexOfLastTodo = indexOfFirstTodo + itemsPerPage;

  // Get only the todos for this page
  const paginatedTodos = filteredTodoList.slice(indexOfFirstTodo, indexOfLastTodo);

  const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage);

  // Handlers for pagination buttons
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: (currentPage - 1).toString() });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: (currentPage + 1).toString() });
    }
  };

  // Ensure currentPage is within valid range when todoList changes
  useEffect(() => {
    if (totalPages > 0) {
      if (
        isNaN(currentPage) ||
        currentPage < 1 ||
        currentPage > totalPages
      ) {
        navigate('/');      // Redirect to first page if out of bounds
      }
    }
  }, [currentPage, totalPages, navigate]);

  return (
    <>
      <TodoForm onAddTodo={onAddTodo} isSaving={isSaving} />
      <TodoList
        todoList={paginatedTodos} // Pass only the todos for the current page
        onCompleteTodo={onCompleteTodo} // Pass the complete handler
        onUpdateTodo={onUpdateTodo} // Pass the update handler
        isLoading={isLoading} // Pass loading state
      />

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div
          className="paginationControls"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '1rem',
          }}
        >
          <button
            onClick={handlePreviousPage}
            disabled={totalPages === 0 || currentPage === 1}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={totalPages === 0 || currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <hr />
      
      <TodosViewForm
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        queryString={queryString}
        setQueryString={setQueryString}
      />
    </>
  );
}

export default TodosPage;