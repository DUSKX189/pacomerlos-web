'use client';
import { useEffect, useRef, useState } from 'react';
import HeaderLogo from '@/components/ui/Header/HeaderLogo';
import NavBar from '@/components/ui/Header/NavBar';
import BurgerMenu from '@/components/ui/Header/BurgerMenu';
import InstagramButton from '@/components/ui/Header/InstagramButton';
import DropdownNav from '@/components/layout/Header/DropdownNav';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y < lastScrollY.current || y < 20) setIsVisible(true);
      else if (y > lastScrollY.current && y > 80) setIsVisible(false);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`header ${isVisible ? 'translate-y-0' : 'translate-y-[-120%]'}`}>
        <div className="header-pill">
          <BurgerMenu isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(v => !v)} />
          <HeaderLogo />
          <NavBar />
          <InstagramButton />
        </div>
      </header>
      <DropdownNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
