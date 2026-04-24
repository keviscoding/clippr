/* global React */

function PayoutTicker(){
  const payouts = [
    {name:"Arjun M.", amount:"$148.20", flag:"🇮🇳"},
    {name:"Sofia R.", amount:"$62.40", flag:"🇵🇭"},
    {name:"Daniel O.", amount:"$204.00", flag:"🇳🇬"},
    {name:"Luis G.", amount:"$96.80", flag:"🇲🇽"},
    {name:"Thanh P.", amount:"$132.00", flag:"🇻🇳"},
    {name:"Mo H.", amount:"$48.00", flag:"🇲🇦"},
    {name:"Zara K.", amount:"$218.60", flag:"🇵🇰"},
    {name:"Juan C.", amount:"$74.20", flag:"🇨🇴"},
  ];
  const full = [...payouts, ...payouts];
  return (
    <section style={{padding:"28px 0",borderTop:"1px solid rgba(255,255,255,0.06)",borderBottom:"1px solid rgba(255,255,255,0.06)",overflow:"hidden",position:"relative"}}>
      <style>{`
        @keyframes scrollX { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
      {/* mask edges */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(90deg, #0a0a0a 0%, transparent 8%, transparent 92%, #0a0a0a 100%)",zIndex:2}}/>
      <div style={{display:"flex",gap:14,width:"max-content",animation:"scrollX 40s linear infinite"}}>
        {full.map((p,i) => (
          <div key={i} style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 14px",background:"#121212",border:"1px solid rgba(255,255,255,0.08)",borderRadius:999,flexShrink:0}}>
            <span style={{fontSize:16}}>{p.flag}</span>
            <span style={{fontSize:13,color:"#FAFAF7"}}>{p.name}</span>
            <span style={{fontFamily:"Geist Mono,monospace",fontSize:13,color:"#D4FF3A",fontWeight:500}}>{p.amount}</span>
            <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,color:"rgba(250,250,247,0.4)",letterSpacing:"0.08em",textTransform:"uppercase"}}>PAID</span>
          </div>
        ))}
      </div>
    </section>
  );
}

window.PayoutTicker = PayoutTicker;
