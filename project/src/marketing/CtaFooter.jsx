/* global React, Button, Wordmark, Icon */

function CtaFooter({ onJoin }){
  return (
    <>
      <section style={{padding:"120px 32px",borderTop:"1px solid rgba(255,255,255,0.06)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 100%, rgba(212,255,58,0.22), transparent 55%)"}}/>
        <div style={{position:"relative",maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,letterSpacing:"0.12em",color:"#D4FF3A",textTransform:"uppercase",marginBottom:24}}>● APPLICATIONS OPEN</div>
          <h2 style={{fontSize:"clamp(48px, 7vw, 80px)",fontWeight:600,letterSpacing:"-0.035em",lineHeight:0.95,color:"#FAFAF7",margin:"0 0 24px"}}>
            Your first payout is<br/><span style={{color:"#D4FF3A"}}>two weeks away.</span>
          </h2>
          <p style={{fontSize:18,color:"rgba(250,250,247,0.7)",maxWidth:560,margin:"0 auto 40px",lineHeight:1.5}}>
            Apply takes 3 minutes. If you know how to post a TikTok, you're qualified.
          </p>
          <Button variant="primary" size="xl" pill onClick={onJoin} icon={<Icon name="arrow" size={16}/>}>Apply to clip for Payload</Button>
        </div>
      </section>

      <footer style={{padding:"40px 32px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
          <Wordmark/>
          <div style={{display:"flex",gap:24}}>
            {["Campaigns","How it works","Proof","Discord","Terms","Privacy"].map(l => (
              <a key={l} href="#" style={{fontSize:13,color:"rgba(250,250,247,0.6)"}}>{l}</a>
            ))}
          </div>
          <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"rgba(250,250,247,0.5)"}}>© 2026 Payload</div>
        </div>
      </footer>
    </>
  );
}

window.CtaFooter = CtaFooter;
