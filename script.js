/* Mezzanotte Lab - script.js (JavaScript vanilla) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Stemma: usa logo.png se presente, altrimenti una versione disegnata in SVG --- */
  var SP = '<path d="M50 14.5C50.6 22 50.8 26 55 28.5L45 28.5C49.2 26 49.4 22 50 14.5Z"/>';
  var LOGO = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#000"/><g fill="#fff"><circle cx="50" cy="50" r="23"/>' + SP + '<g transform="translate(0,100) scale(1,-1)">' + SP + '</g></g><ellipse cx="50" cy="50" rx="16" ry="22" fill="#000"/><g fill="#fff"><rect x="49.4" y="28" width="1.2" height="17"/><rect x="49.4" y="55" width="1.2" height="17"/></g></svg>');
  $$('img.lg').forEach(function (im) {
    im.onerror = function () { im.onerror = null; im.src = LOGO; };
    if (im.complete && im.naturalWidth === 0) im.onerror();
  });

  /* --- Stelle che brillano nell'hero --- */
  var sky = $('#sky');
  if (sky && !reduce) {
    for (var q = 0; q < 40; q++) {
      var st = document.createElement('i'), z = Math.random() * 2 + 1;
      st.style.cssText = 'left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;width:' + z + 'px;height:' + z + 'px;animation-duration:' + (2 + Math.random() * 5) + 's;animation-delay:-' + Math.random() * 6 + 's';
      sky.appendChild(st);
    }
  }

  /* --- Anno nel footer --- */
  $('#yr').textContent = new Date().getFullYear();

  /* --- Header: ombra quando si scorre --- */
  var hd = $('.hd');
  addEventListener('scroll', function () { hd.classList.toggle('sc', scrollY > 10); }, { passive: true });

  /* --- Menu mobile --- */
  var nav = $('#nav'), burger = $('#burger');
  function menu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  }
  burger.addEventListener('click', function () { menu(!nav.classList.contains('open')); });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { menu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') menu(false); });

  /* --- Tema chiaro / scuro (salvato nel browser) --- */
  var root = document.documentElement, tb = $('#theme');
  function labelTheme() {
    var dark = root.dataset.theme === 'dark';
    tb.setAttribute('aria-label', dark ? 'Attiva tema chiaro' : 'Attiva tema scuro');
  }
  tb.addEventListener('click', function () {
    var t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    labelTheme();
  });
  labelTheme();

  /* --- Portfolio: dati di esempio (aggiungi "img": "immagini/file.jpg" per usare una foto vera) --- */
  var progetti = [
    { n: 'Notte d\'Estate', c: 'Social Media', d: 'Calendario editoriale e crescita della community per un locale.', g: ['#2c2c30', '#000'] },
    { n: 'Casa Aurora', c: 'Brand Identity', d: 'Logo, palette e linee guida per un brand di arredo.', g: ['#52525B', '#0A0A0B'] },
    { n: 'Reel Atelier', c: 'Contenuti', d: 'Serie di Reel e shooting per una collezione moda.', g: ['#A1A1AA', '#18181B'] },
    { n: 'Pronto Subito', c: 'Customer Service', d: 'Assistenza multicanale e gestione delle recensioni.', g: ['#3F3F46', '#000'] },
    { n: 'Linea Notturna', c: 'Merchandising', d: 'Felpe e t-shirt personalizzate per il lancio di un evento.', g: ['#71717A', '#111113'] },
    { n: 'Box Stella', c: 'Packaging', d: 'Packaging su misura con stampa a due colori.', g: ['#D4D4D8', '#27272A'] }
  ];
  var port = $('#port');
  progetti.forEach(function (p) {
    var el = document.createElement('article');
    el.className = 'pj rv';
    var im = p.img ? '<img src="' + p.img + '" alt="' + p.n + '" loading="lazy">' : '<span aria-hidden="true">' + p.n.charAt(0) + '</span>';
    el.innerHTML = '<div class="ov"><div class="im" style="background:linear-gradient(135deg,' + p.g[0] + ',' + p.g[1] + ')">' + im + '</div></div>' +
      '<div class="tx"><p class="ct">' + p.c + '</p><h3>' + p.n + '</h3><p>' + p.d + '</p></div>';
    port.appendChild(el);
  });

  /* --- Animazione allo scroll --- */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* --- Contatori animati --- */
  function count(el) {
    var end = +el.dataset.n, t0 = null, dur = 1400;
    if (reduce) { el.textContent = end; return; }
    (function step(t) {
      t0 = t0 || t;
      var k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  var nums = $$('[data-n]');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); io2.unobserve(e.target); } });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io2.observe(n); });
  } else { nums.forEach(function (n) { n.textContent = n.dataset.n; }); }

  /* --- Carosello testimonianze --- */
  var sl = $$('.sl'), cur = 0, timer;
  function show(i) {
    cur = (i + sl.length) % sl.length;
    sl.forEach(function (s, k) { s.classList.toggle('on', k === cur); });
  }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur + 1); }, 6000); }
  $('#prev').addEventListener('click', function () { show(cur - 1); auto(); });
  $('#next').addEventListener('click', function () { show(cur + 1); auto(); });
  $('#car').addEventListener('mouseenter', function () { clearInterval(timer); });
  $('#car').addEventListener('mouseleave', auto);
  auto();

  /* --- "Scopri di più": precompila il messaggio con il servizio scelto --- */
  $$('[data-s]').forEach(function (a) {
    a.addEventListener('click', function () {
      var m = $('#form [name=messaggio]');
      if (!m.value) m.value = 'Vorrei saperne di più su: ' + a.dataset.s + '.';
    });
  });

  /* --- Form: validazione --- */
  var form = $('#form'), fmsg = $('#fmsg');
  function setErr(f, txt) {
    var old = f.parentNode.querySelector('.err'); if (old) old.remove();
    f.removeAttribute('aria-invalid');
    if (txt) {
      f.setAttribute('aria-invalid', 'true');
      var s = document.createElement('span'); s.className = 'err'; s.textContent = txt;
      f.parentNode.appendChild(s);
    }
    return !txt;
  }
  function check(f) {
    var v = f.value.trim();
    if (f.required && !v) return setErr(f, 'Questo campo è obbligatorio.');
    if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return setErr(f, 'Inserisci un\'email valida.');
    if (f.name === 'messaggio' && v.length < 10) return setErr(f, 'Scrivi almeno 10 caratteri.');
    return setErr(f, '');
  }
  $$('input,textarea', form).forEach(function (f) { f.addEventListener('blur', function () { check(f); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = $$('input,textarea', form).map(check).every(Boolean);
    if (!ok) { fmsg.textContent = 'Controlla i campi evidenziati.'; var b = $('[aria-invalid=true]', form); if (b) b.focus(); return; }
    /* QUI collegherai l'invio reale (es. Formspree, EmailJS o un tuo server). */
    fmsg.textContent = 'Grazie! Abbiamo ricevuto la tua richiesta e ti risponderemo presto.';
    form.reset();
  });
})();
