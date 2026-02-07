const DESTINATIONS_CONTEXT = `
TimeTravel Agency - contexte de reference:
- Paris 1889: Belle Epoque, Exposition Universelle, Tour Eiffel. Prix indicatif: 2 900 EUR.
- Cretace -65M: observation de dinosaures en capsule securisee. Prix indicatif: 4 800 EUR.
- Florence 1504: Renaissance, art, architecture, ateliers. Prix indicatif: 3 400 EUR.
- FAQ agence: annulation gratuite jusqu a J-30, puis avoir de 80%.
- Politique ton: professionnel, chaleureux, passionne d histoire, jamais familier.
`;

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((msg) => msg && typeof msg.content === "string")
    .slice(-8)
    .map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content.slice(0, 600),
    }));
}

function buildFallbackReply(message) {
  const input = String(message || "").toLowerCase();
  if (/(prix|tarif|combien|cout)/.test(input)) {
    return "Tarifs indicatifs: Paris 1889 (2 900 EUR), Cretace -65M (4 800 EUR), Florence 1504 (3 400 EUR).";
  }
  if (/(paris|1889|tour eiffel)/.test(input)) {
    return "Paris 1889 est ideal pour une experience elegante: Exposition Universelle, Tour Eiffel et ambiance Belle Epoque.";
  }
  if (/(cretace|dino|dinosaure|-65)/.test(input)) {
    return "Le Cretace -65M est parfait pour une aventure nature intense avec protocole de securite renforce.";
  }
  if (/(florence|renaissance|1504|art)/.test(input)) {
    return "Florence 1504 est recommandee pour l art et l architecture de la Renaissance.";
  }
  if (/(faq|annulation|remboursement)/.test(input)) {
    return "Annulation gratuite jusqu a J-30 puis avoir de 80%.";
  }
  return "Je peux vous renseigner sur les destinations, les prix, les conseils de choix et la FAQ.";
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, endpoint: "chat" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const message = String(body.message || "").trim();
    const history = sanitizeHistory(body.history);

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    if (!apiKey || !model) {
      return res.status(200).json({ reply: buildFallbackReply(message), mode: "local" });
    }

    const payload = {
      model,
      messages: [
        {
          role: "system",
          content:
            "Tu es l assistant virtuel de TimeTravel Agency. Sois precis, professionnel, chaleureux, et base tes reponses sur le contexte fourni.",
        },
        { role: "system", content: DESTINATIONS_CONTEXT },
        ...history,
        { role: "user", content: message.slice(0, 900) },
      ],
      temperature: 0.6,
      max_tokens: 420,
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenRouter error:", text.slice(0, 400));
      return res.status(200).json({ reply: buildFallbackReply(message), mode: "local" });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(200).json({ reply: buildFallbackReply(message), mode: "local" });
    }

    return res.status(200).json({ reply, mode: "ia" });
  } catch (error) {
    console.error("Chat handler error:", error);
    return res.status(200).json({
      reply: "Mode secours actif. Je peux toujours vous aider sur les destinations, les prix et la FAQ.",
      mode: "local",
    });
  }
};
