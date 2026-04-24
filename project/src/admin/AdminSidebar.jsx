/* global React, LogoMark, Icon, api */
const { useState: useStateAS, useEffect: useEffectAS } = React;

function AdminSidebar({ view, setView, profile, onSignOut }){
  const [counts, setCounts] = useStateAS({ pending: 0, payouts: 0 });
  useEffectAS(() => {
    let mounted = true;
    api.getAdminStats().then(r => {
      if (mounted && !r.error) setCounts({ pending: r.data.pendingClipsCount, payouts: r.data.pendingPayoutsCount });
    });
    return () => { mounted = false; };
  }, [view]);
  const items = [
    {id:"overview",  label:"Overview",     icon:"home"},
    {id:"review",    label:"Review queue", icon:"check", count: counts.pending || null},
    {id:"campaigns", label:"Campaigns",    icon:"flag"},
    {id:"payouts",   label:"Payouts",      icon:"wallet", count: counts.payouts || null},
  ];
  const initial = (profile && profile.display_name && profile.display_name[0] ? profile.display_name[0] : "K").toUpperCase();
  return (
    <aside style={{width:240,background:"#FAFAF7",borderRight:"1px solid #E8E6DF",padding:"18px 14px",display:"flex",flexDirection:"column",gap:4,height:"100vh",position:"sticky",top:0}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"4px 8px 4px"}}>
        <LogoMark size={26}/>
        <span style={{fontFamily:"Geist,sans-serif",fontSize:17,fontWeight:600,letterSpacing:"-0.02em"}}>clippr</span>
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
          {i.count ? <span style={{marginLeft:"auto",background:view===i.id?"#D4FF3A":"#0A0A0A",color:view===i.id?"#0A0A0A":"#FAFAF7",fontFamily:"Geist Mono,monospace",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:999}}>{i.count}</span> : null}
        </button>
      ))}
      <div style={{marginTop:"auto"}}/>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 8px"}}>
        <div style={{width:32,height:32,borderRadius:999,background:"linear-gradient(135deg,#D4FF3A,#4ADE80)",display:"grid",placeItems:"center",fontWeight:700,color:"#0A0A0A",fontSize:13}}>{initial}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{profile && (profile.display_name || profile.handle) || "Admin"}</div>
          <div style={{fontSize:11,color:"#6E6D66"}}>Admin</div>
        </div>
        <button onClick={onSignOut} title="Sign out" style={{background:"transparent",border:"none",cursor:"pointer",color:"#6E6D66",padding:4}}><Icon name="external" size={15}/></button>
      </div>
    </aside>
  );
}

window.AdminSidebar = AdminSidebar;
