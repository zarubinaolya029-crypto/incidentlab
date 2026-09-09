(()=>{
const box=document.getElementById('suggestions'),term=document.getElementById('term'),input=document.getElementById('input');
if(!box||!term||!input)return;
function sync(){const t=document.getElementById('terminal');if(!t||!t.classList.contains('active'))box.style.display='none'}
sync();
new MutationObserver(sync).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class','style']});

// Keep normal browser selection behavior. Only focus the input when the click
// is not part of a text selection.
term.addEventListener('click',e=>{
  const sel=window.getSelection&&window.getSelection();
  if(sel&&sel.toString())return;
  if(e.target!==input)input.focus();
},true);

// Copy the complete current selection after the drag/touch selection has
// finished. Using the Selection object itself preserves newlines across many
// terminal rows; there is no one-line extraction here.
let copyTimer=null;
function copySelection(){
  const sel=window.getSelection&&window.getSelection();
  if(!sel||sel.rangeCount===0)return;
  const text=sel.toString();
  if(!text.trim())return;
  const range=sel.getRangeAt(0);
  const root=range.commonAncestorContainer.nodeType===1?range.commonAncestorContainer:range.commonAncestorContainer.parentElement;
  if(!root||!term.contains(root))return;
  if(root.closest&&root.closest('.inputline'))return;
  clearTimeout(copyTimer);
  const done=ok=>{
    if(!ok)return;
    let toast=document.getElementById('copyToast');
    if(!toast){toast=document.createElement('div');toast.id='copyToast';toast.textContent='Copied';document.body.appendChild(toast)}
    toast.className='incidentlab-copy-toast show';
    copyTimer=setTimeout(()=>toast.classList.remove('show'),900);
  };
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(text).then(()=>done(true)).catch(()=>{});
  }else{
    try{
      const ta=document.createElement('textarea');
      ta.value=text;
      ta.setAttribute('readonly','');
      ta.style.position='fixed';ta.style.left='-9999px';ta.style.top='0';
      document.body.appendChild(ta);ta.select();
      const ok=document.execCommand('copy');ta.remove();done(ok);
    }catch(e){}
  }
}
function scheduleCopy(delay){setTimeout(copySelection,delay)}
// Listen on document as well as the terminal so selection ending at the edge
// of the scroll container is still captured.
document.addEventListener('mouseup',()=>scheduleCopy(20));
document.addEventListener('touchend',()=>scheduleCopy(120),{passive:true});

// The prompt remains an ordinary last row in the terminal flow. It never
// overlays or hides output above it.
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
