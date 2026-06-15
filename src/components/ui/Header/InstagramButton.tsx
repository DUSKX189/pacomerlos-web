export default function InstagramButton() {
  return (
    <a
      href="https://www.instagram.com/paco_merlos/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram de Paco Merlos"
      className="flex text-paco-orange transition-transform duration-150 hover:scale-110 md:hidden"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-6 w-6"
      >
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r=".75" fill="currentColor" stroke="none" />
      </svg>
    </a>
  );
}
