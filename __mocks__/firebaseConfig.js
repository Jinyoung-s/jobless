const firebaseConfig = {
  apiKey: "your-mocked-api-key",
  authDomain: "your-mocked-auth-domain",
  projectId: "your-mocked-project-id",
};

const initializeApp = jest.fn(() => {
  // mock implementation of initializeApp function
  return {
    auth: jest.fn(),
    firestore: jest.fn(),
    storage: jest.fn(),
  };
});

const getAuth = jest.fn(() => {
  // mock implementation of getAuth function
  return {
    currentUser: {
      uid: "mockUserId123",
    },
  };
});

const getFirestore = jest.fn(() => {
  // mock implementation of getFirestore function
  return {
    collection,
    addDoc,
    query,
    getDocs,
    orderBy,
    startAfter,
    limit,
    where,
    doc,
    onSnapshot,
    arrayUnion,
  };
});

const getStorage = jest.fn(() => {
  // mock implementation of getStorage function
  return {};
});

const collection = jest.fn(() => {
  // mock implementation of collection function
  return {
    add: addDoc,
    where,
    orderBy,
    limit,
    get: getDocs,
    doc,
    onSnapshot,
  };
});

const addDoc = jest.fn(() => {
  // mock implementation of addDoc function
  return Promise.resolve({
    id: "mocked-document-id",
  });
});

const query = jest.fn(() => {
  // mock implementation of query function
  return {
    where,
    orderBy,
    limit,
    get: getDocs,
    onSnapshot,
  };
});

const getDocs = jest.fn(() => {
  // mock implementation of getDocs function
  return Promise.resolve({
    docs: [
      {
        id: "mocked-document-id",
        data: jest.fn(),
      },
    ],
  });
});

const orderBy = jest.fn(() => {
  // mock implementation of orderBy function
  return query();
});

const startAfter = jest.fn(() => {
  // mock implementation of startAfter function
  return query();
});

const limit = jest.fn(() => {
  // mock implementation of limit function
  return query();
});

const where = jest.fn(() => {
  // mock implementation of where function
  return query();
});

const doc = jest.fn(() => {
  // mock implementation of doc function
  return {
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    onSnapshot,
  };
});

const onSnapshot = jest.fn(() => {
  // mock implementation of onSnapshot function
  return jest.fn();
});

const arrayUnion = jest.fn(() => {
  // mock implementation of arrayUnion function
  return [];
});

export {
  firebaseConfig,
  initializeApp,
  getAuth,
  getFirestore,
  getStorage,
  collection,
  addDoc,
};
