(()=>{
  const term=document.getElementById('term');
  const input=document.getElementById('input');
  if(!term||!input)return;

  const style=document.createElement('style');
  style.textContent=`
    .term{
      padding-bottom:72px !important;
      scroll-padding-bottom:72px !important;
      -webkit-user-select:text !important;
      user-select:text !important;
    }
    .term .line,
    .term .out,
    .term .err,
    .term .ok,
    .term .warn{
      -webkit-user-select:text !important;
      user-select:text !important;
    }
    .term .inputline{
      min-height:28px;
      align-items:center;
      box-shadow:0 -8px 12px rgba(6,9,12,.55);
    }
    .term .inp{
      -webkit-user-select:text !important;
      user-select:text !important;
      min-width:0;
    }
  `;
  document.head.appendChild(style);

  // The main engine focuses the input on every terminal click. That breaks
  // normal browser text selection: after selecting log output, the click
  // bubbles to the terminal and moves focus back to the input, so Ctrl+C or
  // the mobile Copy action no longer targets the selected log text.
  // Stop that focus handler only when the user clicked actual output text.
  term.addEventListener('click',e=>{
    const line=e.target.closest('.line');
    if(line && !e.target.closest('.inputline')){
      e.stopImmediatePropagation();
    }
  },true);

  // Keep the command line focused when clicking empty terminal space, while
  // preserving selection when clicking/dragging over command output.
  term.addEventListener('click',e=>{
    if(!e.target.closest('.line')) input.focus();
  });
})();
