/* global React, Wordmark, Button, Icon */
const { useState, useEffect } = React;

function Nav({ onJoin, onLogin }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:50,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"14px 32px",
      background: scrolled ? "rgba(10,10,10,0.72)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(140%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px) saturate(140%)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      transition:"all 200ms cubic-bezier(0.2,0.8,0.2,1)"
    }}>
      <Wordmark/>
      <div style={{display:"flex",gap:28,alignItems:"center"}}>
        {["Campaigns","How it works","Proof","FAQ"].map(l => (
          <a key={l} href={"#" + l.toLowerCase().replace(/\s/g,"-")} style={{fontSize:14,color:"rgba(250,250,247,0.75)",fontWeight:500}}>{l}</a>
        ))}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <Button variant="ghostDark" size="md" onClick={onLogin}><span style={{whiteSpace:"nowrap"}}>Log in</span></Button>
        <Button variant="primary" size="md" onClick={onJoin} icon={<Icon name="arrow" size={15}/>}>Start earning</Button>
      </div>
    </nav>
  );
}

window.Nav = Nav;
