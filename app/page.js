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
const JOB_SKILL_MODEL = {
  "Project planning":{weight:1.25,category:"Delivery",keywords:["project planning","planning","project plan","roadmap","milestone","timeline","schedule","harmonogram","plán projektu"]},
  "Prioritization":{weight:1.1,category:"Delivery",keywords:["prioritization","prioritisation","priority","priorities","prioritizace","prioritizovat","trade-off"]},
  "Risk management":{weight:1.2,category:"Control",keywords:["risk","risk management","risk assessment","mitigation","issue management","řízení rizik","rizika"]},
  "Stakeholder management":{weight:1.25,category:"People",keywords:["stakeholder","stakeholders","stakeholder management","client communication","expectations","zainteresované strany"]},
  "Agile delivery":{weight:1.15,category:"Agile",keywords:["agile","agile delivery","agile methodology","agilní","iteration","iterative","incremental"]},
  "Scrum":{weight:1.05,category:"Agile",keywords:["scrum","scrum master","sprint","sprint planning","daily standup","ceremonies"]},
  "Backlog management":{weight:1.1,category:"Agile",keywords:["backlog","backlog management","product backlog","user stories","správa backlogu"]},
  "Retrospectives":{weight:.9,category:"Agile",keywords:["retrospective","retrospectives","retrospektiva","team improvement","continuous improvement"]},
  "Communication":{weight:1.3,category:"People",keywords:["communication","communication skills","komunikace","presentation","reporting","status report","alignment"]},
  "Leadership":{weight:1.15,category:"People",keywords:["leadership","team leadership","vedení týmu","people management","mentoring","ownership"]},
  "Problem solving":{weight:1.1,category:"Thinking",keywords:["problem solving","solving problems","root cause","critical thinking","analytical","řešení problémů"]},
  "Data-driven decisions":{weight:1,category:"Business",keywords:["data-driven","data driven","data analysis","metrics","kpi","power bi","excel","práce s daty"]}
};

