import { useState, useRef, useEffect } from 'react';
import { useAuth, type UserProfile } from '@/contexts/AuthContext';
import {
  Camera, Save, X, Plus, MapPin, Briefcase, Calendar, Target, Sparkles,
  User, Edit2, Loader2, LogOut,
} from 'lucide-react';

// ─── API helpers ────────────────────────────────────────────────────────────

async function apiUpdateProfile(token: string, data: Partial<UserProfile>): Promise<UserProfile> {
  const res = await fetch('/api/profiles/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

async function uploadAvatar(token: string, file: File): Promise<UserProfile> {
  const form = new FormData();
  form.append('avatar', file);
  const res = await fetch('/api/profiles/me/avatar', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
  if (!res.ok) throw new Error('Failed to upload avatar');
  return res.json();
}

async function uploadCover(token: string, file: File): Promise<UserProfile> {
  const form = new FormData();
  form.append('cover', file);
  const res = await fetch('/api/profiles/me/cover', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form });
  if (!res.ok) throw new Error('Failed to upload cover');
  return res.json();
}

// ─── Constants ──────────────────────────────────────────────────────────────

const SCORE_LEVELS = [
  { min: 51, max: 65, level: 1, name: 'Getting Started', color: '#94a3b8' },
  { min: 65, max: 78, level: 2, name: 'Building Momentum', color: '#60a5fa' },
  { min: 78, max: 87, level: 3, name: 'Strong Foundation', color: '#4ade80' },
  { min: 87, max: 95, level: 4, name: 'Financial Pro', color: '#a78bfa' },
  { min: 95, max: 100, level: 5, name: 'Master', color: '#fbbf24' },
];

function getLevel(score: number) {
  return SCORE_LEVELS.find(l => score >= l.min && score <= l.max) || SCORE_LEVELS[0];
}

const INTEREST_OPTIONS = [
  'Budgeting', 'Savings', 'Investing', 'Retirement Planning', 'Debt Payoff',
  'Real Estate', 'Stock Market', 'Cryptocurrency', 'Side Hustles', 'Career Growth',
  'Financial Education', 'Accountability', 'Frugal Living', 'Credit Building',
  'Tax Planning', 'Estate Planning', 'Insurance', 'Emergency Fund',
];

const GOAL_SUGGESTIONS = [
  'Build emergency fund', 'Pay off student loans', 'Save for a home',
  'Max out 401k', 'Start investing', 'Pay off credit cards',
  'Build passive income', 'Save for vacation', 'Create a budget',
  'Reach financial independence',
];

// ─── Component ──────────────────────────────────────────────────────────────

export function MyProfilePage() {
  const { user, token, refreshUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'avatar' | 'cover' | null>(null);

  const [form, setForm] = useState({
    name: '',
    display_name: '',
    bio: '',
    location: '',
    occupation: '',
    interests: [] as string[],
    financial_goals: [] as string[],
  });
  const [newGoal, setNewGoal] = useState('');

  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  // Sync form from user
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        display_name: user.display_name,
        bio: user.bio,
        location: user.location,
        occupation: user.occupation,
        interests: [...user.interests],
        financial_goals: [...user.financial_goals],
      });
    }
  }, [user]);

  if (!user || !token) return null;
  const level = getLevel(user.score);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiUpdateProfile(token, form);
      await refreshUser();
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('avatar');
    try {
      await uploadAvatar(token, file);
      await refreshUser();
    } catch (err) {
      console.error(err);
    }
    setUploading(null);
    if (avatarRef.current) avatarRef.current.value = '';
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading('cover');
    try {
      await uploadCover(token, file);
      await refreshUser();
    } catch (err) {
      console.error(err);
    }
    setUploading(null);
    if (coverRef.current) coverRef.current.value = '';
  };

  const toggleInterest = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const addGoal = (goal: string) => {
    const g = goal.trim();
    if (!g || form.financial_goals.includes(g)) return;
    setForm(prev => ({ ...prev, financial_goals: [...prev.financial_goals, g] }));
    setNewGoal('');
  };

  const removeGoal = (goal: string) => {
    setForm(prev => ({ ...prev, financial_goals: prev.financial_goals.filter(g => g !== goal) }));
  };

  return (
    <div className="h-full overflow-auto bg-[#e8ebf1]">
      <div className="max-w-4xl mx-auto bg-white min-h-full">
        {/* Hidden file inputs */}
        <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />

        {/* Cover Photo */}
        <div className="relative h-52 bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] overflow-hidden group">
          {user.cover_photo_url && (
            <img src={user.cover_photo_url} alt="Cover" className="w-full h-full object-cover" />
          )}
          <button
            onClick={() => coverRef.current?.click()}
            className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all"
          >
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-xl">
              {uploading === 'cover' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              <span className="text-sm font-medium">{uploading === 'cover' ? 'Uploading...' : 'Change Cover Photo'}</span>
            </div>
          </button>

          {/* Logout button */}
          <button
            onClick={logout}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="px-8 -mt-16 relative z-10">
          <div className="flex items-end gap-5">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#5c87d6] to-[#4a6bb8]">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading === 'avatar' ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </div>
              </button>
            </div>

            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-[#2c3e50]">{user.display_name || user.name}</h2>
              <p className="text-sm text-[#6b7e9e]">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: level.color }}>
                  Level {level.level} - {level.name}
                </span>
                {user.streak > 0 && (
                  <span className="text-sm text-[#6b7e9e] flex items-center gap-1">🔥 {user.streak} days</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pb-2">
              {editing ? (
                <>
                  <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10b981] text-white hover:bg-[#059669] disabled:opacity-50 transition-colors text-sm font-medium">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                  </button>
                  <button onClick={() => { setForm({ name: user.name, display_name: user.display_name, bio: user.bio, location: user.location, occupation: user.occupation, interests: [...user.interests], financial_goals: [...user.financial_goals] }); setEditing(false); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f5f7fa] text-[#6b7e9e] hover:bg-[#e8ebf1] transition-colors text-sm font-medium">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5c87d6] text-white hover:bg-[#4a6bb8] transition-colors text-sm font-medium">
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Bio */}
          <div className="bg-[#f5f7fa] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#2c3e50] mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#5c87d6]" /> About
            </h3>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-[#6b7e9e] block mb-1">Full Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6]" placeholder="Your full name" />
                </div>
                <div>
                  <label className="text-xs text-[#6b7e9e] block mb-1">Display Name</label>
                  <input value={form.display_name} onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6]" placeholder="How others see you" />
                </div>
                <div>
                  <label className="text-xs text-[#6b7e9e] block mb-1">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6] resize-none" placeholder="Tell others about your financial journey..." />
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#6b7e9e] italic">{user.bio ? `"${user.bio}"` : 'No bio yet — click Edit Profile to add one'}</p>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f5f7fa] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#5c87d6]" /> Location</h3>
              {editing ? (
                <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6]" placeholder="City, State" />
              ) : (
                <p className="text-sm text-[#6b7e9e]">{user.location || 'Not specified'}</p>
              )}
            </div>
            <div className="bg-[#f5f7fa] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#5c87d6]" /> Occupation</h3>
              {editing ? (
                <input value={form.occupation} onChange={e => setForm(p => ({ ...p, occupation: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6]" placeholder="Your job title" />
              ) : (
                <p className="text-sm text-[#6b7e9e]">{user.occupation || 'Not specified'}</p>
              )}
            </div>
            <div className="bg-[#f5f7fa] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#5c87d6]" /> Joined</h3>
              <p className="text-sm text-[#6b7e9e]">{user.joined_date ? new Date(user.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}</p>
            </div>
            <div className="bg-gradient-to-br from-[#5c87d6] to-[#4a6bb8] rounded-2xl p-5 text-white">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Financial Score</h3>
              <div className="text-4xl font-bold">{user.score}</div>
              <div className="text-sm text-white/80 mt-1">Level {level.level} - {level.name}</div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-[#f5f7fa] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-[#5c87d6]" /> Interests</h3>
            {editing ? (
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map(interest => (
                  <button key={interest} onClick={() => toggleInterest(interest)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${form.interests.includes(interest) ? 'bg-[#5c87d6] text-white' : 'bg-white text-[#6b7e9e] border border-[#e8ebf1] hover:border-[#5c87d6] hover:text-[#5c87d6]'}`}>
                    {interest}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.interests.length > 0 ? user.interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#e8f0fe] text-[#5c87d6] rounded-lg text-sm font-medium">{interest}</span>
                )) : <p className="text-sm text-[#6b7e9e]">No interests added yet</p>}
              </div>
            )}
          </div>

          {/* Financial Goals */}
          <div className="bg-[#f5f7fa] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-[#10b981]" /> Financial Goals</h3>
            {editing ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {form.financial_goals.map((goal, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-[#d1fae5] text-[#059669] rounded-lg text-sm font-medium">
                      {goal}
                      <button onClick={() => removeGoal(goal)} className="hover:text-red-500"><X className="w-3.5 h-3.5" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGoal(newGoal); } }} className="flex-1 px-3 py-2 rounded-lg border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6]" placeholder="Add a financial goal..." />
                  <button onClick={() => addGoal(newGoal)} className="px-3 py-2 rounded-lg bg-[#10b981] text-white hover:bg-[#059669] transition-colors text-sm"><Plus className="w-4 h-4" /></button>
                </div>
                <div>
                  <p className="text-xs text-[#6b7e9e] mb-2">Suggestions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {GOAL_SUGGESTIONS.filter(g => !form.financial_goals.includes(g)).map(goal => (
                      <button key={goal} onClick={() => addGoal(goal)} className="px-2.5 py-1 bg-white text-[#6b7e9e] border border-dashed border-[#d8e2ec] rounded-lg text-xs hover:border-[#10b981] hover:text-[#10b981] transition-colors">+ {goal}</button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.financial_goals.length > 0 ? user.financial_goals.map((goal, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#d1fae5] text-[#059669] rounded-lg text-sm font-medium">{goal}</span>
                )) : <p className="text-sm text-[#6b7e9e]">No goals set yet</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
