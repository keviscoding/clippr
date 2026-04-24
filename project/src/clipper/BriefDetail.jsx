/* global React, Icon, Badge, Button, Eyebrow */

function BriefDetail({ campaign, onBack, onSubmit }){
  const c = campaign || {
    name: "Rizz — AI dating replies",
    tag: "Dating · Lifestyle",
    rpm: 1.00,
    minViews: 1000,
    payoutFloor: 20,
    budget: "$24K / month",
    deadline: "Open — pays weekly",
    tint: "linear-gradient(135deg,#6366f1,#ec4899)",
  };

  // Example viral clips (placeholder thumbs — swap for real screenshots later)
  const examples = [
    {handle:"@rizz.clips.daily",  views:"1.2M", hook:"POV: texting back like THIS",       grad:"linear-gradient(160deg,#6366f1,#0a0a0a 70%)"},
    {handle:"@rizzdaily.gen",     views:"842K", hook:"Use this reply for cold openers",   grad:"linear-gradient(160deg,#3b82f6,#0a0a0a 70%)"},
    {handle:"@text.tactics",      views:"612K", hook:"She left me on read. Comeback ↓",   grad:"linear-gradient(160deg,#10b981,#0a0a0a 70%)"},
    {handle:"@gametips.daily",    views:"480K", hook:"Stop saying 'hey'. Try this →",     grad:"linear-gradient(160deg,#f59e0b,#0a0a0a 70%)"},
  ];

  const dos = [
    "Hook in the first 1.5 seconds — text-on-screen with the POV format",
    "Show a real screenshot/screen recording of the Rizz app generating the reply",
    "End with the tracked download link in your bio + caption",
    "Use the trending sound from the Sounds section below",
    "Vertical 9:16, 1080p, length 15–28s",
  ];
  const donts = [
    "No watermarks from CapCut, TikTok save, or other clipping programs",
    "No reposting other clippers' exact videos — flagged as duplicate",
    "No NSFW, slurs, or content that breaks TikTok community guidelines",
    "Don't crop the app screen recording out — viewers need to see Rizz working",
    "Don't post the same clip to more than 2 of your accounts",
  ];

  return (
    <div style={{padding:"0 0 60px",background:"#FAFAF7",minHeight:"100vh"}}>
      {/* Header banner */}
      <div style={{position:"relative",height:200,background:c.tint,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18), transparent 50%)"}}/>
        <div style={{position:"relative",maxWidth:1100,margin:"0 auto",padding:"22px 28px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={onBack} style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:999,padding:"6px 12px",color:"#fff",fontFamily:"Geist,sans-serif",fontSize:13,fontWeight:500,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6}}>
              <Icon name="arrow" size={14} stroke={2}/><span style={{transform:"rotate(180deg)",display:"inline-block"}}>←</span> Back
            </button>
            <Badge tone="lime">🔥 HOT CAMPAIGN</Badge>
          </div>
          <div>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,letterSpacing:"0.08em",opacity:0.85,marginBottom:6}}>{c.tag.toUpperCase()}</div>
            <h1 style={{fontSize:38,fontWeight:600,letterSpacing:"-0.025em",margin:0,lineHeight:1.05}}>{c.name}</h1>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"-32px auto 0",padding:"0 28px",position:"relative"}}>
        {/* Hero stats card */}
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:16,padding:"22px 26px",boxShadow:"0 6px 24px rgba(10,10,10,0.06)",display:"grid",gridTemplateColumns:"repeat(5,1fr) auto",gap:24,alignItems:"center"}}>
          <BriefStat label="RATE" value={`$${c.rpm.toFixed(2)}`} sub="per 1K views" highlight/>
          <BriefStat label="MIN VIEWS" value={c.minViews >= 1000 ? `${(c.minViews/1000).toFixed(0)}K` : c.minViews} sub="per clip to count"/>
          <BriefStat label="PAYOUT FLOOR" value={`$${c.payoutFloor}`} sub="before withdrawal"/>
          <BriefStat label="BUDGET" value={c.budget} sub="resets monthly"/>
          <BriefStat label="STATUS" value="LIVE" sub={c.deadline}/>
          <Button variant="lime" size="lg" icon={<Icon name="arrow" size={15}/>} onClick={onSubmit}>Submit clip</Button>
        </div>

        {/* Two-column body */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,marginTop:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {/* What to make */}
            <Section title="What to make" eyebrow="THE BRIEF">
              <p style={{fontSize:15,lineHeight:1.6,color:"#2C2C2A",margin:"0 0 14px"}}>
                Rizz is an AI app that generates smooth replies for dating chats. Your job is to make short-form clips (TikTok, Reels, Shorts) that show the app in action and convert viewers into downloads.
              </p>
              <p style={{fontSize:15,lineHeight:1.6,color:"#2C2C2A",margin:"0 0 14px"}}>
                The proven format: a <b>"POV: texting her back like this"</b>-style hook, then a screen recording of Rizz generating the reply, then a beat where the reply lands. End with the download CTA. Keep it under 30 seconds.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
                {["TikTok","Instagram Reels","YouTube Shorts"].map(p => (
                  <span key={p} style={{padding:"6px 12px",background:"#F4F4F3",borderRadius:999,fontSize:12,fontFamily:"Geist Mono,monospace",color:"#4A4A45",letterSpacing:"0.02em"}}>{p}</span>
                ))}
              </div>
            </Section>

            {/* Examples */}
            <Section title="Examples that went viral" eyebrow="USE AS INSPIRATION">
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {examples.map((e,i) => <ExampleCard key={i} {...e}/>)}
              </div>
              <div style={{fontSize:12,color:"#6E6D66",marginTop:14,fontFamily:"Geist Mono,monospace",letterSpacing:"0.02em"}}>
                · Replicate the structure, not the exact words. Duplicates are flagged.
              </div>
            </Section>

            {/* Assets */}
            <Section title="Assets" eyebrow="DOWNLOAD & USE">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <AssetRow icon="upload" label="Raw Rizz screen recordings" sub="12 clips · 480MB · MP4" cta="Download .zip"/>
                <AssetRow icon="play"   label="Trending sounds pack"        sub="4 audio files · current week" cta="Download .zip"/>
                <AssetRow icon="link"   label="Your tracked download link"   sub="rizz.app/?ref=YOUR_HANDLE" cta="Copy link"/>
                <AssetRow icon="sparkle" label="Caption + hashtag templates"  sub="20 ready-to-paste captions" cta="Open doc"/>
              </div>
            </Section>

            {/* Do's and Don'ts */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Section title="Do" eyebrow="REQUIRED" tone="success">
                <ul style={{margin:0,padding:"0 0 0 18px",fontSize:14,lineHeight:1.7,color:"#2C2C2A"}}>
                  {dos.map((d,i) => <li key={i}>{d}</li>)}
                </ul>
              </Section>
              <Section title="Don't" eyebrow="WILL BE REJECTED" tone="warning">
                <ul style={{margin:0,padding:"0 0 0 18px",fontSize:14,lineHeight:1.7,color:"#2C2C2A"}}>
                  {donts.map((d,i) => <li key={i}>{d}</li>)}
                </ul>
              </Section>
            </div>

            {/* How payment works */}
            <Section title="How you get paid" eyebrow="THE MATH">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:18}}>
                <PayoutStepCard n="1" title="Post + track" body="We track views every 30 min from the URL you submit. Only views from approved clips count."/>
                <PayoutStepCard n="2" title="Hit 1K views" body={`Once a clip passes ${c.minViews.toLocaleString()} views, it starts counting toward your earnings at $${c.rpm.toFixed(2)} per 1K.`}/>
                <PayoutStepCard n="3" title="Withdraw at $20" body={`Once your balance crosses $${c.payoutFloor}, request payout. Payments go out every Friday via PayPal or bank.`}/>
              </div>
              <div style={{padding:"14px 16px",background:"#F4F4F3",borderRadius:12,fontSize:13,color:"#4A4A45",lineHeight:1.55,display:"flex",gap:10,alignItems:"start"}}>
                <div style={{color:"#0A0A0A",marginTop:1}}><Icon name="help" size={16}/></div>
                <div>
                  <b style={{color:"#0A0A0A"}}>Worked example:</b> a clip that hits 50,000 views = $50.00. Five clips like that in a month = $250.00, paid weekly in batches.
                </div>
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <div style={{display:"flex",flexDirection:"column",gap:16,position:"sticky",top:90,alignSelf:"start"}}>
            <div style={{background:"#0A0A0A",color:"#FAFAF7",borderRadius:16,padding:22}}>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"rgba(250,250,247,0.6)"}}>YOUR PROGRESS</div>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:28,fontWeight:500,color:"#D4FF3A",marginTop:6,fontVariantNumeric:"tabular-nums"}}>$124.82</div>
              <div style={{fontSize:12,color:"rgba(250,250,247,0.65)",marginTop:2}}>4 clips · 124,820 views earned</div>
              <div style={{height:6,background:"rgba(255,255,255,0.08)",borderRadius:999,marginTop:14,overflow:"hidden"}}>
                <div style={{width:"82%",height:"100%",background:"#D4FF3A"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"Geist Mono,monospace",fontSize:10,color:"rgba(250,250,247,0.55)",marginTop:6,letterSpacing:"0.04em"}}>
                <span>$0</span><span>NEXT TIER · $200</span>
              </div>
              <Button variant="primary" size="md" full style={{marginTop:18}} onClick={onSubmit} icon={<Icon name="arrow" size={14}/>}>Submit a clip</Button>
            </div>

            <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:18}}>
              <Eyebrow>SUPPORT</Eyebrow>
              <div style={{fontSize:14,color:"#2C2C2A",lineHeight:1.5,margin:"8px 0 14px"}}>
                Questions on the brief? Drop a message in the campaign Discord. Replies usually within 1–2 hours.
              </div>
              <Button variant="ink" size="md" full icon={<Icon name="external" size={14}/>}>Open Discord</Button>
            </div>

            <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:18}}>
              <Eyebrow>RECENT APPROVALS</Eyebrow>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:10}}>
                {[
                  {h:"@arjunclips", v:"412K", t:"3h ago"},
                  {h:"@sofie.viral", v:"128K", t:"5h ago"},
                  {h:"@danthecutter", v:"1.2M", t:"yesterday"},
                ].map((r,i) => (
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12}}>
                    <span style={{fontFamily:"Geist Mono,monospace",color:"#0A0A0A"}}>{r.h}</span>
                    <span style={{fontFamily:"Geist Mono,monospace",color:"#047857"}}>{r.v} · {r.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefStat({label,value,sub,highlight}){
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:22,fontWeight:500,marginTop:3,color:highlight?"#0A0A0A":"#0A0A0A",fontVariantNumeric:"tabular-nums"}}>{value}</div>
      <div style={{fontSize:11,color:"#6E6D66",marginTop:1}}>{sub}</div>
    </div>
  );
}

