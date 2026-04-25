/* global React, Icon, Eyebrow, Badge, Button, api */
const { useState: useStatePP, useEffect: useEffectPP } = React;

function PayoutsPanel({ profile, onChanged }){
  const [balance, setBalance] = useStatePP(null);
  const [payouts, setPayouts] = useStatePP([]);
  const [busy, setBusy] = useStatePP(false);
  const [errMsg, setErrMsg] = useStatePP("");
  const [loading, setLoading] = useStatePP(true);

  const reload = async () => {
    const [b, p] = await Promise.all([api.getMyBalance(), api.listMyPayouts()]);
    setBalance(b.error ? null : b.data);
    setPayouts(p.error ? [] : p.data);
    setLoading(false);
  };

  useEffectPP(() => {
    let mounted = true;
    (async () => { await reload(); if (!mounted) return; })();
    return () => { mounted = false; };
  }, []);

  const available = balance ? Number(balance.available_balance) : 0;
  const lifetimePaid = payouts.filter(p => p.status === "paid").reduce((s,p) => s + Number(p.amount||0), 0);
  const method = (profile && profile.payout_method) || null;
  const destination = method === "paypal" ? (profile && profile.paypal_email) : (profile && profile.bank_details && (profile.bank_details.summary || "Bank account on file"));
  const canRequest = available >= 20 && method && destination;

  const requestPayout = async () => {
    setErrMsg("");
    if (!method || !destination) { setErrMsg("Set your payout method in Settings first."); return; }
    if (available < 20) { setErrMsg("Minimum cashout is $20."); return; }
    setBusy(true);
    const r = await api.requestPayout({ amount: Number(available.toFixed(2)), method, destination: typeof destination === "string" ? destination : JSON.stringify(destination) });
    setBusy(false);
    if (r.error) { setErrMsg(r.error.message || "Request failed."); return; }
    await reload();
    onChanged && onChanged();
  };

  if (loading) return <div style={{padding:28,fontSize:13,color:"#6E6D66"}}>Loading…</div>;

  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div className="clp-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:22}}>
          <Eyebrow>PAYOUT METHOD</Eyebrow>
          {method ? (
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:40,height:40,borderRadius:10,background:method==="paypal"?"#EFF6FF":"#F0FDF4",color:method==="paypal"?"#3B82F6":"#047857",display:"grid",placeItems:"center"}}><Icon name={method==="paypal"?"paypal":"bank"} size={20}/></div>
                <div>
                  <div style={{fontSize:15,fontWeight:600}}>{method === "paypal" ? "PayPal" : "Bank transfer"}</div>
                  <div style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"#6E6D66"}}>{typeof destination === "string" ? destination : "Bank details on file"}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{marginTop:10,padding:"12px 14px",background:"#FFFBEB",border:"1px solid #FEF3C7",borderRadius:10,fontSize:13,color:"#78350F",lineHeight:1.5}}>
              No payout method set. Add one in <b>Settings</b> before requesting.
            </div>
          )}
          <div style={{fontSize:12,color:"#6E6D66",marginTop:12,paddingTop:12,borderTop:"1px solid #F4F4F3"}}>Payouts sent every Friday at 12:00 UTC. Usually land within 24h. Cashout floor: $20.</div>
        </div>

        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:22}}>
          <Eyebrow>AVAILABLE</Eyebrow>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:32,fontWeight:500,letterSpacing:"-0.01em"}}>${available.toFixed(2)}</div>
            <div style={{fontSize:12,color:"#6E6D66",fontFamily:"Geist Mono,monospace"}}>{available >= 20 ? "Ready to withdraw" : `$${(20-available).toFixed(2)} to floor`}</div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button onClick={requestPayout} disabled={!canRequest || busy} style={{padding:"10px 14px",background: canRequest && !busy ? "#D4FF3A" : "#F4F4F3", color: canRequest && !busy ? "#0A0A0A" : "#6E6D66", border:"none", borderRadius:10, fontFamily:"Geist,sans-serif", fontWeight:600, fontSize:14, cursor: canRequest && !busy ? "pointer" : "not-allowed"}}>
              {busy ? "Requesting…" : "Request payout"}
            </button>
          </div>
          {errMsg && <div style={{marginTop:10,fontSize:12,color:"#B91C1C"}}>{errMsg}</div>}
        </div>
      </div>

      <div className="clp-table-wrap" style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"14px 22px",borderBottom:"1px solid #F4F4F3",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:15,fontWeight:600}}>Payout history</div>
          <div style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"#6E6D66"}}>Total lifetime: ${lifetimePaid.toFixed(2)}</div>
        </div>
        {payouts.length === 0 ? (
          <div style={{padding:"32px 22px",textAlign:"center",color:"#6E6D66",fontSize:13}}>No payouts yet. Once you hit the $20 floor, request your first.</div>
        ) : (
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>
              {["DATE","AMOUNT","METHOD","STATUS","TXN"].map(h => (
                <th key={h} style={{textAlign:"left",padding:"10px 22px",fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"#6E6D66",fontWeight:500,background:"#FAFAF7",borderBottom:"1px solid #F4F4F3"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {payouts.map((p,i) => {
                const last = i === payouts.length - 1;
                const tone = p.status === "paid" ? "paid" : p.status === "processing" ? "pending" : p.status === "failed" ? "rejected" : "pending";
                const date = p.paid_at || p.requested_at;
                return (
                  <tr key={p.id}>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",fontSize:13}}>{new Date(date).toLocaleDateString(undefined, {month:"short",day:"numeric",year:"numeric"})}</td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontWeight:500,color: p.status==="paid"?"#047857":"#0A0A0A"}}>${Number(p.amount).toFixed(2)}</td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",fontSize:13}}>{p.method === "paypal" ? "PayPal" : "Bank"}</td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3"}}><Badge tone={tone}>{p.status}</Badge></td>
                    <td style={{padding:"14px 22px",borderBottom:last?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:12,color:"#6E6D66"}}>{p.txn_ref || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

window.PayoutsPanel = PayoutsPanel;
