"use client";

import { useMemo, useState } from "react";

const SKILL_LEVELS = [
  "Nevyplnené",
  "Úplný začiatočník",
  "Začiatočník",
  "Stredne pokročilý",
  "Pokročilý",
  "Expert"
];

const LANGUAGE_LEVELS = [
  "Neovládam",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1/C2"
];

const QUESTIONS = [
  { type: "skill", group: "Project Management", skill: "Project planning" },
  { type: "skill", group: "Project Management", skill: "Roadmap planning" },
  { type: "skill", group: "Project Management", skill: "Risk management" },
  { type: "skill", group: "Project Management", skill: "Budgeting" },
  { type: "skill", group: "Project Management", skill: "Reporting" },
  { type: "skill", group: "Project Management", skill: "Stakeholder management" },
  { type: "skill", group: "Project Management", skill: "Prioritization" },
  { type: "skill", group: "Project Management", skill: "Project documentation" },
  { type: "skill", group: "Project Management", skill: "Project coordination" },
  { type: "skill", group: "Project Management", skill: "Resource planning" },
  { type: "skill", group: "Project Management", skill: "Timeline management" },
  { type: "skill", group: "Project Management", skill: "Scope management" },
  { type: "skill", group: "Project Management", skill: "Meeting facilitation" },
  { type: "skill", group: "Project Management", skill: "Project governance" },

  { type: "skill", group: "Agile / Methods", skill: "Agile" },
  { type: "skill", group: "Agile / Methods", skill: "Scrum" },
  { type: "skill", group: "Agile / Methods", skill: "Kanban" },
  { type: "skill", group: "Agile / Methods", skill: "Sprint planning" },
  { type: "skill", group: "Agile / Methods", skill: "Retrospectives" },
  { type: "skill", group: "Agile / Methods", skill: "Backlog management" },
  { type: "skill", group: "Agile / Methods", skill: "Waterfall" },
  { type: "skill", group: "Agile / Methods", skill: "Change management" },
  { type: "skill", group: "Agile / Methods", skill: "Process improvement" },
  { type: "skill", group: "Agile / Methods", skill: "Requirements gathering" },

  { type: "skill", group: "Tools", skill: "Jira" },
  { type: "skill", group: "Tools", skill: "Confluence" },
  { type: "skill", group: "Tools", skill: "MS Project" },
  { type: "skill", group: "Tools", skill: "Asana" },
  { type: "skill", group: "Tools", skill: "Trello" },
  { type: "skill", group: "Tools", skill: "Notion" },
  { type: "skill", group: "Tools", skill: "MS Excel" },
  { type: "skill", group: "Tools", skill: "Power BI" },
  { type: "skill", group: "Tools", skill: "Slack" },
  { type: "skill", group: "Tools", skill: "Microsoft Teams" },
  { type: "skill", group: "Tools", skill: "Google Workspace" },
  { type: "skill", group: "Tools", skill: "Miro" },
  { type: "skill", group: "Tools", skill: "Figma" },
  { type: "skill", group: "Tools", skill: "CRM" },

  { type: "skill", group: "Soft skills", skill: "Communication" },
  { type: "skill", group: "Soft skills", skill: "Leadership" },
  { type: "skill", group: "Soft skills", skill: "Teamwork" },
  { type: "skill", group: "Soft skills", skill: "Problem solving" },
  { type: "skill", group: "Soft skills", skill: "Time management" },
  { type: "skill", group: "Soft skills", skill: "Negotiation" },
  { type: "skill", group: "Soft skills", skill: "Presentation skills" },
  { type: "skill", group: "Soft skills", skill: "Conflict resolution" },
  { type: "skill", group: "Soft skills", skill: "Decision making" },
  { type: "skill", group: "Soft skills", skill: "Critical thinking" },
  { type: "skill", group: "Soft skills", skill: "Adaptability" },
  { type: "skill", group: "Soft skills", skill: "Ownership" },
  { type: "skill", group: "Soft skills", skill: "Empathy" },
  { type: "skill", group: "Soft skills", skill: "Stress management" },

  { type: "skill", group: "Business skills", skill: "Business analysis" },
  { type: "skill", group: "Business skills", skill: "KPI tracking" },
  { type: "skill", group: "Business skills", skill: "Vendor management" },
  { type: "skill", group: "Business skills", skill: "Customer orientation" },
  { type: "skill", group: "Business skills", skill: "Strategic thinking" },
  { type: "skill", group: "Business skills", skill: "Financial awareness" },
  { type: "skill", group: "Business skills", skill: "Data-driven decision making" },
  { type: "skill", group: "Business skills", skill: "Documentation" },
  { type: "skill", group: "Business skills", skill: "Quality management" },
  { type: "skill", group: "Business skills", skill: "Process mapping" },

  { type: "language", group: "Languages", skill: "English" },
  { type: "language", group: "Languages", skill: "Czech" },
  { type: "language", group: "Languages", skill: "Slovak" },
  { type: "language", group: "Languages", skill: "German" },
  { type: "language", group: "Languages", skill: "Polish" },
  { type: "language", group: "Languages", skill: "French" }
];

