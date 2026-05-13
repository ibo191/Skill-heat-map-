export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SKILL_KEYWORDS = {
  "Project planning": [
    "project planning",
    "planning",
    "project plan",
    "plánování projektu",
    "projektové plánování",
    "projektový plán",
    "plán projektu"
  ],
  "Roadmap planning": [
    "roadmap",
    "roadmap planning",
    "product roadmap",
    "projektová roadmapa",
    "produktová roadmapa",
    "plánování roadmapy"
  ],
  "Risk management": [
    "risk",
    "risk management",
    "risk assessment",
    "řízení rizik",
    "rizika",
    "analýza rizik"
  ],
  "Budgeting": [
    "budget",
    "budgeting",
    "cost control",
    "budget management",
    "rozpočet",
    "rozpočtování",
    "náklady"
  ],
  "Reporting": [
    "reporting",
    "report",
    "status report",
    "reporty",
    "reporting projektů",
    "příprava reportingu",
    "stav projektu"
  ],
  "Stakeholder management": [
    "stakeholder",
    "stakeholders",
    "stakeholder management",
    "communication with stakeholders",
    "komunikace se stakeholdery",
    "práce se stakeholdery",
    "zainteresované strany"
  ],
  "Prioritization": [
    "prioritization",
    "prioritisation",
    "priority",
    "priorities",
    "prioritizace",
    "priority",
    "prioritizovat"
  ],
  "Project documentation": [
    "project documentation",
    "documentation",
    "dokumentace",
    "projektová dokumentace",
    "vedení dokumentace"
  ],
  "Project coordination": [
    "project coordination",
    "coordination",
    "koordinace",
    "koordinace projektu",
    "koordinace aktivit"
  ],
  "Resource planning": [
    "resource planning",
    "resources",
    "capacity planning",
    "kapacity",
    "plánování kapacit",
    "plánování zdrojů"
  ],
  "Timeline management": [
    "timeline",
    "deadline",
    "deadlines",
    "schedule",
    "harmonogram",
    "termíny",
    "časový plán"
  ],
  "Scope management": [
    "scope",
    "scope management",
    "project scope",
    "rozsah projektu",
    "řízení rozsahu"
  ],
  "Meeting facilitation": [
    "meeting facilitation",
    "meetings",
    "workshop facilitation",
    "facilitation",
    "meetingy",
    "facilitace",
    "vedení meetingů",
    "vedení workshopů"
  ],
  "Project governance": [
    "governance",
    "project governance",
    "governance projektu",
    "řízení projektu",
    "projektové řízení"
  ],

  "Agile": [
    "agile",
    "agile methodology",
    "agilní",
    "agilní metodika",
    "agilní prostředí"
  ],
  "Scrum": [
    "scrum",
    "scrum master",
    "sprint",
    "sprinty"
  ],
  "Kanban": [
    "kanban"
  ],
  "Sprint planning": [
    "sprint planning",
    "sprint planning meeting",
    "plánování sprintu",
    "sprint planning"
  ],
  "Retrospectives": [
    "retrospective",
    "retrospectives",
    "retrospektiva",
    "retrospektivy"
  ],
  "Backlog management": [
    "backlog",
    "backlog management",
    "správa backlogu",
    "produktový backlog"
  ],
  "Waterfall": [
    "waterfall",
    "vodopádový model"
  ],
  "Change management": [
    "change management",
    "change process",
    "řízení změn",
    "změnové řízení"
  ],
  "Process improvement": [
    "process improvement",
    "process optimization",
    "zlepšování procesů",
    "optimalizace procesů"
  ],
  "Requirements gathering": [
    "requirements",
    "requirements gathering",
    "business requirements",
    "sběr požadavků",
    "požadavky",
    "analýza požadavků"
  ],

  "Jira": [
    "jira",
    "atlassian jira"
  ],
  "Confluence": [
    "confluence",
    "atlassian confluence"
  ],
  "MS Project": [
    "ms project",
    "microsoft project"
  ],
  "Asana": [
    "asana"
  ],
  "Trello": [
    "trello"
  ],
  "Notion": [
    "notion"
  ],
  "MS Excel": [
    "excel",
    "ms excel",
    "microsoft excel",
    "tabulky",
    "kontingenční tabulky"
  ],
  "Power BI": [
    "power bi",
    "powerbi",
    "dashboard",
    "dashboardy"
  ],
  "Slack": [
    "slack"
  ],
  "Microsoft Teams": [
    "teams",
    "microsoft teams",
    "ms teams"
  ],
  "Google Workspace": [
    "google workspace",
    "google docs",
    "google sheets",
    "google drive"
  ],
  "Miro": [
    "miro"
  ],
  "Figma": [
    "figma"
  ],
  "CRM": [
    "crm",
    "customer relationship management"
  ],

  "Communication": [
    "communication",
    "communication skills",
    "komunikace",
    "komunikační schopnosti",
    "komunikační dovednosti"
  ],
  "Leadership": [
    "leadership",
    "team leadership",
    "vedení týmu",
    "vedení lidí",
    "leadership"
  ],
  "Teamwork": [
    "teamwork",
    "team collaboration",
    "týmová spolupráce",
    "spolupráce v týmu"
  ],
  "Problem solving": [
    "problem solving",
    "solving problems",
    "řešení problémů",
    "schopnost řešit problémy"
  ],
  "Time management": [
    "time management",
    "organization of time",
    "organizace času",
    "řízení času"
  ],
  "Negotiation": [
    "negotiation",
    "negotiating",
    "vyjednávání"
  ],
  "Presentation skills": [
    "presentation",
    "presentation skills",
    "presenting",
    "prezentace",
    "prezentační schopnosti"
  ],
  "Conflict resolution": [
    "conflict resolution",
    "conflict management",
    "conflict",
    "řešení konfliktů",
    "konflikty"
  ],
  "Decision making": [
    "decision making",
    "making decisions",
    "rozhodování",
    "schopnost rozhodovat"
  ],
  "Critical thinking": [
    "critical thinking",
    "analytical thinking",
    "kritické myšlení",
    "analytické myšlení"
  ],
  "Adaptability": [
    "adaptability",
    "flexibility",
    "adaptabilita",
    "flexibilita"
  ],
  "Ownership": [
    "ownership",
    "responsibility",
    "accountability",
    "odpovědnost",
    "samostatnost"
  ],
  "Empathy": [
    "empathy",
    "empatie"
  ],
  "Stress management": [
    "stress management",
    "working under pressure",
    "odolnost vůči stresu",
    "práce pod tlakem"
  ],

  "Business analysis": [
    "business analysis",
    "business analyst",
    "business requirements",
    "business analýza",
    "analýza businessu",
    "byznys analýza"
  ],
  "KPI tracking": [
    "kpi",
    "kpis",
    "metrics",
    "performance metrics",
    "metriky",
    "sledování kpi"
  ],
  "Vendor management": [
    "vendor",
    "supplier",
    "vendor management",
    "supplier management",
    "dodavatel",
    "dodavatelé",
    "řízení dodavatelů"
  ],
  "Customer orientation": [
    "customer orientation",
    "customer focus",
    "client focus",
    "zákazník",
    "orientace na zákazníka",
    "klient"
  ],
  "Strategic thinking": [
    "strategic thinking",
    "strategy",
    "strategické myšlení",
    "strategie"
  ],
  "Financial awareness": [
    "financial awareness",
    "finance",
    "costs",
    "financial",
    "finanční přehled",
    "náklady",
    "finance"
  ],
  "Data-driven decision making": [
    "data-driven",
    "data driven",
    "data analysis",
    "working with data",
    "práce s daty",
    "datově řízené rozhodování"
  ],
  "Documentation": [
    "documentation",
    "dokumentace",
    "technická dokumentace",
    "procesní dokumentace"
  ],
  "Quality management": [
    "quality",
    "quality management",
    "quality assurance",
    "kvalita",
    "řízení kvality"
  ],
  "Process mapping": [
    "process mapping",
    "process map",
    "mapování procesů",
    "procesní mapa"
  ],

  "English": [
    "english",
    "english language",
    "angličtina",
    "anglický jazyk",
    "znalost angličtiny"
  ],
  "Czech": [
    "czech",
    "czech language",
    "čeština",
    "český jazyk"
  ],
  "Slovak": [
    "slovak",
    "slovak language",
    "slovenština",
    "slovenský jazyk"
  ],
  "German": [
    "german",
    "german language",
    "němčina",
    "nemecký jazyk",
    "znalost němčiny"
  ],
  "Polish": [
    "polish",
    "polish language",
    "polština"
  ],
  "French": [
    "french",
    "french language",
    "francouzština"
  ]
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
  if (score >= 75) return "Strong match";
  if (score >= 45) return "Medium match";
  return "Weak match";
}

