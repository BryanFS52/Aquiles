import React from 'react';

 
export default function Input(...props) {
  return (
    <input
      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-darkBlue outline-none focus:border-darkBlue focus-visible:shadow-none"
      {...props }
    />
  )
}
