
import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { tg } from '../../utils/telegram';
import ClayIcon from './ClayIcon';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';

interface PropsWithChildren {
    children: React.ReactNode;
}

const SectionTitle: React.FC<PropsWithChildren> = ({ children }) => (
    <h2 className="text-3xl font-black text-ref-text drop-shadow-sm mb-6 text-center tracking-wide">{children}</h2>
);

// --- COIN FLIP TAB ---
export const CoinFlipTab = () => {
    const { walletBalance, flipCoin, coinFlip } = useGameStore();
    const [bet, setBet] = useState(100);
    const [choice, setChoice] = useState<'HEADS'|'TAILS'>('HEADS');

    const handleFlip = () => {
        if (!coinFlip.isFlipping) {
            flipCoin(bet, choice);
        }
    };

    const isWin = coinFlip.lastResult === choice;

    return (
        <div className="w-full h-full flex flex-col items-center justify-between pb-32 pt-10 px-6 animate-in fade-in">
             {/* Spacer for 3D Coin */}
            <div className="flex-1 w-full flex flex-col items-center pt-8">
                 {/* Result Message Overlay */}
                 {!coinFlip.isFlipping && coinFlip.lastResult && (
                    <div className={`mt-4 px-6 py-2 rounded-2xl border-2 ${isWin ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} font-black text-xl animate-bounce shadow-lg`}>
                        {isWin ? `YOU WON +${bet*2}!` : 'YOU LOST!'}
                    </div>
                 )}
            </div>

            {/* Controls */}
            <div className="w-full max-w-sm flex flex-col gap-4">
                 
                 {/* Balance Check */}
                 <div className="flex justify-center mb-2">
                     <div className="bg-white/40 backdrop-blur-md px-4 py-1 rounded-full border border-white/50 text-sm font-bold text-ref-text">
                        Balance: {walletBalance.toLocaleString()} ELZR
                     </div>
                 </div>

                 {/* Bet Amount Selector */}
                 <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 flex justify-between items-center shadow-sm">
                    {[100, 500, 1000, 5000].map(amount => (
                        <button
                            key={amount}
                            onClick={() => setBet(amount)}
                            className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                                bet === amount 
                                ? 'bg-ref-orange text-white shadow-clay-btn scale-105' 
                                : 'bg-white/50 text-ref-text hover:bg-white'
                            }`}
                        >
                            {amount}
                        </button>
                    ))}
                 </div>

                 {/* Choice Toggle */}
                 <div className="flex gap-4">
                    <button 
                        onClick={() => setChoice('HEADS')}
                        className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                            choice === 'HEADS' 
                            ? 'bg-amber-100 border-amber-400 shadow-inner' 
                            : 'bg-white/60 border-white hover:bg-white'
                        }`}
                    >
                        <span className="text-2xl">🐹</span>
                        <span className="font-black text-xs text-ref-text tracking-widest">HEADS</span>
                    </button>
                    <button 
                        onClick={() => setChoice('TAILS')}
                        className={`flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                            choice === 'TAILS' 
                            ? 'bg-cyan-100 border-cyan-400 shadow-inner' 
                            : 'bg-white/60 border-white hover:bg-white'
                        }`}
                    >
                        <span className="text-2xl">💎</span>
                         <span className="font-black text-xs text-ref-text tracking-widest">TAILS</span>
                    </button>
                 </div>

                 {/* Action Button */}
                 <button
                    onClick={handleFlip}
                    disabled={coinFlip.isFlipping || walletBalance < bet}
                    className={`w-full py-4 rounded-2xl text-xl font-black tracking-widest shadow-clay-btn transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        coinFlip.isFlipping 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : (walletBalance < bet ? 'bg-red-400 opacity-80' : 'btn-primary-3d')
                    }`}
                 >
                    {coinFlip.isFlipping ? 'FLIPPING...' : (walletBalance < bet ? 'INSUFFICIENT FUNDS' : 'FLIP COIN')}
                 </button>
            </div>
        </div>
    );
};

// --- SHOP TAB ---
export const ShopTab = () => {
    const { buyBooster, boosters } = useGameStore();

    // Configuration for the 3D items
    const shopItems = [
        { 
            id: 'bomb', 
            label: 'Bomb', 
            type: 'bomb', 
            price: 500, 
            count: boosters.bomb,
            bg: 'bg-white/60'
        },
        { 
            id: 'shuffle', 
            label: 'Shuffle', 
            type: 'shuffle',
            price: 300, 
            count: boosters.shuffle,
            bg: 'bg-white/60'
        },
        { 
            id: 'extraMoves', 
            label: '+5 Moves', 
            type: 'extraMoves',
            price: 800, 
            count: boosters.extraMoves,
            bg: 'bg-white/60'
        },
        { 
            id: 'shield', 
            label: 'Shield', 
            type: 'shield',
            price: 1000, 
            count: boosters.shield,
            bg: 'bg-white/60'
        },
    ];

    return (
        <div className="w-full h-full pt-20 px-6 pb-32 overflow-y-auto">
            <SectionTitle>Shop</SectionTitle>
            
            <div className="grid grid-cols-2 gap-4">
                {shopItems.map((item) => (
                    <div 
                        key={item.id} 
                        className={`group relative clay-model ${item.bg} backdrop-blur-md p-4 flex flex-col items-center gap-3 transition-transform hover:scale-[1.02]`}
                    >
                        {/* 3D Icon Area */}
                        <div className="w-full flex items-center justify-center py-2 filter drop-shadow-md transition-transform group-hover:-translate-y-1">
                            <ClayIcon type={item.type as any} className="w-24 h-24" />
                        </div>
                        
                        <div className="text-center w-full z-10">
                            <div className="font-black text-lg text-ref-text mb-1">{item.label}</div>
                            <div className="text-xs font-bold text-ref-text-light uppercase tracking-wider mb-3">
                                {item.price} ELZR
                            </div>
                            
                            <button 
                                onClick={() => buyBooster(item.id as any, item.price)}
                                className="w-full py-3 bg-white rounded-xl text-sm font-black text-ref-text shadow-clay-btn active:scale-95 transition-all flex items-center justify-center gap-1"
                            >
                                <span className="text-ref-orange">●</span> BUY
                            </button>
                        </div>

                        {/* Inventory Badge */}
                        {item.count !== undefined && item.count > 0 && (
                            <div className="absolute top-3 right-3 w-7 h-7 bg-ref-orange text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg border-2 border-white">
                                {item.count}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- TASKS TAB ---
export const TasksTab = () => {
    const tasks = [
        { title: 'Join Channel', reward: 500, icon: '📢', done: true, color: 'from-blue-400 to-blue-500' },
        { title: 'Follow X', reward: 300, icon: '✖️', done: false, color: 'from-gray-700 to-gray-900' },
        { title: 'Invite 3 Frens', reward: 1000, icon: '👥', done: false, color: 'from-indigo-400 to-indigo-500' },
        { title: 'Connect Wallet', reward: 2000, icon: '👛', done: false, color: 'from-orange-400 to-orange-500' },
    ];

    return (
        <div className="w-full h-full pt-20 px-6 pb-32 overflow-y-auto">
            <SectionTitle>Tasks</SectionTitle>
            <div className="space-y-4">
                {tasks.map((task, i) => (
                    <div key={i} className="group relative">
                        {/* The "Slab" Background */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[2rem] p-4 flex items-center justify-between shadow-clay-card transform transition-transform active:scale-[0.98]">
                            
                            <div className="flex items-center gap-4">
                                {/* 3D Sphere Icon */}
                                <div className={`clay-sphere w-14 h-14 bg-gradient-to-br ${task.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                                    <span className="drop-shadow-md">{task.icon}</span>
                                </div>
                                
                                <div className="flex flex-col">
                                    <div className="font-black text-ref-text text-lg leading-tight">{task.title}</div>
                                    <div className="inline-flex items-center gap-1 mt-1">
                                        <div className="w-4 h-4 bg-ref-orange rounded-full flex items-center justify-center text-[8px] text-white font-bold">●</div>
                                        <span className="text-sm font-bold text-ref-text-light">+{task.reward}</span>
                                    </div>
                                </div>
                            </div>

                            {task.done ? (
                                 <div className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl shadow-inner border border-green-200">
                                    ✓
                                 </div>
                            ) : (
                                 <button className="bg-white text-ref-text w-12 h-10 rounded-xl flex items-center justify-center font-black shadow-sm border border-gray-100 group-hover:bg-gray-50 transition-colors">
                                     GO
                                 </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- FRENS TAB ---
export const FrensTab = () => {
    const { user, frens } = useGameStore();
    const inviteLink = `https://t.me/EliezerRushBot?start=${user?.id || 'r'}`;

    const handleInvite = () => {
        const message = "Play Eliezer Rush with me! 🐹";
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(message)}`;
        tg.openTelegramLink(shareUrl);
    };

    return (
        <div className="w-full h-full pt-20 px-6 pb-32 flex flex-col">
            <SectionTitle>Friends</SectionTitle>
            
            {/* 3D Invite Card */}
            <div className="clay-model bg-gradient-to-br from-white to-blue-50 p-6 flex flex-col items-center text-center relative overflow-hidden mb-6">
                
                {/* 3D Coin Floating */}
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center text-5xl shadow-[0_15px_30px_rgba(234,179,8,0.4),inset_0_-5px_10px_rgba(0,0,0,0.1),inset_0_5px_10px_rgba(255,255,255,0.5)] mb-4 animate-float border-4 border-yellow-200">
                    💰
                </div>
                
                <h3 className="font-black text-2xl text-ref-text mb-1">Invite Friends</h3>
                <p className="text-sm text-ref-text-light font-bold mb-6">Earn 10% from their play forever</p>
                
                <button 
                    onClick={handleInvite}
                    className="btn-primary-3d w-full py-4 text-lg font-black tracking-wide shadow-clay-btn"
                >
                    INVITE FRIEND
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                <h4 className="text-xs font-black text-ref-text uppercase tracking-widest ml-2 opacity-50 mb-2">Your Squad</h4>
                {frens.map((fren, i) => (
                    <div key={fren.id} className="bg-white/60 border border-white rounded-2xl p-3 flex items-center justify-between shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-sm font-black text-indigo-500 shadow-inner">
                                {fren.name.charAt(0)}
                            </div>
                            <span className="font-bold text-ref-text text-sm">{fren.name}</span>
                         </div>
                         <div className="bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                            <span className="font-bold text-ref-orange text-sm">+{fren.score}</span>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- WALLET TAB ---
export const WalletTab = () => {
    const { walletBalance } = useGameStore();
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();

    const handleWalletAction = () => {
        if (wallet) {
            tonConnectUI.disconnect();
        } else {
            tonConnectUI.openModal();
        }
    };

    const formatAddress = (address: string) => {
        return address.slice(0, 4) + '...' + address.slice(-4);
    };

    return (
        <div className="w-full h-full pt-20 px-6 pb-32">
            <SectionTitle>Wallet</SectionTitle>
            
            {/* 3D Wallet Card */}
            <div className="clay-model bg-[#1e293b] p-8 flex flex-col items-center justify-center text-white mb-8 shadow-2xl relative overflow-hidden">
                {/* Abstract geometric BG */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3 z-10">Total Balance</div>
                <div className="text-5xl font-black mb-4 tracking-tighter text-white z-10 drop-shadow-lg">
                    {walletBalance.toLocaleString()}
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 z-10">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                    <span className="text-xs font-bold text-gray-200">$ELZR Token</span>
                </div>
            </div>

            <div className="space-y-4">
                 {/* Connect Wallet Card */}
                 <div className={`bg-white/60 border border-white rounded-3xl p-5 flex items-center justify-between shadow-sm transition-colors ${wallet ? 'bg-green-50/80 border-green-200' : 'hover:bg-white/80'}`}>
                    <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${wallet ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            {wallet ? '✅' : '💎'}
                         </div>
                         <div className="flex flex-col">
                             <span className="font-black text-ref-text text-sm">
                                {wallet ? 'Wallet Connected' : 'Connect Wallet'}
                             </span>
                             <span className="text-xs text-ref-text-light font-bold">
                                {wallet ? formatAddress(wallet.account.address) : 'TON Network'}
                             </span>
                         </div>
                    </div>
                    <button 
                        onClick={handleWalletAction}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-clay-btn active:scale-95 transition-transform ${wallet ? 'bg-gray-200 text-gray-500' : 'bg-ref-text text-white'}`}
                    >
                        {wallet ? 'Disconnect' : 'Connect'}
                    </button>
                 </div>
                 
                 <div className="bg-white/60 border border-white rounded-3xl p-5 flex items-center justify-between shadow-sm opacity-70">
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner text-orange-500">
                            🏦
                         </div>
                         <div className="flex flex-col">
                             <span className="font-black text-ref-text text-sm">Withdraw</span>
                             <span className="text-xs text-ref-text-light font-bold">Coming Soon</span>
                         </div>
                    </div>
                    <button className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-xl text-xs font-bold cursor-not-allowed border border-gray-200">
                        Wait
                    </button>
                 </div>
            </div>
        </div>
    );
};