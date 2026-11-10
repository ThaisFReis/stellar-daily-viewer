/** Abertura óptica da Íris. O nome ao lado fornece o texto acessível. */
export default function IrisMark({ className = "iris-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M 33.413 5.037 A 27 27 0 0 1 54.644 17.295 L 43.984 31.372 L 38.536 21.936 Z" fill="currentColor" />
      <path d="M 56.057 19.742 A 27 27 0 0 1 56.057 44.258 L 38.536 42.064 L 43.984 32.628 Z" fill="currentColor" />
      <path d="M 54.644 46.705 A 27 27 0 0 1 33.413 58.963 L 26.552 42.692 L 37.448 42.692 Z" fill="currentColor" />
      <path d="M 30.587 58.963 A 27 27 0 0 1 9.356 46.705 L 20.016 32.628 L 25.464 42.064 Z" fill="currentColor" />
      <path d="M 7.943 44.258 A 27 27 0 0 1 7.943 19.742 L 25.464 21.936 L 20.016 31.372 Z" fill="currentColor" />
      <path d="M 9.356 17.295 A 27 27 0 0 1 30.587 5.037 L 37.448 21.308 L 26.552 21.308 Z" fill="currentColor" />
      <circle cx="32" cy="32" r="5" fill="var(--accent)" />
    </svg>
  );
}
