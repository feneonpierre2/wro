import React from 'react';

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  step?: string;
}

export function FormContainer({ children, title, subtitle, step }: FormContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-100 pt-20">
      <div className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step && (
            <div className="inline-block bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
              {step}
            </div>
          )}
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mb-8">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}