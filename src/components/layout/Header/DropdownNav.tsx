'use client';

interface DropdownNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DropdownNav({ isOpen, onClose }: DropdownNavProps) {
  void onClose;
  return (
    <nav
      className={`fixed inset-0 top-0 z-40 bg-paco-cream transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
      aria-hidden={!isOpen}
    />
  );
}
