import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, MessageCircle, User, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  levelName: string;
  levelColor: string;
  score: number;
  streak: number;
  isOnline: boolean;
  interests: string[];
  bio: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: Date;
  isAI?: boolean;
}

interface Conversation {
  id: string;
  friend: Friend | null;
  isOpto: boolean;
  label: string;
  messages: Message[];
  lastMessage?: string;
  unread: number;
}

const friends: Friend[] = [
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
    bio: "Helping friends navigate their investment journey. Always happy to share what I've learned!",
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

const initialConversations: Conversation[] = [
  {
    id: 'opto-general',
    friend: null,
    isOpto: true,
    label: 'Ask Opto',
    messages: [
      {
        id: '1',
        senderId: 'opto',
        text: "Hi! I'm Opto, your AI financial wellness assistant. Ask me anything about budgeting, saving, investing, or your financial goals! 🎯",
        timestamp: new Date(Date.now() - 60000),
        isAI: true,
      },
    ],
    lastMessage: "Hi! I'm Opto, your AI financial wellness assistant...",
    unread: 0,
  },
  {
    id: 'conv-sarah',
    friend: friends[0],
    isOpto: false,
    label: 'Sarah M.',
    messages: [
      {
        id: '1',
        senderId: 'sarah',
        senderName: 'Sarah M.',
        text: 'Hey! Did you see the new savings challenge? 💰',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: '2',
        senderId: 'me',
        text: "Yes! I'm definitely joining. Want to do it together?",
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        id: '3',
        senderId: 'sarah',
        senderName: 'Sarah M.',
        text: "Absolutely! Let's hold each other accountable 🙌",
        timestamp: new Date(Date.now() - 3400000),
      },
    ],
    lastMessage: "Absolutely! Let's hold each other accountable 🙌",
    unread: 1,
  },
  {
    id: 'conv-mike',
    friend: friends[1],
    isOpto: false,
    label: 'Mike R.',
    messages: [
      {
        id: '1',
        senderId: 'mike',
        senderName: 'Mike R.',
        text: "Great job hitting Level 5! Here's a tip about index funds...",
        timestamp: new Date(Date.now() - 86400000),
      },
    ],
    lastMessage: "Great job hitting Level 5! Here's a tip...",
    unread: 0,
  },
];

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchAIResponse(
  messages: Message[],
  conversationContext?: { type: string; details?: string }
): Promise<{ message: string; fallback: boolean }> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(m => ({
          senderId: m.senderId,
          senderName: m.senderName,
          text: m.text,
        })),
        conversationContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch AI response:', error);
    return {
      message: "I'm having trouble connecting right now. Please try again in a moment! 🔄",
      fallback: true,
    };
  }
}

async function checkAIStatus(): Promise<boolean> {
  try {
    const response = await fetch('/api/chat/status');
    const data = await response.json();
    return data.configured;
  } catch {
    return false;
  }
}

// ─── Typing indicator component ──────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-gradient-to-br from-[#f0f4f8] to-[#e8f0fe] border border-[#d8e2ec] rounded-2xl px-4 py-3 flex items-center gap-1.5">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-[#5c87d6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-[#5c87d6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-[#5c87d6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs text-[#6b7e9e] ml-1.5">Opto is thinking...</span>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface FriendsPageProps {
  openConversation?: string | null;
  onConversationOpened?: () => void;
}

