const norm = s => String(s || '').toLowerCase().trim();
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function mentions(text, skill) {
  return new RegExp(`(^|[^a-z0-9])${escape(norm(skill))}([^a-z0-9]|$)`).test(norm(text));
}

function matches(skill, tags = [], text = '') {
  const s = norm(skill);
  return tags.some(t => norm(t) === s) || mentions(text, skill);
}

export function buildSkillUsage({ skills = [], projects = [], experience = [] }) {
  const usage = new Map();
  for (const cat of skills) {
    const notes = new Map((cat.usage || []).filter(u => u.skill && u.note).map(u => [norm(u.skill), u.note]));
    for (const skill of cat.items) {
      const roles = experience
        .filter(e => matches(skill, e.tags, (e.highlights || []).join(' ')))
        .map(e => ({ title: e.role, org: String(e.company || '').split(' — ').pop(), when: [e.start, e.end].filter(Boolean).join(' – ') }));
      const work = projects
        .filter(p => matches(skill, p.tags, [p.title, p.description, p.details].join(' ')))
        .map(p => ({ title: p.title, when: p.year }));
      usage.set(skill, { note: notes.get(norm(skill)) || '', roles, projects: work, category: cat.name, color: cat.color });
    }
  }
  return usage;
}
