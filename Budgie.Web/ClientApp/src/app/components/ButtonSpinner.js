import React from 'react';

export const ButtonSpinner = ({ buttonClass = 'is-primary', loading, text, handleClick }) => {
    const className = loading ? `button ${buttonClass} is-loading` : `button ${buttonClass}`;
    return (
        <button className={className} onClick={handleClick}>
            {text}
        </button>
    );
}