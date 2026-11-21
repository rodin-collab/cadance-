/* Cadence site: movement. Everything here is an extra; each page reads fine without it. */
(function(){
'use strict';
var d=document,w=window,root=d.documentElement;
var RM=!!(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches);
var $=function(s,r){return (r||d).querySelector(s)};
var $$=function(s,r){return [].slice.call((r||d).querySelectorAll(s))};
var clamp=function(v){return v<0?0:v>1?1:v};
root.classList.add('js'); if(!RM) root.classList.add('mo');

/* page transition: arrive */
if(root.classList.contains('arrive')){
  var surface=function(){
    if(!root.classList.contains('arrive')) return;
    root.classList.remove('arrive'); root.classList.add('arrived');
    setTimeout(function(){root.classList.remove('arrived')},900);
  };
  requestAnimationFrame(function(){requestAnimationFrame(surface)});
  setTimeout(surface,160);
}
try{sessionStorage.removeItem('tide')}catch(e){}

/* page transition: leave */
d.addEventListener('click',function(e){
  var a=e.target.closest?e.target.closest('a[href]'):null;
  if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
  var h=a.getAttribute('href')||'';
  if(a.target==='_blank'||/^(#|https?:|mailto:|tel:)/.test(h)) { if(h.charAt(0)==='#') root.classList.remove('menu-open'); return; }
  if(!/\.html(#.*)?$/.test(h)||RM) return;
  e.preventDefault();
  try{sessionStorage.setItem('tide','1')}catch(_){}
  root.classList.add('leave');
  setTimeout(function(){root.classList.remove('menu-open');location.href=a.href},500);
  setTimeout(function(){root.classList.remove('leave')},2800);
});
w.addEventListener('pageshow',function(e){if(e.persisted){root.classList.remove('leave');root.classList.remove('arrive')}});

/* header */
var top=$('.top'),mb=$('.menu-btn');
if(mb){mb.addEventListener('click',function(){var o=root.classList.toggle('menu-open');mb.setAttribute('aria-expanded',o)});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'){root.classList.remove('menu-open');mb.setAttribute('aria-expanded',false)}});}
function head(){
  var y=w.pageYOffset||0,h=root.scrollHeight-w.innerHeight;
  root.classList.toggle('scrolled',y>24);
  if(top) top.style.setProperty('--p',h>0?clamp(y/h).toFixed(4):0);
}

/* scroll-linked pieces */
var tracked=[],tick=false;
function track(el,fn){if(el)tracked.push({el:el,fn:fn})}
function frame(){
  tick=false; head();
  var vh=w.innerHeight;
  for(var i=0;i<tracked.length;i++){var t=tracked[i],r=t.el.getBoundingClientRect();t.fn(clamp((vh-r.top)/(vh+r.height)),r,vh)}
}
function req(){if(!tick){tick=true;requestAnimationFrame(frame)}}
w.addEventListener('scroll',req,{passive:true}); w.addEventListener('resize',req);

/* headline: words rise */
function split(node,n){
  [].slice.call(node.childNodes).forEach(function(c){
    if(c.nodeType===3){
      var f=d.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(function(p){
        if(!p) return;
        if(/^\s+$/.test(p)){f.appendChild(d.createTextNode(' '));return}
        var s=d.createElement('span');s.className='w';s.style.setProperty('--i',n.i++);s.textContent=p;f.appendChild(s);
      });
      node.replaceChild(f,c);
    } else if(c.nodeType===1) split(c,n);
  });
}
if(!RM) $$('.h1').forEach(function(h){split(h,{i:0})});

/* numbers count up, Emma types */
function count(el){
  var to=parseFloat(el.getAttribute('data-count')),dec=+(el.getAttribute('data-dec')||0),t0=0;
  function st(t){if(!t0)t0=t;var k=clamp((t-t0)/1500);k=1-Math.pow(1-k,3);el.textContent=(to*k).toFixed(dec);if(k<1)requestAnimationFrame(st)}
  requestAnimationFrame(st);
}
function type(el){
  var txt=el.textContent,i=0;el.style.minHeight=el.offsetHeight+'px';el.textContent='';
  (function st(){i++;el.textContent=txt.slice(0,i);if(i<txt.length)setTimeout(st,14+Math.random()*26)})();
}
function fire(el){
  if(RM) return;
  var cs=$$('[data-count]',el);if(el.hasAttribute('data-count'))cs.push(el);
  cs.forEach(function(c){if(!c._f){c._f=1;count(c)}});
  var ts=$$('[data-type]',el);if(el.hasAttribute('data-type'))ts.push(el);
  ts.forEach(function(c){if(!c._f){c._f=1;type(c)}});
}

/* reveal on scroll: only what starts below the first screen is held back */
$$('[data-rv-kids]').forEach(function(c){[].forEach.call(c.children,function(k,i){k.setAttribute('data-rv','');k.style.setProperty('--i',i%6)})});
var rv=$$('[data-rv]');
if(!RM&&'IntersectionObserver' in w){
  var vh0=w.innerHeight;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);fire(e.target)}
  })},{rootMargin:'0px 0px -7% 0px',threshold:.06});
  rv.forEach(function(el){if(el.getBoundingClientRect().top>vh0*.9)el.classList.add('pre');io.observe(el)});
}

/* drawings move with the scroll: data-mv="x,y" in drawing units */
$$('[data-mv]').forEach(function(g){
  if(RM) return;
  var v=g.getAttribute('data-mv').split(','),x=+v[0],y=+v[1];
  track(g.ownerSVGElement||g.parentElement,function(p){g.setAttribute('transform','translate('+((p-.5)*x).toFixed(1)+','+((p-.5)*y).toFixed(1)+')')});
});
/* photos drift inside their frame */
$$('.photo.par').forEach(function(f){
  if(RM) return; var im=$('img',f);
  track(f,function(p){im.style.transform='translate3d(0,'+((p-.5)*-14).toFixed(2)+'%,0)'});
});
/* html pieces: data-par="px" */
$$('[data-par]').forEach(function(el){
  if(RM) return; var k=+el.getAttribute('data-par');
  track(el.parentElement,function(p){el.style.transform='translate3d(0,'+((p-.5)*k).toFixed(1)+'px,0)'});
});

/* the Sprint course: the boat follows the route as you scroll */
$$('.course').forEach(function(svg){
  var path=$('.route',svg),trail=$('.trail',svg),boat=$('.cboat',svg),by=$$('.by',svg),sc=svg.closest('.course-scroll');
  if(!path||!path.getTotalLength) return;
  var L=path.getTotalLength(); svg.style.setProperty('--len',L);
  by.forEach(function(x){
    var xy=(x.getAttribute('data-xy')||'0,0').split(','),bx=+xy[0],byy=+xy[1],best=0,bd=1e12;
    for(var i=0;i<=400;i++){var q=path.getPointAtLength(L*i/400),dd=(q.x-bx)*(q.x-bx)+(q.y-byy)*(q.y-byy);if(dd<bd){bd=dd;best=i/400}}
    x.setAttribute('data-at',best);
  });
  function set(k){
    var a=path.getPointAtLength(L*k),b=path.getPointAtLength(Math.min(L,L*k+3)),ang=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI*.45;
    if(boat) boat.setAttribute('transform','translate('+a.x.toFixed(1)+','+a.y.toFixed(1)+') rotate('+ang.toFixed(1)+')');
    if(trail) trail.style.strokeDashoffset=(L*(1-k)).toFixed(1);
    by.forEach(function(x){x.classList.toggle('on',k>=parseFloat(x.getAttribute('data-at'))-.004)});
    if(sc&&sc.scrollWidth>sc.clientWidth+4) sc.scrollLeft=k*(sc.scrollWidth-sc.clientWidth);
  }
  if(RM){set(1);return}
  set(0); track(svg,function(p){set(clamp((p-.24)/.46))});
});

/* buoys on the waterline light up in turn */
$$('.wl-mid').forEach(function(m){
  var b=$$('.buoy',m); if(RM){return}
  track(m,function(p){var k=(p-.3)/.3;b.forEach(function(x,i){x.classList.toggle('on',k>=(i+.4)/b.length)})});
});

/* the three days: the sun crosses the sky */
$$('.days').forEach(function(el){
  var path=$('.arc-path',el),sun=$('.arc-sun',el),ds=$$('.day',el);
  if(!path||!path.getTotalLength) return; var L=path.getTotalLength();
  function set(k){var a=path.getPointAtLength(L*k);sun.setAttribute('transform','translate('+a.x.toFixed(1)+','+a.y.toFixed(1)+')');
    var n=Math.min(ds.length-1,Math.floor(k*ds.length));ds.forEach(function(x,i){x.classList.toggle('on',i===n)})}
  if(RM){set(.5);ds.forEach(function(x){x.classList.add('on')});return}
  set(0); track(el,function(p){set(clamp((p-.2)/.5))});
});

/* a line that draws itself as its section passes */
$$('[data-draw]').forEach(function(el){
  if(RM){el.style.setProperty('--k',1);return}
  track(el,function(p){el.style.setProperty('--k',clamp((p-.2)/.45).toFixed(3))});
});

/* the closing statement slides */
$$('.statement').forEach(function(s){
  var a=s.children[0],b=s.children[1]; if(RM||!a||!b) return;
  track(s,function(p){ if(w.innerWidth<641){a.style.transform=b.style.transform='';return}
    a.style.transform='translate3d('+((.62-p)*9).toFixed(2)+'%,0,0)'; b.style.transform='translate3d('+((p-.62)*9).toFixed(2)+'%,0,0)';});
});

/* water answers the pointer */
$$('.band.water,.scene-w,.wcard-down').forEach(function(el){
  var last=0; if(RM) return;
  el.addEventListener('pointermove',function(e){
    var n=Date.now(); if(n-last<190) return; last=n;
    var r=el.getBoundingClientRect(),s=d.createElement('span');
    s.className='ring'; s.style.left=(e.clientX-r.left)+'px'; s.style.top=(e.clientY-r.top)+'px';
    el.appendChild(s); setTimeout(function(){if(s.parentNode)s.parentNode.removeChild(s)},1700);
  });
});

/* who sees what: pick a viewer on small screens */
$$('.who-tabs').forEach(function(t){
  var who=d.getElementById(t.getAttribute('data-for'));
  t.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b||!who) return;
    who.setAttribute('data-view',b.getAttribute('data-v'));
    $$('button',t).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
  });
});

