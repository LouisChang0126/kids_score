// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMrRfW0eRCl8YOKLMAx7pKjTyhfKBwGCQ",
  authDomain: "kids-score-web.firebaseapp.com",
  projectId: "kids-score-web",
  storageBucket: "kids-score-web.appspot.com",
  messagingSenderId: "289250659162",
  appId: "1:289250659162:web:4b806dfe5a188ce1928163"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();