export function FriendsPage({ openConversation, onConversationOpened }: FriendsPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check AI status on mount
  useEffect(() => {
    checkAIStatus().then(setAiConfigured);
  }, []);

  useEffect(() => {
    if (openConversation) {
      setActiveConversation(openConversation);
      onConversationOpened?.();
    }
  }, [openConversation, onConversationOpened]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation, conversations, isAITyping]);

  const activeConv = conversations.find(c => c.id === activeConversation);

  const requestAIAdvice = useCallback(async (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;

    setIsAITyping(true);

    const context = conv.isOpto
      ? { type: 'direct-opto', details: 'User is chatting directly with Opto AI assistant.' }
      : {
          type: 'friend-chat',
          details: `User requested AI advice in a conversation with their friend ${conv.friend?.name}. Provide insight relevant to what they've been discussing.`,
        };

    const result = await fetchAIResponse(conv.messages, context);

    const aiMessage: Message = {
      id: Date.now().toString(),
      senderId: 'opto',
      text: result.message,
      timestamp: new Date(),
      isAI: true,
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, aiMessage],
              lastMessage: result.message.substring(0, 40) + '...',
            }
          : c
      )
    );

    setIsAITyping(false);
  }, [conversations]);

  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() || !activeConversation || isAITyping) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: messageInput,
      timestamp: new Date(),
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageInput,
            }
          : conv
      )
    );

    setMessageInput('');

    // For Opto conversations, automatically fetch AI response
    const conv = conversations.find(c => c.id === activeConversation);
    if (conv?.isOpto) {
      // We need to include the new message in the API call
      setIsAITyping(true);

      const allMessages = [...conv.messages, newMessage];
      const context = { type: 'direct-opto', details: 'User is chatting directly with Opto AI assistant.' };
      const result = await fetchAIResponse(allMessages, context);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: 'opto',
        text: result.message,
        timestamp: new Date(),
        isAI: true,
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === activeConversation
            ? {
                ...c,
                messages: [...c.messages, aiMessage],
                lastMessage: result.message.substring(0, 40) + '...',
              }
            : c
        )
      );

      setIsAITyping(false);
    }
  }, [messageInput, activeConversation, isAITyping, conversations]);

  return (
    <div className="h-full flex bg-[#e8ebf1]">
      {/* Conversation List */}
      <div className={`w-[320px] bg-white shadow-sm flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-[#2c3e50] mb-1">Conversations</h1>
          <p className="text-sm text-[#6b7e9e]">
            Chat with friends and ask Opto
            {aiConfigured === true && (
              <span className="ml-1.5 inline-flex items-center gap-1 text-[#5c87d6]">
                <Sparkles className="w-3 h-3" /> AI Active
              </span>
            )}
          </p>
        </div>

        <div className="flex-1 overflow-auto px-3">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConversation(conv.id);
                setConversations(prev =>
                  prev.map(c => c.id === conv.id ? { ...c, unread: 0 } : c)
                );
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all text-left ${
                activeConversation === conv.id
                  ? 'bg-[#e8f0fe] shadow-sm'
                  : 'hover:bg-[#f5f7fa]'
              }`}
            >
              {conv.isOpto ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  O
                </div>
              ) : (
                <div className="relative flex-shrink-0">
                  <img
                    src={conv.friend?.avatar}
                    alt={conv.label}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.friend?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4ade80] border-2 border-white rounded-full"></div>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#2c3e50] text-sm">{conv.label}</span>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#5c87d6] text-white text-xs flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6b7e9e] truncate mt-0.5">
                  {conv.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white ${!activeConversation ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e8ebf1]">
              <button
                onClick={() => setActiveConversation(null)}
                className="md:hidden p-1 rounded-lg hover:bg-[#f5f7fa]"
              >
                <ChevronLeft className="w-5 h-5 text-[#6b7e9e]" />
              </button>
              {activeConv.isOpto ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] flex items-center justify-center text-white font-bold">
                  O
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={activeConv.friend?.avatar}
                    alt={activeConv.label}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {activeConv.friend?.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4ade80] border-2 border-white rounded-full"></div>
                  )}
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-[#2c3e50]">{activeConv.label}</h3>
                <p className="text-xs text-[#6b7e9e]">
                  {activeConv.isOpto
                    ? 'AI Financial Assistant · Powered by GPT'
                    : activeConv.friend?.isOnline
                    ? 'Online'
                    : 'Offline'}
                </p>
              </div>

              {/* "Ask Opto" button in friend conversations */}
              {!activeConv.isOpto && (
                <button
                  onClick={() => requestAIAdvice(activeConv.id)}
                  disabled={isAITyping}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] text-white hover:from-[#4a6bb8] hover:to-[#3d5a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm shadow-sm"
                  title="Get AI financial advice on this conversation"
                >
                  {isAITyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="font-medium">Ask Opto</span>
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
              {activeConv.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col max-w-[70%]">
                    {/* AI badge for Opto messages in friend chats */}
                    {msg.isAI && !activeConv.isOpto && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#5c87d6] to-[#4a6bb8] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">O</span>
                        </div>
                        <span className="text-xs font-medium text-[#5c87d6]">Opto AI</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        msg.senderId === 'me'
                          ? 'bg-[#5c87d6] text-white'
                          : msg.senderId === 'opto' || msg.isAI
                          ? 'bg-gradient-to-br from-[#f0f4f8] to-[#e8f0fe] text-[#2c3e50] border border-[#d8e2ec]'
                          : 'bg-[#f5f7fa] text-[#2c3e50]'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderId === 'me' ? 'text-white/70' : 'text-[#6b7e9e]'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isAITyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-[#e8ebf1]">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={isAITyping}
                  placeholder={
                    isAITyping
                      ? 'Opto is thinking...'
                      : activeConv.isOpto
                      ? 'Ask Opto anything about finances...'
                      : `Message ${activeConv.label}...`
                  }
                  className="flex-1 px-4 py-3 rounded-xl bg-[#f5f7fa] border border-[#e8ebf1] text-sm focus:outline-none focus:border-[#5c87d6] focus:ring-1 focus:ring-[#5c87d6]/20 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || isAITyping}
                  className="p-3 rounded-xl bg-[#5c87d6] text-white hover:bg-[#4a6bb8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* AI status hint */}
              {activeConv.isOpto && aiConfigured === false && (
                <p className="text-xs text-[#f5a623] mt-2 flex items-center gap-1">
                  ⚠️ AI not configured — add your OpenAI API key to <code className="bg-[#f5f7fa] px-1 rounded">.env</code> for real responses
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#e8f0fe] flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-[#5c87d6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">
                Select a conversation
              </h3>
              <p className="text-sm text-[#6b7e9e] mb-4">
                Chat with friends or ask Opto for financial advice
              </p>
              {aiConfigured === true && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f0fe] text-[#5c87d6] text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  AI Powered by GPT
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
