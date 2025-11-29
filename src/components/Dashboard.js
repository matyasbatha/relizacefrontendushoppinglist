import React, { useState, useEffect } from 'react';
import { initialShoppingLists, currentUser } from '../data/initialData';
import * as api from '../services/api';
import Sidebar from './Sidebar';
import DetailView from './DetailView';
import AddMemberModal from './AddMemberModal';
import AddItemModal from './AddItemModal';
import AddListModal from './AddListModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

// hlavní komponenta pro celou aplikaci - tady se děje všechna ta magie
function Dashboard() {
  // tady si držim všechny seznamy, aktuálně vybranej seznam a jestli ukazovat archivované
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);  // sem ukladam ID seznamu co chci smazat
  
  // stavy pro loading a errory - podle zadani musim mit pending/error/ready
  const [loadingState, setLoadingState] = useState('pending');
  const [error, setError] = useState(null);
  
  console.log("Dashboard render - pocet seznamu:", shoppingLists.length, "stav:", loadingState);

  // useEffect pro nacteni dat pri startu - musim pouzit aby to nacetlo data z API
  useEffect(() => {
    loadData();
  }, []); // prazdny array = spusti se jen pri prvnim renderu

  // funkce pro načtení seznamů z API (nebo mock)
  const loadData = async () => {
    console.log("Nacitam data z API...");
    setLoadingState('pending');
    setError(null);
    
    // inicializace mock dat (kdyby USE_MOCK = true)
    api.initMockData(initialShoppingLists, currentUser);
    
    // nacteni seznamu
    const { data, error } = await api.getAllLists();
    
    if (error) {
      console.error("Chyba pri nacitani:", error);
      setError(error);
      setLoadingState('error');
    } else {
      console.log("Data nactena OK, pocet seznamu:", data.length);
      setShoppingLists(data);
      setLoadingState('ready');
      // vyber prvni seznam pokud jeste neni nic vybrano
      if (!selectedListId && data.length > 0) {
        setSelectedListId(data[0].id);
      }
    }
  };

  // najdu si aktuálně vybranej seznam ze všech seznamů
  const selectedList = shoppingLists.find(list => list.id === selectedListId);
  console.log("vybranej seznam:", selectedList);

  // tady filtrujem seznamy podle toho jestli chcem vidět archivovaný nebo ne
  // trochu mi to dalo zabrat tuhle logiku vymyslet ale funguje to
  const displayedLists = shoppingLists.filter(list => 
    showArchived ? list.archived : !list.archived
  );
  console.log("zobrazeny seznamy", displayedLists);

  // vytvářím novej seznam s názvem od uživatele - teď už přes API
  const handleCreateList = async (listName) => {
    console.log("vytvarim novej seznam s nazvem:", listName);
    setError(null); // resetuju error
    
    const { data, error } = await api.createList(listName);
    
    if (error) {
      console.error("Chyba pri vytvareni seznamu:", error);
      setError(error);
    } else {
      console.log("novej seznam vytvoren:", data);
      setShoppingLists([...shoppingLists, data]);
      setSelectedListId(data.id);
      setIsAddListModalOpen(false);
    }
  };

  // otevření potvrzovacího dialogu pro smazání
  const handleDeleteList = (listId) => {
    console.log("chci smazat seznam:", listId);
    setListToDelete(listId);
    setIsConfirmDeleteOpen(true);
  };

  // skutečné smazání až po potvrzení (předtim to mazalo hned bez ptaní)
  const confirmDeleteList = async () => {
    console.log("mazu seznam s ID:", listToDelete);
    setError(null);
    
    const { error } = await api.deleteList(listToDelete);
    
    if (error) {
      console.error("Chyba pri mazani seznamu:", error);
      setError(error);
    } else {
      const updatedLists = shoppingLists.filter(list => list.id !== listToDelete);
      setShoppingLists(updatedLists);
      // když smažu aktuálně vybranej seznam tak vyberu jinej
      if (selectedListId === listToDelete) {
        setSelectedListId(updatedLists[0]?.id || null);
      }
    }
    
    setIsConfirmDeleteOpen(false);
    setListToDelete(null);
  };

  const handleArchiveList = async (listId) => {
    console.log("archivace toggle pro seznam:", listId);
    setError(null);
    
    const list = shoppingLists.find(l => l.id === listId);
    const newArchivedState = !list.archived;
    
    const { error } = await api.archiveList(listId, newArchivedState);
    
    if (error) {
      console.error("Chyba pri archivaci:", error);
      setError(error);
    } else {
      setShoppingLists(shoppingLists.map(l =>
        l.id === listId ? { ...l, archived: newArchivedState } : l
      ));
    }
  };

  const handleAddMember = async (memberName) => {
    console.log("pridavam clena:", memberName);
    setError(null);
    
    const { data, error } = await api.addMember(selectedListId, memberName);
    
    if (error) {
      console.error("Chyba pri pridavani clena:", error);
      setError(error);
    } else {
      setShoppingLists(shoppingLists.map(list =>
        list.id === selectedListId
          ? { ...list, members: [...list.members, data] }
          : list
      ));
      setIsAddMemberModalOpen(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    console.log("odebiram clena:", memberId);
    setError(null);
    
    const { error } = await api.removeMember(selectedListId, memberId);
    
    if (error) {
      console.error("Chyba pri odebirani clena:", error);
      setError(error);
    } else {
      setShoppingLists(shoppingLists.map(list =>
        list.id === selectedListId
          ? { ...list, members: list.members.filter(m => m.userId !== memberId) }
          : list
      ));
    }
  };

  // pridavam novou položku do seznamu - přes API
  const handleAddItem = async (itemName) => {
    console.log("pridavam polozku:", itemName);
    setError(null);
    
    const { data, error } = await api.addItem(selectedListId, itemName);
    
    if (error) {
      console.error("Chyba pri pridavani polozky:", error);
      setError(error);
    } else {
      setShoppingLists(shoppingLists.map(list =>
        list.id === selectedListId
          ? { ...list, items: [...list.items, data] }
          : list
      ));
      setIsAddItemModalOpen(false);
    }
  };

  // přepínání položky mezi koupeným a nekoupeným (zaškrtávání)
  // tady musim mapovat seznam a pak ještě položky v něm
  const handleToggleItem = async (itemId) => {
    console.log("probiha toggle pro item:", itemId);
    setError(null);
    
    const currentList = shoppingLists.find(l => l.id === selectedListId);
    const item = currentList.items.find(i => i.id === itemId);
    const newResolvedState = !item.resolved;
    
    const { error } = await api.toggleItemResolved(selectedListId, itemId, newResolvedState);
    
    if (error) {
      console.error("Chyba pri toggle polozky:", error);
      setError(error);
    } else {
      setShoppingLists(shoppingLists.map(list =>
        list.id === selectedListId
          ? {
              ...list,
              items: list.items.map(i =>
                i.id === itemId ? { ...i, resolved: newResolvedState } : i
              )
            }
          : list
      ));
    }
  };

  const handleRemoveItem = async (itemId) => {
    console.log("mazu polozku:", itemId);
    setError(null);
    
    const { error } = await api.deleteItem(selectedListId, itemId);
    
    if (error) {
      console.error("Chyba pri mazani polozky:", error);
      setError(error);
    } else {
      setShoppingLists(shoppingLists.map(list =>
        list.id === selectedListId
          ? { ...list, items: list.items.filter(item => item.id !== itemId) }
          : list
      ));
    }
  };

  const handleUpdateListName = async (newName) => {
    console.log("updatuju nazev seznamu:", newName);
    setError(null);
    
    const { error } = await api.updateListName(selectedListId, newName);
    
    if (error) {
      console.error("Chyba pri update nazvu:", error);
      setError(error);
    } else {
      setShoppingLists(shoppingLists.map(list =>
        list.id === selectedListId
          ? { ...list, name: newName }
          : list
      ));
    }
  };

  // loading stav - zobrazim spinner (podle zadani pending state)
  if (loadingState === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Načítám data...</p>
        </div>
      </div>
    );
  }

  // error stav - zobrazim chybu a tlacitko na znovu nacteni (podle zadani error state)
  if (loadingState === 'error' && shoppingLists.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Chyba při načítání dat</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Zkusit znovu
          </button>
        </div>
      </div>
    );
  }

  // ready stav - zobrazim appku (podle zadani ready state)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Error banner nahore pokud je nejaka chyba (error handling podle zadani) */}
      {error && (
        <div className="bg-red-100 border-b-2 border-red-400 text-red-700 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 h-screen">
        <Sidebar
          lists={displayedLists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onCreateList={() => setIsAddListModalOpen(true)}
          onDeleteList={handleDeleteList}
          showArchived={showArchived}
          onToggleArchived={() => setShowArchived(!showArchived)}
          currentUserId={currentUser.id}
        />
        
        {selectedList ? (
          <DetailView
            list={selectedList}
            currentUserId={currentUser.id}
            onArchive={() => handleArchiveList(selectedList.id)}
            onAddMember={() => setIsAddMemberModalOpen(true)}
            onRemoveMember={handleRemoveMember}
            onAddItem={() => setIsAddItemModalOpen(true)}
            onToggleItem={handleToggleItem}
            onRemoveItem={handleRemoveItem}
            onUpdateListName={handleUpdateListName}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Vyber si nějakej seznam nebo vytvoř novej</p>
          </div>
        )}

        <AddListModal
          isOpen={isAddListModalOpen}
          onClose={() => setIsAddListModalOpen(false)}
          onAdd={handleCreateList}
        />

        <ConfirmDeleteModal
          isOpen={isConfirmDeleteOpen}
          onClose={() => {
            setIsConfirmDeleteOpen(false);
            setListToDelete(null);
          }}
          onConfirm={confirmDeleteList}
          listName={shoppingLists.find(list => list.id === listToDelete)?.name || ''}
        />

        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onAdd={handleAddMember}
        />

        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => setIsAddItemModalOpen(false)}
          onAdd={handleAddItem}
        />
      </div>
    </div>
  );
}

export default Dashboard;

