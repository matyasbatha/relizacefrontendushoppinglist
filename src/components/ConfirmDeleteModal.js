import React from 'react';

// potvrzovací modal pro mazání seznamu - chtěl jsem to nejdřív dělat přes window.confirm() ale tohle vypadá lip
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, listName }) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    console.log("potvrzuji smazani");
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 md:p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Smazat seznam?</h2>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          Opravdu chcete smazat seznam <span className="font-semibold">"{listName}"</span>? 
          Tato akce je nenávratná a smažou se i všechny položky a členi.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Zrušit
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Smazat
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;

