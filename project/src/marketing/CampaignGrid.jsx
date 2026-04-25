/* global React, Eyebrow, Badge, Icon, Button, api */
const { useState: useStateCG, useEffect: useEffectCG } = React;

const FALLBACK = [
  {name:"Rizz — AI dating replies", tag:"Dating · Lifestyle", rpm:1.00, min_views:1000, budget_remaining:24000, monthly_budget:25000, hot:true, tint:"#6366f1", status:"live"},
];

function CampaignGrid({ onJoin }){
  const [campaigns, setCampaigns] = useStateCG(FALLBACK);

  useEffectCG(() => {
    let mounted = true;
    api.listLiveCampaigns().then(r => {
      if (!mounted || r.error || !r.data) return;
      if (r.data.length > 0) setCampaigns(r.data);
    });
    return () => { mounted = false; };
  }, []);

  // Always show one "coming soon" tile after the live ones
  const display = [...campaigns, { soon: true, name: "Coming soon — Campaign #2", tag: "TBA", tint: "#2C2C2A" }];

  return (
    <section id="campaigns" className="m-section" style={{padding:"80px 32px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <div className="m-section-head" style={{display:"flex",justifyContent:"space-between",alignItems:"end",marginBottom:40}}>
          <div>
            <Eyebrow>LIVE CAMPAIGNS</Eyebrow>
            <h2 className="m-section-h2" style={{fontSize:44, fontWeight:600, letterSpacing:"-0.025em", color:"#FAFAF7", margin:"10px 0 0", lineHeight:1.05}}>Pick what you post.</h2>
          </div>
          <div style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"rgba(250,250,247,0.55)"}}>Updated live · {new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</div>
        </div>
        <div className="m-grid-2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
          {display.map((c,i) => (
            <div key={c.id || c.name || i} style={{background:"#121212",border:"1px solid rgba(255,255,255,0.08)",borderRadius:20,padding:0,overflow:"hidden",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)"}}>
              <div style={{height:140,background:`linear-gradient(135deg, ${c.tint||"#6366f1"}, #0a0a0a)`,position:"relative",display:"flex",alignItems:"flex-end",padding:18}}>
                {!c.soon && <div style={{position:"absolute",top:14,right:14}}><Badge tone="lime">🔥 HOT</Badge></div>}
                {!c.soon ? <Badge tone="live">LIVE</Badge> : <Badge tone="neutral">COMING SOON</Badge>}
              </div>
              <div className="m-camp-card-body" style={{padding:22}}>
                <h3 style={{fontSize:22,fontWeight:600,letterSpacing:"-0.02em",color:"#FAFAF7",margin:"0 0 4px"}}>{c.name}</h3>
                <div style={{fontSize:13,color:"rgba(250,250,247,0.55)",marginBottom:20}}>{c.tag}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
                  <MetaCell label="RPM" value={c.soon ? "—" : `$${Number(c.rpm).toFixed(2)}`} accent={!c.soon}/>
                  <MetaCell label="MIN VIEWS" value={c.soon ? "—" : (Number(c.min_views) >= 1000 ? `${Math.round(c.min_views/1000)}K` : String(c.min_views))}/>
                  <MetaCell label="BUDGET" value={c.soon ? "Launching soon" : `$${Number(c.budget_remaining||0).toLocaleString()}/mo`} small/>
                </div>
                <Button variant={c.soon?"secondary":"primary"} size="md" onClick={c.soon ? undefined : onJoin}>
                  {c.soon ? "Notify me" : "View brief"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MetaCell({label, value, accent, small}){
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(250,250,247,0.5)"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:small?13:18,fontWeight:500,color:accent?"#D4FF3A":"#FAFAF7",marginTop:4,fontVariantNumeric:"tabular-nums"}}>{value}</div>
    </div>
  );
}

window.CampaignGrid = CampaignGrid;