function buildRecommendations(matchedSkills, missingSkills, requiredSkills) {
  const recommendations = [];

  if (missingSkills.length > 0) {
    recommendations.push(
      "Focus first on skills that appear in the job description but are rated below intermediate in your profile."
    );
  }

  if (matchedSkills.length > 0) {
    recommendations.push(
      "Use your strongest matching skills in your CV and cover letter with wording similar to the job description."
    );
  }

  recommendations.push(
    "Add evidence to your CV: a project example, measurable result, tool used, team size, deadline, budget or business impact."
  );

  if (requiredSkills.length === 0) {
    recommendations.push(
      "The system did not detect many known skills in the job text. For a better result, paste the full job description, not only a short excerpt."
    );
  }

  return recommendations;
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
            "Missing skills or job description text. Rate at least a few skills and paste a job description."
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

    const cvRecommendations = buildRecommendations(
      matchedSkills,
      missingSkills,
      requiredSkills
    );

    return Response.json({
      matchScore,
      trafficLight: trafficLightFromScore(matchScore),
      matchedSkills,
      missingSkills,
      cvRecommendations,
      summary:
        requiredSkills.length > 0
          ? `The system detected ${requiredSkills.length} relevant skills in the job description and compared them with your saved skill profile. The result is based on keyword matching, not on a paid AI model.`
          : "The system did not detect clear known skills in the job description, so it used part of your filled skill profile as an orientation estimate. Paste a fuller job description for better accuracy."
    });
  } catch (error) {
    console.error("Analyze route error:", error);

    return Response.json(
      { error: "Server error during analysis." },
      { status: 500 }
    );
  }
}
