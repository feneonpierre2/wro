import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helper?: string;
}

export function Input({ label, helper, className = '', ...props }: InputProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${className}`}
        {...props}
      />
      {helper && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}