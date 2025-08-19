import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_3nIU2oEKhxOXvDfmdkKmE93awY08IsI",
  authDomain: "quizsoufacil.firebaseapp.com",
  projectId: "quizsoufacil",
  storageBucket: "quizsoufacil.firebasestorage.app",
  messagingSenderId: "83352047783",
  appId: "1:83352047783:web:bea92a9debdb2146d5cb82"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referências
const rodadaRef = doc(db, "jogo", "rodadaAtual");
const pontosRef = doc(db, "jogo", "pontuacao");

// Elementos
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const cardEl = document.getElementById("card");
const msgEl = document.getElementById("mensagem");
const certoBtn = document.getElementById("certoBtn");
const erradoBtn = document.getElementById("erradoBtn");

// Estado global
let ultimoTime = null;

// Escuta placar
onSnapshot(pontosRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    scoreAEl.textContent = data.timeA ?? 0;
    scoreBEl.textContent = data.timeB ?? 0;
  }
});

// Escuta rodada
onSnapshot(rodadaRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.vencedor) {
      ultimoTime = data.vencedor;
      msgEl.textContent = `${data.vencedor} apertou primeiro!`;
      cardEl.style.display = "block";
      btnA.disabled = true;
      btnB.disabled = true;
    } else {
      cardEl.style.display = "none";
      btnA.disabled = false;
      btnB.disabled = false;
    }
  }
});

// Clique nos botões
btnA.onclick = () => registrarClique("Time A");
btnB.onclick = () => registrarClique("Time B");

async function registrarClique(time) {
  const rodada = await getDoc(rodadaRef);
  if (!rodada.exists() || !rodada.data().vencedor) {
    await setDoc(rodadaRef, { vencedor: time });
  }
}

// Botão CERTO
certoBtn.onclick = async () => {
  if (!ultimoTime) return;
  const pontosSnap = await getDoc(pontosRef);
  let pontos = pontosSnap.exists() ? pontosSnap.data() : { timeA: 0, timeB: 0 };

  if (ultimoTime === "Time A") pontos.timeA += 100;
  else pontos.timeB += 100;

  await setDoc(pontosRef, pontos);
  await resetRodada();
};

// Botão ERRADO
erradoBtn.onclick = async () => {
  if (!ultimoTime) return;
  const pontosSnap = await getDoc(pontosRef);
  let pontos = pontosSnap.exists() ? pontosSnap.data() : { timeA: 0, timeB: 0 };

  if (ultimoTime === "Time A") pontos.timeA -= 50;
  else pontos.timeB -= 50;

  await setDoc(pontosRef, pontos);
  await resetRodada();
};

// Resetar rodada (sem zerar pontos)
async function resetRodada() {
  await setDoc(rodadaRef, { vencedor: null });
  ultimoTime = null;
}
