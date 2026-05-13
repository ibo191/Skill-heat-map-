export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SKILL_KEYWORDS = {
  "Project planning": ["project planning", "planning", "plánování projektu", "projektové plánování"],
  "Roadmap planning": ["roadmap", "roadmap planning", "produktová roadmapa", "plánování roadmapy"],
  "Risk management": ["risk", "risk management", "řízení rizik", "rizika"],
  "Budgeting": ["budget", "budgeting", "rozpočet", "budget management"],
  "Reporting": ["reporting", "report", "reporty", "příprava reportingu"],
  "Stakeholder management": ["stakeholder", "stakeholders", "stakeholder management"],
  "Prioritization": ["prioritization", "prioritizace", "priority", "prioritizovat"],
  "Project documentation": ["documentation", "dokumentace", "project documentation"],
  "Project coordination": ["coordination", "koordinace", "project coordination"],
  "Resource planning": ["resource planning", "kapacity", "resources", "plánování kapacit"],
  "Timeline management": ["timeline", "harmonogram", "deadlines", "termíny"],
  "Scope management": ["scope", "rozsah projektu", "scope management"],
  "Meeting facilitation": ["meeting", "facilitation", "workshop", "meetingy"],
  "Project governance": ["governance", "projektová governance"],

  "Agile": ["agile", "agilní"],
  "Scrum": ["scrum", "scrum master", "sprint"],
  "Kanban": ["kanban"],
  "Sprint planning": ["sprint planning", "plánování sprintu"],
  "Retrospectives": ["retrospective", "retrospektiva"],
  "Backlog management": ["backlog", "backlog management"],
  "Waterfall": ["waterfall"],
  "Change management": ["change management", "řízení změn"],
  "Process improvement": ["process improvement", "zlepšování procesů"],
  "Requirements gathering": ["requirements", "sběr požadavků", "požadavky"],

  "Jira": ["jira"],
  "Confluence": ["confluence"],
  "MS Project": ["ms project", "microsoft project"],
  "Asana": ["asana"],
  "Trello": ["trello"],
  "Notion": ["notion"],
  "MS Excel": ["excel", "ms excel", "microsoft excel"],
  "Power BI": ["power bi", "powerbi"],
  "Slack": ["slack"],
  "Microsoft Teams": ["teams", "microsoft teams"],
  "Google Workspace": ["google workspace", "google docs", "google sheets"],
  "Miro": ["miro"],
  "Figma": ["figma"],
  "CRM": ["crm"],

  "Communication": ["communication", "komunikace", "komunikační schopnosti"],
  "Leadership": ["leadership", "vedení týmu", "team lead"],
  "Teamwork": ["teamwork", "týmová spolupráce"],
  "Problem solving": ["problem solving", "řešení problémů"],
  "Time management": ["time management", "organizace času"],
  "Negotiation": ["negotiation", "vyjednávání"],
  "Presentation skills": ["presentation", "prezentace", "prezentační schopnosti"],
  "Conflict resolution": ["conflict", "řešení konfliktů"],
  "Decision making": ["decision making", "rozhodování"],
  "Critical thinking": ["critical thinking", "kritické myšlení"],
  "Adaptability": ["adaptability", "adaptabilita"],
  "Ownership": ["ownership", "odpovědnost"],
  "Empathy": ["empathy", "empatie"],
  "Stress management": ["stress management", "odolnost vůči stresu"],

  "Business analysis": ["business analysis", "business analytik", "analýza businessu"],
  "KPI tracking": ["kpi", "kpis", "metriky"],
  "Vendor management": ["vendor", "dodavatel", "supplier"],
  "Customer orientation": ["customer", "zákazník", "customer orientation"],
  "Strategic thinking": ["strategy", "strategické myšlení"],
  "Financial awareness": ["financial", "finance", "náklady"],
  "Data-driven decision making": ["data-driven", "data driven", "práce s daty"],
  "Documentation": ["documentation", "dokumentace"],
  "Quality management": ["quality", "kvalita", "quality management"],
  "Process mapping": ["process mapping", "mapování procesů"],

  "English": ["english", "angličtina", "anglický jazyk"],
  "Czech": ["czech", "čeština", "český jazyk"],
  "Slovak": ["slovak", "slovenština", "slovenský jazyk"],
  "German": ["german", "němčina", "nemecký jazyk"],
  "Polish": ["polish", "polština"],
  "French": ["french", "francouzština"]
};

