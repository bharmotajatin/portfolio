export const ICON_PICKS = [
  'ri-flight-takeoff-line', 'ri-plane-line', 'ri-dashboard-3-line', 'ri-bar-chart-box-line', 'ri-line-chart-line',
  'ri-pie-chart-2-line', 'ri-database-2-line', 'ri-code-s-slash-line', 'ri-global-line', 'ri-shield-check-line',
  'ri-leaf-line', 'ri-windy-line', 'ri-cloud-line', 'ri-robot-2-line', 'ri-brain-line', 'ri-briefcase-4-line',
  'ri-stack-line', 'ri-terminal-box-line', 'ri-github-fill', 'ri-linkedin-fill', 'ri-gitlab-fill', 'ri-mail-fill',
  'ri-twitter-x-fill', 'ri-instagram-line', 'ri-youtube-fill', 'ri-medium-fill', 'ri-kaggle-fill', 'ri-file-user-line',
  'ri-user-3-line', 'ri-folder-chart-line', 'ri-graduation-cap-line', 'ri-chat-quote-line', 'ri-mail-send-line', 'ri-award-line',
  'ri-route-line', 'ri-search-eye-line', 'ri-rocket-2-line', 'ri-checkbox-circle-line', 'ri-lightbulb-flash-line', 'ri-team-line'
];

const text = (key, label, extra = {}) => ({ key, label, type: 'text', ...extra });
const area = (key, label, extra = {}) => ({ key, label, type: 'textarea', ...extra });

