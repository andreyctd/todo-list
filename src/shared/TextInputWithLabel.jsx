import React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
    font-size: 1rem;
`;

const StyledInput = styled.input`
    margin-left: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

function TextInputWithLabel({
    elementId,
    labelText,
    onChange,
    ref,
    value,
}) {
    return (
        <>
            <StyledLabel htmlFor={elementId}>{labelText}</StyledLabel>
            <StyledInput
                type="text"
                id={elementId}
                ref={ref}
                value={value}
                onChange={onChange}
            />
        </>
    );
}

export default TextInputWithLabel;