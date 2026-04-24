/* global React, Eyebrow, Button, Badge, PhoneFrame, Icon */
const { useEffect, useState } = React;

const HERO_VARIANTS = {
  "clip-post-paid":   { line1:"Clip. Post.",         line2:"Get paid." },
  "turn-views-cash":  { line1:"Turn views",          line2:"into cash." },
  "first-payout-2w":  { line1:"First payout,",       line2:"two weeks out." },
};

function Hero({ onJoin, variant="clip-post-paid" }) {
  const v = HERO_VARIANTS[variant] || HERO_VARIANTS["clip-post-paid"];
  const [views, setViews] = useState(0);
  const [paid, setPaid] = useState(0);
  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 1;
      setViews(Math.min(12_482_190, Math.round(12_482_190 * t / 40)));
      setPaid(Math.min(148_284, Math.round(148_284 * t / 40)));
      if (t > 40) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{position:"relative", padding:"56px 32px 80px", overflow:"hidden"}}>
      {/* Lime radial spotlight */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% -10%, rgba(212,255,58,0.22), transparent 55%)",pointerEvents:"none"}}/>
      {/* Grain */}
      <div style={{position:"absolute",inset:0,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",opacity:0.5,mixBlendMode:"screen",pointerEvents:"none"}}/>

      <div style={{position:"relative",maxWidth:1200,margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:48, alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 12px 6px 6px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:999,background:"rgba(255,255,255,0.03)",marginBottom:24}}>
              <span style={{background:"#D4FF3A",color:"#0A0A0A",fontFamily:"Geist Mono,monospace",fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:999,letterSpacing:"0.06em"}}>LIVE</span>
              <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"rgba(250,250,247,0.7)",letterSpacing:"0.04em"}}>RIZZ · $1.00 RPM · payouts Fridays</span>
            </div>
            <h1 style={{fontSize:"clamp(56px, 7.2vw, 96px)", fontWeight:600, lineHeight:0.92, letterSpacing:"-0.035em", margin:0, color:"#FAFAF7"}}>
              {v.line1}<br/>
              <span style={{color:"#D4FF3A"}}>{v.line2}</span>
            </h1>
            <p style={{fontSize:18, color:"rgba(250,250,247,0.72)", marginTop:20, maxWidth:480, lineHeight:1.5}}>
              Real campaigns from real apps. Post to your TikTok, track your views, get paid every Friday. Cash out from $20 — no contracts, no gatekeeping.
            </p>
            <div style={{display:"flex",gap:10,marginTop:32,alignItems:"center"}}>
              <Button variant="primary" size="xl" pill onClick={onJoin} icon={<Icon name="arrow" size={16}/>}>Start earning</Button>
              <Button variant="ghostDark" size="xl">Watch 60-sec demo</Button>
            </div>
            <div style={{display:"flex", gap:40, marginTop:48}}>
              <Stat label="VIEWS DELIVERED" value={views.toLocaleString()}/>
              <Stat label="PAID TO CLIPPERS" value={"$" + paid.toLocaleString()}/>
              <Stat label="ACTIVE CLIPPERS" value="412"/>
            </div>
          </div>

          {/* Phone with clip preview */}
          <div style={{display:"grid",placeItems:"center",position:"relative"}}>
            <div style={{position:"absolute", top:20, right:-20, padding:"10px 14px", background:"#121212", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, boxShadow:"0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", transform:"rotate(4deg)", zIndex:3}}>
              <div style={{fontFamily:"Geist Mono,monospace", fontSize:10, color:"rgba(250,250,247,0.55)", letterSpacing:"0.08em"}}>PAID TODAY</div>
              <div style={{fontFamily:"Geist Mono,monospace", fontSize:22, fontWeight:500, color:"#D4FF3A"}}>+$148.20</div>
            </div>
            <PhoneFrame width={260}>
              <FakeClip/>
            </PhoneFrame>
            <div style={{position:"absolute", bottom:40, left:-24, padding:"10px 14px", background:"#121212", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, boxShadow:"0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", transform:"rotate(-4deg)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:6,height:6,borderRadius:999,background:"#4ADE80"}}/>
                <div style={{fontFamily:"Geist Mono,monospace", fontSize:10, color:"rgba(250,250,247,0.55)", letterSpacing:"0.08em"}}>VIEWS · LAST 24H</div>
              </div>
              <div style={{fontFamily:"Geist Mono,monospace", fontSize:20, fontWeight:500, color:"#FAFAF7"}}>84,102</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({label, value}) {
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",color:"rgba(250,250,247,0.5)"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:22,fontWeight:500,color:"#FAFAF7",marginTop:4,fontVariantNumeric:"tabular-nums"}}>{value}</div>
    </div>
  );
}

function FakeClip(){
  return (
    <div style={{width:"100%",height:"100%",background:"linear-gradient(180deg,#1a1f2e,#0a0f1a)",position:"relative",color:"#fff"}}>
      {/* Top info */}
      <div style={{position:"absolute",top:14,left:10,right:10,display:"flex",justifyContent:"space-between",fontFamily:"Geist Mono,monospace",fontSize:10,color:"rgba(255,255,255,0.8)",letterSpacing:"0.06em"}}>
        <span>9:41</span><span>●●●</span>
      </div>
      {/* Chat bubbles */}
      <div style={{position:"absolute",top:60,left:12,right:12,display:"flex",flexDirection:"column",gap:6}}>
        <div style={{alignSelf:"flex-start",background:"#2a2d36",borderRadius:"14px 14px 14px 4px",padding:"8px 10px",fontSize:11,maxWidth:"75%"}}>hey so like what u up to</div>
        <div style={{alignSelf:"flex-end",background:"#3B82F6",color:"#fff",borderRadius:"14px 14px 4px 14px",padding:"8px 10px",fontSize:11,maxWidth:"75%"}}>just left the gym 🥵 u?</div>
        <div style={{alignSelf:"flex-start",background:"#2a2d36",borderRadius:"14px 14px 14px 4px",padding:"8px 10px",fontSize:11,maxWidth:"75%"}}>omg same i'm bored</div>
      </div>
      {/* AI reply panel */}
      <div style={{position:"absolute",left:10,right:10,bottom:92,background:"rgba(255,255,255,0.08)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.16)",borderRadius:12,padding:"8px 10px"}}>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:9,color:"#D4FF3A",letterSpacing:"0.1em",marginBottom:3}}>✦ SMOOTH REPLY</div>
        <div style={{fontSize:11,lineHeight:1.4}}>"bored together? pull up to the bean spot at 7, my treat"</div>
      </div>
      {/* Caption overlay */}
      <div style={{position:"absolute",left:10,right:40,bottom:40,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,0.8)"}}>
        <div style={{fontFamily:"Geist,sans-serif",fontWeight:700,fontSize:15,lineHeight:1.1}}>POV: you text<br/>back like THIS →</div>
      </div>
      {/* Right actions rail */}
      <div style={{position:"absolute",right:8,bottom:46,display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
        {[{i:"❤",t:"128K"},{i:"💬",t:"2.4K"},{i:"↗",t:"18K"}].map((x,i)=>(
          <div key={i} style={{textAlign:"center",fontSize:10,fontFamily:"Geist Mono,monospace"}}>
            <div style={{fontSize:18}}>{x.i}</div>
            <div>{x.t}</div>
          </div>
        ))}
      </div>
      {/* Bottom bar */}
      <div style={{position:"absolute",bottom:8,left:8,right:8,display:"flex",alignItems:"center",gap:8,fontSize:10}}>
        <div style={{width:22,height:22,borderRadius:999,background:"#D4FF3A"}}/>
        <div>@rizz.clips.daily</div>
      </div>
    </div>
  );
}

window.Hero = Hero;
