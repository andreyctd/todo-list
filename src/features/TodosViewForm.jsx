import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  padding: 1rem 0;
`;

const StyledInput = styled.input`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  padding: 0.25rem;
`;

const StyledButton = styled.button`
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  color: white;
  background-color: #007BFF;  
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledSelect = styled.select`
  margin-left: 0.5rem;
  margin-right: 1rem;
  padding: 0.25rem;
`;

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
    <StyledForm onSubmit={preventRefresh}>
      {/* Search Input */}
      <div>
        <label htmlFor="search">Search todos: </label>
        <StyledInput
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <StyledButton type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </StyledButton>
      </div>

      {/* Sort Options */}
      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="sortField">Sort by</label>
        <StyledSelect
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>

        <label htmlFor="sortDirection" style={{ marginLeft: '1rem' }}>
          Direction
        </label>
        <StyledSelect
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </div>
    </StyledForm>
  );
}

export default TodosViewForm;
