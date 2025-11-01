import React, { useState } from 'react';
import { initialShoppingLists, currentUser } from '../data/initialData';
import Sidebar from './Sidebar';
import DetailView from './DetailView';
import AddMemberModal from './AddMemberModal';
import AddItemModal from './AddItemModal';

// hlavní komponenta pro celou aplikaci - tady se děje všechna ta magie
function Dashboard() {
  // tady si držim všechny seznamy, aktuálně vybranej seznam a jestli ukazovat archivované
  const [shoppingLists, setShoppingLists] = useState(initialShoppingLists);
  const [selectedListId, setSelectedListId] = useState('list1');
  const [showArchived, setShowArchived] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  
  console.log("Dashboard render - pocet seznamu:", shoppingLists.length);

  // najdu si aktuálně vybranej seznam ze všech seznamů
  const selectedList = shoppingLists.find(list => list.id === selectedListId);
  console.log("vybranej seznam:", selectedList);

  // tady filtrujem seznamy podle toho jestli chcem vidět archivovaný nebo ne
  // trochu mi to dalo zabrat tuhle logiku vymyslet ale funguje to
  const displayedLists = shoppingLists.filter(list => 
    showArchived ? list.archived : !list.archived
  );
  console.log("zobrazeny seznamy", displayedLists);

  // vytvářím novej seznam - použil jsem timestamp jako ID, snad to nikdy nekoliduje lol
  const handleCreateList = () => {
    console.log("vytvarim novej seznam");
    const newList = {
      id: `list${Date.now()}`,
      name: 'Nový seznam',
      ownerId: currentUser.id,
      members: [],
      items: [],
      archived: false
    };
    console.log("novej seznam:", newList);
    setShoppingLists([...shoppingLists, newList]);
    setSelectedListId(newList.id);
  };

  const handleDeleteList = (listId) => {
    console.log("mazu seznam s ID:", listId);
    setShoppingLists(shoppingLists.filter(list => list.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(displayedLists[0]?.id || null);
    }
  };

  const handleArchiveList = (listId) => {
    setShoppingLists(shoppingLists.map(list => 
      list.id === listId ? { ...list, archived: !list.archived } : list
    ));
  };

  const handleAddMember = (memberName) => {
    const newMember = {
      id: `member${Date.now()}`,
      name: memberName
    };
    setShoppingLists(shoppingLists.map(list => 
      list.id === selectedListId 
        ? { ...list, members: [...list.members, newMember] }
        : list
    ));
    setIsAddMemberModalOpen(false);
  };

  const handleRemoveMember = (memberId) => {
    setShoppingLists(shoppingLists.map(list => 
      list.id === selectedListId 
        ? { ...list, members: list.members.filter(m => m.id !== memberId) }
        : list
    ));
  };

  // pridavam novou položku do seznamu
  const handleAddItem = (itemName) => {
    // const timestamp = Date.now(); // tohle jsem chtěl použit pro debug ale pak jsem to nedal
    const newItem = {
      id: `item${Date.now()}`,
      name: itemName,
      resolved: false  // resolved znamená jestli už je koupený
    };
    setShoppingLists(shoppingLists.map(list => 
      list.id === selectedListId 
        ? { ...list, items: [...list.items, newItem] }
        : list
    ));
    setIsAddItemModalOpen(false);
  };

  // přepínání položky mezi koupeným a nekoupeným (zaškrtávání)
  // tady musim mapovat seznam a pak ještě položky v něm - nested mapování je dost složitý
  const handleToggleItem = (itemId) => {
    console.log("probiha toggle pro item:", itemId);
    setShoppingLists(shoppingLists.map(list => 
      list.id === selectedListId 
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, resolved: !item.resolved } : item
            )
          }
        : list
    ));
  };

  const handleRemoveItem = (itemId) => {
    setShoppingLists(shoppingLists.map(list => 
      list.id === selectedListId 
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  const handleUpdateListName = (newName) => {
    setShoppingLists(shoppingLists.map(list => 
      list.id === selectedListId 
        ? { ...list, name: newName }
        : list
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        lists={displayedLists}
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
        onCreateList={handleCreateList}
        onDeleteList={handleDeleteList}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived(!showArchived)}
        currentUserId={currentUser.id}
      />
      
      {selectedList && (
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
      )}

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
  );
}

export default Dashboard;

