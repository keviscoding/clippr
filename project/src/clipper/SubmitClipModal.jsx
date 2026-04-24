/* global React, Icon, Eyebrow, Button, api */
const { useState: useStateSCM, useEffect: useEffectSCM } = React;

function SubmitClipModal({ open, onClose, campaign, onSubmitted }){
  if (!open) return null;
  const [url, setUrl] = useStateSCM("");
  const [notes, setNotes] = useStateSCM("");
  const [busy, setBusy] = useStateSCM(false);
  const [errMsg, setErrMsg] = useStateSCM("");
  const [campaigns, setCampaigns] = useStateSCM([]);
  const [campaignId, setCampaignId] = useStateSCM(campaign ? campaign.id : "");

  useEffectSCM(() => {
    let mounted = true;
    if (campaign) { setCampaignId(campaign.id); return; }
    api.listLiveCampaigns().then(r => {
      if (!mounted) return;
      const list = r.error ? [] : r.data;
      setCampaigns(list);
      if (list.length === 1) setCampaignId(list[0].id);
    });
    return () => { mounted = false; };
  }, [campaign]);

  const submit = async () => {
    setErrMsg("");
    if (!campaignId) { setErrMsg("Pick a campaign."); return; }
    if (!url || !/^https?:\/\//i.test(url)) { setErrMsg("Paste a full clip URL (https://…)."); return; }
    setBusy(true);
    const r = await api.submitClip({ campaignId, url, notes });
    setBusy(false);
    if (r.error) { setErrMsg(r.error.message || "Something went wrong."); return; }
    setUrl(""); setNotes("");
    onSubmitted && onSubmitted();
  };

  const camp = campaign || campaigns.find(c => c.id === campaignId);

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(10,10,10,0.5)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:480,background:"#fff",borderRadius:20,padding:28,boxShadow:"0 32px 80px rgba(10,10,10,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:14}}>
          <div>
            <Eyebrow>SUBMIT CLIP{camp ? " · " + (camp.name||"").toUpperCase() : ""}</Eyebrow>
            <h2 style={{fontSize:22,fontWeight:600,letterSpacing:"-0.02em",margin:"6px 0 0"}}>Paste your clip URL</h2>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",cursor:"pointer",padding:4,color:"#6E6D66"}}><Icon name="x" size={20}/></button>
        </div>
        <p style={{fontSize:13,color:"#6E6D66",margin:"0 0 20px",lineHeight:1.5}}>
          Public TikTok, Instagram Reels, or YouTube Shorts URL. Clips count toward earnings once they pass <b style={{color:"#0A0A0A"}}>{camp ? Number(camp.min_views).toLocaleString() : "1,000"} views</b>.
        </p>

        {!campaign && (
          <label style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
            <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>CAMPAIGN</span>
            <select value={campaignId} onChange={e => setCampaignId(e.target.value)} style={{height:42,padding:"0 12px",fontFamily:"Geist,sans-serif",fontSize:14,border:"1px solid #E8E6DF",borderRadius:10,background:"#fff",outline:"none"}}>
              <option value="">Pick a campaign</option>
              {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        )}

        <label style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
          <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>CLIP URL</span>
          <div style={{display:"flex",alignItems:"center",border:"1px solid #E8E6DF",borderRadius:10,overflow:"hidden",background:"#fff"}}>
            <div style={{padding:"0 12px",color:"#A3A199"}}><Icon name="link" size={16}/></div>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.tiktok.com/@you/video/…" style={{flex:1,border:"none",outline:"none",height:42,fontFamily:"Geist,sans-serif",fontSize:14,padding:"0 12px 0 2px"}}/>
          </div>
        </label>
        <label style={{display:"flex",flexDirection:"column",gap:6}}>
          <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>NOTES (OPTIONAL)</span>
          <textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Anything the reviewer should know…" style={{border:"1px solid #E8E6DF",borderRadius:10,padding:"10px 12px",fontFamily:"Geist,sans-serif",fontSize:14,resize:"vertical",outline:"none"}}/>
        </label>

        {errMsg && (
          <div style={{marginTop:14,padding:"10px 12px",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,color:"#B91C1C",fontSize:13}}>{errMsg}</div>
        )}

        <div style={{padding:"12px 14px",background:"#FFFBEB",border:"1px solid #FEF3C7",borderRadius:10,display:"flex",gap:10,alignItems:"start",marginTop:14}}>
          <div style={{color:"#B45309",marginTop:1}}><Icon name="clock" size={16}/></div>
          <div style={{fontSize:12,color:"#78350F",lineHeight:1.5}}>
            Reviews typically take <b>under 6 hours</b>. You'll see your clip listed as <b>Pending</b> until then.
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:22}}>
          <Button variant="ghost" size="lg" full onClick={onClose}>Cancel</Button>
          <button onClick={submit} disabled={busy} style={{flex:1,background:busy?"rgba(212,255,58,0.5)":"#D4FF3A",color:"#0A0A0A",border:"1px solid #D4FF3A",borderRadius:10,padding:"12px 18px",fontFamily:"Geist,sans-serif",fontSize:15,fontWeight:600,cursor:busy?"wait":"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {busy ? "Submitting…" : "Submit for review"} <Icon name="arrow" size={15}/>
          </button>
        </div>
      </div>
    </div>
  );
}

window.SubmitClipModal = SubmitClipModal;
