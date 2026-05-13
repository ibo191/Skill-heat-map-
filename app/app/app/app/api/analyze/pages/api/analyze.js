export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Použi POST request."
    });
  }

  return res.status(200).json({
    matchScore: 68,
    trafficLight: "Stredná zhoda",
    matchedSkills: [
      "communication",
      "project management",
      "teamwork",
      "english"
    ],
    missingSkills: [
      "budgeting",
      "jira",
      "scrum",
      "stakeholder management"
    ],
    cvRecommendations: [
      "Doplň do CV konkrétne výsledky projektov, nie iba všeobecné tvrdenia.",
      "Použi rovnaké kľúčové slová, aké sú v pracovnej ponuke.",
      "Zvýrazni skúsenosti s tímovou spoluprácou, nástrojmi a merateľnými výsledkami."
    ],
    summary:
      "Demo API funguje. Táto odpoveď je zatiaľ simulovaná. Ďalší krok bude OpenAI API a čítanie CV."
  });
}
