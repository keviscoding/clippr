/* global React, Icon, Eyebrow, Badge, Button, api */
const { useState: useStateCE, useEffect: useEffectCE } = React;

function CampaignEditor({ onChanged }){
  const [campaigns, setCampaigns] = useStateCE([]);
  const [editing, setEditing] = useStateCE(null);
  const [loading, setLoading] = useStateCE(true);
  const [busy, setBusy] = useStateCE(false);
  const [errMsg, setErrMsg] = useStateCE("");

  const reload = async () => {
    setLoading(true);
    const r = await api.listAllCampaigns();
    setCampaigns(r.error ? [] : r.data);
    setLoading(false);
  };
  useEffectCE(() => { reload(); }, []);

  const startNew = () => setEditing({
    slug: "", name: "", tag: "", description: "", brief_md: "", rpm: 1.00,
    min_views: 1000, payout_floor: 20, monthly_budget: 25000, budget_remaining: 25000,
    status: "draft", tint: "#6366f1",
    examples: [], assets: [], dos: [], donts: [], discord_url: "",
  });
  const startEdit = (c) => setEditing({ ...c });

  const save = async () => {
    setErrMsg(""); setBusy(true);
    if (!editing.name || !editing.slug) { setErrMsg("Name and slug required."); setBusy(false); return; }
    const payload = {
      ...editing,
      rpm: Number(editing.rpm) || 0,
      min_views: parseInt(editing.min_views, 10) || 0,
      payout_floor: Number(editing.payout_floor) || 0,
      monthly_budget: Number(editing.monthly_budget) || 0,
      budget_remaining: Number(editing.budget_remaining) || 0,
      examples: parseList(editing.examples, "examples"),
      assets:   parseList(editing.assets, "assets"),
      dos:      parseList(editing.dos, "dos"),
      donts:    parseList(editing.donts, "donts"),
    };
    const r = await api.upsertCampaign(payload);
    setBusy(false);
    if (r.error) { setErrMsg(r.error.message || "Save failed."); return; }
    setEditing(null);
    await reload();
    onChanged && onChanged();
  };

  function parseList(v, kind){
    if (Array.isArray(v)) return v;
    if (typeof v === "string") {
      const t = v.trim();
      if (!t) return [];
      if (t.startsWith("[")) { try { return JSON.parse(t); } catch { return []; } }
      // newline-separated simple strings (for dos/donts)
      if (kind === "dos" || kind === "donts") return t.split("\n").map(x=>x.trim()).filter(Boolean);
      return [];
    }
    return [];
  }

  if (editing) return <Editor editing={editing} setEditing={setEditing} save={save} busy={busy} errMsg={errMsg} onCancel={()=>setEditing(null)}/>;

  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",flexWrap:"wrap",gap:12}}>
        <div>
          <Eyebrow>CAMPAIGNS</Eyebrow>
          <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>Manage your campaigns</div>
        </div>
        <button onClick={startNew} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 14px",background:"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:10,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:14,cursor:"pointer"}}><Icon name="plus" size={15}/> New campaign</button>
      </div>

      {loading ? <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div> : campaigns.length === 0 ? (
        <div style={{background:"#fff",border:"1px dashed #E8E6DF",borderRadius:14,padding:32,textAlign:"center",color:"#6E6D66",fontSize:14}}>
          No campaigns yet. Create one to start accepting clips.
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {campaigns.map(c => (
            <div key={c.id} style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:18,display:"grid",gridTemplateColumns:"56px 1fr auto",gap:16,alignItems:"center"}}>
              <div style={{width:48,height:48,borderRadius:10,background:`linear-gradient(135deg, ${c.tint||"#6366f1"}, #1a1a1a)`,display:"grid",placeItems:"center",color:"#fff"}}><Icon name="flag" size={20}/></div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <h3 style={{fontSize:16,fontWeight:600,letterSpacing:"-0.01em",margin:0}}>{c.name}</h3>
                  <Badge tone={c.status==="live" ? "live" : c.status==="paused" ? "pending" : "draft"}>{c.status}</Badge>
                  <span style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66"}}>/{c.slug}</span>
                </div>
                <div style={{fontSize:12,color:"#6E6D66",marginTop:4,fontFamily:"Geist Mono,monospace"}}>
                  RPM ${Number(c.rpm).toFixed(2)} · Min {(c.min_views||0).toLocaleString()} views · Floor ${Number(c.payout_floor).toFixed(0)} · Budget ${Number(c.budget_remaining||0).toLocaleString()} / ${Number(c.monthly_budget||0).toLocaleString()}
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={() => startEdit(c)} style={{padding:"7px 12px",background:"#fff",border:"1px solid #E8E6DF",borderRadius:8,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Editor({ editing, setEditing, save, busy, errMsg, onCancel }){
  const set = (k,v) => setEditing(e => ({...e, [k]: v}));
  const isNew = !editing.id;
  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:16,maxWidth:980}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",flexWrap:"wrap",gap:12}}>
        <div>
          <Eyebrow>{isNew ? "NEW CAMPAIGN" : "EDIT CAMPAIGN"}</Eyebrow>
          <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>{editing.name || "Untitled campaign"}</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onCancel} style={{padding:"9px 14px",background:"#fff",border:"1px solid #E8E6DF",borderRadius:10,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:14,cursor:"pointer"}}>Cancel</button>
          <button onClick={save} disabled={busy} style={{padding:"9px 14px",background:busy?"rgba(212,255,58,0.5)":"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:10,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:14,cursor:busy?"wait":"pointer"}}>
            {busy ? "Saving…" : "Save campaign"}
          </button>
        </div>
      </div>

      {errMsg && <div style={{padding:"10px 12px",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,color:"#B91C1C",fontSize:13}}>{errMsg}</div>}

      <Card title="Basics">
        <Row><Field label="Name" value={editing.name} onChange={v=>set("name", v)} placeholder="Rizz — AI dating replies"/><Field label="Slug (URL-safe)" value={editing.slug} onChange={v=>set("slug", v.toLowerCase().replace(/[^a-z0-9-]/g,"-"))} placeholder="rizz"/></Row>
        <Field label="Tag" value={editing.tag} onChange={v=>set("tag", v)} placeholder="Dating · Lifestyle"/>
        <Field label="Description" multiline value={editing.description} onChange={v=>set("description", v)} placeholder="One-sentence summary."/>
        <Field label="Brief (markdown)" multiline rows={5} value={editing.brief_md} onChange={v=>set("brief_md", v)} placeholder="Hook within 1.5s. Use the POV format. Show the app screen recording…"/>
        <Row>
          <Field label="Tint (hex)" value={editing.tint} onChange={v=>set("tint", v)} placeholder="#6366f1"/>
          <Field label="Status" select options={[{v:"draft",l:"Draft"},{v:"live",l:"Live"},{v:"paused",l:"Paused"},{v:"ended",l:"Ended"}]} value={editing.status} onChange={v=>set("status", v)}/>
        </Row>
        <Field label="Discord URL (optional)" value={editing.discord_url} onChange={v=>set("discord_url", v)} placeholder="https://discord.gg/xxxxx"/>
      </Card>

      <Card title="Economics">
        <Row><Field label="RPM ($ per 1K views)" type="number" step="0.05" value={editing.rpm} onChange={v=>set("rpm", v)}/><Field label="Min views per clip" type="number" step="1" value={editing.min_views} onChange={v=>set("min_views", v)}/></Row>
        <Row><Field label="Payout floor ($)" type="number" step="1" value={editing.payout_floor} onChange={v=>set("payout_floor", v)}/><Field label="Monthly budget ($)" type="number" step="1" value={editing.monthly_budget} onChange={v=>set("monthly_budget", v)}/></Row>
        <Field label="Budget remaining ($)" type="number" step="1" value={editing.budget_remaining} onChange={v=>set("budget_remaining", v)}/>
      </Card>

      <Card title="Examples carousel (YouTube / Shorts)">
        <ExamplesEditor examples={editing.examples} onChange={v => set("examples", v)}/>
      </Card>

      <Card title="Content (one per line / paste JSON)">
        <Field label="Do (one per line)" multiline rows={4} value={asTextLines(editing.dos)} onChange={v=>set("dos", v)}/>
        <Field label="Don't (one per line)" multiline rows={4} value={asTextLines(editing.donts)} onChange={v=>set("donts", v)}/>
        <Field label='Assets (JSON: [{"label","sub","url","kind","cta"}])' multiline rows={5} value={asJson(editing.assets)} onChange={v=>set("assets", v)}/>
      </Card>
    </div>
  );
}

function asTextLines(v){
  if (Array.isArray(v)) return v.join("\n");
  return v || "";
}
function asJson(v){
  if (typeof v === "string") return v;
  try { return JSON.stringify(v || [], null, 2); } catch { return "[]"; }
}

function Card({title, children}){
  return (
    <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"20px 22px",display:"flex",flexDirection:"column",gap:12}}>
      <h3 style={{fontSize:15,fontWeight:600,letterSpacing:"-0.01em",margin:0}}>{title}</h3>
      {children}
    </div>
  );
}
function Row({children}){
  return <div className="adm-edit-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>;
}
function Field({label, value, onChange, placeholder, type="text", multiline, rows=3, step, select, options}){
  return (
    <label style={{display:"flex",flexDirection:"column",gap:6}}>
      <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</span>
      {select ? (
        <select value={value || ""} onChange={e=>onChange(e.target.value)} style={inputStyle()}>
          {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : multiline ? (
        <textarea rows={rows} value={value || ""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...inputStyle(),height:"auto",padding:"10px 12px",resize:"vertical",fontFamily: type==="text" ? "Geist,sans-serif" : "Geist Mono,monospace",fontSize:13}}/>
      ) : (
        <input type={type} step={step} value={value === undefined || value === null ? "" : value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputStyle()}/>
      )}
    </label>
  );
}
function inputStyle(){ return {height:40,padding:"0 12px",fontFamily:"Geist,sans-serif",fontSize:14,border:"1px solid #E8E6DF",borderRadius:10,background:"#fff",outline:"none"}; }

function ExamplesEditor({ examples, onChange }){
  // Accept array or string-with-JSON; normalize to array of rows
  const list = Array.isArray(examples)
    ? examples
    : (typeof examples === "string" && examples.trim().startsWith("["))
      ? (() => { try { return JSON.parse(examples); } catch { return []; } })()
      : [];

  const update = (next) => onChange(next);
  const setRow = (i, patch) => update(list.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const addRow = () => update([...list, { url: "", hook: "", handle: "", views: "" }]);
  const removeRow = (i) => update(list.filter((_, idx) => idx !== i));
  const moveUp = (i) => {
    if (i === 0) return;
    const next = [...list];
    [next[i-1], next[i]] = [next[i], next[i-1]];
    update(next);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{fontSize:13,color:"#6E6D66",lineHeight:1.5}}>
        Add YouTube or YouTube Shorts URLs. The carousel on the brief page shows the thumbnail and plays the video in a popup when a clipper clicks.
      </div>
      {list.length === 0 && (
        <div style={{padding:"16px 18px",background:"#FAFAF7",border:"1px dashed #E8E6DF",borderRadius:10,fontSize:13,color:"#6E6D66",textAlign:"center"}}>
          No examples yet. Add one below.
        </div>
      )}
      {list.map((r, i) => (
        <ExampleRow key={i} row={r} index={i} count={list.length}
                    onChange={p => setRow(i, p)}
                    onRemove={() => removeRow(i)}
                    onMoveUp={() => moveUp(i)}/>
      ))}
      <div>
        <button type="button" onClick={addRow} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 14px",background:"#0A0A0A",color:"#FAFAF7",border:"none",borderRadius:10,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
          <Icon name="plus" size={14}/> Add YouTube example
        </button>
      </div>
    </div>
  );
}

function ExampleRow({ row, index, count, onChange, onRemove, onMoveUp }){
  const id = api.youtubeId(row.url);
  const thumb = id ? api.youtubeThumb(id) : null;
  const isYt = !!id;
  return (
    <div style={{display:"grid",gridTemplateColumns:"96px 1fr auto",gap:14,padding:"12px",border:"1px solid #E8E6DF",borderRadius:12,background:"#fff",alignItems:"start"}} className="adm-edit-row">
      <div style={{aspectRatio:"9/14",background:"#0A0A0A",borderRadius:8,overflow:"hidden",position:"relative"}}>
        {thumb ? (
          <img src={thumb} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>
        ) : (
          <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center",color:"rgba(255,255,255,0.4)",fontSize:10,fontFamily:"Geist Mono,monospace",letterSpacing:"0.06em",textAlign:"center",padding:6}}>
            paste<br/>YouTube<br/>URL
          </div>
        )}
        {isYt && <div style={{position:"absolute",top:4,right:4,padding:"2px 5px",background:"rgba(255,0,0,0.92)",borderRadius:4,fontFamily:"Geist Mono,monospace",fontSize:8,color:"#fff",letterSpacing:"0.06em",fontWeight:600}}>{api.isYoutubeShorts(row.url)?"SHORTS":"YT"}</div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:0}}>
        <input value={row.url || ""} onChange={e => onChange({ url: e.target.value })} placeholder="https://www.youtube.com/shorts/… or /watch?v=…"
               style={{height:38,padding:"0 12px",fontFamily:"Geist Mono,monospace",fontSize:12,border:"1px solid #E8E6DF",borderRadius:8,outline:"none"}}/>
        <input value={row.hook || ""} onChange={e => onChange({ hook: e.target.value })} placeholder="Hook (overlay caption shown on the card)"
               style={{height:38,padding:"0 12px",fontFamily:"Geist,sans-serif",fontSize:13,border:"1px solid #E8E6DF",borderRadius:8,outline:"none"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <input value={row.handle || ""} onChange={e => onChange({ handle: e.target.value })} placeholder="@handle"
                 style={{height:34,padding:"0 10px",fontFamily:"Geist Mono,monospace",fontSize:12,border:"1px solid #E8E6DF",borderRadius:8,outline:"none"}}/>
          <input value={row.views || ""} onChange={e => onChange({ views: e.target.value })} placeholder="Views label (e.g. 1.2M)"
                 style={{height:34,padding:"0 10px",fontFamily:"Geist Mono,monospace",fontSize:12,border:"1px solid #E8E6DF",borderRadius:8,outline:"none"}}/>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {index > 0 && (
          <button type="button" onClick={onMoveUp} title="Move up" style={{padding:"6px 10px",background:"#fff",border:"1px solid #E8E6DF",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"Geist Mono,monospace"}}>↑</button>
        )}
        <button type="button" onClick={onRemove} title="Remove" style={{padding:"6px 10px",background:"transparent",color:"#B91C1C",border:"1px solid #FECACA",borderRadius:8,cursor:"pointer",fontSize:12,fontFamily:"Geist,sans-serif",fontWeight:600}}>Remove</button>
      </div>
    </div>
  );
}

window.CampaignEditor = CampaignEditor;
