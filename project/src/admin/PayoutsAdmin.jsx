/* global React, Icon, Badge, Button, Eyebrow, api */
const { useState: useStatePA, useEffect: useEffectPA } = React;

function PayoutsAdmin({ onChanged }){
  const [tab, setTab] = useStatePA("pending");
  const [rows, setRows] = useStatePA([]);
  const [loading, setLoading] = useStatePA(true);
  const [busyId, setBusyId] = useStatePA(null);
  const [txnDraft, setTxnDraft] = useStatePA({});

  const reload = async () => {
    setLoading(true);
    const r = tab === "pending" ? await api.listPendingPayouts() : await api.listAllPayouts();
    setRows(r.error ? [] : r.data);
    setLoading(false);
  };
  useEffectPA(() => { reload(); }, [tab]);

  const setTxn = (id,v) => setTxnDraft(d => ({...d, [id]: v}));

  const markPaid = async (p) => {
    const txn = txnDraft[p.id] || null;
    setBusyId(p.id);
    await api.processPayout(p.id, { status: "paid", txn_ref: txn });
    setBusyId(null);
    await reload();
    onChanged && onChanged();
  };
  const markProcessing = async (p) => {
    setBusyId(p.id);
    await api.processPayout(p.id, { status: "processing" });
    setBusyId(null);
    await reload();
  };
  const markFailed = async (p) => {
    setBusyId(p.id);
    await api.processPayout(p.id, { status: "failed" });
    setBusyId(null);
    await reload();
  };

  const totalPending = rows.filter(r => r.status === "pending" || r.status === "processing").reduce((s,r) => s + Number(r.amount||0), 0);

  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"end"}}>
        <div>
          <Eyebrow>PAYOUTS</Eyebrow>
          <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>Process clipper payouts</div>
        </div>
        <div style={{display:"flex",gap:6,padding:4,background:"#F4F4F3",borderRadius:10}}>
          {[{k:"pending",l:`Pending${totalPending>0?` · $${totalPending.toFixed(2)}`:""}`},{k:"all",l:"All"}].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"7px 14px",border:"none",cursor:"pointer",background:tab===t.k?"#fff":"transparent",color:tab===t.k?"#0A0A0A":"#6E6D66",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,borderRadius:7,boxShadow:tab===t.k?"0 1px 2px rgba(10,10,10,0.06)":"none"}}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"14px 18px",background:"#FFFBEB",border:"1px solid #FEF3C7",borderRadius:12,fontSize:13,color:"#78350F",lineHeight:1.6}}>
        <b>Process flow:</b> 1. Send the PayPal / bank transfer manually using the destination shown. 2. Paste your txn reference. 3. Click "Mark paid" — clipper sees it instantly and balance drops accordingly.
      </div>

      {loading ? (
        <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{background:"#fff",border:"1px dashed #E8E6DF",borderRadius:14,padding:32,textAlign:"center",color:"#6E6D66",fontSize:14}}>
          {tab === "pending" ? "No payout requests pending." : "No payouts yet."}
        </div>
      ) : (
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["CLIPPER","AMOUNT","METHOD","DESTINATION","REQUESTED","STATUS","TXN / ACTION"].map(h => (
                <th key={h} style={{textAlign:"left",padding:"12px 16px",fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"#6E6D66",fontWeight:500,background:"#FAFAF7",borderBottom:"1px solid #F4F4F3"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {rows.map((p,i) => {
                const last = i === rows.length - 1;
                const pr = p.profiles || {};
                const tone = p.status === "paid" ? "paid" : p.status === "failed" ? "rejected" : p.status === "processing" ? "pending" : "pending";
                const dest = p.method === "paypal"
                  ? (pr.paypal_email || p.destination || "—")
                  : (p.destination || "Bank details on file");
                return (
                  <tr key={p.id}>
                    <td style={{padding:"12px 16px",borderBottom:last?"none":"1px solid #F4F4F3",fontSize:13}}>
                      <div style={{fontWeight:600}}>{pr.display_name || pr.handle || "anon"}</div>
                      <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,color:"#6E6D66"}}>{pr.handle || ""}</div>
                    </td>
                    <td style={{padding:"12px 16px",borderBottom:last?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontWeight:500}}>${Number(p.amount).toFixed(2)}</td>
                    <td style={{padding:"12px 16px",borderBottom:last?"none":"1px solid #F4F4F3",fontSize:13}}>{p.method === "paypal" ? "PayPal" : "Bank"}</td>
                    <td style={{padding:"12px 16px",borderBottom:last?"none":"1px solid #F4F4F3",fontSize:12,fontFamily:"Geist Mono,monospace",maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{dest}</td>
                    <td style={{padding:"12px 16px",borderBottom:last?"none":"1px solid #F4F4F3",fontSize:12,color:"#6E6D66"}}>{new Date(p.requested_at).toLocaleString(undefined, {month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</td>
                    <td style={{padding:"12px 16px",borderBottom:last?"none":"1px solid #F4F4F3"}}><Badge tone={tone}>{p.status}</Badge></td>
                    <td style={{padding:"12px 16px",borderBottom:last?"none":"1px solid #F4F4F3"}}>
                      {p.status === "paid" || p.status === "failed" ? (
                        <span style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"#6E6D66"}}>{p.txn_ref || "—"}</span>
                      ) : (
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <input placeholder="txn ref" defaultValue={p.txn_ref || ""} onChange={e => setTxn(p.id, e.target.value)} style={{height:30,padding:"0 8px",fontFamily:"Geist Mono,monospace",fontSize:12,border:"1px solid #E8E6DF",borderRadius:6,outline:"none",width:120}}/>
                          <button onClick={() => markPaid(p)} disabled={busyId === p.id} style={{padding:"6px 10px",background:"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:6,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:12,cursor:busyId===p.id?"wait":"pointer"}}>{busyId===p.id?"…":"Mark paid"}</button>
                          {p.status === "pending" && <button onClick={() => markProcessing(p)} disabled={busyId === p.id} style={{padding:"6px 10px",background:"#fff",color:"#0A0A0A",border:"1px solid #E8E6DF",borderRadius:6,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>Processing</button>}
                          <button onClick={() => markFailed(p)} disabled={busyId === p.id} style={{padding:"6px 10px",background:"transparent",color:"#B91C1C",border:"1px solid #FECACA",borderRadius:6,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>Fail</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

window.PayoutsAdmin = PayoutsAdmin;
