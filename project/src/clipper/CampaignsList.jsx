/* global React, Icon, Badge, Button, Eyebrow, api */
const { useState: useStateCL, useEffect: useEffectCL } = React;

function CampaignsList({ onSubmit, onOpenBrief }){
  const [campaigns, setCampaigns] = useStateCL([]);
  const [myClips, setMyClips] = useStateCL([]);
  const [loading, setLoading] = useStateCL(true);

  useEffectCL(() => {
    let mounted = true;
    (async () => {
      const [c, m] = await Promise.all([api.listLiveCampaigns(), api.listMyClips()]);
      if (!mounted) return;
      setCampaigns(c.error ? [] : c.data);
      setMyClips(m.error ? [] : m.data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div>;

  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <Eyebrow>CAMPAIGNS</Eyebrow>
          <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>What you can post for</div>
        </div>
      </div>

      {campaigns.length === 0 && (
        <div style={{background:"#fff",border:"1px dashed #E8E6DF",borderRadius:14,padding:32,textAlign:"center",color:"#6E6D66",fontSize:14}}>
          No live campaigns right now. Check back soon — Discord gets pinged when new ones launch.
        </div>
      )}

      {campaigns.map(c => {
        const myForC = myClips.filter(x => x.campaign_id === c.id);
        const myViews = myForC.reduce((s,x) => s + (x.views||0), 0);
        const myEarned = myForC.filter(x => x.status==="approved").reduce((s,x) => s + Number(x.earned||0), 0);
        return (
          <div key={c.id} className="clp-camp-card" style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 2px rgba(10,10,10,0.03)"}}>
            <div className="clp-camp-card-grid" style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:0}}>
              <div className="clp-camp-card-tint" style={{background:`linear-gradient(135deg, ${c.tint || "#6366f1"}, #1a1a1a)`,display:"grid",placeItems:"center",minHeight:120}}>
                <div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",display:"grid",placeItems:"center",color:"#fff"}}>
                  <Icon name="flag" size={22} stroke={2}/>
                </div>
              </div>
              <div className="clp-camp-card-body" style={{padding:"18px 22px"}}>
                <div className="clp-camp-card-head" style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:12,flexWrap:"wrap"}}>
                  <div style={{minWidth:0}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                      <h3 style={{fontSize:18,fontWeight:600,letterSpacing:"-0.015em",margin:0}}>{c.name}</h3>
                      <Badge tone="live">LIVE</Badge>
                    </div>
                    <div style={{fontSize:13,color:"#6E6D66",marginTop:4}}>{c.tag}</div>
                  </div>
                  <div className="clp-camp-card-cta" style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <Button variant="ghost" size="md" onClick={() => onOpenBrief && onOpenBrief(c)}>View brief</Button>
                    <Button variant="lime" size="md" icon={<Icon name="arrow" size={14}/>} onClick={() => onSubmit && onSubmit(c)}>Submit clip</Button>
                  </div>
                </div>
                {c.brief_md && <p className="clp-camp-card-brief" style={{fontSize:13,color:"#4A4A45",margin:"14px 0 0",lineHeight:1.55,maxWidth:680}}>{c.brief_md}</p>}
                <div className="clp-camp-card-stats" style={{display:"flex",gap:28,marginTop:18,paddingTop:16,borderTop:"1px solid #F4F4F3",flexWrap:"wrap"}}>
                  <MiniStat label="RPM" value={`$${Number(c.rpm).toFixed(2)}`}/>
                  <MiniStat label="MIN VIEWS" value={(c.min_views||0).toLocaleString()}/>
                  <MiniStat className="hide-mobile" label="YOUR CLIPS" value={myForC.length.toString()}/>
                  <MiniStat className="hide-mobile" label="YOUR VIEWS" value={myViews.toLocaleString()}/>
                  <MiniStat label="YOUR EARNINGS" value={`$${myEarned.toFixed(2)}`} positive/>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniStat({label,value,positive,className}){
  return (
    <div className={className}>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:16,fontWeight:500,marginTop:3,color:positive?"#047857":"#0A0A0A",fontVariantNumeric:"tabular-nums"}}>{value}</div>
    </div>
  );
}

window.CampaignsList = CampaignsList;
