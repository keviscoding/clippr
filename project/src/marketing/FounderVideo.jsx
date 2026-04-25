/* global React, Eyebrow, Icon, Button */

function FounderVideo(){
  return (
    <section id="founder-video" className="m-section" style={{padding:"80px 32px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div className="m-fv-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center"}}>
          <div>
            <Eyebrow>FROM THE FOUNDER</Eyebrow>
            <h2 className="m-section-h2" style={{fontSize:42,fontWeight:600,letterSpacing:"-0.025em",color:"#FAFAF7",margin:"10px 0 18px",lineHeight:1.05}}>
              Two minutes from me<br/><span style={{color:"#D4FF3A"}}>before you join.</span>
            </h2>
            <p style={{fontSize:16,color:"rgba(250,250,247,0.7)",lineHeight:1.6,margin:"0 0 24px",maxWidth:460}}>
              I'm Kevis. I made $300K+ from YouTube Shorts running my own channels. Now I'm running this campaign because I have apps to market and clipping is the cheapest way to do it. In this video I'll walk you through exactly what you'll be making, how the payouts work, and why I'm confident you can hit your first $100 in two weeks.
            </p>
            <ul style={{margin:"0 0 28px",padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
              {[
                "What a winning Rizz clip actually looks like",
                "How payouts hit your PayPal every Friday",
                "The exact format I want you to copy",
              ].map((line,i) => (
                <li key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:14,color:"rgba(250,250,247,0.85)"}}>
                  <span style={{width:18,height:18,borderRadius:999,background:"rgba(212,255,58,0.18)",color:"#D4FF3A",display:"grid",placeItems:"center",flexShrink:0}}><Icon name="check" size={12} stroke={2.5}/></span>
                  {line}
                </li>
              ))}
            </ul>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <a href="https://youtube.com/@KevisStrats" target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:999,fontSize:13,color:"rgba(250,250,247,0.85)",fontFamily:"Geist Mono,monospace",textDecoration:"none"}}>
                <Icon name="youtube" size={14}/> @KevisStrats
              </a>
              <a href="#" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 14px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:999,fontSize:13,color:"rgba(250,250,247,0.85)",fontFamily:"Geist Mono,monospace",textDecoration:"none"}}>
                <Icon name="external" size={13}/> Discord
              </a>
            </div>
          </div>

          {/* Video frame placeholder — swap with real <iframe> embed */}
          <div style={{position:"relative",aspectRatio:"16/10",borderRadius:18,overflow:"hidden",background:"linear-gradient(135deg,#1a1a1a,#0a0a0a)",border:"1px solid rgba(255,255,255,0.08)",boxShadow:"0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"}}>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 30%, rgba(212,255,58,0.18), transparent 55%)"}}/>
            {/* Avatar bubble */}
            <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}>
              <div style={{textAlign:"center"}}>
                <div style={{width:96,height:96,borderRadius:999,background:"linear-gradient(135deg,#D4FF3A,#4ADE80)",margin:"0 auto",display:"grid",placeItems:"center",color:"#0A0A0A",fontFamily:"Geist,sans-serif",fontSize:42,fontWeight:700,boxShadow:"0 16px 48px rgba(212,255,58,0.25)"}}>K</div>
                <div style={{marginTop:18,fontSize:13,color:"rgba(250,250,247,0.7)",fontFamily:"Geist Mono,monospace",letterSpacing:"0.06em"}}>KEVIS · FOUNDER</div>
              </div>
            </div>
            {/* Play button overlay */}
            <button style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:72,height:72,borderRadius:999,background:"#D4FF3A",border:"none",cursor:"pointer",display:"grid",placeItems:"center",boxShadow:"0 16px 48px rgba(212,255,58,0.4)"}}>
              <span style={{fontSize:24,color:"#0A0A0A",marginLeft:4}}>▶</span>
            </button>
            {/* Bottom info bar */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px 18px",background:"linear-gradient(transparent,rgba(0,0,0,0.7))",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,color:"#FAFAF7",fontWeight:500}}>How Clippr works (2 min)</div>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"rgba(250,250,247,0.7)",letterSpacing:"0.04em"}}>2:14</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.FounderVideo = FounderVideo;
