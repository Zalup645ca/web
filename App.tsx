
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import SubscriptionPlans from './components/SubscriptionPlans';
import RouletteModal from './components/RouletteModal';
import { UserState, StoryStatus } from './types';
import { 
  User, ChevronRight, Clock, ShieldCheck, ExternalLink, Wallet, 
  CheckCircle2, Layers, X, Shield, Users, FileText, Share2, Sparkles,
  Lock, Globe, Zap, Heart, AlertTriangle, Download, Send, ImageIcon
} from 'lucide-react';

const STORY_IMAGES = [
  "https://i.pinimg.com/736x/51/05/2a/51052a3623acf5a92a0c0847877c1556.jpg",
  "blob:https://ru.pinterest.com/4d923d6c-4737-4bca-ac74-cbcec3dd3c96"
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showRoulette, setShowRoulette] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedStoryImg, setSelectedStoryImg] = useState("");
  
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    walletAddress: null,
    subscription: 'free',
    expiryDate: null,
    isPaymentPending: false,
    photoUrl: null,
    telegramUsername: null,
    storyStatus: 'none'
  });

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.expand();
      tg.ready();
      tg.setHeaderColor('#050508');
      tg.setBackgroundColor('#050508');
    }

    const rouletteTimer = setTimeout(() => {
      const hasInteracted = localStorage.getItem('roulette_interacted');
      if (user.subscription === 'free' && !hasInteracted) {
        setShowRoulette(true);
      }
    }, 4000);

    return () => clearTimeout(rouletteTimer);
  }, [user.subscription]);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') return;
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    setUser(prev => ({ ...prev, isPaymentPending: true }));
    const supportLink = "https://t.me/bullish_ai_officiall"; 
    if (tg?.openTelegramLink) tg.openTelegramLink(supportLink);
    else window.open(supportLink, '_blank');
    setCurrentPage('dashboard');
  };

  const openStoryMission = () => {
    const randomImg = STORY_IMAGES[Math.floor(Math.random() * STORY_IMAGES.length)];
    setSelectedStoryImg(randomImg);
    setShowStoryModal(true);
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
  };

  const handleConfirmStoryShared = () => {
    setUser(prev => ({ ...prev, storyStatus: 'shared' }));
    setShowStoryModal(false);
    const tg = (window as any).Telegram?.WebApp;
    const supportLink = "https://t.me/bullish_ai_officiall";
    
    if (tg?.showPopup) {
      tg.showPopup({
        title: 'Mission Logged',
        message: 'Shared state locked. Message Support now to verify your 15% bonus.',
        buttons: [{ type: 'default', text: 'Contact Support', id: 'support' }, { type: 'cancel' }]
      }, (id: string) => {
        if (id === 'support') {
          if (tg?.openTelegramLink) tg.openTelegramLink(supportLink);
          else window.open(supportLink, '_blank');
        }
      });
    }
  };

  const verifyStoryDiscount = () => {
    setUser(prev => ({ ...prev, storyStatus: 'verified' }));
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
  };

  const infoContent: Record<string, { title: string, icon: any, content: React.ReactNode }> = {
    security: {
      title: "Fortress Protocols",
      icon: Shield,
      content: (
        <div className="space-y-5 text-zinc-400 text-[11px] font-mono leading-relaxed">
          <p><span className="text-white font-black underline decoration-[#AB9FF2]">[ZERO-KNOWLEDGE ARCHITECTURE]</span> Secure signal processing via fragmented clusters.</p>
        </div>
      )
    },
    private: {
      title: "Pulse Elite Lounge",
      icon: Users,
      content: (
        <div className="space-y-5 text-zinc-400 text-xs text-center">
          <p className="text-zinc-200">The sanctuary for elite signal processors.</p>
          <button className="w-full py-3 rounded-xl phantom-gradient text-white font-black text-[10px] uppercase">Join Alpha</button>
        </div>
      )
    },
    whitepaper: {
      title: "Neural Core V5.0",
      icon: FileText,
      content: (
        <div className="space-y-4 text-zinc-400 text-[11px] font-mono leading-relaxed">
          <p>Technical architecture of the Pulse Multimodal Fusion layer.</p>
        </div>
      )
    }
  };

  const handleRouletteWin = (planId: string) => {
    const tg = (window as any).Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;
    setUser(prev => ({ 
      ...prev, subscription: planId, isLoggedIn: true, walletAddress: 'JACKPOT_WINNER',
      photoUrl: tgUser?.photo_url || null, telegramUsername: tgUser?.username || tgUser?.first_name || 'Jackpot Agent'
    }));
    localStorage.setItem('roulette_interacted', 'true');
    setShowRoulette(false);
    setCurrentPage('dashboard');
  };

  const connectWallet = () => {
    const tg = (window as any).Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;
    setUser(prev => ({ 
      ...prev, isLoggedIn: true, walletAddress: 'TON_SYNC_ACTIVE', 
      photoUrl: tgUser?.photo_url || null, telegramUsername: tgUser?.username || tgUser?.first_name || 'Anonymous Agent'
    }));
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-1000 ${user.isLoggedIn ? 'bg-[#0a061a]' : 'bg-[#050508]'}`}>
      {showRoulette && <RouletteModal onClose={() => setShowRoulette(false)} onWin={handleRouletteWin} />}

      {/* Redesigned Story Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
          <div className="w-full max-w-sm flex flex-col items-center animate-slide-up">
            <h3 className="text-white font-black text-xl mb-6 uppercase tracking-tighter italic">Promotion Node</h3>
            
            <div className="w-full max-w-[240px] aspect-[9/16] rounded-[32px] overflow-hidden border-2 border-pink-500/30 shadow-2xl mb-8 relative story-image-pulse">
               <img src={selectedStoryImg} className="w-full h-full object-cover" alt="Promotion Material" />
               <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="glass p-2 rounded-xl flex items-center justify-center space-x-2 border-white/10">
                     <ImageIcon size={14} className="text-pink-400" />
                     <span className="text-[9px] font-black text-white uppercase tracking-widest">Hold Image to Save</span>
                  </div>
               </div>
            </div>
            
            <div className="space-y-4 w-full mb-8">
               <div className="flex items-center p-3 glass rounded-2xl border-white/5 bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-black text-[10px] mr-3">1</div>
                  <p className="text-[10px] text-zinc-300 font-medium">Post to your <span className="text-pink-400 font-bold uppercase">Telegram Story</span></p>
               </div>
               <div className="flex items-center p-3 glass rounded-2xl border-white/5 bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-[10px] mr-3">2</div>
                  <p className="text-[10px] text-zinc-300 font-medium">Mention bot link: <span className="text-cyan-400 font-bold">@PulseTerminalBot</span></p>
               </div>
               <div className="flex items-center p-3 glass rounded-2xl border-white/5 bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-[#AB9FF2]/20 flex items-center justify-center text-[#AB9FF2] font-black text-[10px] mr-3">3</div>
                  <p className="text-[10px] text-zinc-300 font-medium">Click <span className="text-[#AB9FF2] font-bold">SHARED</span> & message support node</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button onClick={() => setShowStoryModal(false)} className="py-4 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-500 font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all">Cancel</button>
              <button onClick={handleConfirmStoryShared} className="py-4 rounded-2xl phantom-gradient text-white font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">I Have Shared</button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modals */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="w-full max-w-sm glass rounded-[40px] border-[#AB9FF2]/30 p-8 relative animate-slide-up">
            <button onClick={() => setActiveInfoModal(null)} className="absolute top-6 right-6 text-zinc-500"><X size={24} /></button>
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-4 bg-[#AB9FF2]/10 rounded-2xl">
                {activeInfoModal && React.createElement(infoContent[activeInfoModal].icon, { size: 28, className: "text-[#AB9FF2]" })}
              </div>
              <h3 className="text-xl font-bold text-white uppercase">{infoContent[activeInfoModal].title}</h3>
            </div>
            {infoContent[activeInfoModal].content}
          </div>
        </div>
      )}

      <main className="relative z-10">
        {currentPage === 'home' && (
          <>
            <Hero onStart={() => handleNavigation('predictions')} />
            <Dashboard user={user} />
          </>
        )}

        {currentPage === 'predictions' && <Dashboard user={user} />}
        
        {currentPage === 'subscriptions' && (
          <SubscriptionPlans 
            onSubscribe={handleSubscribe} 
            isPending={user.isPaymentPending || false} 
            isDiscountVerified={user.storyStatus === 'verified'}
          />
        )}
        
        {currentPage === 'dashboard' && (
          <div className="px-4 pt-10 animate-slide-up pb-24">
            {/* Story Banner */}
            {user.storyStatus === 'none' && (
              <div onClick={openStoryMission} className="mb-6 glass rounded-[32px] p-6 border-pink-500/40 bg-gradient-to-r from-pink-500/20 to-transparent flex items-center justify-between cursor-pointer active:scale-95 transition-all shadow-xl">
                <div className="flex items-center">
                  <div className="p-3 bg-pink-500/20 rounded-2xl mr-4"><Share2 className="text-pink-400" size={20} /></div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-wider">Mission: Story Unlock</h4>
                    <p className="text-[9px] text-zinc-400 uppercase">Click for <span className="text-pink-400 font-bold">15% discount</span> probe</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-pink-400" />
              </div>
            )}

            {user.storyStatus === 'shared' && (
              <div className="mb-6 glass rounded-[32px] p-6 border-amber-500/40 bg-amber-500/5 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-amber-500/20 rounded-2xl mr-4"><Clock className="text-amber-400" size={20} /></div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase">Awaiting Support Node</h4>
                    <p className="text-[9px] text-zinc-500 uppercase">Verification in progress...</p>
                  </div>
                </div>
                <button onClick={verifyStoryDiscount} className="px-3 py-1 bg-white/5 rounded-xl text-[8px] text-zinc-700 font-mono uppercase">[ Admin Link ]</button>
              </div>
            )}

            {user.storyStatus === 'verified' && (
              <div className="mb-6 glass rounded-[32px] p-4 border-emerald-500/30 bg-emerald-500/5 flex items-center justify-center">
                 <Sparkles size={16} className="text-emerald-400 mr-2" />
                 <span className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Promotion Synced: -15% Active</span>
              </div>
            )}

            <div className="glass rounded-[40px] p-8 border-white/5 text-center mb-8 relative overflow-hidden">
               <div className="relative inline-block mb-4">
                 <div className={`w-28 h-28 rounded-full p-1.5 ${user.isLoggedIn ? 'bg-gradient-to-br from-[#AB9FF2] to-[#7E61E7]' : 'bg-zinc-800'}`}>
                    <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden border-4 border-[#050508]">
                      {user.photoUrl ? <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={48} className="text-zinc-800" />}
                    </div>
                 </div>
               </div>
               <h3 className="text-2xl font-black text-white">{user.isLoggedIn ? (user.telegramUsername ? `@${user.telegramUsername}` : 'Agent Sync') : 'Guest'}</h3>
               <p className="text-zinc-600 text-[10px] mb-8 font-mono uppercase tracking-widest">{user.walletAddress || 'Waiting Connection'}</p>
               {!user.isLoggedIn ? (
                 <button onClick={connectWallet} className="w-full py-4 rounded-2xl phantom-gradient text-white font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-transform">Sync Wallet</button>
               ) : (
                 <div className="grid grid-cols-2 gap-3">
                   <div className="glass p-4 rounded-3xl bg-white/5 text-left"><div className="text-[8px] text-zinc-500 uppercase font-black mb-1">Tier</div><div className="text-xs font-bold text-[#AB9FF2] uppercase">{user.subscription}</div></div>
                   <div className="glass p-4 rounded-3xl bg-white/5 text-left"><div className="text-[8px] text-zinc-500 uppercase font-black mb-1">Node</div><div className="text-xs font-bold text-emerald-400 uppercase">Online</div></div>
                 </div>
               )}
            </div>

            <div className="space-y-3">
               <button onClick={() => window.open('https://t.me/bullish_ai_officiall', '_blank')} className="w-full glass p-5 rounded-[32px] flex justify-between items-center border-white/5">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mr-5"><Zap size={20} className="text-emerald-400" /></div>
                    <div className="text-left"><div className="text-white text-sm font-bold uppercase">Manual Node Activation</div><div className="text-[9px] text-zinc-500 font-mono uppercase">Operator Sync</div></div>
                  </div>
                  <ChevronRight size={20} className="text-zinc-500" />
               </button>
               
               {[
                 { id: 'security', label: 'Security Layer', icon: Shield },
                 { id: 'private', label: 'Elite Lounge', icon: Users },
                 { id: 'whitepaper', label: 'Terminal Docs', icon: FileText }
               ].map((item) => (
                 <button key={item.id} onClick={() => setActiveInfoModal(item.id)} className="w-full glass p-5 rounded-[32px] flex justify-between items-center border-white/5">
                    <div className="flex items-center">
                       <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mr-5"><item.icon size={20} className="text-zinc-500" /></div>
                       <span className="text-white text-sm font-bold uppercase">{item.label}</span>
                    </div>
                    <ChevronRight size={20} className="text-zinc-500" />
                 </button>
               ))}
            </div>
          </div>
        )}
      </main>
      <Navigation onNavigate={handleNavigation} currentPage={currentPage} />
    </div>
  );
};

export default App;
