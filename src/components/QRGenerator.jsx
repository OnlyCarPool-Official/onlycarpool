import { useEffect, useRef } from 'react';

const QRGenerator = ({ value }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const size = canvas.width;
    const cellSize = size / 21;
    
    // Transparent background for premium feel
    ctx.clearRect(0, 0, size, size);
    
    // Draw QR pixels with a subtle gradient effect
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 21; j++) {
        const valHash = value.charCodeAt((i + j) % value.length);
        if ((i * j + valHash) % 3 === 0) {
          ctx.beginPath();
          ctx.roundRect(i * cellSize + 1, j * cellSize + 1, cellSize - 2, cellSize - 2, 2);
          ctx.fill();
        }
      }
    }
    
    const drawFinder = (x, y) => {
      ctx.beginPath();
      ctx.roundRect(x * cellSize, y * cellSize, 7 * cellSize, 7 * cellSize, 6);
      ctx.fill();
      ctx.clearRect((x + 1) * cellSize, (y + 1) * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.beginPath();
      ctx.roundRect((x + 2) * cellSize, (y + 2) * cellSize, 3 * cellSize, 3 * cellSize, 2);
      ctx.fill();
    };
    
    drawFinder(0, 0);
    drawFinder(14, 0);
    drawFinder(0, 14);
    
  }, [value]);

  return (
    <div className="relative p-[1px] rounded-2xl max-w-fit mx-auto mt-6 bg-gradient-to-br from-premium via-sky to-mint">
      {/* 3D Black Metal Card */}
      <div className="flex flex-col items-center p-8 bg-navy-900 rounded-2xl shadow-2xl relative overflow-hidden"
           style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)' }}>
        
        {/* Holographic glare overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full animate-[float_3s_ease-in-out_infinite]"></div>
        
        <canvas ref={canvasRef} width="180" height="180" className="mb-6 rounded-lg drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] relative z-10"></canvas>
        
        <div className="text-center relative z-10 w-full border-t border-white/10 pt-4">
          <h3 className="font-display font-bold text-white text-lg tracking-widest uppercase">Elite Parking</h3>
          <p className="text-xs font-medium text-premium uppercase tracking-widest mt-1 text-glow">Mall Pass Unlocked</p>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
