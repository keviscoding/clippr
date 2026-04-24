/* global React, Icon, Eyebrow, Badge, Button */

function EarningsOverview({ clips }){
  const totalEarned = 1248.00;
  const totalViews = 1_240_812;
  const approvedClips = clips.filter(c=>c.status==="approved").length;

  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:20}}>
      {/* KPI row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <Kpi label="EARNED · THIS WEEK" value={`$${totalEarned.toFixed(2)}`} sub="+18.4% vs last week" positive/>
        <Kpi label="TOTAL VIEWS · 30D" value={totalViews.toLocaleString()} sub="Across 12 clips"/>
        <Kpi label="APPROVED CLIPS" value={`${approvedClips} / ${clips.length}`} sub="2 pending review"/>
        <Kpi label="AVG RPM" value="$1.00" sub="Rizz campaign"/>
      </div>

      {/* Chart + payout card */}
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:12}}>
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"20px 22px",boxShadow:"0 1px 2px rgba(10,10,10,0.03)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:16}}>
            <div>
              <Eyebrow>EARNINGS · 30 DAYS</Eyebrow>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:32,fontWeight:500,marginTop:6,letterSpacing:"-0.01em"}}>$3,842.00</div>
            </div>
            <div style={{display:"flex",gap:4,padding:3,background:"#F4F4F3",borderRadius:8}}>
              {["7D","30D","90D"].map((r,i)=>(
                <button key={r} style={{padding:"5px 10px",fontSize:12,fontWeight:600,fontFamily:"Geist Mono,monospace",border:"none",cursor:"pointer",background:i===1?"#fff":"transparent",color:i===1?"#0A0A0A":"#6E6D66",borderRadius:6,boxShadow:i===1?"0 1px 2px rgba(10,10,10,0.06)":"none"}}>{r}</button>
              ))}
            </div>
          </div>
          <EarningsChart/>
        </div>
        <div style={{background:"#0A0A0A",borderRadius:14,padding:"20px 22px",color:"#FAFAF7",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 100% 0%, rgba(212,255,58,0.22), transparent 55%)"}}/>
          <div style={{position:"relative"}}>
            <Eyebrow color="#D4FF3A">NEXT PAYOUT · FRI APR 26</Eyebrow>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:40,fontWeight:500,marginTop:8,letterSpacing:"-0.02em"}}>$148.20</div>
            <div style={{fontSize:13,color:"rgba(250,250,247,0.7)",marginTop:4}}>To kevis@mail.com · PayPal</div>
            <div style={{display:"flex",gap:8,marginTop:20}}>
              <button style={{background:"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:10,padding:"10px 14px",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Request early</button>
              <button style={{background:"rgba(255,255,255,0.08)",color:"#FAFAF7",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"10px 14px",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Change method</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent clips */}
      <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"16px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #F4F4F3"}}>
          <div style={{fontSize:16,fontWeight:600}}>Recent clips</div>
          <Button variant="ghost" size="sm">View all →</Button>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>
              {["CLIP","CAMPAIGN","STATUS","VIEWS","EARNED",""].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 22px",fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"#6E6D66",fontWeight:500,borderBottom:"1px solid #F4F4F3",background:"#FAFAF7"}}>{h}</th>
            ))}
            </tr>
          </thead>
          <tbody>
            {clips.slice(0,4).map((c,i) => (
              <tr key={i}>
                <td style={{padding:"14px 22px",borderBottom:i===3?"none":"1px solid #F4F4F3"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:40,height:56,borderRadius:8,background:c.thumb,flexShrink:0,position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",color:"#fff",opacity:0.9}}><Icon name="home" size={14}/></div>
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:500}}>{c.title}</div>
                      <div style={{fontSize:12,color:"#6E6D66",fontFamily:"Geist Mono,monospace"}}>{c.handle}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"14px 22px",borderBottom:i===3?"none":"1px solid #F4F4F3",fontSize:13}}>{c.campaign}</td>
                <td style={{padding:"14px 22px",borderBottom:i===3?"none":"1px solid #F4F4F3"}}><Badge tone={c.status}>{c.status}</Badge></td>
                <td style={{padding:"14px 22px",borderBottom:i===3?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontVariantNumeric:"tabular-nums"}}>{c.views.toLocaleString()}</td>
                <td style={{padding:"14px 22px",borderBottom:i===3?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontWeight:500,color: c.earned>0?"#047857":"#6E6D66"}}>{c.earned>0?`$${c.earned.toFixed(2)}`:"—"}</td>
                <td style={{padding:"14px 22px",borderBottom:i===3?"none":"1px solid #F4F4F3",textAlign:"right"}}>
                  <button style={{padding:6,background:"transparent",border:"none",cursor:"pointer",color:"#4A4A45"}}><Icon name="external" size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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

function EarningsChart(){
  // Lightweight SVG area chart
  const pts = [12,18,14,22,28,24,32,38,34,42,48,46,54,62,58,66,72,78,74,82,88,94,102,110,106,118,128,132,140,148];
  const max = Math.max(...pts);
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
      <circle cx={coords[coords.length-1][0]} cy={coords[coords.length-1][1]} r="5" fill="#D4FF3A" stroke="#0A0A0A" strokeWidth="2"/>
    </svg>
  );
}

window.EarningsOverview = EarningsOverview;
