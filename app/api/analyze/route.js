export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchScore: { type: "number", minimum: 0, maximum: 100 },
    trafficLight: { type: "string" },
    matchedSkills: {
      type: "array",
      items: { type: "string" }
    },
    missingSkills: {
      type: "array",
      items: { type: "string" }
    },
    cvRecommendations: {
      type: "array",
      items: { type: "string" }
    },
    summary: { type: "string" }
  },
  required: [
    "matchScore",
    "trafficLight",
    "matchedSkills",
    "missingSkills",
    "cvRecommendations",
    "summary"
  ]
};

async function extractPdfText(file) {
  if (!file) return "";

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule.default || pdfParseModule;
    const parsed = await pdfParse(buffer);

    return (parsed.text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 18000);
  } catch (error) {
    console.error("PDF parsing error:", error);
    return "";
  }
}

async function extractJobText(jobUrl, fallbackText) {
  if (fallbackText && fallbackText.trim().length > 80) {
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

function fallbackResult() {
  return {
    matchScore: 0,
    trafficLight: "Nedá sa vyhodnotiť",
    matchedSkills: [],
    missingSkills: [],
    cvRecommendations: [
      "Nepodarilo sa prečítať CV alebo pracovnú ponuku.",
      "Skús vložiť text pracovnej ponuky ručne do záložného poľa.",
      "Skontroluj, či je CV naozaj PDF a nie obrázok alebo sken bez textu."
    ],
    summary:
      "Analýza nemala dostatok textových dát. Pre demo odporúčame vložiť text pracovnej ponuky ručne."
  };
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Chýba OPENAI_API_KEY vo Verceli." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const cv = formData.get("cv");
    const jobUrl = formData.get("jobUrl");
    const jobTextFallback = formData.get("jobText");

    const cvText = await extractPdfText(cv);
    const jobText = await extractJobText(jobUrl, jobTextFallback);

    if (!cvText || !jobText) {
      return Response.json(fallbackResult());
    }

    const prompt = `
Porovnaj CV kandidáta s pracovnou ponukou.

Dôležité pravidlá:
- Nepredstieraj istotu prijatia kandidáta.
- Hodnoť iba zhodu medzi CV a požiadavkami pracovnej ponuky.
- Match score má byť 0 až 100.
- trafficLight má byť jedna z hodnôt: "Silná zhoda", "Stredná zhoda", "Slabá zhoda".
- matchedSkills vypíš iba skills, ktoré sú zjavne v CV a zároveň relevantné pre ponuku.
- missingSkills vypíš skills alebo požiadavky z ponuky, ktoré v CV chýbajú alebo sú slabé.
- cvRecommendations musia byť konkrétne návrhy, čo doplniť do CV.
- Odpovedaj slovensky alebo česky podľa vstupu používateľa.

CV TEXT:
${cvText}

PRACOVNÁ PONUKA:
${jobText}
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "Si analytický nástroj Skills Heatmap. Vráť iba validný JSON podľa schémy."
          },
          { role: "user", content: prompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "skills_heatmap_result",
            strict: true,
            schema: RESULT_SCHEMA
          }
        }
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI error:", errorText);

      return Response.json(
        { error: "OpenAI API vrátilo chybu. Skontroluj API key a billing." },
        { status: 500 }
      );
    }

    const data = await openaiResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "OpenAI nevrátilo použiteľnú odpoveď." },
        { status: 500 }
      );
    }

    return Response.json(JSON.parse(content));
  } catch (error) {
    console.error("Analyze route error:", error);

    return Response.json(
      { error: "Serverová chyba pri analýze." },
      { status: 500 }
    );
  }
}
