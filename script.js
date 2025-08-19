import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Config Firebase
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

// Referência do documento
const gameRef = doc(db, "game", "status");

// Elementos HTML
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const placarA = document.getElementById("scoreA");
const placarB = document.getElementById("scoreB");
const card = document.getElementById("card");
const cardText = document.getElementById("mensagem");
const certoBtn = document.getElementById("certo");
const erradoBtn = document.getElementById("errado");
const restartBtn = document.getElementById("reiniciar");

// Inicializa jogo no Firestore se não existir
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

// Função para registrar clique do Time
async function registrarClique(time) {
  const snap = await getDoc(gameRef);
  const data = snap.data();
  if (!data.ultimo) {
    await updateDoc(gameRef, { ultimo: time });
  }
}

// Clique nos botões Time A / B
btnA.addEventListener("click", () => registrarClique("A"));
btnB.addEventListener("click", () => registrarClique("B"));

// Função para atualizar pontos
async function atualizarPontos(correto) {
  const snap = await getDoc(gameRef);
  const data = snap.data();
  if (!data.ultimo) return;

  const campo = data.ultimo === "A" ? "timeA" : "timeB";
  const novoValor = correto ? data[campo] + 100 : data[campo] - 50;

  await updateDoc(gameRef, {
    [campo]: novoValor,
    ultimo: null
  });
}

// Botões Certo / Errado
certoBtn.addEventListener("click", () => atualizarPontos(true));
erradoBtn.addEventListener("click", () => atualizarPontos(false));

// Botão Reiniciar Jogo
restartBtn.addEventListener("click", async () => {
  await updateDoc(gameRef, { timeA: 0, timeB: 0, ultimo: null });
});

// Escuta alterações em tempo real
onSnapshot(gameRef, (docSnap) => {
  const data = docSnap.data();

  // Atualiza placar
  placarA.textContent = data.timeA;
  placarB.textContent = data.timeB;

  // Exibe card se alguém apertou
  if (data.ultimo) {
    card.style.display = "block";
    cardText.textContent = `Time ${data.ultimo} apertou!`;
  } else {
    card.style.display = "none";
  }
});
