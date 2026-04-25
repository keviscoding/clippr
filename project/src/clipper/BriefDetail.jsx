/* global React, Icon, Badge, Button, Eyebrow, api */
const { useState: useStateBD, useEffect: useEffectBD, useRef: useRefBD } = React;

function BriefDetail({ campaign, profile, onBack, onSubmit }){
  const [c, setC] = useStateBD(campaign || null);
  const [loading, setLoading] = useStateBD(!campaign);
  const [myClips, setMyClips] = useStateBD([]);
  const [recent, setRecent] = useStateBD([]);
  const [adminStats, setAdminStats] = useStateBD(null);
  const [playerOpen, setPlayerOpen] = useStateBD(null); // {url}
  const isAdmin = !!(profile && profile.is_admin);

  useEffectBD(() => {
    let mounted = true;
    (async () => {
      let camp = campaign;
      if (!camp) {
        const r = await api.getCampaignBySlug("rizz");
        camp = r.data;
      }
      if (!mounted) return;
      setC(camp);
      setLoading(false);
      const [mc, rec] = await Promise.all([api.listMyClips(), api.listRecentPaidPayouts(5)]);
      if (!mounted) return;
      setMyClips((mc.error ? [] : mc.data).filter(x => camp && x.campaign_id === camp.id));
      setRecent(rec.error ? [] : rec.data);
      if (isAdmin && camp) {
        const s = await api.getCampaignStats(camp.id);
        if (mounted && !s.error) setAdminStats(s.data);
      }
    })();
    return () => { mounted = false; };
  }, [campaign, isAdmin]);

  if (loading) return <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div>;
  if (!c) return <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Campaign not found.</div>;

  const myViews = myClips.reduce((s,x) => s + (x.views||0), 0);
  const myEarned = myClips.filter(x => x.status==="approved").reduce((s,x) => s + Number(x.earned||0), 0);
  const examples = Array.isArray(c.examples) ? c.examples : [];
  const dos = Array.isArray(c.dos) ? c.dos : [];
  const donts = Array.isArray(c.donts) ? c.donts : [];
  const tint = c.tint || "#6366f1";

  return (
    <div style={{padding:"0 0 60px",background:"#FAFAF7",minHeight:"100vh"}}>
      {playerOpen && <YoutubePlayerModal url={playerOpen.url} onClose={() => setPlayerOpen(null)}/>}
      <div className="br-banner" style={{position:"relative",height:200,background:`linear-gradient(135deg,${tint},#1a1a1a)`,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 20%, rgba(255,255,255,0.18), transparent 50%)"}}/>
        <div style={{position:"relative",maxWidth:1100,margin:"0 auto",padding:"22px 28px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between",color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={onBack} style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:999,padding:"6px 12px",color:"#fff",fontFamily:"Geist,sans-serif",fontSize:13,fontWeight:500,cursor:"pointer"}}>← Back</button>
            <Badge tone="lime">🔥 LIVE CAMPAIGN</Badge>
          </div>
          <div>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,letterSpacing:"0.08em",opacity:0.85,marginBottom:6}}>{(c.tag||"").toUpperCase()}</div>
            <h1 className="br-banner-h1" style={{fontSize:38,fontWeight:600,letterSpacing:"-0.025em",margin:0,lineHeight:1.05}}>{c.name}</h1>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"-32px auto 0",padding:"0 18px",position:"relative"}}>
        <div className="br-statbar" style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:16,padding:"22px 26px",boxShadow:"0 6px 24px rgba(10,10,10,0.06)",display:"grid",gridTemplateColumns:"repeat(5,1fr) auto",gap:24,alignItems:"center"}}>
          <BriefStat label="RATE" value={`$${Number(c.rpm).toFixed(2)}`} sub="per 1K views"/>
          <BriefStat label="MIN VIEWS" value={(c.min_views||0).toLocaleString()} sub="per clip to count"/>
          <BriefStat label="PAYOUT FLOOR" value={`$${Number(c.payout_floor||20).toFixed(0)}`} sub="before withdrawal"/>
          <BriefStat label="BUDGET" value={`$${Number(c.budget_remaining||0).toLocaleString()}`} sub="remaining this month"/>
          <BriefStat label="STATUS" value="LIVE" sub="Pays weekly"/>
          <Button variant="lime" size="lg" icon={<Icon name="arrow" size={15}/>} onClick={onSubmit}>Submit clip</Button>
        </div>

        {isAdmin && (
          <div style={{marginTop:14,padding:"14px 18px",background:"#0A0A0A",color:"#FAFAF7",borderRadius:14,display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr 1fr",gap:18,alignItems:"center",flexWrap:"wrap"}} className="br-admin-bar">
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:9,letterSpacing:"0.1em",color:"#D4FF3A",fontWeight:600,padding:"4px 8px",background:"rgba(212,255,58,0.12)",borderRadius:6}}>ADMIN VIEW</div>
            <AdminStat label="CLIPPERS" value={adminStats ? adminStats.clipperCount.toLocaleString() : "—"}/>
            <AdminStat label="CLIPS" value={adminStats ? adminStats.totalClips.toLocaleString() : "—"}/>
            <AdminStat label="VIEWS" value={adminStats ? adminStats.totalViews.toLocaleString() : "—"}/>
            <AdminStat label="PAID OUT" value={adminStats ? `$${adminStats.totalEarned.toFixed(2)}` : "—"}/>
          </div>
        )}

        <div className="br-layout" style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,marginTop:20}}>
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <Section title="What to make" eyebrow="THE BRIEF">
              <p style={{fontSize:15,lineHeight:1.6,color:"#2C2C2A",margin:"0 0 14px",whiteSpace:"pre-wrap"}}>
                {c.description || "Short-form clips for this campaign. See do's/don'ts below."}
              </p>
              {c.brief_md && <p style={{fontSize:15,lineHeight:1.6,color:"#2C2C2A",margin:"0 0 14px",whiteSpace:"pre-wrap"}}>{c.brief_md}</p>}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
                {["TikTok","Instagram Reels","YouTube Shorts"].map(p => (
                  <span key={p} style={{padding:"6px 12px",background:"#F4F4F3",borderRadius:999,fontSize:12,fontFamily:"Geist Mono,monospace",color:"#4A4A45",letterSpacing:"0.02em"}}>{p}</span>
                ))}
              </div>
            </Section>

            {examples.length > 0 && (
              <Section title="Videos that are crushing it" eyebrow="USE AS INSPIRATION">
                <ExamplesCarousel examples={examples} onPlay={(url) => setPlayerOpen({url})}/>
                <div style={{fontSize:12,color:"#6E6D66",marginTop:14,fontFamily:"Geist Mono,monospace",letterSpacing:"0.02em"}}>
                  · Replicate the structure + hook, not the exact words. Duplicates get flagged.
                </div>
              </Section>
            )}

            {(Array.isArray(c.assets) && c.assets.length > 0) && (
              <Section title="Assets" eyebrow="DOWNLOAD &amp; USE">
                <div className="br-assets" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {c.assets.map((a,i) => <AssetRow key={i} icon={a.kind === "audio" ? "play" : a.kind === "doc" ? "sparkle" : a.kind === "link" ? "link" : "upload"} label={a.label} sub={a.sub} cta={a.cta || "Open"} url={a.url}/>)}
                </div>
              </Section>
            )}

            {(dos.length > 0 || donts.length > 0) && (
              <div className="br-section-pair" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {dos.length > 0 && (
                  <Section title="Do" eyebrow="REQUIRED" tone="success">
                    <ul style={{margin:0,padding:"0 0 0 18px",fontSize:14,lineHeight:1.7,color:"#2C2C2A"}}>
                      {dos.map((d,i) => <li key={i}>{d}</li>)}
                    </ul>
                  </Section>
                )}
                {donts.length > 0 && (
                  <Section title="Don't" eyebrow="WILL BE REJECTED" tone="warning">
                    <ul style={{margin:0,padding:"0 0 0 18px",fontSize:14,lineHeight:1.7,color:"#2C2C2A"}}>
                      {donts.map((d,i) => <li key={i}>{d}</li>)}
                    </ul>
                  </Section>
                )}
              </div>
            )}

            <Section title="How you get paid" eyebrow="THE MATH">
              <div className="br-payout-steps" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:18}}>
                <PayoutStepCard n="1" title="Post + track" body="Submit your URL. We track views via the platform's public data."/>
                <PayoutStepCard n="2" title={`Hit ${(c.min_views||1000).toLocaleString()} views`} body={`Once a clip passes ${(c.min_views||1000).toLocaleString()} views and is approved, it counts toward your earnings at $${Number(c.rpm).toFixed(2)} per 1K.`}/>
                <PayoutStepCard n="3" title={`Withdraw at $${Number(c.payout_floor||20).toFixed(0)}`} body={`Once your balance crosses $${Number(c.payout_floor||20).toFixed(0)}, request payout. Payments go out every Friday via PayPal or bank.`}/>
              </div>
              <div style={{padding:"14px 16px",background:"#F4F4F3",borderRadius:12,fontSize:13,color:"#4A4A45",lineHeight:1.55,display:"flex",gap:10,alignItems:"start"}}>
                <div style={{color:"#0A0A0A",marginTop:1}}><Icon name="help" size={16}/></div>
                <div>
                  <b style={{color:"#0A0A0A"}}>Worked example:</b> a clip that hits 50,000 views = ${(50 * Number(c.rpm)).toFixed(2)}. Five clips like that in a month = ${(250 * Number(c.rpm)).toFixed(2)}, paid weekly in batches.
                </div>
              </div>
            </Section>
          </div>

          <div className="br-sidebar" style={{display:"flex",flexDirection:"column",gap:16,position:"sticky",top:90,alignSelf:"start"}}>
            <div style={{background:"#0A0A0A",color:"#FAFAF7",borderRadius:16,padding:22}}>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"rgba(250,250,247,0.6)"}}>YOUR PROGRESS</div>
              <div style={{fontFamily:"Geist Mono,monospace",fontSize:28,fontWeight:500,color:"#D4FF3A",marginTop:6,fontVariantNumeric:"tabular-nums"}}>${myEarned.toFixed(2)}</div>
              <div style={{fontSize:12,color:"rgba(250,250,247,0.65)",marginTop:2}}>{myClips.length} clip{myClips.length===1?"":"s"} · {myViews.toLocaleString()} views</div>
              <Button variant="primary" size="md" full style={{marginTop:18}} onClick={onSubmit} icon={<Icon name="arrow" size={14}/>}>Submit a clip</Button>
            </div>

            {c.discord_url && (
              <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:18}}>
                <Eyebrow>SUPPORT</Eyebrow>
                <div style={{fontSize:14,color:"#2C2C2A",lineHeight:1.5,margin:"8px 0 14px"}}>
                  Questions on the brief? Drop a message in the Discord. Replies usually within 1–2 hours.
                </div>
                <a href={c.discord_url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#0A0A0A",color:"#FAFAF7",border:"1px solid #0A0A0A",borderRadius:10,textDecoration:"none",fontSize:14,fontWeight:600}}>
                  <Icon name="external" size={14}/> Open Discord
                </a>
              </div>
            )}

            {recent.length > 0 && (
              <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:18}}>
                <Eyebrow>RECENT PAYOUTS</Eyebrow>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:10}}>
                  {recent.map((p,i) => {
                    const pr = p.profiles || {};
                    return (
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12}}>
                        <span style={{fontFamily:"Geist Mono,monospace",color:"#0A0A0A"}}>{pr.handle || pr.display_name || "anon"}</span>
                        <span style={{fontFamily:"Geist Mono,monospace",color:"#047857"}}>${Number(p.amount).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BriefStat({label,value,sub}){
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:22,fontWeight:500,marginTop:3,color:"#0A0A0A",fontVariantNumeric:"tabular-nums"}}>{value}</div>
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

function AdminStat({label, value}){
  return (
    <div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:9,letterSpacing:"0.08em",color:"rgba(250,250,247,0.55)"}}>{label}</div>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:18,fontWeight:500,marginTop:2,color:"#FAFAF7",fontVariantNumeric:"tabular-nums"}}>{value}</div>
    </div>
  );
}

