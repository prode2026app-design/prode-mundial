import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
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

loginBtn.addEventListener("click", () => {

  signInWithRedirect(auth, provider);

});

getRedirectResult(auth)
  .then((result) => {

    console.log("Redirect completado", result);

  })
  .catch((error) => {

    console.error(error);

  });

onAuthStateChanged(auth, (user) => {

  if (user) {

    userInfo.innerText =
      `Hola ${user.displayName}`;

    loginBtn.style.display = "none";

  } else {

    userInfo.innerText = "";

    loginBtn.style.display = "block";

  }

});