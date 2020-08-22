import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { Mode, SelectedMode } from './mode'


const firebaseConfig = Mode[SelectedMode].firebaseConfig

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore
const auth = firebase.auth

export  { db, auth }