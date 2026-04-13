import { useState, useRef, useCallback } from "react";

const NAV = [
  { label: "Dashboard", icon: GridIcon },
  { label: "Upload Songs", icon: UploadIcon, badge: "New", active: true },
  { label: "Playlist Analytics", icon: BarIcon },
  { label: "Users", icon: UsersIcon, badge: "12k" },
];
const LIB_NAV = [
  { label: "Moods", icon: HeadphonesIcon },
  { label: "All Songs", icon: MusicIcon },
];
const GENRES = ["Pop","Hip-Hop","R&B","Electronic","Jazz","Classical","Rock","Lo-fi","Ambient"];
const LANGS = ["English","Hindi","Spanish","French","Korean","Portuguese","Tamil","Arabic"];
const MOODS_PRESET = ["happy","chill","sad","energetic","romantic","focus","party","hype"];

const SAMPLE = [
  { name: "Golden Hour", genre: "Pop", size: "5.2 MB", mood: "chill", done: true },
  { name: "Midnight Pulse", genre: "Electronic", size: "6.8 MB", mood: "energetic", done: true },
  { name: "Rainy Day", genre: "Lo-fi", size: "4.1 MB", mood: "sad", done: true },
];

export default function MoodifyAdmin() {
  const [activeNav, setActiveNav] = useState("Upload Songs");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [genre, setGenre] = useState("");
  const [lang, setLang] = useState("");
  const [songs, setSongs] = useState(SAMPLE);
  const [progress, setProgress] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const fileRef = useRef();

  const addTag = (e) => {
    if (e.key !== "Enter") return;
    const val = tagInput.trim().toLowerCase();
    if (val && !tags.includes(val)) setTags([...tags, val]);
    setTagInput("");
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const handleFiles = useCallback((files) => {
    setPendingFiles(Array.from(files));
  }, []);

  const doUpload = () => {
    const count = pendingFiles.length || Math.floor(Math.random() * 3) + 1;
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => {
          setProgress(null);
          const names = ["Neon Drift","Solar Flare","Echo Valley","Deep Blue","Pixel Rain","Lost Signal","Warm Static","Night Owl"];
          const newSongs = Array.from({ length: count }, () => ({
            name: names[Math.floor(Math.random() * names.length)],
            genre: genre || "Electronic",
            size: (Math.random() * 8 + 2).toFixed(1) + " MB",
            mood: tags[0] || MOODS_PRESET[Math.floor(Math.random() * MOODS_PRESET.length)],
            done: true,
          }));
          setSongs((s) => [...newSongs, ...s]);
          setPendingFiles([]);
          showToast(`${count} song${count > 1 ? "s" : ""} uploaded!`, "Successfully added to Moodify library");
        }, 300);
      }
      setProgress(Math.round(p));
    }, 110);
  };

  const showToast = (title, sub) => {
    setToast({ title, sub });
    setTimeout(() => setToast(null), 3500);
  };
    
  return (
    <div style={{ background: "#0d0d14", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f1f0f8", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: 230, background: "#111120", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "24px 0", flexShrink: 0, minHeight: "100vh" }}>
        {/* Logo */}
        <div style={{ padding: "0 20px 28px", display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MusicNoteIcon size={19} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em" }}>Moodify</div>
            <div style={{ fontSize: 10, color: "#6b68a0", letterSpacing: "0.1em", textTransform: "uppercase" }}>Admin Panel</div>
          </div>
        </div>

        <NavSection label="Main Menu">
          {NAV.map((n) => (
            <NavItem key={n.label} {...n} isActive={activeNav === n.label} onClick={() => setActiveNav(n.label)} />
          ))}
        </NavSection>

        <NavSection label="Library" style={{ marginTop: 12 }}>
          {LIB_NAV.map((n) => (
            <NavItem key={n.label} {...n} isActive={activeNav === n.label} onClick={() => setActiveNav(n.label)} />
          ))}
        </NavSection>

        {/* Footer */}
        <div style={{ marginTop: "auto", padding: "16px 20px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>AD</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
              <div style={{ fontSize: 10, color: "#6b68a0" }}>Super Admin</div>
            </div>
            <div style={{ marginLeft: "auto", cursor: "pointer" }}>
              <SettingsIcon size={14} color="#6b68a0" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#111120" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>Admin Song Upload</h1>
            <p style={{ fontSize: 12, color: "#6b68a0", margin: "3px 0 0" }}>Upload and manage songs for Moodify</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 12, color: "#9490b0" }}>Live</span>
            </div>
            <IconBtn><BellIcon /></IconBtn>
            <IconBtn><SearchIcon /></IconBtn>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
            <StatCard icon={<MusicNoteIcon size={15} color="#a855f7" />} iconBg="rgba(168,85,247,0.15)" label="Total Songs" value="4,821" sub="+128 this week" subColor="#22c55e" />
            <StatCard icon={<TrendIcon size={15} color="#22c55e" />} iconBg="rgba(34,197,94,0.12)" label="Uploads Today" value="34" sub="+12 vs yesterday" subColor="#22c55e" />
            <StatCard icon={<HeadphonesIcon size={15} color="#f97316" />} iconBg="rgba(249,115,22,0.12)" label="Active Moods" value="18" sub="Across all genres" subColor="#9490b0" />
            <StatCard icon={<UsersIcon size={15} color="#ec4899" />} iconBg="rgba(236,72,153,0.12)" label="Active Users" value="12.4k" sub="+8.2% this month" subColor="#22c55e" />
          </div>

          {/* Upload Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Drop Zone Card */}
              <Card>
                <CardTitle icon={<UploadIcon size={14} color="#a855f7" />}>Drop your tracks</CardTitle>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current.click()}
                  style={{
                    border: `1.5px dashed ${dragging ? "#a855f7" : "rgba(124,58,237,0.4)"}`,
                    borderRadius: 12,
                    padding: "36px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragging ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.04)",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  <input ref={fileRef} type="file" multiple accept=".mp3,.wav,.flac,.aac" style={{ display: "none" }} onChange={(e) => handleFiles(e.target.files)} />
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: "rgba(124,58,237,0.18)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <UploadIcon size={22} color="#a855f7" />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>
                    {pendingFiles.length ? `${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""} ready` : "Drag & drop audio files"}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b68a0" }}>or click to browse files</div>
                  <div style={{ fontSize: 11, color: "#6b68a0", marginTop: 12, background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: "5px 14px", display: "inline-block" }}>MP3 · WAV · FLAC · AAC</div>
                </div>

                {/* Progress */}
                {progress !== null && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#6b68a0", marginBottom: 6 }}>
                      <span>{progress < 100 ? "Uploading..." : "Processing..."}</span>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: progress + "%", background: "linear-gradient(90deg,#7c3aed,#a855f7)", borderRadius: 99, transition: "width 0.3s" }} />
                    </div>
                  </div>
                )}
              </Card>

              {/* Song Details Card */}
              <Card>
                <CardTitle icon={<EditIcon size={14} color="#a855f7" />}>Song details</CardTitle>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: "#6b68a0", display: "block", marginBottom: 6 }}>Mood Tags</label>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type mood and press Enter (e.g. happy)"
                    style={{ width: "100%", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 13px", fontSize: 13, color: "#f1f0f8", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                  {tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                      {tags.map((t) => (
                        <span key={t} style={{ fontSize: 11, background: "rgba(168,85,247,0.14)", color: "#a855f7", borderRadius: 20, padding: "3px 10px", border: "1px solid rgba(168,85,247,0.25)", display: "flex", alignItems: "center", gap: 5 }}>
                          {t}
                          <span onClick={() => removeTag(t)} style={{ cursor: "pointer", opacity: 0.7, fontSize: 10 }}>✕</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#6b68a0", display: "block", marginBottom: 6 }}>Genre</label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ width: "100%", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 13px", fontSize: 13, color: genre ? "#f1f0f8" : "#6b68a0", outline: "none", fontFamily: "inherit" }}>
                      <option value="">Select genre</option>
                      {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#6b68a0", display: "block", marginBottom: 6 }}>Language</label>
                    <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ width: "100%", background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "10px 13px", fontSize: 13, color: lang ? "#f1f0f8" : "#6b68a0", outline: "none", fontFamily: "inherit" }}>
                      <option value="">Select language</option>
                      {LANGS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <button
                  onClick={doUpload}
                  disabled={progress !== null}
                  style={{ width: "100%", padding: "12px", background: progress !== null ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#a855f7)", border: "none", borderRadius: 10, color: "white", fontSize: 14, fontWeight: 600, cursor: progress !== null ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", transition: "opacity 0.18s" }}
                >
                  <UploadIcon size={15} color="#fff" />
                  Upload Songs
                </button>
              </Card>
            </div>

            {/* Right: Song List */}
            <Card style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <CardTitle icon={<HomeIcon size={14} color="#a855f7" />}>Uploaded Songs</CardTitle>
                <span style={{ fontSize: 11, color: "#6b68a0" }}>{songs.length} songs</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", flex: 1 }}>
                {songs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#6b68a0", fontSize: 13 }}>
                    <MusicNoteIcon size={32} color="rgba(124,58,237,0.3)" />
                    <p style={{ marginTop: 10 }}>No songs yet. Drop some tracks!</p>
                  </div>
                ) : (
                  songs.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 13px", background: "#1a1a2e", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.18s" }}>
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <MusicNoteIcon size={16} color="#a855f7" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</div>
                        <div style={{ fontSize: 11, color: "#6b68a0", marginTop: 1 }}>{s.genre} · {s.size}</div>
                      </div>
                      <span style={{ fontSize: 10, background: "rgba(168,85,247,0.14)", color: "#a855f7", borderRadius: 20, padding: "3px 9px", border: "1px solid rgba(168,85,247,0.25)", flexShrink: 0 }}>{s.mood}</span>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <CheckIcon size={11} color="#22c55e" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#1a2d22", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#f1f0f8", zIndex: 999, maxWidth: 300, animation: "slideUp 0.3s ease" }}>
          <div style={{ width: 28, height: 28, background: "rgba(34,197,94,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckIcon size={13} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{toast.title}</div>
            <div style={{ fontSize: 11, color: "#6b68a0", marginTop: 2 }}>{toast.sub}</div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        select option { background: #1a1a2e; color: #f1f0f8; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 99px; }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

/* ── Layout helpers ── */
function Card({ children, style }) {
  return (
    <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 22, ...style }}>
      {children}
    </div>
  );
}

function CardTitle({ icon, children }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      {icon}{children}
    </div>
  );
}

function NavSection({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: "#45435e", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 20px 10px" }}>{label}</div>
      {children}
    </div>
  );
}

function NavItem({ label, icon: Icon, badge, isActive, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 20px", cursor: "pointer", borderLeft: `2.5px solid ${isActive ? "#a855f7" : "transparent"}`, background: isActive ? "rgba(124,58,237,0.1)" : "transparent", color: isActive ? "#a855f7" : "#6b68a0", fontSize: 13.5, fontWeight: isActive ? 600 : 400, transition: "all 0.18s" }}>
      <Icon size={16} color={isActive ? "#a855f7" : "#6b68a0"} />
      {label}
      {badge && <span style={{ marginLeft: "auto", fontSize: 10, background: "#7c3aed", color: "#fff", padding: "1px 7px", borderRadius: 20 }}>{badge}</span>}
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, sub, subColor }) {
  return (
    <div style={{ background: "#111120", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 11, color: "#6b68a0", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, margin: "4px 0 2px", letterSpacing: "-0.02em" }}>{value}</div>
      <div style={{ fontSize: 11, color: subColor }}>{sub}</div>
    </div>
  );
}

function IconBtn({ children }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      {children}
    </div>
  );
}

/* ── SVG Icons ── */
function MusicNoteIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  );
}
function GridIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function UploadIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}
function BarIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
function UsersIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function HeadphonesIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  );
}
function MusicIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  );
}
function TrendIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}
function BellIcon({ size = 15, color = "#6b68a0" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function SearchIcon({ size = 15, color = "#6b68a0" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
function EditIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  );
}
function HomeIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function CheckIcon({ size = 12, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function SettingsIcon({ size = 14, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  );
}