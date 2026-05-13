"use client";

import { useState } from "react";

const LEVELS = [
  "Úplný začiatočník",
  "Začiatočník",
  "Stredne pokročilý",
  "Pokročilý",
  "Expert"
];

const SKILL_GROUPS = [
  {
    title: "Project Management",
    skills: [
      "Project planning",
      "Roadmap planning",
      "Risk management",
      "Budgeting",
      "Reporting",
      "Stakeholder management",
      "Prioritization",
      "Project documentation",
      "Project coordination",
      "Resource planning"
    ]
  },
  {
    title: "Agile / Methods",
    skills: [
      "Agile",
      "Scrum",
      "Kanban",
      "Sprint planning",
      "Retrospectives",
      "Backlog management",
      "Waterfall",
      "Change management",
      "Process improvement",
      "Project governance"
    ]
  },
  {
    title: "Tools",
    skills: [
      "Jira",
      "Confluence",
      "MS Project",
      "Asana",
      "Trello",
      "Notion",
      "MS Excel",
      "Power BI",
      "Slack",
      "Microsoft Teams"
    ]
  },
  {
    title: "Soft skills",
    skills: [
      "Communication",
      "Leadership",
      "Teamwork",
      "Problem solving",
      "Time management",
      "Negotiation",
      "Presentation skills",
      "Conflict resolution",
      "Decision making",
      "Critical thinking"
    ]
  },
  {
    title: "Business skills",
    skills: [
      "Business analysis",
      "KPI tracking",
      "Vendor management",
      "Customer orientation",
      "Strategic thinking",
      "Financial awareness",
      "Data-driven decision making",
      "Requirements gathering",
      "Documentation",
      "Quality management"
    ]
  },
  {
    title: "Languages",
    skills: [
      "English B1",
      "English B2",
      "English C1",
      "Czech",
      "Slovak",
      "German A2",
      "German B1",
      "German B2"
    ]
  }
];

function createInitialSkills() {
  const result = {};
  SKILL_GROUPS.forEach((group) => {
    group.skills.forEach((skill) => {
      result[skill] = "";
    });
  });
  return result;
}

