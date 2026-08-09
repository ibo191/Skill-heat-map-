"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createInitialAnswers,
  getLevelLabel,
  getUsers,
  LANGUAGE_LEVELS,
  PROFILE_STORAGE_KEY,
  QUESTIONS,
  saveUsers,
  SESSION_STORAGE_KEY,
  SKILL_LEVELS
} from "../skillsData";
import { PRODUCT } from "../productConfig";

export default function ProfilePage() {
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [answers, setAnswers] = useState(createInitialAnswers());
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [checkoutIntent, setCheckoutIntent] = useState(false);

  const [analyses, setAnalyses] = useState([]);

  const currentUser = useMemo(() => {
    if (!currentUserEmail) return null;
    return getUsers()[currentUserEmail] || null;
  }, [currentUserEmail, analyses]);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((value) => value > 0).length;
  }, [answers]);

  const groupedQuestions = useMemo(() => {
    return QUESTIONS.reduce((acc, question) => {
      if (!acc[question.group]) acc[question.group] = [];
      acc[question.group].push(question);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const users = getUsers();
    const session = window.localStorage.getItem(SESSION_STORAGE_KEY);
    setCheckoutIntent(new URLSearchParams(window.location.search).get("checkout") === "developer");

    if (session && users[session]) {
      loadUser(users[session]);
    }
  }, []);

  function loadUser(user) {
    setCurrentUserEmail(user.email);
    setProfileName(user.name);
    setProfileEmail(user.email);
    setAnswers({
      ...createInitialAnswers(),
      ...user.skillProfile
    });
    setAnalyses(user.analyses || []);
  }

  function handleLogin(event) {
    event.preventDefault();

    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    const users = getUsers();
    const user = users[email];

    if (!user || user.password !== password) {
      alert("Incorrect email or password.");
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, email);
    loadUser(user);
  }

  function handleSignup(event) {
    event.preventDefault();

    const name = signupName.trim();
    const email = signupEmail.trim().toLowerCase();
    const password = signupPassword.trim();

    if (!name || !email || !password) {
      alert("Name, email and password are required.");
      return;
    }

    const users = getUsers();

    if (users[email]) {
      alert("This email already has a profile. Log in instead.");
      return;
    }

    const user = {
      name,
      email,
      password,
      skillProfile: createInitialAnswers(),
      analyses: [],
      badge: checkoutIntent ? "Developer badge" : ""
    };

    users[email] = user;
    saveUsers(users);
    window.localStorage.setItem(SESSION_STORAGE_KEY, email);
    loadUser(user);
    setSignupPassword("");
  }

  function updateAnswer(skill, value) {
    setAnswers((previous) => ({
      ...previous,
      [skill]: Number(value)
    }));
  }

  function saveSkills() {
    if (!currentUserEmail) return;

    const users = getUsers();
    const user = users[currentUserEmail];

    if (!user) return;

    user.skillProfile = answers;
    users[currentUserEmail] = user;

    saveUsers(users);
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(answers));

    alert("Skill profile updated.");
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
      skillProfile: answers,
      analyses
    };

    delete users[currentUserEmail];
    users[newEmail] = updatedUser;

    saveUsers(users);
    window.localStorage.setItem(SESSION_STORAGE_KEY, newEmail);

    setCurrentUserEmail(newEmail);
    setProfileEmail(newEmail);
    setProfilePassword("");

    alert("Profile updated.");
  }

  function deleteAnalysis(id) {
    const confirmed = confirm("Delete this saved analysis?");
    if (!confirmed) return;

    const updatedAnalyses = analyses.filter((analysis) => analysis.id !== id);
    setAnalyses(updatedAnalyses);

    const users = getUsers();
    const user = users[currentUserEmail];

    if (user) {
      user.analyses = updatedAnalyses;
      users[currentUserEmail] = user;
      saveUsers(users);
    }
  }

  function deleteProfile() {
    const confirmed = confirm("Delete your profile and all saved analyses?");
    if (!confirmed) return;

    const users = getUsers();
    delete users[currentUserEmail];
    saveUsers(users);

    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    window.localStorage.removeItem(PROFILE_STORAGE_KEY);

    setCurrentUserEmail("");
    setAnswers(createInitialAnswers());
    setAnalyses([]);
  }

  function logout() {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentUserEmail("");
    setAnswers(createInitialAnswers());
    setAnalyses([]);
  }

  if (!currentUserEmail) {
    return (
      <>
        <main className="page">
          <nav className="topNav">
            <a className="backLink" href="/">← Back to app</a>
          </nav>

          <section className="authCard wideAuth">
            <div className="authIntro">
              <div className="badge">{checkoutIntent ? "Developer badge checkout" : "Dashboard access"}</div>
              <h1>Create your SkillHeat dashboard</h1>
              <p>
                Register locally in this browser, keep your skill answers saved and continue to checkout when you are ready.
              </p>
            </div>

            <div className="authGrid">
              <form onSubmit={handleSignup} className="loginForm">
                <h2>Sign up</h2>
                <label>Name</label>
                <input
                  value={signupName}
                  onChange={(event) => setSignupName(event.target.value)}
                  placeholder="Your name"
                />

                <label>Email</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(event) => setSignupEmail(event.target.value)}
                  placeholder="you@example.com"
                />

                <label>Password</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(event) => setSignupPassword(event.target.value)}
                  placeholder="Create password"
                />

                <button type="submit">{checkoutIntent ? "Create dashboard" : "Create account"}</button>
              </form>

              <form onSubmit={handleLogin} className="loginForm secondaryAuth">
                <h2>Log in</h2>
                <label>Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="you@example.com"
                />

                <label>Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Password"
                />

                <button type="submit">Log in to dashboard</button>
              </form>
            </div>
          </section>
        </main>

        <SharedStyles />
      </>
    );
  }

  return (
    <>
      <main className="page">
        <nav className="topNav">
          <a className="backLink" href="/">← Back to app</a>
          <button className="smallGhost" onClick={logout}>Log out</button>
        </nav>

        <section className="profileHero">
          <div>
            <div className="badge">Dashboard</div>
            <h1>{currentUser?.name || "Dashboard"}</h1>
            <p>
              Manage your account, edit your saved skills and review saved job comparisons.
            </p>
          </div>

          <div className="profileStats">
            <strong>{answeredCount}</strong>
            <span>rated skills</span>
          </div>
        </section>

        {checkoutIntent && (
          <section className="checkoutPanel">
            <div>
              <div className="badge darkBadge">Developer badge</div>
              <h2>Registration is ready</h2>
              <p>
                Your local dashboard is created. Continue to checkout to reserve founder access and the developer badge.
              </p>
            </div>
            <a className="checkoutButton" href={PRODUCT.preorderUrl} target="_blank" rel="noreferrer">
              Continue to checkout
            </a>
          </section>
        )}

        <section className="gridTwo">
          <div className="card">
            <h2>Account settings</h2>

            <label>Name</label>
            <input value={profileName} onChange={(event) => setProfileName(event.target.value)} />

            <label>Email</label>
            <input type="email" value={profileEmail} onChange={(event) => setProfileEmail(event.target.value)} />

            <label>New password</label>
            <input
              type="password"
              placeholder="Leave empty to keep current password"
              value={profilePassword}
              onChange={(event) => setProfilePassword(event.target.value)}
            />

            <button onClick={saveProfileChanges}>Save account changes</button>
            <button className="danger" onClick={deleteProfile}>Delete profile</button>
          </div>

          <div className="card">
            <h2>Saved analyses</h2>

            {analyses.length === 0 ? (
              <p className="emptyText">No saved analyses yet.</p>
            ) : (
              analyses.map((analysis) => (
                <div className="analysisItem" key={analysis.id}>
                  <div>
                    <strong>{analysis.company}</strong>
                    <span>
                      {new Date(analysis.createdAt).toLocaleDateString()} · {analysis.matchScore}% · {analysis.trafficLight}
                    </span>
                  </div>

                  {analysis.note && <p>{analysis.note}</p>}

                  <button className="smallDanger" onClick={() => deleteAnalysis(analysis.id)}>
                    Delete analysis
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="card">
          <div className="sectionHeader">
            <div>
              <h2>Skill overview</h2>
              <p>
                These are all saved skills from your profile. You can edit them here directly.
              </p>
            </div>

            <button onClick={saveSkills}>Save skill changes</button>
          </div>

          {Object.entries(groupedQuestions).map(([group, skills]) => (
            <div className="skillGroup" key={group}>
              <h3>{group}</h3>

              <div className="skillsTable">
                {skills.map((question) => (
                  <div className="skillRow" key={question.skill}>
                    <div>
                      <strong>{question.skill}</strong>
                      <p>{question.description}</p>
                    </div>

                    <select
                      value={answers[question.skill]}
                      onChange={(event) => updateAnswer(question.skill, event.target.value)}
                    >
                      {(question.type === "language" ? LANGUAGE_LEVELS : SKILL_LEVELS).map((level, index) => (
                        <option value={index} key={level}>{level}</option>
                      ))}
                    </select>

                    <span className="levelBadge">
                      {getLevelLabel(question, answers[question.skill])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={saveSkills}>Save skill changes</button>
        </section>
      </main>

      <SharedStyles />
    </>
  );
}

function SharedStyles() {
  return (
    <style jsx global>{`
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background:
          radial-gradient(circle at top left, rgba(95, 127, 255, 0.18), transparent 34%),
          linear-gradient(180deg, #f7f9ff 0%, #eef2ff 42%, #f8fafc 100%);
        color: #111827;
        font-family: Arial, sans-serif;
      }
      .page { max-width: 1180px; margin: 0 auto; padding: 28px 20px 60px; }
      .topNav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
      .backLink { color: #111827; font-weight: 900; text-decoration: none; }
      .smallGhost {
        width: auto;
        border: 1px solid #d1d5db;
        background: transparent;
        color: #111827;
        padding: 11px 14px;
        border-radius: 999px;
        cursor: pointer;
        font-weight: 900;
      }
      .profileHero {
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: center;
        background: linear-gradient(135deg, #111827 0%, #1e1b4b 55%, #5f7fff 140%);
        color: white;
        border-radius: 34px;
        padding: 48px;
        margin-bottom: 26px;
        box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24);
      }
      .badge {
        display: inline-block;
        background: rgba(255,255,255,.13);
        border: 1px solid rgba(255,255,255,.2);
        padding: 10px 16px;
        border-radius: 999px;
        font-size: 14px;
        font-weight: 800;
        margin-bottom: 18px;
      }
      h1 { font-size: 56px; margin: 0 0 14px; letter-spacing: -2px; }
      .profileHero p { color: #dbeafe; font-size: 18px; line-height: 1.6; margin: 0; }
      .profileStats {
        min-width: 160px;
        background: rgba(255,255,255,.12);
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 26px;
        padding: 24px;
        text-align: center;
      }
      .profileStats strong { display: block; font-size: 52px; }
      .profileStats span { color: #dbeafe; font-weight: 800; }
      .checkoutPanel {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 22px;
        align-items: center;
        margin-bottom: 26px;
        background: #111827;
        color: white;
        border-radius: 30px;
        padding: 30px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
      }
      .checkoutPanel h2 {
        margin: 10px 0 8px;
        font-size: 30px;
      }
      .checkoutPanel p {
        margin: 0;
        color: #dbeafe;
        line-height: 1.6;
      }
      .darkBadge {
        background: rgba(200,240,106,.14);
        border-color: rgba(200,240,106,.35);
        color: #d9ff7a;
      }
      .checkoutButton {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 52px;
        padding: 0 20px;
        border-radius: 16px;
        background: #c8f06a;
        color: #111827;
        text-decoration: none;
        font-weight: 900;
        white-space: nowrap;
      }
      .gridTwo {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: 22px;
        margin-bottom: 26px;
      }
      .card, .authCard {
        background: rgba(255,255,255,.94);
        border: 1px solid rgba(226,232,240,.9);
        border-radius: 30px;
        padding: 32px;
        box-shadow: 0 18px 45px rgba(15,23,42,.08);
      }
      .authCard {
        max-width: 560px;
        margin: 60px auto;
      }
      .wideAuth {
        max-width: 980px;
      }
      .authIntro {
        max-width: 620px;
        margin-bottom: 24px;
      }
      .authGrid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 22px;
      }
      .loginForm {
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        padding: 24px;
        background: #ffffff;
      }
      .secondaryAuth {
        background: #f8fafc;
      }
      .loginForm h2 {
        margin: 0 0 4px;
      }
      .authCard h1 { color: #111827; }
      .authCard p, .card p {
        color: #4b5563;
        line-height: 1.6;
      }
      label {
        display: block;
        margin: 16px 0 8px;
        font-weight: 900;
      }
      input, select {
        width: 100%;
        border: 1px solid #d1d5db;
        border-radius: 16px;
        padding: 14px;
        font-size: 15px;
        background: white;
      }
      input:focus, select:focus {
        outline: none;
        border-color: #5f7fff;
        box-shadow: 0 0 0 4px rgba(95,127,255,.12);
      }
      button {
        width: 100%;
        margin-top: 18px;
        border: 0;
        background: #111827;
        color: white;
        padding: 15px 20px;
        border-radius: 18px;
        cursor: pointer;
        font-size: 15px;
        font-weight: 900;
      }
      button:hover { background: #1f2937; }
      .danger, .smallDanger {
        background: #fee2e2;
        color: #991b1b;
      }
      .danger:hover, .smallDanger:hover {
        background: #fecaca;
      }
      .smallDanger {
        width: auto;
        padding: 10px 12px;
        font-size: 13px;
      }
      .analysisItem {
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        padding: 16px;
        margin-top: 12px;
        background: #f9fafb;
      }
      .analysisItem strong, .analysisItem span {
        display: block;
      }
      .analysisItem span {
        color: #6b7280;
        font-size: 13px;
        font-weight: 700;
        margin-top: 4px;
      }
      .emptyText, .smallText {
        color: #6b7280;
        font-weight: 700;
      }
      .sectionHeader {
        display: grid;
        grid-template-columns: 1fr 240px;
        gap: 20px;
        align-items: start;
        margin-bottom: 22px;
      }
      .sectionHeader h2 {
        margin: 0;
      }
      .skillGroup {
        margin-top: 28px;
      }
      .skillGroup h3 {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 10px;
      }
      .skillsTable {
        display: grid;
        gap: 12px;
      }
      .skillRow {
        display: grid;
        grid-template-columns: 1.4fr 230px 170px;
        gap: 14px;
        align-items: center;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 18px;
        padding: 16px;
      }
      .skillRow strong {
        display: block;
        margin-bottom: 5px;
      }
      .skillRow p {
        margin: 0;
        font-size: 13px;
      }
      .levelBadge {
        background: #eef2ff;
        color: #3730a3;
        border-radius: 999px;
        padding: 10px 12px;
        text-align: center;
        font-weight: 900;
        font-size: 13px;
      }
      @media (max-width: 900px) {
        .profileHero, .topNav { flex-direction: column; align-items: flex-start; }
        h1 { font-size: 40px; }
        .gridTwo, .sectionHeader, .skillRow, .authGrid, .checkoutPanel {
          grid-template-columns: 1fr;
        }
        .checkoutButton {
          width: 100%;
        }
      }
    `}</style>
  );
}
