/* global React, Eyebrow, Icon */
const { useState: useStateFaq } = React;

const QA = [
  {
    q: "How much can I actually make?",
    a: "Pays $1.00 per 1,000 views on the Rizz campaign. A clip that lands 50K views = $50. A clip that goes viral at 500K = $500. We've had clippers make over $1,200 in a single month — but most realistically clear $80–$300 their first month while they figure out the format.",
  },
  {
    q: "When do I actually get paid?",
    a: "Payouts go out every Friday at 12:00 UTC. PayPal usually lands within minutes; bank transfers within 24 hours. Once your balance hits the $20 floor, you can request payout — or just let it auto-pay every Friday.",
  },
  {
    q: "Why is there a minimum view threshold?",
    a: "Each clip needs to pass 1,000 views before it counts toward your earnings. This stops people view-botting tiny clips for fractions of a cent. Once a clip clears 1K it pays at the full $1.00/1K rate from view zero.",
  },
  {
    q: "What if my clip gets taken down by TikTok?",
    a: "If it was taken down for copyright or community guidelines, the views before takedown still count — as long as the clip was live for at least 6 hours. Send us the URL in Discord and we'll verify the snapshot.",
  },
  {
    q: "Can I post the same clip to multiple accounts?",
    a: "Up to 2 accounts per clip is fine. Posting the exact same edit to 5+ accounts triggers our duplicate filter and only the highest-view version will count. Better strategy: re-edit with a different hook for each account.",
  },
  {
    q: "Do I need to show my face on camera?",
    a: "No. The whole point of the Rizz format is screen-recording the app + text overlays. Most of our top clippers never show their face. You can use a stock voiceover, AI voice, or just text + sound.",
  },
  {
    q: "I'm new with 0 followers. Can I still join?",
    a: "Yes. Most of our clippers started from 0. The TikTok algorithm doesn't care about your follower count — it cares about hook strength and watch-through. A new account can hit 100K views on its third post if the hook lands.",
  },
  {
    q: "How do you verify view counts?",
    a: "Our system polls each submitted URL every 30 minutes against TikTok / Instagram / YouTube's public APIs and stores the snapshot. You can see your view-count history live in the dashboard. We pay on platform-reported views, not estimates.",
  },
  {
    q: "What if my English isn't perfect?",
    a: "Doesn't matter. Most viral Rizz clips have zero spoken dialogue — just text overlays and a trending sound. We have clippers in Lagos, Manila, Mumbai, Karachi, and Cairo crushing it. The brief, sounds, and caption templates are all provided.",
  },
  {
    q: "What if I have a question that's not here?",
    a: "Drop it in the campaign Discord. Kevis or one of the campaign managers replies within 1–2 hours during business hours, usually faster. We'd rather you ask a 'dumb' question than waste effort posting wrong.",
  },
];

function Faq(){
  const [open, setOpen] = useStateFaq(0);
  return (
    <section id="faq" className="m-section" style={{padding:"80px 32px", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{maxWidth:880, margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="m-faq-h2" style={{fontSize:44,fontWeight:600,letterSpacing:"-0.025em",color:"#FAFAF7",margin:"10px 0 0",lineHeight:1.05}}>
            Everything you'll wonder<br/>before you start.
          </h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {QA.map((item,i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{background:"#121212",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden",transition:"all 200ms"}}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
                  width:"100%",padding:"18px 22px",background:"transparent",border:"none",color:"#FAFAF7",
                  display:"flex",justifyContent:"space-between",alignItems:"center",gap:14,textAlign:"left",
                  cursor:"pointer",fontFamily:"Geist,sans-serif",fontSize:16,fontWeight:500,letterSpacing:"-0.01em"
                }}>
                  <span>{item.q}</span>
                  <span style={{flexShrink:0,color:"rgba(250,250,247,0.55)",transition:"transform 200ms",transform:isOpen?"rotate(45deg)":"rotate(0)"}}>
                    <Icon name="plus" size={18}/>
                  </span>
                </button>
                {isOpen && (
                  <div style={{padding:"0 22px 20px",fontSize:15,color:"rgba(250,250,247,0.7)",lineHeight:1.6}}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="m-faq-cta" style={{marginTop:32,padding:"22px 26px",background:"rgba(212,255,58,0.06)",border:"1px solid rgba(212,255,58,0.2)",borderRadius:14,display:"flex",justifyContent:"space-between",alignItems:"center",gap:18,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:16,fontWeight:600,color:"#FAFAF7"}}>Still have questions?</div>
            <div style={{fontSize:13,color:"rgba(250,250,247,0.65)",marginTop:3}}>The campaign Discord is the fastest way — replies within 1–2 hours.</div>
          </div>
          <a href="#" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 16px",background:"#D4FF3A",color:"#0A0A0A",borderRadius:10,fontSize:14,fontWeight:600,fontFamily:"Geist,sans-serif",textDecoration:"none"}}>
            <Icon name="external" size={14}/> Join Discord
          </a>
        </div>
      </div>
    </section>
  );
}

window.Faq = Faq;
