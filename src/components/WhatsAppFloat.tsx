const WhatsAppFloat = () => {
  return (
    <a
      href="https://wa.me/971567878746?text=Hello%20Shahmco%20Team%2C%20I%20am%20interested%20in%20your%20services."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Shahmco on WhatsApp"
      className="wa-pill"
    >
      <span className="wa-pulse" aria-hidden="true" />
      <span className="wa-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </span>
      <span className="wa-text">CHAT WITH US</span>
    </a>
  );
};

export default WhatsAppFloat;
