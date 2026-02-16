
import React, { useEffect, useState } from 'react';
import { generateMarketingCopy } from '../services/geminiService';
import { TrendingUp, Award, Users, Zap, Terminal } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [headline, setHeadline] = useState("Decode the Markets.");

  useEffect(() => {
    generateMarketingCopy().then(setHeadline);
  }, []);

  const handleGetStarted = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    onStart();
  };

  return (
    <div className="relative pt-10 pb-12 px-6 text-center overflow-hidden animate-slide-up">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#7E61E7]/20 blur-[80px] -z-10 rounded-full"></div>
      
      <div className="inline-flex items-center space-x-2 px-3 py-1 mb-6 rounded-full glass border border-[#AB9FF2]/20 text-[10px] font-bold text-[#AB9FF2] uppercase tracking-widest">
        <Terminal size={12} />
        <span>PULSE TERMINAL V4.2</span>
      </div>
      
      <h1 className="text-4xl font-outfit font-bold mb-4 tracking-tight leading-[1.1]">
        {headline}
      </h1>
      
      <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
        Quantum-grade algorithms now synchronized with your Telegram account. Gain the edge.
      </p>
      
      <button 
        onClick={handleGetStarted}
        className="w-full py-4 rounded-2xl phantom-gradient text-white font-bold text-md shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mb-8"
      >
        ACCESS TERMINAL
      </button>

      <div className="grid grid-cols-3 gap-2 opacity-60">
        {[
          { icon: TrendingUp, label: '91.4%', sub: 'Acc.' },
          { icon: Users, label: '14k+', sub: 'Agents' },
          { icon: Zap, label: '50ms', sub: 'Latency' }
        ].map((stat, i) => (
          <div key={i} className="glass p-2 rounded-2xl border-white/5">
            <stat.icon size={14} className="mx-auto mb-1 text-[#AB9FF2]" />
            <div className="font-bold text-xs">{stat.label}</div>
            <div className="text-[8px] text-zinc-500 uppercase tracking-tighter">{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