export const GROUPS = [
  {
    title: 'General',
    items: [
      {
        id: 'profile',
        label: 'Profile & Hero',
        icon: 'ri-user-star-line',
        kind: 'object',
        path: 'profile',
        description: 'Your name, roles, headline and the About section copy.',
        fields: [
          text('name', 'Full name', { required: true }),
          { key: 'roles', label: 'Rotating roles in hero', type: 'tags' },
          area('headline', 'Hero headline', { rows: 2 }),
          area('summary', 'Short summary (footer)', { rows: 3 }),
          area('about', 'About paragraph', { rows: 6 }),
          { key: 'highlights', label: 'About highlights', type: 'stringList' },
          text('location', 'Location'),
          text('email', 'Email'),
          text('phone', 'Phone'),
          text('availability', 'Availability badge text'),
          { key: 'available', label: 'Currently available (green pulse)', type: 'bool' },
          { key: 'avatar', label: 'Profile photo', type: 'image' },
          { key: 'resume', label: 'Resume (PDF)', type: 'file', accept: 'application/pdf' },
          {
            key: 'socials',
            label: 'Social links',
            type: 'list',
            itemLabel: s => s.label || s.url,
            newItem: () => ({ label: 'New link', url: 'https://', icon: 'ri-global-line' }),
            fields: [text('label', 'Label'), { key: 'url', label: 'URL', type: 'url' }, { key: 'icon', label: 'Icon', type: 'icon' }]
          }
        ]
      },
      {
        id: 'stats',
        label: 'Hero stats',
        icon: 'ri-numbers-line',
        kind: 'list',
        path: 'stats',
        description: 'Animated counters under the hero.',
        itemLabel: s => `${s.value}${s.suffix || ''} — ${s.label}`,
        newItem: () => ({ label: 'New stat', value: 10, suffix: '+' }),
        fields: [text('label', 'Label'), { key: 'value', label: 'Number', type: 'number' }, text('suffix', 'Suffix (+, %, k…)')]
      },
      {
        id: 'marquee',
        label: 'Marquee words',
        icon: 'ri-text-wrap',
        kind: 'strings',
        path: 'marquee',
        description: 'Scrolling keywords between the hero and About.'
      },
      {
        id: 'sections',
        label: 'Sections & order',
        icon: 'ri-layout-masonry-line',
        kind: 'sections',
        path: 'sections',
        description: 'Show, hide, rename and reorder the sections of the page.'
      }
    ]
  },
  {
    title: 'Content',
    items: [
      {
        id: 'projects',
        label: 'Projects',
        icon: 'ri-folder-chart-line',
        kind: 'list',
        path: 'projects',
        description: 'Add, edit, reorder or remove projects. The first featured project is shown wide.',
        itemLabel: p => p.title,
        itemMeta: p => [p.category, p.year, p.featured ? '★ featured' : ''].filter(Boolean).join(' · '),
        newItem: () => ({
          title: 'New project',
          category: 'Web App',
          year: String(new Date().getFullYear()),
          description: '',
          details: '',
          tags: [],
          liveUrl: '',
          repoUrl: '',
          image: '',
          icon: 'ri-code-box-line',
          color: '#22d3ee',
          featured: false
        }),
        fields: [
          text('title', 'Title', { required: true }),
          text('category', 'Category (used for filter tabs)', { suggestions: ['Web App', 'Dashboard', 'Data', 'ML', 'Mobile'] }),
          text('year', 'Year'),
          area('description', 'Card description', { rows: 3 }),
          area('details', 'Full details (modal)', { rows: 5 }),
          { key: 'tags', label: 'Tech tags', type: 'tags' },
          { key: 'liveUrl', label: 'Live URL', type: 'url' },
          { key: 'embed', label: 'Show live site inside the project popup (only works if the site allows embedding)', type: 'bool' },
          { key: 'repoUrl', label: 'Repository URL', type: 'url' },
          { key: 'image', label: 'Cover image (optional — a 3D icon card is used otherwise)', type: 'image' },
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'color', label: 'Accent colour', type: 'color' },
          { key: 'featured', label: 'Featured', type: 'bool' }
        ]
      },
      {
        id: 'process',
        label: 'Process steps',
        icon: 'ri-route-line',
        kind: 'list',
        path: 'process',
        description: 'The "How I work" steps. On desktop they slide sideways while the section is pinned as visitors scroll.',
        itemLabel: s => s.title,
        itemMeta: s => (s.tools || []).join(', '),
        newItem: () => ({ title: 'New step', description: '', icon: 'ri-checkbox-circle-line', color: '#34d399', tools: [] }),
        fields: [
          text('title', 'Title', { required: true }),
          area('description', 'Description', { rows: 3 }),
          { key: 'tools', label: 'Tools / methods', type: 'tags' },
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'color', label: 'Accent colour', type: 'color' }
        ]
      },
      {
        id: 'experience',
        label: 'Experience',
        icon: 'ri-briefcase-4-line',
        kind: 'list',
        path: 'experience',
        description: 'Timeline entries, newest first. Numbers and percentages are highlighted automatically.',
        itemLabel: e => e.role,
        itemMeta: e => `${e.company} · ${e.start} — ${e.end}`,
        newItem: () => ({ role: 'New role', company: '', location: '', start: '', end: 'Present', highlights: [], tags: [] }),
        fields: [
          text('role', 'Role', { required: true }),
          text('company', 'Company'),
          text('location', 'Location'),
          text('start', 'Start (e.g. Jan 2026)'),
          text('end', 'End (or "Present")'),
          { key: 'highlights', label: 'Achievements', type: 'stringList' },
          { key: 'tags', label: 'Tags', type: 'tags' }
        ]
      },
      {
        id: 'skills',
        label: 'Skills',
        icon: 'ri-stack-line',
        kind: 'list',
        path: 'skills',
        description: 'Skill categories. Every item also appears on the 3D skill sphere.',
        itemLabel: s => s.name,
        itemMeta: s => `${s.items?.length || 0} skills · ${s.level}%`,
        newItem: () => ({ name: 'New category', icon: 'ri-stack-line', color: '#34d399', level: 80, items: [] }),
        fields: [
          text('name', 'Category name', { required: true }),
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'color', label: 'Colour', type: 'color' },
          { key: 'level', label: 'Proficiency', type: 'range', min: 0, max: 100 },
          { key: 'items', label: 'Skills', type: 'tags' },
          {
            key: 'usage',
            label: 'Hover messages (where you applied a skill)',
            type: 'list',
            itemLabel: u => u.skill || 'New message',
            newItem: () => ({ skill: '', note: '' }),
            fields: [text('skill', 'Skill (exact name from the list above)'), area('note', 'Message', { rows: 2 })]
          }
        ]
      },
      {
        id: 'education',
        label: 'Education',
        icon: 'ri-graduation-cap-line',
        kind: 'list',
        path: 'education',
        itemLabel: e => e.degree,
        itemMeta: e => `${e.school} · ${e.start} — ${e.end}`,
        newItem: () => ({ degree: 'New degree', school: '', start: '', end: '', score: '', description: '' }),
        fields: [text('degree', 'Degree', { required: true }), text('school', 'Institution'), text('start', 'Start'), text('end', 'End'), text('score', 'Score / CGPA'), area('description', 'Description', { rows: 3 })]
      },
      {
        id: 'certifications',
        label: 'Certifications',
        icon: 'ri-award-line',
        kind: 'list',
        path: 'certifications',
        itemLabel: c => c.name,
        itemMeta: c => [c.issuer, c.year].filter(Boolean).join(' · '),
        newItem: () => ({ name: 'New certification', issuer: '', year: String(new Date().getFullYear()), url: '' }),
        fields: [text('name', 'Name', { required: true }), text('issuer', 'Issuer'), text('year', 'Year'), { key: 'url', label: 'Credential URL', type: 'url' }]
      },
      {
        id: 'competencies',
        label: 'Competencies',
        icon: 'ri-sparkling-2-line',
        kind: 'strings',
        path: 'competencies',
        description: 'Soft skills shown as chips in the About section.'
      },
      {
        id: 'testimonials',
        label: 'Testimonials',
        icon: 'ri-chat-quote-line',
        kind: 'list',
        path: 'testimonials',
        itemLabel: t => `“${(t.quote || '').slice(0, 48)}…”`,
        itemMeta: t => [t.pending && '⏳ Awaiting approval', t.author, t.role].filter(Boolean).join(' · '),
        newItem: () => ({ quote: '', author: '', role: '', rating: 5 }),
        fields: [
          area('quote', 'Quote', { rows: 3, required: true }),
          text('author', 'Author'),
          text('role', 'Role / company'),
          { key: 'rating', label: 'Rating', type: 'range', min: 1, max: 5 },
          { key: 'pending', label: 'Pending approval (hidden from the site — untick to publish)', type: 'bool' }
        ]
      }
    ]
  },
  {
    title: 'Settings',
    items: [
      {
        id: 'contact',
        label: 'Contact form',
        icon: 'ri-mail-settings-line',
        kind: 'object',
        path: 'contact',
        description: 'Leave the endpoint empty to open the visitor’s email app. Paste a Formspree / Web3Forms URL to receive messages directly.',
        fields: [area('heading', 'Heading', { rows: 2 }), area('subheading', 'Sub-heading', { rows: 2 }), { key: 'formEndpoint', label: 'Form endpoint URL (optional)', type: 'url' }]
      },
      {
        id: 'meta',
        label: 'SEO',
        icon: 'ri-search-eye-line',
        kind: 'object',
        path: 'meta',
        fields: [text('title', 'Browser tab title'), area('description', 'Meta description', { rows: 3 }), { key: 'siteUrl', label: 'Site URL', type: 'url' }]
      },
      { id: 'json', label: 'Import / Export', icon: 'ri-braces-line', kind: 'json', description: 'Download a backup, restore one, or edit the raw JSON.' }
    ]
  }
];

export const ALL_EDITORS = GROUPS.flatMap(g => g.items);

export const slug = s =>
  String(s || 'item')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32) || 'item';

export const newId = base => `${slug(base)}-${Math.random().toString(36).slice(2, 6)}`;
