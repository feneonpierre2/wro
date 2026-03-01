import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

const Notification = ({ type, message, onClose }: NotificationProps) => {
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-sm p-4 ${bgColor} rounded-lg shadow-lg z-50`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${textColor}`} />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <button
            className={`ml-4 inline-flex flex-shrink-0 ${textColor} hover:opacity-75`}
            onClick={onClose}
          >
            <span className="sr-only">Fermer</span>
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;