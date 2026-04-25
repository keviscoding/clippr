/* global React, Icon, Eyebrow, Badge, Button, api */
const { useState: useStateEO, useEffect: useEffectEO } = React;

function EarningsOverview({ onSubmit }){
  const [clips, setClips] = useStateEO([]);
  const [balance, setBalance] = useStateEO(null);
  const [payouts, setPayouts] = useStateEO([]);
  const [loading, setLoading] = useStateEO(true);

  useEffectEO(() => {
    let mounted = true;
    (async () => {
      const [c, b, p] = await Promise.all([api.listMyClips(), api.getMyBalance(), api.listMyPayouts()]);
      if (!mounted) return;
      setClips(c.error ? [] : c.data);
      setBalance(b.error ? null : b.data);
      setPayouts(p.error ? [] : p.data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const approved = clips.filter(c => c.status === "approved");
  const pending  = clips.filter(c => c.status === "pending");
  const totalViews = clips.reduce((s,c) => s + (c.views || 0), 0);
  const earnedThisWeek = approved
    .filter(c => c.reviewed_at && (Date.now() - new Date(c.reviewed_at).getTime()) < 7*86400_000)
    .reduce((s,c) => s + Number(c.earned||0), 0);
  const lifetimeEarned = approved.reduce((s,c) => s + Number(c.earned||0), 0);
  const available = balance ? Number(balance.available_balance) : 0;
  const profile_method = balance && balance.method;
  const lastPaid = payouts.find(p => p.status === "paid");
  const nextPayoutLine = available >= 20
    ? "Withdrawable now — request below"
    : `$${(20 - available).toFixed(2)} to your $20 cashout floor`;

  if (loading) return <LoadingPanel/>;

  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:20}}>
      <div className="clp-kpi-row" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <Kpi label="EARNED · LIFETIME" value={`$${lifetimeEarned.toFixed(2)}`} sub={earnedThisWeek > 0 ? `+$${earnedThisWeek.toFixed(2)} this week` : "Approved earnings"} positive/>
        <Kpi label="TOTAL VIEWS" value={totalViews.toLocaleString()} sub={`Across ${clips.length} clip${clips.length===1?"":"s"}`}/>
        <Kpi label="APPROVED CLIPS" value={`${approved.length} / ${clips.length}`} sub={pending.length > 0 ? `${pending.length} pending review` : "Up to date"}/>
        <Kpi label="AVAILABLE" value={`$${available.toFixed(2)}`} sub={nextPayoutLine}/>
      </div>

      <div className="clp-2col" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:12}}>
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"20px 22px",boxShadow:"0 1px 2px rgba(10,10,10,0.03)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:16}}>
            <div>
              <Eyebrow>EARNINGS · ROLLING</Eyebrow>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:32,fontWeight:500,marginTop:6,letterSpacing:"-0.01em"}}>${lifetimeEarned.toFixed(2)}</div>
            </div>
          </div>
          <EarningsChart clips={clips}/>
        </div>
        <div style={{background:"#0A0A0A",borderRadius:14,padding:"20px 22px",color:"#FAFAF7",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 100% 0%, rgba(212,255,58,0.22), transparent 55%)"}}/>
          <div style={{position:"relative"}}>
            <Eyebrow color="#D4FF3A">PAYOUT · NEXT FRIDAY</Eyebrow>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:40,fontWeight:500,marginTop:8,letterSpacing:"-0.02em"}}>${available.toFixed(2)}</div>
            <div style={{fontSize:13,color:"rgba(250,250,247,0.7)",marginTop:4}}>
              {available >= 20 ? "Available — request payout from the Payouts tab" : `Need $${(20-available).toFixed(2)} more to cash out`}
            </div>
            <div style={{display:"flex",gap:8,marginTop:20}}>
              <button onClick={onSubmit} style={{background:"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:10,padding:"10px 14px",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Submit a clip</button>
            </div>
          </div>
        </div>
      </div>

      {clips.length === 0 ? (
        <EmptyState onSubmit={onSubmit}/>
      ) : (
        <div className="clp-table-wrap" style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #F4F4F3"}}>
            <div style={{fontSize:16,fontWeight:600}}>My clips</div>
            <Button variant="ghost" size="sm" onClick={onSubmit} icon={<Icon name="plus" size={13}/>}>New</Button>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>
                {["URL","CAMPAIGN","STATUS","VIEWS","EARNED",""].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"10px 22px",fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"#6E6D66",fontWeight:500,borderBottom:"1px solid #F4F4F3",background:"#FAFAF7"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clips.slice(0,12).map((c,i) => {
                const last = i === Math.min(clips.length, 12) - 1;
                const camp = c.campaigns || {};
                const tone = c.status === "approved" ? "approved" : c.status === "rejected" ? "rejected" : "pending";
                const tint = camp.tint || "#6366f1";
                return (
                  <tr key={c.id}>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{width:36,height:48,borderRadius:8,background:`linear-gradient(135deg, ${tint}, #0a0a0a)`,flexShrink:0,position:"relative",overflow:"hidden",display:"grid",placeItems:"center",color:"#fff",opacity:0.95}}>
                          <Icon name={c.platform==="tiktok"?"tiktok":c.platform==="youtube"?"youtube":"play"} size={14}/>
                        </div>
                        <div style={{minWidth:0,maxWidth:380}}>
                          <a href={c.url} target="_blank" rel="noreferrer" style={{fontSize:13,fontFamily:"Geist Mono,monospace",color:"#0A0A0A",textDecoration:"none",display:"block",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{shortUrl(c.url)}</a>
                          <div style={{fontSize:11,color:"#6E6D66",fontFamily:"Geist Mono,monospace",marginTop:2}}>{c.platform || "other"} · {timeAgo(c.submitted_at)}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",fontSize:13}}>{camp.name || "—"}</td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3"}}>
                      <Badge tone={tone}>{c.status}</Badge>
                      {c.status === "rejected" && c.rejection_reason && (
                        <div style={{fontSize:11,color:"#B91C1C",marginTop:4,maxWidth:200}}>{c.rejection_reason}</div>
                      )}
                    </td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontVariantNumeric:"tabular-nums"}}>{(c.views||0).toLocaleString()}</td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontWeight:500,color: c.earned>0?"#047857":"#6E6D66"}}>{c.earned>0?`$${Number(c.earned).toFixed(2)}`:"—"}</td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",textAlign:"right"}}>
                      <a href={c.url} target="_blank" rel="noreferrer" style={{padding:6,background:"transparent",border:"none",cursor:"pointer",color:"#4A4A45",display:"inline-block"}}><Icon name="external" size={16}/></a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function shortUrl(u){
  try {
    const url = new URL(u);
    return url.hostname.replace(/^www\./,"") + url.pathname.slice(0, 36) + (url.pathname.length > 36 ? "…" : "");
  } catch { return u; }
}
function timeAgo(s){
  if (!s) return "";
  const ms = Date.now() - new Date(s).getTime();
  const m = Math.floor(ms/60000), h = Math.floor(m/60), d = Math.floor(h/24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
}

function Kpi({label,value,sub,positive}){
  return (
    <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"18px 20px",boxShadow:"0 1px 2px rgba(10,10,10,0.03)"}}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:28,fontWeight:500,letterSpacing:"-0.01em",marginTop:8,fontVariantNumeric:"tabular-nums"}}>{value}</div>
      <div style={{fontSize:12,marginTop:4,color:positive?"#047857":"#6E6D66",fontFamily:"Geist Mono,monospace"}}>{sub}</div>
    </div>
  );
}

