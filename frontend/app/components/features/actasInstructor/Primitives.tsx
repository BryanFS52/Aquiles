import React from 'react';

export const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
  <div className={`rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-md ring-1 ring-lightGray/60 dark:ring-dark-border shadow-xl p-5 md:p-6 animate-fade-in-up ${className}`}>
    {children}
  </div>
);

export const Label: React.FC<React.PropsWithChildren<{ htmlFor?: string }>> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-secondary">
    {children}
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`mt-1 w-full rounded-xl border border-gray-300/70 dark:border-dark-border bg-white/90 dark:bg-dark-card/90 backdrop-blur px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary ${props.className || ''}`}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`mt-1 w-full rounded-xl border border-gray-300/70 dark:border-dark-border bg-white/90 dark:bg-dark-card/90 backdrop-blur px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary ${props.className || ''}`}
  />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className={`mt-1 w-full rounded-xl border border-gray-300/70 dark:border-dark-border bg-white/90 dark:bg-dark-card/90 backdrop-blur px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary ${props.className || ''}`}
  />
);
