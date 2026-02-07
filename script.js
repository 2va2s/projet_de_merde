const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");
const chatWidget = document.getElementById("chat-widget");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");
const chips = document.querySelectorAll(".chip");

const bookingForm = document.getElementById("booking-form");
const bookingMessage = document.getElementById("booking-message");
const dateInput = document.getElementById("date");

const recommendBtn = document.getElementById("recommend-btn");
const recommendationResult = document.getElementById("recommendation-result");
const interestSelect = document.getElementById("interest");
const moodSelect = document.getElementById("mood");

const BOT_INTRO =
  "Bonjour, je suis votre assistant TimeTravel. Je peux parler destinations, prix, FAQ et conseils.";

const DESTINATIONS = {
  paris: {
    name: "Paris 1889",
    price: "2 900 EUR",
    reply:
      "Paris 1889: Belle Epoque, Exposition Universelle, ambiance elegante et culturelle.",
  },
  cretace: {
    name: "Cretace -65M",
    price: "4 800 EUR",
    reply:
      "Cretace -65M: immersion nature extreme, observation de dinosaures avec capsule securisee.",
  },
  florence: {
    name: "Florence 1504",
    price: "3 400 EUR",
    reply:
      "Florence 1504: coeur de la Renaissance, ateliers d artistes et architecture d exception.",
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

function getBotReply(rawInput) {
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
    return "FAQ: annulation gratuite jusqu a J-30, puis avoir de 80%. Assurance chrono incluse sur toutes les offres.";
  }

  if (/(conseil|choisir|recommand|hesite|indecis)/.test(input)) {
    return "Conseil rapide: culture/raffinement -> Paris 1889, aventure/nature -> Cretace -65M, art/architecture -> Florence 1504.";
  }

  if (/(securite|danger|risque)/.test(input)) {
    return "Chaque voyage inclut un protocole securite: capsule stabilisee, guide certifie, extraction prioritaire.";
  }

  return "Je peux vous aider sur les destinations, les prix, la reservation et la FAQ. Posez une question plus precise.";
}

chatToggle.addEventListener("click", () => openChat(true));
chatClose.addEventListener("click", closeChat);

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const prompt = chatInput.value.trim();
  if (!prompt) return;
  addMessage("user", prompt);
  chatInput.value = "";
  const reply = getBotReply(prompt);
  window.setTimeout(() => addMessage("bot", reply), 200);
});

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const prompt = chip.dataset.prompt || "";
    openChat(false);
    addMessage("user", prompt);
    const reply = getBotReply(prompt);
    window.setTimeout(() => addMessage("bot", reply), 200);
  });
});

function recommendDestination() {
  const interest = interestSelect.value;
  const mood = moodSelect.value;

  let scoreParis = 0;
  let scoreCretace = 0;
  let scoreFlorence = 0;

  if (interest === "culture") scoreFlorence += 2;
  if (interest === "adventure") scoreCretace += 2;
  if (interest === "elegance") scoreParis += 2;

  if (mood === "city") scoreParis += 2;
  if (mood === "wild") scoreCretace += 2;
  if (mood === "museum") scoreFlorence += 2;

  const ranking = [
    { name: "Paris 1889", score: scoreParis, reason: "elegance et vie urbaine historique" },
    { name: "Cretace -65M", score: scoreCretace, reason: "nature sauvage et aventure intense" },
    { name: "Florence 1504", score: scoreFlorence, reason: "art, culture et patrimoine" },
  ].sort((a, b) => b.score - a.score);

  const best = ranking[0];
  recommendationResult.textContent = `Recommendation: ${best.name} (${best.reason}).`;
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

dateInput.min = new Date().toISOString().split("T")[0];
addMessage("bot", BOT_INTRO);
