// === Importa Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_3nIU2oEKhxOXvDfmdkKmE93awY08IsI",
  authDomain: "quizsoufacil.firebaseapp.com",
  projectId: "quizsoufacil",
  storageBucket: "quizsoufacil.appspot.com",
  messagingSenderId: "83352047783",
  appId: "1:83352047783:web:bea92a9debdb2146d5cb82"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Referência no Firestore ===
const gameRef = doc(db, "game", "status");

// === Elementos da tela ===
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const placarA = document.getElementById("placarA");
const placarB = document.getElementById("placarB");
const card = document.getElementById("card");
const cardText = document.getElementById("cardText");
const certoBtn = document.getElementById("certoBtn");
const erradoBtn = document.getElementById("erradoBtn");
const restartBtn = document.getElementById("restartBtn");

// === Inicializar jogo no Firestore ===
async function initGame() {
  const snap = await getDoc(gameRef);
  if (!snap.exists()) {
    await setDoc(gameRef, {
      timeA: 0,
      timeB: 0,
      ultimo: null
    });
  }
}
initGame();

// === Botões de clique (Time A / B) ===
btnA.addEventListener("click", async () => {
  const snap = await getDoc(gameRef);
  if (!snap.data().ultimo) {
    await updateDoc(gameRef, { ultimo: "A" });
  }
});

btnB.addEventListener("click", async () => {
  const snap = await getDoc(gameRef);
  if (!snap.data().ultimo) {
    await updateDoc(gameRef, { ultimo: "B" });
  }
});

// === Certo / Errado ===
certoBtn.addEventListener("click", async () => {
  const snap = await getDoc(gameRef);
  const data = snap.data();
  if (data.ultimo === "A") {
    await updateDoc(gameRef, { timeA: data.timeA + 100, ultimo: null });
  } else if (data.ultimo === "B") {
    await updateDoc(gameRef, { timeB: data.timeB + 100, ultimo: null });
  }
});

erradoBtn.addEventListener("click", async () => {
  const snap = await getDoc(gameRef);
  const data = snap.data();
  if (data.ultimo === "A") {
    await updateDoc(gameRef, { timeA: data.timeA - 50, ultimo: null });
  } else if (data.ultimo === "B") {
    await updateDoc(gameRef, { timeB: data.timeB - 50, ultimo: null });
  }
});

// === Reiniciar Jogo ===
restartBtn.addEventListener("click", async () => {
  await updateDoc(gameRef, {
    timeA: 0,
    timeB: 0,
    ultimo: null
  });
});

// === Escuta alterações em tempo real ===
onSnapshot(gameRef, (docSnap) => {
  const data = docSnap.data();
  placarA.textContent = data.timeA;
  placarB.textContent = data.timeB;

  if (data.ultimo) {
    card.style.display = "block";
    cardText.textContent = `Time ${data.ultimo} apertou!`;
  } else {
    card.style.display = "none";
  }
});
