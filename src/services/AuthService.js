import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from './firebaseConfig';

export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
  
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