function ExamplesCarousel({ examples, onPlay }){
  const railRef = useRefBD(null);
  const scroll = (dir) => {
    if (!railRef.current) return;
    const w = railRef.current.clientWidth;
    railRef.current.scrollBy({ left: dir * Math.max(220, w * 0.6), behavior: "smooth" });
  };
  return (
    <div style={{position:"relative"}}>
      <div ref={railRef} className="br-rail" style={{
        display:"flex", gap:10, overflowX:"auto", overflowY:"hidden",
        scrollSnapType:"x mandatory", paddingBottom:6,
        WebkitOverflowScrolling:"touch", scrollbarWidth:"thin",
      }}>
        {examples.map((e, i) => <ExampleCard key={i} ex={e} onPlay={onPlay}/>)}
      </div>
      <CarouselArrow dir={-1} onClick={() => scroll(-1)}/>
      <CarouselArrow dir={ 1} onClick={() => scroll( 1)}/>
    </div>
  );
}

function CarouselArrow({ dir, onClick }){
  const isLeft = dir < 0;
  return (
    <button onClick={onClick} aria-label={isLeft ? "Scroll left" : "Scroll right"} className="br-rail-arrow"
            style={{
              position:"absolute", top:"50%", transform:"translateY(-50%)",
              [isLeft ? "left" : "right"]: -12,
              width:36, height:36, borderRadius:999, border:"1px solid #E8E6DF",
              background:"#fff", cursor:"pointer", boxShadow:"0 6px 20px rgba(10,10,10,0.12)",
              display:"grid", placeItems:"center", color:"#0A0A0A",
            }}>
      <span style={{fontSize:18, lineHeight:1, transform: isLeft ? "rotate(180deg)" : "none"}}>›</span>
    </button>
  );
}

