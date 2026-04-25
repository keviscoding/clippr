/* global React, Eyebrow, Icon */

function HowItWorks(){
  const steps = [
    {n:"01", icon:"play", title:"Pick a campaign", body:"Browse live campaigns. Grab the brief, raw footage, and format inspo in one click."},
    {n:"02", icon:"upload", title:"Post to your account", body:"Cut clips in TikTok/CapCut. Post them to your accounts with the tracked caption and sound."},
    {n:"03", icon:"dollar", title:"Get paid Fridays", body:"Views roll in, earnings tick up. Request payouts to PayPal or bank — sent every Friday."},
  ];
  return (
    <section id="how-it-works" className="m-section" style={{padding:"80px 32px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <Eyebrow>HOW IT WORKS</Eyebrow>
        <h2 className="m-section-h2" style={{fontSize:44, fontWeight:600, letterSpacing:"-0.025em", color:"#FAFAF7", margin:"10px 0 48px", maxWidth:680, lineHeight:1.05}}>
          Three steps between you and <span style={{color:"#D4FF3A"}}>your first payout.</span>
        </h2>
        <div className="m-grid-3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {steps.map(s => (
            <div key={s.n} style={{background:"#121212",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:"28px 26px",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:36}}>
                <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,letterSpacing:"0.1em",color:"rgba(250,250,247,0.5)"}}>{s.n}</span>
                <div style={{width:38,height:38,borderRadius:10,background:"rgba(212,255,58,0.12)",display:"grid",placeItems:"center",color:"#D4FF3A"}}>
                  <Icon name={s.icon} size={20}/>
                </div>
              </div>
              <h3 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",color:"#FAFAF7",margin:"0 0 10px"}}>{s.title}</h3>
              <p style={{color:"rgba(250,250,247,0.65)",fontSize:15,lineHeight:1.55,margin:0}}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.HowItWorks = HowItWorks;