async function extractJobText(jobUrl, fallbackText) {
  if (fallbackText && fallbackText.trim().length > 20) {
    return fallbackText.trim().slice(0, 18000);
  }

  if (!jobUrl) return "";

  try {
    const response = await fetch(jobUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SkillsHeatmapBot/1.0; student-project)"
      }
    });

    if (!response.ok) return "";

    const html = await response.text();
    const cheerio = await import("cheerio");
    const $ = cheerio.load(html);

    $("script, style, noscript, svg").remove();

    return $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 18000);
  } catch (error) {
    console.error("Job URL parsing error:", error);
    return "";
  }
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function keywordExists(jobText, skill) {
  const normalizedJobText = normalizeText(jobText);
  const keywords = SKILL_KEYWORDS[skill] || [skill];

  return keywords.some((keyword) => {
    return normalizedJobText.includes(normalizeText(keyword));
  });
}

function scoreSkill(levelIndex) {
  if (levelIndex >= 5) return 100;
  if (levelIndex === 4) return 85;
  if (levelIndex === 3) return 60;
  if (levelIndex === 2) return 35;
  if (levelIndex === 1) return 15;
  return 0;
}

function trafficLightFromScore(score) {
  if (score >= 75) return "Silná zhoda";
  if (score >= 45) return "Stredná zhoda";
  return "Slabá zhoda";
}

export async function POST(request) {
  try {
    const body = await request.json();

    const selectedSkills = body.selectedSkills || [];
    const jobUrl = body.jobUrl || "";
    const jobTextFallback = body.jobText || "";

    const jobText = await extractJobText(jobUrl, jobTextFallback);

    if (!selectedSkills.length || !jobText) {
      return Response.json(
        {
          error:
            "Chýbajú skills alebo text pracovnej ponuky. Vlož aspoň niekoľko skills a text ponuky."
        },
        { status: 400 }
      );
    }

    const requiredSkills = selectedSkills.filter((item) =>
      keywordExists(jobText, item.skill)
    );

    const skillsToEvaluate =
      requiredSkills.length > 0 ? requiredSkills : selectedSkills.slice(0, 12);

    const totalScore = skillsToEvaluate.reduce((sum, item) => {
      return sum + scoreSkill(item.levelIndex);
    }, 0);

    const matchScore = Math.round(totalScore / skillsToEvaluate.length);

    const matchedSkills = skillsToEvaluate
      .filter((item) => item.levelIndex >= 3)
      .map((item) => `${item.skill} — ${item.level}`);

    const missingSkills = skillsToEvaluate
      .filter((item) => item.levelIndex < 3)
      .map((item) => `${item.skill} — ${item.level}`);

    const cvRecommendations = [];

    if (missingSkills.length > 0) {
      cvRecommendations.push(
        "Najprv rieš skills, ktoré pracovná ponuka vyžaduje a ty ich máš pod úrovňou stredne pokročilý."
      );
    }

    if (matchedSkills.length > 0) {
      cvRecommendations.push(
        "Silné skills z výsledku použi v CV rovnakými slovami, aké používa pracovná ponuka."
      );
    }

    cvRecommendations.push(
      "Do CV doplň konkrétne dôkazy: projekt, výsledok, nástroj, veľkosť tímu alebo merateľný dopad."
    );

    if (requiredSkills.length === 0) {
      cvRecommendations.push(
        "Systém nenašiel v ponuke veľa známych skills. Pre presnejší výsledok vlož celý text pracovnej ponuky, nie iba krátky úryvok."
      );
    }

    return Response.json({
      matchScore,
      trafficLight: trafficLightFromScore(matchScore),
      matchedSkills,
      missingSkills,
      cvRecommendations,
      summary:
        requiredSkills.length > 0
          ? `Systém našiel ${requiredSkills.length} relevantných skills z pracovnej ponuky a porovnal ich s tvojím profilom.`
          : "Systém nenašiel jasné požiadavky v texte ponuky, preto použil časť tvojho vyplneného profilu ako orientačný výpočet."
    });
  } catch (error) {
    console.error("Analyze route error:", error);

    return Response.json(
      { error: "Serverová chyba pri analýze." },
      { status: 500 }
    );
  }
}
