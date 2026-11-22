(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* menu */
  const menuBtn = $('.menu-button');
  const nav = $('#site-nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') !== 'true';
      menuBtn.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => {
      menuBtn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }));
  }

  /* ledger view: As received / Linked */
  const ledger = $('.ledger');
  const switchBtns = $$('.switch-btn');
  const setView = (view) => {
    if (!ledger || ledger.dataset.view === view) return;
    ledger.dataset.view = view;
    switchBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    ledger.classList.remove('is-settling');
    if (view === 'linked') {
      void ledger.offsetWidth;
      ledger.classList.add('is-settling');
    }
  };
  let touched = false;
  switchBtns.forEach(b => b.addEventListener('click', () => { touched = true; setView(b.dataset.view); }));

  /* idle demo, once: the records arrive as received, then settle into linked columns */
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (ledger && !calm && 'IntersectionObserver' in window) {
    setView('raw');
    const io = new IntersectionObserver((entries) => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      setTimeout(() => { if (!touched) setView('linked'); }, 1100);
    }, { threshold: 0.6 });
    io.observe(ledger);
  }

  /* guided review: purpose */
  const purposes = {
    income: {
      label: 'Income summary',
      context: 'Income summary for one month of linked records',
      title: 'Three records. One traceable payment.',
      note: 'One billed month is linked to one payment.',
      missing: 'Additional months',
      check: 'Identity, reference, amount and source authenticity',
      next: 'Add the following months to show regular income.'
    },
    rental: {
      label: 'Rental application',
      context: 'Rental application with supporting income records',
      title: 'A landlord asks: how reliable is the income?',
      note: 'The package lists the documents a landlord usually asks for next.',
      missing: 'Further months, identity checks and recipient criteria',
      check: 'Recent income history and the landlord’s actual requirements',
      next: 'Add more recent payment periods, then prepare a tailored summary for the recipient to review.'
    },
    residency: {
      label: 'Residency preparation',
      context: 'Residency preparation with work-history records',
      title: 'Can your professional activity be documented?',
      note: 'Requirements depend on the jurisdiction; the checklist follows the official list for the chosen route.',
      missing: 'Ongoing activity evidence, eligibility and country-specific requirements',
      check: 'Applicable immigration route and official document checklist',
      next: 'Confirm the applicable official checklist, then collect the missing periods and supporting records.'
    }
  };
  let current = 'income';
  const fields = { context: '#sheet-context', title: '#sheet-title', note: '#sheet-note', missing: '#sheet-missing', check: '#sheet-check', next: '#sheet-next' };
  const purposeBtns = $$('.purpose-btn');
  const setPurpose = (key) => {
    const p = purposes[key];
    if (!p) return;
    current = key;
    purposeBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.purpose === key)));
    Object.entries(fields).forEach(([k, sel]) => { const el = $(sel); if (el) el.textContent = p[k]; });
  };
  purposeBtns.forEach(b => b.addEventListener('click', () => setPurpose(b.dataset.purpose)));

  /* claim -> source highlighting */
  const claims = $$('button.claim');
  const sources = $$('.sources li[data-source]');
  const cite = (btn) => {
    const active = btn && btn.getAttribute('aria-pressed') !== 'true';
    claims.forEach(c => c.setAttribute('aria-pressed', String(active && c === btn)));
    const ids = active ? btn.dataset.sources.split(' ') : [];
    sources.forEach(li => li.classList.toggle('is-cited', ids.includes(li.dataset.source)));
  };
  claims.forEach(c => {
    c.setAttribute('aria-pressed', 'false');
    c.addEventListener('click', () => cite(c));
  });

  /* export */
  const exportBtn = $('#export');
  if (exportBtn) exportBtn.addEventListener('click', () => {
    const p = purposes[current];
    const data = {
      purpose: p.label,
      status: 'Linked to sources',
      example: true,
      sources: [
        { id: 'A', record: 'Client agreement', counterparty: 'Studio North', terms: 'EUR 3,200 a month, April to September 2026' },
        { id: 'B', record: 'Invoice', reference: 'SN-048', amount: 3200, currency: 'EUR', date: '2026-04-30' },
        { id: 'C', record: 'Bank payment', reference: 'SN048', amount: 3200, currency: 'EUR', date: '2026-05-06' }
      ],
      claims: claims.map(c => ({ text: $('.claim-text', c).textContent, sources: c.dataset.sources.split(' ') })),
      open: [p.missing],
      to_check: p.check,
      next_step: p.next
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rilatu-review-${current}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
