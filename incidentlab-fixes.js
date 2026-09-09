(function(){
const term=document.getElementById('term'),inp=document.getElementById('input'),box=document.querySelector('.suggestions'),list=document.getElementById('hints');
if(!term||!inp)return;
const run0=window.run,exec0=window.exec,tab0=window.tab;
let hintsShown=0;
const sets={start:['kubectl get pods -n production','kubectl get svc -n production','kubectl get events'],pods:['kubectl logs payment-api-7d8f6c9b7-2k9sx','kubectl describe pod payment-api-7d8f6c9b7-2k9sx'],logs:['kubectl get secret payment-db','kubectl describe deployment payment-api'],secret:['kubectl get secret payment-db -o yaml','kubectl edit secret payment-db'],restart:['kubectl get pods -n production','curl -i https://payment-api/health']};
const commands=()=>Array.from(term.querySelectorAll('.line')).map(x=>x.textContent||'').filter(x=>x.includes('$ '));
function set(){const h=commands();if(h.some(x=>/rollout restart/i.test(x)))return sets.restart;if(h.some(x=>/get secret payment-db|describe secret payment-db/i.test(x)))return sets.secret;if(h.some(x=>/kubectl logs payment-api/i.test(x)))return sets.logs;if(h.some(x=>/kubectl get pods/i.test(x)))return sets.pods;return sets.start}
function hide(){if(box)box.style.display='none';if(list)list.innerHTML='';hintsShown=0}
function show(){if(!box||!list)return;box.style.display='block';list.innerHTML='';const s=set(),b=document.createElement('button');b.className='btn';b.textContent=hintsShown?'💡 Get another hint':'💡 Get a hint';b.onclick=()=>{if(hintsShown<s.length){const c=document.createElement('button');c.className='btn';c.textContent=s[hintsShown++];c.onclick=()=>run0&&run0(c.textContent);list.insertBefore(c,b);b.textContent=hintsShown<s.length?'💡 Get another hint':'💡 No more hints';b.disabled=hintsShown>=s.length}};list.appendChild(b)}
hide();
if(tab0)window.tab=function(id){tab0(id);if(id==='terminal'){if(commands().length)show();else hide();setTimeout(()=>inp.focus(),0)}else hide()};
term.addEventListener('click',()=>inp.focus());
const st=document.createElement('style');st.textContent='.term .inputline{position:sticky;bottom:0;background:#06090c;padding-top:4px;z-index:2}.term{scroll-padding-bottom:40px}';document.head.appendChild(st);
if(run0)window.run=function(raw){run0(raw);show();inp.focus()};
if(exec0)window.exec=function(raw){
 const p=raw.match(/^(.*?)\s*\|\s*grep(?:\s+-i)?(?:\s+--color(?:=\w+)?)?\s+(.+)$/i);
 if(p){const base=p[1].trim(),gm=raw.match(/\|\s*grep(?:\s+-i)?(?:\s+--color(?:=\w+)?)?\s+(.+)$/i),pat=(gm?gm[1]:'').trim().replace(/^['"]|['"]$/g,''),ins=/\|\s*grep\s+-i\b/i.test(raw),before=new Set(Array.from(term.children));exec0(base);Array.from(term.children).filter(n=>!before.has(n)&&n.classList.contains('line')).forEach(n=>{const t=n.textContent||'',a=ins?t.toLowerCase():t,b=ins?pat.toLowerCase():pat;if(!a.includes(b))n.remove()});term.scrollTop=term.scrollHeight;return}
 const c=raw.trim().replace(/\s+/g,' '),lc=c.toLowerCase(),out=x=>{const d=document.createElement('div');d.className='line out';d.textContent=x;term.insertBefore(d,document.querySelector('.inputline'))};
 if(lc==='whoami'){out(localStorage.getItem('incidentlab_nickname')||'user');return}
 if(lc==='echo $path'){out('/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin');return}
 if(lc==='ls'){out('app  bin  etc  home  tmp  var');return}
 if(lc==='ls -l'||lc==='ls -la'){out('total 24');out('drwxr-xr-x 1 root root 4096 Sep  8 18:40 app');out('drwxr-xr-x 1 root root 4096 Sep  8 18:40 etc');return}
 if(lc==='lsblk'){out('NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT');out('vda      252:0    0   20G  0 disk');out('└─vda1   252:1    0   20G  0 part /');return}
 if(lc==='cat'){const d=document.createElement('div');d.className='line err';d.textContent='cat: missing operand';term.insertBefore(d,document.querySelector('.inputline'));return}
 if(lc==='sudo su -'){const d=document.createElement('div');d.className='line err';d.textContent='sudo: a password is required';term.insertBefore(d,document.querySelector('.inputline'));return}
 if(lc==='vi'||lc==='vim'){out('~');out('~  vi editor opened (training shell)');out('~  Use the dedicated Secret editor for kubectl edit.');return}
 exec0(raw)
};
})();
