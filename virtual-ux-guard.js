(()=>{
const box=document.getElementById('suggestions'),term=document.getElementById('term'),input=document.getElementById('input');
if(!box||!term||!input)return;
function sync(){const t=document.getElementById('terminal');if(!t||!t.classList.contains('active'))box.style.display='none'}
sync();
new MutationObserver(sync).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class','style']});

// Never steal focus from a text selection.
term.addEventListener('mousedown',e=>{
  if(e.target!==input) return;
  e.stopPropagation();
},true);
term.addEventListener('click',e=>{
  const sel=window.getSelection&&window.getSelection();
  if(sel&&sel.toString()) return;
  if(e.target!==input) input.focus();
},true);

// Copy the complete browser selection as soon as the mouse selection ends.
// execCommand is deliberately attempted synchronously inside mouseup so it
// retains the browser's user-gesture permission for clipboard access.
function copySelectionNow(){
  const sel=window.getSelection&&window.getSelection();
  if(!sel||sel.rangeCount===0)return;
  const text=sel.toString();
  if(!text.trim())return;
  const node=sel.anchorNode;
  if(!node||!term.contains(node))return;
  if(node.parentElement&&node.parentElement.closest('.inputline'))return;
  let copied=false;
  try{
    const range=sel.getRangeAt(0);
    const holder=document.createElement('div');
    holder.style.position='fixed';holder.style.left='-99999px';holder.style.top='0';holder.style.whiteSpace='pre-wrap';
    holder.appendChild(range.cloneContents());
    document.body.appendChild(holder);
    const r=document.createRange();r.selectNodeContents(holder);
    sel.removeAllRanges();sel.addRange(r);
    copied=document.execCommand('copy');
    sel.removeAllRanges();sel.addRange(range);
    holder.remove();
  }catch(e){}
  if(!copied&&navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(text).then(()=>toast()).catch(()=>{});
  }else if(copied)toast();
}
function toast(){
  let t=document.getElementById('copyToast');
  if(!t){t=document.createElement('div');t.id='copyToast';t.textContent='Copied';document.body.appendChild(t)}
  t.className='incidentlab-copy-toast show';
  clearTimeout(window.__incidentlabCopyTimer);
  window.__incidentlabCopyTimer=setTimeout(()=>t.classList.remove('show'),900);
}
term.addEventListener('mouseup',copySelectionNow,true);
term.addEventListener('touchend',()=>setTimeout(copySelectionNow,50),{passive:true,capture:true});

// Input is part of normal terminal flow and can never cover output.
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
