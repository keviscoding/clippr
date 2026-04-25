/* global React, Icon, LogoMark, api */
const { useState: useStateAuth } = React;

function AuthModal({ open, mode="signup", onClose, onSwitch, onSuccess }){
  if (!open) return null;
  const [email, setEmail] = useStateAuth("");
  const [password, setPassword] = useStateAuth("");
  const [handle, setHandle] = useStateAuth("");
  const [busy, setBusy] = useStateAuth(false);
  const [errorMsg, setErrorMsg] = useStateAuth("");
  const [info, setInfo] = useStateAuth("");
  const isSignup = mode === "signup";

  const submit = async () => {
    setErrorMsg(""); setInfo("");
    if (!email || !password) { setErrorMsg("Email and password required."); return; }
    if (isSignup && password.length < 8) { setErrorMsg("Password must be at least 8 characters."); return; }
    setBusy(true);
    if (isSignup) {
      const r = await api.signUp({ email, password, displayName: handle ? handle.replace(/^@/,"") : email.split("@")[0] });
      if (r.error) { setErrorMsg(r.error.message || "Sign-up failed"); setBusy(false); return; }
      // Save handle if provided
      if (handle) {
        setTimeout(async () => { await api.updateMyProfile({ handle: handle.startsWith("@") ? handle : "@"+handle }); }, 600);
      }
      // If email confirmation is required, Supabase returns user with no session
      if (!r.data || !r.data.session) {
        setInfo("Account created! Check your email to confirm, then log in.");
        setBusy(false);
        return;
      }
      setBusy(false);
      onSuccess && onSuccess();
    } else {
      const r = await api.signIn({ email, password });
      setBusy(false);
      if (r.error) { setErrorMsg(r.error.message || "Login failed"); return; }
      onSuccess && onSuccess();
    }
  };

  const onKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(10,10,10,0.65)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} className="m-auth-card" style={{width:"100%",maxWidth:440,background:"#121212",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:32,boxShadow:"0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",color:"#FAFAF7"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:20}}>
          <LogoMark size={36}/>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"rgba(250,250,247,0.6)",cursor:"pointer",fontSize:22,lineHeight:1,padding:4}}>×</button>
        </div>
        <h2 style={{fontSize:28,fontWeight:600,letterSpacing:"-0.02em",margin:"0 0 6px"}}>{isSignup ? "Apply to clip" : "Welcome back"}</h2>
        <p style={{fontSize:14,color:"rgba(250,250,247,0.62)",margin:"0 0 24px",lineHeight:1.5}}>
          {isSignup ? "Takes 60 seconds. You'll be in the dashboard right after." : "Log in to your Clippr dashboard."}
        </p>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {isSignup && <AuthInput label="TikTok / YouTube handle" value={handle} onChange={setHandle} placeholder="@yourhandle"/>}
          <AuthInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" onKeyDown={onKey}/>
          <AuthInput label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" onKeyDown={onKey}/>
        </div>

        {errorMsg && (
          <div style={{marginTop:14,padding:"10px 12px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,color:"#FCA5A5",fontSize:13}}>{errorMsg}</div>
        )}
        {info && (
          <div style={{marginTop:14,padding:"10px 12px",background:"rgba(212,255,58,0.06)",border:"1px solid rgba(212,255,58,0.25)",borderRadius:8,color:"#D4FF3A",fontSize:13}}>{info}</div>
        )}

        <div style={{marginTop:24}}>
          <button onClick={submit} disabled={busy} style={{width:"100%",background:busy?"rgba(212,255,58,0.5)":"#D4FF3A",color:"#0A0A0A",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:15,padding:"14px 18px",border:"none",borderRadius:10,cursor:busy?"wait":"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {busy ? "Working…" : (isSignup ? "Create account" : "Log in")} <Icon name="arrow" size={15}/>
          </button>
        </div>
        <div style={{marginTop:16,fontSize:13,color:"rgba(250,250,247,0.55)",textAlign:"center"}}>
          {isSignup ? "Already a clipper? " : "New to Clippr? "}
          <a onClick={onSwitch} style={{color:"#D4FF3A",cursor:"pointer",fontWeight:500}}>{isSignup ? "Log in" : "Apply"}</a>
        </div>
      </div>
    </div>
  );
}

function AuthInput({label, value, onChange, placeholder, type="text", onKeyDown}){
  return (
    <label style={{display:"flex",flexDirection:"column",gap:6}}>
      <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(250,250,247,0.55)"}}>{label}</span>
      <input type={type} value={value||""} onChange={e=>onChange && onChange(e.target.value)} onKeyDown={onKeyDown} placeholder={placeholder} style={{
        height:44,padding:"0 14px",fontFamily:"Geist,sans-serif",fontSize:15,
        background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,
        color:"#FAFAF7",outline:"none"
      }}/>
    </label>
  );
}

window.AuthModal = AuthModal;
