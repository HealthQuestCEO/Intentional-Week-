import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    className = '',
    type = 'text',
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2 rounded-lg border border-gray-200
          bg-white text-charcoal placeholder-charcoal/40
          focus:outline-none focus:ring-2 focus:ring-balanced-teal focus:border-transparent
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

export const TextArea = forwardRef(function TextArea(
  {
    label,
    error,
    className = '',
    rows = 3,
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-3 py-2 rounded-lg border border-gray-200
          bg-white text-charcoal placeholder-charcoal/40
          focus:outline-none focus:ring-2 focus:ring-balanced-teal focus:border-transparent
          disabled:bg-gray-50 disabled:cursor-not-allowed
          resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select(
  {
    label,
    error,
    className = '',
    options = [],
    placeholder = 'Select...',
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-3 py-2 rounded-lg border border-gray-200
          bg-white text-charcoal
          focus:outline-none focus:ring-2 focus:ring-balanced-teal focus:border-transparent
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    className = '',
    ...props
  },
  ref
) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        className="w-5 h-5 rounded border-gray-300 text-balanced-teal focus:ring-balanced-teal"
        {...props}
      />
      {label && (
        <span className="text-sm text-charcoal">{label}</span>
      )}
    </label>
  );
});

export const TimePicker = forwardRef(function TimePicker(
  {
    label,
    error,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type="time"
        className={`
          w-full px-3 py-2 rounded-lg border border-gray-200
          bg-white text-charcoal
          focus:outline-none focus:ring-2 focus:ring-balanced-teal focus:border-transparent
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

export default Input;
