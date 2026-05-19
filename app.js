import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOWQZwhs0D0-FFMiLKjNh5mpfgTmryK0M",
  authDomain: "prode2026-9cfe0.firebaseapp.com",
  projectId: "prode2026-9cfe0",
  storageBucket: "prode2026-9cfe0.firebasestorage.app",
  messagingSenderId: "1063515027774",
  appId: "1:1063515027774:web:3bdd9e9c46885cd1c4946f"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

await setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();

const loginBtn =
  document.getElementById("loginBtn");

const userInfo =
  document.getElementById("userInfo");

loginBtn.addEventListener("click", async () => {

  try {

    const result =
      await signInWithPopup(auth, provider);

    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {

      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      uid: user.uid,
      createdAt: new Date()

    });

    userInfo.innerText =
      `Hola ${user.displayName}`;

    loginBtn.style.display = "none";

    alert("Login correcto");

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});

onAuthStateChanged(auth, (user) => {

  if (user) {

    userInfo.innerText =
      `Hola ${user.displayName}`;

    loginBtn.style.display = "none";

  }

});