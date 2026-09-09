(()=>{
const box=document.getElementById('suggestions'),term=document.getElementById('term'),input=document.getElementById('input');
if(!box||!term||!input)return;
function sync(){const t=document.getElementById('terminal');if(!t||!t.classList.contains('active'))box.style.display='none'}
sync();
new MutationObserver(sync).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class','style']});

// Keep normal text selection/copy behavior. Only focus the input when the click
// was not part of selecting terminal output.
term.addEventListener('click',e=>{
  const sel=window.getSelection&&window.getSelection();
  if(sel&&sel.toString())return;
  if(e.target!==input)input.focus();
},true);

// Selecting terminal output is enough to copy it; Ctrl+C is not required.
let copyTimer=null;
function copySelection(){
  const sel=window.getSelection&&window.getSelection();
  if(!sel)return;
  const text=sel.toString();
  if(!text.trim())return;
  const node=sel.anchorNode&&sel.anchorNode.parentElement;
  if(!node||!term.contains(node))return;
  if(node.closest('.inputline'))return;
  clearTimeout(copyTimer);
  const done=ok=>{
    if(ok){
      let toast=document.getElementById('copyToast');
      if(!toast){toast=document.createElement('div');toast.id='copyToast';toast.textContent='Copied';document.body.appendChild(toast)}
      toast.className='incidentlab-copy-toast show';
      copyTimer=setTimeout(()=>toast.classList.remove('show'),900);
    }
  };
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(text).then(()=>done(true)).catch(()=>{});
  }else{
    try{
      const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();done(true);
    }catch(e){}
  }
}
term.addEventListener('mouseup',()=>setTimeout(copySelection,0));
term.addEventListener('touchend',()=>setTimeout(copySelection,80),{passive:true});

// The input stays in normal document flow. It is the last terminal row, so it
// can never cover command output or make the scroll position appear stuck.
const style=document.createElement('style');
style.textContent=`
  .term{position:relative;overflow:auto;padding-bottom:15px;scroll-padding-bottom:15px;}
  .term .inputline{position:relative;left:auto;right:auto;bottom:auto;display:flex;min-height:28px;padding:4px 0 2px;margin-top:2px;background:#06090c;z-index:1;}
  .term .inputline .inp{min-width:0;}
  .term .line{user-select:text;-webkit-user-select:text;}
  .term .inputline,.term .inputline *{user-select:none;-webkit-user-select:none;}
  .term ::selection{background:rgba(80,130,255,.35);color:#fff;}
  .incidentlab-copy-toast{position:fixed;left:50%;bottom:22px;transform:translate(-50%,10px);padding:7px 12px;border:1px solid #26313d;border-radius:7px;background:#10151b;color:#dce4ec;font:12px ui-monospace,Consolas,monospace;opacity:0;pointer-events:none;transition:opacity .12s,transform .12s;z-index:50;}
  .incidentlab-copy-toast.show{opacity:1;transform:translate(-50%,0);}
`;
document.head.appendChild(style);
})();
