"use client";

import { useState } from "react";

export default function Home() {
  const [cvFile, setCvFile] = useState(null);
  const [jobUrl, setJobUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    if (cvFile) formData.append("cv", cvFile);
    formData.append("jobUrl", jobUrl);
    formData.append("jobText", jobText);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData
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
    <main className="page">
      <section className="hero">
        <div>
          <div className="badge">AI CV checker pre študentov</div>
          <h1>Skills Heatmap</h1>
          <p>
            Nahraj CV, vlož link na pracovnú pozíciu a aplikácia porovná tvoje
            skills s požiadavkami konkrétnej ponuky.
          </p>
        </div>
      </section>

      <section className="card">
        <label className="label">1. Nahraj CV vo formáte PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setCvFile(event.target.files[0])}
        />

        <label className="label">2. Vlož link na pracovnú pozíciu</label>
        <input
          type="url"
          placeholder="https://www.jobs.cz/prace/..."
          value={jobUrl}
          onChange={(event) => setJobUrl(event.target.value)}
        />

        <label className="label">
          3. Záložne vlož text pracovnej ponuky, ak link nepôjde načítať
        </label>
        <textarea
          placeholder="Sem môžeš vložiť text pracovnej ponuky..."
          value={jobText}
          onChange={(event) => setJobText(event.target.value)}
        />

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
              <h3>Zhodné skills</h3>
              {result.matchedSkills?.map((skill) => (
                <span className="pill good" key={skill}>{skill}</span>
              ))}
            </div>

            <div className="resultBox">
              <h3>Chýbajúce skills</h3>
              {result.missingSkills?.map((skill) => (
                <span className="pill bad" key={skill}>{skill}</span>
              ))}
            </div>

            <div className="resultBox">
              <h3>Odporúčania do CV</h3>
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
  );
}
