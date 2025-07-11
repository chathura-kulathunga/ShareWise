// Animate brand text with gentle pulsing glow
document.addEventListener('DOMContentLoaded', () => {
  const brand = document.querySelector('.brand');

  // Start with strong glow
  brand.style.textShadow = '0 0 12px #00ffff, 0 0 25px #00ffff';

  // Pulse every 1.2s
  setInterval(() => {
    brand.style.textShadow = brand.style.textShadow === '0 0 12px #00ffff, 0 0 25px #00ffff'
      ? '0 0 8px #00ffff, 0 0 18px #00ffff'
      : '0 0 12px #00ffff, 0 0 25px #00ffff';
  }, 1200);
});