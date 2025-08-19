// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA_3nIU2oEKhxOXvDfmdkKmE93awY08IsI",
  authDomain: "quizsoufacil.firebaseapp.com",
  projectId: "quizsoufacil",
  storageBucket: "quizsoufacil.firebasestorage.app",
  messagingSenderId: "83352047783",
  appId: "1:83352047783:web:bea92a9debdb2146d5cb82"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência do documento no Firestore
const resultadoRef = doc(db, "jogo", "rodadaAtual");

// Elementos da página
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const resetBtn = document.getElementById("resetBtn");
const resultadoEl = document.getElementById("resultado");

// Escuta em tempo real
onSnapshot(resultadoRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    if (data.vencedor) {
      resultadoEl.textContent = "Quem apertou primeiro: " + data.vencedor;
      btnA.disabled = true;
      btnB.disabled = true;
    } else {
      resultadoEl.textContent = "Aguardando...";
      btnA.disabled = false;
      btnB.disabled = false;
    }
  } else {
    resultadoEl.textContent = "Aguardando...";
    btnA.disabled = false;
    btnB.disabled = false;
  }
});

// Função para marcar vencedor
async function marcarVencedor(time) {
  const docSnap = await getDoc(resultadoRef);
  if (!docSnap.exists() || !docSnap.data().vencedor) {
    await setDoc(resultadoRef, { vencedor: time });
  }
}

// Botões
btnA.onclick = () => marcarVencedor("Time A");
btnB.onclick = () => marcarVencedor("Time B");

// Resetar rodada
resetBtn.onclick = async () => {
  await setDoc(resultadoRef, { vencedor: null });
};
