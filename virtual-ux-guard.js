(()=>{
const box=document.getElementById('suggestions'),term=document.getElementById('term'),input=document.getElementById('input');
if(!box||!term||!input)return;
function sync(){const t=document.getElementById('terminal');if(!t||!t.classList.contains('active'))box.style.display='none'}
sync();
new MutationObserver(sync).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class','style']});

// Do not steal focus when the user is selecting terminal output for copy.
term.addEventListener('click',e=>{
  const selected=window.getSelection&&window.getSelection().toString();
  if(selected){e.stopImmediatePropagation();return}
  input.focus();
},true);

// Keep the prompt visible without covering the last lines of terminal output.
const style=document.createElement('style');
style.textContent=`
  .term{position:relative;padding-bottom:48px;overflow:auto;}
  .term .inputline{position:absolute;left:15px;right:15px;bottom:0;min-height:28px;padding:4px 0 2px;background:#06090c;z-index:3;}
  .term .inputline .inp{min-width:0;}
  .term ::selection{background:rgba(80,130,255,.35);color:#fff;}
`;
document.head.appendChild(style);
})();
