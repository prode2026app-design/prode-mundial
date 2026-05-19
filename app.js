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
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc
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

const appDiv =
  document.getElementById("app");

const userInfo =
  document.getElementById("userInfo");

const createGroupBtn =
  document.getElementById("createGroupBtn");

const groupNameInput =
  document.getElementById("groupName");

const groupsList =
  document.getElementById("groupsList");

const joinCodeInput =
  document.getElementById("joinCode");

const joinGroupBtn =
  document.getElementById("joinGroupBtn");

const homeScreen =
  document.getElementById("homeScreen");

const groupScreen =
  document.getElementById("groupScreen");

const groupTitle =
  document.getElementById("groupTitle");

const groupCode =
  document.getElementById("groupCode");

const membersList =
  document.getElementById("membersList");

const backBtn =
  document.getElementById("backBtn");

let currentUser = null;

loginBtn.addEventListener("click", async () => {

  try {

    await signInWithPopup(auth, provider);

  } catch (error) {

    console.error(error);

    alert(error.message);

  }

});

onAuthStateChanged(auth, async (user) => {

  if (user) {

    currentUser = user;

    loginBtn.style.display = "none";

    appDiv.style.display = "block";

    userInfo.innerText =
      `Hola ${user.displayName}`;

    await setDoc(doc(db, "users", user.uid), {

      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      uid: user.uid

    });

    loadGroups();

  }

});

function generateCode() {

  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

}

createGroupBtn.addEventListener("click", async () => {

  const name =
    groupNameInput.value.trim();

  if (!name) {

    alert("Poné un nombre");

    return;

  }

  const code = generateCode();

  try {

    await addDoc(collection(db, "groups"), {

      name,
      code,
      owner: currentUser.uid,
      members: [currentUser.uid],
      createdAt: new Date()

    });

    groupNameInput.value = "";

    loadGroups();

  } catch (error) {

    console.error(error);

    alert("Error creando grupo");

  }

});

async function loadGroups() {

  groupsList.innerHTML = "";

  const q = query(
    collection(db, "groups"),
    where("members", "array-contains",
      currentUser.uid)
  );

  const querySnapshot =
    await getDocs(q);

  querySnapshot.forEach((docu) => {

    const group = docu.data();

    const div =
      document.createElement("div");

    div.className = "group-card";

    div.innerHTML = `
      <h3>${group.name}</h3>
      <p>Código: ${group.code}</p>
      <button onclick="openGroup('${docu.id}')">
        Entrar
      </button>
    `;

    groupsList.appendChild(div);

  });

}

joinGroupBtn.addEventListener("click", async () => {

  const code =
    joinCodeInput.value.trim().toUpperCase();

  if (!code) {

    alert("Ingresá un código");

    return;

  }

  try {

    const q = query(
      collection(db, "groups"),
      where("code", "==", code)
    );

    const querySnapshot =
      await getDocs(q);

    if (querySnapshot.empty) {

      alert("Grupo no encontrado");

      return;

    }

    querySnapshot.forEach(async (docu) => {

      const group = docu.data();

      if (
        group.members.includes(currentUser.uid)
      ) {

        alert("Ya estás en el grupo");

        return;

      }

      const updatedMembers = [
        ...group.members,
        currentUser.uid
      ];

      await setDoc(doc(db, "groups", docu.id), {

        ...group,
        members: updatedMembers

      });

      alert("Te uniste al grupo");

      joinCodeInput.value = "";

      loadGroups();

    });

  } catch (error) {

    console.error(error);

    alert("Error al unirse");

  }

});

window.openGroup = async (groupId) => {

  homeScreen.style.display = "none";

  groupScreen.style.display = "block";

  const groupRef =
    doc(db, "groups", groupId);

  const groupSnap =
    await getDoc(groupRef);

  const group =
    groupSnap.data();

  groupTitle.innerText =
    group.name;

  groupCode.innerText =
    `Código: ${group.code}`;

  membersList.innerHTML = "";

  for (const uid of group.members) {

    const userRef =
      doc(db, "users", uid);

    const userSnap =
      await getDoc(userRef);

    const user =
      userSnap.data();

    const div =
      document.createElement("div");

    div.className = "member-card";

    div.innerHTML = `
      ${user.name}
    `;

    membersList.appendChild(div);

  }

};

backBtn.addEventListener("click", () => {

  groupScreen.style.display = "none";

  homeScreen.style.display = "block";

});