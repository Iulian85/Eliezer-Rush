
import { useGameStore } from '../../store/useGameStore';
import Navigation from './Navigation';
import { ShopTab, TasksTab, FrensTab, WalletTab, CoinFlipTab } from './TabViews';
import { showAd } from '../../utils/adsgram';
import { useState, useEffect } from 'react';

export default function Menu() {
  const { gameState, initGame, activeTab, walletBalance, user, claimDailyReward, lastRewardClaimedDate } = useGameStore();
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [isRewardAvailable, setIsRewardAvailable] = useState(false);

  // Check reward status on mount and when date changes
  useEffect(() => {
    const today = new Date().toDateString();
    setIsRewardAvailable(lastRewardClaimedDate !== today);
  }, [lastRewardClaimedDate]);

  if (gameState === 'PLAYING') return null;

  const handleStartGame = async () => {
    if (isLoadingAd) return;
    setIsLoadingAd(true);
    await showAd();
    setIsLoadingAd(false);
    initGame(1);
  };

  const handleClaimReward = async () => {
    if (isLoadingAd || !isRewardAvailable) return;
    
    setIsLoadingAd(true);
    // Show Ad before claiming reward
    await showAd();
    
    // Grant reward after ad
    claimDailyReward();
    setIsLoadingAd(false);
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'TASKS': return <TasksTab />;
        case 'SHOP': return <ShopTab />;
        case 'FRENS': return <FrensTab />;
        case 'WALLET': return <WalletTab />;
        case 'COINFLIP': return <CoinFlipTab />;
        case 'HOME':
        default:
            return (
                <div className="w-full h-full flex flex-col items-center justify-between pb-32 pt-10 px-6 animate-in fade-in duration-700">
                    
                    {/* The 3D Scene is behind this, showing the Logo */}
                    <div className="flex-1 w-full" /> 

                    {/* Bottom Action Area */}
                    <div className="w-full max-w-sm flex flex-col gap-3">
                        
                        {/* Daily Reward Button */}
                        <button
                            onClick={handleClaimReward}
                            disabled={!isRewardAvailable || isLoadingAd}
                            className={`w-full py-3 rounded-2xl font-black text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                                isRewardAvailable 
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-clay-btn border border-emerald-300 animate-pulse' 
                                    : 'bg-white/40 text-ref-text/50 cursor-not-allowed border border-white/50'
                            }`}
                        >
                            <span className="text-lg">{isRewardAvailable ? '🎁' : '✅'}</span>
                            {isLoadingAd && isRewardAvailable ? 'LOADING AD...' : (isRewardAvailable ? 'CLAIM DAILY REWARD (+100)' : 'REWARD CLAIMED')}
                        </button>

                        {/* Play Button - Big Orange Pill */}
                        <button
                            onClick={handleStartGame}
                            disabled={isLoadingAd}
                            className="btn-primary-3d w-full h-16 text-xl font-black tracking-wide shadow-clay-btn flex items-center justify-center gap-2 group"
                        >
                            {isLoadingAd ? (
                                <span className="animate-pulse">LOADING...</span>
                            ) : (
                                <>
                                    <span className="text-2xl group-hover:scale-110 transition-transform">▶</span>
                                    <span>PLAY</span>
                                </>
                            )}
                        </button>
                        
                        {/* Balance Pill */}
                        <div className="glass-pill px-6 py-3 flex justify-between items-center w-full mt-1">
                             <div className="flex items-center gap-2">
                                <span className="text-xl">🐹</span>
                                <span className="font-bold text-ref-text text-sm">Balance</span>
                             </div>
                             <span className="font-black text-xl text-ref-text tracking-tight">
                                {walletBalance.toLocaleString()}
                             </span>
                        </div>

                    </div>
                </div>
            );
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center overflow-hidden">
        {/* Top Header Row */}
        <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center">
            {activeTab !== 'HOME' && (
                <button 
                    onClick={() => useGameStore.getState().setActiveTab('HOME')}
                    className="w-10 h-10 glass-pill flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm"
                >
                    ⬅
                </button>
            )}
            
            {activeTab === 'HOME' && <div />} {/* Spacer */}

            <button className="w-10 h-10 glass-pill flex items-center justify-center text-lg active:scale-95 transition-transform shadow-sm">
                ⋮
            </button>
        </div>

        <div className="w-full h-full relative">
            {renderContent()}
        </div>
        
        <Navigation />
    </div>
  );
}