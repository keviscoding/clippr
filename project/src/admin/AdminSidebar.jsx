/* global React, LogoMark, Icon */

function AdminSidebar({ view, setView }){
  const items = [
    {id:"overview",  label:"Overview",     icon:"home"},
    {id:"review",    label:"Review queue", icon:"check", count:8},
    {id:"campaigns", label:"Campaigns",    icon:"flag"},
    {id:"payouts",   label:"Payouts",      icon:"wallet", count:12},
    {id:"clippers",  label:"Clippers",     icon:"chart"},
  ];
  return (
    <aside style={{width:240,background:"#FAFAF7",borderRight:"1px solid #E8E6DF",padding:"18px 14px",display:"flex",flexDirection:"column",gap:4,height:"100vh",position:"sticky",top:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 8px 4px"}}>
        <LogoMark size={26}/>
        <span style={{fontFamily:"Geist,sans-serif",fontSize:17,fontWeight:600,letterSpacing:"-0.02em"}}>payload</span>
        <span style={{marginLeft:"auto",fontFamily:"Geist Mono,monospace",fontSize:9,padding:"2px 7px",background:"#0A0A0A",color:"#D4FF3A",borderRadius:6,letterSpacing:"0.08em",fontWeight:600}}>ADMIN</span>
      </div>
      <div style={{height:14}}/>
      {items.map(i => (
        <button key={i.id} onClick={()=>setView(i.id)} style={{
          display:"flex",alignItems:"center",gap:10,padding:"9px 12px",border:"none",background:view===i.id?"#fff":"transparent",
          borderRadius:10,cursor:"pointer",fontFamily:"Geist,sans-serif",fontSize:14,fontWeight:view===i.id?600:500,
          color:view===i.id?"#0A0A0A":"#4A4A45",textAlign:"left",
          boxShadow:view===i.id?"0 1px 2px rgba(10,10,10,0.04), 0 0 0 1px #E8E6DF":"none"
        }}>
          <Icon name={i.icon} size={17}/> <span>{i.label}</span>
          {i.count && <span style={{marginLeft:"auto",background:view===i.id?"#D4FF3A":"#0A0A0A",color:view===i.id?"#0A0A0A":"#FAFAF7",fontFamily:"Geist Mono,monospace",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:999}}>{i.count}</span>}
        </button>
      ))}
      <div style={{marginTop:"auto",padding:"12px 14px",background:"#0A0A0A",color:"#FAFAF7",borderRadius:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 100% 0%, rgba(212,255,58,0.2), transparent 60%)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontFamily:"Geist Mono,monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.1em",color:"#D4FF3A"}}>THIS WEEK · OUT</div>
          <div style={{fontFamily:"Geist Mono,monospace",fontSize:22,fontWeight:500,marginTop:4}}>$4,218.40</div>
          <div style={{fontSize:11,color:"rgba(250,250,247,0.6)",marginTop:2}}>To 28 clippers · Fri</div>
        </div>
      </div>
    </aside>
  );
}

window.AdminSidebar = AdminSidebar;
