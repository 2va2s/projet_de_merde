const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");
const chatWidget = document.getElementById("chat-widget");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const chips = document.querySelectorAll(".chip");
const assistantMode = document.getElementById("assistant-mode");

const bookingForm = document.getElementById("booking-form");
const bookingMessage = document.getElementById("booking-message");
const dateInput = document.getElementById("date");

const recommendBtn = document.getElementById("recommend-btn");
const recommendationResult = document.getElementById("recommendation-result");

const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const q3 = document.getElementById("q3");
const q4 = document.getElementById("q4");

const API_ENDPOINT = "/api/chat";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const CAN_USE_SERVERLESS_API =
  window.location.protocol !== "file:" &&
  !LOCAL_HOSTS.has(window.location.hostname);
const chatHistory = [];

const DESTINATIONS = {
  paris: {
    name: "Paris 1889",
    price: "2 900 EUR",
    reply:
      "Paris 1889: Belle Epoque, Exposition Universelle, Tour Eiffel naissante, atmosphere elegante.",
  },
  cretace: {
    name: "Cretace -65M",
    price: "4 800 EUR",
    reply:
      "Cretace -65M: immersion aventure-nature, observation de dinosaures avec protocole de securite renforce.",
  },
  florence: {
    name: "Florence 1504",
    price: "3 400 EUR",
    reply:
      "Florence 1504: Renaissance italienne, ateliers d artistes, architecture et effervescence culturelle.",
  },
};

function addMessage(role, text) {
  const el = document.createElement("p");
  el.className = `message ${role}`;
  el.textContent = text;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function openChat(withFocus = true) {
  chatWidget.classList.add("open");
  if (withFocus) chatInput.focus();
}

function closeChat() {
  chatWidget.classList.remove("open");
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getLocalReply(rawInput) {
  const input = normalizeText(rawInput);

  if (!input) return "Je vous ecoute.";

  if (/(bonjour|salut|hello|bonsoir)/.test(input)) {
    return "Bonjour, ravi de vous aider a choisir votre voyage temporel.";
  }

  if (/(prix|tarif|combien|cout)/.test(input)) {
    return `Tarifs indicatifs: ${DESTINATIONS.paris.name} (${DESTINATIONS.paris.price}), ${DESTINATIONS.cretace.name} (${DESTINATIONS.cretace.price}), ${DESTINATIONS.florence.name} (${DESTINATIONS.florence.price}).`;
  }

  if (/(paris|tour eiffel|belle epoque|1889)/.test(input)) {
    return `${DESTINATIONS.paris.reply} Prix a partir de ${DESTINATIONS.paris.price}.`;
  }

  if (/(cretace|dino|dinosaure|prehistor|nature sauvage|-65)/.test(input)) {
    return `${DESTINATIONS.cretace.reply} Prix a partir de ${DESTINATIONS.cretace.price}.`;
  }

  if (/(florence|renaissance|michel-ange|michelange|1504|art)/.test(input)) {
    return `${DESTINATIONS.florence.reply} Prix a partir de ${DESTINATIONS.florence.price}.`;
  }

  if (/(faq|annulation|remboursement)/.test(input)) {
    return "FAQ: annulation gratuite jusqu a J-30, puis avoir de 80%. Assurance chrono incluse.";
  }

  if (/(conseil|choisir|recommand|hesite|indecis)/.test(input)) {
    return "Conseil rapide: culture -> Florence 1504, aventure -> Cretace -65M, elegance urbaine -> Paris 1889.";
  }

  if (/(securite|danger|risque)/.test(input)) {
    return "Chaque voyage inclut un protocole securite: capsule stabilisee, guide certifie, extraction prioritaire.";
  }

  return "Je peux vous aider sur les destinations, les prix, la reservation et la FAQ. Posez une question plus precise.";
}

function setAssistantMode(mode) {
  assistantMode.textContent = mode;
}

async function getAssistantReply(message) {
  if (!CAN_USE_SERVERLESS_API) {
    setAssistantMode("local");
    return getLocalReply(message);
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: chatHistory.slice(-6) }),
    });

    if (!response.ok) {
      throw new Error(`API status ${response.status}`);
    }

    const data = await response.json();
    if (data && data.reply) {
      setAssistantMode(data.mode || "ia");
      return data.reply;
    }

    throw new Error("No reply in API payload");
  } catch {
    setAssistantMode("local");
    return getLocalReply(message);
  }
}

