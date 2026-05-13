"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "skillsHeatmapProfileV2";

const SKILL_LEVELS = [
  "Not rated",
  "Complete beginner",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

const LANGUAGE_LEVELS = [
  "No proficiency",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1/C2"
];

const QUESTIONS = [
  {
    type: "skill",
    group: "Project Management",
    skill: "Project planning",
    description:
      "The ability to break a project into phases, define milestones, estimate effort and create a realistic delivery plan."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Roadmap planning",
    description:
      "Roadmap planning connects long-term goals with practical delivery steps. It is important when priorities change over time."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Risk management",
    description:
      "Risk management means identifying possible problems early, assessing impact and preparing mitigation actions."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Budgeting",
    description:
      "Budgeting is about understanding costs, tracking spending and making sure the project stays financially realistic."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Reporting",
    description:
      "Reporting means communicating project status clearly: progress, risks, blockers, deadlines and next steps."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Stakeholder management",
    description:
      "This is the ability to work with people affected by the project, manage expectations and keep them aligned."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Prioritization",
    description:
      "Prioritization helps decide what matters most when time, people or budget are limited."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Project documentation",
    description:
      "Project documentation keeps decisions, requirements, plans and responsibilities clear and traceable."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Project coordination",
    description:
      "Coordination means keeping tasks, people, meetings and deadlines organized so the project keeps moving."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Resource planning",
    description:
      "Resource planning means knowing who is needed, when they are needed and whether the team has enough capacity."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Timeline management",
    description:
      "Timeline management focuses on deadlines, dependencies and realistic scheduling."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Scope management",
    description:
      "Scope management prevents uncontrolled project expansion and keeps delivery focused on agreed goals."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Meeting facilitation",
    description:
      "Good facilitation makes meetings useful: clear agenda, decisions, owners and follow-up actions."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Project governance",
    description:
      "Governance defines how decisions are made, who approves changes and how project control is maintained."
  },

  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Agile",
    description:
      "Agile is an iterative approach to delivering value, adapting to feedback and working in smaller increments."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Scrum",
    description:
      "Scrum is an agile framework using sprints, roles, ceremonies and backlog management."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Kanban",
    description:
      "Kanban visualizes work, limits work in progress and helps improve flow."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Sprint planning",
    description:
      "Sprint planning defines what the team will deliver in the next sprint and how they plan to do it."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Retrospectives",
    description:
      "Retrospectives help teams reflect on what worked, what did not and what should improve."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Backlog management",
    description:
      "Backlog management means keeping tasks, user stories and priorities organized and understandable."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Waterfall",
    description:
      "Waterfall is a sequential project approach with defined phases and less flexibility during delivery."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Change management",
    description:
      "Change management helps people and organizations adopt new processes, tools or structures."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Process improvement",
    description:
      "Process improvement means identifying inefficient workflows and making them simpler, faster or more reliable."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Requirements gathering",
    description:
      "Requirements gathering means understanding what users, clients or stakeholders actually need."
  },

  {
    type: "skill",
    group: "Tools",
    skill: "Jira",
    description:
      "Jira is commonly used for task tracking, sprint planning, backlog management and agile reporting."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Confluence",
    description:
      "Confluence is used for documentation, meeting notes, project pages and knowledge sharing."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "MS Project",
    description:
      "MS Project supports project scheduling, dependencies, resources and timeline management."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Asana",
    description:
      "Asana is used to manage tasks, timelines, responsibilities and team coordination."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Trello",
    description:
      "Trello is a simple visual task management tool based on boards, lists and cards."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Notion",
    description:
      "Notion can be used for documentation, planning, databases and lightweight project management."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "MS Excel",
    description:
      "Excel is useful for tracking, reporting, budgeting, analysis and project overview tables."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Power BI",
    description:
      "Power BI helps create dashboards and visualize project or business data."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Slack",
    description:
      "Slack is used for team communication, quick updates and channel-based collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Microsoft Teams",
    description:
      "Microsoft Teams supports meetings, chat, file sharing and collaboration in many organizations."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Google Workspace",
    description:
      "Google Workspace includes tools such as Docs, Sheets, Drive and Meet for collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Miro",
    description:
      "Miro is useful for workshops, brainstorming, process mapping and visual collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Figma",
    description:
      "Figma is often used with design teams for prototypes, product mockups and visual collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "CRM",
    description:
      "CRM tools help manage customer data, relationships, pipelines and communication history."
  },

  {
    type: "skill",
    group: "Soft Skills",
    skill: "Communication",
    description:
      "Communication is critical for explaining goals, sharing status, resolving ambiguity and aligning stakeholders."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Leadership",
    description:
      "Leadership means guiding people, making decisions and creating clarity even without formal authority."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Teamwork",
    description:
      "Teamwork is the ability to collaborate, support others and contribute to a shared outcome."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Problem solving",
    description:
      "Problem solving means identifying root causes, evaluating options and choosing practical solutions."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Time management",
    description:
      "Time management helps you handle deadlines, meetings, priorities and workload without chaos."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Negotiation",
    description:
      "Negotiation is useful when aligning scope, deadlines, budgets, priorities or stakeholder expectations."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Presentation skills",
    description:
      "Presentation skills help you explain ideas, results and project updates clearly to different audiences."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Conflict resolution",
    description:
      "Conflict resolution means handling disagreements constructively before they damage the project."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Decision making",
    description:
      "Decision making is the ability to choose a direction with incomplete information and accept responsibility."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Critical thinking",
    description:
      "Critical thinking means questioning assumptions, checking evidence and avoiding weak conclusions."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Adaptability",
    description:
      "Adaptability is the ability to respond to changes without losing focus or momentum."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Ownership",
    description:
      "Ownership means taking responsibility for results, not only completing assigned tasks."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Empathy",
    description:
      "Empathy helps understand user needs, stakeholder concerns and team dynamics."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Stress management",
    description:
      "Stress management is important when projects face deadlines, conflicts or high uncertainty."
  },

  {
    type: "skill",
    group: "Business Skills",
    skill: "Business analysis",
    description:
      "Business analysis connects business needs with practical solutions, requirements and measurable outcomes."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "KPI tracking",
    description:
      "KPI tracking means monitoring key metrics to understand progress and performance."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Vendor management",
    description:
      "Vendor management involves working with external suppliers, contracts, deadlines and delivery quality."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Customer orientation",
    description:
      "Customer orientation means understanding customer needs and using them to guide decisions."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Strategic thinking",
    description:
      "Strategic thinking connects daily work with long-term goals and business priorities."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Financial awareness",
    description:
      "Financial awareness helps understand cost, value, profitability and resource trade-offs."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Data-driven decision making",
    description:
      "Data-driven decision making means using evidence and metrics instead of assumptions."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Documentation",
    description:
      "Documentation creates clarity, continuity and shared understanding across the team."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Quality management",
    description:
      "Quality management focuses on standards, acceptance criteria, feedback and continuous improvement."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Process mapping",
    description:
      "Process mapping helps visualize how work flows and where inefficiencies exist."
  },

  {
    type: "language",
    group: "Languages",
    skill: "English",
    description:
      "English is often required for international teams, documentation, meetings and stakeholder communication."
  },
  {
    type: "language",
    group: "Languages",
    skill: "Czech",
    description:
      "Czech can be important for local communication, clients, documentation and internal operations."
  },
  {
    type: "language",
    group: "Languages",
    skill: "Slovak",
    description:
      "Slovak can be useful for communication in Czech-Slovak teams and regional business environments."
  },
  {
    type: "language",
    group: "Languages",
    skill: "German",
    description:
      "German is useful for companies working with DACH markets or German-speaking stakeholders."
  },
  {
    type: "language",
    group: "Languages",
    skill: "Polish",
    description:
      "Polish can help in Central European teams, suppliers, clients or regional operations."
  },
  {
    type: "language",
    group: "Languages",
    skill: "French",
    description:
      "French can be useful in international companies, customer-facing roles or European projects."
  }
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
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  useEffect(() => {
    const savedProfile = window.localStorage.getItem(STORAGE_KEY);

    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setAnswers({
          ...createInitialAnswers(),
          ...parsedProfile
        });
        setProfileSaved(true);
      } catch {
        setProfileSaved(false);
      }
    }
  }, []);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((value) => value > 0).length;
  }, [answers]);

  function updateAnswer(value) {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.skill]: Number(value)
    }));
    setResult(null);
  }

  function goPrevious() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  function goNext() {
    setCurrentIndex((index) => Math.min(QUESTIONS.length - 1, index + 1));
  }

  function saveSkillProfile() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    setProfileSaved(true);
    alert("Your skill profile has been saved in this browser.");
  }

  function resetSkillProfile() {
    const confirmed = confirm("Do you really want to delete your saved skill profile?");
    if (!confirmed) return;

    const emptyProfile = createInitialAnswers();
    setAnswers(emptyProfile);
    window.localStorage.removeItem(STORAGE_KEY);
    setProfileSaved(false);
    setResult(null);
  }

  function clearPositionText() {
    setJobText("");
    setResult(null);
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
      alert("Rate at least 5 skills before running the analysis.");
      setLoading(false);
      return;
    }

    if (!jobText) {
      alert("Paste a job description first.");
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
          jobUrl: "",
          jobText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Analysis failed.");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (error) {
      alert("Server connection error.");
    }

    setLoading(false);
  }

  return (
    <>
      <main className="page">
        <section className="hero">
          <div className="heroContent">
            <div className="badge">Student career tool · MVP prototype</div>
            <h1>Find out if your skills match the job.</h1>
            <p>
              Skills Heatmap helps students compare their current skill profile
              with real job descriptions. Fill in your skills once, save your
              profile, and test different roles in seconds.
            </p>

            <div className="heroActions">
              <a href="#questionnaire" className="primaryLink">Start skill check</a>
              <a href="#compare" className="secondaryLink">Compare a job</a>
            </div>

            <div className="trustRow">
              <span>No PDF upload</span>
              <span>No paid AI API needed</span>
              <span>Profile saved locally</span>
            </div>
          </div>

          <div className="heroPanel">
            <div className="miniLogo">SH</div>
            <h3>How it works</h3>
            <ol>
              <li>Rate your project management skills.</li>
              <li>Save your profile in this browser.</li>
              <li>Paste a job description.</li>
              <li>Get a skills heatmap and improvement plan.</li>
            </ol>
          </div>
        </section>

        <section className="valueGrid">
          <div>
            <strong>For students</strong>
            <p>Understand what you already have and what blocks you from stronger roles.</p>
          </div>
          <div>
            <strong>For career planning</strong>
            <p>Turn vague job requirements into concrete skill gaps.</p>
          </div>
          <div>
            <strong>For Agile delivery</strong>
            <p>A realistic MVP: structured input, quick iteration and measurable output.</p>
          </div>
        </section>

        <section className="card intro" id="questionnaire">
          <h2>1. Build your skill profile</h2>
          <p>
            Be honest. The goal is not to look perfect. The goal is to see where
            you are strong, where you are weak and which skills are worth improving first.
          </p>

          <div className="profileStatus">
            <span>
              {profileSaved ? "Profile saved in browser" : "Profile not saved yet"}
            </span>
            <span>Rated skills: {answeredCount}</span>
          </div>

          <div className="progressMeta">
            <span>Question {currentIndex + 1} / {QUESTIONS.length}</span>
            <span>{progress}% completed</span>
          </div>

          <div className="progressBar">
            <div style={{ width: `${progress}%` }} />
          </div>

          <div className="saveActions">
            <button onClick={saveSkillProfile}>Save my skill profile</button>
            <button className="secondary" onClick={resetSkillProfile}>
              Delete saved profile
            </button>
          </div>
        </section>

        <section className="questionCard">
          <div className="questionTop">
            <span>{currentQuestion.group}</span>
            <strong>{progress}%</strong>
          </div>

          <div className="questionAnimated" key={currentQuestion.skill}>
            <h2>{currentQuestion.skill}</h2>
            <p>{currentQuestion.description}</p>

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
              ← Previous
            </button>
            <button onClick={goNext} disabled={currentIndex === QUESTIONS.length - 1}>
              Next →
            </button>
          </div>
        </section>

        <section className="card" id="compare">
          <h2>2. Compare a job description</h2>
          <p className="helperText">
            Paste any project management job description below. You can replace
            the text and run the comparison again without rebuilding your profile.
          </p>

          <div className="formBlock">
            <label>Job description text</label>
            <textarea
              placeholder="Paste the full job description here..."
              value={jobText}
              onChange={(event) => {
                setJobText(event.target.value);
                setResult(null);
              }}
            />
          </div>

          <div className="positionActions">
            <button onClick={handleAnalyze} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze match"}
            </button>
            <button className="secondary" onClick={clearPositionText}>
              Clear job text
            </button>
          </div>
        </section>

        {result && (
          <section className="results">
            <div className="scoreCard">
              <p>Overall match</p>
              <h2>{result.matchScore}%</h2>
              <strong>{result.trafficLight}</strong>
            </div>

            <div className="grid">
              <div className="resultBox">
                <h3>Strong matches</h3>
                {result.matchedSkills?.map((skill) => (
                  <span className="pill good" key={skill}>{skill}</span>
                ))}
              </div>

              <div className="resultBox">
                <h3>Weak or missing skills</h3>
                {result.missingSkills?.map((skill) => (
                  <span className="pill bad" key={skill}>{skill}</span>
                ))}
              </div>

              <div className="resultBox">
                <h3>Recommendations</h3>
                {result.cvRecommendations?.map((item) => (
                  <p className="recommendation" key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="summary">
              <h3>Summary</h3>
              <p>{result.summary}</p>
            </div>
          </section>
        )}
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at top left, rgba(95, 127, 255, 0.18), transparent 34%),
            linear-gradient(180deg, #f7f9ff 0%, #eef2ff 42%, #f8fafc 100%);
          color: #111827;
          font-family: Arial, sans-serif;
        }

        .page {
          max-width: 1180px;
          margin: 0 auto;
          padding: 34px 20px 60px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 24px;
          background:
            linear-gradient(135deg, #111827 0%, #1e1b4b 55%, #5f7fff 140%);
          color: white;
          border-radius: 34px;
          padding: 58px;
          margin-bottom: 24px;
          box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24);
          overflow: hidden;
          position: relative;
        }

        .hero::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          right: -80px;
          top: -70px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
        }

        .heroContent,
        .heroPanel {
          position: relative;
          z-index: 1;
        }

        .badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.13);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 16px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 24px;
        }

        h1 {
          font-size: 66px;
          margin: 0 0 20px;
          letter-spacing: -3px;
          line-height: 0.98;
          max-width: 760px;
        }

        .hero p {
          max-width: 720px;
          color: #dbeafe;
          font-size: 19px;
          line-height: 1.7;
          margin: 0;
        }

        .heroActions {
          display: flex;
          gap: 14px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .primaryLink,
        .secondaryLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 900;
          border-radius: 999px;
          padding: 14px 20px;
        }

        .primaryLink {
          background: white;
          color: #111827;
        }

        .secondaryLink {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.24);
        }

        .trustRow {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 28px;
        }

        .trustRow span {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #eff6ff;
          border-radius: 999px;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 800;
        }

        .heroPanel {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 28px;
          padding: 26px;
          align-self: stretch;
          backdrop-filter: blur(12px);
        }

        .miniLogo {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: white;
          color: #5f7fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 1000;
          margin-bottom: 18px;
        }

        .heroPanel h3 {
          margin: 0 0 14px;
        }

        .heroPanel ol {
          margin: 0;
          padding-left: 20px;
          color: #e0e7ff;
          line-height: 1.9;
          font-weight: 700;
        }

        .valueGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .valueGrid div {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
        }

        .valueGrid strong {
          display: block;
          margin-bottom: 8px;
          font-size: 18px;
        }

        .valueGrid p {
          margin: 0;
          color: #4b5563;
          line-height: 1.55;
        }

        .card,
        .questionCard,
        .results {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(226, 232, 240, 0.9);
          border-radius: 30px;
          padding: 32px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
          margin-bottom: 28px;
        }

        .intro p,
        .helperText {
          color: #4b5563;
          line-height: 1.6;
        }

        .profileStatus,
        .progressMeta {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          font-weight: 900;
          color: #4b5563;
          margin-top: 18px;
        }

        .profileStatus span:first-child {
          background: #ecfdf5;
          color: #166534;
          padding: 10px 14px;
          border-radius: 999px;
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
          background: linear-gradient(90deg, #5f7fff, #111827);
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .saveActions,
        .positionActions,
        .navigation {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 24px;
        }

        .questionTop {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: #6b7280;
          font-weight: 900;
          margin-bottom: 24px;
        }

        .questionAnimated {
          animation: slideIn 0.24s ease;
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
          font-size: 46px;
          margin: 0 0 12px;
          letter-spacing: -1.5px;
        }

        .questionAnimated p {
          color: #4b5563;
          font-size: 17px;
          line-height: 1.7;
          max-width: 820px;
        }

        .sliderValue {
          margin: 28px 0 18px;
          background: #111827;
          color: white;
          display: inline-block;
          padding: 13px 18px;
          border-radius: 999px;
          font-weight: 1000;
        }

        .range {
          width: 100%;
          accent-color: #5f7fff;
        }

        .scaleLabels {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
          margin-top: 12px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 800;
          text-align: center;
        }

        .formBlock {
          margin-bottom: 22px;
        }

        label {
          display: block;
          font-weight: 900;
          margin-bottom: 10px;
        }

        textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 18px;
          padding: 16px;
          font-size: 15px;
          outline: none;
          background: white;
          min-height: 230px;
          resize: vertical;
        }

        textarea:focus {
          border-color: #5f7fff;
          box-shadow: 0 0 0 4px rgba(95, 127, 255, 0.12);
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
          font-weight: 900;
        }

        button:hover {
          background: #1f2937;
        }

        button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .secondary {
          background: #e5e7eb;
          color: #111827;
        }

        .secondary:hover {
          background: #d1d5db;
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
          font-weight: 900;
          margin: 0;
        }

        .scoreCard h2 {
          font-size: 74px;
          margin: 8px 0;
        }

        .scoreCard strong {
          display: inline-block;
          background: #eef2ff;
          color: #3730a3;
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
          font-weight: 800;
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
          font-weight: 700;
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
            grid-template-columns: 1fr;
            padding: 34px;
          }

          h1 {
            font-size: 42px;
          }

          .valueGrid,
          .grid,
          .navigation,
          .saveActions,
          .positionActions {
            grid-template-columns: 1fr;
          }

          .questionAnimated h2 {
            font-size: 34px;
          }

          .profileStatus,
          .progressMeta {
            flex-direction: column;
          }

          .scaleLabels {
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}
