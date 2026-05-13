export const PROFILE_STORAGE_KEY = "skillsHeatmapProfileV5";
export const USERS_STORAGE_KEY = "skillsHeatmapUsersV2";
export const SESSION_STORAGE_KEY = "skillsHeatmapSessionV2";

export const SKILL_LEVELS = [
  "Not rated",
  "Complete beginner",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert"
];

export const LANGUAGE_LEVELS = [
  "No proficiency",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1/C2"
];

export const QUESTIONS = [
  { type: "skill", group: "Project Management", skill: "Project planning", description: "Break a project into phases, define milestones and create a realistic delivery plan." },
  { type: "skill", group: "Project Management", skill: "Roadmap planning", description: "Connect long-term goals with practical delivery steps and changing priorities." },
  { type: "skill", group: "Project Management", skill: "Risk management", description: "Identify project risks early and prepare mitigation actions." },
  { type: "skill", group: "Project Management", skill: "Budgeting", description: "Understand costs, track spending and keep the project financially realistic." },
  { type: "skill", group: "Project Management", skill: "Reporting", description: "Communicate progress, risks, blockers, deadlines and next steps clearly." },
  { type: "skill", group: "Project Management", skill: "Stakeholder management", description: "Manage expectations and keep key stakeholders aligned." },
  { type: "skill", group: "Project Management", skill: "Prioritization", description: "Decide what matters most when time, people or budget are limited." },
  { type: "skill", group: "Project Management", skill: "Project documentation", description: "Keep decisions, requirements, plans and responsibilities clear." },
  { type: "skill", group: "Project Management", skill: "Project coordination", description: "Coordinate tasks, people, meetings and deadlines." },
  { type: "skill", group: "Project Management", skill: "Resource planning", description: "Plan people, capacity and availability needed for delivery." },
  { type: "skill", group: "Project Management", skill: "Timeline management", description: "Manage schedules, deadlines and dependencies." },
  { type: "skill", group: "Project Management", skill: "Scope management", description: "Keep delivery focused on agreed goals and prevent uncontrolled expansion." },
  { type: "skill", group: "Project Management", skill: "Meeting facilitation", description: "Run useful meetings with agenda, decisions, owners and follow-up actions." },
  { type: "skill", group: "Project Management", skill: "Project governance", description: "Define decision rules, approvals and project control structure." },

  { type: "skill", group: "Agile / Methods", skill: "Agile", description: "Deliver value iteratively and adapt to feedback." },
  { type: "skill", group: "Agile / Methods", skill: "Scrum", description: "Work with sprints, ceremonies, roles and backlog management." },
  { type: "skill", group: "Agile / Methods", skill: "Kanban", description: "Visualize work, limit work in progress and improve flow." },
  { type: "skill", group: "Agile / Methods", skill: "Sprint planning", description: "Plan what the team will deliver in the next sprint." },
  { type: "skill", group: "Agile / Methods", skill: "Retrospectives", description: "Reflect on what worked and what should improve." },
  { type: "skill", group: "Agile / Methods", skill: "Backlog management", description: "Keep tasks, stories and priorities organized." },
  { type: "skill", group: "Agile / Methods", skill: "Waterfall", description: "Work with sequential project phases and fixed planning." },
  { type: "skill", group: "Agile / Methods", skill: "Change management", description: "Help people and organizations adopt changes." },
  { type: "skill", group: "Agile / Methods", skill: "Process improvement", description: "Improve inefficient workflows and processes." },
  { type: "skill", group: "Agile / Methods", skill: "Requirements gathering", description: "Understand what users, clients and stakeholders need." },

  { type: "skill", group: "Tools", skill: "Jira", description: "Track tasks, sprints, backlog and agile reporting." },
  { type: "skill", group: "Tools", skill: "Confluence", description: "Create project documentation, notes and knowledge bases." },
  { type: "skill", group: "Tools", skill: "MS Project", description: "Plan schedules, dependencies and resources." },
  { type: "skill", group: "Tools", skill: "Asana", description: "Manage tasks, timelines and responsibilities." },
  { type: "skill", group: "Tools", skill: "Trello", description: "Use visual boards, lists and cards for task management." },
  { type: "skill", group: "Tools", skill: "Notion", description: "Use pages, databases and documentation for project work." },
  { type: "skill", group: "Tools", skill: "MS Excel", description: "Track, analyze and report project or business data." },
  { type: "skill", group: "Tools", skill: "Power BI", description: "Create dashboards and visualize performance data." },
  { type: "skill", group: "Tools", skill: "Slack", description: "Communicate in team channels and quick updates." },
  { type: "skill", group: "Tools", skill: "Microsoft Teams", description: "Run meetings, chats, files and team collaboration." },
  { type: "skill", group: "Tools", skill: "Google Workspace", description: "Collaborate using Docs, Sheets, Drive and Meet." },
  { type: "skill", group: "Tools", skill: "Miro", description: "Run workshops, brainstorming and process mapping." },
  { type: "skill", group: "Tools", skill: "Figma", description: "Collaborate with design teams and visual prototypes." },
  { type: "skill", group: "Tools", skill: "CRM", description: "Work with customer data, pipelines and communication history." },

  { type: "skill", group: "Soft Skills", skill: "Communication", description: "Explain goals, share status and align stakeholders." },
  { type: "skill", group: "Soft Skills", skill: "Leadership", description: "Guide people, create clarity and make decisions." },
  { type: "skill", group: "Soft Skills", skill: "Teamwork", description: "Collaborate and support shared outcomes." },
  { type: "skill", group: "Soft Skills", skill: "Problem solving", description: "Find root causes and choose practical solutions." },
  { type: "skill", group: "Soft Skills", skill: "Time management", description: "Handle workload, deadlines and priorities." },
  { type: "skill", group: "Soft Skills", skill: "Negotiation", description: "Align deadlines, scope, budget and expectations." },
  { type: "skill", group: "Soft Skills", skill: "Presentation skills", description: "Explain ideas, updates and results clearly." },
  { type: "skill", group: "Soft Skills", skill: "Conflict resolution", description: "Handle disagreements before they damage the project." },
  { type: "skill", group: "Soft Skills", skill: "Decision making", description: "Choose direction with incomplete information." },
  { type: "skill", group: "Soft Skills", skill: "Critical thinking", description: "Question assumptions and check evidence." },
  { type: "skill", group: "Soft Skills", skill: "Adaptability", description: "Respond to change without losing focus." },
  { type: "skill", group: "Soft Skills", skill: "Ownership", description: "Take responsibility for results." },
  { type: "skill", group: "Soft Skills", skill: "Empathy", description: "Understand users, stakeholders and team dynamics." },
  { type: "skill", group: "Soft Skills", skill: "Stress management", description: "Stay effective under deadlines and uncertainty." },

  { type: "skill", group: "Business Skills", skill: "Business analysis", description: "Connect business needs with practical solutions." },
  { type: "skill", group: "Business Skills", skill: "KPI tracking", description: "Monitor key performance metrics." },
  { type: "skill", group: "Business Skills", skill: "Vendor management", description: "Work with suppliers, contracts and delivery quality." },
  { type: "skill", group: "Business Skills", skill: "Customer orientation", description: "Use customer needs to guide decisions." },
  { type: "skill", group: "Business Skills", skill: "Strategic thinking", description: "Connect daily work with long-term priorities." },
  { type: "skill", group: "Business Skills", skill: "Financial awareness", description: "Understand cost, value and resource trade-offs." },
  { type: "skill", group: "Business Skills", skill: "Data-driven decision making", description: "Use evidence and metrics instead of assumptions." },
  { type: "skill", group: "Business Skills", skill: "Documentation", description: "Create clarity and continuity across the team." },
  { type: "skill", group: "Business Skills", skill: "Quality management", description: "Work with standards, feedback and improvement." },
  { type: "skill", group: "Business Skills", skill: "Process mapping", description: "Visualize workflows and identify inefficiencies." },

  { type: "language", group: "Languages", skill: "English", description: "Useful for international teams and documentation." },
  { type: "language", group: "Languages", skill: "Czech", description: "Useful for local communication and Czech clients." },
  { type: "language", group: "Languages", skill: "Slovak", description: "Useful in Czech-Slovak teams and regional business." },
  { type: "language", group: "Languages", skill: "German", description: "Useful for DACH markets and German-speaking stakeholders." },
  { type: "language", group: "Languages", skill: "Polish", description: "Useful in Central European teams and supplier communication." },
  { type: "language", group: "Languages", skill: "French", description: "Useful in international companies and European projects." }
];

export function createInitialAnswers() {
  const result = {};
  QUESTIONS.forEach((question) => {
    result[question.skill] = 0;
  });
  return result;
}

export function getLevelLabel(question, value) {
  if (question.type === "language") return LANGUAGE_LEVELS[value];
  return SKILL_LEVELS[value];
}

export function getUsers() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveUsers(users) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
