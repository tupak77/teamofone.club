/* Team of One — landing interactions. No dependencies. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * CONFIG — paste your payment links here (Stripe Payment Links,
   * Lemon Squeezy, Skool, etc.). While a link is empty, the button
   * opens a "doors open soon" modal instead of a dead click.
   * ------------------------------------------------------------------ */
  var CHECKOUT = {
    member: { monthly: 'https://whop.com/checkout/plan_dOhdkjz7z3sBC', yearly: 'https://whop.com/checkout/plan_dOhdkjz7z3sBC' },
    plus:   { monthly: '', yearly: '' }
  };
  var CONTACT_EMAIL = 'hello@teamofone.club';

  var PRICES = {
    monthly: { member: 49, plus: 99, memberNote: 'Billed monthly · cancel anytime', plusNote: 'Billed monthly · cancel anytime' },
    yearly:  { member: 39, plus: 79, memberNote: 'Billed €470 a year · 2 months free', plusNote: 'Billed €950 a year · 2 months free' }
  };

  var SERVICES = [
    { id: 'writer', name: 'Content writer', sys: 'Content engine + SEO article writer', cost: 1500 },
    { id: 'ads', name: 'Ads agency', sys: 'Meta ads campaign', cost: 1500 },
    { id: 'lead', name: 'Lead gen agency', sys: 'Cold outreach', cost: 2000 },
    { id: 'seo', name: 'SEO consultant', sys: 'SEO audit + topical map', cost: 1000 },
    { id: 'social', name: 'Social media manager', sys: 'Social content engine + carousels', cost: 1200 },
    { id: 'email', name: 'Email marketing freelancer', sys: 'Sales email campaign + newsletter', cost: 900 },
    { id: 'design', name: 'Freelance designer', sys: 'Branded infographics + Claude Design', cost: 1000 },
    { id: 'va', name: 'Virtual assistant', sys: 'Workspace kit + inbox triage', cost: 800 }
  ];

  var reduce = false; // effects always on, whatever the OS motion setting
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  var track = function (name, data) { try { if (window.va) window.va('event', { name: name, data: data }); } catch (e) {} };

  /* ---------- hero headline: word-by-word reveal ---------- */
  var h1 = $('[data-split]');
  if (h1) {
    var i = 0;
    var splitNode = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            w.style.animationDelay = (0.15 + i++ * 0.055) + 's';
            frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1) { splitNode(c); }
      });
    };
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    splitNode(h1);
    $$('.w', h1).forEach(function (w) { w.setAttribute('aria-hidden', 'true'); });
  }

  /* ---------- reveal on scroll with sibling stagger ---------- */
  var rv = $$('.rv');
  rv.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains('rv'); });
    var idx = sibs.indexOf(el);
    if (sibs.length > 2) el.style.setProperty('--d', Math.min(idx, 6) * 0.07 + 's');
  });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- scroll-linked: nav, progress, parallax, timeline, mobile bar ---------- */
  var hdr = $('.hdr'), prog = $('.progress'), mbar = $('.mbar');
  var glows = $$('[data-parallax]');
  var tl = $('[data-timeline]'), tlis = tl ? $$('.tli', tl) : [];
  var pricing = $('#pricing');
  var ticking = false;
  var onScroll = function () {
    var y = window.scrollY || window.pageYOffset;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;
    if (hdr) hdr.classList.toggle('scrolled', y > 12);
    if (prog) prog.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (!reduce) glows.forEach(function (g) {
      var k = parseFloat(g.getAttribute('data-parallax'));
      g.style.translate = '0 ' + (y * 0.18 * k).toFixed(1) + 'px';
    });
    if (tl) {
      var r = tl.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      tl.style.setProperty('--tp', p.toFixed(3));
      tlis.forEach(function (li) {
        li.classList.toggle('lit', li.getBoundingClientRect().top + 12 < vh * 0.6);
      });
    }
    if (mbar && pricing) {
      var pr = pricing.getBoundingClientRect();
      var atPricing = pr.top < vh * 0.85 && pr.bottom > 0;
      mbar.classList.toggle('show', y > vh * 0.9 && !atPricing);
    }
    ticking = false;
  };
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- hero player: auto-playing lesson demo ---------- */
  var LESSONS = [
    { a: 'Meet your', b: 'AI crew.', crew: -1 },
    { a: 'Claude, set up', b: 'in 10 min.', crew: 3 },
    { a: 'Install your', b: 'first system.', crew: 1 },
    { a: 'Hand off', b: 'your first job.', crew: 0 }
  ];
  var les = $$('[data-les]'), vt = $('[data-vtitle]'), vbar = $('[data-vbar]'), ltag = $('[data-lesson-tag]');
  var crew = $$('.cm');
  if (les.length && vt && vbar) {
    var cur = 0, pct = 0, DUR = 4200, last = 0, visible = true;
    var setLesson = function (n) {
      cur = n; pct = 0;
      les.forEach(function (l, k) { l.classList.toggle('on', k === n); });
      var L = LESSONS[n];
      vt.classList.remove('swap'); void vt.offsetWidth; vt.classList.add('swap');
      vt.children[0].textContent = L.a; vt.children[1].textContent = L.b;
      if (ltag) ltag.textContent = 'Lesson ' + (n + 1) + ' of 9';
    };
    var hiCrew = function (t) {
      var k = Math.floor(t / 600) % crew.length;
      crew.forEach(function (c, j) { c.classList.toggle('hi', j === k); });
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe($('.player'));
    }
    les.forEach(function (l, k) {
      l.style.cursor = 'pointer';
      l.addEventListener('click', function () { setLesson(k); });
    });
    if (!reduce) {
      var loop = function (t) {
        if (!last) last = t;
        var dt = t - last; last = t;
        if (visible && !document.hidden) {
          pct += dt / DUR * 100;
          if (pct >= 100) setLesson((cur + 1) % LESSONS.length);
          vbar.style.width = Math.min(pct, 100).toFixed(1) + '%';
          hiCrew(t);
        }
        requestAnimationFrame(loop);
      };
      setTimeout(function () { requestAnimationFrame(loop); }, 1400);
    } else { vbar.style.width = '18%'; }
  }

  /* ---------- member area: tick the first-week checklist ---------- */
  var app = $('[data-app]');
  if (app) {
    var boxes = $$('.tb', app), doneEl = $('[data-done]', app);
    var runTicks = function () {
      [0, 1, 2].forEach(function (k) {
        setTimeout(function () {
          boxes[k].classList.add('on');
          boxes[k].parentNode.classList.add('done-row');
          if (doneEl) doneEl.textContent = k + 1;
        }, reduce ? 0 : 500 + k * 650);
      });
    };
    if ('IntersectionObserver' in window) {
      var aio = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { runTicks(); aio.disconnect(); }
      }, { threshold: 0.4 });
      aio.observe(app);
    } else { runTicks(); }
  }

  /* ---------- count-up helper ---------- */
  var animate = function (el, to, from) {
    if (!el) return;
    from = from == null ? parseFloat(String(el.textContent).replace(/,/g, '')) || 0 : from;
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    var start = null, d = 700;
    var step = function (t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / d);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- calculator ---------- */
  var calc = $('[data-calc]');
  if (calc) {
    var sel = ['writer', 'social', 'va'];
    var totalEl = $('[data-total]'), yearlyEl = $('[data-yearly]');
    calc.innerHTML = SERVICES.map(function (s) {
      var on = sel.indexOf(s.id) >= 0;
      return '<button type="button" class="svc' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-id="' + s.id + '">' +
        '<span class="cb" aria-hidden="true"></span><span class="cx"><b>' + s.name + '</b><span>' + s.sys + '</span></span>' +
        '<span class="cp2">€' + fmt(s.cost) + '/mo</span></button>';
    }).join('');
    var counted = false;
    var update = function () {
      var total = SERVICES.filter(function (s) { return sel.indexOf(s.id) >= 0; })
        .reduce(function (a, s) { return a + s.cost; }, 0);
      animate(totalEl, total);
      animate(yearlyEl, Math.max(0, (total - 29.99) * 12));
    };
    calc.addEventListener('click', function (e) {
      var b = e.target.closest('.svc'); if (!b) return;
      var id = b.getAttribute('data-id'), k = sel.indexOf(id);
      if (k >= 0) sel.splice(k, 1); else sel.push(id);
      b.classList.toggle('on', k < 0);
      b.setAttribute('aria-pressed', String(k < 0));
      update();
      track('calc_toggle', { service: id });
    });
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting && !counted) { counted = true; update(); cio.disconnect(); }
      }, { threshold: 0.3 });
      cio.observe(calc);
    } else { update(); }
  }

  /* ---------- pricing toggle ---------- */
  var billing = 'monthly';
  var tog = $('[data-tog]');
  if (tog) {
    var thumb = $('.thumb', tog), btns = $$('.tg', tog);
    var placeThumb = function () {
      var on = $('.tg.on', tog); if (!on || !thumb) return;
      thumb.style.width = on.offsetWidth + 'px';
      thumb.style.transform = 'translateX(' + on.offsetLeft + 'px)';
    };
    var setBilling = function (b) {
      billing = b;
      btns.forEach(function (x) {
        var on = x.getAttribute('data-billing') === b;
        x.classList.toggle('on', on);
        x.setAttribute('aria-checked', String(on));
      });
      placeThumb();
      var P = PRICES[b];
      ['member', 'plus'].forEach(function (plan) {
        var el = $('[data-price="' + plan + '"]');
        if (el) {
          var amt = el.parentNode;
          amt.classList.remove('flip'); void amt.offsetWidth; amt.classList.add('flip');
          el.textContent = P[plan];
        }
        var n = $('[data-note="' + plan + '"]'); if (n) n.textContent = P[plan + 'Note'];
      });
      track('billing_toggle', { billing: b });
    };
    btns.forEach(function (x) { x.addEventListener('click', function () { setBilling(x.getAttribute('data-billing')); }); });
    tog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        var nb = billing === 'yearly' ? 'monthly' : 'yearly';
        setBilling(nb);
        $('[data-billing="' + nb + '"]', tog).focus();
      }
    });
    window.addEventListener('resize', placeThumb);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeThumb);
    placeThumb();
  }

  /* ---------- checkout buttons (with graceful fallback) ---------- */
  var modal = $('[data-modal]');
  var openModal = function (plan) {
    if (!modal) return;
    var label = plan === 'plus' ? 'Plus' : 'Member';
    $('[data-mplan]', modal).textContent = label + ' · ' + billing;
    $('[data-mmail]', modal).href = 'mailto:' + CONTACT_EMAIL + '?subject=' +
      encodeURIComponent('Team of One: send me the ' + label + ' (' + billing + ') link');
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('open'); });
    $('[data-close]', modal).focus();
  };
  var closeModal = function () {
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(function () { modal.hidden = true; }, 300);
  };
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('[data-close]')) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }
  $$('[data-checkout]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var plan = a.getAttribute('data-checkout');
      var url = CHECKOUT[plan] && CHECKOUT[plan][billing];
      track('checkout_click', { plan: plan, billing: billing });
      if (url) { a.href = url; return; }
      e.preventDefault();
      openModal(plan);
    });
  });

  /* ---------- honest urgency: countdown to the Monday system drop ---------- */
  var drop = $('[data-drop]');
  if (drop) {
    var nextMonday = function () {
      var n = new Date(), t = new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate(), 8, 0, 0));
      var add = (8 - t.getUTCDay()) % 7; // days until Monday
      t.setUTCDate(t.getUTCDate() + add);
      if (t <= n) t.setUTCDate(t.getUTCDate() + 7);
      return t;
    };
    var pad = function (x) { return (x < 10 ? '0' : '') + x; };
    var tickDrop = function () {
      var ms = nextMonday() - new Date();
      var d = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, mm = Math.floor(ms / 6e4) % 60, ss = Math.floor(ms / 1e3) % 60;
      drop.textContent = 'drops in ' + (d ? d + 'd ' : '') + pad(hh) + 'h ' + pad(mm) + 'm ' + pad(ss) + 's';
    };
    tickDrop(); setInterval(tickDrop, 1000);
  }

  /* ---------- systems filter ---------- */
  var wfil = $('.wfil'), wf = $('.wf');
  if (wfil && wf) {
    var cards = $$('.wc', wf);
    wfil.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var f = b.getAttribute('data-f');
      $$('button', wfil).forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      cards.forEach(function (c) { c.classList.toggle('dim', f !== 'all' && c.getAttribute('data-cat') !== f); });
      if (wf.scrollTo) wf.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
      track('systems_filter', { filter: f });
    });
  }

  /* ---------- analytics on CTAs ---------- */
  $$('[data-track]').forEach(function (a) {
    a.addEventListener('click', function () { track('cta_click', { where: a.getAttribute('data-track') }); });
  });

  /* ---------- pointer niceties (desktop only) ---------- */
  if (fine && !reduce) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('.spot');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.28;
        b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + (y - 2).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }
})();
