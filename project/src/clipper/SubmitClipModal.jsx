/* global React, Icon, Eyebrow, Button */
const { useState } = React;

function SubmitClipModal({ open, onClose }){
  if (!open) return null;
  const [url, setUrl] = useState("");
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(10,10,10,0.5)",backdropFilter:"blur(6px)",display:"grid",placeItems:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:460,background:"#fff",borderRadius:20,padding:28,boxShadow:"0 32px 80px rgba(10,10,10,0.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:14}}>
          <div>
            <Eyebrow>SUBMIT CLIP · RIZZ</Eyebrow>
            <h2 style={{fontSize:22,fontWeight:600,letterSpacing:"-0.02em",margin:"6px 0 0"}}>Paste your clip URL</h2>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:"none",cursor:"pointer",padding:4,color:"#6E6D66"}}><Icon name="x" size={20}/></button>
        </div>
        <p style={{fontSize:13,color:"#6E6D66",margin:"0 0 20px",lineHeight:1.5}}>
          Public TikTok, Instagram Reels, or YouTube Shorts URL. We track views every 30 min. Clips count toward earnings once they pass <b style={{color:"#0A0A0A"}}>1,000 views</b>.
        </p>
        <label style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
          <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>CLIP URL</span>
          <div style={{display:"flex",alignItems:"center",border:"1px solid #E8E6DF",borderRadius:10,overflow:"hidden",background:"#fff"}}>
            <div style={{padding:"0 12px",color:"#A3A199"}}><Icon name="link" size={16}/></div>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://www.tiktok.com/@you/video/..." style={{flex:1,border:"none",outline:"none",height:42,fontFamily:"Geist,sans-serif",fontSize:14,padding:"0 0 0 2px"}}/>
          </div>
        </label>
        <label style={{display:"flex",flexDirection:"column",gap:6,marginBottom:6}}>
          <span style={{fontFamily:"Geist Mono,monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:"#6E6D66"}}>NOTES (OPTIONAL)</span>
          <textarea rows={3} placeholder="Anything the reviewer should know…" style={{border:"1px solid #E8E6DF",borderRadius:10,padding:"10px 12px",fontFamily:"Geist,sans-serif",fontSize:14,resize:"vertical",outline:"none"}}/>
        </label>
        <div style={{padding:"12px 14px",background:"#FFFBEB",border:"1px solid #FEF3C7",borderRadius:10,display:"flex",gap:10,alignItems:"start",marginTop:14}}>
          <div style={{color:"#B45309",marginTop:1}}><Icon name="clock" size={16}/></div>
          <div style={{fontSize:12,color:"#78350F",lineHeight:1.5}}>
            Reviews typically take <b>under 6 hours</b>. You'll get a Discord ping when yours is approved.
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:22}}>
          <Button variant="ghost" size="lg" full onClick={onClose}>Cancel</Button>
          <Button variant="lime" size="lg" full icon={<Icon name="arrow" size={15}/>}>Submit for review</Button>
        </div>
      </div>
    </div>
  );
}

window.SubmitClipModal = SubmitClipModal;