function createInitialAnswers() {
  const result = {};
  QUESTIONS.forEach((question) => {
    result[question.skill] = 0;
  });
  return result;
}

function getLevelLabel(question, value) {
  if (question.type === "language") return LANGUAGE_LEVELS[value];
  return SKILL_LEVELS[value];
}

export default function Home() {
  const [answers, setAnswers] = useState(createInitialAnswers());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((value) => value > 0).length;
  }, [answers]);

  function updateAnswer(value) {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.skill]: Number(value)
    }));
  }

  function goPrevious() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goNext() {
    setCurrentIndex((index) => Math.min(QUESTIONS.length - 1, index + 1));
  }

  async function handleAnalyze() {
    setLoading(true);
    setResult(null);

    const selectedSkills = QUESTIONS
      .map((question) => ({
        skill: question.skill,
        group: question.group,
        type: question.type,
        levelIndex: answers[question.skill],
        level: getLevelLabel(question, answers[question.skill])
      }))
      .filter((item) => item.levelIndex > 0);

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
          <div className="badge">Skill checker bez plateného AI API</div>
          <h1>Skills Heatmap</h1>
          <p>
            Vyplň svoj skill profil cez jednoduchý dotazník, vlož pracovnú
            ponuku a aplikácia porovná tvoju úroveň s požiadavkami pozície.
          </p>
        </section>

        <section className="card intro">
          <h2>1. Skill dotazník</h2>
          <p>
            Zobrazujeme vždy jeden skill. Hodnoť reálne. Ak si dáš všade expert,
            výsledok nebude mať hodnotu.
          </p>
          <div className="progressMeta">
            <span>Otázka {currentIndex + 1} / {QUESTIONS.length}</span>
            <span>Vyplnené skills: {answeredCount}</span>
          </div>
          <div className="progressBar">
            <div style={{ width: `${progress}%` }} />
          </div>
        </section>

        <section className="questionCard">
          <div className="questionTop">
            <span>{currentQuestion.group}</span>
            <strong>{progress}%</strong>
          </div>

          <div className="questionAnimated" key={currentQuestion.skill}>
            <h2>{currentQuestion.skill}</h2>
            <p>
              {currentQuestion.type === "language"
                ? "Označ svoju jazykovú úroveň na škále."
                : "Označ svoju aktuálnu úroveň v tejto oblasti."}
            </p>

            <div className="sliderValue">
              {getLevelLabel(currentQuestion, answers[currentQuestion.skill])}
            </div>

            <input
              className="range"
              type="range"
              min="0"
              max="5"
              step="1"
              value={answers[currentQuestion.skill]}
              onChange={(event) => updateAnswer(event.target.value)}
            />

            <div className="scaleLabels">
              {(currentQuestion.type === "language" ? LANGUAGE_LEVELS : SKILL_LEVELS).map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          <div className="navigation">
            <button className="secondary" onClick={goPrevious} disabled={currentIndex === 0}>
              ← Späť
            </button>
            <button onClick={goNext} disabled={currentIndex === QUESTIONS.length - 1}>
              Ďalej →
            </button>
          </div>
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
              placeholder="Odporúčané pre istý výsledok: vlož sem text pracovnej ponuky. Linky z Jobs.cz môžu byť blokované."
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
                <h3>Silné zhody</h3>
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
        .questionCard,
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
        }

        .progressMeta {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          font-weight: 800;
          color: #4b5563;
          margin-top: 18px;
        }

        .progressBar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
          margin-top: 12px;
        }

        .progressBar div {
          height: 100%;
          background: #111827;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .questionTop {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: #6b7280;
          font-weight: 800;
          margin-bottom: 24px;
        }

        .questionAnimated {
          animation: slideIn 0.22s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .questionAnimated h2 {
          font-size: 44px;
          margin: 0 0 10px;
        }

        .questionAnimated p {
          color: #4b5563;
          font-size: 17px;
          line-height: 1.6;
        }

        .sliderValue {
          margin: 28px 0 18px;
          background: #111827;
          color: white;
          display: inline-block;
          padding: 13px 18px;
          border-radius: 999px;
          font-weight: 900;
        }

        .range {
          width: 100%;
          accent-color: #111827;
        }

        .scaleLabels {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-top: 12px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
        }

        .navigation {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 30px;
        }

        .secondary {
          background: #e5e7eb;
          color: #111827;
        }

        .secondary:hover {
          background: #d1d5db;
        }

        .formBlock {
          margin-bottom: 22px;
        }

        label {
          display: block;
          font-weight: 800;
          margin-bottom: 10px;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 16px;
          padding: 15px 16px;
          font-size: 15px;
          outline: none;
          background: white;
        }

        textarea {
          min-height: 170px;
          resize: vertical;
        }

        input:focus,
        textarea:focus {
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

          .questionAnimated h2 {
            font-size: 34px;
          }

          .grid,
          .navigation {
            grid-template-columns: 1fr;
          }

          .scaleLabels {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}
