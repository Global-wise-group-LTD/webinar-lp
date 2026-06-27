/* EasyFlow webinar LP - accessibility widget + cookie consent (Hebrew, Israeli Standard 5568)
   Self-injects styles + DOM. Include on every page: <script src="legal.js" defer></script> */
(function(){
  "use strict";
  var BASE = location.pathname.indexOf('/nadav/') !== -1 ? '../' : '';
  var LS_A11Y = 'ef_a11y', LS_COOKIE = 'ef_cookie_consent';

  /* ---------- styles ---------- */
  var css = `
  :root{--a11y-accent:#4F60A8;--a11y-accent2:#E0457B}
  /* font scaling */
  html.a11y-font-1 body{font-size:108%}
  html.a11y-font-2 body{font-size:118%}
  html.a11y-font-3 body{font-size:132%}
  html.a11y-font-1 .h1,html.a11y-font-1 h1{font-size:115%}
  /* high contrast */
  html.a11y-contrast,html.a11y-contrast body{background:#000 !important;color:#fff !important}
  html.a11y-contrast *{background-color:transparent !important;color:#fff !important;border-color:#fff !important;text-shadow:none !important;box-shadow:none !important}
  html.a11y-contrast a,html.a11y-contrast .u,html.a11y-contrast h1,html.a11y-contrast h2,html.a11y-contrast .h2,html.a11y-contrast h3{color:#ffeb3b !important;-webkit-text-fill-color:#ffeb3b !important}
  html.a11y-contrast img{filter:grayscale(.2) contrast(1.1)}
  /* grayscale */
  html.a11y-gray{filter:grayscale(1)}
  /* highlight links */
  html.a11y-links a{text-decoration:underline !important;outline:2px dashed var(--a11y-accent2);outline-offset:2px}
  /* readable font */
  html.a11y-readable *{font-family:Arial,'Arial Hebrew',sans-serif !important;letter-spacing:.2px}
  /* bigger spacing */
  html.a11y-spacing p,html.a11y-spacing li,html.a11y-spacing .a{line-height:2 !important;letter-spacing:.6px !important;word-spacing:3px}
  /* stop animations */
  html.a11y-noanim *,html.a11y-noanim *::before,html.a11y-noanim *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}
  /* big cursor */
  html.a11y-cursor,html.a11y-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='1' d='M5 2l14 9-6 1 4 7-3 2-4-7-5 4z'/%3E%3C/svg%3E"),auto !important}
  /* focus visibility (always on) */
  a:focus,button:focus,input:focus,summary:focus{outline:3px solid var(--a11y-accent2) !important;outline-offset:2px}
  /* reading guide */
  #ef-guide{position:fixed;left:0;right:0;height:30px;background:rgba(224,69,123,.18);border-top:2px solid #E0457B;border-bottom:2px solid #E0457B;pointer-events:none;z-index:99998;display:none}
  /* a11y button + panel */
  #ef-a11y-btn{position:fixed;bottom:18px;left:18px;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#4F60A8,#3a48a0);
    color:#fff;border:2px solid #fff;box-shadow:0 6px 20px rgba(0,0,0,.4);cursor:pointer;z-index:99999;display:flex;align-items:center;justify-content:center;font-size:28px;padding:0}
  #ef-a11y-btn:hover{transform:scale(1.05)}
  #ef-a11y-panel{position:fixed;bottom:84px;left:18px;width:300px;max-width:calc(100vw - 36px);background:#fff;color:#15203a;border-radius:14px;
    box-shadow:0 14px 50px rgba(0,0,0,.5);z-index:99999;padding:14px;display:none;direction:rtl;font-family:'Heebo',Arial,sans-serif;max-height:80vh;overflow:auto}
  #ef-a11y-panel.open{display:block}
  #ef-a11y-panel h3{font-size:17px;margin:0 0 10px;text-align:center;color:#3a48a0}
  #ef-a11y-panel .row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  #ef-a11y-panel button.opt{background:#f1f3fb;border:1px solid #d8deef;border-radius:10px;padding:10px 8px;font-size:13.5px;font-weight:700;color:#27324f;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;justify-content:center}
  #ef-a11y-panel button.opt:hover{background:#e6eafb}
  #ef-a11y-panel button.opt.active{background:#4F60A8;color:#fff;border-color:#4F60A8}
  #ef-a11y-panel .full{grid-column:1 / -1}
  #ef-a11y-panel .reset{background:#E0457B;color:#fff;border:none}
  #ef-a11y-panel .lnk{display:block;text-align:center;margin-top:10px;font-size:13px;color:#3a48a0;text-decoration:underline}
  #ef-a11y-panel .close{position:absolute;top:8px;left:10px;background:none;border:none;font-size:20px;cursor:pointer;color:#888}
  /* cookie banner */
  #ef-cookie{position:fixed;bottom:0;left:0;right:0;background:#0c1426;color:#e9edfb;border-top:2px solid #4F60A8;z-index:99997;
    padding:16px 18px;display:none;direction:rtl;font-family:'Heebo',Arial,sans-serif;box-shadow:0 -6px 30px rgba(0,0,0,.5)}
  #ef-cookie.show{display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap}
  #ef-cookie p{font-size:13.5px;max-width:680px;margin:0;line-height:1.5}
  #ef-cookie a{color:#9fb0ef;text-decoration:underline}
  #ef-cookie .btns{display:flex;gap:10px;flex-wrap:wrap}
  #ef-cookie button{border:none;border-radius:10px;padding:11px 22px;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit}
  #ef-cookie .ok{background:linear-gradient(135deg,#19d36b,#0e9e4e);color:#04220f}
  #ef-cookie .more{background:transparent;color:#cfd6f3;border:1px solid #44507a !important}
  @media(max-width:560px){#ef-a11y-panel .row{grid-template-columns:1fr}}
  `;
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- state ---------- */
  var state = {};
  try{ state = JSON.parse(localStorage.getItem(LS_A11Y)) || {}; }catch(e){ state = {}; }

  function apply(){
    var h = document.documentElement;
    h.classList.toggle('a11y-contrast', !!state.contrast);
    h.classList.toggle('a11y-gray', !!state.gray);
    h.classList.toggle('a11y-links', !!state.links);
    h.classList.toggle('a11y-readable', !!state.readable);
    h.classList.toggle('a11y-spacing', !!state.spacing);
    h.classList.toggle('a11y-noanim', !!state.noanim);
    h.classList.toggle('a11y-cursor', !!state.cursor);
    h.classList.remove('a11y-font-1','a11y-font-2','a11y-font-3');
    if(state.font){ h.classList.add('a11y-font-'+state.font); }
    document.getElementById('ef-guide').style.display = state.guide ? 'block' : 'none';
    syncButtons();
  }
  function save(){ try{ localStorage.setItem(LS_A11Y, JSON.stringify(state)); }catch(e){} }

  /* ---------- a11y widget DOM ---------- */
  var btn = document.createElement('button');
  btn.id = 'ef-a11y-btn'; btn.setAttribute('aria-label','תפריט נגישות'); btn.title='נגישות'; btn.innerHTML='&#9855;';
  var panel = document.createElement('div');
  panel.id = 'ef-a11y-panel'; panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','הגדרות נגישות');
  panel.innerHTML =
    '<button class="close" aria-label="סגור">&times;</button>'+
    '<h3>&#9855; הגדרות נגישות</h3>'+
    '<div class="row">'+
      '<button class="opt" data-act="fontup">&#65291; הגדל טקסט</button>'+
      '<button class="opt" data-act="fontdown">&#65293; הקטן טקסט</button>'+
      '<button class="opt" data-key="contrast">&#9681; ניגודיות גבוהה</button>'+
      '<button class="opt" data-key="gray">&#9617; גווני אפור</button>'+
      '<button class="opt" data-key="links">&#128279; הדגשת קישורים</button>'+
      '<button class="opt" data-key="readable">&#128214; גופן קריא</button>'+
      '<button class="opt" data-key="spacing">&#8597; ריווח שורות</button>'+
      '<button class="opt" data-key="noanim">&#10073;&#10073; עצירת אנימציות</button>'+
      '<button class="opt" data-key="cursor">&#10138; סמן גדול</button>'+
      '<button class="opt" data-key="guide">&#9776; מדריך קריאה</button>'+
    '</div>'+
    '<button class="opt full reset" data-act="reset">&#8635; איפוס הגדרות נגישות</button>'+
    '<a class="lnk" href="'+BASE+'accessibility.html">להצהרת הנגישות המלאה</a>';

  function syncButtons(){
    panel.querySelectorAll('button[data-key]').forEach(function(b){
      b.classList.toggle('active', !!state[b.getAttribute('data-key')]);
    });
  }
  panel.addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    var key = b.getAttribute('data-key'), act = b.getAttribute('data-act');
    if(b.classList.contains('close')){ panel.classList.remove('open'); return; }
    if(key){ state[key] = !state[key]; }
    else if(act === 'fontup'){ state.font = Math.min(3, (state.font||0)+1); }
    else if(act === 'fontdown'){ state.font = Math.max(0, (state.font||0)-1); }
    else if(act === 'reset'){ state = {}; }
    save(); apply();
  });
  btn.addEventListener('click', function(){ panel.classList.toggle('open'); });

  /* reading guide */
  var guide = document.createElement('div'); guide.id = 'ef-guide';
  document.addEventListener('mousemove', function(e){ if(state.guide){ guide.style.top = (e.clientY-15)+'px'; } });

  /* ---------- cookie banner ---------- */
  var cookie = document.createElement('div'); cookie.id = 'ef-cookie';
  cookie.innerHTML =
    '<p>אתר זה משתמש בעוגיות ובאחסון מקומי חיוניים לתפקוד תקין של הדף ולשמירת העדפות הנגישות שלך. '+
    'בהמשך הגלישה והשארת פרטים אתה מאשר את השימוש כמפורט ב<a href="'+BASE+'cookies.html">מדיניות העוגיות</a>.</p>'+
    '<div class="btns"><button class="ok">אישור והמשך</button>'+
    '<a class="more" href="'+BASE+'cookies.html" style="text-decoration:none;display:inline-flex;align-items:center">מידע נוסף</a></div>';
  cookie.querySelector('.ok').addEventListener('click', function(){
    try{ localStorage.setItem(LS_COOKIE, JSON.stringify({accepted:true, at:new Date().toISOString()})); }catch(e){}
    cookie.classList.remove('show');
  });

  /* ---------- mount ---------- */
  function mount(){
    document.body.appendChild(guide);
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    document.body.appendChild(cookie);
    apply();
    var consented = false; try{ consented = !!localStorage.getItem(LS_COOKIE); }catch(e){}
    if(!consented){ setTimeout(function(){ cookie.classList.add('show'); }, 700); }
  }
  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', mount); } else { mount(); }
})();
