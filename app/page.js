"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createId,
  createInitialAnswers,
  getLevelLabel,
  getUsers,
  LANGUAGE_LEVELS,
  PROFILE_STORAGE_KEY,
  QUESTIONS,
  saveUsers,
  SESSION_STORAGE_KEY,
  SKILL_LEVELS
} from "./skillsData";

export default function Home() {
  const [answers, setAnswers] = useState(createInitialAnswers());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [signupOpen, setSignupOpen] = useState(false);
  const [completionPromptShown, setCompletionPromptShown] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [analysisCompany, setAnalysisCompany] = useState("");
  const [analysisNote, setAnalysisNote] = useState("");

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((value) => value > 0).length;
  }, [answers]);

  useEffect(() => {
    const users = getUsers();
    const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);

    if (savedSession && users[savedSession]) {
      const user = users[savedSession];
      setCurrentUserEmail(user.email);
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
      setSignupOpen(true);
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
      alert("An account with this email already exists. Open My profile and log in instead.");
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
    setProfileSaved(true);
    setSignupOpen(false);

    window.location.href = "/profile";
  }

  function logout() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentUserEmail("");
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
      setSignupOpen(true);
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
                <a className="navButton" href="/profile">My profile</a>
                <button className="smallGhost" onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <a className="navButton" href="/profile">Log in</a>
                <button className="smallPrimary" onClick={() => setSignupOpen(true)}>Sign up</button>
              </>
            )}
          </div>
        </nav>

        <section className="hero">
          <div className="heroContent">
            <div className="badge">Student career tool · MVP prototype</div>
            <h1>Find out if your skills match the job.</h1>
            <p>
              Build your skill profile once, save it, and compare it with different
              project management job descriptions.
            </p>

            <div className="heroActions">
              <a href="#questionnaire" className="primaryLink">Start skill check</a>
              <a href="#compare" className="secondaryLink">Compare a job</a>
            </div>

            <div className="trustRow">
              <span>No PDF upload</span>
              <span>No paid AI API needed</span>
              <span>Saved profile</span>
            </div>
          </div>

          <div className="heroPanel">
            <div className="miniLogo">SH</div>
            <h3>How it works</h3>
            <ol>
              <li>Rate your project management skills.</li>
              <li>Create a profile and save your skills.</li>
              <li>Paste job descriptions.</li>
              <li>Save analyses and return later.</li>
            </ol>
          </div>
        </section>

        <section className="valueGrid">
          <div>
            <strong>For students</strong>
            <p>Understand what you have and what blocks you from stronger roles.</p>
          </div>
          <div>
            <strong>Skill overview</strong>
            <p>Manage all saved skills from your profile page.</p>
          </div>
          <div>
            <strong>Saved analyses</strong>
            <p>Save comparisons and add notes such as company or position name.</p>
          </div>
        </section>

        <section className="card intro" id="questionnaire">
          <h2>1. Build your skill profile</h2>
          <p>
            Be honest. The goal is not to look perfect. The goal is to see where
            you are strong and which gaps are worth improving first.
          </p>

          <div className="profileStatus">
            <span>{profileSaved ? "Profile saved" : "Profile not saved yet"}</span>
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
            <a className="buttonLink secondary" href="/profile">Open profile</a>
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
            <button className="secondary" onClick={goPrevious} disabled={currentIndex === 0}>← Previous</button>
            <button onClick={goNext} disabled={currentIndex === QUESTIONS.length - 1}>Next →</button>
          </div>
        </section>

        <section className="card" id="compare">
          <h2>2. Compare a job description</h2>
          <p className="helperText">
            Paste any project management job description. You can replace the text
            and run the comparison again without rebuilding your profile.
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
            <button className="secondary" onClick={clearPositionText}>Clear job text</button>
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
              <button onClick={saveAnalysis}>Save analysis to profile</button>
            </div>
          </section>
        )}
      </main>

      {signupOpen && (
        <div className="modalOverlay">
          <div className="modal">
            <button className="modalClose" onClick={() => setSignupOpen(false)}>×</button>
            <h2>Create your profile</h2>
            <p className="modalText">
              Save your skill profile and keep job comparisons for later.
              This MVP stores data locally in your browser.
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

            <a className="textLink" href="/profile">Already have a profile? Log in</a>
          </div>
        </div>
      )}

      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0;
          background:
            radial-gradient(circle at top left, rgba(95, 127, 255, 0.18), transparent 34%),
            linear-gradient(180deg, #f7f9ff 0%, #eef2ff 42%, #f8fafc 100%);
          color: #111827;
          font-family: Arial, sans-serif;
        }
        .page { max-width: 1180px; margin: 0 auto; padding: 26px 20px 60px; }
        .topNav { display: flex; justify-content: space-between; align-items: center; gap: 18px; margin-bottom: 22px; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brandLogo { width: 46px; height: 46px; border-radius: 16px; background: linear-gradient(135deg, #5f7fff, #111827); color: white; display: flex; align-items: center; justify-content: center; font-weight: 1000; }
        .brand strong, .brand span { display: block; }
        .brand span { color: #6b7280; font-size: 13px; margin-top: 2px; }
        .navActions { display: flex; gap: 10px; }
        .navButton, .smallPrimary, .smallGhost {
          text-decoration: none;
          padding: 11px 14px;
          width: auto;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          cursor: pointer;
        }
        .navButton { background: #eef2ff; color: #3730a3; }
        .smallPrimary { background: #111827; color: white; }
        .smallGhost { background: transparent; color: #111827; border: 1px solid #d1d5db; }

        .hero {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 24px;
          background: linear-gradient(135deg, #111827 0%, #1e1b4b 55%, #5f7fff 140%);
          color: white;
          border-radius: 34px;
          padding: 58px;
          margin-bottom: 24px;
          box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24);
          overflow: hidden;
          position: relative;
        }
        .hero::after { content: ""; position: absolute; width: 260px; height: 260px; right: -80px; top: -70px; background: rgba(255,255,255,.1); border-radius: 999px; }
        .heroContent, .heroPanel { position: relative; z-index: 1; }
        .badge { display: inline-block; background: rgba(255,255,255,.13); border: 1px solid rgba(255,255,255,.2); padding: 10px 16px; border-radius: 999px; font-size: 14px; font-weight: 800; margin-bottom: 24px; }
        h1 { font-size: 66px; margin: 0 0 20px; letter-spacing: -3px; line-height: .98; max-width: 760px; }
        .hero p { max-width: 720px; color: #dbeafe; font-size: 19px; line-height: 1.7; margin: 0; }
        .heroActions { display: flex; gap: 14px; margin-top: 30px; flex-wrap: wrap; }
        .primaryLink, .secondaryLink, .buttonLink { display: inline-flex; align-items: center; justify-content: center; text-decoration: none; font-weight: 900; border-radius: 999px; padding: 14px 20px; }
        .primaryLink { background: white; color: #111827; }
        .secondaryLink { background: rgba(255,255,255,.12); color: white; border: 1px solid rgba(255,255,255,.24); }
        .trustRow { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
        .trustRow span { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.16); color: #eff6ff; border-radius: 999px; padding: 9px 12px; font-size: 13px; font-weight: 800; }
        .heroPanel { background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.18); border-radius: 28px; padding: 26px; align-self: stretch; backdrop-filter: blur(12px); }
        .miniLogo { width: 54px; height: 54px; border-radius: 18px; background: white; color: #5f7fff; display: flex; align-items: center; justify-content: center; font-weight: 1000; margin-bottom: 18px; }
        .heroPanel h3 { margin: 0 0 14px; }
        .heroPanel ol { margin: 0; padding-left: 20px; color: #e0e7ff; line-height: 1.9; font-weight: 700; }

        .valueGrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 28px; }
        .valueGrid div, .card, .questionCard, .results {
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(226,232,240,.9);
          border-radius: 30px;
          padding: 32px;
          box-shadow: 0 18px 45px rgba(15,23,42,.08);
          margin-bottom: 28px;
        }
        .valueGrid div { padding: 22px; }
        .valueGrid strong { display: block; margin-bottom: 8px; font-size: 18px; }
        .valueGrid p, .intro p, .helperText { margin: 0; color: #4b5563; line-height: 1.6; }

        .profileStatus, .progressMeta { display: flex; justify-content: space-between; gap: 16px; font-weight: 900; color: #4b5563; margin-top: 18px; }
        .profileStatus span:first-child { background: #ecfdf5; color: #166534; padding: 10px 14px; border-radius: 999px; }
        .progressBar { height: 12px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin-top: 12px; }
        .progressBar div { height: 100%; background: linear-gradient(90deg, #5f7fff, #111827); border-radius: 999px; transition: width .3s ease; }
        .saveActions, .positionActions, .navigation { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 24px; }
        .questionTop { display: flex; justify-content: space-between; gap: 16px; color: #6b7280; font-weight: 900; margin-bottom: 24px; }
        .questionAnimated { animation: slideIn .24s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        .questionAnimated h2 { font-size: 46px; margin: 0 0 12px; letter-spacing: -1.5px; }
        .questionAnimated p { color: #4b5563; font-size: 17px; line-height: 1.7; max-width: 820px; }
        .sliderValue { margin: 28px 0 18px; background: #111827; color: white; display: inline-block; padding: 13px 18px; border-radius: 999px; font-weight: 1000; }
        .range { width: 100%; accent-color: #5f7fff; }
        .scaleLabels { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-top: 12px; color: #6b7280; font-size: 12px; font-weight: 800; text-align: center; }
        .formBlock { margin-bottom: 22px; }
        label { display: block; font-weight: 900; margin-bottom: 10px; }
        input, textarea { width: 100%; border: 1px solid #d1d5db; border-radius: 18px; padding: 16px; font-size: 15px; outline: none; background: white; }
        textarea { min-height: 230px; resize: vertical; }
        .smallTextarea { min-height: 90px; margin-top: 12px; }
        input:focus, textarea:focus { border-color: #5f7fff; box-shadow: 0 0 0 4px rgba(95,127,255,.12); }
        button, .buttonLink { width: 100%; border: 0; background: #111827; color: white; padding: 17px 22px; border-radius: 18px; cursor: pointer; font-size: 16px; font-weight: 900; }
        button:hover { background: #1f2937; }
        button:disabled { background: #9ca3af; cursor: not-allowed; }
        .secondary { background: #e5e7eb; color: #111827; }
        .secondary:hover { background: #d1d5db; }

        .scoreCard { border: 2px solid #e5e7eb; border-radius: 24px; padding: 26px; margin-bottom: 24px; background: #f9fafb; }
        .scoreCard p { color: #6b7280; font-weight: 900; margin: 0; }
        .scoreCard h2 { font-size: 74px; margin: 8px 0; }
        .scoreCard strong { display: inline-block; background: #eef2ff; color: #3730a3; padding: 10px 14px; border-radius: 999px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .resultBox { background: #f9fafb; border-radius: 22px; padding: 22px; }
        .resultBox h3, .summary h3 { margin-top: 0; }
        .pill { display: block; border-radius: 999px; padding: 10px 14px; font-weight: 800; margin-bottom: 10px; font-size: 14px; }
        .good { background: #dcfce7; color: #166534; }
        .bad { background: #fee2e2; color: #991b1b; }
        .recommendation { background: #eef2ff; color: #3730a3; border-radius: 16px; padding: 13px; line-height: 1.45; font-weight: 700; }
        .summary, .saveAnalysisBox { margin-top: 22px; background: #f3f4f6; border-radius: 22px; padding: 22px; line-height: 1.6; }
        .saveAnalysisBox input { margin-bottom: 12px; }

        .modalOverlay { position: fixed; inset: 0; background: rgba(15,23,42,.58); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { width: min(560px, 100%); max-height: 88vh; overflow: auto; background: white; border-radius: 30px; padding: 32px; position: relative; box-shadow: 0 28px 90px rgba(15,23,42,.34); }
        .modalClose { position: absolute; top: 16px; right: 16px; width: 42px; height: 42px; padding: 0; border-radius: 999px; background: #f3f4f6; color: #111827; font-size: 24px; }
        .modalText { color: #4b5563; line-height: 1.6; margin-bottom: 22px; }
        .modalForm { display: grid; gap: 12px; }
        .textLink { display: block; color: #3730a3; font-weight: 900; margin-top: 16px; }

        @media (max-width: 900px) {
          .topNav { align-items: flex-start; flex-direction: column; }
          .hero { grid-template-columns: 1fr; padding: 34px; }
          h1 { font-size: 42px; }
          .valueGrid, .grid, .navigation, .saveActions, .positionActions { grid-template-columns: 1fr; }
          .questionAnimated h2 { font-size: 34px; }
          .profileStatus, .progressMeta { flex-direction: column; }
          .scaleLabels { font-size: 10px; }
        }
      `}</style>
    </>
  );
}
