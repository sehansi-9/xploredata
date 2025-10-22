import { useState } from "react";

interface Dot {
  top: string;
  left: string;
  delay: string;
  duration: string;
}

const generateRandomDots = () =>
  Array.from({ length: 18 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${2 + Math.random() * 2}s`,
  }));

export default function FloatingDots() {
  // ✅ Initialize directly — no useEffect needed
  const [dots] = useState(generateRandomDots);

  return (
    <div>
      {dots.map((dot, index) => (
        <div
          key={index}
          className="dot"
          style={{
            top: dot.top,
            left: dot.left,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  );
}
