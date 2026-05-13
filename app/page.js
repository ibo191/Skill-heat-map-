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
    <>
      <main className="page">
        <section className="hero">
          <div className="badge">AI CV checker pre študentov</div>
          <h1>Skills Heatmap</h1>
          <p>
            Nahraj CV, vlož link na pracovnú pozíciu a aplikácia porovná tvoje
            skills s požiadavkami konkrétnej ponuky.
          </p>
        </section>

        <section className="card">
          <div className="formBlock">
            <label>1. Nahraj CV vo formáte PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => setCvFile(event.target.files[0])}
            />
            {cvFile && <small>Vybraný súbor: {cvFile.name}</small>}
          </div>

          <div className="formBlock">
            <label>2. Vlož link na pracovnú pozíciu</label>
            <input
              type="url"
              placeholder="https://www.jobs.cz/prace/..."
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
            />
          </div>

          <div className="formBlock">
            <label>3. Záložne vlož text pracovnej ponuky</label>
            <textarea
              placeholder="Ak link nepôjde načítať, vlož sem text pracovnej ponuky."
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
          max-width: 1150px;
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
          max-width: 760px;
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

        .formBlock {
          margin-bottom: 22px;
        }

        label {
          display: block;
          font-weight: 800;
          margin-bottom: 10px;
        }

        small {
          display: block;
          margin-top: 8px;
          color: #6b7280;
          font-weight: 700;
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
          min-height: 150px;
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

        @media (max-width: 850px) {
          .hero {
            padding: 34px;
          }

          h1 {
            font-size: 42px;
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
