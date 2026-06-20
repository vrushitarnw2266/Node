import React from 'react';

export const Input = ({
  label,
  type = 'text',
  placeholder = '',
  name,
  value,
  onChange,
  error,
  required = false,
  options = [], // For select input
  rows = 4, // For textarea
  className = '',
  icon,
}) => {
  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
    error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 dark:border-slate-800'
  } ${icon ? 'pl-11' : ''}`;

  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}

        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`${inputClass} appearance-none cursor-pointer`}
          >
            <option value="" disabled>{placeholder || 'Select option'}</option>
            {options.map((opt) => (
              <option key={opt.value || opt} value={opt.value !== undefined ? opt.value : opt} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                {opt.label || opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={inputClass}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClass}
          />
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 font-medium pl-1 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
