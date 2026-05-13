export async function POST() {
  return Response.json({
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
      "Demo backend funguje. Táto odpoveď je zatiaľ simulovaná. V ďalšom kroku pripojíme OpenAI API a reálne čítanie CV."
  });
}
