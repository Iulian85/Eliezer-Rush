
import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import GameScene from './components/3d/GameScene';
import HUD from './components/ui/HUD';
import Menu from './components/ui/Menu';
import GameOverModal from './components/ui/GameOverModal';
import BoosterPanel from './components/ui/BoosterPanel';
import { initTelegram } from './utils/telegram';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initTelegram();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-eliezer-bg overflow-hidden">
      {/* 
        The main Canvas covers the entire screen.
        eventSource={containerRef} allows DOM elements inside Menu to interact correctly if needed.
      */}
      <Canvas 
        shadows 
        eventSource={containerRef}
        camera={{ position: [0, 0, 19.5], fov: 38 }}
        dpr={[1, 2]} 
        className="touch-none"
      >
        <GameScene />
        
        {/* View.Port renders all <View> components defined in the UI layer */}
        <View.Port />
      </Canvas>
      
      {/* UI Overlay */}
      <HUD />
      <BoosterPanel />
      <Menu />
      <GameOverModal />
    </div>
  );
}

export default App;
