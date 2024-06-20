import React from 'react';
const Label = ({ children,...props }) => {
  return (
    <label
      className="mb-2.5 block font-medium text-darkBlue"
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;