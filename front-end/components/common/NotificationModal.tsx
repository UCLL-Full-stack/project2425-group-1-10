import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title: string;
    description: string;
    onConfirm?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
    isOpen,
    onClose,
    type,
    title,
    description,
    onConfirm,
}) => {
    if (!isOpen) return null;

    const icon =
        type === 'success' ? (
            <FaCheck className="text-2xl text-green-500" />
        ) : (
            <FaTimes className="text-2xl text-red-500" />
        );

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[600px] z-50">
                <div className="flex items-center mb-4">
                    <span className="mr-3">{icon}</span>
                    <h2 className="text-xl font-semibold flex-grow">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="mb-6">
                    <p
                        className={`${
                            type === 'success' ? 'text-green-800 font-medium' : 'text-red-800'
                        }`}
                    >
                        {description}
                    </p>
                </div>

                <div className="flex justify-end gap-2">
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white font-medium rounded hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-rose-400 text-white font-medium rounded hover:bg-rose-500 transition-colors"
                    >
                        {onConfirm ? 'Cancel' : 'OK'}
                    </button>
                </div>
            </div>
        </>
    );
};
