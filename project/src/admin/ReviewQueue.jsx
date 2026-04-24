/* global React, Icon, Eyebrow, Badge, Button, api */
const { useState: useStateRQ, useEffect: useEffectRQ } = React;

function ReviewQueue({ onChanged }){
  const [tab, setTab] = useStateRQ("pending");
  const [clips, setClips] = useStateRQ([]);
  const [loading, setLoading] = useStateRQ(true);
  const [busyId, setBusyId] = useStateRQ(null);
  const [viewsDraft, setViewsDraft] = useStateRQ({});
  const [reasonDraft, setReasonDraft] = useStateRQ({});

  const reload = async () => {
    setLoading(true);
    const r = tab === "pending" ? await api.listPendingClips() : await api.listAllClips();
    setClips(r.error ? [] : r.data);
    setLoading(false);
  };
  useEffectRQ(() => { reload(); }, [tab]);

  const setViews = (id, v) => setViewsDraft(d => ({...d, [id]: v}));
  const setReason = (id, v) => setReasonDraft(d => ({...d, [id]: v}));

  const approve = async (clip) => {
    const draft = viewsDraft[clip.id];
    const views = draft !== undefined && draft !== "" ? Number(draft) : (clip.views || 0);
    if (Number.isNaN(views) || views < 0) return;
    setBusyId(clip.id);
    await api.reviewClip(clip.id, { status: "approved", views });
    setBusyId(null);
    await reload();
    onChanged && onChanged();
  };
  const reject = async (clip) => {
    const reason = reasonDraft[clip.id] || "Doesn't meet brief";
    setBusyId(clip.id);
    await api.reviewClip(clip.id, { status: "rejected", rejection_reason: reason });
    setBusyId(null);
    await reload();
    onChanged && onChanged();
  };
  const updateViewsOnly = async (clip) => {
    const draft = viewsDraft[clip.id];
    if (draft === undefined || draft === "") return;
    const views = Number(draft);
    if (Number.isNaN(views) || views < 0) return;
    setBusyId(clip.id);
    await api.reviewClip(clip.id, { status: clip.status, views });
    setBusyId(null);
    setViewsDraft(d => { const n = {...d}; delete n[clip.id]; return n; });
    await reload();
    onChanged && onChanged();
  };

  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"end"}}>
        <div>
          <Eyebrow>REVIEW QUEUE</Eyebrow>
          <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>{tab==="pending" ? "Approve / reject submitted clips" : "All clip submissions"}</div>
        </div>
        <div style={{display:"flex",gap:6,padding:4,background:"#F4F4F3",borderRadius:10}}>
          {[{k:"pending",l:"Pending"},{k:"all",l:"All"}].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"7px 14px",border:"none",cursor:"pointer",background:tab===t.k?"#fff":"transparent",color:tab===t.k?"#0A0A0A":"#6E6D66",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,borderRadius:7,boxShadow:tab===t.k?"0 1px 2px rgba(10,10,10,0.06)":"none"}}>{t.l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div>
      ) : clips.length === 0 ? (
        <div style={{background:"#fff",border:"1px dashed #E8E6DF",borderRadius:14,padding:32,textAlign:"center",color:"#6E6D66",fontSize:14}}>
          {tab === "pending" ? "Inbox zero. New submissions will appear here." : "No clips submitted yet."}
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {clips.map(c => {
            const camp = c.campaigns || {};
            const pr = c.profiles || {};
            const tone = c.status === "approved" ? "approved" : c.status === "rejected" ? "rejected" : "pending";
            return (
              <div key={c.id} style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:18,display:"grid",gridTemplateColumns:"56px 1fr 240px",gap:16,alignItems:"start"}}>
                <div style={{width:48,height:64,borderRadius:8,background:`linear-gradient(135deg, ${camp.tint||"#6366f1"}, #1a1a1a)`,display:"grid",placeItems:"center",color:"#fff"}}>
                  <Icon name={c.platform==="tiktok"?"tiktok":c.platform==="youtube"?"youtube":"play"} size={18}/>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <a href={c.url} target="_blank" rel="noreferrer" style={{fontFamily:"Geist Mono,monospace",fontSize:13,color:"#0A0A0A",textDecoration:"underline",maxWidth:480,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.url}</a>
                    <Badge tone={tone}>{c.status}</Badge>
                  </div>
                  <div style={{fontSize:12,color:"#6E6D66",marginTop:6,display:"flex",gap:14,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"Geist Mono,monospace"}}>{pr.handle || pr.display_name || "anon"}</span>
                    <span>·</span>
                    <span>{camp.name || "—"}</span>
                    <span>·</span>
                    <span>{c.platform || "other"}</span>
                    <span>·</span>
                    <span>{new Date(c.submitted_at).toLocaleString(undefined, {month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  {c.notes && <div style={{fontSize:13,color:"#4A4A45",marginTop:8,padding:"8px 10px",background:"#FAFAF7",borderRadius:8,maxWidth:680}}>"{c.notes}"</div>}
                  {c.status === "rejected" && c.rejection_reason && (
                    <div style={{fontSize:12,color:"#B91C1C",marginTop:6}}>Rejected: {c.rejection_reason}</div>
                  )}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  <label style={{display:"flex",flexDirection:"column",gap:4}}>
                    <span style={{fontFamily:"Geist Mono,monospace",fontSize:9,letterSpacing:"0.08em",color:"#6E6D66"}}>VIEW COUNT</span>
                    <input type="number" min="0" step="1" defaultValue={c.views || ""} placeholder={c.views ? c.views.toString() : "e.g. 12500"}
                           onChange={e => setViews(c.id, e.target.value)}
                           style={{height:36,padding:"0 10px",fontFamily:"Geist Mono,monospace",fontSize:13,border:"1px solid #E8E6DF",borderRadius:8,outline:"none",fontVariantNumeric:"tabular-nums"}}/>
                  </label>
                  {c.status === "pending" && (
                    <>
                      <button onClick={() => approve(c)} disabled={busyId === c.id} style={{padding:"8px 12px",background:"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:8,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:busyId===c.id?"wait":"pointer"}}>
                        {busyId === c.id ? "…" : "Approve"}
                      </button>
                      <details>
                        <summary style={{fontSize:12,color:"#B91C1C",cursor:"pointer",fontFamily:"Geist Mono,monospace",letterSpacing:"0.04em"}}>REJECT</summary>
                        <input placeholder="Reason (shown to clipper)" onChange={e => setReason(c.id, e.target.value)} style={{width:"100%",height:34,padding:"0 10px",marginTop:6,fontFamily:"Geist,sans-serif",fontSize:12,border:"1px solid #FECACA",borderRadius:8,outline:"none"}}/>
                        <button onClick={() => reject(c)} disabled={busyId === c.id} style={{marginTop:6,padding:"7px 12px",background:"transparent",color:"#B91C1C",border:"1px solid #FECACA",borderRadius:8,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>
                          Reject submission
                        </button>
                      </details>
                    </>
                  )}
                  {c.status !== "pending" && (
                    <button onClick={() => updateViewsOnly(c)} disabled={busyId === c.id} style={{padding:"8px 12px",background:"#0A0A0A",color:"#FAFAF7",border:"none",borderRadius:8,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:busyId===c.id?"wait":"pointer"}}>
                      {busyId === c.id ? "Saving…" : "Update views"}
                    </button>
                  )}
                  {c.earned > 0 && <div style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"#047857",textAlign:"right"}}>Earned ${Number(c.earned).toFixed(2)}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

window.ReviewQueue = ReviewQueue;
