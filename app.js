import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
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

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");

const userInfo = document.getElementById("userInfo");

loginBtn.addEventListener("click", () => {

  signInWithRedirect(auth, provider);

});

getRedirectResult(auth)
  .then((result) => {

    console.log("Redirect OK");

  })
  .catch((error) => {

    console.error("ERROR REDIRECT:", error);

  });

onAuthStateChanged(auth, async (user) => {

  console.log("Estado auth:", user);

  if (user) {

    loginBtn.style.display = "none";

    userInfo.innerText =
      `Hola ${user.displayName}`;

    try {

      await setDoc(doc(db, "users", user.uid), {

        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        uid: user.uid,
        createdAt: new Date()

      });

      console.log("USUARIO GUARDADO OK");

      alert("Usuario guardado correctamente");

    } catch (error) {

      console.error("ERROR FIRESTORE:", error);

      alert("Error Firestore");

    }

  } else {

    loginBtn.style.display = "block";

    userInfo.innerText = "";

  }

});