import { db } from './firebaseConfig';
import { collection, addDoc,getDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';

const tasksCollection = collection(db, 'tasks');

// GET all tasks for user
export const fetchTasks = async (userId) => {
  const q = query(tasksCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// GET task by ID
export const getTaskById = async (taskId) => {
  const taskDoc = doc(db, 'tasks', taskId);
  const snap = await getDoc(taskDoc);

  if (!snap.exists()) {
    throw new Error('Task not found');
  }

  return { id: snap.id, ...snap.data() };
};

// POST / Add task
export const addTask = async (userId, task) => {
  const docRef = await addDoc(tasksCollection, {
    ...task,
    userId,
    imageUrl: null,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// PUT / PATCH  Update task
export const updateTask = async (taskId, updatedFields) => {
  const taskDoc = doc(db, 'tasks', taskId);
  await updateDoc(taskDoc, updatedFields);
};

// DELETE
export const deleteTask = async (taskId) => {
  const taskDoc = doc(db, 'tasks', taskId);
  await deleteDoc(taskDoc);
};

//Update task status
export async function updateTaskStatus(taskId, isDone) {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { isDone });
}