function EarningsChart({clips}){
  const approvedSorted = (clips || []).filter(c => c.status === "approved" && c.reviewed_at).sort((a,b) => new Date(a.reviewed_at) - new Date(b.reviewed_at));
  let cum = 0;
  const pts = approvedSorted.map(c => { cum += Number(c.earned||0); return cum; });
  if (pts.length < 2) {
    pts.unshift(0); pts.push(0);
  }
  const max = Math.max(...pts, 1);
  const W = 640, H = 160;
  const step = W / (pts.length-1);
  const coords = pts.map((v,i) => [i*step, H - (v/max)*H*0.85 - 10]);
  const d = coords.map((c,i)=>`${i===0?"M":"L"}${c[0]} ${c[1]}`).join(" ");
  const area = d + ` L${W} ${H} L0 ${H} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="gfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4ADE80" stopOpacity="0.25"/>
          <stop offset="1" stopColor="#4ADE80" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#gfill)"/>
      <path d={d} stroke="#0A0A0A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {coords.length > 0 && <circle cx={coords[coords.length-1][0]} cy={coords[coords.length-1][1]} r="5" fill="#D4FF3A" stroke="#0A0A0A" strokeWidth="2"/>}
    </svg>
  );
}

function EmptyState({onSubmit}){
  return (
    <div style={{background:"#fff",border:"1px dashed #E8E6DF",borderRadius:14,padding:"48px 22px",textAlign:"center"}}>
      <div style={{fontSize:18,fontWeight:600,letterSpacing:"-0.01em",marginBottom:6}}>No clips yet — let's change that.</div>
      <div style={{fontSize:14,color:"#6E6D66",marginBottom:20,maxWidth:480,margin:"0 auto 20px"}}>Browse the live campaigns, grab the brief, and submit your first TikTok / Reels / Shorts URL. First clip past 1,000 views starts earning.</div>
      <button onClick={onSubmit} style={{display:"inline-flex",alignItems:"center",gap:8,background:"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:10,padding:"10px 16px",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:14,cursor:"pointer"}}>
        <Icon name="plus" size={15}/> Submit your first clip
      </button>
    </div>
  );
}

function LoadingPanel(){
  return <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div>;
}

window.EarningsOverview = EarningsOverview;
