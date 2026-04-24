/* global React, Icon, Badge, Button, Eyebrow */

function CampaignsList({ onSubmit }){
  const campaigns = [
    {name:"Rizz — AI dating replies", tag:"Dating · Lifestyle", rpm:1.00, min:10000, status:"joined", brief:"Hook within 2s. Use the 'POV: texting back' format. End with app download CTA + tracking link.", tint:"linear-gradient(135deg,#6366f1,#ec4899)"},
    {name:"Campaign slot #2", tag:"Launching soon", rpm:null, min:null, status:"soon", brief:"", tint:"linear-gradient(135deg,#2C2C2A,#1A1A18)"},
  ];
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <Eyebrow>CAMPAIGNS</Eyebrow>
          <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>What you're posting for</div>
        </div>
        <Button variant="primary" size="md" icon={<Icon name="plus" size={15}/>}>Browse all</Button>
      </div>
      {campaigns.map(c => (
        <div key={c.name} style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden",boxShadow:"0 1px 2px rgba(10,10,10,0.03)"}}>
          <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:0}}>
            <div style={{background:c.tint,display:"grid",placeItems:"center"}}>
              <div style={{width:52,height:52,borderRadius:12,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",display:"grid",placeItems:"center",color:"#fff"}}>
                <Icon name="flag" size={22} stroke={2}/>
              </div>
            </div>
            <div style={{padding:"18px 22px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                <div>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <h3 style={{fontSize:18,fontWeight:600,letterSpacing:"-0.015em",margin:0}}>{c.name}</h3>
                    {c.status==="joined" ? <Badge tone="live">JOINED</Badge> : <Badge tone="pending">COMING SOON</Badge>}
                  </div>
                  <div style={{fontSize:13,color:"#6E6D66",marginTop:4}}>{c.tag}</div>
                </div>
                {c.status==="joined" && <Button variant="lime" size="md" icon={<Icon name="arrow" size={14}/>} onClick={onSubmit}>Submit clip</Button>}
              </div>
              {c.brief && <p style={{fontSize:13,color:"#4A4A45",margin:"14px 0 0",lineHeight:1.55,maxWidth:680}}>{c.brief}</p>}
              <div style={{display:"flex",gap:28,marginTop:18,paddingTop:16,borderTop:"1px solid #F4F4F3"}}>
                <MiniStat label="RPM" value={c.rpm ? `$${c.rpm.toFixed(2)}` : "—"}/>
                <MiniStat label="MIN VIEWS" value={c.min ? c.min.toLocaleString() : "—"}/>
                <MiniStat label="YOUR VIEWS" value={c.status==="joined" ? "124,820" : "—"}/>
                <MiniStat label="YOUR EARNINGS" value={c.status==="joined" ? "$124.82" : "—"} positive/>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MiniStat({label,value,positive}){
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:16,fontWeight:500,marginTop:3,color:positive?"#047857":"#0A0A0A",fontVariantNumeric:"tabular-nums"}}>{value}</div>
    </div>
  );
}

window.CampaignsList = CampaignsList;
