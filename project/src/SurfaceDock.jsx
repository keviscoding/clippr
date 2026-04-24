/* global React, useToast, Icon */
// Top-level prototype chrome: surface switcher + keyboard nav.
// Small floating dock so you can jump between marketing / clipper / admin.

const { useState: useStateChrome, useEffect: useEffectChrome } = React;

function SurfaceDock({ surface, setSurface, hidden }){
  if (hidden) return null;
  const surfaces = [
    {id:"marketing", label:"Marketing", icon:"home"},
    {id:"clipper",   label:"Clipper",   icon:"wallet"},
    {id:"admin",     label:"Admin",     icon:"settings"},
  ];
  return (
    <div style={{
      position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:90,
      display:"inline-flex",alignItems:"center",gap:4,padding:4,
      background:"rgba(10,10,10,0.72)",
      backdropFilter:"blur(24px) saturate(140%)",
      WebkitBackdropFilter:"blur(24px) saturate(140%)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:999,
      boxShadow:"0 10px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      <div style={{padding:"0 10px 0 12px",fontFamily:"Geist Mono,monospace",fontSize:10,color:"rgba(212,255,58,0.9)",letterSpacing:"0.12em",fontWeight:600}}>PROTOTYPE</div>
      {surfaces.map(s => (
        <button key={s.id} onClick={()=>setSurface(s.id)} style={{
          display:"inline-flex",alignItems:"center",gap:7,padding:"7px 14px",borderRadius:999,border:"none",cursor:"pointer",
          background: surface===s.id ? "#D4FF3A" : "transparent",
          color: surface===s.id ? "#0A0A0A" : "rgba(250,250,247,0.72)",
          fontFamily:"Geist,sans-serif",fontSize:12,fontWeight:600,letterSpacing:"-0.005em",
          transition:"all 160ms cubic-bezier(0.2,0.8,0.2,1)"
        }}>
          <Icon name={s.icon} size={13}/> {s.label}
        </button>
      ))}
    </div>
  );
}

window.SurfaceDock = SurfaceDock;