function addTypingHint() {
  const typing = document.createElement("p");
  typing.className = "message system";
  typing.id = "typing-hint";
  typing.textContent = "Assistant en train de repondre...";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingHint() {
  const typing = document.getElementById("typing-hint");
  if (typing) typing.remove();
}

async function submitChatPrompt(prompt) {
  if (!prompt) return;
  addMessage("user", prompt);
  chatHistory.push({ role: "user", content: prompt });

  addTypingHint();
  const reply = await getAssistantReply(prompt);
  removeTypingHint();

  addMessage("bot", reply);
  chatHistory.push({ role: "assistant", content: reply });
}

chatToggle.addEventListener("click", () => openChat(true));
chatClose.addEventListener("click", closeChat);

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = chatInput.value.trim();
  if (!prompt) return;
  chatInput.value = "";
  await submitChatPrompt(prompt);
});

chips.forEach((chip) => {
  chip.addEventListener("click", async () => {
    openChat(false);
    const prompt = chip.dataset.prompt || "";
    await submitChatPrompt(prompt);
  });
});

function recommendDestination() {
  const score = {
    "Paris 1889": 0,
    "Cretace -65M": 0,
    "Florence 1504": 0,
  };

  if (q1.value === "art") score["Florence 1504"] += 2;
  if (q1.value === "nature") score["Cretace -65M"] += 2;
  if (q1.value === "elegance") score["Paris 1889"] += 2;

  if (q2.value === "modern") score["Paris 1889"] += 2;
  if (q2.value === "ancient") score["Cretace -65M"] += 2;
  if (q2.value === "renaissance") score["Florence 1504"] += 2;

  if (q3.value === "city") score["Paris 1889"] += 1;
  if (q3.value === "wild") score["Cretace -65M"] += 1;
  if (q3.value === "museum") score["Florence 1504"] += 1;

  if (q4.value === "monuments") score["Paris 1889"] += 1;
  if (q4.value === "fauna") score["Cretace -65M"] += 1;
  if (q4.value === "galleries") score["Florence 1504"] += 1;

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [best, points] = sorted[0];

  const reasons = {
    "Paris 1889": "ideal pour elegance urbaine, architecture et ambiance Belle Epoque.",
    "Cretace -65M": "ideal pour aventure forte et observation de nature sauvage.",
    "Florence 1504": "ideal pour passion art, patrimoine et ateliers de la Renaissance.",
  };

  recommendationResult.textContent = `Recommendation: ${best} (${points} pts) - ${reasons[best]}`;
  recommendationResult.classList.remove("error");

  const destinationField = document.getElementById("destination");
  destinationField.value = best;
}

recommendBtn.addEventListener("click", recommendDestination);

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  bookingMessage.className = "result";

  const destination = document.getElementById("destination").value.trim();
  const date = dateInput.value;
  const travelers = Number(document.getElementById("travelers").value);
  const email = document.getElementById("email").value.trim();

  if (!destination || !date || !travelers || !email) {
    bookingMessage.textContent = "Merci de remplir tous les champs.";
    bookingMessage.classList.add("error");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departure = new Date(`${date}T00:00:00`);
  if (departure < today) {
    bookingMessage.textContent = "La date de depart doit etre aujourd hui ou future.";
    bookingMessage.classList.add("error");
    return;
  }

  const bookingId = `TT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  bookingMessage.textContent = `Reservation validee (${bookingId}) pour ${travelers} voyageur(s), destination ${destination}, depart ${date}. Confirmation envoyee a ${email}.`;
  bookingMessage.classList.add("success");
  bookingForm.reset();
  dateInput.min = new Date().toISOString().split("T")[0];
});

function initReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

dateInput.min = new Date().toISOString().split("T")[0];
initReveal();
setAssistantMode("local");
addMessage(
  "bot",
  "Bonjour, je suis votre assistant TimeTravel. Je peux vous guider sur les destinations, les prix, la securite et la reservation."
);
