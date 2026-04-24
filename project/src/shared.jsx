/* global React */
// Shared primitives used across ALL surfaces — ink/lime system.
// Merges the marketing + dashboard helpers into one namespace so
// we don't get duplicate `Icon` / `Button` / etc definitions.

const { useState, useEffect, useRef } = React;

// ============ LOGO ============
const LogoMark = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#0A0A0A"/>
    <path d="M18 16 h18 a12 12 0 0 1 0 24 h-10 v8 h-8 V16z" fill="#D4FF3A"/>
    <path d="M28 24 l10 6 -10 6 z" fill="#0A0A0A"/>
  </svg>
);

const Wordmark = ({ onDark = true, brand = "payload" }) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <LogoMark size={28}/>
    <span style={{fontFamily:"Geist,sans-serif",fontSize:20,fontWeight:600,letterSpacing:"-0.02em",color:onDark?"#FAFAF7":"#0A0A0A"}}>{brand}</span>
  </div>
);

// ============ ICONS (combined set) ============
const Icon = ({name, size=18, stroke=1.75}) => {
  const p = {
    play:    <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 6 3-6 3V9z"/></>,
    dollar:  <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    chart:   <><path d="M3 3v18h18M7 14l4-4 4 4 6-6"/></>,
    upload:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></>,
    arrow:   <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check:   <><path d="M20 6 9 17l-5-5"/></>,
    clock:   <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    flame:   <><path d="M8 14c0-4 4-4 4-10 4 2 6 6 6 10a6 6 0 0 1-12 0z"/></>,
    sparkle: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></>,
    youtube: <><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 6 3-6 3V9z"/></>,
    tiktok:  <><path d="M9 12v4a3 3 0 1 0 3 3V4a5 5 0 0 0 5 5"/></>,
    wallet:  <><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M16 15h2"/></>,
    home:    <><path d="M3 11 12 3l9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V11z"/></>,
    flag:    <><path d="M4 21V4M4 4h14l-3 5 3 5H4"/></>,
    plus:    <><path d="M12 5v14M5 12h14"/></>,
    x:       <><path d="M18 6 6 18M6 6l12 12"/></>,
    down:    <><path d="M6 9l6 6 6-6"/></>,
    external:<><path d="M7 7h10v10M7 17 17 7"/></>,
    help:    <><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></>,
    eye:     <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    link:    <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    paypal:  <><path d="M6 4h8a4 4 0 0 1 0 8h-4l-1 8H5l2-16z"/><path d="M8 12h6a4 4 0 0 1 0 8H9"/></>,
    bank:    <><path d="M3 21h18M3 10h18M5 10 12 4l7 6M6 10v8M10 10v8M14 10v8M18 10v8"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.5a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.5a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z"/></>,
    bell:    <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></>,
    search:  <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></>,
    filter:  <><path d="M3 5h18l-7 9v5l-4 2v-7L3 5z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>;
};

// ============ BUTTON (dual-world — variant controls look) ============
const Button = ({variant="primary", size="md", pill=false, children, onClick, icon, full, style}) => {
  const sizes = {
    sm: {padding:"6px 12px", fontSize:12, borderRadius: pill?999:8},
    md: {padding:"10px 16px", fontSize:14, borderRadius: pill?999:10},
    lg: {padding:"13px 20px", fontSize:15, borderRadius: pill?999:10},
    xl: {padding:"16px 26px", fontSize:16, borderRadius: pill?999:12},
  }[size];
  const variants = {
    primary:   { background:"#D4FF3A", color:"#0A0A0A", border:"1px solid #D4FF3A", boxShadow: pill ? "0 0 0 1px rgba(212,255,58,0.4), 0 10px 28px rgba(212,255,58,0.28)" : "none" },
    // Dark-world secondary
    secondary: { background:"#1E1E1E", color:"#FAFAF7", border:"1px solid rgba(255,255,255,0.12)", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.06)" },
    // Light-world secondary (ink fill)
    ink:       { background:"#0A0A0A", color:"#FAFAF7", border:"1px solid #0A0A0A" },
    // Light-world ghost (bordered, ink text)
    ghost:     { background:"transparent", color:"#0A0A0A", border:"1px solid #E8E6DF" },
    // Dark-world ghost (no border, paper text) — used in marketing nav
    ghostDark: { background:"transparent", color:"#FAFAF7", border:"1px solid transparent" },
    // Lime alias used by some existing components
    lime:      { background:"#D4FF3A", color:"#0A0A0A", border:"1px solid #D4FF3A" },
    danger:    { background:"transparent", color:"#B91C1C", border:"1px solid #FECACA" },
  };
  return (
    <button onClick={onClick} style={{
      fontFamily:"Geist,sans-serif",fontWeight:600,letterSpacing:"-0.005em",cursor:"pointer",
      transition:"all 120ms cubic-bezier(0.2,0.8,0.2,1)",
      display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
      width:full?"100%":"auto",
      ...sizes, ...variants[variant], ...(style||{})
    }}>
      {children}{icon}
    </button>
  );
};

// ============ BADGE ============
const Badge = ({tone="neutral", children}) => {
  const tones = {
    live:     {bg:"rgba(16,185,129,0.14)", fg:"#4ADE80"},
    liveLight:{bg:"#ECFDF5", fg:"#047857"},
    lime:     {bg:"#D4FF3A", fg:"#0A0A0A"},
    neutral:  {bg:"rgba(255,255,255,0.08)", fg:"rgba(250,250,247,0.85)"},
    paid:     {bg:"#D4FF3A", fg:"#0A0A0A"},
    approved: {bg:"#ECFDF5",fg:"#047857"},
    pending:  {bg:"#FFFBEB",fg:"#B45309"},
    rejected: {bg:"#FEF2F2",fg:"#B91C1C"},
    draft:    {bg:"#F4F4F3",fg:"#6E6D66"},
  };
  const t = tones[tone] || tones.neutral;
  const showDot = tone==="live"||tone==="liveLight"||tone==="approved";
  return (
    <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",padding:"3px 9px",borderRadius:999,background:t.bg,color:t.fg,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
      {showDot && <span style={{width:5,height:5,borderRadius:999,background:t.fg}}/>}
      {children}
    </span>
  );
};

const Eyebrow = ({children, color, style}) => (
  <div style={{fontFamily:"Geist Mono,monospace",fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em",color: color || "#6E6D66", fontWeight:500, ...style}}>
    {children}
  </div>
);

// Phone frame
const PhoneFrame = ({ children, width = 220 }) => {
  const h = Math.round(width * 484 / 224);
  return (
    <div style={{position:"relative", width, height: h, borderRadius:32, background:"#0A0A0A", padding:6, boxShadow:"0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"}}>
      <div style={{position:"absolute", top:16, left:"50%", transform:"translateX(-50%)", width:"28%", height:18, borderRadius:9, background:"#0A0A0A", zIndex:2}}/>
      <div style={{position:"relative", width:"100%", height:"100%", borderRadius:26, overflow:"hidden", background:"#161614"}}>
        {children}
      </div>
    </div>
  );
};

// Toast stack for prototype feedback
function useToast(){
  const [toasts, setToasts] = useState([]);
  const push = (msg, tone="info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, {id, msg, tone}]);
    setTimeout(()=> setToasts(t => t.filter(x=>x.id!==id)), 3200);
  };
  const Toasts = () => (
    <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:200,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          minWidth:280,padding:"12px 18px",borderRadius:12,
          background:"#0A0A0A",color:"#FAFAF7",
          fontFamily:"Geist,sans-serif",fontSize:13,fontWeight:500,
          boxShadow:"0 18px 48px rgba(10,10,10,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          display:"flex",alignItems:"center",gap:10,
          animation:"tslideUp 240ms cubic-bezier(0.2,0.8,0.2,1)"
        }}>
          <span style={{width:6,height:6,borderRadius:999,background:t.tone==="success"?"#4ADE80":t.tone==="error"?"#EF4444":"#D4FF3A"}}/>
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes tslideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
  return {push, Toasts};
}

Object.assign(window, { LogoMark, Wordmark, Icon, Button, Badge, Eyebrow, PhoneFrame, useToast });
