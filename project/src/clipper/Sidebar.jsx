/* global React, LogoMark, Icon */

function Sidebar({ view, setView }){
  const items = [
    {id:"overview", label:"Overview", icon:"home"},
    {id:"campaigns", label:"Campaigns", icon:"flag"},
    {id:"clips", label:"My clips", icon:"chart"},
    {id:"payouts", label:"Payouts", icon:"wallet"},
  ];
  return (
    <aside style={{width:240,background:"#FAFAF7",borderRight:"1px solid #E8E6DF",padding:"18px 14px",display:"flex",flexDirection:"column",gap:4,height:"100vh",position:"sticky",top:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 8px 18px"}}>
        <LogoMark size={26}/>
        <span style={{fontFamily:"Geist,sans-serif",fontSize:17,fontWeight:600,letterSpacing:"-0.02em"}}>payload</span>
      </div>
      {items.map(i => (
        <button key={i.id} onClick={()=>setView(i.id)} style={{
          display:"flex",alignItems:"center",gap:10,padding:"9px 12px",border:"none",background: view===i.id ? "#fff" : "transparent",
          borderRadius:10,cursor:"pointer",fontFamily:"Geist,sans-serif",fontSize:14,fontWeight: view===i.id?600:500,
          color: view===i.id ? "#0A0A0A" : "#4A4A45",textAlign:"left",
          boxShadow: view===i.id ? "0 1px 2px rgba(10,10,10,0.04), 0 0 0 1px #E8E6DF" : "none"
        }}>
          <Icon name={i.icon} size={17}/> {i.label}
        </button>
      ))}
      <div style={{marginTop:"auto",padding:12,background:"#fff",border:"1px solid #E8E6DF",borderRadius:12}}>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66",marginBottom:4}}>NEXT PAYOUT</div>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:20,fontWeight:500,color:"#0A0A0A"}}>$148.20</div>
        <div style={{fontSize:12,color:"#6E6D66",marginTop:2}}>Friday · 3 days</div>
      </div>
    </aside>
  );
}

function Topbar({ onSubmit, onView }){
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 28px",borderBottom:"1px solid #E8E6DF",background:"rgba(250,250,247,0.8)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:10}}>
      <div>
        <div style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>HEY ARJUN</div>
        <div style={{fontSize:20,fontWeight:600,letterSpacing:"-0.015em",marginTop:2}}>Welcome back — 3 clips approved since yesterday.</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <button style={{padding:9,background:"#fff",border:"1px solid #E8E6DF",borderRadius:10,cursor:"pointer",color:"#4A4A45",display:"grid",placeItems:"center"}}><Icon name="help" size={18}/></button>
        <button onClick={onSubmit} style={{display:"inline-flex",alignItems:"center",gap:8,background:"#D4FF3A",color:"#0A0A0A",border:"none",borderRadius:10,padding:"9px 14px",fontFamily:"Geist,sans-serif",fontWeight:600,fontSize:14,cursor:"pointer"}}>
          <Icon name="plus" size={16}/> Submit clip
        </button>
        <div style={{width:36,height:36,borderRadius:999,background:"linear-gradient(135deg,#D4FF3A,#4ADE80)",display:"grid",placeItems:"center",fontWeight:600}}>A</div>
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.Topbar = Topbar;
