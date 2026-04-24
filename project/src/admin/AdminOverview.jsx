/* global React, Icon, Eyebrow, Badge, Button */

function AdminOverview(){
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        <Kpi label="SPEND · 7D" value="$4,218.40" sub="+24% vs last" positive/>
        <Kpi label="VIEWS DELIVERED · 7D" value="4.2M" sub="Across 84 clips"/>
        <Kpi label="AVG EFFECTIVE CPM" value="$1.00" sub="Rizz · healthy"/>
        <Kpi label="PENDING REVIEWS" value="8" sub="Oldest: 2h ago" warning/>
      </div>

      <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:18}}>
          <div>
            <Eyebrow>ACTION NEEDED</Eyebrow>
            <div style={{fontSize:18,fontWeight:600,marginTop:4}}>Things on your plate</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <ActionRow icon="check" tone="#047857" bg="#ECFDF5" title="8 clips waiting for review" sub="2 over 6h old · avg 3.2min to review" cta="Open queue"/>
          <ActionRow icon="wallet" tone="#B45309" bg="#FFFBEB" title="12 payouts ready to release" sub="$1,248.60 total · auto-runs Friday 12:00 UTC" cta="Review & release"/>
          <ActionRow icon="flag" tone="#0A0A0A" bg="#F4F4F3" title="Rizz campaign: 68% of weekly budget spent" sub="Top up or reduce RPM to extend runway" cta="Adjust"/>
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

function ActionRow({icon,tone,bg,title,sub,cta}){
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",border:"1px solid #F4F4F3",borderRadius:10,background:"#fff"}}>
      <div style={{width:34,height:34,borderRadius:10,background:bg,color:tone,display:"grid",placeItems:"center"}}><Icon name={icon} size={18}/></div>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:600}}>{title}</div>
        <div style={{fontSize:12,color:"#6E6D66",fontFamily:"Geist Mono,monospace",marginTop:2}}>{sub}</div>
      </div>
      <Button variant="primary" size="sm" icon={<Icon name="arrow" size={13}/>}>{cta}</Button>
    </div>
  );
}

window.AdminOverview = AdminOverview;
