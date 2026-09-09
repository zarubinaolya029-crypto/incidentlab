(function(){
const term=document.getElementById('term'),inp=document.getElementById('input'),box=document.querySelector('.suggestions'),list=document.getElementById('hints');
if(!term||!inp)return;
const run0=window.run,tab0=window.tab;
let hintIndex=0;
const sets={start:['kubectl get pods -n production','kubectl get svc -n production','kubectl get events'],pods:['kubectl logs payment-api-7d8f6c9b7-2k9sx','kubectl describe pod payment-api-7d8f6c9b7-2k9sx'],logs:['kubectl get secret payment-db','kubectl describe deployment payment-api'],secret:['kubectl get secret payment-db -o yaml','kubectl edit secret payment-db'],restart:['kubectl get pods -n production','curl -i https://payment-api/health']};
function cmds(){return Array.from(term.querySelectorAll('.line')).map(x=>x.textContent||'').filter(x=>x.includes('$ '))}
function set(){const h=cmds();if(h.some(x=>/rollout restart/i.test(x)))return sets.restart;if(h.some(x=>/get secret payment-db|describe secret payment-db/i.test(x)))return sets.secret;if(h.some(x=>/kubectl logs payment-api/i.test(x)))return sets.logs;if(h.some(x=>/kubectl get pods/i.test(x)))return sets.pods;return sets.start}
function hide(){if(box)box.style.display='none';if(list)list.innerHTML='';hintIndex=0}
function show(){if(!box||!list)return;box.style.display='block';list.innerHTML='';const s=set(),b=document.createElement('button');b.className='btn';b.textContent='💡 Get a hint';b.onclick=()=>{if(hintIndex<s.length){const c=document.createElement('button');c.className='btn';c.textContent=s[hintIndex++];c.onclick=()=>run0&&run0(c.textContent);list.insertBefore(c,b);b.textContent=hintIndex<s.length?'💡 Get another hint':'💡 No more hints';b.disabled=hintIndex>=s.length}};list.appendChild(b)}
hide();
if(tab0)window.tab=function(id){tab0(id);if(id==='terminal'){if(cmds().length)show();else hide();setTimeout(()=>inp.focus(),0)}else hide()};
term.addEventListener('click',()=>inp.focus());
const st=document.createElement('style');st.textContent='.term .inputline{position:sticky;bottom:0;background:#06090c;padding-top:4px;z-index:2}.term{scroll-padding-bottom:40px}';document.head.appendChild(st);
function out(text,cls='out'){const d=document.createElement('div');d.className='line '+cls;d.textContent=text;term.insertBefore(d,document.querySelector('.inputline'))}
if(run0)window.run=function(raw){
 const r=(raw||'').trim();if(!r)return;
 const before=new Set(Array.from(term.children));
 run0(r);
 const added=Array.from(term.children).filter(n=>!before.has(n)&&n.classList.contains('line')&&!n.querySelector('.prompt'));
 const pipe=r.match(/^(.*?)\s*\|\s*grep(?:\s+-i)?(?:\s+--color(?:=\w+)?)?\s+(.+)$/i);
 if(pipe){const gm=r.match(/\|\s*grep(?:\s+-i)?(?:\s+--color(?:=\w+)?)?\s+(.+)$/i),pat=(gm?gm[1]:'').trim().replace(/^['"]|['"]$/g,''),ins=/\|\s*grep\s+-i\b/i.test(r),needle=ins?pat.toLowerCase():pat;added.forEach(n=>{const t=n.textContent||'',hay=ins?t.toLowerCase():t;if(!hay.includes(needle))n.remove()});term.scrollTop=term.scrollHeight}
 const lc=r.toLowerCase().replace(/\s+/g,' ');
 const removeAdded=()=>added.forEach(n=>n.remove());
 if(lc==='whoami'){removeAdded();out(localStorage.getItem('incidentlab_nickname')||'user')}
 else if(lc==='echo $path'){removeAdded();out('/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin')}
 else if(lc==='ls'){removeAdded();out('app  bin  etc  home  tmp  var')}
 else if(lc==='ls -l'||lc==='ls -la'){removeAdded();out('total 24');out('drwxr-xr-x 1 root root 4096 Sep  8 18:40 app');out('drwxr-xr-x 1 root root 4096 Sep  8 18:40 etc')}
 else if(lc==='lsblk'){removeAdded();out('NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT');out('vda      252:0    0   20G  0 disk');out('└─vda1   252:1    0   20G  0 part /')}
 else if(lc==='cat'){removeAdded();out('cat: missing operand','err')}
 else if(lc==='sudo su -'){removeAdded();out('sudo: a password is required','err')}
 else if(lc==='vi'||lc==='vim'){removeAdded();out('~');out('~  vi editor opened (training shell)');out('~  Use the dedicated Secret editor for kubectl edit.')}
 if(box&&document.getElementById('terminal').classList.contains('active'))show();inp.focus();
};
})();
