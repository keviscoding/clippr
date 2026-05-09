/* global React, Eyebrow, Icon, api */
const { useState: useStateSS, useEffect: useEffectSS } = React;

function SiteSettings({ onChanged }){
  const [config, setConfig] = useStateSS(null);
  const [loading, setLoading] = useStateSS(true);
  const [busy, setBusy] = useStateSS(false);
  const [okMsg, setOkMsg] = useStateSS("");
  const [errMsg, setErrMsg] = useStateSS("");

  useEffectSS(() => {
    let mounted = true;
    api.getSiteConfig().then(r => {
      if (!mounted) return;
      setConfig(r.data || { id: "main" });
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div>;

  const set = (k,v) => setConfig(c => ({...c, [k]: v}));

  const save = async () => {
    setOkMsg(""); setErrMsg("");
    setBusy(true);
    try {
      const patch = {
        hero_video_url: config.hero_video_url || null,
        founder_name: config.founder_name || null,
        founder_photo_url: config.founder_photo_url || null,
        founder_video_url: config.founder_video_url || null,
        founder_video_title: config.founder_video_title || null,
      };
      const r = await api.updateSiteConfig(patch);
      setBusy(false);
      if (r.error) { setErrMsg(r.error.message || "Save failed."); return; }
      setOkMsg("Saved.");
      onChanged && onChanged();
      setTimeout(() => setOkMsg(""), 2400);
    } catch (e) {
      setBusy(false);
      setErrMsg(e.message || "Save failed — please try again.");
    }
  };

  const igShortcode = config.hero_video_url ? api.instagramShortcode(config.hero_video_url) : null;

  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:16,maxWidth:820}}>
      <div>
        <Eyebrow>SITE SETTINGS</Eyebrow>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>Marketing page content</div>
        <p style={{fontSize:13,color:"#6E6D66",marginTop:6,lineHeight:1.5}}>
          These settings control what visitors see on the marketing homepage — the hero video, founder section, etc.
        </p>
      </div>

      <SSCard title="Hero phone video">
        <p style={{fontSize:13,color:"#6E6D66",lineHeight:1.5,margin:"0 0 8px"}}>
          Paste an Instagram reel URL. This plays inside the phone mockup on the hero section.
        </p>
        <SSField label="Instagram reel URL" value={config.hero_video_url} onChange={v=>set("hero_video_url", v)} placeholder="https://www.instagram.com/reel/…"/>
        {igShortcode && (
          <div style={{borderRadius:10,overflow:"hidden",border:"1px solid #E8E6DF",maxWidth:320,aspectRatio:"9/16"}}>
            <iframe src={`https://www.instagram.com/reel/${igShortcode}/embed/?cr=1&v=14`} style={{width:"100%",height:"100%",border:"none"}} loading="lazy" allowFullScreen/>
          </div>
        )}
      </SSCard>

      <SSCard title="Founder section">
        <SSField label="Founder name" value={config.founder_name} onChange={v=>set("founder_name", v)} placeholder="Kevis"/>
        <SSField label="Profile photo URL" value={config.founder_photo_url} onChange={v=>set("founder_photo_url", v)} placeholder="https://i.imgur.com/… or any image URL"/>
        {config.founder_photo_url && (
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:64,height:64,borderRadius:999,overflow:"hidden",border:"2px solid #E8E6DF",flexShrink:0}}>
              <img src={config.founder_photo_url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none"}}/>
            </div>
            <span style={{fontSize:13,color:"#6E6D66"}}>Preview</span>
          </div>
        )}
        <SSField label="Founder video URL (YouTube or Loom)" value={config.founder_video_url} onChange={v=>set("founder_video_url", v)} placeholder="https://youtube.com/watch?v=… or https://www.loom.com/share/…"/>
        <SSField label="Video title" value={config.founder_video_title} onChange={v=>set("founder_video_title", v)} placeholder="How Clippr works (2 min)"/>
      </SSCard>

      {errMsg && <div style={{padding:"10px 12px",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,color:"#B91C1C",fontSize:13}}>{errMsg}</div>}
      {okMsg && <div style={{padding:"10px 12px",background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,color:"#047857",fontSize:13}}>{okMsg}</div>}

      <div style={{display:"flex",gap:8}}>
        <button onClick={save} disabled={busy} style={{padding:"10px 16px",background:busy?"rgba(212,255,58,0.5)":"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:10,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:14,cursor:busy?"wait":"pointer"}}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </div>
    </div>
  );
}

function SSCard({title, children}){
  return (
    <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"20px 22px",display:"flex",flexDirection:"column",gap:12}}>
      <h3 style={{fontSize:15,fontWeight:600,letterSpacing:"-0.01em",margin:0}}>{title}</h3>
      {children}
    </div>
  );
}

function SSField({label, value, onChange, placeholder}){
  return (
    <label style={{display:"flex",flexDirection:"column",gap:6}}>
      <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</span>
      <input type="text" value={value || ""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{height:42,padding:"0 12px",fontFamily:"Geist,sans-serif",fontSize:14,border:"1px solid #E8E6DF",borderRadius:10,background:"#fff",outline:"none"}}/>
    </label>
  );
}

window.SiteSettings = SiteSettings;
