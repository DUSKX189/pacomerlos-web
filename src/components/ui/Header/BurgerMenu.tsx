'use client';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function BurgerMenu({ isOpen, onToggle }: BurgerMenuProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      aria-expanded={isOpen}
      className="burger"
    >
      <span className={`burger-bar top-0 origin-[5%] ${isOpen ? 'w-9 rotate-45' : ''}`} />
      <span className={`burger-bar top-1/2 -translate-y-1/2 ${isOpen ? 'bg-transparent' : ''}`} />
      <span className={`burger-bar bottom-0 origin-[5%] ${isOpen ? 'bg-transparent' : ''}`} />
      <span className={`burger-bar bottom-0 origin-[5%] ${isOpen ? 'w-9 -rotate-45' : ''}`} />
    </button>
  );
}
