/* global React, Icon, Eyebrow, Badge, Button */
const { useState } = React;

function CampaignEditor(){
  const [rpm, setRpm] = useState(1.00);
  const [budget, setBudget] = useState(24000);
  const [minViews, setMinViews] = useState(10000);
  return (
    <div style={{padding:28,display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,maxWidth:1200}}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:18}}>
            <div>
              <Eyebrow>CAMPAIGN · EDIT</Eyebrow>
              <div style={{fontSize:22,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>Rizz — AI dating replies</div>
            </div>
            <Badge tone="live">LIVE</Badge>
          </div>
          <Field label="NAME" value="Rizz — AI dating replies"/>
          <Field label="CATEGORY" value="Dating · Lifestyle"/>
          <Field label="BRIEF" value="Hook within 2s. 'POV: texting back' format. Include tracked caption + app CTA." multi/>
        </div>

        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:24}}>
          <Eyebrow>ECONOMICS</Eyebrow>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:16}}>
            <NumInput label="RPM (rate per 1,000 views)" prefix="$" value={rpm.toFixed(2)} onChange={v=>setRpm(parseFloat(v)||0)}/>
            <NumInput label="WEEKLY BUDGET" prefix="$" value={budget.toLocaleString()} onChange={v=>setBudget(parseFloat(v.replace(/,/g,""))||0)}/>
            <NumInput label="MIN VIEWS TO QUALIFY" value={minViews.toLocaleString()} onChange={v=>setMinViews(parseFloat(v.replace(/,/g,""))||0)}/>
            <NumInput label="MAX PAY PER CLIP" prefix="$" value="250.00"/>
          </div>
          <div style={{marginTop:16,padding:"12px 14px",background:"#F4F4F3",borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"#6E6D66"}}>PROJECTED</div>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:16,fontWeight:500,marginTop:2}}>{Math.floor(budget/rpm*1000).toLocaleString()} views / week</div>
            </div>
            <Button variant="primary" size="md">Save changes</Button>
          </div>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"#0A0A0A",color:"#FAFAF7",borderRadius:14,padding:22,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 100% 0%, rgba(212,255,58,0.22), transparent 55%)"}}/>
          <div style={{position:"relative"}}>
            <Eyebrow color="#D4FF3A">BUDGET · THIS WEEK</Eyebrow>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:28,fontWeight:500,marginTop:8}}>$16,412 <span style={{color:"rgba(250,250,247,0.5)",fontSize:16}}> / ${budget.toLocaleString()}</span></div>
            <div style={{height:8,background:"rgba(255,255,255,0.08)",borderRadius:999,marginTop:14,overflow:"hidden"}}>
              <div style={{width:"68%",height:"100%",background:"#D4FF3A"}}/>
            </div>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"rgba(250,250,247,0.6)",marginTop:8,display:"flex",justifyContent:"space-between"}}>
              <span>68% spent</span><span>3 days left</span>
            </div>
          </div>
        </div>

        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:22}}>
          <Eyebrow>TOP CLIPPERS · RIZZ</Eyebrow>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:14}}>
            {[
              {n:"Daniel O.", f:"🇳🇬", v:"1.2M", e:"$1,204.40"},
              {n:"Arjun M.",  f:"🇮🇳", v:"412K", e:"$412.80"},
              {n:"Sofia R.",  f:"🇵🇭", v:"328K", e:"$328.00"},
              {n:"Zara K.",   f:"🇵🇰", v:"218K", e:"$218.60"},
            ].map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,background:i===0?"rgba(212,255,58,0.14)":"transparent"}}>
                <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66",width:14}}>#{i+1}</span>
                <span style={{fontSize:14}}>{c.f}</span>
                <span style={{flex:1,fontSize:13,fontWeight:500}}>{c.n}</span>
                <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66"}}>{c.v} views</span>
                <span style={{fontFamily:"Geist Mono,monospace",fontSize:13,fontWeight:500,color:"#047857",width:80,textAlign:"right"}}>{c.e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({label,value,multi}){
  return (
    <div style={{marginTop:14}}>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66",marginBottom:6}}>{label}</div>
      {multi
        ? <textarea defaultValue={value} rows={3} style={{width:"100%",border:"1px solid #E8E6DF",borderRadius:10,padding:"10px 12px",fontFamily:"Geist,sans-serif",fontSize:14,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
        : <input defaultValue={value} style={{width:"100%",border:"1px solid #E8E6DF",borderRadius:10,padding:"0 12px",height:40,fontFamily:"Geist,sans-serif",fontSize:14,outline:"none",boxSizing:"border-box"}}/>}
    </div>
  );
}

function NumInput({label, prefix, value, onChange}){
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66",marginBottom:6}}>{label}</div>
      <div style={{display:"flex",alignItems:"center",border:"1px solid #E8E6DF",borderRadius:10,overflow:"hidden",background:"#fff",height:40}}>
        {prefix && <span style={{padding:"0 10px",background:"#F4F4F3",color:"#6E6D66",height:"100%",display:"grid",placeItems:"center",borderRight:"1px solid #E8E6DF",fontFamily:"Geist Mono,monospace",fontSize:14}}>{prefix}</span>}
        <input value={value} onChange={e=>onChange && onChange(e.target.value)} style={{flex:1,border:"none",outline:"none",padding:"0 12px",fontFamily:"Geist Mono,monospace",fontSize:14,height:"100%"}}/>
      </div>
    </div>
  );
}

window.CampaignEditor = CampaignEditor;
