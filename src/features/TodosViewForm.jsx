import React, { useEffect, useState } from 'react';

function TodosViewForm({
  sortField, setSortField, sortDirection, setSortDirection, queryString, setQueryString
}) {

  // Local input state for debouncing
  const [localQueryString, setLocalQueryString] = useState(queryString);

  // Prevent form submit from refreshing the page
  const preventRefresh = (event) => {
    event.preventDefault();
  };

  // Debounce effect: wait 500ms after typing stops to update queryString in App
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);                                // Adjust the delay as needed

    return () => clearTimeout(debounce);    // Cancel timeout if user keeps typing
  }, [localQueryString, setQueryString]);   // Only re-run if localQueryString changes

  return (
    <form onSubmit={preventRefresh}>
      {/* Search Input */}
      <div>
        <label htmlFor="search">Search todos: </label>
        <input
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </button>
      </div>

      {/* Sort Options */}
      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="sortField">Sort by</label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label htmlFor="sortDirection" style={{ marginLeft: '1rem' }}>
          Direction
        </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </form>
  );
}

export default TodosViewForm;
