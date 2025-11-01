import React, { useState } from 'react';

// modální okno pro přidávání položek do seznamu
function AddItemModal({ isOpen, onClose, onAdd }) {
  const [itemName, setItemName] = useState('');

  if (!isOpen) return null;  // když není otevřený, tak nerendrujem nic

  const handleSubmit = (e) => {
    e.preventDefault();  // aby to nerefreshlo stránku
    console.log("pridavam polozku:", itemName);
    if (itemName.trim()) {  // kontrola jestli není prázdný
      onAdd(itemName.trim());
      setItemName('');  // vymažu input po přidání
    }
  };

  // při zavření modalu musim vyčistit input jinak by tam zůstalo to co člověk napsal
  const handleClose = () => {
    setItemName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Přidat položku</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-2">
              Název položky
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder="Např. Mléko, Chléb..."
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!itemName.trim()}
            >
              Přidat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;

