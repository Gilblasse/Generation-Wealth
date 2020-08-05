import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAimfOCOe6sQWV8icWmzZowq87nNj356zs",
    authDomain: "generational-wealth.firebaseapp.com",
    databaseURL: "https://generational-wealth.firebaseio.com",
    projectId: "generational-wealth",
    storageBucket: "generational-wealth.appspot.com",
    messagingSenderId: "486967743800",
    appId: "1:486967743800:web:ea8c080ede02f73cab1dcd",
    measurementId: "G-LLDHD4RK1W"
};

firebase.initializeApp(firebaseConfig);

export default app = {
    db: firebase.firestore,
    auth: firebase.auth
}