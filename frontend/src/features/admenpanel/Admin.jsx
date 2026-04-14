import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import UseAuth from "../auth/UseAuth";
import { getAdminSongs, uploadSong } from "../home/services/song.api";

const MOODS = ["happy", "sad", "surprised"];

export default function MoodifyAdmin() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, handleLogout } = UseAuth();

  const [selectedMood, setSelectedMood] = useState("happy");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totalSongs = songs.length;
  const moodCount = useMemo(() => new Set(songs.map((song) => song.mood)).size, [songs]);

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    setIsLoadingSongs(true);
    setError("");

    try {
      const data = await getAdminSongs();
      setSongs(data?.songs ?? []);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || "Unable to load songs");
    } finally {
      setIsLoadingSongs(false);
    }
  };

  const handleFiles = (files) => {
    setPendingFiles(Array.from(files || []));
    setMessage("");
    setError("");
  };

  const handleUpload = async () => {
    if (!pendingFiles.length) {
      setError("Select at least one song before uploading.");
      return;
    }

    setIsUploading(true);
    setError("");
    setMessage("");

    try {
      const uploadedSongs = [];

      for (const file of pendingFiles) {
        const data = await uploadSong({ file, mood: selectedMood });
        if (data?.song) {
          uploadedSongs.push(data.song);
        }
      }

      setSongs((current) => [...uploadedSongs.reverse(), ...current]);
      setPendingFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMessage(`${uploadedSongs.length} song${uploadedSongs.length > 1 ? "s" : ""} uploaded successfully.`);
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdminLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_35%),radial-gradient(circle_at_right,_rgba(244,114,182,0.18),_transparent_30%),#11182c] p-6 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.35em] text-cyan-200/70">Private Admin Panel</p>
              <h1 className="text-3xl font-bold tracking-tight">Song upload dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Only the account whose email matches your backend `ADMIN_EMAIL` can open this page or upload songs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                Signed in as {user?.email || "admin"}
              </div>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:bg-white/10"
              >
                Go to Home
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100 transition hover:bg-rose-400/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[28px] border border-white/10 bg-[#10182b] p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Upload songs</h2>
                <p className="mt-1 text-sm text-slate-400">Choose files, assign one mood, and send them to the protected API.</p>
              </div>
              <div className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                {pendingFiles.length} selected
              </div>
            </div>

            <div className="space-y-5">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-[24px] border border-dashed border-cyan-400/30 bg-cyan-400/5 p-8 text-center transition hover:border-cyan-300/60 hover:bg-cyan-400/10"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.flac,.aac"
                  multiple
                  className="hidden"
                  onChange={(event) => handleFiles(event.target.files)}
                />
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
                  <UploadGlyph />
                </div>
                <p className="text-base font-semibold">
                  {pendingFiles.length ? `${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""} ready to upload` : "Click to choose audio files"}
                </p>
                <p className="mt-2 text-sm text-slate-400">MP3, WAV, FLAC, AAC</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Mood for selected songs</label>
                <div className="grid grid-cols-3 gap-3">
                  {MOODS.map((mood) => {
                    const isActive = selectedMood === mood;

                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className="rounded-2xl border px-4 py-3 text-sm font-medium capitalize transition"
                        style={{
                          borderColor: isActive ? "rgba(34,211,238,0.55)" : "rgba(255,255,255,0.08)",
                          background: isActive ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)",
                          color: isActive ? "#cffafe" : "#cbd5e1",
                        }}
                      >
                        {mood}
                      </button>
                    );
                  })}
                </div>
              </div>

              {pendingFiles.length > 0 && (
                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="mb-3 text-sm font-medium text-slate-200">Files to upload</p>
                  <div className="space-y-2">
                    {pendingFiles.map((file) => (
                      <div key={`${file.name}-${file.size}`} className="flex items-center justify-between rounded-2xl bg-[#0b1324] px-4 py-3 text-sm">
                        <span className="truncate pr-3 text-slate-100">{file.name}</span>
                        <span className="text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message ? <p className="rounded-2xl bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</p> : null}
              {error ? <p className="rounded-2xl bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full rounded-2xl bg-[linear-gradient(135deg,#22d3ee,#f472b6)] px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? "Uploading songs..." : "Upload to library"}
              </button>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#10182b] p-6 shadow-xl">
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <MetricCard label="Total songs" value={String(totalSongs)} />
              <MetricCard label="Active moods" value={String(moodCount)} />
              <MetricCard label="Admin access" value={user?.isAdmin ? "Enabled" : "Blocked"} />
            </div>

            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Uploaded songs</h2>
                <p className="mt-1 text-sm text-slate-400">Latest uploads from the protected admin endpoint.</p>
              </div>
              <button
                type="button"
                onClick={loadSongs}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:bg-white/10"
              >
                Refresh
              </button>
            </div>

            {isLoadingSongs ? (
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
                Loading songs...
              </div>
            ) : songs.length === 0 ? (
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
                No songs uploaded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {songs.map((song) => (
                  <div key={song._id} className="rounded-[24px] border border-white/8 bg-[#0b1324] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">{song.title}</p>
                        <p className="mt-1 truncate text-sm text-slate-400">{song.artist || "Unknown Artist"}</p>
                      </div>
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium capitalize text-cyan-200">
                        {song.mood}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                      <a href={song.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3 py-1.5 text-slate-200 transition hover:bg-white/5">
                        Open song
                      </a>
                      {song.posterUrl ? (
                        <a href={song.posterUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-3 py-1.5 text-slate-200 transition hover:bg-white/5">
                          Open poster
                        </a>
                      ) : (
                        <span className="rounded-full border border-white/10 px-3 py-1.5">No poster in metadata</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function UploadGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V4M12 4L7 9M12 4L17 9M5 20H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
