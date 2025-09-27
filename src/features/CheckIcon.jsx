import React from 'react';

function CheckIcon({ checked, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        cursor: 'pointer',
        fontSize: '1.2rem',
        marginRight: '0.5rem',
        userSelect: 'none',
      }}
      title={checked ? 'Completed' : 'Mark as complete'}
    >
      {checked ? '✅' : '⬜'}
    </span>
  );
}

export default CheckIcon;
