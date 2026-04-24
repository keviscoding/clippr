/* global React, Icon, Badge, Button, Eyebrow */
const { useState } = React;

function ReviewQueue(){
  const submissions = [
    {id:1, clipper:"Arjun M.", handle:"@rizz.clips.daily", country:"🇮🇳", campaign:"Rizz", url:"tiktok.com/@rizz…/7283", views:82194, posted:"2h ago", thumb:"linear-gradient(135deg,#6366f1,#ec4899)", title:"POV: texting her back like this"},
    {id:2, clipper:"Sofia R.", handle:"@sofie.viral",   country:"🇵🇭", campaign:"Rizz", url:"tiktok.com/@sofie…/8421", views:42800, posted:"3h ago", thumb:"linear-gradient(135deg,#3b82f6,#10b981)", title:"Stop texting 'hey' — try THIS"},
    {id:3, clipper:"Daniel O.", handle:"@danthecutter", country:"🇳🇬", campaign:"Rizz", url:"youtube.com/shorts/xR2…",  views:128000,posted:"5h ago", thumb:"linear-gradient(135deg,#f59e0b,#ef4444)", title:"Guys, use THIS reply for cold openers"},
  ];
  const [active, setActive] = useState(submissions[0]);
  return (
    <div style={{padding:"0",display:"grid",gridTemplateColumns:"360px 1fr",height:"calc(100vh - 64px)"}}>
      {/* List */}
      <div style={{borderRight:"1px solid #E8E6DF",overflow:"auto"}}>
        <div style={{padding:"18px 22px",borderBottom:"1px solid #E8E6DF",position:"sticky",top:0,background:"#FAFAF7",zIndex:1}}>
          <Eyebrow>QUEUE · 8 PENDING</Eyebrow>
          <div style={{fontSize:18,fontWeight:600,marginTop:4}}>Clips to review</div>
        </div>
        {submissions.map(s => (
          <button key={s.id} onClick={()=>setActive(s)} style={{width:"100%",display:"flex",gap:12,padding:"14px 22px",border:"none",background:active.id===s.id?"#fff":"transparent",borderBottom:"1px solid #F4F4F3",cursor:"pointer",textAlign:"left",borderLeft: active.id===s.id?"3px solid #D4FF3A":"3px solid transparent"}}>
            <div style={{width:44,height:60,borderRadius:8,background:s.thumb,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
                <div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div>
                <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,color:"#6E6D66",flexShrink:0}}>{s.posted}</span>
              </div>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66",marginTop:4}}>{s.country} {s.handle}</div>
              <div style={{marginTop:6,display:"flex",gap:6}}>
                <Badge tone="pending">PENDING</Badge>
                <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#0A0A0A",fontWeight:500}}>{s.views.toLocaleString()} views</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Detail */}
      <div style={{padding:28,overflow:"auto",background:"#FAFAF7"}}>
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:28,maxWidth:900}}>
          <div style={{width:220,aspectRatio:"9 / 16",borderRadius:18,background:active.thumb,position:"relative",overflow:"hidden",boxShadow:"0 12px 32px rgba(10,10,10,0.1)"}}>
            <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}>
              <div style={{width:48,height:48,borderRadius:999,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(10px)",display:"grid",placeItems:"center",color:"#fff"}}><Icon name="home" size={22}/></div>
            </div>
            <div style={{position:"absolute",bottom:14,left:14,right:14,color:"#fff",fontSize:13,fontWeight:600,lineHeight:1.15,textShadow:"0 2px 8px rgba(0,0,0,0.5)"}}>{active.title}</div>
          </div>
          <div>
            <Eyebrow>SUBMISSION · RIZZ</Eyebrow>
            <h2 style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",margin:"6px 0 4px"}}>{active.title}</h2>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:13,color:"#6E6D66"}}>{active.country} {active.handle} · posted {active.posted}</div>

            <div style={{marginTop:20,padding:"14px 16px",border:"1px solid #E8E6DF",borderRadius:10,background:"#fff",display:"flex",alignItems:"center",gap:10}}>
              <Icon name="link" size={16}/>
              <span style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"#0A0A0A",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{active.url}</span>
              <button style={{background:"transparent",border:"none",cursor:"pointer",color:"#4A4A45",padding:4}}><Icon name="external" size={16}/></button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:20}}>
              <Meta label="VIEWS" value={active.views.toLocaleString()}/>
              <Meta label="RPM" value="$1.00"/>
              <Meta label="WILL PAY" value={`$${(active.views/1000).toFixed(2)}`} accent/>
            </div>

            <div style={{marginTop:22,padding:"14px 16px",border:"1px solid #E8E6DF",borderRadius:10,background:"#fff"}}>
              <Eyebrow>CHECKLIST</Eyebrow>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
                {[
                  {ok:true, t:"Posted to public account"},
                  {ok:true, t:"Uses tracked caption + sound"},
                  {ok:true, t:"Hook within first 2s"},
                  {ok:false, t:"Download CTA visible — verify manually"},
                ].map((r,i) => (
                  <label key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:13}}>
                    <span style={{width:18,height:18,borderRadius:5,border:"1px solid #D1CFC6",background:r.ok?"#D4FF3A":"#fff",display:"grid",placeItems:"center",color:"#0A0A0A"}}>{r.ok && <Icon name="check" size={12} stroke={2.5}/>}</span>
                    <span style={{color:r.ok?"#0A0A0A":"#4A4A45"}}>{r.t}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{display:"flex",gap:8,marginTop:24}}>
              <Button variant="lime" size="lg" icon={<Icon name="check" size={15}/>}>Approve & pay</Button>
              <Button variant="ghost" size="lg">Request changes</Button>
              <Button variant="danger" size="lg">Reject</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({label,value,accent}){
  return (
    <div style={{padding:"12px 14px",border:"1px solid #E8E6DF",borderRadius:10,background:"#fff"}}>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:20,fontWeight:500,marginTop:4,color:accent?"#0A0A0A":"#0A0A0A",background:accent?"linear-gradient(90deg,#0A0A0A,#0A0A0A)":"none"}}>{value}</div>
    </div>
  );
}

window.ReviewQueue = ReviewQueue;
