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
const resetBtn = document.getElementById("resetBtn");
const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const cardEl = document.getElementById("card");

// Escuta placar em tempo real
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
      mostrarResultado(data.vencedor, data.correto);
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
btnA.onclick = () => processarResposta("Time A");
btnB.onclick = () => processarResposta("Time B");

// Função processar resposta
async function processarResposta(time) {
  const rodada = await getDoc(rodadaRef);
  if (!rodada.exists() || !rodada.data().vencedor) {
    // Aqui podemos definir aleatoriamente se está certo ou errado (para exemplo)
    const correto = Math.random() > 0.5; // 50% chance
    await setDoc(rodadaRef, { vencedor: time, correto });

    // Atualiza pontos
    const pontosSnap = await getDoc(pontosRef);
    let pontos = pontosSnap.exists() ? pontosSnap.data() : { timeA: 0, timeB: 0 };
    if (time === "Time A") {
      pontos.timeA += correto ? 100 : -50;
    } else {
      pontos.timeB += correto ? 100 : -50;
    }
    await setDoc(pontosRef, pontos);
  }
}

// Mostrar card
function mostrarResultado(time, correto) {
  cardEl.style.display = "block";
  cardEl.className = correto ? "certo" : "errado";
  cardEl.textContent = `${time} apertou primeiro e ${correto ? "ACERTOU! (+100)" : "ERROU! (-50)"}`;
}

// Reset jogo
resetBtn.onclick = async () => {
  await setDoc(rodadaRef, { vencedor: null, correto: null });
  await setDoc(pontosRef, { timeA: 0, timeB: 0 });
};

