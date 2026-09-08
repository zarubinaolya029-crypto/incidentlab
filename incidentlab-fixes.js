(function(){
  const termEl=document.getElementById('term');
  const hintsEl=document.querySelector('.suggestions');
  const inputEl=document.getElementById('input');
  if(!termEl||!inputEl)return;

  if(hintsEl) hintsEl.style.display='none';

  const originalTab=window.tab;
  if(typeof originalTab==='function'){
    window.tab=function(id){
      originalTab(id);
      if(hintsEl) hintsEl.style.display=(id==='terminal' && history.length>0)?'block':'none';
      if(id==='terminal') setTimeout(()=>inputEl.focus(),0);
    };
  }

  termEl.style.position='relative';
  const style=document.createElement('style');
  style.textContent='.term .inputline{position:sticky;bottom:0;background:#06090c;padding-top:4px;z-index:2}.term{scroll-padding-bottom:36px}';
  document.head.appendChild(style);
  termEl.addEventListener('click',()=>inputEl.focus());

  const originalRun=window.run;
  if(typeof originalRun==='function'){
    window.run=function(raw){
      originalRun(raw);
      if(hintsEl && history.length>0 && document.getElementById('terminal').classList.contains('active')) hintsEl.style.display='block';
      inputEl.focus();
    };
  }

  const originalExec=window.exec;
  if(typeof originalExec==='function'){
    window.exec=function(raw){
      const m=raw.match(/^(.*?)\s*\|\s*grep(?:\s+-i)?\s+(.+)$/i);
      if(!m){ originalExec(raw); return; }
      const base=m[1].trim();
      const grepPart=raw.match(/\|\s*grep(?:\s+-i)?\s+(.+)$/i);
      const pattern=(grepPart?grepPart[1]:'').trim().replace(/^['"]|['"]$/g,'');
      const insensitive=/\|\s*grep\s+-i\b/i.test(raw);
      const before=Array.from(termEl.querySelectorAll('.line'));
      originalExec(base);
      const after=Array.from(termEl.querySelectorAll('.line'));
      const newLines=after.slice(before.length);
      const needle=insensitive?pattern.toLowerCase():pattern;
      newLines.forEach(node=>{
        const text=node.textContent||'';
        const hay=insensitive?text.toLowerCase():text;
        if(!hay.includes(needle)) node.remove();
      });
      termEl.scrollTop=termEl.scrollHeight;
    };
  }
})();
