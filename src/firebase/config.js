import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyClQmZWfkvIo47yn6FQ-Dra8YlZ9e0gaek",
  authDomain: "the-recipe-keeper.firebaseapp.com",
  projectId: "the-recipe-keeper",
  storageBucket: "the-recipe-keeper.appspot.com",
  messagingSenderId: "573511197617",
  appId: "1:573511197617:web:78575d1ea75c403fec5390"
};

// initialize firebase
firebase.initializeApp(firebaseConfig);

// initialize services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

export { projectFirestore, projectAuth};