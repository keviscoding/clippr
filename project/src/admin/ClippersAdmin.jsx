/* global React, Icon, Eyebrow, Badge, api */
const { useState: useStateCA, useEffect: useEffectCA } = React;

function ClippersAdmin(){
  const [profiles, setProfiles] = useStateCA([]);
  const [loading, setLoading] = useStateCA(true);
  const [search, setSearch] = useStateCA("");

  useEffectCA(() => {
    let mounted = true;
    api.listAllProfiles().then(r => {
      if (!mounted) return;
      setProfiles(r.error ? [] : (r.data || []).filter(p => !p.is_admin));
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const filtered = search
    ? profiles.filter(p => {
        const q = search.toLowerCase();
        const fields = [p.display_name, p.handle, p.country, p.paypal_email, JSON.stringify(p.social_accounts)].join(" ").toLowerCase();
        return fields.includes(q);
      })
    : profiles;

  const platformIcon = (p) => p === "youtube" ? "youtube" : p === "tiktok" ? "tiktok" : "link";
  const platformColor = (p) => p === "youtube" ? "#FF0000" : p === "tiktok" ? "#0A0A0A" : p === "instagram" ? "#E1306C" : "#6E6D66";

  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",flexWrap:"wrap",gap:12}}>
        <div>
          <Eyebrow>CLIPPERS</Eyebrow>
          <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>All accounts ({profiles.length})</div>
        </div>
        <div style={{position:"relative"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clippers…"
            style={{height:38,width:260,padding:"0 12px 0 34px",fontFamily:"Geist,sans-serif",fontSize:13,border:"1px solid #E8E6DF",borderRadius:10,background:"#fff",outline:"none"}}/>
          <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#6E6D66"}}><Icon name="search" size={15}/></div>
        </div>
      </div>

      {loading ? <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div> : filtered.length === 0 ? (
        <div style={{background:"#fff",border:"1px dashed #E8E6DF",borderRadius:14,padding:32,textAlign:"center",color:"#6E6D66",fontSize:14}}>
          {search ? "No clippers match your search." : "No clippers have signed up yet."}
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map(p => {
            const accounts = Array.isArray(p.social_accounts) && p.social_accounts.length > 0
              ? p.social_accounts
              : p.handle ? [{ platform: "tiktok", handle: p.handle }] : [];
            const joined = p.created_at ? new Date(p.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—";
            return (
              <div key={p.id} style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"16px 20px",display:"flex",gap:16,alignItems:"start",flexWrap:"wrap"}}>
                <div style={{width:42,height:42,borderRadius:999,background:"linear-gradient(135deg,#D4FF3A,#4ADE80)",display:"grid",placeItems:"center",fontWeight:700,color:"#0A0A0A",fontSize:16,flexShrink:0}}>
                  {(p.display_name || "?")[0].toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <span style={{fontSize:15,fontWeight:600}}>{p.display_name || "Unnamed"}</span>
                    {p.country && <span style={{fontSize:12,color:"#6E6D66",fontFamily:"Geist Mono,monospace"}}>{p.country}</span>}
                  </div>
                  {accounts.length > 0 ? (
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                      {accounts.map((a,i) => (
                        <span key={i} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",background:"#F4F4F3",borderRadius:999,fontSize:12,fontFamily:"Geist Mono,monospace",color:"#0A0A0A"}}>
                          <Icon name={platformIcon(a.platform)} size={12} stroke={2}/>
                          <span style={{color:platformColor(a.platform),fontWeight:500}}>{a.platform}</span>
                          {a.handle}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div style={{fontSize:12,color:"#6E6D66",fontStyle:"italic",marginTop:6}}>No accounts added yet</div>
                  )}
                  <div style={{display:"flex",gap:16,marginTop:8,fontSize:11,fontFamily:"Geist Mono,monospace",color:"#6E6D66"}}>
                    <span>Joined {joined}</span>
                    {p.payout_method && <span>Payout: {p.payout_method}{p.payout_method === "paypal" && p.paypal_email ? ` (${p.paypal_email})` : ""}</span>}
                    {!p.payout_method && <span style={{color:"#B45309"}}>No payout method set</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

window.ClippersAdmin = ClippersAdmin;
