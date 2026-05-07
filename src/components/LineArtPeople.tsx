import { useEffect, useRef } from 'react';

export function LineArtPeople() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationId: number;
    let time = 0;

    // Person class
    class Person {
      x: number;
      y: number;
      baseY: number;
      speed: number;
      amplitude: number;
      phase: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseY = y;
        this.speed = 0.5 + Math.random() * 0.5;
        this.amplitude = 5 + Math.random() * 10;
        this.phase = Math.random() * Math.PI * 2;
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        // Floating animation
        this.y = this.baseY + Math.sin(time * this.speed + this.phase) * this.amplitude;

        // Head
        ctx.beginPath();
        ctx.arc(this.x, this.y - 25, 8, 0, Math.PI * 2);
        ctx.stroke();

        // Body
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 17);
        ctx.lineTo(this.x, this.y + 10);
        ctx.stroke();

        // Arms
        const armSwing = Math.sin(time * this.speed * 2 + this.phase) * 10;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 5);
        ctx.lineTo(this.x - 15, this.y + 5 + armSwing * 0.5);
        ctx.moveTo(this.x, this.y - 5);
        ctx.lineTo(this.x + 15, this.y + 5 - armSwing * 0.5);
        ctx.stroke();

        // Legs
        const legSwing = Math.sin(time * this.speed * 2 + this.phase) * 8;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x - 8, this.y + 25 + legSwing);
        ctx.moveTo(this.x, this.y + 10);
        ctx.lineTo(this.x + 8, this.y + 25 - legSwing);
        ctx.stroke();
      }
    }

    // Create people
    const people: Person[] = [];
    const peopleCount = window.innerWidth < 768 ? 3 : 5;
    
    for (let i = 0; i < peopleCount; i++) {
      const x = (canvas.offsetWidth / (peopleCount + 1)) * (i + 1);
      const y = canvas.offsetHeight / 2 + (Math.random() - 0.5) * 20;
      people.push(new Person(x, y));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      people.forEach(person => {
        person.draw(ctx, time);
      });

      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative h-32 w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
}

interface FloatingPersonProps {
  delay?: number;
  style?: React.CSSProperties;
}

export function FloatingPerson({ delay = 0, style }: FloatingPersonProps) {
  return (
    <div 
      className="absolute animate-float"
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '3s ease-in-out infinite',
        ...style
      }}
    >
      <svg width="60" height="80" viewBox="0 0 60 80" className="opacity-20">
        <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
          {/* Head */}
          <circle cx="30" cy="15" r="8" />
          {/* Body */}
          <line x1="30" y1="23" x2="30" y2="45" />
          {/* Arms */}
          <line x1="30" y1="30" x2="20" y2="40" />
          <line x1="30" y1="30" x2="40" y2="40" />
          {/* Legs */}
          <line x1="30" y1="45" x2="22" y2="60" />
          <line x1="30" y1="45" x2="38" y2="60" />
        </g>
      </svg>
    </div>
  );
}
