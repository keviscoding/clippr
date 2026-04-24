/* global React, Icon, Eyebrow, Badge, Button */

function PayoutsPanel(){
  const payouts = [
    {date:"Apr 19, 2026", amount:148.20, method:"PayPal", status:"paid", txn:"PYLD-1288"},
    {date:"Apr 12, 2026", amount:204.60, method:"PayPal", status:"paid", txn:"PYLD-1217"},
    {date:"Apr 5, 2026",  amount:92.40,  method:"PayPal", status:"paid", txn:"PYLD-1141"},
    {date:"Mar 29, 2026", amount:318.00, method:"PayPal", status:"paid", txn:"PYLD-1072"},
  ];
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:22}}>
          <Eyebrow>PAYOUT METHOD</Eyebrow>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:40,height:40,borderRadius:10,background:"#EFF6FF",color:"#3B82F6",display:"grid",placeItems:"center"}}><Icon name="paypal" size={20}/></div>
              <div>
                <div style={{fontSize:15,fontWeight:600}}>PayPal</div>
                <div style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"#6E6D66"}}>kevis@mail.com</div>
              </div>
            </div>
            <Button variant="ghost" size="sm">Change</Button>
          </div>
          <div style={{fontSize:12,color:"#6E6D66",marginTop:12,paddingTop:12,borderTop:"1px solid #F4F4F3"}}>Payouts sent every Friday at 12:00 UTC. Usually land within 24h.</div>
        </div>
        <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,padding:22}}>
          <Eyebrow>AVAILABLE</Eyebrow>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}>
            <div style={{fontFamily:"Geist Mono,monospace",fontSize:32,fontWeight:500,letterSpacing:"-0.01em"}}>$148.20</div>
            <div style={{fontSize:12,color:"#6E6D66",fontFamily:"Geist Mono,monospace"}}>Next auto-payout Fri</div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <Button variant="primary" size="md">Request now</Button>
            <Button variant="ghost" size="md">Schedule</Button>
          </div>
        </div>
      </div>

      <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden"}}>
        <div style={{padding:"14px 22px",borderBottom:"1px solid #F4F4F3",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:15,fontWeight:600}}>Payout history</div>
          <div style={{fontFamily:"Geist Mono,monospace",fontSize:12,color:"#6E6D66"}}>Total lifetime: $3,842.00</div>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {["DATE","AMOUNT","METHOD","STATUS","TXN",""].map(h => (
              <th key={h} style={{textAlign:"left",padding:"10px 22px",fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"#6E6D66",fontWeight:500,background:"#FAFAF7",borderBottom:"1px solid #F4F4F3"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {payouts.map((p,i) => (
              <tr key={i}>
                <td style={{padding:"14px 22px",borderBottom:i===payouts.length-1?"none":"1px solid #F4F4F3",fontSize:13}}>{p.date}</td>
                <td style={{padding:"14px 22px",borderBottom:i===payouts.length-1?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontWeight:500,color:"#047857"}}>${p.amount.toFixed(2)}</td>
                <td style={{padding:"14px 22px",borderBottom:i===payouts.length-1?"none":"1px solid #F4F4F3",fontSize:13}}>{p.method}</td>
                <td style={{padding:"14px 22px",borderBottom:i===payouts.length-1?"none":"1px solid #F4F4F3"}}><Badge tone="paid">PAID</Badge></td>
                <td style={{padding:"14px 22px",borderBottom:i===payouts.length-1?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:12,color:"#6E6D66"}}>{p.txn}</td>
                <td style={{padding:"14px 22px",borderBottom:i===payouts.length-1?"none":"1px solid #F4F4F3",textAlign:"right"}}><button style={{background:"transparent",border:"none",cursor:"pointer",color:"#4A4A45",padding:4}}><Icon name="external" size={15}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.PayoutsPanel = PayoutsPanel;
