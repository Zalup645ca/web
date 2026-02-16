
import React, { useState, useRef } from 'react';
import { Gift, RotateCw, X, Coins, Zap, Trophy, AlertCircle, Star } from 'lucide-react';

interface RouletteModalProps {
  onClose: () => void;
  onWin: (planId: string) => void;
}

const prizes = [
  { label: "LOSER", color: "bg-zinc-900", text: "text-zinc-700", win: false },
  { label: "MONTHLY", color: "bg-[#AB9FF2]/20", text: "text-[#AB9FF2]", win: true, id: 'monthly' },
  { label: "RETRY", color: "bg-zinc-800", text: "text-zinc-600", win: false },
  { label: "JACKPOT", color: "bg-yellow-500/20", text: "text-yellow-400", win: true, id: 'annual' },
  { label: "EMPTY", color: "bg-zinc-900", text: "text-zinc-700", win: false },
  { label: "6-MONTH", color: "bg-[#7E61E7]/20", text: "text-[#7E61E7]", win: true, id: 'biannual' },
  { label: "ZERO", color: "bg-zinc-800", text: "text-zinc-600", win: false },
  { label: "RELOAD", color: "bg-zinc-900", text: "text-zinc-700", win: false },
];

const RouletteModal: React.FC<RouletteModalProps> = ({ onClose, onWin }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [hasPaid, setHasPaid] = useState(false);
  const [message, setMessage] = useState("SYNCING NEURAL LUCK...");
  const [showPayButton, setShowPayButton] = useState(false);

  const handleSpin = () => {
  if (isSpinning) return;

  const tg = (window as any).Telegram?.WebApp;
  tg?.HapticFeedback?.impactOccurred('heavy');

  setIsSpinning(true);
  setMessage("ROLLING THE MATRIX...");

  const fullSpins = 360 * 8; // 8 оборотов
  const segmentAngle = 360 / prizes.length; // 45°

  let targetIndex = 0;

  if (hasPaid) {
    targetIndex = 3; // JACKPOT
  } else {
    targetIndex = 0; // LOSER
  }

  // центр сегмента
  const targetAngle =
    360 - (targetIndex * segmentAngle + segmentAngle / 2);

  const finalRotation = fullSpins + targetAngle;

  setRotation(finalRotation);

  setTimeout(() => {
    setIsSpinning(false);
    setSpinCount(prev => prev + 1);

    if (!hasPaid) {
      setMessage("SECTOR: EMPTY. RECHARGE REQUIRED.");
      setShowPayButton(true);
      tg?.HapticFeedback?.notificationOccurred('error');
    } else {
      setMessage("CRITICAL HIT! ACCESS GRANTED.");
      tg?.HapticFeedback?.notificationOccurred('success');

      setTimeout(() => {
        onWin('annual');
      }, 2000);
    }
  }, 6000);
};

  const handlePayTon = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    setMessage("UPLINK SECURED. JACKPOT NODE ACTIVE.");
    setHasPaid(true);
    setShowPayButton(false);
    setRotation(0); 
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
      <div className="relative w-full max-w-sm glass rounded-[48px] border-white/5 p-10 overflow-hidden shadow-[0_0_100px_rgba(171,159,242,0.1)]">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-700 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-2 text-[#AB9FF2] mb-3">
             <Star size={12} className="fill-current animate-pulse" />
             <span className="text-[9px] font-black uppercase tracking-[0.4em]">Neural Oracle</span>
             <Star size={12} className="fill-current animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Lucky Terminal</h2>
          <p className="text-[#AB9FF2] text-[9px] font-mono mt-2 uppercase tracking-widest">{message}</p>
        </div>

        {/* Wheel UI */}
        <div className="relative aspect-square w-full mb-10 flex items-center justify-center">
          {/* Needle */}
          <div className="absolute top-[-10px] z-50 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
             <Trophy size={32} />
          </div>

          <div 
            className={`w-full h-full rounded-full border-[10px] border-zinc-950 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden wheel-spinning`}
            style={{ transform: `rotate(-${rotation}deg)` }}
          >
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className={`absolute top-0 left-1/2 w-1/2 h-full origin-left overflow-hidden`}
                style={{ transform: `rotate(${i * 45}deg)` }}
              >
                <div className={`h-full w-full ${prizes[i].color} border-r border-black/30 flex items-center justify-end pr-8`}>
                   <span className={`text-[9px] font-black font-mono -rotate-90 origin-center whitespace-nowrap tracking-tighter ${prizes[i].text}`}>
                      {prizes[i].label}
                   </span>
                </div>
              </div>
            ))}
            
            {/* Center Cap */}
            <div className="absolute inset-0 m-auto w-16 h-16 bg-zinc-950 rounded-full border-4 border-zinc-800 z-20 flex items-center justify-center shadow-inner">
               <div className="w-3 h-3 bg-[#AB9FF2] rounded-full animate-pulse shadow-[0_0_15px_rgba(171,159,242,1)]"></div>
            </div>
          </div>
        </div>

        {!showPayButton ? (
          <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] transition-all transform active:scale-95 ${
              isSpinning ? 'bg-zinc-900 text-zinc-700 border border-white/5 cursor-wait' : 'phantom-gradient text-white shadow-2xl hover:brightness-110'
            }`}
          >
            {isSpinning ? 'Decoding Fate...' : spinCount === 0 ? 'Initialize Spin' : 'Retry Spin'}
          </button>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div className="p-4 bg-rose-500/10 border border-rose-500/10 rounded-2xl flex items-center">
              <AlertCircle size={16} className="text-rose-500 mr-4 shrink-0" />
              <p className="text-[10px] text-zinc-400 font-mono leading-tight uppercase"> Jackpot sector encrypted. <span className="text-white">1.0 TON</span> required for VIP Node stabilization.</p>
            </div>
            <button 
              onClick={handlePayTon}
              className="w-full py-5 rounded-3xl bg-white text-black font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
            >
              Pay 1.0 TON
            </button>
          </div>
        )}

        <div className="text-center mt-8">
           <span className="text-[7px] text-zinc-700 font-mono uppercase tracking-[0.5em]">Neural-Random v5.0.1 // Pulse Inc.</span>
        </div>
      </div>
    </div>
  );
};

export default RouletteModal;
