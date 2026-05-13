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

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Chýba OPENAI_API_KEY vo Verceli." },
        { status: 500 }
      );
    }

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

    const skillProfile = selectedSkills
      .map((item) => `${item.skill}: ${item.level}`)
      .join("\n");

    const prompt = `
Porovnaj skill profil kandidáta s pracovnou ponukou.

Dôležité pravidlá:
- Nepredstieraj istotu prijatia kandidáta.
- Hodnoť iba zhodu medzi skill profilom a požiadavkami pracovnej ponuky.
- Match score má byť 0 až 100.
- trafficLight má byť jedna z hodnôt: "Silná zhoda", "Stredná zhoda", "Slabá zhoda".
- Skills s úrovňou "Expert" alebo "Pokročilý" ber ako silnú zhodu.
- Skills s úrovňou "Stredne pokročilý" ber ako čiastočnú zhodu.
- Skills s úrovňou "Začiatočník" alebo "Úplný začiatočník" ber ako slabú zhodu.
- matchedSkills vypíš silné alebo dostatočné zhody.
- missingSkills vypíš chýbajúce skills alebo skills, kde je úroveň príliš nízka.
- cvRecommendations majú byť konkrétne odporúčania, čo sa naučiť alebo čo doplniť do CV.
- Odpovedaj slovensky alebo česky podľa pracovnej ponuky.

SKILL PROFIL KANDIDÁTA:
${skillProfile}

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
