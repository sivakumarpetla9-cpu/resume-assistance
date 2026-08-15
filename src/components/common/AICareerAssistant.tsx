import React, { useState } from 'react';
import { Sparkles, Send, X, Cpu } from 'lucide-react';
import { StitchAPI } from '../../api/client';

interface Props {
  activeScreen: string;
}

export const AICareerAssistant: React.FC<Props> = ({ activeScreen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your STITCH AI Career Assistant. I am tracking your context for the active page (${activeScreen}). How can I help optimize your career strategy today?`
    }
  ]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await StitchAPI.chatAssistant(activeScreen, userMsg);
      setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'AI service is temporarily unavailable. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#35C6FF] to-[#4F7CFF] text-[#070A0F] font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(53,198,255,0.5)] hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>AI CAREER ASSISTANT</span>
        </button>
      ) : (
        <div className="w-96 h-[480px] bg-[#0C1118] border border-[#1C2633] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-[#111822] border-b border-[#1C2633] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#35C6FF]/10 border border-[#35C6FF]/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#35C6FF]" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold text-[#F3F5F7]">AI CAREER ASSISTANT</h4>
                <p className="text-[10px] font-mono text-[#35C6FF]">CONTEXT: {activeScreen.toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-[#66717F] hover:text-[#F3F5F7] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] p-3 rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-[#35C6FF] text-[#070A0F] font-medium rounded-br-none'
                      : 'bg-[#151D28] border border-[#1C2633] text-[#A7B0BC] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 bg-[#151D28] border border-[#1C2633] rounded-xl text-[#35C6FF] text-xs font-mono animate-pulse">
                  AI THINKING...
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#111822] border-t border-[#1C2633] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask context question..."
              className="flex-1 bg-[#070A0F] border border-[#1C2633] rounded-lg px-3 py-2 text-xs text-[#F3F5F7] focus:outline-none focus:border-[#35C6FF]"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 rounded-lg bg-[#35C6FF] text-[#070A0F] hover:bg-[#35C6FF]/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
