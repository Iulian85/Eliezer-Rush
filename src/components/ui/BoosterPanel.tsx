import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import ClayIcon from './ClayIcon';

export default function BoosterPanel() {
  const { boosters, activateBooster, activeBooster, gameState } = useGameStore();

  if (gameState !== 'PLAYING') return null;

  return (
    <div className="absolute bottom-6 left-0 w-full flex justify-center items-end z-20 pointer-events-auto px-4">
      
      {/* Glass Dock Container */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-3 flex gap-4 shadow-xl">
          
          {/* Bomb Booster */}
          <button
            onClick={() => activateBooster('bomb')}
            className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all active:scale-95 overflow-visible ${
              activeBooster === 'bomb' 
                ? 'bg-white/30 border-white/50 shadow-lg scale-110' 
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
          >
            <div className="w-10 h-10 mb-0.5 pointer-events-none filter drop-shadow-md">
                <ClayIcon type="bomb" className="w-full h-full" />
            </div>
            
            <div className="text-[9px] font-bold text-white uppercase tracking-wide drop-shadow-sm">Bomb</div>
            
            {boosters.bomb > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ref-orange text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {boosters.bomb}
                </div>
            )}
          </button>

          {/* Shuffle Booster */}
          <button
            onClick={() => activateBooster('shuffle')}
            className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all active:scale-95 overflow-visible ${
              activeBooster === 'shuffle'
                ? 'bg-white/30 border-white/50 shadow-lg scale-110'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
          >
            <div className="w-10 h-10 mb-0.5 pointer-events-none filter drop-shadow-md">
                <ClayIcon type="shuffle" className="w-full h-full" />
            </div>
            <div className="text-[9px] font-bold text-white uppercase tracking-wide drop-shadow-sm">Mix</div>
            
            {boosters.shuffle > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ref-orange text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {boosters.shuffle}
                </div>
            )}
          </button>

          {/* Extra Moves Booster */}
          <button
            onClick={() => activateBooster('extraMoves')}
             className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl border transition-all active:scale-95 overflow-visible ${
              activeBooster === 'extraMoves'
                ? 'bg-white/30 border-white/50 shadow-lg scale-110'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
          >
             <div className="w-10 h-10 mb-0.5 pointer-events-none filter drop-shadow-md">
                <ClayIcon type="extraMoves" className="w-full h-full" />
            </div>
            <div className="text-[9px] font-bold text-white uppercase tracking-wide drop-shadow-sm">+5 Move</div>
            
             {boosters.extraMoves > 0 && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-ref-orange text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {boosters.extraMoves}
                </div>
            )}
          </button>
      </div>

    </div>
  );
}
