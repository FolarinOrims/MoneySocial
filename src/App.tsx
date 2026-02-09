import { useState } from 'react';
import { TrendingUp, Users, Wallet, LineChart, Send, Settings, X, Share2, Zap, Plus, Eye, EyeOff, MessageCircle, User, Edit2, Check, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FriendsPage } from '@/components/FriendsPage';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

type TabId = 'home' | 'financial-score' | 'friends' | 'budget' | 'future' | 'social';

// Score levels configuration
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

function getLevelProgress(score: number) {
  const level = getLevel(score);
  const progress = ((score - level.min) / (level.max - level.min)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [userScore, setUserScore] = useState(64);
  const [showSettings, setShowSettings] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [openOptoConversation, setOpenOptoConversation] = useState<string | null>(null);

  return (
    <div className="size-full flex bg-[#e8ebf1]">
      {/* Left Sidebar */}
      <div className="w-[220px] bg-[#f0f4f8] flex flex-col shadow-sm">
        {/* Logo - Clickable Home */}
        <button
          onClick={() => setActiveTab('home')}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] shadow-lg flex items-center justify-center mx-auto mt-6 mb-6 hover:shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex-shrink-0"
        >
          <span className="text-white text-xl font-bold">O</span>
        </button>

        {/* Navigation Tabs */}
        <nav className="px-4 pt-2 space-y-2.5 pb-3 border-b border-[#d8e2ec]">
            <button
              onClick={() => setActiveTab('financial-score')}
            className={`w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'financial-score'
                ? 'bg-white shadow-md text-[#5c87d6]'
                : 'bg-white/50 text-[#6b7e9e] hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center">
              <div className="text-base font-bold">{userScore}</div>
            </div>
            <span className="text-xs">Financial Score</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'friends'
                ? 'bg-white shadow-md text-[#5c87d6]'
                : 'bg-white/50 text-[#6b7e9e] hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs">Conversations</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'budget'
                ? 'bg-white shadow-md text-[#5c87d6]'
                : 'bg-white/50 text-[#6b7e9e] hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs">Budget</span>
          </button>

          <button
            onClick={() => setActiveTab('future')}
            className={`w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'future'
                ? 'bg-white shadow-md text-[#5c87d6]'
                : 'bg-white/50 text-[#6b7e9e] hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center">
              <LineChart className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs">Future</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`w-full flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === 'social'
                ? 'bg-white shadow-md text-[#5c87d6]'
                : 'bg-white/50 text-[#6b7e9e] hover:bg-white hover:shadow-md'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs">Social</span>
          </button>
        </nav>

        {/* Ask Opto Section */}
        <div className="px-4 pt-3 pb-1.5">
          <button 
            onClick={() => {
              setActiveTab('friends');
              setOpenOptoConversation('opto-general');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] text-white hover:from-[#4a6bb8] hover:to-[#3d5a9e] transition-all shadow-md"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-medium">Ask Opto</span>
          </button>
        </div>

        {/* Add Friend to Platform Section */}
        <div className="px-4 pb-1.5">
          <button 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 text-[#2c3e50] hover:bg-white hover:shadow-md transition-all border border-[#d8e2ec]"
          >
            <div className="w-7 h-7 rounded-full bg-[#10b981] flex items-center justify-center">
              <Plus className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium">Invite Friend</span>
          </button>
        </div>

        {/* Settings Section */}
        <div className="px-4 pb-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 text-[#2c3e50] hover:bg-white hover:shadow-md transition-all border border-[#d8e2ec]"
          >
            <div className="w-7 h-7 rounded-full bg-[#6b7e9e] flex items-center justify-center">
              <Settings className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#2c3e50]">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-[#6b7e9e] hover:text-[#2c3e50]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Profile Visibility Toggle */}
              <div className="bg-[#f5f7fa] rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-[#2c3e50]">Profile Visibility</h4>
                      {profileVisible ? (
                        <Eye className="w-4 h-4 text-[#10b981]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-[#6b7e9e]" />
                      )}
                    </div>
                    <p className="text-sm text-[#6b7e9e]">
                      {profileVisible 
                        ? "Friends can view your full profile, score, and progress" 
                        : "Your profile details are hidden from friends"}
                    </p>
                  </div>
                  <button
                    onClick={() => setProfileVisible(!profileVisible)}
                    className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileVisible ? 'bg-[#5c87d6]' : 'bg-[#d8e2ec]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileVisible ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Other Settings Placeholder */}
              <div className="bg-[#f5f7fa] rounded-xl p-4">
                <h4 className="font-medium text-[#2c3e50] mb-1">Notifications</h4>
                <p className="text-sm text-[#6b7e9e]">Manage your notification preferences</p>
              </div>

              <div className="bg-[#f5f7fa] rounded-xl p-4">
                <h4 className="font-medium text-[#2c3e50] mb-1">Account</h4>
                <p className="text-sm text-[#6b7e9e]">Manage your account settings</p>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 px-4 py-3 rounded-xl bg-[#5c87d6] text-white hover:bg-[#4a6bb8] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'home' && <HomePage userScore={userScore} setUserScore={setUserScore} />}
        {activeTab === 'financial-score' && <FinancialScorePage userScore={userScore} />}
        {activeTab === 'friends' && <FriendsPage openConversation={openOptoConversation} onConversationOpened={() => setOpenOptoConversation(null)} />}
        {activeTab === 'budget' && <BudgetPage />}
        {activeTab === 'future' && <FuturePage />}
        {activeTab === 'social' && <SocialPage />}
      </div>
    </div>
  );
}

function HomePage({ userScore, setUserScore }: { userScore: number, setUserScore: (score: number) => void }) {
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [showScoreDetail, setShowScoreDetail] = useState(false);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<any | null>(null);

  const currentLevel = getLevel(userScore);
  const levelProgress = getLevelProgress(userScore);
  
  const actionItems = [
    { 
      id: 1, 
      title: 'Review Monthly Budget', 
      description: 'You have $300 unallocated this month', 
      emoji: '📊', 
      color: '#fff9e6', 
      borderColor: '#f5a623',
      label: 'Due in 2 days',
      labelColor: '#f5a623',
      increasesScore: true,
      scoreIncrease: 2,
      feedback: 'Amazing! You reviewed your budget. Your financial awareness is growing! 🎉'
    },
    { 
      id: 2, 
      title: 'Talk to a Friend About Future Goals', 
      description: 'Share your plans with Sarah or Mike', 
      emoji: '💬', 
      color: '#f0e6ff', 
      borderColor: '#9333ea',
      label: 'Accountability boost',
      labelColor: '#9333ea',
      increasesScore: true,
      scoreIncrease: 3,
      feedback: 'Great work! Social accountability helps you stay on track. Keep it up! 🙌'
    },
    { 
      id: 3, 
      title: 'Review Investments', 
      description: 'Portfolio grew 2.3% this month', 
      emoji: '💰', 
      color: '#f0f9ff', 
      borderColor: '#4ade80',
      label: 'Looking good!',
      labelColor: '#4ade80',
      increasesScore: false,
      scoreIncrease: 0,
      feedback: 'Nice! You checked your investments. Stay informed! 📈'
    },
    { 
      id: 4, 
      title: 'Reflect on Past Financial Wins', 
      description: 'Share your journey with Emma about what worked', 
      emoji: '✨', 
      color: '#fef3e6', 
      borderColor: '#fb923c',
      label: 'Build confidence',
      labelColor: '#fb923c',
      increasesScore: true,
      scoreIncrease: 2,
      feedback: 'Wonderful! Reflecting on your successes builds confidence and momentum! 🌟'
    },
  ];

  const handleCompleteItem = (itemId: number) => {
    if (completedItems.includes(itemId)) return;
    
    const item = actionItems.find(i => i.id === itemId);
    if (!item) return;

    const newCompleted = [...completedItems, itemId];
    setCompletedItems(newCompleted);
    
    // Show positive feedback
    setShowFeedback(item.feedback);
    setTimeout(() => setShowFeedback(null), 4000);

    // Check if 2 out of 3 items are done
    const completedScoreItems = newCompleted.filter(id => {
      const completedItem = actionItems.find(i => i.id === id);
      return completedItem?.increasesScore;
    });

    // If 2 or more score-increasing items are completed, increase score
    if (completedScoreItems.length >= 2 && item.increasesScore) {
      const oldLevel = getLevel(userScore).level;
      const newScore = Math.min(100, userScore + item.scoreIncrease);
      setUserScore(newScore);
      const newLevel = getLevel(newScore).level;
      
      // Check if leveled up
      if (newLevel > oldLevel) {
        // Trigger confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 200);
      }
    } else if (item.increasesScore) {
      const oldLevel = getLevel(userScore).level;
      const newScore = Math.min(100, userScore + item.scoreIncrease);
      setUserScore(newScore);
      const newLevel = getLevel(newScore).level;
      
      if (newLevel > oldLevel) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const friends = [
    {
      id: 'sarah',
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      level: 4,
      levelName: 'Rising',
      levelColor: '#10b981',
      score: 78,
      streak: 21,
      isOnline: true,
      interests: ['Savings', 'Budgeting', 'Investment Basics'],
      bio: 'Working on building my emergency fund and learning about investing!',
    },
    {
      id: 'mike',
      name: 'Mike R.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      level: 5,
      levelName: 'Master',
      levelColor: '#fbbf24',
      score: 92,
      streak: 47,
      isOnline: true,
      interests: ['Retirement Planning', 'Real Estate', 'Stock Market'],
      bio: 'Helping friends navigate their investment journey. Always happy to share what I\'ve learned!',
    },
    {
      id: 'emma',
      name: 'Emma L.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      level: 4,
      levelName: 'Rising',
      levelColor: '#10b981',
      score: 81,
      streak: 33,
      isOnline: false,
      interests: ['Debt Payoff', 'Career Growth', 'Side Hustles'],
      bio: 'Paid off $15k in debt this year! 🎉 Focused on growing my income now.',
    },
    {
      id: 'james',
      name: 'James K.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      level: 3,
      levelName: 'Building',
      levelColor: '#8b5cf6',
      score: 69,
      streak: 14,
      isOnline: false,
      interests: ['Accountability', 'Budgeting', 'Financial Education'],
      bio: 'Just started my financial journey. Looking for accountability partners!',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-[#e8ebf1]">
      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-6 right-6 bg-white rounded-2xl shadow-lg p-4 max-w-md z-50 animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <p className="text-[#2c3e50] flex-1">{showFeedback}</p>
            <button onClick={() => setShowFeedback(null)} className="text-[#6b7e9e] hover:text-[#2c3e50]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#2c3e50]">Share Your Score</h3>
              <button onClick={() => setShowShareModal(false)} className="text-[#6b7e9e] hover:text-[#2c3e50]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6 p-6 bg-gradient-to-br from-[#5c87d6] to-[#4a6bb8] rounded-xl text-white">
              <div className="text-5xl font-bold mb-2">{userScore}</div>
              <div className="text-white/90">Level {currentLevel.level} - {currentLevel.name}</div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#2c3e50] mb-3">Share with Friends</h4>
              <div className="space-y-2">
                {[
                  { id: 'sarah', name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
                  { id: 'mike', name: 'Mike R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
                  { id: 'emma', name: 'Emma L.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
                  { id: 'james', name: 'James K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
                ].map((friend) => (
                  <button 
                    key={friend.id}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f5f7fa] hover:bg-[#e8ebf1] transition-colors"
                  >
                    <img 
                      src={friend.avatar} 
                      alt={friend.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="flex-1 text-left text-[#2c3e50]">{friend.name}</span>
                    <Share2 className="w-4 h-4 text-[#5c87d6]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#e8ebf1]">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f5f7fa] hover:bg-[#e8ebf1] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#ec4899] flex items-center justify-center text-white">
                  💕
                </div>
                <span className="flex-1 text-left text-[#2c3e50]">Share with Partner</span>
                <Share2 className="w-4 h-4 text-[#5c87d6]" />
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f5f7fa] hover:bg-[#e8ebf1] transition-colors">
                <Zap className="w-5 h-5 text-[#f5a623] ml-2" />
                <span className="flex-1 text-left text-[#2c3e50]">Send Friendly Nudge</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] text-white hover:from-[#4a6bb8] hover:to-[#3d5a9e] transition-colors">
                <Plus className="w-5 h-5" />
                <span className="flex-1 text-left">Invite Someone New to Opto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Friend Profile Modal */}
      {selectedFriend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedFriend(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#2c3e50]">Friend Profile</h3>
              <button onClick={() => setSelectedFriend(null)} className="text-[#6b7e9e] hover:text-[#2c3e50]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Friend Header */}
            <div className="flex items-start gap-6 mb-6 pb-6 border-b border-[#e8ebf1]">
              <div className="relative">
                <img 
                  src={selectedFriend.avatar} 
                  alt={selectedFriend.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {selectedFriend.isOnline && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#4ade80] border-3 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-semibold text-[#2c3e50]">{selectedFriend.name}</h3>
                  {selectedFriend.isOnline && (
                    <span className="text-sm text-[#4ade80] font-medium">● Online</span>
                  )}
                </div>
                <div 
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-3"
                  style={{ backgroundColor: selectedFriend.levelColor }}
                >
                  Level {selectedFriend.level} - {selectedFriend.levelName}
                </div>
                <p className="text-[#6b7e9e] italic mb-4">"{selectedFriend.bio}"</p>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedFriend(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5c87d6] text-white rounded-lg hover:bg-[#4a6bb8] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Send Message</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#f5f7fa] text-[#2c3e50] rounded-lg hover:bg-[#e8ebf1] transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Share Score</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#5c87d6] to-[#4a6bb8] rounded-xl p-6 text-white">
                <div className="text-4xl font-bold mb-2">{selectedFriend.score}</div>
                <div className="text-white/90 text-sm">Financial Score</div>
                <div className="mt-2 text-xs text-white/75">
                  Level {selectedFriend.level} Progress
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#fb923c] to-[#f97316] rounded-xl p-6 text-white">
                <div className="text-4xl font-bold mb-2">{selectedFriend.streak} 🔥</div>
                <div className="text-white/90 text-sm">Day Streak</div>
                <div className="mt-2 text-xs text-white/75">
                  Keep encouraging them!
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="mb-6">
              <h4 className="font-medium text-[#2c3e50] mb-3">Interests & Goals</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFriend.interests.map((interest: string, i: number) => (
                  <span 
                    key={i}
                    className="px-3 py-2 bg-[#e8f0fe] text-[#5c87d6] rounded-lg text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-medium text-[#2c3e50] mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {[
                  { action: 'Completed budget review', time: '2 hours ago', emoji: '📊' },
                  { action: 'Reached 21-day streak', time: 'Yesterday', emoji: '🔥' },
                  { action: 'Leveled up to Level 4', time: '3 days ago', emoji: '🎉' },
                  { action: 'Connected with Mike R.', time: '5 days ago', emoji: '👋' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#f5f7fa] rounded-lg">
                    <span className="text-2xl">{activity.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#2c3e50]">{activity.action}</div>
                      <div className="text-xs text-[#6b7e9e]">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Score Detail Modal */}
      {showScoreDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowScoreDetail(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#2c3e50]">Progress Over Time</h3>
              <button onClick={() => setShowScoreDetail(false)} className="text-[#6b7e9e] hover:text-[#2c3e50]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Score Display */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const angle = (i * 18);
                    const baseStrokeWidth = 5 + (i * 0.55);
                    const x1 = 96 + 88 * Math.cos((angle * Math.PI) / 180);
                    const y1 = 96 + 88 * Math.sin((angle * Math.PI) / 180);
                    const x2 = 96 + 70 * Math.cos((angle * Math.PI) / 180);
                    const y2 = 96 + 70 * Math.sin((angle * Math.PI) / 180);
                    
                    const segmentProgress = ((i + 1) / 20) * 100;
                    const isFilled = levelProgress >= segmentProgress;
                    
                    let color = 'rgba(100,100,120,0.35)';
                    if (isFilled) {
                      if (i < 5) color = '#6366f1';
                      else if (i < 10) color = '#a855f7';
                      else if (i < 15) color = '#ec4899';
                      else if (i < 18) color = '#fb923c';
                      else color = '#fbbf24';
                    }
                    
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={color}
                        strokeWidth={baseStrokeWidth}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-[#2c3e50]">{userScore}</div>
                  <div className="text-sm text-[#6b7e9e]">Level {currentLevel.level}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-lg font-medium text-[#2c3e50]">{currentLevel.name}</div>
                <div className="text-sm text-[#6b7e9e]">{Math.round(levelProgress)}% to next level</div>
              </div>
            </div>

            {/* Historical Progress */}
            <div className="space-y-4">
              <h4 className="font-medium text-[#2c3e50]">Recent Progress</h4>
              
              {[
                { date: 'Feb 3, 2026', score: userScore, change: '+3', event: 'Completed action item' },
                { date: 'Feb 2, 2026', score: userScore - 3, change: '+2', event: 'Budget review completed' },
                { date: 'Feb 1, 2026', score: userScore - 5, change: '+1', event: 'Daily check-in' },
                { date: 'Jan 31, 2026', score: userScore - 6, change: '+2', event: 'Reached 14-day streak' },
                { date: 'Jan 30, 2026', score: userScore - 8, change: '+1', event: 'Reviewed investments' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-[#f5f7fa]">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#2c3e50]">{item.event}</div>
                    <div className="text-xs text-[#6b7e9e]">{item.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium text-[#2c3e50]">{item.score}</div>
                    <div className="text-xs text-green-600">{item.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto h-full bg-white px-6 pt-6">
          {/* Top Section: Financial Score and Action Items */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Financial Score Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#2c3e50]">Financial Score</h2>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-lg hover:bg-[#f5f7fa] transition-colors"
                  title="Share score"
                >
                  <Share2 className="w-5 h-5 text-[#5c87d6]" />
                </button>
              </div>
              
              {/* Score Display with Circular Progress */}
              <div 
                className="text-center mb-6 p-6 bg-white rounded-xl cursor-pointer hover:shadow-md transition-all"
                onClick={() => setShowScoreDetail(true)}
              >
                <div className="relative inline-block mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const angle = (i * 18);
                      const baseStrokeWidth = 3 + (i * 0.4);
                      const x1 = 64 + 58 * Math.cos((angle * Math.PI) / 180);
                      const y1 = 64 + 58 * Math.sin((angle * Math.PI) / 180);
                      const x2 = 64 + 46 * Math.cos((angle * Math.PI) / 180);
                      const y2 = 64 + 46 * Math.sin((angle * Math.PI) / 180);
                      
                      const segmentProgress = ((i + 1) / 20) * 100;
                      const isFilled = levelProgress >= segmentProgress;
                      
                      let color = 'rgba(100,100,120,0.3)';
                      if (isFilled) {
                        if (i < 4) color = '#3b82f6';
                        else if (i < 8) color = '#8b5cf6';
                        else if (i < 12) color = '#ec4899';
                        else if (i < 16) color = '#fb923c';
                        else if (i < 19) color = '#10b981';
                        else color = '#fbbf24';
                      }
                      
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={color}
                          strokeWidth={baseStrokeWidth}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl font-bold text-[#2c3e50]">{userScore}</div>
                  </div>
                </div>
                <div className="text-[#2c3e50]">Level {currentLevel.level} - {currentLevel.name}</div>
                <div className="text-sm text-[#6b7e9e] mt-1">{Math.round(levelProgress)}% to Level {currentLevel.level + 1}</div>
              </div>

              {/* Daily Streak */}
              <div className="bg-[#f5f7fa] rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#2c3e50] font-medium">Daily Streak</span>
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="text-3xl font-bold text-[#5c87d6] mb-1">14 Days</div>
                <div className="text-sm text-[#6b7e9e]">Keep it going! Check in daily to maintain your streak.</div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7e9e]">This Week</span>
                  <span className="text-[#2c3e50] font-medium">+5 points</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7e9e]">This Month</span>
                  <span className="text-[#2c3e50] font-medium">+18 points</span>
                </div>
              </div>
            </div>

            {/* Action Items Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Action Items</h2>
              
              <div className="space-y-3">
                {actionItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`border-l-4 rounded-lg p-4 transition-all ${
                      completedItems.includes(item.id) 
                        ? 'bg-[#f0f9f0] border-[#4ade80] opacity-60' 
                        : 'hover:shadow-md cursor-pointer'
                    }`}
                    style={{ 
                      backgroundColor: completedItems.includes(item.id) ? '#f0f9f0' : item.color,
                      borderLeftColor: completedItems.includes(item.id) ? '#4ade80' : item.borderColor
                    }}
                    onClick={() => handleCompleteItem(item.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className={`font-medium text-[#2c3e50] mb-1 ${completedItems.includes(item.id) ? 'line-through' : ''}`}>
                          {item.title}
                        </div>
                        <div className="text-sm text-[#6b7e9e]">{item.description}</div>
                      </div>
                      <span className="text-xl">{completedItems.includes(item.id) ? '✅' : item.emoji}</span>
                    </div>
                    <div className="text-xs font-medium" style={{ color: completedItems.includes(item.id) ? '#4ade80' : item.labelColor }}>
                      {completedItems.includes(item.id) ? 'Completed! 🎉' : item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Opto Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-[#2c3e50] mb-1">Opto Recommendations</h2>
              <p className="text-sm text-[#6b7e9e]">Complete actions to boost your financial score ✨</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border-2 border-[#e8ebf1] hover:border-[#5c87d6] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-[#f5f7fa] mb-3">💰</div>
                <h3 className="font-semibold text-[#2c3e50] mb-2">Review your monthly spending</h3>
                <p className="text-sm text-[#6b7e9e] mb-3">Check your budget categories and identify areas to save</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#e8f0fe] text-[#5c87d6] font-medium">Budget</span>
                  <span className="text-xs font-semibold text-[#10b981]">+2-3 points</span>
                </div>
              </div>
              <div className="bg-white border-2 border-[#e8ebf1] hover:border-[#5c87d6] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-[#f5f7fa] mb-3">🎯</div>
                <h3 className="font-semibold text-[#2c3e50] mb-2">Set up an emergency fund goal</h3>
                <p className="text-sm text-[#6b7e9e] mb-3">Create a savings goal for 3-6 months of expenses</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#e8f0fe] text-[#5c87d6] font-medium">Savings</span>
                  <span className="text-xs font-semibold text-[#10b981]">+2-4 points</span>
                </div>
              </div>
              <div className="bg-white border-2 border-[#e8ebf1] hover:border-[#5c87d6] rounded-xl p-5 hover:shadow-md transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-[#f5f7fa] mb-3">📈</div>
                <h3 className="font-semibold text-[#2c3e50] mb-2">Check your investment allocations</h3>
                <p className="text-sm text-[#6b7e9e] mb-3">Review your portfolio to ensure it matches your risk tolerance</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#e8f0fe] text-[#5c87d6] font-medium">Investing</span>
                  <span className="text-xs font-semibold text-[#10b981]">+1-3 points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Friends Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Friends</h2>
            
            <div className="grid grid-cols-4 gap-4">
              {friends.map((friend) => (
                <div key={friend.id} className="bg-[#f5f7fa] rounded-xl p-4 hover:shadow-md transition-shadow group relative">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <div className="relative mb-3">
                      <img 
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-16 h-16 rounded-full mx-auto object-cover"
                      />
                      <div className={`absolute bottom-0 right-1/2 translate-x-8 w-4 h-4 border-2 border-white rounded-full ${
                        friend.isOnline ? 'bg-[#4ade80]' : 'bg-[#9ca3af]'
                      }`}></div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-[#2c3e50] mb-1">{friend.name}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <span className="text-lg">🔥</span>
                        <span className="text-sm font-semibold text-[#5c87d6]">{friend.streak} days</span>
                      </div>
                      <div className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-1" style={{ backgroundColor: friend.levelColor, color: 'white' }}>
                        Level {friend.level}
                      </div>
                      <div className={`text-xs font-medium ${friend.isOnline ? 'text-[#4ade80]' : 'text-[#6b7e9e]'}`}>
                        {friend.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions on Hover */}
                  <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-white via-white to-transparent pt-8 pb-3 px-3 rounded-b-xl">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedFriend(friend)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-[#5c87d6] text-white rounded-lg hover:bg-[#4a6bb8] transition-colors text-xs"
                        title="View full profile"
                      >
                        <User className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-colors text-xs"
                        title="Send message"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinancialScorePage({ userScore }: { userScore: number }) {
  const currentLevel = getLevel(userScore);
  const levelProgress = getLevelProgress(userScore);
  const [showShareModal, setShowShareModal] = useState(false);
  const [actionItems, setActionItems] = useState([
    { id: 1, title: 'Review your monthly spending', description: 'Check your budget categories and identify areas to save', completed: false, icon: '💰', category: 'Budget', points: '+2-3 points' },
    { id: 2, title: 'Set up an emergency fund goal', description: 'Create a savings goal for 3-6 months of expenses', completed: false, icon: '🎯', category: 'Savings', points: '+2-4 points' },
    { id: 3, title: 'Check your investment allocations', description: 'Review your portfolio to ensure it matches your risk tolerance', completed: false, icon: '📈', category: 'Investing', points: '+1-3 points' },
  ]);

  const completedCount = actionItems.filter(item => item.completed).length;

  const toggleActionItem = (id: number) => {
    setActionItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const friends = [
    { id: 'sarah', name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
    { id: 'mike', name: 'Mike R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
    { id: 'emma', name: 'Emma L.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
    { id: 'james', name: 'James K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#e8ebf1]">
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShareModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#2c3e50]">Share Your Score</h3>
              <button onClick={() => setShowShareModal(false)} className="text-[#6b7e9e] hover:text-[#2c3e50]"><X className="w-5 h-5" /></button>
            </div>
            <div className="text-center mb-6 p-6 bg-gradient-to-br from-[#5c87d6] to-[#4a6bb8] rounded-xl text-white">
              <div className="text-5xl font-bold mb-2">{userScore}</div>
              <div className="text-white/90">Level {currentLevel.level} - {currentLevel.name}</div>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-[#2c3e50] mb-3">Share with Friends</h4>
              <div className="space-y-2">
                {friends.map((friend) => (
                  <button key={friend.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f5f7fa] hover:bg-[#e8ebf1] transition-colors">
                    <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="flex-1 text-left text-[#2c3e50]">{friend.name}</span>
                    <Share2 className="w-4 h-4 text-[#5c87d6]" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-[#e8ebf1]">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f5f7fa] hover:bg-[#e8ebf1] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#ec4899] flex items-center justify-center text-white">💕</div>
                <span className="flex-1 text-left text-[#2c3e50]">Share with Partner</span>
                <Share2 className="w-4 h-4 text-[#5c87d6]" />
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f5f7fa] hover:bg-[#e8ebf1] transition-colors">
                <Zap className="w-5 h-5 text-[#f5a623] ml-2" />
                <span className="flex-1 text-left text-[#2c3e50]">Send Friendly Nudge</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] text-white hover:from-[#4a6bb8] hover:to-[#3d5a9e] transition-colors">
                <Plus className="w-5 h-5" />
                <span className="flex-1 text-left">Invite Someone New to Opto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto h-full bg-white px-6 pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Financial Score</h1>
              <p className="text-[#6b7e9e]">Track your progress and see how you're improving over time</p>
            </div>
            <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5c87d6] text-white hover:bg-[#4a6bb8] transition-colors shadow-md">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share Score</span>
            </button>
          </div>

          {/* Main Score Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const angle = (i * 18);
                    const baseStrokeWidth = 5 + (i * 0.55);
                    const x1 = 96 + 88 * Math.cos((angle * Math.PI) / 180);
                    const y1 = 96 + 88 * Math.sin((angle * Math.PI) / 180);
                    const x2 = 96 + 70 * Math.cos((angle * Math.PI) / 180);
                    const y2 = 96 + 70 * Math.sin((angle * Math.PI) / 180);
                    const segmentProgress = ((i + 1) / 20) * 100;
                    const isFilled = levelProgress >= segmentProgress;
                    let color = 'rgba(100,100,120,0.3)';
                    if (isFilled) {
                      if (i < 4) color = '#3b82f6';
                      else if (i < 8) color = '#8b5cf6';
                      else if (i < 12) color = '#ec4899';
                      else if (i < 16) color = '#fb923c';
                      else if (i < 19) color = '#10b981';
                      else color = '#fbbf24';
                    }
                    return (<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={baseStrokeWidth} strokeLinecap="round" />);
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-[#2c3e50]">{userScore}</div>
                  <div className="text-sm text-[#6b7e9e]">Level {currentLevel.level}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-semibold text-[#2c3e50]">{currentLevel.name}</div>
                <div className="text-sm text-[#6b7e9e] mt-1">{Math.round(levelProgress)}% to Level {currentLevel.level + 1}</div>
              </div>
            </div>

            {/* Level Badges */}
            <div className="grid grid-cols-5 gap-3 mt-8">
              {SCORE_LEVELS.map((level) => (
                <div key={level.level} className={`text-center p-4 rounded-xl transition-all ${currentLevel.level >= level.level ? 'bg-gradient-to-br from-white to-gray-50 shadow-md' : 'bg-[#f5f7fa] opacity-50'}`}>
                  <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: level.color }}>{level.level}</div>
                  <div className="text-xs font-medium text-[#2c3e50]">{level.name}</div>
                  <div className="text-xs text-[#6b7e9e] mt-1">{level.min}-{level.max}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-6 bg-[#e8ebf1] -mx-6"></div>

          {/* Action Items */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#2c3e50]">Action Items to Increase Score</h2>
                <p className="text-sm text-[#6b7e9e] mt-1">Complete actions to boost your financial score ✨</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[#2c3e50]">{completedCount} of {actionItems.length} completed</div>
                <div className="text-xs text-[#6b7e9e] mt-0.5">{completedCount >= 2 ? '🎉 Great job!' : 'Complete at least 2 to see progress'}</div>
              </div>
            </div>
            <div className="space-y-3">
              {actionItems.map((item) => (
                <div key={item.id} className={`border-2 rounded-xl p-5 transition-all ${item.completed ? 'bg-[#f0f9f0] border-[#4ade80] opacity-70' : 'border-[#e8ebf1] hover:border-[#5c87d6] hover:shadow-md cursor-pointer'}`} onClick={() => toggleActionItem(item.id)}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${item.completed ? 'bg-[#4ade80]' : 'bg-[#f5f7fa]'}`}>{item.completed ? '✅' : item.icon}</div>
                    <div className="flex-1">
                      <div className={`font-semibold text-[#2c3e50] mb-1 ${item.completed ? 'line-through' : ''}`}>{item.title}</div>
                      <div className="text-sm text-[#6b7e9e] mb-3">{item.description}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#e8f0fe] text-[#5c87d6] font-medium">{item.category}</span>
                        {!item.completed && <span className="text-xs font-semibold text-[#10b981]">{item.points}</span>}
                        {item.completed && <span className="text-xs font-semibold text-[#4ade80]">Completed! 🎉</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-[#fef3e6] border border-[#f5a623] rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="flex-1">
                  <p className="text-sm text-[#2c3e50] font-medium mb-1">Pro Tip</p>
                  <p className="text-sm text-[#6b7e9e]">Your score increases based on multiple factors including completed actions, consistency, and engagement. Keep up the great work to unlock higher levels! The exact formula is our little secret ✨</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-6 bg-[#e8ebf1] -mx-6"></div>

          {/* Score History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Score History</h2>
            <div className="space-y-3">
              {[
                { date: 'Feb 3, 2026', score: userScore, change: '+3', event: 'Completed action item', level: getLevel(userScore).level },
                { date: 'Feb 2, 2026', score: Math.max(51, userScore - 3), change: '+2', event: 'Budget review completed', level: getLevel(Math.max(51, userScore - 3)).level },
                { date: 'Feb 1, 2026', score: Math.max(51, userScore - 5), change: '+1', event: 'Daily check-in', level: getLevel(Math.max(51, userScore - 5)).level },
                { date: 'Jan 31, 2026', score: Math.max(51, userScore - 6), change: '+2', event: 'Reached 14-day streak', level: getLevel(Math.max(51, userScore - 6)).level },
                { date: 'Jan 30, 2026', score: Math.max(51, userScore - 8), change: '+1', event: 'Reviewed investments', level: getLevel(Math.max(51, userScore - 8)).level },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#f5f7fa] hover:bg-[#e8ebf1] transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-[#2c3e50]">{item.event}</div>
                    <div className="text-xs text-[#6b7e9e] mt-1">{item.date}</div>
                  </div>
                  <div className="text-center px-3">
                    <div className="text-xs text-[#6b7e9e] mb-1">Level {item.level}</div>
                    <div className="inline-block px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: getLevel(item.score).color, color: 'white' }}>{getLevel(item.score).name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#2c3e50]">{item.score}</div>
                    <div className="text-xs text-green-600 font-medium">{item.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialPage() {
  const friends = [
    { id: 'sarah', name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', level: 4, score: 78, streak: 21, isOnline: true },
    { id: 'mike', name: 'Mike R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', level: 5, score: 92, streak: 47, isOnline: true },
    { id: 'emma', name: 'Emma L.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', level: 4, score: 81, streak: 33, isOnline: false },
    { id: 'james', name: 'James K.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', level: 3, score: 69, streak: 14, isOnline: false },
  ];

  return (
    <div className="h-full flex flex-col bg-[#e8ebf1]">
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto h-full bg-white px-6 pt-6">
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Social Hub</h1>
          <p className="text-[#6b7e9e] mb-6">Connect, compete, and grow together with your financial community</p>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#2c3e50]">Friend Leaderboard</h2>
              <span className="text-sm text-[#6b7e9e]">This Month</span>
            </div>
            <div className="space-y-3">
              {friends.sort((a, b) => b.score - a.score).map((friend, index) => (
                <div key={friend.id} className="flex items-center gap-4 p-4 bg-[#f5f7fa] rounded-xl hover:bg-[#e8ebf1] transition-colors">
                  <div className="text-2xl font-bold text-[#5c87d6] w-8">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}</div>
                  <div className="relative">
                    <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full object-cover" />
                    {friend.isOnline && <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#4ade80] border-2 border-white rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[#2c3e50]">{friend.name}</div>
                    <div className="flex items-center gap-3 text-sm text-[#6b7e9e]">
                      <span>Level {friend.level}</span><span>•</span><span className="flex items-center gap-1">🔥 {friend.streak} days</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#2c3e50]">{friend.score}</div>
                    <div className="text-xs text-[#6b7e9e]">Score</div>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-[#fef3e6] text-[#f5a623] rounded-lg hover:bg-[#f5a623] hover:text-white transition-colors text-sm font-medium" title="Send a nudge">
                    <Bell className="w-4 h-4" /><span>Nudge</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { friend: 'Mike R.', action: 'leveled up to Level 5', time: '2 hours ago', emoji: '🎉', color: 'bg-[#fef3c7]' },
                { friend: 'Sarah M.', action: 'completed their budget review', time: '5 hours ago', emoji: '📊', color: 'bg-[#dbeafe]' },
                { friend: 'Emma L.', action: 'reached a 30-day streak', time: 'Yesterday', emoji: '🔥', color: 'bg-[#fed7aa]' },
                { friend: 'James K.', action: 'shared a savings milestone', time: '2 days ago', emoji: '💰', color: 'bg-[#d1fae5]' },
                { friend: 'Mike R.', action: 'started a new conversation about retirement', time: '3 days ago', emoji: '💬', color: 'bg-[#e9d5ff]' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-[#f5f7fa] rounded-xl">
                  <div className={`w-12 h-12 ${activity.color} rounded-full flex items-center justify-center text-2xl`}>{activity.emoji}</div>
                  <div className="flex-1">
                    <p className="text-[#2c3e50]"><span className="font-semibold">{activity.friend}</span> {activity.action}</p>
                    <p className="text-sm text-[#6b7e9e]">{activity.time}</p>
                  </div>
                  <button className="px-4 py-2 bg-[#5c87d6] text-white rounded-lg hover:bg-[#4a6bb8] transition-colors text-sm">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#2c3e50]">Active Challenges</h2>
              <button className="px-4 py-2 bg-[#5c87d6] text-white rounded-lg hover:bg-[#4a6bb8] transition-colors text-sm">Create Challenge</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: '30-Day Savings Challenge', participants: 3, progress: 67, emoji: '💰', color: 'from-[#10b981] to-[#059669]' },
                { title: 'No Dining Out Week', participants: 2, progress: 42, emoji: '🍽️', color: 'from-[#f59e0b] to-[#d97706]' },
              ].map((challenge, i) => (
                <div key={i} className="bg-gradient-to-br from-[#f5f7fa] to-white rounded-xl p-5 border-2 border-[#e8ebf1] hover:border-[#5c87d6] transition-colors">
                  <div className="text-3xl mb-3">{challenge.emoji}</div>
                  <h3 className="font-semibold text-[#2c3e50] mb-2">{challenge.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-[#6b7e9e]" />
                    <span className="text-sm text-[#6b7e9e]">{challenge.participants} participants</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-[#6b7e9e] mb-1"><span>Progress</span><span>{challenge.progress}%</span></div>
                    <div className="w-full bg-[#e8ebf1] rounded-full h-2">
                      <div className={`bg-gradient-to-r ${challenge.color} h-2 rounded-full transition-all`} style={{ width: `${challenge.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetPage() {
  type TransactionCategory = 'need' | 'want' | 'savings';
  
  interface Transaction {
    id: number;
    name: string;
    amount: number;
    date: string;
    category: TransactionCategory;
    visible: boolean;
  }
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, name: 'Grocery Store', amount: -125.50, date: 'Feb 2', category: 'need', visible: true },
    { id: 2, name: 'Paycheck Deposit', amount: 3250.00, date: 'Feb 1', category: 'savings', visible: true },
    { id: 3, name: 'Electric Bill', amount: -89.00, date: 'Jan 31', category: 'need', visible: true },
    { id: 4, name: 'Coffee Shop', amount: -15.75, date: 'Jan 30', category: 'want', visible: true },
    { id: 5, name: 'Netflix Subscription', amount: -15.99, date: 'Jan 29', category: 'want', visible: true },
    { id: 6, name: 'Rent Payment', amount: -1500.00, date: 'Jan 28', category: 'need', visible: true },
    { id: 7, name: 'Restaurant Dinner', amount: -85.50, date: 'Jan 27', category: 'want', visible: true },
    { id: 8, name: 'Gas Station', amount: -45.00, date: 'Jan 26', category: 'need', visible: true },
    { id: 9, name: '401k Contribution', amount: -500.00, date: 'Jan 25', category: 'savings', visible: true },
  ]);
  
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [splitModalOpen, setSplitModalOpen] = useState<number | null>(null);
  const [splitPercentage, setSplitPercentage] = useState(50);
  
  const spendingByCategory = transactions
    .filter(t => t.amount < 0 && t.visible)
    .reduce((acc, t) => {
      const category = t.category;
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<TransactionCategory, number>);
  
  const chartData = [
    { name: 'Needs', value: spendingByCategory.need || 0, color: '#5c87d6' },
    { name: 'Wants', value: spendingByCategory.want || 0, color: '#f59e0b' },
    { name: 'Savings', value: spendingByCategory.savings || 0, color: '#10b981' },
  ];
  
  const toggleVisibility = (id: number) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, visible: !t.visible } : t));
  };
  
  const updateCategory = (id: number, category: TransactionCategory) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, category } : t));
    setEditingCategory(null);
  };
  
  const getCategoryColor = (category: TransactionCategory) => {
    switch(category) {
      case 'need': return 'bg-blue-100 text-blue-700';
      case 'want': return 'bg-amber-100 text-amber-700';
      case 'savings': return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="h-full flex bg-[#e8ebf1]">
      <div className="w-[400px] bg-white px-6 pt-6 shadow-sm overflow-auto">
        <h2 className="text-xl font-semibold text-[#2c3e50] mb-6">Spending Breakdown</h2>
        <div className="h-[350px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                {chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-[#f5f7fa] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="font-medium text-[#2c3e50]">{item.name}</span>
              </div>
              <span className="font-semibold text-[#2c3e50]">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-[#e8ebf1]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#6b7e9e]">Total Spending</span>
            <span className="text-lg font-semibold text-[#2c3e50]">${(chartData.reduce((sum, item) => sum + item.value, 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden bg-white px-6 pt-6">
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">All Transactions</h2>
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div key={transaction.id} className={`bg-white rounded-xl p-4 shadow-sm transition-opacity ${transaction.visible ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-[#2c3e50] font-medium">{transaction.name}</div>
                        {editingCategory === transaction.id ? (
                          <div className="flex gap-1">
                            {(['need', 'want', 'savings'] as TransactionCategory[]).map((cat) => (
                              <button key={cat} onClick={() => updateCategory(transaction.id, cat)} className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(cat)} hover:opacity-80 transition-opacity`}>{cat}</button>
                            ))}
                          </div>
                        ) : (
                          <button onClick={() => setEditingCategory(transaction.id)} className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getCategoryColor(transaction.category)} hover:opacity-80 transition-opacity`}>
                            {transaction.category}<Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-[#6b7e9e]">{transaction.date}</div>
                      {splitModalOpen === transaction.id && transaction.amount < 0 && (
                        <div className="mt-3 p-3 bg-[#f5f7fa] rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-[#2c3e50]">Split with Venmo</span>
                          </div>
                          <div className="mb-2">
                            <input type="range" min="0" max="100" value={splitPercentage} onChange={(e) => setSplitPercentage(Number(e.target.value))} className="w-full" />
                            <div className="flex justify-between text-xs text-[#6b7e9e] mt-1"><span>0%</span><span className="font-medium text-[#2c3e50]">{splitPercentage}%</span><span>100%</span></div>
                          </div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-[#6b7e9e]">Your share:</span>
                            <span className="font-semibold text-[#2c3e50]">${(Math.abs(transaction.amount) * (splitPercentage / 100)).toFixed(2)}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-[#008CFF] text-white rounded-lg text-sm font-medium hover:bg-[#0070CC] transition-colors" onClick={() => setSplitModalOpen(null)}>Request via Venmo</button>
                            <button className="px-3 py-2 bg-[#e8ebf1] text-[#6b7e9e] rounded-lg text-sm font-medium hover:bg-[#d8e2ec] transition-colors" onClick={() => setSplitModalOpen(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-[#2c3e50]'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      <div className="flex gap-1">
                        {transaction.amount < 0 && (
                          <button onClick={() => setSplitModalOpen(splitModalOpen === transaction.id ? null : transaction.id)} className="p-2 rounded-lg bg-[#e8f0fe] text-[#5c87d6] hover:bg-[#d8e6f7] transition-colors" title="Split with Venmo">
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => toggleVisibility(transaction.id)} className="p-2 rounded-lg bg-[#f5f7fa] text-[#6b7e9e] hover:bg-[#e8ebf1] transition-colors" title={transaction.visible ? "Hide transaction" : "Show transaction"}>
                          {transaction.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {splitModalOpen !== null && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSplitModalOpen(null)}></div>}
    </div>
  );
}

function FuturePage() {
  const [yearsAhead, setYearsAhead] = useState(5);
  const [scenarioEnabled, setScenarioEnabled] = useState(false);
  const [adjustedSavingsRate, setAdjustedSavingsRate] = useState(40);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [annualReturnRate, setAnnualReturnRate] = useState(7.0);
  const [monthlyIncome, setMonthlyIncome] = useState(5500);
  const [currentSavings, setCurrentSavings] = useState(25000);
  const [assets, setAssets] = useState(45000);
  const [debts, setDebts] = useState(15000);

  const netWorth = currentSavings + assets - debts;
  const monthlyExpenses = 3800;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const baseSavingsRate = ((monthlySavings / monthlyIncome) * 100);

  const generateProjection = (years: number, withScenario: boolean) => {
    const data = [];
    let baseValue = netWorth;
    let scenarioValue = netWorth;
    const adjustedMonthlySavings = (monthlyIncome * adjustedSavingsRate) / 100;
    for (let i = 0; i <= years; i++) {
      const year = 2026 + i;
      baseValue = baseValue * (1 + annualReturnRate / 100) + (monthlySavings * 12);
      if (withScenario) {
        scenarioValue = scenarioValue * (1 + annualReturnRate / 100) + (adjustedMonthlySavings * 12);
      }
      data.push({ year: year.toString(), base: Math.round(baseValue), scenario: withScenario ? Math.round(scenarioValue) : null });
    }
    return data;
  };

  const projectionData = generateProjection(yearsAhead, scenarioEnabled);

  return (
    <div className="h-full flex bg-[#e8ebf1]">
      <div className="w-[380px] bg-white px-6 pt-6 shadow-sm overflow-auto">
        <h2 className="text-xl font-semibold text-[#2c3e50] mb-6">Financial Overview</h2>
        
        <div className="bg-gradient-to-br from-[#5c87d6] to-[#4a6bb8] rounded-xl p-5 mb-6 text-white">
          <p className="text-sm opacity-90 mb-1">Current Net Worth</p>
          <p className="text-3xl font-bold">${netWorth.toLocaleString()}</p>
          <div className="mt-3 pt-3 border-t border-white/20 text-sm">
            <div className="flex justify-between mb-1"><span className="opacity-80">Assets</span><span>${(currentSavings + assets).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="opacity-80">Debts</span><span>-${debts.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="bg-[#f5f7fa] rounded-xl p-4 mb-6">
          <p className="text-sm text-[#6b7e9e] mb-1">Base Savings Rate</p>
          <p className="text-2xl font-bold text-[#2c3e50] mb-2">{baseSavingsRate.toFixed(1)}%</p>
          <div className="text-sm text-[#6b7e9e]">
            <div className="flex justify-between mb-1"><span>Income</span><span className="text-[#2c3e50] font-medium">${monthlyIncome.toLocaleString()}</span></div>
            <div className="flex justify-between mb-1"><span>Expenses</span><span className="text-[#2c3e50] font-medium">${monthlyExpenses.toLocaleString()}</span></div>
            <div className="flex justify-between pt-2 border-t border-[#e8ebf1]"><span className="font-medium text-[#2c3e50]">Monthly Savings</span><span className="text-green-600 font-bold">${monthlySavings.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="bg-[#e8f0fe] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#2c3e50]">Projection Assumptions</p>
            <button onClick={() => setShowAssumptions(!showAssumptions)} className="text-xs px-2 py-1 rounded bg-[#5c87d6] text-white hover:bg-[#4a6bb8] transition-colors">{showAssumptions ? 'Hide' : 'Edit'}</button>
          </div>
          {!showAssumptions ? (
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-[#6b7e9e]">Annual Return Rate</span><span className="text-[#2c3e50] font-medium">{annualReturnRate.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-[#6b7e9e]">Monthly Income</span><span className="text-[#2c3e50] font-medium">${monthlyIncome.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7e9e]">Current Savings</span><span className="text-[#2c3e50] font-medium">${currentSavings.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7e9e]">Other Assets</span><span className="text-[#2c3e50] font-medium">${assets.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7e9e]">Debts</span><span className="text-[#2c3e50] font-medium">${debts.toLocaleString()}</span></div>
              <div className="flex justify-between pt-2 border-t border-[#5c87d6]/20"><span className="text-[#6b7e9e]">Base Savings Rate</span><span className="text-[#2c3e50] font-medium">{baseSavingsRate.toFixed(1)}%</span></div>
            </div>
          ) : (
            <div className="text-sm space-y-3">
              <div><label className="text-[#6b7e9e] text-xs block mb-1">Annual Return Rate (%)</label><input type="number" value={annualReturnRate} onChange={(e) => setAnnualReturnRate(Number(e.target.value))} step="0.1" min="0" max="30" className="w-full px-3 py-1.5 rounded border border-[#e8ebf1] text-[#2c3e50] focus:outline-none focus:border-[#5c87d6]" /></div>
              <div><label className="text-[#6b7e9e] text-xs block mb-1">Monthly Income ($)</label><input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} step="100" min="0" className="w-full px-3 py-1.5 rounded border border-[#e8ebf1] text-[#2c3e50] focus:outline-none focus:border-[#5c87d6]" /></div>
              <div><label className="text-[#6b7e9e] text-xs block mb-1">Current Savings ($)</label><input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} step="1000" min="0" className="w-full px-3 py-1.5 rounded border border-[#e8ebf1] text-[#2c3e50] focus:outline-none focus:border-[#5c87d6]" /></div>
              <div><label className="text-[#6b7e9e] text-xs block mb-1">Other Assets ($)</label><input type="number" value={assets} onChange={(e) => setAssets(Number(e.target.value))} step="1000" min="0" className="w-full px-3 py-1.5 rounded border border-[#e8ebf1] text-[#2c3e50] focus:outline-none focus:border-[#5c87d6]" /></div>
              <div><label className="text-[#6b7e9e] text-xs block mb-1">Debts ($)</label><input type="number" value={debts} onChange={(e) => setDebts(Number(e.target.value))} step="1000" min="0" className="w-full px-3 py-1.5 rounded border border-[#e8ebf1] text-[#2c3e50] focus:outline-none focus:border-[#5c87d6]" /></div>
              <div className="pt-2 border-t border-[#5c87d6]/20 text-xs text-[#6b7e9e]">Calculated Base Savings Rate: <span className="font-bold text-[#2c3e50]">{baseSavingsRate.toFixed(1)}%</span></div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="text-sm font-medium text-[#2c3e50] mb-3 block">Projection Timeline: {yearsAhead} {yearsAhead === 1 ? 'year' : 'years'}</label>
          <div className="space-y-2">
            <input type="range" min="1" max="30" value={yearsAhead} onChange={(e) => setYearsAhead(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-[#6b7e9e]"><span>1 year</span><span>30 years</span></div>
          </div>
        </div>

        <div className="border-t border-[#e8ebf1] pt-6">
          <div className="flex items-center justify-between mb-4">
            <div><p className="font-medium text-[#2c3e50]">Scenario Planning</p><p className="text-sm text-[#6b7e9e]">Adjust savings rate</p></div>
            <button onClick={() => setScenarioEnabled(!scenarioEnabled)} className={`relative w-12 h-6 rounded-full transition-colors ${scenarioEnabled ? 'bg-[#5c87d6]' : 'bg-[#e8ebf1]'}`}>
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${scenarioEnabled ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>
          {scenarioEnabled && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#2c3e50] mb-3 block">Adjusted Savings Rate: {adjustedSavingsRate.toFixed(1)}%</label>
                <div className="space-y-2">
                  <input type="range" min="0" max="80" step="0.5" value={adjustedSavingsRate} onChange={(e) => setAdjustedSavingsRate(Number(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-[#6b7e9e]"><span>0%</span><span>80%</span></div>
                </div>
              </div>
              <div className="bg-[#e8f0fe] rounded-lg p-3 text-sm text-[#2c3e50]">
                <p className="font-medium mb-1">Scenario Impact</p>
                <p className="text-xs text-[#6b7e9e] mb-2">Monthly savings: <span className="font-bold text-[#5c87d6]">${((monthlyIncome * adjustedSavingsRate) / 100).toFixed(0)}</span> ({adjustedSavingsRate >= baseSavingsRate ? '+' : ''}{((monthlyIncome * adjustedSavingsRate) / 100 - monthlySavings).toFixed(0)})</p>
                <p className="text-xs text-[#6b7e9e]">Net worth in {yearsAhead} {yearsAhead === 1 ? 'year' : 'years'}: <span className="font-bold text-green-600">${projectionData[projectionData.length - 1].scenario!.toLocaleString()}</span> ({adjustedSavingsRate >= baseSavingsRate ? '+' : ''}{(projectionData[projectionData.length - 1].scenario! - projectionData[projectionData.length - 1].base).toLocaleString()})</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white px-6 pt-6">
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-6">Net Worth Projection</h2>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8ebf1" />
                    <XAxis dataKey="year" stroke="#6b7e9e" />
                    <YAxis stroke="#6b7e9e" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #e8ebf1' }} />
                    <Legend />
                    <Line type="monotone" dataKey="base" stroke="#5c87d6" strokeWidth={3} name="Base Projection" dot={{ fill: '#5c87d6', r: 4 }} />
                    {scenarioEnabled && <Line type="monotone" dataKey="scenario" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" name="Increased Savings Scenario" dot={{ fill: '#10b981', r: 4 }} />}
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 pt-6 border-t border-[#e8ebf1] grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#f5f7fa] rounded-lg">
                  <p className="text-sm text-[#6b7e9e] mb-1">Projected Net Worth ({projectionData[projectionData.length - 1].year})</p>
                  <p className="text-2xl font-bold text-[#2c3e50]">${projectionData[projectionData.length - 1].base.toLocaleString()}</p>
                </div>
                {scenarioEnabled && (
                  <div className="text-center p-4 bg-[#e8f0fe] rounded-lg">
                    <p className="text-sm text-[#6b7e9e] mb-1">With Scenario ({projectionData[projectionData.length - 1].year})</p>
                    <p className="text-2xl font-bold text-green-600">${projectionData[projectionData.length - 1].scenario!.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