export default function Home() {
  const [skills, setSkills] = useState(createInitialSkills());
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  function updateSkill(skill, level) {
    setSkills((previous) => ({
      ...previous,
      [skill]: level
    }));
  }

  async function handleAnalyze() {
    setLoading(true);
    setResult(null);

    const selectedSkills = Object.entries(skills)
      .filter(([, level]) => level)
      .map(([skill, level]) => ({
        skill,
        level
      }));

    if (selectedSkills.length < 5) {
      alert("Vyplň aspoň 5 skills, inak analýza nebude mať zmysel.");
      setLoading(false);
      return;
    }

    if (!jobUrl && !jobText) {
      alert("Vlož link alebo text pracovnej ponuky.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          selectedSkills,
          jobUrl,
          jobText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Analýza zlyhala.");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (error) {
      alert("Chyba spojenia so serverom.");
    }

    setLoading(false);
  }

  return (
    <>
      <main className="page">
        <section className="hero">
          <div className="badge">AI skill checker pre projektových manažérov</div>
          <h1>Skills Heatmap</h1>
          <p>
            Vyplň svoj skill profil na 5-stupňovej škále, vlož pracovnú ponuku
            a zisti, ako dobre sa hodíš na konkrétnu pozíciu.
          </p>
        </section>

        <section className="card intro">
          <h2>1. Vyplň svoj skill profil</h2>
          <p>
            Pri každom skille vyber svoju reálnu úroveň. Neprikrášľuj to.
            Výsledok bude použiteľný len vtedy, keď vstup nebude sebaklam.
          </p>
        </section>

        <section className="skillsWrapper">
          {SKILL_GROUPS.map((group) => (
            <div className="skillGroup" key={group.title}>
              <h3>{group.title}</h3>

              {group.skills.map((skill) => (
                <div className="skillRow" key={skill}>
                  <label>{skill}</label>
                  <select
                    value={skills[skill]}
                    onChange={(event) => updateSkill(skill, event.target.value)}
                  >
                    <option value="">Nevyplnené</option>
                    {LEVELS.map((level) => (
                      <option value={level} key={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="card">
          <h2>2. Vlož pracovnú ponuku</h2>

          <div className="formBlock">
            <label>Link na pracovnú pozíciu</label>
            <input
              type="url"
              placeholder="https://www.jobs.cz/prace/..."
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
            />
          </div>

          <div className="formBlock">
            <label>Text pracovnej ponuky</label>
            <textarea
              placeholder="Odporúčané pre testovanie: vlož sem text pracovnej ponuky. Linky z Jobs.cz môžu byť technicky blokované."
              value={jobText}
              onChange={(event) => setJobText(event.target.value)}
            />
          </div>

          <button onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzujem..." : "Analyzovať zhodu"}
          </button>
        </section>

        {result && (
          <section className="results">
            <div className="scoreCard">
              <p>Celková zhoda</p>
              <h2>{result.matchScore}%</h2>
              <strong>{result.trafficLight}</strong>
            </div>

            <div className="grid">
              <div className="resultBox">
                <h3>Silné stránky</h3>
                {result.matchedSkills?.map((skill) => (
                  <span className="pill good" key={skill}>{skill}</span>
                ))}
              </div>

              <div className="resultBox">
                <h3>Slabé alebo chýbajúce skills</h3>
                {result.missingSkills?.map((skill) => (
                  <span className="pill bad" key={skill}>{skill}</span>
                ))}
              </div>

              <div className="resultBox">
                <h3>Odporúčania</h3>
                {result.cvRecommendations?.map((item) => (
                  <p className="recommendation" key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="summary">
              <h3>Zhrnutie</h3>
              <p>{result.summary}</p>
            </div>
          </section>
        )}
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f7fb;
          color: #111827;
          font-family: Arial, sans-serif;
        }

        .page {
          max-width: 1180px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .hero {
          background: #111827;
          color: white;
          border-radius: 30px;
          padding: 54px;
          margin-bottom: 28px;
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
        }

        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 22px;
        }

        h1 {
          font-size: 64px;
          margin: 0 0 18px;
          letter-spacing: -2.5px;
          line-height: 1;
        }

        .hero p {
          max-width: 780px;
          color: #d1d5db;
          font-size: 19px;
          line-height: 1.7;
          margin: 0;
        }

        .card,
        .results {
          background: white;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
          margin-bottom: 28px;
        }

        .intro p {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .skillsWrapper {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
          margin-bottom: 28px;
        }

        .skillGroup {
          background: white;
          border-radius: 28px;
          padding: 26px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        }

        .skillGroup h3 {
          margin-top: 0;
          margin-bottom: 18px;
        }

        .skillRow {
          display: grid;
          grid-template-columns: 1fr 230px;
          gap: 14px;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .skillRow:last-child {
          border-bottom: 0;
        }

        label {
          display: block;
          font-weight: 800;
        }

        .skillRow label {
          font-size: 14px;
        }

        .formBlock {
          margin-bottom: 22px;
        }

        .formBlock label {
          margin-bottom: 10px;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 16px;
          padding: 13px 14px;
          font-size: 15px;
          outline: none;
          background: white;
        }

        textarea {
          min-height: 170px;
          resize: vertical;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #111827;
        }

        button {
          width: 100%;
          border: 0;
          background: #111827;
          color: white;
          padding: 17px 22px;
          border-radius: 18px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 800;
        }

        button:hover {
          background: #1f2937;
        }

        button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .scoreCard {
          border: 2px solid #e5e7eb;
          border-radius: 24px;
          padding: 26px;
          margin-bottom: 24px;
          background: #f9fafb;
        }

        .scoreCard p {
          color: #6b7280;
          font-weight: 800;
          margin: 0;
        }

        .scoreCard h2 {
          font-size: 70px;
          margin: 8px 0;
        }

        .scoreCard strong {
          display: inline-block;
          background: #fef3c7;
          color: #92400e;
          padding: 10px 14px;
          border-radius: 999px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .resultBox {
          background: #f9fafb;
          border-radius: 22px;
          padding: 22px;
        }

        .resultBox h3,
        .summary h3 {
          margin-top: 0;
        }

        .pill {
          display: block;
          border-radius: 999px;
          padding: 10px 14px;
          font-weight: 700;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .good {
          background: #dcfce7;
          color: #166534;
        }

        .bad {
          background: #fee2e2;
          color: #991b1b;
        }

        .recommendation {
          background: #eef2ff;
          color: #3730a3;
          border-radius: 16px;
          padding: 13px;
          line-height: 1.45;
          font-weight: 600;
        }

        .summary {
          margin-top: 22px;
          background: #f3f4f6;
          border-radius: 22px;
          padding: 22px;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .hero {
            padding: 34px;
          }

          h1 {
            font-size: 42px;
          }

          .skillsWrapper,
          .grid {
            grid-template-columns: 1fr;
          }

          .skillRow {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
