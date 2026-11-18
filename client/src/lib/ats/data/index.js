// client/src/lib/ats/data/index.js
// One object with all the rule data the checker needs (Vite imports JSON natively).
import atsRules from './ats-rules.json';
import keywords from './keywords.json';
import skills from './skills.json';
import actionVerbs from './action-verbs.json';
import jobRoles from './job-roles.json';

export const ROLE_CATEGORIES = jobRoles.categories; // [{ id, name, roles: [] }]

export default { atsRules, keywords, skills, actionVerbs, jobRoles };