function Section({title, eyebrow, children, tone}){
  const tones = {
    success: {border:"1px solid #BBF7D0", bg:"#F0FDF4"},
    warning: {border:"1px solid #FECACA", bg:"#FEF2F2"},
    default: {border:"1px solid #E8E6DF", bg:"#fff"},
  };
  const t = tones[tone] || tones.default;
  return (
    <div style={{background:t.bg,border:t.border,borderRadius:14,padding:"20px 22px",boxShadow:"0 1px 2px rgba(10,10,10,0.02)"}}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h3 style={{fontSize:18,fontWeight:600,letterSpacing:"-0.015em",margin:"4px 0 14px"}}>{title}</h3>
      {children}
    </div>
  );
}

function ExampleCard({handle,views,hook,grad}){
  return (
    <div style={{background:"#0A0A0A",borderRadius:12,overflow:"hidden",aspectRatio:"9/14",position:"relative",cursor:"pointer",border:"1px solid #E8E6DF"}}>
      <div style={{position:"absolute",inset:0,background:grad}}/>
      <div style={{position:"absolute",top:8,left:8,padding:"3px 8px",background:"rgba(0,0,0,0.4)",backdropFilter:"blur(8px)",borderRadius:999,fontFamily:"Geist Mono,monospace",fontSize:10,color:"#fff",letterSpacing:"0.04em"}}>{views}</div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px",background:"linear-gradient(transparent,rgba(0,0,0,0.85))",color:"#fff"}}>
        <div style={{fontSize:12,fontWeight:600,lineHeight:1.25,marginBottom:4}}>{hook}</div>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:9,opacity:0.7,letterSpacing:"0.04em"}}>{handle}</div>
      </div>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:38,height:38,borderRadius:999,background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",display:"grid",placeItems:"center",color:"#fff"}}>▶</div>
    </div>
  );
}

function AssetRow({icon,label,sub,cta}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",border:"1px solid #E8E6DF",borderRadius:12,background:"#fff"}}>
      <div style={{width:38,height:38,borderRadius:10,background:"#0A0A0A",color:"#D4FF3A",display:"grid",placeItems:"center",flexShrink:0}}><Icon name={icon} size={18}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em"}}>{label}</div>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66",letterSpacing:"0.02em",marginTop:2}}>{sub}</div>
      </div>
      <button style={{padding:"7px 12px",background:"#0A0A0A",color:"#FAFAF7",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Geist,sans-serif",whiteSpace:"nowrap"}}>{cta}</button>
    </div>
  );
}

function PayoutStepCard({n,title,body}){
  return (
    <div style={{padding:"16px 18px",background:"#FAFAF7",borderRadius:12,border:"1px solid #F4F4F3"}}>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66",letterSpacing:"0.08em"}}>STEP {n}</div>
      <div style={{fontSize:15,fontWeight:600,marginTop:4,letterSpacing:"-0.01em"}}>{title}</div>
      <div style={{fontSize:13,color:"#4A4A45",marginTop:6,lineHeight:1.55}}>{body}</div>
    </div>
  );
}

window.BriefDetail = BriefDetail;
