import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const CoinsDisplay = ({ coins = 0, animated = false }) => {
  const [displayCoins, setDisplayCoins] = useState(coins);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (coins > displayCoins) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayCoins(coins);
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
    setDisplayCoins(coins);
  }, [coins, displayCoins]);

  return (
    <div
      className={`flex items-center gap-2 px-4 py-1 rounded-lg text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}
    >
      <Zap size={15} className="fill-amber-400 " />
      <span className="text-sm text-amber-400">{displayCoins}</span>
      <span className="text-xs opacity-90">ePoints</span>
    </div>
  );
};

export default CoinsDisplay;
