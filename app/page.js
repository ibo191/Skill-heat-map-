"use client";

import { useEffect, useMemo, useState } from "react";

const PROFILE_STORAGE_KEY = "skillsHeatmapProfileV4";
const USERS_STORAGE_KEY = "skillsHeatmapUsersV1";
const SESSION_STORAGE_KEY = "skillsHeatmapSessionV1";

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
      "Break a project into phases, define milestones, estimate effort and create a realistic delivery plan."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Roadmap planning",
    description:
      "Connect long-term goals with practical delivery steps and understand how priorities change over time."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Risk management",
    description:
      "Identify possible problems early, assess their impact and prepare mitigation actions."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Budgeting",
    description:
      "Understand costs, track spending and keep the project financially realistic."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Reporting",
    description:
      "Communicate project status clearly: progress, risks, blockers, deadlines and next steps."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Stakeholder management",
    description:
      "Work with people affected by the project, manage expectations and keep them aligned."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Prioritization",
    description:
      "Decide what matters most when time, people or budget are limited."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Project documentation",
    description:
      "Keep decisions, requirements, plans and responsibilities clear and traceable."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Project coordination",
    description:
      "Keep tasks, people, meetings and deadlines organized so the project keeps moving."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Resource planning",
    description:
      "Know who is needed, when they are needed and whether the team has enough capacity."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Timeline management",
    description:
      "Manage deadlines, dependencies and realistic scheduling."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Scope management",
    description:
      "Prevent uncontrolled project expansion and keep delivery focused on agreed goals."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Meeting facilitation",
    description:
      "Run useful meetings with clear agenda, decisions, owners and follow-up actions."
  },
  {
    type: "skill",
    group: "Project Management",
    skill: "Project governance",
    description:
      "Define how decisions are made, who approves changes and how project control is maintained."
  },

  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Agile",
    description:
      "Deliver value iteratively, adapt to feedback and work in smaller increments."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Scrum",
    description:
      "Use sprints, roles, ceremonies and backlog management to deliver work iteratively."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Kanban",
    description:
      "Visualize work, limit work in progress and improve delivery flow."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Sprint planning",
    description:
      "Define what the team will deliver in the next sprint and how it will be done."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Retrospectives",
    description:
      "Help teams reflect on what worked, what did not and what should improve."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Backlog management",
    description:
      "Keep tasks, user stories and priorities organized and understandable."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Waterfall",
    description:
      "Work with a sequential project approach with defined phases and lower flexibility."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Change management",
    description:
      "Help people and organizations adopt new processes, tools or structures."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Process improvement",
    description:
      "Identify inefficient workflows and make them simpler, faster or more reliable."
  },
  {
    type: "skill",
    group: "Agile / Methods",
    skill: "Requirements gathering",
    description:
      "Understand what users, clients or stakeholders actually need."
  },

  {
    type: "skill",
    group: "Tools",
    skill: "Jira",
    description:
      "Use Jira for task tracking, sprint planning, backlog management and agile reporting."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Confluence",
    description:
      "Use Confluence for documentation, meeting notes, project pages and knowledge sharing."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "MS Project",
    description:
      "Use MS Project for scheduling, dependencies, resources and timeline management."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Asana",
    description:
      "Manage tasks, timelines, responsibilities and team coordination."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Trello",
    description:
      "Use boards, lists and cards for lightweight visual task management."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Notion",
    description:
      "Use Notion for documentation, planning, databases and lightweight project management."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "MS Excel",
    description:
      "Use Excel for tracking, reporting, budgeting, analysis and project overview tables."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Power BI",
    description:
      "Create dashboards and visualize project or business data."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Slack",
    description:
      "Use Slack for team communication, quick updates and channel-based collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Microsoft Teams",
    description:
      "Use Teams for meetings, chat, file sharing and collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Google Workspace",
    description:
      "Work with Google Docs, Sheets, Drive and Meet for collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Miro",
    description:
      "Use Miro for workshops, brainstorming, process mapping and visual collaboration."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "Figma",
    description:
      "Collaborate with design teams on prototypes, product mockups and visual materials."
  },
  {
    type: "skill",
    group: "Tools",
    skill: "CRM",
    description:
      "Work with customer data, pipelines, relationships and communication history."
  },

  {
    type: "skill",
    group: "Soft Skills",
    skill: "Communication",
    description:
      "Explain goals, share status, resolve ambiguity and align stakeholders."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Leadership",
    description:
      "Guide people, make decisions and create clarity even without formal authority."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Teamwork",
    description:
      "Collaborate, support others and contribute to a shared outcome."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Problem solving",
    description:
      "Identify root causes, evaluate options and choose practical solutions."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Time management",
    description:
      "Handle deadlines, meetings, priorities and workload without chaos."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Negotiation",
    description:
      "Align scope, deadlines, budgets, priorities or stakeholder expectations."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Presentation skills",
    description:
      "Explain ideas, results and project updates clearly to different audiences."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Conflict resolution",
    description:
      "Handle disagreements constructively before they damage the project."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Decision making",
    description:
      "Choose a direction with incomplete information and accept responsibility."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Critical thinking",
    description:
      "Question assumptions, check evidence and avoid weak conclusions."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Adaptability",
    description:
      "Respond to changes without losing focus or momentum."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Ownership",
    description:
      "Take responsibility for results, not only for assigned tasks."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Empathy",
    description:
      "Understand user needs, stakeholder concerns and team dynamics."
  },
  {
    type: "skill",
    group: "Soft Skills",
    skill: "Stress management",
    description:
      "Stay effective when projects face deadlines, conflicts or uncertainty."
  },

  {
    type: "skill",
    group: "Business Skills",
    skill: "Business analysis",
    description:
      "Connect business needs with practical solutions, requirements and measurable outcomes."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "KPI tracking",
    description:
      "Monitor key metrics to understand progress and performance."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Vendor management",
    description:
      "Work with external suppliers, contracts, deadlines and delivery quality."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Customer orientation",
    description:
      "Understand customer needs and use them to guide decisions."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Strategic thinking",
    description:
      "Connect daily work with long-term goals and business priorities."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Financial awareness",
    description:
      "Understand cost, value, profitability and resource trade-offs."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Data-driven decision making",
    description:
      "Use evidence and metrics instead of assumptions."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Documentation",
    description:
      "Create clarity, continuity and shared understanding across the team."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Quality management",
    description:
      "Work with standards, acceptance criteria, feedback and continuous improvement."
  },
  {
    type: "skill",
    group: "Business Skills",
    skill: "Process mapping",
    description:
      "Visualize how work flows and where inefficiencies exist."
  },

  {
    type: "language",
    group: "Languages",
    skill: "English",
    description:
      "English is often required for international teams, documentation and stakeholder communication."
  },
  {
    type: "language",
    group: "Languages",
    skill: "Czech",
    description:
      "Czech can be important for local communication, clients and documentation."
  },
  {
    type: "language",
    group: "Languages",
    skill: "Slovak",
    description:
      "Slovak can be useful in Czech-Slovak teams and regional business environments."
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
      "Polish can help in Central European teams, suppliers or regional operations."
  },
  {
    type: "language",
    group: "Languages",
    skill: "French",
    description:
      "French can be useful in international companies and European projects."
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

function getUsers() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Home() {
  const [answers, setAnswers] = useState(createInitialAnswers());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("signup");
  const [completionPromptShown, setCompletionPromptShown] = useState(false);

  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");

  const [analysisCompany, setAnalysisCompany] = useState("");
  const [analysisNote, setAnalysisNote] = useState("");

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((value) => value > 0).length;
  }, [answers]);

  const currentUser = useMemo(() => {
    if (!currentUserEmail) return null;
    const users = getUsers();
    return users[currentUserEmail] || null;
  }, [currentUserEmail, authModalOpen, profileSaved, result]);

  useEffect(() => {
    const users = getUsers();
    const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (savedSession && users[savedSession]) {
      const user = users[savedSession];
      setCurrentUserEmail(user.email);
      setProfileName(user.name);
      setProfileEmail(user.email);
      setAnswers({
        ...createInitialAnswers(),
        ...user.skillProfile
      });
      setProfileSaved(true);
      return;
    }

    const localProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (localProfile) {
      try {
        const parsedProfile = JSON.parse(localProfile);
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

  useEffect(() => {
    if (
      answeredCount === QUESTIONS.length &&
      !completionPromptShown &&
      !currentUserEmail
    ) {
      setCompletionPromptShown(true);
      setModalMode("signup");
      setAuthModalOpen(true);
    }
  }, [answeredCount, completionPromptShown, currentUserEmail]);

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

  function openSignup() {
    setModalMode("signup");
    setAuthModalOpen(true);
  }

  function openLogin() {
    setModalMode("login");
    setAuthModalOpen(true);
  }

  function openProfile() {
    if (!currentUserEmail) {
      openLogin();
      return;
    }

    const users = getUsers();
    const user = users[currentUserEmail];

    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfilePassword("");
    }

    setModalMode("profile");
    setAuthModalOpen(true);
  }

  function handleSignup(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "").trim();

    if (!name || !email || !password) {
      alert("Fill in name, email and password.");
      return;
    }

    const users = getUsers();

    if (users[email]) {
      alert("An account with this email already exists. Log in instead.");
      return;
    }

    users[email] = {
      id: createId(),
      name,
      email,
      password,
      skillProfile: answers,
      analyses: []
    };

    saveUsers(users);
    window.localStorage.setItem(SESSION_STORAGE_KEY, email);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(answers));

    setCurrentUserEmail(email);
    setProfileName(name);
    setProfileEmail(email);
    setProfileSaved(true);
    setModalMode("profile");
  }

  function handleLogin(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "").trim();

    const users = getUsers();
    const user = users[email];

    if (!user || user.password !== password) {
      alert("Incorrect email or password.");
      return;
    }

    setCurrentUserEmail(email);
    setProfileName(user.name);
    setProfileEmail(user.email);
    setAnswers({
      ...createInitialAnswers(),
      ...user.skillProfile
    });
    setProfileSaved(true);
    window.localStorage.setItem(SESSION_STORAGE_KEY, email);
    setModalMode("profile");
  }

  function saveSkillProfile() {
    if (currentUserEmail) {
      const users = getUsers();
      const user = users[currentUserEmail];

      if (user) {
        user.skillProfile = answers;
        users[currentUserEmail] = user;
        saveUsers(users);
      }
    }

    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(answers));
    setProfileSaved(true);
    alert("Your skill profile has been saved.");
  }

  function saveProfileChanges() {
    if (!currentUserEmail) return;

    const users = getUsers();
    const user = users[currentUserEmail];

    if (!user) return;

    const newEmail = profileEmail.trim().toLowerCase();

    if (!profileName.trim() || !newEmail) {
      alert("Name and email cannot be empty.");
      return;
    }

    if (newEmail !== currentUserEmail && users[newEmail]) {
      alert("This email is already used by another profile.");
      return;
    }

    const updatedUser = {
      ...user,
      name: profileName.trim(),
      email: newEmail,
      password: profilePassword.trim() ? profilePassword.trim() : user.password,
      skillProfile: answers
    };

    delete users[currentUserEmail];
    users[newEmail] = updatedUser;

    saveUsers(users);
    window.localStorage.setItem(SESSION_STORAGE_KEY, newEmail);

    setCurrentUserEmail(newEmail);
    setProfileEmail(newEmail);
    setProfilePassword("");
    setProfileSaved(true);

    alert("Profile updated.");
  }

  function deleteProfile() {
    if (!currentUserEmail) return;

    const confirmed = confirm(
      "Do you really want to delete your profile and all saved analyses?"
    );

    if (!confirmed) return;

    const users = getUsers();
    delete users[currentUserEmail];
    saveUsers(users);

    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);

    setCurrentUserEmail("");
    setProfileName("");
    setProfileEmail("");
    setProfilePassword("");
    setAnswers(createInitialAnswers());
    setProfileSaved(false);
    setResult(null);
    setAuthModalOpen(false);
  }

  function logout() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentUserEmail("");
    setProfileName("");
    setProfileEmail("");
    setProfilePassword("");
    setAuthModalOpen(false);
  }

  function clearPositionText() {
    setJobText("");
    setResult(null);
    setAnalysisCompany("");
    setAnalysisNote("");
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

      setResult({
        ...data,
        id: createId(),
        createdAt: new Date().toISOString(),
        jobText
      });
    } catch (error) {
      alert("Server connection error.");
    }

    setLoading(false);
  }

  function saveAnalysis() {
    if (!result) return;

    if (!currentUserEmail) {
      setModalMode("signup");
      setAuthModalOpen(true);
      return;
    }

    const company = analysisCompany.trim();
    const note = analysisNote.trim();

    if (!company) {
      alert("Add a company or position name before saving.");
      return;
    }

    const users = getUsers();
    const user = users[currentUserEmail];

    if (!user) return;

    const savedAnalysis = {
      ...result,
      company,
      note
    };

    user.analyses = [savedAnalysis, ...(user.analyses || [])];
    user.skillProfile = answers;
    users[currentUserEmail] = user;

    saveUsers(users);
    setModalMode("profile");
    setAuthModalOpen(true);
    setAnalysisCompany("");
    setAnalysisNote("");
    alert("Analysis saved to your profile.");
  }

  return (
    <>
      <main className="page">
        <nav className="topNav">
          <div className="brand">
            <div className="brandLogo">SH</div>
            <div>
              <strong>Skills Heatmap</strong>
              <span>Career fit checker</span>
            </div>
          </div>

          <div className="navActions">
            {currentUserEmail ? (
              <>
                <button className="smallSecondary" onClick={openProfile}>
                  My profile
                </button>
                <button className="smallGhost" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <button className="smallSecondary" onClick={openLogin}>
                  Log in
                </button>
                <button className="smallPrimary" onClick={openSignup}>
                  Sign up
                </button>
              </>
            )}
          </div>
        </nav>

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
              <li>Create a profile and save your skills.</li>
              <li>Paste different job descriptions.</li>
              <li>Save analyses and return to them later.</li>
            </ol>
          </div>
        </section>

        <section className="valueGrid">
          <div>
            <strong>For students</strong>
            <p>Understand what you already have and what blocks you from stronger roles.</p>
          </div>
          <div>
            <strong>Saved profile</strong>
            <p>Fill the questionnaire once and reuse your profile across different job descriptions.</p>
          </div>
          <div>
            <strong>Saved analyses</strong>
            <p>Keep comparisons for later and add notes such as company or position name.</p>
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
              {profileSaved ? "Profile saved" : "Profile not saved yet"}
            </span>
            <span>Rated skills: {answeredCount} / {QUESTIONS.length}</span>
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
            <button className="secondary" onClick={openProfile}>
              Open profile
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

            <div className="saveAnalysisBox">
              <h3>Save this analysis</h3>
              <p>
                Add a company or position name and an optional note. You can return
                to saved comparisons from your profile.
              </p>

              <input
                placeholder="Company or position name"
                value={analysisCompany}
                onChange={(event) => setAnalysisCompany(event.target.value)}
              />

              <textarea
                className="smallTextarea"
                placeholder="Optional note"
                value={analysisNote}
                onChange={(event) => setAnalysisNote(event.target.value)}
              />

              <button onClick={saveAnalysis}>
                Save analysis to profile
              </button>
            </div>
          </section>
        )}
      </main>

      {authModalOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <button className="modalClose" onClick={() => setAuthModalOpen(false)}>
              ×
            </button>

            {modalMode === "signup" && (
              <>
                <h2>Create your profile</h2>
                <p className="modalText">
                  Save your skill profile and keep job comparisons for later.
                  This demo stores data locally in your browser.
                </p>

                <form onSubmit={handleSignup} className="modalForm">
                  <label>Name</label>
                  <input name="name" placeholder="Your name" />

                  <label>Email</label>
                  <input name="email" type="email" placeholder="you@example.com" />

                  <label>Password</label>
                  <input name="password" type="password" placeholder="Create password" />

                  <button type="submit">Create profile</button>
                </form>

                <button className="textButton" onClick={() => setModalMode("login")}>
                  Already have a profile? Log in
                </button>
              </>
            )}

            {modalMode === "login" && (
              <>
                <h2>Log in</h2>
                <p className="modalText">
                  Open your saved skill profile and previous analyses.
                </p>

                <form onSubmit={handleLogin} className="modalForm">
                  <label>Email</label>
                  <input name="email" type="email" placeholder="you@example.com" />

                  <label>Password</label>
                  <input name="password" type="password" placeholder="Password" />

                  <button type="submit">Log in</button>
                </form>

                <button className="textButton" onClick={() => setModalMode("signup")}>
                  No profile yet? Sign up
                </button>
              </>
            )}

            {modalMode === "profile" && (
              <>
                <h2>My profile</h2>
                <p className="modalText">
                  Manage your profile, update your saved skill profile and return
                  to previous job comparisons.
                </p>

                {currentUser ? (
                  <>
                    <div className="profileEdit">
                      <label>Name</label>
                      <input
                        value={profileName}
                        onChange={(event) => setProfileName(event.target.value)}
                      />

                      <label>Email</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(event) => setProfileEmail(event.target.value)}
                      />

                      <label>New password</label>
                      <input
                        type="password"
                        placeholder="Leave empty to keep current password"
                        value={profilePassword}
                        onChange={(event) => setProfilePassword(event.target.value)}
                      />

                      <button onClick={saveProfileChanges}>Save profile changes</button>
                    </div>

                    <div className="profileActions">
                      <button className="secondary" onClick={saveSkillProfile}>
                        Save current skills
                      </button>
                      <button className="secondary" onClick={logout}>
                        Log out
                      </button>
                      <button className="danger" onClick={deleteProfile}>
                        Delete profile
                      </button>
                    </div>

                    <div className="savedAnalyses">
                      <h3>Saved analyses</h3>

                      {!currentUser.analyses || currentUser.analyses.length === 0 ? (
                        <p className="emptyText">No saved analyses yet.</p>
                      ) : (
                        currentUser.analyses.map((analysis) => (
                          <div className="analysisItem" key={analysis.id}>
                            <div>
                              <strong>{analysis.company}</strong>
                              <span>
                                {new Date(analysis.createdAt).toLocaleDateString()} · {analysis.matchScore}% · {analysis.trafficLight}
                              </span>
                            </div>

                            {analysis.note && <p>{analysis.note}</p>}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <p className="emptyText">Log in or create a profile first.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

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
          padding: 26px 20px 60px;
        }

        .topNav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 22px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brandLogo {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: linear-gradient(135deg, #5f7fff, #111827);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 1000;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand span {
          color: #6b7280;
          font-size: 13px;
          margin-top: 2px;
        }

        .navActions {
          display: flex;
          gap: 10px;
        }

        .smallPrimary,
        .smallSecondary,
        .smallGhost {
          padding: 11px 14px;
          width: auto;
          border-radius: 999px;
          font-size: 14px;
        }

        .smallPrimary {
          background: #111827;
          color: white;
        }

        .smallSecondary {
          background: #eef2ff;
          color: #3730a3;
        }

        .smallGhost {
          background: transparent;
          color: #111827;
          border: 1px solid #d1d5db;
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
        .navigation,
        .profileActions {
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

        input,
        textarea {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 18px;
          padding: 16px;
          font-size: 15px;
          outline: none;
          background: white;
        }

        textarea {
          min-height: 230px;
          resize: vertical;
        }

        .smallTextarea {
          min-height: 90px;
          margin-top: 12px;
        }

        input:focus,
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

        .danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .danger:hover {
          background: #fecaca;
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

        .summary,
        .saveAnalysisBox {
          margin-top: 22px;
          background: #f3f4f6;
          border-radius: 22px;
          padding: 22px;
          line-height: 1.6;
        }

        .saveAnalysisBox input {
          margin-bottom: 12px;
        }

        .modalOverlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.58);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal {
          width: min(760px, 100%);
          max-height: 88vh;
          overflow: auto;
          background: white;
          border-radius: 30px;
          padding: 32px;
          position: relative;
          box-shadow: 0 28px 90px rgba(15, 23, 42, 0.34);
        }

        .modalClose {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 42px;
          height: 42px;
          padding: 0;
          border-radius: 999px;
          background: #f3f4f6;
          color: #111827;
          font-size: 24px;
        }

        .modalText {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 22px;
        }

        .modalForm,
        .profileEdit {
          display: grid;
          gap: 12px;
        }

        .textButton {
          background: transparent;
          color: #3730a3;
          padding: 12px 0 0;
          margin-top: 10px;
        }

        .savedAnalyses {
          margin-top: 28px;
        }

        .analysisItem {
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 16px;
          margin-top: 12px;
          background: #f9fafb;
        }

        .analysisItem strong,
        .analysisItem span {
          display: block;
        }

        .analysisItem span {
          color: #6b7280;
          font-size: 13px;
          font-weight: 700;
          margin-top: 4px;
        }

        .analysisItem p {
          color: #374151;
          margin-bottom: 0;
          line-height: 1.5;
        }

        .emptyText {
          color: #6b7280;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .topNav {
            align-items: flex-start;
            flex-direction: column;
          }

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
          .positionActions,
          .profileActions {
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
