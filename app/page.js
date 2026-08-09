"use client";

import { useEffect, useMemo, useState } from "react";
import { PRODUCT, FEATURES } from "./productConfig";

const DEMO_SKILLS = [
  ["Project planning","Turn goals into realistic milestones.","Core PM"],
  ["Prioritization","Choose what matters when resources are limited.","Core PM"],
  ["Risk management","Spot risks and prepare mitigation actions.","Core PM"],
  ["Stakeholder management","Align expectations and decisions.","Core PM"],
  ["Agile delivery","Deliver iteratively and adapt to feedback.","Agile"],
  ["Scrum","Work confidently with sprints and ceremonies.","Agile"],
  ["Backlog management","Keep work clear, ordered and actionable.","Agile"],
  ["Retrospectives","Turn reflection into team improvement.","Agile"],
  ["Communication","Create clarity across the project.","People"],
  ["Leadership","Give direction and enable the team.","People"],
  ["Problem solving","Find root causes and practical solutions.","People"],
  ["Data-driven decisions","Use evidence instead of assumptions.","Business"]
];
const LABELS=["Not sure","Beginner","Learning","Capable","Strong","Expert"];

export default function Home(){
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState(Array(DEMO_SKILLS.length).fill(null));
  const [questionnaireStarted,setQuestionnaireStarted]=useState(false);
  const [finished,setFinished]=useState(false);
  const [jobUrl,setJobUrl]=useState("");
  const [jobText,setJobText]=useState("");
  const [analysis,setAnalysis]=useState(null);
  const [analysisError,setAnalysisError]=useState("");
  const [analyzing,setAnalyzing]=useState(false);
  const answered=answers.filter(value=>value!==null).length;
  const score=useMemo(()=>Math.round((answers.reduce((a,b)=>a+(b??0),0)/(DEMO_SKILLS.length*5))*100),[answers]);
  const selectedSkills=useMemo(()=>DEMO_SKILLS.map((skill,i)=>answers[i]===null?null:{skill:skill[0],levelIndex:answers[i],level:LABELS[answers[i]]}).filter(Boolean),[answers]);
  const hasJobOffer=jobUrl.trim().length>0||jobText.trim().length>0;
  const current=DEMO_SKILLS[index];
  useEffect(()=>{
    const saved=window.localStorage.getItem("skillheat-demo");
    if(!saved)return;
    try{const data=JSON.parse(saved);if(Array.isArray(data.answers)&&data.answers.length===DEMO_SKILLS.length){setAnswers(data.answers);setIndex(Math.min(data.index||0,DEMO_SKILLS.length-1));setQuestionnaireStarted(Boolean(data.questionnaireStarted));setFinished(Boolean(data.finished));setJobUrl(data.jobUrl||"");setJobText(data.jobText||"");setAnalysis(data.analysis||null);}}catch{}
  },[]);
  useEffect(()=>{window.localStorage.setItem("skillheat-demo",JSON.stringify({answers,index,questionnaireStarted,finished,jobUrl,jobText,analysis}));},[answers,index,questionnaireStarted,finished,jobUrl,jobText,analysis]);
  useEffect(()=>{
    if(!finished||analysis||analysisError||analyzing||!hasJobOffer||selectedSkills.length!==DEMO_SKILLS.length)return;
    runAnalysis();
  },[finished,analysis,analysisError,analyzing,hasJobOffer,selectedSkills]);
  function rate(value){const next=[...answers];next[index]=value;setAnswers(next)}
  function next(){if(index<DEMO_SKILLS.length-1)setIndex(index+1);else setFinished(true)}
  function startQuestionnaire(event){event.preventDefault();setQuestionnaireStarted(true);setFinished(false);setAnalysis(null);setAnalysisError("");setIndex(0);setAnswers(Array(DEMO_SKILLS.length).fill(null))}
  function reset(){setAnswers(Array(DEMO_SKILLS.length).fill(null));setIndex(0);setQuestionnaireStarted(false);setFinished(false);setJobUrl("");setJobText("");setAnalysis(null);setAnalysisError("");window.localStorage.removeItem("skillheat-demo")}
  async function runAnalysis(){
    setAnalyzing(true);
    setAnalysisError("");
    setAnalysis(null);

    try{
      const response=await fetch("/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({selectedSkills,jobUrl,jobText})});
      const data=await response.json();

      if(!response.ok)throw new Error(data.error||"Job analysis failed.");

      setAnalysis(data);
    }catch(error){
      setAnalysisError(error.message);
    }finally{
      setAnalyzing(false);
    }
  }
  function analyzeJob(event){event.preventDefault();runAnalysis()}

  return <>
    <header id="top" className="shell nav">
      <a className="logo" href="#top" aria-label="SkillHeat home"><span className="logoMark">SH</span>{PRODUCT.name}</a>
      <nav className="navLinks desktopNav" aria-label="Primary navigation"><a href="#how">How it works</a><a href="#demo">Try demo</a><a href="#founder">Roadmap</a><a className="button" href="#founder">Get founder access</a></nav>
      <details className="mobileMenu"><summary aria-label="Open navigation">Menu</summary><nav aria-label="Mobile navigation"><a href="#how">How it works</a><a href="#demo">Try demo</a><a href="#founder">Roadmap</a><a href="#founder">Founder access</a></nav></details>
    </header>
    <main>
      <section className="shell hero">
        <div>
          <span className="eyebrow">Early access for project people</span>
          <h1>See the skills behind your next move.</h1>
          <p className="heroLead">Turn a vague sense of “I think I’m ready” into a clear project management skill map — then focus on the gaps that actually matter.</p>
          <div className="heroActions"><a className="button lime" href="#demo">Map my skills — free</a><a className="button outline" href="#founder">See founder offer</a></div>
          <p className="micro">No CV upload · 3-minute preview · Your answers stay in your browser</p>
        </div>
        <div className="preview" aria-label="Example skill heatmap">
          <div className="previewTop"><div><strong>Your readiness map</strong><br/><span>Project manager · sample</span></div><div className="scoreRing"><strong>78%</strong></div></div>
          <div className="heatGrid">{DEMO_SKILLS.slice(0,8).map((s,i)=><div key={s[0]} className={`heatCell level${[4,3,5,3,4,2,4,3][i]}`}>{s[0]}</div>)}</div>
        </div>
      </section>
      <div className="socialProof"><div className="shell proofInner"><strong>Built for aspiring & growing project professionals</strong><span>PM fundamentals</span><span>Agile delivery</span><span>People skills</span><span>Career readiness</span></div></div>

      <section id="how" className="shell section">
        <div className="sectionHead"><span className="eyebrow">Less guessing, more direction</span><h2>A career compass you can actually use.</h2><p>SkillHeat translates your experience into a visual map and a practical next step — without pretending one score defines your career.</p></div>
        <div className="steps">{[["01","Rate what you can do","Answer short, concrete questions across project management, agile and people skills."],["02","See your heatmap","Spot strengths, hidden gaps and the areas that deserve your attention first."],["03","Prepare your next move","The full release will match your map to roles and build a focused growth plan."]].map(x=><article className="step" key={x[0]}><span className="stepNo">{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
      </section>

      <section id="demo" className="shell section">
        <div className="demoWrap">
          <div className="demoHeader"><div><span className="eyebrow">Interactive preview</span><h2>Your first skill signal</h2></div><p>Rate 12 essential capabilities. This preview shows how SkillHeat turns self-reflection into a useful visual.</p></div>
          {!questionnaireStarted ? <form className="jobStart" onSubmit={startQuestionnaire}>
            <div>
              <span className="eyebrow">Start with a job offer</span>
              <h3>Add the role you want to test</h3>
              <p>Paste a job post URL or the full description first. Then answer the questionnaire and SkillHeat will compare your answers with the role requirements.</p>
            </div>
            <label>
              <span>Job post URL</span>
              <input type="url" value={jobUrl} onChange={event=>setJobUrl(event.target.value)} placeholder="https://..." />
            </label>
            <label>
              <span>Or paste the job description</span>
              <textarea value={jobText} onChange={event=>setJobText(event.target.value)} rows={8} placeholder="Paste responsibilities, requirements and tools from the job post." />
            </label>
            <button className="button" type="submit" disabled={!hasJobOffer}>Start questionnaire</button>
          </form> : !finished ? <>
            <div className="progress"><div style={{width:`${((index+1)/DEMO_SKILLS.length)*100}%`}}/></div>
            <div className="question"><span className="questionMeta">{current[2]} · {index+1} of {DEMO_SKILLS.length}</span><h3>{current[0]}</h3><p>{current[1]}</p><div className="rating" role="radiogroup" aria-label={`Rate ${current[0]}`}>{LABELS.map((label,i)=><button type="button" role="radio" aria-checked={answers[index]===i} key={label} className={`rate ${answers[index]===i?"active":""}`} onClick={()=>rate(i)}><strong>{i}</strong><span>{label}</span></button>)}</div><div className="scaleHint"><span>Not confident yet</span><span>Highly confident</span></div><div className="demoNav"><button className="button outline" disabled={index===0} onClick={()=>setIndex(index-1)}>Back</button><button className="button" disabled={answers[index]===null} onClick={next}>{index===DEMO_SKILLS.length-1?"Show my map":"Next"}</button></div></div>
          </> : <div className="resultPanel">
            <div className="resultScore"><span className="eyebrow">Your preview result</span><div className="bigScore">{score}%</div><h3>{score>=75?"Strong foundation":score>=50?"Promising foundation":"A clear place to start"}</h3><p>You rated {answered} core skills. The score is a reflection prompt, not a hiring verdict.</p><button className="button outline" onClick={reset}>Retake preview</button></div>
            <div className="resultMap"><h3>Your project skill heatmap</h3><p>Darker cells show areas where you feel more capable today. Every tile also shows your rating.</p><div className="heatLegend" aria-label="Heatmap legend"><span className="level1">1</span><span className="level2">2</span><span className="level3">3</span><span className="level4">4</span><span className="level5">5</span></div><div className="heatGrid">{DEMO_SKILLS.map((s,i)=><div className={`heatCell level${Math.max(1,answers[i]??0)}`} key={s[0]}><span>{s[0]}</span><strong>{answers[i]??0}/5</strong></div>)}</div><div className="locked"><span className="lock">↗</span><span><strong>Full role match & growth plan</strong><br/>Reserved for founder release</span></div></div>
            <form className="jobMatch" onSubmit={analyzeJob}>
              <div>
                <span className="eyebrow">Available now</span>
                <h3>Your role match</h3>
                <p>SkillHeat compares the job offer you added with the questionnaire you just completed, then gives you a suitability score and practical next steps.</p>
              </div>
              <div className="jobSource"><strong>Job offer added</strong><span>{jobUrl||`${jobText.trim().slice(0,120)}${jobText.trim().length>120?"...":""}`}</span></div>
              <div className="jobActions"><button className="button" type="submit" disabled={analyzing||selectedSkills.length===0||!hasJobOffer}>{analyzing?"Analyzing...":"Analyze again"}</button><button className="button outline" type="button" onClick={()=>{setQuestionnaireStarted(false);setFinished(false);setAnalysis(null);setAnalysisError("");}}>Change job offer</button></div>
              {analysisError&&<p className="analysisError">{analysisError}</p>}
              {analyzing&&<p className="analysisLoading">Analyzing the job offer against your answers...</p>}
              {analysis&&<div className="analysisResult" aria-live="polite">
                <div className="analysisTop"><span>{analysis.trafficLight}</span><strong>{analysis.matchScore}%</strong></div>
                <p>{analysis.summary}</p>
                <div className="analysisColumns">
                  <div><h4>Matching skills</h4>{analysis.matchedSkills.length?<ul>{analysis.matchedSkills.map(item=><li key={item}>{item}</li>)}</ul>:<p>No strong matching skills detected yet.</p>}</div>
                  <div><h4>Gaps to improve</h4>{analysis.missingSkills.length?<ul>{analysis.missingSkills.map(item=><li key={item}>{item}</li>)}</ul>:<p>No major gaps detected in the matched skill set.</p>}</div>
                </div>
                <h4>CV focus</h4>
                <ul>{analysis.cvRecommendations.map(item=><li key={item}>{item}</li>)}</ul>
              </div>}
            </form>
          </div>}
        </div>
      </section>

      <section id="founder" className="shell section"><div className="presale"><div><span className="eyebrow">Founder pre-sale</span><h2>Help shape the tool you’d want to use.</h2><p>This is an early product preview, not the finished platform. Founder members fund the next build and get the complete release at its lowest planned price.</p><p><strong>Next release:</strong> complete skill library, role matching, saved progress, personal growth plans and CV-ready evidence prompts.</p></div><aside className="offer"><span>Founder access · one-time</span><div className="price">{PRODUCT.founderPrice}</div><small>Planned regular price: €49</small><ul><li>Full product when released</li><li>All future v1 updates</li><li>Vote on the roadmap</li><li>Founder badge & early access</li></ul><a className="button lime" href={PRODUCT.preorderUrl} target="_blank" rel="noreferrer">Reserve founder access</a><p className="micro">Limited to the first {PRODUCT.founderSlots} supporters. Development-stage product; scope may evolve.</p></aside></div></section>
      {FEATURES.accounts && <a href="/profile">My profile</a>}
    </main>
    <footer id="privacy" className="shell"><span>© 2026 {PRODUCT.name}. A student agile product experiment.</span><span>Built transparently · Answers are stored only in this browser.</span></footer>
  </>;
}


