import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAyTCtITa6XFerCuFXfeS45rs6SRnQxpgM",
  authDomain: "react-firebase-proj-management.firebaseapp.com",
  projectId: "react-firebase-proj-management",
  storageBucket: "react-firebase-proj-management.appspot.com",
  messagingSenderId: "960688545375",
  appId: "1:960688545375:web:5df76a38eec3823853c5ea"
};


// Init firebase
firebase.initializeApp(firebaseConfig);

// Init firestore service
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

// Timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, projectStorage, timestamp }
