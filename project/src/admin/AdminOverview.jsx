/* global React, Icon, Eyebrow, Badge, Button */

function AdminOverview({ stats }){
  const s = stats || {};
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <Kpi label="TOTAL PAID · LIFETIME" value={`$${(s.totalPaid||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`} sub="To clippers" positive/>
        <Kpi label="VIEWS DELIVERED" value={(s.totalViews||0).toLocaleString()} sub="Across approved clips"/>
        <Kpi label="ACTIVE CLIPPERS" value={(s.totalClippers||0).toLocaleString()} sub="Profiles created"/>
        <Kpi label="PENDING REVIEWS" value={(s.pendingClipsCount||0).toLocaleString()} sub={s.pendingClipsCount > 0 ? "Open the queue →" : "Up to date"} warning={s.pendingClipsCount > 0}/>
      </div>

      <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:18}}>
          <div>
            <Eyebrow>ACTION NEEDED</Eyebrow>
            <div style={{fontSize:18,fontWeight:600,marginTop:4}}>Things on your plate</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {s.pendingClipsCount > 0 && (
            <ActionRow icon="check" tone="#047857" bg="#ECFDF5"
              title={`${s.pendingClipsCount} clip${s.pendingClipsCount===1?"":"s"} waiting for review`}
              sub="Approve or reject in the Review queue. Set the view count when approving."/>
          )}
          {s.pendingPayoutsCount > 0 && (
            <ActionRow icon="wallet" tone="#B45309" bg="#FFFBEB"
              title={`${s.pendingPayoutsCount} payout${s.pendingPayoutsCount===1?"":"s"} ready to send`}
              sub={`$${(s.pendingPayoutAmount||0).toFixed(2)} total · open Payouts to mark paid`}/>
          )}
          {(!s.pendingClipsCount && !s.pendingPayoutsCount) && (
            <div style={{padding:"12px 14px",border:"1px solid #F4F4F3",borderRadius:10,background:"#FAFAF7",fontSize:14,color:"#6E6D66"}}>
              Inbox zero. New submissions and payout requests will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({label,value,sub,positive,warning}){
  return (
    <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:"18px 20px"}}>
      <Eyebrow>{label}</Eyebrow>
      <div style={{fontFamily:"Geist Mono,monospace",fontSize:28,fontWeight:500,letterSpacing:"-0.01em",marginTop:8}}>{value}</div>
      <div style={{fontSize:12,marginTop:4,color:positive?"#047857":warning?"#B45309":"#6E6D66",fontFamily:"Geist Mono,monospace"}}>{sub}</div>
    </div>
  );
}

function ActionRow({icon,tone,bg,title,sub}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",border:"1px solid #F4F4F3",borderRadius:10,background:"#fff"}}>
      <div style={{width:34,height:34,borderRadius:10,background:bg,color:tone,display:"grid",placeItems:"center"}}><Icon name={icon} size={18}/></div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:600}}>{title}</div>
        <div style={{fontSize:12,color:"#6E6D66",fontFamily:"Geist Mono,monospace",marginTop:2}}>{sub}</div>
      </div>
    </div>
  );
}

window.AdminOverview = AdminOverview;
