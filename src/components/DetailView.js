import React, { useState } from 'react';

// tohle je detail jednoho seznamu - tady je všechno to důležitý
function DetailView({ 
  list, 
  currentUserId, 
  onArchive, 
  onAddMember, 
  onRemoveMember,
  onAddItem,
  onToggleItem,
  onRemoveItem,
  onUpdateListName
}) {
  const [itemFilter, setItemFilter] = useState('toBuy'); // filtr na zobrazení - buď co koupit nebo co už je hotový
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(list.name);
  
  // zjišťuju jestli jsem vlastnik seznamu (jenom vlastnik může mazat členy a tak)
  const isOwner = list.ownerId === currentUserId;
  console.log("jsem vlastnik?", isOwner);
  const unresolvedItems = list.items.filter(item => !item.resolved);
  const resolvedItems = list.items.filter(item => item.resolved);
  // console.log("nekoupeny:", unresolvedItems, "koupeny:", resolvedItems);

  // tohle zajišťuje editaci názvu - když klikneš na název, tak se to změní na input
  const handleNameClick = () => {
    if (isOwner) {
      setIsEditingName(true);
      setEditedName(list.name);
    }
  };

  // když klikneš pryč z inputu, tak se to uloží
  const handleNameBlur = () => {
    console.log("ukladam nazev:", editedName);
    if (editedName.trim() && editedName !== list.name) {
      onUpdateListName(editedName.trim());
    } else {
      setEditedName(list.name);  // nebo se vrátí původní název pokud je to prazdný
    }
    setIsEditingName(false);
  };

  // handluju enter a escape při editaci názvu
  const handleNameKeyDown = (e) => {
    // console.log("stiskl jsem klávesu:", e.key);
    if (e.key === 'Enter') {
      e.target.blur();  // enter = uložit
    } else if (e.key === 'Escape') {
      setEditedName(list.name);  // escape = zrušit
      setIsEditingName(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {isEditingName ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                autoFocus
                className="text-3xl font-bold text-gray-800 border-2 border-primary-500 rounded-lg px-3 py-1 outline-none"
              />
            ) : (
              <h1 
                className={`text-3xl font-bold text-gray-800 ${isOwner ? 'cursor-pointer hover:text-primary-600 transition-colors' : ''}`}
                onClick={handleNameClick}
                title={isOwner ? 'Klikněte pro úpravu názvu' : ''}
              >
                {list.name}
              </h1>
            )}
            {isOwner && (
              <button
                onClick={onArchive}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Archivovat
              </button>
            )}
          </div>
          
          <p className="text-gray-600">Spolupracujte s členy a spravujte nákupní položky</p>

          {/* Members Section */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="font-semibold text-gray-700">Členové týmu</h3>
                <span className="bg-gray-100 text-gray-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {list.members.length}
                </span>
              </div>
              
              {isOwner && (
                <button
                  onClick={onAddMember}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Přidat
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {list.members.map(member => (
                <div
                  key={member.userId}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <span>{member.name}</span>
                  {isOwner && (
                    <button
                      onClick={() => onRemoveMember(member.userId)}
                      className="text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">Nákupní položky</h2>
            </div>
            
            <button
              onClick={onAddItem}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Přidat položku
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setItemFilter('toBuy')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                itemFilter === 'toBuy'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-current"></span>
              Koupit ({unresolvedItems.length})
            </button>
            
            <button
              onClick={() => setItemFilter('done')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                itemFilter === 'done'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-current"></span>
              Hotovo ({resolvedItems.length})
            </button>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {itemFilter === 'toBuy' ? (
              unresolvedItems.length > 0 ? (
                unresolvedItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="w-6 h-6 rounded-md border-2 border-gray-300 hover:border-primary-500 transition-colors flex-shrink-0"
                    />
                    <span className="flex-1 text-gray-800">{item.name}</span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Žádné položky k nákupu</p>
              )
            ) : (
              resolvedItems.length > 0 ? (
                resolvedItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-lg"
                  >
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="w-6 h-6 rounded-md bg-primary-500 flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <span className="flex-1 text-gray-500 line-through">{item.name}</span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">Žádné hotové položky</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailView;

