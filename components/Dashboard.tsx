
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_PREDICTIONS } from '../constants';
import PredictionCard from './PredictionCard';
import { UserState } from '../types';
import { analyzeTradingChart } from '../services/geminiService';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import { 
  Activity, Eye, Camera, AlertTriangle, Users, 
  FileText, Radar as RadarIcon, Flame, Cpu as CpuIcon, 
  Brain, Share2, TrendingUp as UpIcon, TrendingDown as DownIcon,
  MessageSquare, Zap, Target
} from 'lucide-react';

interface TradeMessage {
  id: number;
  user: string;
  action: string;
  type: 'BUY' | 'SELL' | 'SYSTEM' | 'WHALE';
}

interface DashboardProps {
  user: UserState;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [onlineUsers, setOnlineUsers] = useState(Math.floor(Math.random() * (2400 - 1800) + 1800));
  const [bullVotes, setBullVotes] = useState(68);
  const [isVisionLoading, setIsVisionLoading] = useState(false);
  const [visionResult, setVisionResult] = useState<string | null>(null);
  const [visionError, setVisionError] = useState<string | null>(null);
  const [hasUsedVision, setHasUsedVision] = useState(() => localStorage.getItem('used_vision') === 'true');

  const volatilityData = [
    { subject: 'Volume', A: 120 },
    { subject: 'Volatility', A: 98 },
    { subject: 'Depth', A: 86 },
    { subject: 'Sentiment', A: 99 },
    { subject: 'Whales', A: 85 },
    { subject: 'Funding', A: 65 },
  ];

  const [chatMessages, setChatMessages] = useState<TradeMessage[]>([]);
  const msgIdRef = useRef(0);

  useEffect(() => {
    const userInterval = setInterval(() => setOnlineUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1)), 5000);
    
    const tradeInterval = setInterval(() => {
      const users = ["CryptoWhale", "MoonSeeker", "TradeBot_99", "Anon_42", "SolanaKing", "EthBull", "PepeX", "LaserEyes"];
      const coins = ["BTC", "ETH", "SOL", "TON", "PEPE"];
      const types: Array<'BUY' | 'SELL' | 'SYSTEM' | 'WHALE'> = ['BUY', 'SELL', 'BUY', 'WHALE'];
      
      const type = types[Math.floor(Math.random() * types.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const coin = coins[Math.floor(Math.random() * coins.length)];
      const amount = (Math.random() * (type === 'WHALE' ? 50 : 2)).toFixed(2);
      
      let action = "";
      if (type === 'WHALE') action = `SPLASH: $${amount}M ${coin} INFLOW`;
      else if (type === 'SYSTEM') action = `NODE SYNC: 100% SUCCESS`;
      else action = `${type} ${amount} ${coin}`;

      const newMessage: TradeMessage = {
        id: ++msgIdRef.current,
        user: type === 'SYSTEM' ? 'SYSTEM' : user,
        action,
        type
      };

      setChatMessages(prev => [newMessage, ...prev].slice(0, 8));
    }, 1200);

    return () => { clearInterval(userInterval); clearInterval(tradeInterval); };
  }, []);

