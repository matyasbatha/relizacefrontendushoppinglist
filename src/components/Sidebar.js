import React from 'react';

// levý panel se seznamem všech shopping listů
function Sidebar({ 
  lists, 
  selectedListId, 
  onSelectList, 
  onCreateList, 
  onDeleteList,
  showArchived,
  onToggleArchived,
  currentUserId 
}) {
  return (
    <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
      {/* hlavička s logem a tlačítkem na nový seznam */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-primary-700">KupTo</h1>
        </div>
        
        <button
          onClick={onCreateList}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nový seznam
        </button>
      </div>

      {/* tady se vykreslujou všechny seznamy */}
      <div className="flex-1 overflow-y-auto p-4">
        {lists.map(list => {
          const isSelected = list.id === selectedListId;
          const isOwner = list.ownerId === currentUserId;
          const itemCount = list.items.length;
          const memberCount = list.members.length;  // počítám kolik je tam položek a členů
          // console.log(list.name, "ma", itemCount, "polozek");

          return (
            <div
              key={list.id}
              className={`mb-3 p-4 rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-primary-100 border-2 border-primary-500' 
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{list.name}</h3>
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // důležitý jinak by se vyvolal onClick i na celým divu
                      onDeleteList(list.id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{itemCount} položek</span>
                <span>•</span>
                <span>{memberCount} členů</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Archived button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onToggleArchived}
          className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          {showArchived ? 'Aktivní seznamy' : 'Archivované'}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;

