/* global React, Button, Icon, LogoMark */
const { useState } = React;

function AuthModal({ open, mode="signup", onClose, onSwitch, onSuccess }){
  if (!open) return null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSignup = mode==="signup";

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(10,10,10,0.65)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:440,background:"#121212",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:32,boxShadow:"0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",color:"#FAFAF7"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:20}}>
          <LogoMark size={36}/>
          <button onClick={onClose} style={{background:"transparent",border:"none",color:"rgba(250,250,247,0.6)",cursor:"pointer",fontSize:22,lineHeight:1,padding:4}}>×</button>
        </div>
        <h2 style={{fontSize:28,fontWeight:600,letterSpacing:"-0.02em",margin:"0 0 6px"}}>{isSignup ? "Apply to clip" : "Welcome back"}</h2>
        <p style={{fontSize:14,color:"rgba(250,250,247,0.62)",margin:"0 0 24px",lineHeight:1.5}}>
          {isSignup ? "Takes 3 min. You'll get campaign access within 24 hours." : "Log in to your Payload clipper dashboard."}
        </p>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {isSignup && <AuthInput label="TikTok / YouTube handle" placeholder="@yourhandle" />}
          <AuthInput label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com"/>
          <AuthInput label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••"/>
          {isSignup && <AuthInput label="Referral code (optional)" placeholder="KEVIS2026" />}
        </div>

        <div style={{marginTop:24}}>
          <button onClick={()=> onSuccess ? onSuccess() : onClose && onClose()} style={{width:"100%",background:"#D4FF3A",color:"#0A0A0A",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:15,padding:"14px 18px",border:"none",borderRadius:10,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {isSignup ? "Create account" : "Log in"} <Icon name="arrow" size={15}/>
          </button>
        </div>
        <div style={{marginTop:16,fontSize:13,color:"rgba(250,250,247,0.55)",textAlign:"center"}}>
          {isSignup ? "Already a clipper? " : "New to Payload? "}
          <a onClick={onSwitch} style={{color:"#D4FF3A",cursor:"pointer",fontWeight:500}}>{isSignup ? "Log in" : "Apply"}</a>
        </div>
      </div>
    </div>
  );
}

function AuthInput({label, value, onChange, placeholder, type="text"}){
  return (
    <label style={{display:"flex",flexDirection:"column",gap:6}}>
      <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"rgba(250,250,247,0.55)"}}>{label}</span>
      <input type={type} value={value} onChange={e=>onChange && onChange(e.target.value)} placeholder={placeholder} style={{
        height:44,padding:"0 14px",fontFamily:"Geist,sans-serif",fontSize:15,
        background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,
        color:"#FAFAF7",outline:"none"
      }}/>
    </label>
  );
}

window.AuthModal = AuthModal;
