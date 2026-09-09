(()=>{
const box=document.getElementById('suggestions');
if(!box)return;
function sync(){const t=document.getElementById('terminal');if(!t||!t.classList.contains('active'))box.style.display='none'}
sync();
new MutationObserver(sync).observe(document.body,{attributes:true,subtree:true,attributeFilter:['class','style']});
})();
