export async function POST(request) {
  try {
    const formData = await request.formData();

    const cv = formData.get("cv");
    const jobUrl = formData.get("jobUrl");
    const jobText = formData.get("jobText");

    if (!cv) {
      return Response.json(
        { error: "Nahraj PDF životopis." },
        { status: 400 }
      );
    }

    if (!jobUrl && !jobText) {
      return Response.json(
        { error: "Vlož link na pracovnú pozíciu alebo text pracovnej ponuky." },
        { status: 400 }
      );
    }

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
  } catch (error) {
    return Response.json(
      { error: "Serverová chyba pri analýze." },
      { status: 500 }
    );
  }
}
