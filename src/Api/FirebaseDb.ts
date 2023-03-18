/**
 * 2/23/2023 created - jys
 */
import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  setDoc,
  query,
  getDocs,
  orderBy,
  startAfter,
  limit,
  where,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

/**
 * saving the data
 * @param {string} collectionName the collection name
 * @param {any} data the data to be inserted
 */
const saveData = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

/**
 * saving the data with Id
 * @param {string} collectionName the collection name
 * @param {any} data the data to be inserted
 * @param {string} id the id to be inserted
 */
const saveDataWithId = async (
  collectionName: string,
  data: any,
  _id: string
) => {
  try {
    const docRef = await setDoc(doc(db, collectionName, _id), data);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

/**
 * get the all documents
 * @param {string} collectionName the collection name
 * @returns {any} querySnapshot the data from firebase
 */
const getCollection = async (collectionName: string) => {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

/**
 * get the documents by order
 * @param {string} collectionName the collection name
 * @param {string} orderby order by
 * @param {number} limitNum  list count
 * @param {number} whereFnc  net yet
 * @returns {any} querySnapshot the data from firebase
 */
/* TODO - modify where */
const getCollectionByOrder = async (
  collectionName: string,
  orderby: string,
  limitNum: number,
  startAfterNum: number,
  whereFnc: any = null
) => {
  let q;
  if (whereFnc == null) {
    q = query(
      collection(db, collectionName),
      orderBy(orderby, "desc"),
      limit(limitNum)
    );
  } else {
    q = query(
      collection(db, collectionName),
      orderBy(orderby),
      limit(limitNum),
      whereFnc
    );
  }
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

/**
 * get the  documents by custom query
 * @param {string} collectionName the collection name
 * @returns {any} querySnapshot the data from firebase
 */
const getCollectionByQuery = async (queryFnc: any) => {
  const q = queryFnc;
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};

const getDocById = async (collectionName: string, id: string) => {
  const ref = doc(db, collectionName, id);
  const docSnap = await getDoc(ref);
  let returnObj = {};

  if (docSnap.exists()) {
    returnObj = docSnap.data();
    console.log(returnObj);
  } else {
    console.log("No such document!");
  }
  return returnObj;
};

export {
  saveData,
  getCollection,
  getCollectionByOrder,
  getCollectionByQuery,
  getDocById,
  saveDataWithId,
};
