/* Experts: tabs. Plain JS, no library. Arrow keys, Home and End work. */
(function(){
  var root=document.getElementById('xs'); if(!root) return;
  var tabs=[].slice.call(root.querySelectorAll('[role=tab]'));
  function show(t,focus){
    tabs.forEach(function(x){
      var on=x===t;
      x.setAttribute('aria-selected',on?'true':'false');
      x.tabIndex=on?0:-1;
      var p=document.getElementById(x.getAttribute('aria-controls'));
      if(p) p.hidden=!on;
    });
    var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    t.scrollIntoView({inline:'center',block:'nearest',behavior:rm?'auto':'smooth'});
    var list=document.querySelector('#'+t.getAttribute('aria-controls')+' .xs-cards'); if(list) list.scrollLeft=0;
    if(focus) t.focus({preventScroll:true});
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){show(t,false)});
    t.addEventListener('keydown',function(e){
      var k=e.key,n=null;
      if(k==='ArrowRight') n=tabs[(i+1)%tabs.length];
      else if(k==='ArrowLeft') n=tabs[(i-1+tabs.length)%tabs.length];
      else if(k==='Home') n=tabs[0];
      else if(k==='End') n=tabs[tabs.length-1];
      if(n){e.preventDefault();show(n,true)}
    });
  });
})();