  const handleVisionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      processVision((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const processVision = async (base64: string) => {
    setIsVisionLoading(true);
    setVisionError(null);
    const result = await analyzeTradingChart(base64);
    setVisionResult(result || "Analysis inconclusive.");
    setHasUsedVision(true);
    localStorage.setItem('used_vision', 'true');
    setIsVisionLoading(false);
  };

  const getVerdictDetails = () => {
    if (!visionResult) return null;
    const normalized = visionResult.toUpperCase();
    if (normalized.includes('RISE')) return { label: 'RISE', icon: UpIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
    if (normalized.includes('FALL')) return { label: 'FALL', icon: DownIcon, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
    return { label: 'NEUTRAL', icon: Activity, color: 'text-zinc-400', bg: 'bg-zinc-800/50', border: 'border-white/10' };
  };

  const verdict = getVerdictDetails();

  return (
    <div className="pb-32 animate-slide-up px-4 relative">
      {/* Header */}
      <header className="py-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-outfit font-bold neon-text-cyan">PULSE: TERMINAL</h2>
          <div className="flex items-center space-x-3 mt-1">
             <div className="flex items-center text-[10px] text-emerald-400 font-mono font-bold animate-pulse-neon">
                <Users size={12} className="mr-1" /> {onlineUsers} ACTIVE
             </div>
             <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest ml-2">SYNC: STABLE</p>
          </div>
        </div>
        <div className="flex items-center">
           <div className="w-2 h-2 rounded-full bg-[#00f2ff] mr-2 animate-pulse-neon"></div>
           <span className="text-[10px] font-bold text-[#00f2ff]">UPLINK ACTIVE</span>
        </div>
      </header>

      {/* VOLATILITY RADAR */}
      <div className="glass rounded-[32px] p-6 mb-8 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-cyan-500/10 rounded-2xl mr-4">
            <RadarIcon size={24} className="text-cyan-400" />
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-cyan-400">Market Stress Radar</h4>
            <p className="text-[9px] text-zinc-500 font-mono italic">Real-time Anomaly Detection</p>
          </div>
        </div>
        <div className="h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={volatilityData}>
              <PolarGrid stroke="#ffffff10" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 8 }} />
              <Radar
                name="Market State"
                dataKey="A"
                stroke="#00f2ff"
                fill="#00f2ff"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SENTIMENT WAR */}
      <div className="glass rounded-[32px] p-6 mb-8 border-emerald-500/20 relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold flex items-center text-sm text-emerald-400">
            <Target size={16} className="mr-2" /> Global Order Sentiment
          </h4>
          <span className="text-[10px] font-mono text-zinc-500">LIVE VOTE</span>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <button onClick={() => setBullVotes(v => Math.min(100, v + 1))} className="flex-1 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center hover:bg-emerald-500/20 active:scale-95 transition-all">
            <UpIcon className="text-emerald-400 mb-1" size={20} />
            <span className="text-[10px] font-black text-emerald-400">BULLS</span>
          </button>
          <button onClick={() => setBullVotes(v => Math.max(0, v - 1))} className="flex-1 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-col items-center hover:bg-rose-500/20 active:scale-95 transition-all">
            <DownIcon className="text-rose-500 mb-1" size={20} />
            <span className="text-[10px] font-black text-rose-500">BEARS</span>
          </button>
        </div>
        <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex shadow-inner">
          <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${bullVotes}%` }}></div>
          <div className="h-full bg-rose-600 transition-all duration-500" style={{ width: `${100 - bullVotes}%` }}></div>
        </div>
      </div>

      {/* VISION SCANNER */}
      <div className="glass rounded-[32px] p-6 mb-8 border-[#AB9FF2]/60 relative overflow-hidden shadow-[0_0_20px_rgba(171,159,242,0.1)]">
        <div className="flex flex-col mb-4">
          <h4 className="font-bold flex items-center text-sm text-[#AB9FF2]">
            <Eye size={18} className="mr-2" /> Neural Vision: Predict
          </h4>
          <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase leading-tight">
            Feed any visual signal to the AI for instant technical decoding.
          </p>
        </div>

        {hasUsedVision && !visionResult ? (
          <div className="p-10 text-center glass rounded-2xl border-dashed border-zinc-800 bg-black/40">
            <AlertTriangle className="mx-auto text-zinc-700 mb-3" size={32} />
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest font-bold">PROBE DEPLETED.</p>
          </div>
        ) : visionResult ? (
          <div className="animate-slide-up">
            {verdict && (
              <div className={`mb-4 p-4 rounded-3xl border flex justify-between items-center ${verdict.bg} ${verdict.border}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-xl ${verdict.bg} mr-3`}>
                    <verdict.icon size={20} className={verdict.color} />
                  </div>
                  <span className={`text-xl font-black ${verdict.color} tracking-tighter`}>{verdict.label}</span>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-mono text-zinc-400 uppercase">Neural Insight</div>
              </div>
            )}
            <div className="p-6 rounded-3xl bg-[#0a0a0f] border border-white/5 text-[11px] font-mono leading-relaxed text-zinc-200 shadow-2xl relative overflow-hidden">
              <div className="flex items-center mb-4 pb-3 border-b border-white/5">
                <FileText size={16} className="mr-2 text-[#AB9FF2]" />
                <span className="text-[#AB9FF2] font-black uppercase tracking-[0.2em] text-[10px]">Signal Analysis Report</span>
              </div>
              <div className="prose prose-invert prose-xs max-w-none whitespace-pre-wrap text-zinc-400 font-sans leading-relaxed italic">
                {visionResult}
              </div>
            </div>
            <button onClick={() => setVisionResult(null)} className="mt-4 w-full py-2 rounded-xl bg-white/5 text-[9px] text-zinc-500 hover:text-white uppercase font-bold tracking-[0.2em] border border-white/5 transition-all">Reset Buffer</button>
          </div>
        ) : (
          <div className="relative">
            <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-300 bg-zinc-950/50 ${isVisionLoading ? 'opacity-50 pointer-events-none' : 'border-zinc-800 hover:border-[#AB9FF2] hover:bg-[#AB9FF2]/5'}`}>
              <div className="flex flex-col items-center justify-center px-6 text-center">
                {isVisionLoading ? (
                  <div className="flex flex-col items-center">
                    <CpuIcon className="w-12 h-12 text-[#AB9FF2] animate-spin mb-3" />
                    <p className="text-[10px] text-[#AB9FF2] font-mono uppercase animate-pulse">Syncing Image Node...</p>
                  </div>
                ) : (
                  <>
                    <div className="p-5 rounded-full bg-[#AB9FF2]/10 mb-4 border border-[#AB9FF2]/20">
                      <Camera className="w-7 h-7 text-[#AB9FF2]" />
                    </div>
                    <p className="text-xs text-zinc-300 font-bold mb-1 uppercase tracking-wider">Upload Visual Data</p>
                  </>
                )}
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleVisionUpload} />
            </label>
            {visionError && <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] text-rose-400 font-mono animate-pulse">{visionError}</div>}
          </div>
        )}
      </div>

      {/* INSTITUTIONAL HEATMAP */}
      <div className="glass rounded-[32px] p-6 mb-8 border-rose-500/20 bg-gradient-to-tr from-rose-500/5 to-transparent">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-rose-500/10 rounded-2xl mr-4">
            <Flame size={24} className="text-rose-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-rose-500">Smart Money Heatmap</h4>
            <p className="text-[9px] text-zinc-500 font-mono italic">Institutional Concentration</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['BTC', 'ETH', 'SOL', 'PEPE', 'WIF', 'TON', 'LINK', 'DOGE'].map((ticker, i) => (
            <div key={i} className={`p-3 rounded-xl flex flex-col items-center justify-center border transition-all ${i < 3 ? 'bg-emerald-500/20 border-emerald-500/40' : i < 6 ? 'bg-zinc-800/50 border-white/5' : 'bg-rose-500/20 border-rose-500/40'}`}>
              <span className="text-[9px] font-black text-white">{ticker}</span>
              <span className="text-[7px] text-zinc-400 font-mono">{(80 - i*7)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* SIGNALS GRID */}
      <div className="mb-10">
        <h3 className="font-outfit font-bold text-lg neon-text-cyan flex items-center mb-6 px-2">
           <Activity size={18} className="mr-2" /> Live Signal Stream
        </h3>
        <div className="space-y-4">
          {MOCK_PREDICTIONS.map((p, idx) => (
            <PredictionCard key={p.id} prediction={p} isLocked={user.subscription === 'free' && idx > 0} />
          ))}
        </div>
      </div>

      {/* TWITCH-STYLE BROADCAST CHAT / LIVE TRADE FEED */}
      <div className="fixed bottom-20 right-4 z-40 w-52 h-44 glass rounded-2xl border border-white/10 p-3 shadow-2xl animate-slide-up pointer-events-none flex flex-col">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10 bg-black/40 rounded-t-lg px-2 py-1">
           <div className="flex items-center text-[8px] font-black text-white uppercase tracking-widest">
             <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse mr-2"></div>
             LIVE FEED
           </div>
           <MessageSquare size={10} className="text-[#AB9FF2]" />
        </div>
        <div className="chat-feed-scroll no-scrollbar flex-1">
           {chatMessages.map((msg) => (
             <div key={msg.id} className={`chat-item text-[9px] font-mono flex flex-col mb-1 ${
                msg.type === 'WHALE' ? 'bg-[#AB9FF2]/20 border-l-2 border-[#AB9FF2]' : 
                msg.type === 'SYSTEM' ? 'bg-cyan-500/10' : 'bg-black/20'
             }`}>
                <div className="flex items-center justify-between">
                  <span className={`font-black ${
                    msg.type === 'BUY' ? 'text-emerald-400' : 
                    msg.type === 'SELL' ? 'text-rose-400' : 
                    msg.type === 'WHALE' ? 'text-[#AB9FF2]' : 'text-cyan-400'
                  }`}>
                    {msg.user}:
                  </span>
                  {msg.type === 'WHALE' && <Zap size={8} className="text-[#AB9FF2] animate-bounce" />}
                </div>
                <span className="text-zinc-300 leading-tight">{msg.action}</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