function normalizeText(text){
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function findKeywordMatches(jobText,skill){
  const normalizedJobText=normalizeText(jobText);
  const model=JOB_SKILL_MODEL[skill]||{keywords:[skill]};
  return model.keywords.filter(keyword=>normalizedJobText.includes(normalizeText(keyword)));
}

function scoreSkill(levelIndex){
  if(levelIndex>=5)return 100;
  if(levelIndex===4)return 85;
  if(levelIndex===3)return 60;
  if(levelIndex===2)return 35;
  if(levelIndex===1)return 15;
  return 0;
}

function trafficLightFromScore(score){
  if(score>=75)return "Strong match";
  if(score>=45)return "Medium match";
  return "Weak match";
}

function analyzeRoleMatch(selectedSkills,jobText){
  const evaluatedSkills=selectedSkills.map((item)=>{
    const model=JOB_SKILL_MODEL[item.skill]||{weight:1,category:"General",keywords:[item.skill]};
    const keywordMatches=findKeywordMatches(jobText,item.skill);
    const detected=keywordMatches.length>0;
    const evidenceBoost=Math.min(keywordMatches.length-1,2)*.08;
    const weight=detected?model.weight+evidenceBoost:model.weight*.35;
    const readinessScore=scoreSkill(item.levelIndex);
    const contribution=readinessScore*weight;

    return {...item,category:model.category,detected,keywordMatches,weight,readinessScore,contribution};
  });

  const detectedSkills=evaluatedSkills.filter(item=>item.detected);
  const skillsToEvaluate=detectedSkills.length>0?detectedSkills:evaluatedSkills;
  const totalWeight=skillsToEvaluate.reduce((sum,item)=>sum+item.weight,0);
  const weightedScore=skillsToEvaluate.reduce((sum,item)=>sum+item.contribution,0)/totalWeight;
  const coverageScore=Math.round((detectedSkills.length/selectedSkills.length)*100);
  const confidence=Math.min(100,Math.round((detectedSkills.length/6)*100));
  const matchScore=Math.round(weightedScore*.82+coverageScore*.18);
  const matchedSkills=skillsToEvaluate.filter(item=>item.levelIndex>=3).map(item=>`${item.skill} — ${item.level}`);
  const missingSkills=skillsToEvaluate.filter(item=>item.levelIndex<3).map(item=>`${item.skill} — ${item.level}`);
  const criticalGaps=skillsToEvaluate.filter(item=>item.detected&&item.weight>=1.1&&item.levelIndex<3).map(item=>item.skill);
  const roleSignals=detectedSkills
    .sort((a,b)=>b.weight-a.weight)
    .slice(0,6)
    .map(item=>({skill:item.skill,category:item.category,keywords:item.keywordMatches.slice(0,3),weight:item.weight.toFixed(2)}));
  const scoreBreakdown=[
    `Weighted skill readiness: ${Math.round(weightedScore)}%`,
    `Job requirement coverage: ${coverageScore}%`,
    `Detected role signals: ${detectedSkills.length}/${selectedSkills.length}`,
    `Confidence: ${confidence}%`
  ];
  const cvRecommendations=[];

  if(criticalGaps.length>0)cvRecommendations.push(`Start with the strongest gaps for this role: ${criticalGaps.slice(0,3).join(", ")}.`);
  else if(missingSkills.length>0)cvRecommendations.push("Focus first on skills that appear in the job description but are rated below intermediate in your profile.");
  if(matchedSkills.length>0)cvRecommendations.push("Use your strongest matching skills in your CV and cover letter with wording similar to the job description.");
  cvRecommendations.push("Add evidence to your CV: a project example, measurable result, tool used, team size, deadline, budget or business impact.");
  if(detectedSkills.length===0)cvRecommendations.push("The system did not detect many known skills in the pasted job text. Paste the full role description for a better result.");

  return {
    matchScore,
    trafficLight:trafficLightFromScore(matchScore),
    matchedSkills,
    missingSkills,
    criticalGaps,
    roleSignals,
    scoreBreakdown,
    cvRecommendations,
    summary:detectedSkills.length>0?`The system detected ${detectedSkills.length} role requirements in the pasted job description. The match combines weighted skill readiness with how many of the role signals were found.`:"The system did not detect clear known skills in the pasted job description, so it used your filled skill profile as an orientation estimate. Paste a fuller job description for better accuracy."
  };
}

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
  const hasJobOffer=jobText.trim().length>20;
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
  useEffect(()=>{
    const elements=[...document.querySelectorAll(".reveal")];
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if(reduced){
      elements.forEach(element=>element.classList.add("isVisible"));
      return;
    }

    const observer=new IntersectionObserver((entries)=>{
      entries.forEach((entry)=>{
        if(entry.isIntersecting){
          entry.target.classList.add("isVisible");
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.16,rootMargin:"0px 0px -8% 0px"});

    elements.forEach(element=>observer.observe(element));

    return ()=>observer.disconnect();
  },[questionnaireStarted,finished,analysis]);
  function rate(value){const next=[...answers];next[index]=value;setAnswers(next)}
  function next(){if(index<DEMO_SKILLS.length-1)setIndex(index+1);else setFinished(true)}
  function startQuestionnaire(event){
    event.preventDefault();
    const firstUnanswered=answers.findIndex(value=>value===null);
    setQuestionnaireStarted(true);
    setFinished(firstUnanswered===-1);
    setAnalysis(null);
    setAnalysisError("");
    setIndex(firstUnanswered===-1?0:firstUnanswered);
  }
  function editAnswers(){setQuestionnaireStarted(true);setFinished(false);setAnalysis(null);setAnalysisError("");setIndex(0)}
  function reset(){setAnswers(Array(DEMO_SKILLS.length).fill(null));setIndex(0);setQuestionnaireStarted(false);setFinished(false);setJobUrl("");setJobText("");setAnalysis(null);setAnalysisError("");window.localStorage.removeItem("skillheat-demo")}
  async function runAnalysis(){
    setAnalyzing(true);
    setAnalysisError("");
    setAnalysis(null);

    try{
      if(!hasJobOffer)throw new Error("Paste the job description text first. A URL can be kept as a reference, but this available version evaluates copied job text.");
      setAnalysis(analyzeRoleMatch(selectedSkills,jobText));
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
      <nav className="navLinks desktopNav" aria-label="Primary navigation"><a href="#how">How it works</a><a href="#demo">Try demo</a><a href="/profile">Dashboard</a><a href="#founder">Roadmap</a><a className="button" href="#founder">Get founder access</a></nav>
      <details className="mobileMenu"><summary aria-label="Open navigation">Menu</summary><nav aria-label="Mobile navigation"><a href="#how">How it works</a><a href="#demo">Try demo</a><a href="/profile">Dashboard</a><a href="#founder">Roadmap</a><a href="#founder">Founder access</a></nav></details>
    </header>
    <main>
      <section className="shell hero reveal">
        <div>
          <span className="eyebrow">Early access for project people</span>
          <h1>See the skills behind your next move.</h1>
          <p className="heroLead">Turn a vague sense of “I think I’m ready” into a clear project management skill map — then focus on the gaps that actually matter.</p>
          <div className="heroActions"><a className="button lime" href="#demo">Map my skills — free</a><a className="button outline" href="#founder">See founder offer</a></div>
          <p className="micro">No CV upload · 3-minute preview · Your answers stay in your browser</p>
        </div>
        <div className="preview reveal" aria-label="Example skill heatmap">
          <div className="previewTop"><div><strong>Your readiness map</strong><br/><span>Project manager · sample</span></div><div className="scoreRing"><strong>78%</strong></div></div>
          <div className="heatGrid">{DEMO_SKILLS.slice(0,8).map((s,i)=><div key={s[0]} className={`heatCell level${[4,3,5,3,4,2,4,3][i]}`}>{s[0]}</div>)}</div>
        </div>
      </section>
      <div className="socialProof reveal"><div className="shell proofInner"><strong>Built for aspiring & growing project professionals</strong><span>PM fundamentals</span><span>Agile delivery</span><span>People skills</span><span>Career readiness</span></div></div>

      <section id="how" className="shell section reveal">
        <div className="sectionHead"><span className="eyebrow">Less guessing, more direction</span><h2>A career compass you can actually use.</h2><p>SkillHeat translates your experience into a visual map and a practical next step — without pretending one score defines your career.</p></div>
        <div className="steps">{[["01","Rate what you can do","Answer short, concrete questions across project management, agile and people skills."],["02","See your heatmap","Spot strengths, hidden gaps and the areas that deserve your attention first."],["03","Prepare your next move","The full release will match your map to roles and build a focused growth plan."]].map(x=><article className="step reveal" key={x[0]}><span className="stepNo">{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
      </section>

      <section id="demo" className="shell section">
        <div className="demoWrap reveal">
          <div className="demoHeader"><div><span className="eyebrow">Interactive preview</span><h2>Your first skill signal</h2></div><p>Rate 12 essential capabilities. This preview shows how SkillHeat turns self-reflection into a useful visual.</p></div>
          {!questionnaireStarted ? <form className="jobStart reveal" onSubmit={startQuestionnaire}>
            <div>
              <span className="eyebrow">Start with a job offer</span>
              <h3>Add the role you want to test</h3>
              <p>Copy the full job description from the role first. Then answer the questionnaire and SkillHeat will compare your answers with the role requirements.</p>
            </div>
            <label>
              <span>Job post URL, optional</span>
              <input type="url" value={jobUrl} onChange={event=>setJobUrl(event.target.value)} placeholder="https://..." />
            </label>
            <label>
              <span>Paste the job description</span>
              <textarea value={jobText} onChange={event=>setJobText(event.target.value)} rows={8} placeholder="Paste responsibilities, requirements and tools from the job post." />
            </label>
            <button className="button" type="submit" disabled={!hasJobOffer}>{selectedSkills.length===DEMO_SKILLS.length?"Use saved answers":"Start questionnaire"}</button>
          </form> : !finished ? <>
            <div className="progress"><div style={{width:`${((index+1)/DEMO_SKILLS.length)*100}%`}}/></div>
            <div className="question reveal"><span className="questionMeta">{current[2]} · {index+1} of {DEMO_SKILLS.length}</span><h3>{current[0]}</h3><p>{current[1]}</p><div className="rating" role="radiogroup" aria-label={`Rate ${current[0]}`}>{LABELS.map((label,i)=><button type="button" role="radio" aria-checked={answers[index]===i} key={label} className={`rate ${answers[index]===i?"active":""}`} onClick={()=>rate(i)}><strong>{i}</strong><span>{label}</span></button>)}</div><div className="scaleHint"><span>Not confident yet</span><span>Highly confident</span></div><div className="demoNav"><button className="button outline" disabled={index===0} onClick={()=>setIndex(index-1)}>Back</button><button className="button" disabled={answers[index]===null} onClick={next}>{index===DEMO_SKILLS.length-1?"Show my map":"Next"}</button></div></div>
          </> : <div className="resultPanel">
            <div className="resultScore reveal"><span className="eyebrow">Your preview result</span><div className="bigScore">{score}%</div><h3>{score>=75?"Strong foundation":score>=50?"Promising foundation":"A clear place to start"}</h3><p>You rated {answered} core skills. Your answers are saved in this browser, so changing the job description will reuse them.</p><div className="resultActions"><button className="button outline" onClick={editAnswers}>Edit answers</button><button className="button outline" onClick={reset}>Reset all</button></div></div>
            <div className="resultMap reveal"><h3>Your project skill heatmap</h3><p>Darker cells show areas where you feel more capable today. Every tile also shows your rating.</p><div className="heatLegend" aria-label="Heatmap legend"><span className="level1">1</span><span className="level2">2</span><span className="level3">3</span><span className="level4">4</span><span className="level5">5</span></div><div className="heatGrid">{DEMO_SKILLS.map((s,i)=><div className={`heatCell level${Math.max(1,answers[i]??0)}`} key={s[0]}><span>{s[0]}</span><strong>{answers[i]??0}/5</strong></div>)}</div><div className="locked"><span className="lock">↗</span><span><strong>Full role match & growth plan</strong><br/>Reserved for founder release</span></div></div>
            <form className="jobMatch reveal" onSubmit={analyzeJob}>
              <div>
                <span className="eyebrow">Available now</span>
                <h3>Your role match</h3>
                <p>SkillHeat compares the job offer you added with the questionnaire you just completed, then gives you a suitability score and practical next steps.</p>
              </div>
              <div className="jobSource"><strong>Job offer added</strong><span>{`${jobText.trim().slice(0,120)}${jobText.trim().length>120?"...":""}`}</span></div>
              <div className="jobActions"><button className="button" type="submit" disabled={analyzing||selectedSkills.length===0||!hasJobOffer}>{analyzing?"Analyzing...":"Analyze again"}</button><button className="button outline" type="button" onClick={()=>{setQuestionnaireStarted(false);setFinished(false);setAnalysis(null);setAnalysisError("");}}>Change job offer</button></div>
              {analysisError&&<p className="analysisError">{analysisError}</p>}
              {analyzing&&<p className="analysisLoading">Analyzing the job offer against your answers...</p>}
              {analysis&&<div className="analysisResult" aria-live="polite">
                <div className="analysisTop"><span>{analysis.trafficLight}</span><strong>{analysis.matchScore}%</strong></div>
                <p>{analysis.summary}</p>
                <div className="scoreLogic">
                  <div>
                    <h4>How the match is scored</h4>
                    <ul>{analysis.scoreBreakdown.map(item=><li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Detected role signals</h4>
                    {analysis.roleSignals.length?<div className="signalList">{analysis.roleSignals.map(item=><span key={item.skill}>{item.skill}<small>{item.category} · weight {item.weight}</small></span>)}</div>:<p>No clear role signals detected.</p>}
                  </div>
                </div>
                <div className="analysisColumns">
                  <div><h4>Matching skills</h4>{analysis.matchedSkills.length?<ul>{analysis.matchedSkills.map(item=><li key={item}>{item}</li>)}</ul>:<p>No strong matching skills detected yet.</p>}</div>
                  <div><h4>Gaps to improve</h4>{analysis.missingSkills.length?<ul>{analysis.missingSkills.map(item=><li key={item}>{item}</li>)}</ul>:<p>No major gaps detected in the matched skill set.</p>}</div>
                </div>
                <h4>CV focus</h4>
                <ul>{analysis.cvRecommendations.map(item=><li key={item}>{item}</li>)}</ul>
                <div className="founderInline">
                  <strong>Want the full match?</strong>
                  <span>The founder licence unlocks the full 50-question assessment, deeper role matching and a complete growth plan.</span>
                  <a className="button lime" href="/profile?checkout=developer">Unlock founder licence</a>
                </div>
              </div>}
            </form>
          </div>}
        </div>
      </section>

      <section id="founder" className="shell section reveal"><div className="presale reveal"><div><span className="eyebrow">Founder pre-sale</span><h2>Help shape the tool you’d want to use.</h2><p>This is an early product preview, not the finished platform. Founder members fund the next build and get the complete release at its lowest planned price.</p><p><strong>Next release:</strong> complete skill library, role matching, saved progress, personal growth plans and CV-ready evidence prompts.</p></div><aside className="offer"><span>Founder access · one-time</span><div className="price">{PRODUCT.founderPrice}</div><small>Planned regular price: €49</small><ul><li>Full product when released</li><li>All future v1 updates</li><li>Vote on the roadmap</li><li><a className="badgeCheckout" href="/profile?checkout=developer">Developer badge registration + checkout</a></li></ul><a className="button lime" href="/profile?checkout=developer">Reserve founder access</a><p className="micro">Limited to the first {PRODUCT.founderSlots} supporters. Development-stage product; scope may evolve.</p></aside></div></section>
      {FEATURES.accounts && <a href="/profile">My profile</a>}
    </main>
    <footer id="privacy" className="shell"><span>© 2026 {PRODUCT.name}. A student agile product experiment.</span><span>Built transparently · Answers are stored only in this browser.</span></footer>
  </>;
}


