// tady mam uložený přihlášenýho uživatele - v budoucnu by to mělo bejt v databázi ale zatím to funguje takhle
export const currentUser = {
  id: 'user1',
  name: 'Matyas Batha'
};

// nějaký testovací data pro seznamy aby tam nebylo prázdno
// TODO: možná by to chtělo dodelat nacteni z API ale teď to stačí
export const initialShoppingLists = [
  {
    id: 'list1',
    name: 'Příprava na UU',
    ownerId: 'user1',
    members: [
      { id: 'member1', name: 'Babiš' },
      { id: 'member2', name: 'Trump' },
      { id: 'member3', name: 'Fiala' }
    ],
    items: [
      { id: 'item1', name: 'Stíhačky', resolved: false },
      { id: 'item2', name: 'Noví voliči', resolved: false },
      { id: 'item3', name: 'Další zámeček', resolved: true }
    ],
    archived: false
  },
  {
    id: 'list2',
    name: 'Celonoční makačka',
    ownerId: 'user2',
    members: [
      { id: 'member4', name: 'Karel' },
      { id: 'member5', name: 'Jana' }
    ],
    items: [
      { id: 'item4', name: 'Red Bull', resolved: false },
      { id: 'item5', name: 'Pizza', resolved: false },
      { id: 'item6', name: 'Kofein', resolved: false }
    ],
    archived: false
  },
  {
    id: 'list3',
    name: 'Rychloběh',
    ownerId: 'user3',
    members: [
      { id: 'member6', name: 'Petr' }
    ],
    items: [
      { id: 'item7', name: 'Běžecké boty', resolved: true }
    ],
    archived: false
  },
  {
    id: 'list4',
    name: 'Archivovaný seznam',
    ownerId: 'user1',
    members: [
      { id: 'member7', name: 'Test User' }
    ],
    items: [
      { id: 'item8', name: 'Starý úkol', resolved: true }
    ],
    archived: true
  }
];

