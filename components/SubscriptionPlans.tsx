
import React from 'react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { MessageSquare, Heart, ShieldCheck } from 'lucide-react';

interface SubscriptionPlansProps {
  onSubscribe: (planId: string) => void;
  isPending: boolean;
  isDiscountVerified: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onSubscribe, isPending, isDiscountVerified }) => {
  const calculatePrice = (originalPrice: number) => {
    if (!isDiscountVerified || originalPrice === 0) return originalPrice;
    return (originalPrice * 0.85).toFixed(2);
  };

  return (
    <section className="py-10 pb-24 px-4 max-w-7xl mx-auto animate-slide-up">
      <div className="text-center mb-10">
        <div className="inline-block p-3 rounded-3xl bg-[#AB9FF2]/10 mb-4">
          <MessageSquare className="text-[#AB9FF2]" size={24} />
        </div>
        <h2 className="text-3xl font-outfit font-bold mb-2 text-white">Manual Activation</h2>
        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest max-w-xs mx-auto">
          Contact our support node for payment instructions and instant activation.
        </p>
      </div>

      {isDiscountVerified && (
        <div className="mb-6 p-4 glass rounded-[32px] border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center space-x-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
           <ShieldCheck size={18} className="text-emerald-400" />
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">LOYALTY VERIFIED: 15% DISCOUNT ACTIVE</span>
        </div>
      )}

      <div className="space-y-4">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`glass rounded-[32px] p-6 border flex flex-col relative overflow-hidden transition-all duration-500 ${plan.id === 'monthly' ? 'border-[#AB9FF2] shadow-[0_0_20px_rgba(171,159,242,0.15)] bg-white/5' : 'border-white/10'}`}
          >
            {plan.id === 'monthly' && (
              <div className="absolute top-4 right-6 px-3 py-1 bg-[#AB9FF2] text-black text-[8px] font-black rounded-full uppercase tracking-tighter">
                Most Popular
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-zinc-500 text-[10px] font-mono uppercase">{plan.duration}</p>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                  {isDiscountVerified && plan.price > 0 && (
                    <span className="text-xs text-zinc-500 line-through font-mono decoration-emerald-500">${plan.price}</span>
                  )}
                  <span className="text-2xl font-bold font-outfit text-white">
                    ${calculatePrice(plan.price)}
                  </span>
                </div>
                {plan.savings && (
                  <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{plan.savings}</div>
                )}
              </div>
            </div>

            <ul className="space-y-2 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center text-[10px] font-mono text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#AB9FF2] mr-3 shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => onSubscribe(plan.id)}
              disabled={isPending && plan.id !== 'free'}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
                isPending && plan.id !== 'free' 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : plan.id === 'monthly' ? 'phantom-gradient text-white shadow-xl' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              {plan.price === 0 ? 'Activate Free Node' : isPending ? 'Node Verification...' : 'Contact Support to Buy'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 glass rounded-[32px] border-dashed border-zinc-700 bg-zinc-900/30 text-center">
        <p className="text-[9px] text-zinc-500 font-mono uppercase leading-relaxed tracking-wider">
          Support will verify your story proof before final activation.
        </p>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
