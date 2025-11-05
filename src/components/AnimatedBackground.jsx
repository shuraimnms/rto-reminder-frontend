import React, { useState, useEffect, useRef } from 'react';

const AnimatedBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && window.VANTA) {
      setVantaEffect(
        window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x315eb6,
          backgroundColor: 0x4002a,
          points: 8.00, /* Reduced points for better performance */
          maxDistance: 20.00, /* Slightly reduced max distance */
          spacing: 20.00, /* Increased spacing to reduce density */
          gyroControls: false /* Ensure gyro controls are off to prevent potential performance issues */
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [