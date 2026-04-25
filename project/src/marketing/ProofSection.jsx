/* global React, Eyebrow, Icon, Badge */

function ProofSection(){
  return (
    <section id="proof" className="m-section" style={{padding:"80px 32px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <Eyebrow>BEHIND THE PAYOUTS</Eyebrow>
        <h2 className="m-section-h2" style={{fontSize:44,fontWeight:600,letterSpacing:"-0.025em",color:"#FAFAF7",margin:"10px 0 48px",lineHeight:1.05,maxWidth:780}}>
          Run by a creator who's done this at scale —<br/><span style={{color:"#D4FF3A"}}>not a faceless agency.</span>
        </h2>

        <div className="m-proof-grid" style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:16,marginBottom:16}}>
          {/* Kevis card */}
          <div style={{background:"linear-gradient(180deg,#141414,#0E0E0E)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:28,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.08)"}}>
            <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:24}}>
              <div style={{width:72,height:72,borderRadius:999,background:"linear-gradient(135deg,#D4FF3A,#4ADE80)",display:"grid",placeItems:"center",color:"#0A0A0A",fontFamily:"Geist,sans-serif",fontSize:30,fontWeight:700}}>K</div>
              <div>
                <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",color:"#FAFAF7"}}>Kevis</div>
                <div style={{fontSize:14,color:"rgba(250,250,247,0.65)"}}>Founder · @KevisStrats · ViewMastery</div>
              </div>
            </div>
            <p style={{fontSize:17,color:"rgba(250,250,247,0.8)",lineHeight:1.5,margin:"0 0 24px"}}>
              "I've made over <span style={{color:"#D4FF3A",fontWeight:600}}>$300K from YouTube Shorts</span> running my own channels. I know exactly what clips work, what goes viral, and — most importantly — I know the money is real, because I'm paying you out of it."
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,paddingTop:20,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
              <KpiCell label="EARNED ON YOUTUBE" value="$300K+"/>
              <KpiCell label="SHORTS RUN" value="2,400+"/>
              <KpiCell label="YEARS RUNNING" value="3"/>
            </div>
            <div style={{display:"flex",gap:10,marginTop:22}}>
              <a href="https://youtube.com/@KevisStrats" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:999,fontSize:12,color:"rgba(250,250,247,0.85)",fontFamily:"Geist Mono,monospace",letterSpacing:"0.04em"}}>
                <Icon name="youtube" size={14}/> @KevisStrats
              </a>
              <a href="https://viewmastery.co" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"8px 12px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:999,fontSize:12,color:"rgba(250,250,247,0.85)",fontFamily:"Geist Mono,monospace",letterSpacing:"0.04em"}}>
                viewmastery.co
              </a>
            </div>
          </div>

          {/* Testimonials stack */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Testimonial name="Arjun · Mumbai" handle="@arjunclips" amount="$412.80" clips="18 clips · 412K views"
              body={"Got my first payout in under 2 weeks. They literally paid me through PayPal same Friday — was shook."} />
            <Testimonial name="Sofia · Manila" handle="@sofie.viral" amount="$328.00" clips="11 clips · 328K views"
              body={"Kevis actually replies on Discord. Most clipping programs ghost you. The briefs are super clear too."} />
            <Testimonial name="Daniel · Lagos" handle="@danthecutter" amount="$1,204.40" clips="64 clips · 1.2M views"
              body={"Been doing this 3 months. Cleared over a grand last month just from Rizz clips. My lane now."} emoji="🔥"/>
          </div>
        </div>
      </div>
    </section>
  );
}

function KpiCell({label,value}){
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(250,250,247,0.5)"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:20,fontWeight:500,color:"#FAFAF7",marginTop:4}}>{value}</div>
    </div>
  );
}

function Testimonial({name,handle,amount,clips,body,emoji}){
  return (
    <div style={{background:"#121212",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:20,boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:"#FAFAF7"}}>{name} {emoji}</div>
          <div style={{fontSize:11,color:"rgba(250,250,247,0.5)",fontFamily:"Geist Mono,monospace"}}>{handle} · {clips}</div>
        </div>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:16,fontWeight:500,color:"#D4FF3A"}}>{amount}</div>
      </div>
      <p style={{fontSize:14,color:"rgba(250,250,247,0.75)",lineHeight:1.5,margin:0}}>"{body}"</p>
    </div>
  );
}

window.ProofSection = ProofSection;
