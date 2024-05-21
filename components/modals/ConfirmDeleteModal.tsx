import React, { useCallback } from "react";
import { toast } from "react-hot-toast";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const handleConfirm = useCallback(async () => {
    try {
      await onConfirm();
      toast.success('User deleted successfully.');
      onClose();
    } catch (error) {
      toast.error('Failed to delete user.');
    }
  }, [onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Deletion</h2>
          <p className="mt-4 text-gray-600 text-center">Are you sure you want to delete this user?</p>
        </div>
        <div className="flex justify-between items-center px-6 py-4 mt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