/* switches: data-switch buttons show one pane */
$$('[data-switch]').forEach(function(t){
  t.addEventListener('click',function(e){
    var b=e.target.closest('button'); if(!b) return;
    $$('button',t).forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    $$('[data-pane]',t.parentElement).forEach(function(p){p.hidden=p.getAttribute('data-pane')!==b.getAttribute('data-v')});
  });
});

/* copy a text */
$$('[data-copy]').forEach(function(b){
  b.addEventListener('click',function(){
    var src=$(b.getAttribute('data-copy')); if(!src) return; var txt=src.textContent.trim(),old=b.textContent;
    function ok(){b.textContent='Copied';setTimeout(function(){b.textContent=old},1800)}
    function sel(){var r=d.createRange();r.selectNodeContents(src);var s=w.getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected. Press copy';setTimeout(function(){b.textContent=old},2400)}
    try{navigator.clipboard.writeText(txt).then(ok,sel)}catch(e){sel()}
  });
});

/* the Check start screen sits in a frame; where a host refuses frames, the buttons still open it */
d.addEventListener('securitypolicyviolation',function(e){
  if(/frame/.test(e.violatedDirective||''))root.classList.add('no-frame');
});

/* forms: saved to the Cadence database, table site_forms (see site-src/forms.sql) */
var FORMS={on:true,url:'https://wtijzakthiovhnifdgrh.supabase.co/rest/v1/site_forms',key:'sb_publishable_wE4fJsvuRQ0_439LM0xZ9Q_rYgo7Fcv'};
$$('form[data-form]').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var s=d.getElementById(f.getAttribute('data-form')),bad=null;
    $$('[required]',f).forEach(function(i){
      var val=i.value.trim(),ok=!!val&&(i.type!=='email'||/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val));
      i.setAttribute('aria-invalid',ok?'false':'true'); if(!ok&&!bad)bad=i;
    });
    if(bad){bad.focus();return}
    function done(){if(s){f.hidden=true;s.hidden=false;s.setAttribute('tabindex','-1');s.focus()}}
    if(!FORMS.on){done();return}
    function v(n){var i=f.elements[n];return i&&i.value?String(i.value).trim():null}
    var b=f.querySelector('[type=submit]'); if(b)b.disabled=true;
    fetch(FORMS.url,{method:'POST',headers:{'Content-Type':'application/json',apikey:FORMS.key,Prefer:'return=minimal'},
      body:JSON.stringify({form:f.getAttribute('data-kind')||'contact',name:v('name'),email:v('email'),who:v('who'),fund:v('fund'),message:v('message'),page:location.pathname.slice(0,200)})})
      .then(function(r){if(!r.ok)throw new Error('not saved');done()})
      .catch(function(){if(b)b.disabled=false;var n=f.querySelector('.form-err');if(n)n.hidden=false});
  });
});

frame();
w.addEventListener('load',req);
})();
