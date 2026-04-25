/* global React, Icon, Eyebrow, Button, api */
const { useState: useStateSP, useEffect: useEffectSP } = React;

function SettingsPanel({ profile, onSaved }){
  const [form, setForm] = useStateSP({
    handle:        (profile && profile.handle) || "",
    display_name:  (profile && profile.display_name) || "",
    country:       (profile && profile.country) || "",
    payout_method: (profile && profile.payout_method) || "paypal",
    paypal_email:  (profile && profile.paypal_email) || "",
    bank_summary:  (profile && profile.bank_details && profile.bank_details.summary) || "",
    bank_iban:     (profile && profile.bank_details && profile.bank_details.iban) || "",
    bank_swift:    (profile && profile.bank_details && profile.bank_details.swift) || "",
    bank_holder:   (profile && profile.bank_details && profile.bank_details.account_holder) || "",
  });
  const [busy, setBusy] = useStateSP(false);
  const [okMsg, setOkMsg] = useStateSP("");
  const [errMsg, setErrMsg] = useStateSP("");

  const set = (k,v) => setForm(f => ({...f, [k]: v}));

  const save = async () => {
    setOkMsg(""); setErrMsg("");
    setBusy(true);
    const patch = {
      handle: form.handle ? (form.handle.startsWith("@") ? form.handle : "@"+form.handle) : null,
      display_name: form.display_name || null,
      country: form.country || null,
      payout_method: form.payout_method,
    };
    if (form.payout_method === "paypal") {
      patch.paypal_email = form.paypal_email || null;
      patch.bank_details = null;
    } else {
      patch.paypal_email = null;
      patch.bank_details = {
        summary: form.bank_summary || null,
        iban: form.bank_iban || null,
        swift: form.bank_swift || null,
        account_holder: form.bank_holder || null,
      };
    }
    const r = await api.updateMyProfile(patch);
    setBusy(false);
    if (r.error) { setErrMsg(r.error.message || "Save failed."); return; }
    setOkMsg("Saved.");
    onSaved && onSaved(r.data);
    setTimeout(() => setOkMsg(""), 2400);
  };

  return (
    <div className="clp-page" style={{padding:28,display:"flex",flexDirection:"column",gap:16,maxWidth:760}}>
      <div>
        <Eyebrow>SETTINGS</Eyebrow>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>Your account &amp; payouts</div>
      </div>

      <Section title="Profile">
        <Field label="Handle (TikTok / YouTube)" value={form.handle} onChange={v=>set("handle", v)} placeholder="@yourhandle"/>
        <Field label="Display name" value={form.display_name} onChange={v=>set("display_name", v)} placeholder="Your name"/>
        <Field label="Country" value={form.country} onChange={v=>set("country", v)} placeholder="e.g. India, Philippines, Nigeria"/>
      </Section>

      <Section title="Payout method">
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <Pill active={form.payout_method==="paypal"} onClick={()=>set("payout_method","paypal")} icon="paypal">PayPal</Pill>
          <Pill active={form.payout_method==="bank"} onClick={()=>set("payout_method","bank")} icon="bank">Bank transfer</Pill>
        </div>
        {form.payout_method === "paypal" ? (
          <Field label="PayPal email" type="email" value={form.paypal_email} onChange={v=>set("paypal_email", v)} placeholder="paypal@email.com"/>
        ) : (
          <>
            <Field label="Account holder name" value={form.bank_holder} onChange={v=>set("bank_holder", v)} placeholder="Full name on the account"/>
            <Field label="IBAN / Account number" value={form.bank_iban} onChange={v=>set("bank_iban", v)} placeholder="IBAN or local account number"/>
            <Field label="SWIFT / BIC (international)" value={form.bank_swift} onChange={v=>set("bank_swift", v)} placeholder="SWIFT/BIC code"/>
            <Field label="Bank name + branch" value={form.bank_summary} onChange={v=>set("bank_summary", v)} placeholder="e.g. HDFC Bank, Mumbai"/>
          </>
        )}
      </Section>

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

function Section({title, children}){
  return (
    <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"20px 22px",display:"flex",flexDirection:"column",gap:14}}>
      <h3 style={{fontSize:16,fontWeight:600,letterSpacing:"-0.015em",margin:0}}>{title}</h3>
      {children}
    </div>
  );
}
function Field({label, value, onChange, type="text", placeholder}){
  return (
    <label style={{display:"flex",flexDirection:"column",gap:6}}>
      <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>{label}</span>
      <input type={type} value={value || ""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{height:42,padding:"0 12px",fontFamily:"Geist,sans-serif",fontSize:14,border:"1px solid #E8E6DF",borderRadius:10,background:"#fff",outline:"none"}}/>
    </label>
  );
}
function Pill({active, onClick, icon, children}){
  return (
    <button onClick={onClick} style={{
      display:"inline-flex",alignItems:"center",gap:8,padding:"8px 14px",
      borderRadius:999,fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",
      background: active ? "#0A0A0A" : "#fff",
      color: active ? "#FAFAF7" : "#0A0A0A",
      border:"1px solid " + (active ? "#0A0A0A" : "#E8E6DF"),
    }}>
      <Icon name={icon} size={14}/> {children}
    </button>
  );
}

window.SettingsPanel = SettingsPanel;