function ExampleCard({ ex, onPlay }){
  const url = ex && ex.url;
  const ytId = url ? api.youtubeId(url) : null;
  const isYt = !!ytId;
  const [imgOk, setImgOk] = useStateBD(true);
  const thumbUrl = isYt ? api.youtubeThumb(ytId) : null;

  const handleClick = (e) => {
    if (!url) return;
    if (isYt) { e.preventDefault(); onPlay && onPlay(url); }
  };

  return (
    <a href={url || "#"} target="_blank" rel="noreferrer" onClick={handleClick} style={{
      flex:"0 0 auto", width:170, scrollSnapAlign:"start", textDecoration:"none",
    }}>
      <div style={{
        position:"relative", aspectRatio:"9/14", borderRadius:12, overflow:"hidden",
        background:"#0A0A0A", border:"1px solid #E8E6DF", cursor: url ? "pointer" : "default",
      }}>
        {isYt && imgOk && thumbUrl ? (
          <img src={thumbUrl} alt={ex.hook || ""} onError={() => setImgOk(false)}
               style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
        ) : (
          <div style={{position:"absolute",inset:0,background:ex.grad || "linear-gradient(160deg,#6366f1,#0a0a0a 70%)"}}/>
        )}
        {ex.views && (
          <div style={{position:"absolute",top:8,left:8,padding:"3px 8px",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",borderRadius:999,fontFamily:"Geist Mono,monospace",fontSize:10,color:"#fff",letterSpacing:"0.04em",fontWeight:500}}>
            {ex.views}
          </div>
        )}
        {isYt && (
          <div style={{position:"absolute",top:8,right:8,padding:"3px 6px",background:"rgba(255,0,0,0.92)",borderRadius:5,fontFamily:"Geist Mono,monospace",fontSize:9,color:"#fff",letterSpacing:"0.06em",fontWeight:600}}>
            {api.isYoutubeShorts(url) ? "SHORTS" : "YT"}
          </div>
        )}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,transparent 55%,rgba(0,0,0,0.85) 100%)"}}/>
        {url && (
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:42,height:42,borderRadius:999,background:"rgba(255,255,255,0.92)",display:"grid",placeItems:"center",color:"#0A0A0A",boxShadow:"0 4px 14px rgba(0,0,0,0.4)"}}>
            <span style={{fontSize:14,marginLeft:2}}>▶</span>
          </div>
        )}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 12px",color:"#fff"}}>
          {ex.hook && <div style={{fontSize:12,fontWeight:600,lineHeight:1.25,marginBottom:4,textShadow:"0 1px 4px rgba(0,0,0,0.6)"}}>{ex.hook}</div>}
          {ex.handle && <div style={{fontFamily:"Geist Mono,monospace",fontSize:9,opacity:0.85,letterSpacing:"0.04em"}}>{ex.handle}</div>}
        </div>
      </div>
    </a>
  );
}

