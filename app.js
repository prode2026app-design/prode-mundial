import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

const provider = new GoogleAuthProvider();

const loginBtn = document.getElementById("loginBtn");

const userInfo = document.getElementById("userInfo");

loginBtn.addEventListener("click", async () => {

  try {

    const result = await signInWithPopup(auth, provider);

    const user = result.user;

    userInfo.innerText =
      `Hola ${user.displayName}`;

  } catch (error) {

    console.error(error);

    alert("Error al iniciar sesión");

  }

});