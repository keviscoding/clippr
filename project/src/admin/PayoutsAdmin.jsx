/* global React, Icon, Badge, Button, Eyebrow */
const { useState } = React;

function PayoutsAdmin(){
  const [selected, setSelected] = useState([1,2,3]);
  const items = [
    {id:1, name:"Arjun M.",   flag:"🇮🇳", email:"arjun@mail.com",  method:"PayPal", amount:148.20, views:148200},
    {id:2, name:"Sofia R.",   flag:"🇵🇭", email:"sofia@mail.com",  method:"PayPal", amount: 62.40, views: 62400},
    {id:3, name:"Daniel O.",  flag:"🇳🇬", email:"daniel@mail.com", method:"PayPal", amount:204.60, views:204600},
    {id:4, name:"Luis G.",    flag:"🇲🇽", email:"luis@mail.com",   method:"Bank",   amount: 96.80, views: 96800},
    {id:5, name:"Thanh P.",   flag:"🇻🇳", email:"thanh@mail.com",  method:"PayPal", amount:132.00, views:132000},
    {id:6, name:"Mo H.",      flag:"🇲🇦", email:"mo@mail.com",     method:"PayPal", amount: 48.00, views: 48000},
  ];
  const total = items.filter(i=>selected.includes(i.id)).reduce((s,i)=>s+i.amount,0);

  const toggle = id => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id]);

  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
        <div>
          <Eyebrow>PAYOUTS · READY</Eyebrow>
          <div style={{fontSize:22,fontWeight:600,letterSpacing:"-0.02em",marginTop:4}}>Release Friday's payouts</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{padding:"8px 14px",background:"#fff",border:"1px solid #E8E6DF",borderRadius:10}}>
            <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,color:"#6E6D66",letterSpacing:"0.08em"}}>SELECTED · </span>
            <span style={{fontFamily:"Geist Mono,monospace",fontSize:14,fontWeight:600}}>${total.toFixed(2)}</span>
          </div>
          <Button variant="lime" size="md" icon={<Icon name="arrow" size={14}/>}>Release {selected.length} payouts</Button>
        </div>
      </div>

      <div style={{background:"#fff",border:"1px solid #E8E6DF",borderRadius:14,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {[" ","CLIPPER","EMAIL","METHOD","VIEWS","AMOUNT",""].map((h,i)=>(
              <th key={i} style={{textAlign:i===5?"right":"left",padding:"10px 18px",fontFamily:"Geist Mono,monospace",fontSize:10,letterSpacing:"0.08em",color:"#6E6D66",fontWeight:500,background:"#FAFAF7",borderBottom:"1px solid #F4F4F3"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {items.map((it,i) => (
              <tr key={it.id}>
                <td style={{padding:"12px 18px",borderBottom:i===items.length-1?"none":"1px solid #F4F4F3",width:40}}>
                  <button onClick={()=>toggle(it.id)} style={{width:18,height:18,borderRadius:5,border:"1px solid #D1CFC6",background:selected.includes(it.id)?"#D4FF3A":"#fff",cursor:"pointer",display:"grid",placeItems:"center",padding:0,color:"#0A0A0A"}}>
                    {selected.includes(it.id) && <Icon name="check" size={12} stroke={2.5}/>}
                  </button>
                </td>
                <td style={{padding:"12px 18px",borderBottom:i===items.length-1?"none":"1px solid #F4F4F3"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <span style={{fontSize:16}}>{it.flag}</span>
                    <span style={{fontSize:14,fontWeight:500}}>{it.name}</span>
                  </div>
                </td>
                <td style={{padding:"12px 18px",borderBottom:i===items.length-1?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:12,color:"#4A4A45"}}>{it.email}</td>
                <td style={{padding:"12px 18px",borderBottom:i===items.length-1?"none":"1px solid #F4F4F3",fontSize:13}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 8px",background:it.method==="PayPal"?"#EFF6FF":"#F4F4F3",borderRadius:999,fontSize:11,fontFamily:"Geist Mono,monospace",color:it.method==="PayPal"?"#1E40AF":"#4A4A45",letterSpacing:"0.04em"}}>
                    <Icon name={it.method==="PayPal"?"paypal":"bank"} size={12}/>{it.method}
                  </span>
                </td>
                <td style={{padding:"12px 18px",borderBottom:i===items.length-1?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:13,color:"#4A4A45"}}>{it.views.toLocaleString()}</td>
                <td style={{padding:"12px 18px",borderBottom:i===items.length-1?"none":"1px solid #F4F4F3",fontFamily:"Geist Mono,monospace",fontSize:14,fontWeight:600,textAlign:"right"}}>${it.amount.toFixed(2)}</td>
                <td style={{padding:"12px 18px",borderBottom:i===items.length-1?"none":"1px solid #F4F4F3",textAlign:"right"}}>
                  <button style={{background:"transparent",border:"none",cursor:"pointer",color:"#4A4A45",padding:4}}><Icon name="external" size={15}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.PayoutsAdmin = PayoutsAdmin;
