import React from 'react';

function CustomShoeIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 18H6a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h10c4 0 4 6 0 6v2a4 4 0 0 1 4 4v4a2 2 0 0 1-2 2Z"/>
      <path d="M4 14h16"/>
    </svg>
  );
}

export default CustomShoeIcon;