/* global supabase */
// ==========================================================
// Clippr API layer.
// Wraps Supabase calls so components don't import supabase directly.
// All functions return { data, error } and never throw.
// ==========================================================

(function(){
  const cfg = window.CLIPPR_CONFIG || {};
  const configured = cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY;
  let client = null;
  if (configured && window.supabase && window.supabase.createClient) {
    client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
    });
  }

  const ok  = (data) => ({ data, error: null });
  const err = (error) => ({ data: null, error });

  const requireClient = () => {
    if (!client) return err({ message: "Backend not configured. Set SUPABASE_URL + SUPABASE_ANON_KEY in src/config.js." });
    return null;
  };

  // ---------- Auth ----------
  async function signUp({ email, password, displayName }){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.auth.signUp({
      email, password,
      options: { data: { display_name: displayName || email.split("@")[0] } }
    });
    return error ? err(error) : ok(data);
  }
  async function signIn({ email, password }){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    return error ? err(error) : ok(data);
  }
  async function signOut(){
    const r = requireClient(); if (r) return r;
    const { error } = await client.auth.signOut();
    return error ? err(error) : ok(true);
  }
  async function getSession(){
    if (!client) return ok(null);
    const { data, error } = await client.auth.getSession();
    return error ? err(error) : ok(data.session);
  }
  function onAuthStateChange(cb){
    if (!client) return () => {};
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => cb(session));
    return () => sub.subscription.unsubscribe();
  }

  // ---------- Profile ----------
  async function getMyProfile(){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return ok(null);
    const { data, error } = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
    return error ? err(error) : ok(data);
  }
  async function updateMyProfile(patch){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return err({ message: "Not signed in" });
    const { data, error } = await client.from("profiles").update(patch).eq("id", user.id).select().maybeSingle();
    return error ? err(error) : ok(data);
  }

  // ---------- Campaigns ----------
  async function listLiveCampaigns(){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("campaigns").select("*").eq("status", "live").order("created_at", { ascending: false });
    return error ? err(error) : ok(data || []);
  }
  async function listAllCampaigns(){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("campaigns").select("*").order("created_at", { ascending: false });
    return error ? err(error) : ok(data || []);
  }
  async function getCampaignBySlug(slug){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("campaigns").select("*").eq("slug", slug).maybeSingle();
    return error ? err(error) : ok(data);
  }
  async function getCampaign(id){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("campaigns").select("*").eq("id", id).maybeSingle();
    return error ? err(error) : ok(data);
  }
  async function upsertCampaign(c){
    const r = requireClient(); if (r) return r;
    const payload = { ...c, updated_at: new Date().toISOString() };
    const { data, error } = await client.from("campaigns").upsert(payload).select().maybeSingle();
    return error ? err(error) : ok(data);
  }

  // ---------- Helper: attach profile rows to a list of records ----------
  // Avoids relying on implicit FK joins (clips/payouts.user_id references
  // auth.users, not profiles, so PostgREST can't embed profiles directly).
  async function attachProfiles(rows, profileFields = "id, display_name, handle, paypal_email, country"){
    if (!rows || rows.length === 0) return rows || [];
    const userIds = [...new Set(rows.map(r => r.user_id).filter(Boolean))];
    if (userIds.length === 0) return rows;
    const { data, error } = await client.from("profiles").select(profileFields).in("id", userIds);
    if (error) return rows;
    const map = {};
    for (const p of (data || [])) map[p.id] = p;
    return rows.map(r => ({ ...r, profiles: map[r.user_id] || null }));
  }

  // ---------- Clips ----------
  async function submitClip({ campaignId, url, notes, platform }){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return err({ message: "Not signed in" });
    const detected = platform || detectPlatform(url);
    const { data, error } = await client.from("clips").insert({
      user_id: user.id, campaign_id: campaignId, url, notes: notes || null, platform: detected, status: "pending",
    }).select().maybeSingle();
    return error ? err(error) : ok(data);
  }
  async function listMyClips(){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return ok([]);
    const { data, error } = await client.from("clips").select("*, campaigns(name, slug, rpm, min_views, tint)").eq("user_id", user.id).order("submitted_at", { ascending: false });
    return error ? err(error) : ok(data || []);
  }
  async function listPendingClips(){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("clips").select("*, campaigns(name, slug, rpm, min_views, tint)").eq("status", "pending").order("submitted_at", { ascending: false });
    if (error) return err(error);
    const withProfiles = await attachProfiles(data || []);
    return ok(withProfiles);
  }
  async function listAllClips(){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("clips").select("*, campaigns(name, slug, rpm, min_views, tint)").order("submitted_at", { ascending: false }).limit(200);
    if (error) return err(error);
    const withProfiles = await attachProfiles(data || []);
    return ok(withProfiles);
  }
  async function reviewClip(id, { status, views, rejection_reason }){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    const patch = {
      status,
      views: typeof views === "number" ? views : undefined,
      rejection_reason: status === "rejected" ? (rejection_reason || null) : null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user ? user.id : null,
    };
    Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k]);
    const { data, error } = await client.from("clips").update(patch).eq("id", id).select().maybeSingle();
    if (error) return err(error);
    // Recompute earnings
    await client.rpc("recompute_clip_earned", { clip_id: id });
    const { data: refreshed } = await client.from("clips").select("*").eq("id", id).maybeSingle();
    return ok(refreshed || data);
  }
  async function updateClipViews(id, views){
    return reviewClip(id, { status: undefined, views });
  }

  // ---------- Balance ----------
  async function getMyBalance(){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return ok({ total_earned: 0, total_pending_paid: 0, available_balance: 0 });
    const { data, error } = await client.from("clipper_balances").select("*").eq("user_id", user.id).maybeSingle();
    return error ? err(error) : ok(data || { total_earned: 0, total_pending_paid: 0, available_balance: 0 });
  }

  // ---------- Payouts ----------
  async function requestPayout({ amount, method, destination }){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return err({ message: "Not signed in" });
    const { data, error } = await client.from("payouts").insert({
      user_id: user.id, amount, method, destination, status: "pending"
    }).select().maybeSingle();
    return error ? err(error) : ok(data);
  }
  async function listMyPayouts(){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    if (!user) return ok([]);
    const { data, error } = await client.from("payouts").select("*").eq("user_id", user.id).order("requested_at", { ascending: false });
    return error ? err(error) : ok(data || []);
  }
  async function listAllPayouts(){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("payouts").select("*").order("requested_at", { ascending: false }).limit(200);
    if (error) return err(error);
    return ok(await attachProfiles(data || []));
  }
  async function listPendingPayouts(){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("payouts").select("*").in("status", ["pending","processing"]).order("requested_at", { ascending: true });
    if (error) return err(error);
    return ok(await attachProfiles(data || []));
  }
  async function listRecentPaidPayouts(limit = 12){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("payouts").select("amount, paid_at, user_id").eq("status", "paid").order("paid_at", { ascending: false }).limit(limit);
    if (error) return err(error);
    return ok(await attachProfiles(data || [], "id, display_name, handle, country"));
  }
  async function processPayout(id, { status, txn_ref, notes }){
    const r = requireClient(); if (r) return r;
    const { data: { user } } = await client.auth.getUser();
    const patch = {
      status,
      txn_ref: txn_ref || null,
      notes: notes || null,
    };
    if (status === "paid") {
      patch.paid_at = new Date().toISOString();
      patch.paid_by = user ? user.id : null;
    }
    const { data, error } = await client.from("payouts").update(patch).eq("id", id).select().maybeSingle();
    return error ? err(error) : ok(data);
  }

  // ---------- Admin stats ----------
  async function getAdminStats(){
    const r = requireClient(); if (r) return r;
    const [pendingClips, allClips, pendingPayouts, allPayouts, profiles] = await Promise.all([
      client.from("clips").select("id", { count: "exact", head: true }).eq("status", "pending"),
      client.from("clips").select("views, earned, status"),
      client.from("payouts").select("amount", { count: "exact" }).in("status", ["pending","processing"]),
      client.from("payouts").select("amount, status"),
      client.from("profiles").select("id", { count: "exact", head: true }),
    ]);
    const totalViews = (allClips.data || []).filter(c => c.status === "approved").reduce((s,c) => s + (c.views || 0), 0);
    const totalPaid  = (allPayouts.data || []).filter(p => p.status === "paid").reduce((s,p) => s + Number(p.amount || 0), 0);
    const pendingPayoutAmount = (pendingPayouts.data || []).reduce((s,p) => s + Number(p.amount || 0), 0);
    return ok({
      pendingClipsCount: pendingClips.count || 0,
      pendingPayoutsCount: (pendingPayouts.data || []).length,
      pendingPayoutAmount,
      totalViews,
      totalPaid,
      totalClippers: profiles.count || 0,
    });
  }

  // ---------- Helpers ----------
  function detectPlatform(url){
    if (!url) return "other";
    const u = url.toLowerCase();
    if (u.includes("tiktok.com")) return "tiktok";
    if (u.includes("instagram.com")) return "instagram";
    if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
    return "other";
  }

  // Extract YouTube video id from any youtube/shorts/youtu.be URL.
  function youtubeId(url){
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "").toLowerCase();
      if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
      if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
        if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
        if (u.pathname.startsWith("/embed/"))  return u.pathname.split("/")[2] || null;
        if (u.pathname === "/watch")           return u.searchParams.get("v");
      }
      return null;
    } catch { return null; }
  }
  function isYoutubeShorts(url){ return /youtube\.com\/shorts\//i.test(url||""); }
  function youtubeThumb(id){ return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null; }
  function youtubeEmbed(id, { autoplay=true, mute=false } = {}){
    if (!id) return null;
    const params = new URLSearchParams({ autoplay: autoplay?"1":"0", mute: mute?"1":"0", playsinline:"1", rel:"0", modestbranding:"1" });
    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  }

  // Instagram (post / reel / tv)
  function instagramShortcode(url){
    if (!url) return null;
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "").toLowerCase();
      if (!host.endsWith("instagram.com")) return null;
      const m = u.pathname.match(/^\/(?:reel|reels|p|tv)\/([^\/?#]+)/);
      return m ? m[1] : null;
    } catch { return null; }
  }
  function isInstagram(url){ return !!instagramShortcode(url); }
  function isInstagramReel(url){
    if (!url) return false;
    try {
      const u = new URL(url);
      return /^\/(reel|reels)\//.test(u.pathname);
    } catch { return false; }
  }
  function instagramEmbed(shortcode){
    return shortcode ? `https://www.instagram.com/p/${shortcode}/embed/?cr=1&v=14` : null;
  }
  function videoKindFromUrl(url){
    if (youtubeId(url)) return isYoutubeShorts(url) ? "yt-shorts" : "yt";
    if (isInstagramReel(url)) return "ig-reel";
    if (isInstagram(url)) return "ig";
    return "other";
  }

  // ---------- Campaign stats (admin-only / informational) ----------
  async function getCampaignStats(campaignId){
    const r = requireClient(); if (r) return r;
    const { data, error } = await client.from("clips").select("user_id, status, views, earned").eq("campaign_id", campaignId);
    if (error) return err(error);
    const rows = data || [];
    const clipperSet = new Set(rows.map(r => r.user_id));
    const totalClips = rows.length;
    const totalViews = rows.filter(r => r.status === "approved").reduce((s,r) => s + (r.views || 0), 0);
    const totalEarned = rows.filter(r => r.status === "approved").reduce((s,r) => s + Number(r.earned || 0), 0);
    return ok({ clipperCount: clipperSet.size, totalClips, totalViews, totalEarned });
  }

  // Expose
  window.api = {
    isConfigured: !!client,
    client,
    // auth
    signUp, signIn, signOut, getSession, onAuthStateChange,
    // profile
    getMyProfile, updateMyProfile,
    // campaigns
    listLiveCampaigns, listAllCampaigns, getCampaignBySlug, getCampaign, upsertCampaign, getCampaignStats,
    // clips
    submitClip, listMyClips, listPendingClips, listAllClips, reviewClip, updateClipViews,
    // balance
    getMyBalance,
    // payouts
    requestPayout, listMyPayouts, listAllPayouts, listPendingPayouts, listRecentPaidPayouts, processPayout,
    // admin
    getAdminStats,
    // helpers
    detectPlatform, youtubeId, isYoutubeShorts, youtubeThumb, youtubeEmbed,
    instagramShortcode, isInstagram, isInstagramReel, instagramEmbed, videoKindFromUrl,
  };
})();
