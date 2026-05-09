/* global React, Eyebrow, Button, Badge, PhoneFrame, Icon */
const { useEffect, useState } = React;

const HERO_VARIANTS = {
  "clip-post-paid":   { line1:"Clip. Post.",         line2:"Get paid." },
  "turn-views-cash":  { line1:"Turn views",          line2:"into cash." },
  "first-payout-2w":  { line1:"First payout,",       line2:"two weeks out." },
};

function Hero({ onJoin, variant="clip-post-paid", siteConfig }) {
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
    <section className="m-hero" style={{position:"relative", padding:"56px 32px 80px", overflow:"hidden"}}>
      {/* Lime radial spotlight */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% -10%, rgba(212,255,58,0.22), transparent 55%)",pointerEvents:"none"}}/>
      {/* Grain */}
      <div style={{position:"absolute",inset:0,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.07 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",opacity:0.5,mixBlendMode:"screen",pointerEvents:"none"}}/>

      <div style={{position:"relative",maxWidth:1200,margin:"0 auto"}}>
        <div className="m-hero-grid" style={{display:"grid", gridTemplateColumns:"1.3fr 1fr", gap:48, alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 12px 6px 6px",border:"1px solid rgba(255,255,255,0.1)",borderRadius:999,background:"rgba(255,255,255,0.03)",marginBottom:24}}>
              <span style={{background:"#D4FF3A",color:"#0A0A0A",fontFamily:"Geist Mono,monospace",fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:999,letterSpacing:"0.06em"}}>LIVE</span>
              <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"rgba(250,250,247,0.7)",letterSpacing:"0.04em"}}>RIZZ · $1.00 RPM · payouts Fridays</span>
            </div>
            <h1 className="m-hero-h1" style={{fontSize:"clamp(56px, 7.2vw, 96px)", fontWeight:600, lineHeight:0.92, letterSpacing:"-0.035em", margin:0, color:"#FAFAF7"}}>
              {v.line1}<br/>
              <span style={{color:"#D4FF3A"}}>{v.line2}</span>
            </h1>
            <p className="m-hero-sub" style={{fontSize:18, color:"rgba(250,250,247,0.72)", marginTop:20, maxWidth:480, lineHeight:1.5}}>
              Real campaigns from real apps. Post to your TikTok, track your views, get paid every Friday. Cash out from $20 — no contracts, no gatekeeping.
            </p>
            <div className="m-hero-cta-row" style={{display:"flex",gap:10,marginTop:32,alignItems:"center"}}>
              <Button variant="primary" size="xl" pill onClick={onJoin} icon={<Icon name="arrow" size={16}/>}>Start earning</Button>
              <Button variant="ghostDark" size="xl">Watch 60-sec demo</Button>
            </div>
            <div className="m-hero-stats" style={{display:"flex", gap:40, marginTop:48}}>
              <Stat label="VIEWS DELIVERED" value={views.toLocaleString()}/>
              <Stat label="PAID TO CLIPPERS" value={"$" + paid.toLocaleString()}/>
              <Stat label="ACTIVE CLIPPERS" value="412"/>
            </div>
          </div>

          {/* Phone with clip preview */}
          <div className="m-hero-phone-wrap" style={{display:"grid",placeItems:"center",position:"relative"}}>
            <div style={{position:"absolute", top:20, right:-20, padding:"10px 14px", background:"#121212", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, boxShadow:"0 12px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)", transform:"rotate(4deg)", zIndex:3}}>
              <div style={{fontFamily:"Geist Mono,monospace", fontSize:10, color:"rgba(250,250,247,0.55)", letterSpacing:"0.08em"}}>PAID TODAY</div>
              <div style={{fontFamily:"Geist Mono,monospace", fontSize:22, fontWeight:500, color:"#D4FF3A"}}>+$148.20</div>
            </div>
            <PhoneFrame width={260}>
              <HeroPhoneContent siteConfig={siteConfig}/>
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

function HeroPhoneContent({ siteConfig }){
  const DEFAULT_REEL = "DTky3WTAj0X";
  const heroUrl = (siteConfig && siteConfig.hero_video_url) || null;
  const shortcode = heroUrl ? api.instagramShortcode(heroUrl) : DEFAULT_REEL;
  const reelLink = heroUrl || ("https://www.instagram.com/reel/" + DEFAULT_REEL + "/");

  if (!shortcode) {
    return <div style={{width:"100%",height:"100%",background:"#0A0A0A",display:"grid",placeItems:"center",color:"rgba(255,255,255,0.4)",fontSize:11,fontFamily:"Geist Mono,monospace",textAlign:"center",padding:12}}>No video set</div>;
  }

  return (
    <div style={{width:"100%",height:"100%",position:"relative",background:"#000",overflow:"hidden"}}>
      <iframe
        src={`https://www.instagram.com/reel/${shortcode}/embed/?cr=1&v=14`}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}
        loading="lazy"
        allowFullScreen
        allow="autoplay; encrypted-media"
      />
      <a href={reelLink} target="_blank" rel="noreferrer"
         style={{position:"absolute",top:8,right:8,zIndex:2,width:28,height:28,borderRadius:999,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",cursor:"pointer",textDecoration:"none",border:"1px solid rgba(255,255,255,0.15)"}}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10M7 17 17 7"/></svg>
      </a>
    </div>
  );
}

window.Hero = Hero;
