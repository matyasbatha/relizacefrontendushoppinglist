// API service pro komunikaci s backendem
// prepinac mezi mock daty a real API (pro odevzdani musi byt TRUE)

const USE_MOCK = true;  // PREPINAC - pro odevzdani TRUE

const API_BASE_URL = 'http://localhost:3001';
const MOCK_DELAY = 500;  // simulace zpozdeni

// pomocna funkce pro delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage
let mockLists = [];
let mockCurrentUser = null;

// inicializace mock dat
export const initMockData = (lists, currentUser) => {
  mockLists = JSON.parse(JSON.stringify(lists));  // deep copy
  mockCurrentUser = currentUser;
  console.log("Mock data inicializovana:", mockLists.length, "seznamu");
};

// ========== SHOPPING LISTS ==========

export const getAllLists = async () => {
  if (USE_MOCK) {
    console.log("Mock: Ziskavam vsechny seznamy");
    await delay(MOCK_DELAY);
    const userLists = mockLists.filter(list => 
      list.ownerId === mockCurrentUser.id || 
      list.members.some(m => m.userId === mockCurrentUser.id)
    );
    return { data: userLists, error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, {
        headers: { 'Authorization': `Bearer mock-token` }
      });
      if (!response.ok) throw new Error('Chyba pri nacitani seznamu');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const createList = async (listName) => {
  if (USE_MOCK) {
    console.log("Mock: Vytvarim novy seznam:", listName);
    await delay(MOCK_DELAY);
    const newList = {
      id: `list-${Date.now()}`,
      name: listName,
      ownerId: mockCurrentUser.id,
      archived: false,
      items: [],
      members: []
    };
    mockLists.push(newList);
    // vratim deep copy aby nedoslo ke shared reference
    return { data: JSON.parse(JSON.stringify(newList)), error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token`
        },
        body: JSON.stringify({ jmeno: listName })
      });
      if (!response.ok) throw new Error('Chyba pri vytvareni seznamu');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const deleteList = async (listId) => {
  if (USE_MOCK) {
    console.log("Mock: Mazu seznam", listId);
    await delay(MOCK_DELAY);
    const index = mockLists.findIndex(l => l.id === listId);
    if (index === -1) return { data: null, error: "Seznam nenalezen" };
    mockLists.splice(index, 1);
    return { data: { success: true }, error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/${listId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer mock-token` }
      });
      if (!response.ok) throw new Error('Chyba pri mazani seznamu');
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const updateListName = async (listId, newName) => {
  if (USE_MOCK) {
    console.log("Mock: Updatuju nazev seznamu", listId, newName);
    await delay(MOCK_DELAY);
    const list = mockLists.find(l => l.id === listId);
    if (!list) return { data: null, error: "Seznam nenalezen" };
    list.name = newName;
    return { data: list, error: null };
  } else {
    // backend nema tento endpoint
    return { data: null, error: "Funkce neni implementovana" };
  }
};

export const archiveList = async (listId, archived) => {
  if (USE_MOCK) {
    console.log("Mock: Archivuji seznam", listId, archived);
    await delay(MOCK_DELAY);
    const list = mockLists.find(l => l.id === listId);
    if (!list) return { data: null, error: "Seznam nenalezen" };
    list.archived = archived;
    return { data: list, error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/${listId}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token`
        },
        body: JSON.stringify({ archived })
      });
      if (!response.ok) throw new Error('Chyba pri archivaci');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

// ========== ITEMS ==========

export const addItem = async (listId, itemName) => {
  if (USE_MOCK) {
    console.log("Mock: Pridavam polozku", itemName);
    await delay(MOCK_DELAY);
    const list = mockLists.find(l => l.id === listId);
    if (!list) return { data: null, error: "Seznam nenalezen" };
    const newItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      resolved: false
    };
    list.items.push(newItem);
    // vratim deep copy aby nedoslo ke shared reference
    return { data: JSON.parse(JSON.stringify(newItem)), error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/${listId}/item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token`
        },
        body: JSON.stringify({ name: itemName })
      });
      if (!response.ok) throw new Error('Chyba pri pridavani polozky');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const deleteItem = async (listId, itemId) => {
  if (USE_MOCK) {
    console.log("Mock: Mazu polozku", itemId);
    await delay(MOCK_DELAY);
    const list = mockLists.find(l => l.id === listId);
    if (!list) return { data: null, error: "Seznam nenalezen" };
    const itemIndex = list.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) return { data: null, error: "Polozka nenalezena" };
    list.items.splice(itemIndex, 1);
    return { data: { success: true }, error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/${listId}/item/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer mock-token` }
      });
      if (!response.ok) throw new Error('Chyba pri mazani polozky');
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const toggleItemResolved = async (listId, itemId, resolved) => {
  if (USE_MOCK) {
    console.log("Mock: Toggle polozky", itemId, "resolved:", resolved);
    await delay(MOCK_DELAY);
    const list = mockLists.find(l => l.id === listId);
    if (!list) return { data: null, error: "Seznam nenalezen" };
    const item = list.items.find(i => i.id === itemId);
    if (!item) return { data: null, error: "Polozka nenalezena" };
    item.resolved = resolved;
    return { data: item, error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/${listId}/item/${itemId}/mark`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token`
        },
        body: JSON.stringify({ resolved })
      });
      if (!response.ok) throw new Error('Chyba pri zmene stavu polozky');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

// ========== MEMBERS ==========

export const addMember = async (listId, memberName) => {
  if (USE_MOCK) {
    console.log("Mock: Pridavam clena", memberName);
    await delay(MOCK_DELAY);
    const list = mockLists.find(l => l.id === listId);
    if (!list) return { data: null, error: "Seznam nenalezen" };
    const newMember = {
      userId: `user-${Date.now()}`,
      name: memberName
    };
    list.members.push(newMember);
    // vratim deep copy aby nedoslo ke shared reference
    return { data: JSON.parse(JSON.stringify(newMember)), error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/${listId}/member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock-token`
        },
        body: JSON.stringify({ name: memberName })
      });
      if (!response.ok) throw new Error('Chyba pri pridavani clena');
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

export const removeMember = async (listId, memberId) => {
  if (USE_MOCK) {
    console.log("Mock: Odebiram clena", memberId);
    await delay(MOCK_DELAY);
    const list = mockLists.find(l => l.id === listId);
    if (!list) return { data: null, error: "Seznam nenalezen" };
    const memberIndex = list.members.findIndex(m => m.userId === memberId);
    if (memberIndex === -1) return { data: null, error: "Clen nenalezen" };
    list.members.splice(memberIndex, 1);
    return { data: { success: true }, error: null };
  } else {
    try {
      const response = await fetch(`${API_BASE_URL}/list/${listId}/member/${memberId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer mock-token` }
      });
      if (!response.ok) throw new Error('Chyba pri odebirani clena');
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error: error.message };
    }
  }
};

