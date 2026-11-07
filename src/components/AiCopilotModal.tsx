import React, { useState } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Activity,
} from 'lucide-react';
import { useCityData } from '../context/CityDataContext';
import { GeminiCityCopilot } from '../services/geminiService';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({ isOpen, onClose }) => {
  const { metrics, mapNodes, complaints } = useCityData();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Namaskaram! I am the **Vijayawada Smart City AI Copilot** (VMC Digital Twin).
I continuously analyze live telemetry from 1,280+ IoT edge sensors across Benz Circle, Prakasam Barrage, Auto Nagar, and One Town.

How can I assist your municipal operations or citizen inquiries today?`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'What is the traffic congestion forecast for Benz Circle at 18:00?',
    'What is the Prakasam Barrage reservoir water level and SCADA status?',
    'How many waste compactors in One Town and PNBS need pickup?',
    'What are the air quality (PM2.5) readings in Auto Nagar?',
    'What is the status of open pothole grievances on Eluru Road?',
  ];

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
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
        sender: 'ai',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'VMC telemetry stream connection error. Sensors remain at nominal baseline.',
          time: 'Just now',
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="hud-panel rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-cyan-400/50 shadow-2xl flex flex-col h-[620px] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070c14]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-400/40 shadow-xs">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-hud font-bold text-slate-900 dark:text-white text-sm md:text-base tracking-wide">
                  Vijayawada Urban Intelligence AI Copilot
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full font-mono-code font-bold">
                  AUTONOMOUS AGENT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono-code">
                VMC Command Center • Gemini 2.5 Flash / Real Telemetry Context
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Quick Prompts Bar */}
        <div className="px-4 py-2.5 bg-white dark:bg-[#050910] border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span className="text-[10px] font-mono-code text-slate-500 uppercase tracking-wider shrink-0 font-semibold">
            Quick Inquiries:
          </span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(qp)}
              className="text-[11px] font-mono-code text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-300 bg-slate-100 dark:bg-[#0b1322] border border-slate-200 dark:border-slate-800 hover:border-cyan-400 px-3 py-1 rounded-full whitespace-nowrap transition-colors shrink-0 shadow-2xs cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono-code text-xs bg-slate-50/50 dark:bg-transparent">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-400/40 text-cyan-800 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white font-medium rounded-tr-none shadow-sm'
                    : 'bg-white dark:bg-[#070c14] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none whitespace-pre-line shadow-xs'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1.5 ${
                    m.sender === 'user' ? 'text-cyan-100 text-right' : 'text-slate-400 text-left'
                  }`}
                >
                  {m.time}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 text-xs italic animate-pulse">
              <Activity className="w-4 h-4 animate-spin" />
              <span>Analyzing Vijayawada digital twin sensors and preparing response...</span>
            </div>
          )}
        </div>

        {/* Bottom Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070c14] flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about Benz Circle traffic, Prakasam Barrage water, streetlights, or report issues..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 dark:bg-[#0b1322] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:border-cyan-500 font-mono-code transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 text-xs font-mono-code shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
