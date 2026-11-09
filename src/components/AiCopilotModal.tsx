import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Activity,
  Trash2,
  Minimize2,
  Maximize2,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  HeartPulse,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { GeminiCityCopilot } from '../services/geminiService';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const CIVY_LOGO_URL = '/assets/civy-logo.jpeg';

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({ isOpen, onClose }) => {
  const { metrics, mapNodes, complaints } = useCityData();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Namaskaram! I am **Civy** (సివి), your friendly Smart City AI Assistant! 🤖🏙️✨

I am here to help keep our city **Smarter, Safer, and Greener**. How can I help you today?

• **🚨 Emergency Services**: Nearest 24/7 hospitals (GGH, Manipal, Ramesh), police, fire rescue & 108 dials.
• **🗑️ Waste & Sanitation**: How to submit waste disposal grievances, municipal garbage schedules, and eco recycling.
• **⚡ City Telemetry**: Live power grid demand, solar generation, Prakasam Barrage water levels, and sensors.
• **🌐 General Questions**: Andhra Pradesh tourism, history, weather, facts, or any question you have!`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = [
    { label: '👋 Say Hi to Civy', query: 'Hi Civy! Introduce yourself and tell me what you can do.' },
    { label: '🏥 Nearest Emergency Hospital', query: 'What is the nearest 24/7 emergency hospital and trauma center near Benz Circle?' },
    { label: '🗑️ Waste Disposal Reporting', query: 'How do I report uncollected garbage and waste disposal issues in my ward?' },
    { label: '🚦 Live Traffic & Detours', query: 'What is the current traffic congestion at Benz Circle and recommended detour?' },
    { label: '⚡ Clean Energy & Solar', query: 'What is the current power grid demand and solar generation in Gunadala?' },
    { label: '💧 Prakasam Barrage SCADA', query: 'What is the water level and reservoir telemetry at Prakasam Barrage?' },
    { label: '🚌 Transit: PNBS Bus & Trains', query: 'How do I reach Pandit Nehru Bus Station (PNBS) and Vijayawada Railway Station?' },
    { label: '🏛️ Top Places to Visit', query: 'What are the top heritage tourist attractions to visit in Vijayawada?' },
    { label: '🌐 General Question', query: 'Tell me about the history and growth of Vijayawada and Andhra Pradesh.' },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, loading]);

  if (!isOpen) return null;

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const copilot = GeminiCityCopilot.getInstance();
      const response = await copilot.askUrbanCopilot(promptText, {
        metrics,
        activeNodes: mapNodes,
        complaints,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `I apologize, I encountered a brief network delay connecting to the AI model. 

For urgent emergencies:
• **Medical / Ambulance**: Dial **108**
• **Police Emergency**: Dial **100 / 112**
• **Fire Office**: Dial **101**
• **Municipal Complaints**: Submit under the **My Complaints** tab.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'cleared-1',
        sender: 'ai',
        text: 'Chat history cleared. I am ready to answer any question about city telemetry, emergency assistance, waste disposal, or general topics!',
        time: 'Just now',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className={`bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
          isExpanded
            ? 'w-full max-w-4xl h-[90vh]'
            : 'w-full max-w-2xl h-[650px] max-h-[92vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-100 bg-[#0c1e33] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={CIVY_LOGO_URL}
                alt="Civy - Smart City AI"
                className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400 shadow-md ring-2 ring-cyan-500/20"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c1e33] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base tracking-wide text-white flex items-center gap-1.5">
                  <span>Civy</span>
                  <span className="text-xs font-normal text-cyan-300">సివి</span>
                </h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full font-bold">
                  Smarter • Safer • Greener
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Your Friendly Smart City AI Companion • Live Telemetry & 24/7 Citizen Answers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block cursor-pointer"
              title={isExpanded ? 'Restore size' : 'Expand full window'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Inquiries Scrolling Pills */}
        <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#1366d9] shrink-0" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(qp.query)}
              className="text-xs text-slate-700 hover:text-[#1366d9] hover:bg-blue-50 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1 rounded-full whitespace-nowrap transition-all shrink-0 shadow-2xs font-medium cursor-pointer"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm bg-[#f8fafc]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="relative shrink-0 mt-0.5">
                  <img
                    src={CIVY_LOGO_URL}
                    alt="Civy"
                    className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400 shadow-xs"
                  />
                </div>
              )}

              <div
                className={`p-3.5 sm:p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#1366d9] text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line shadow-xs'
                }`}
              >
                <div className="prose prose-xs max-w-none text-inherit">{m.text}</div>
                <div
                  className={`text-[10px] mt-2 font-medium ${
                    m.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400 text-left'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-600 bg-white border border-slate-200 rounded-2xl p-3 w-fit shadow-xs animate-in fade-in">
              <img
                src={CIVY_LOGO_URL}
                alt="Civy thinking"
                className="w-6 h-6 rounded-full object-cover border border-cyan-400 animate-pulse shrink-0"
              />
              <span className="text-xs font-semibold text-slate-700">
                Civy is thinking and finding the best answer...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-3.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type any question (e.g., nearest hospital, waste disposal, traffic, history, science)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-[#1366d9] focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-2.5 bg-[#1366d9] hover:bg-[#0f52b0] disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm shadow-sm cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </form>
      </div>
    </div>
  );
};
