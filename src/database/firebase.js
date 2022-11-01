import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAVxBp5vNaU60uUfLwWm1uAfPT1yl9A24o",
    authDomain: "mindinfinitisolutions.firebaseapp.com",
    projectId: "mindinfinitisolutions",
    storageBucket: "mindinfinitisolutions.appspot.com",
    messagingSenderId: "54817637884",
    appId: "1:54817637884:web:4445d169e56203d7c59e79"
  };
  firebase.initializeApp(firebaseConfig);
  var auth = firebase.auth();
  export {auth , firebase};