function YoutubePlayerModal({ url, onClose }){
  if (!url) return null;
  const id = api.youtubeId(url);
  const isShorts = api.isYoutubeShorts(url);
  const src = api.youtubeEmbed(id, { autoplay: true, mute: false });
  if (!id) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:120,background:"rgba(10,10,10,0.85)",backdropFilter:"blur(8px)",display:"grid",placeItems:"center",padding:20}}>
      <div onClick={e => e.stopPropagation()} style={{
        position:"relative",
        width: isShorts ? "min(380px, 100%)" : "min(960px, 100%)",
        aspectRatio: isShorts ? "9/16" : "16/9",
        borderRadius:14, overflow:"hidden", background:"#000",
        boxShadow:"0 30px 80px rgba(0,0,0,0.6)",
      }}>
        <iframe src={src} title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}/>
      </div>
      <button onClick={onClose} aria-label="Close"
              style={{position:"fixed",top:18,right:18,width:40,height:40,borderRadius:999,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",cursor:"pointer",fontSize:22,lineHeight:1}}>×</button>
    </div>
  );
}

function AssetRow({icon,label,sub,cta,url}){
  const inner = (
    <>
      <div style={{width:38,height:38,borderRadius:10,background:"#0A0A0A",color:"#D4FF3A",display:"grid",placeItems:"center",flexShrink:0}}><Icon name={icon} size={18}/></div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:600,letterSpacing:"-0.01em"}}>{label}</div>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66",letterSpacing:"0.02em",marginTop:2}}>{sub}</div>
      </div>
      <span style={{padding:"7px 12px",background:"#0A0A0A",color:"#FAFAF7",border:"none",borderRadius:8,fontSize:12,fontWeight:600,fontFamily:"Geist,sans-serif",whiteSpace:"nowrap"}}>{cta}</span>
    </>
  );
  return url
    ? <a href={url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",border:"1px solid #E8E6DF",borderRadius:12,background:"#fff",textDecoration:"none",color:"inherit"}}>{inner}</a>
    : <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",border:"1px solid #E8E6DF",borderRadius:12,background:"#fff"}}>{inner}</div>;
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
