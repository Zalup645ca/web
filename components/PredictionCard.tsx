
import React, { useState, useEffect } from 'react';
import { Prediction, PredictionDirection } from '../types';
import { getMarketInsight } from '../services/geminiService';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { BarChart3, Clock, Lock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PredictionCardProps {
  prediction: Prediction;
  isLocked?: boolean;
}

const generateChartData = (direction: PredictionDirection) => {
  const points = 12;
  return Array.from({ length: points }, (_, i) => ({
    val: Math.random() * 30 + (direction === PredictionDirection.RISE ? i * 2 : (points - i) * 2)
  }));
};

const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, isLocked = false }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [livePrice, setLivePrice] = useState(prediction.price);
  const chartData = generateChartData(prediction.direction);

  useEffect(() => {
    if (!isLocked) {
      setLoading(true);
      getMarketInsight(prediction.coin, prediction.symbol).then(res => {
        setInsight(res);
        setLoading(false);
      });

      // Simple live price flicker simulation
      const interval = setInterval(() => {
        const base = parseFloat(prediction.price.replace(/[$,]/g, ''));
        const variation = base * (Math.random() * 0.001 - 0.0005);
        setLivePrice(`$${(base + variation).toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [prediction, isLocked]);

  const isRise = prediction.direction === PredictionDirection.RISE;

  return (
    <div className={`glass rounded-[32px] p-5 border border-white/5 relative overflow-hidden transition-all duration-500 ${isLocked ? 'grayscale-[0.8] opacity-50' : 'hover:border-[#AB9FF2]/50 shadow-[0_0_30px_rgba(171,159,242,0.05)]'}`}>
      {/* Background Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 -z-10 ${isRise ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center font-bold text-sm shadow-xl border border-white/10 text-white font-mono">
            {prediction.symbol}
          </div>
          <div>
            <h3 className="font-outfit font-bold text-base tracking-tight">{prediction.coin}</h3>
            <div className="flex items-center text-[9px] text-zinc-500 font-mono uppercase tracking-widest">
              <div className={`w-1 h-1 rounded-full mr-1.5 animate-pulse ${isRise ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
              {prediction.timeframe} SIGNAL
            </div>
          </div>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isRise ? 'neon-text-green bg-emerald-500/10' : 'neon-text-red bg-rose-500/10'}`}>
          {isRise ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {prediction.direction}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end mb-6">
        <div>
          <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest mb-1 font-bold">Live Pulse</div>
          <div className={`text-xl font-outfit font-bold tracking-tighter transition-all duration-300 ${isRise ? 'neon-text-green' : 'neon-text-red'}`}>
            {livePrice}
          </div>
          <div className={`text-[10px] font-mono font-bold mt-1 ${prediction.change24h.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
            {prediction.change24h} (24H)
          </div>
        </div>
        <div className="h-16 w-full opacity-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`grad-${prediction.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isRise ? '#39ff14' : '#ff3131'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isRise ? '#39ff14' : '#ff3131'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="val" 
                stroke={isRise ? '#39ff14' : '#ff3131'} 
                fill={`url(#grad-${prediction.id})`} 
                strokeWidth={2}
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!isLocked ? (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">AI Confidence Level</span>
            <span className="text-[11px] font-mono font-black neon-text-cyan">{prediction.confidence}%</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full phantom-gradient transition-all duration-[2000ms] ease-out" 
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed italic">
              <span className="text-[#AB9FF2] not-italic mr-2">LOG:</span>
              {loading ? "Decrypting encrypted market stream..." : insight}
            </p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-[6px] z-20">
          <div className="text-center group cursor-pointer">
            <div className="p-4 bg-zinc-900/50 rounded-full mb-3 inline-block border border-[#AB9FF2]/30 shadow-[0_0_30px_rgba(171,159,242,0.2)] group-hover:scale-110 transition-transform">
              <Lock size={20} className="text-[#AB9FF2]" />
            </div>
            <div className="text-[10px] font-black text-white tracking-[0.4em] uppercase">Encrypted Neural Signal</div>
            <div className="text-[9px] text-[#AB9FF2] mt-1 font-mono">PRO ACCESS REQUIRED</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
