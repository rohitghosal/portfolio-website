import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { name: 'GitHub', url: 'https://github.com/rohitghosal/', icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rohit-ghosal-a16488184/', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { name: 'Twitter', url: 'https://twitter.com/imghosal1', icon: 'M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z' },
  { name: 'Instagram', url: 'https://www.instagram.com/bingo_learnings/', icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.882 0 1.441 1.441 0 0 1 2.882 0z' },
];

// Submit states
const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR: 'error',
};

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const formElRef = useRef(null);
  const badgeRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rotate available badge
      gsap.to(badgeRef.current, {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });

      // Form reveal
      gsap.fromTo(formRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Close resume modal on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setResumeOpen(false);
    };
    if (resumeOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [resumeOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(STATUS.SENDING);
    setErrorMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setStatus(STATUS.SUCCESS);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(STATUS.IDLE), 4000);
    } catch (err) {
      console.error('API Error:', err);
      setStatus(STATUS.ERROR);
      setErrorMsg('Failed to send message. Please try again.');
      setTimeout(() => setStatus(STATUS.IDLE), 5000);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case STATUS.SENDING:
        return (
          <>
            <span className="contact__spinner" />
            Sending...
          </>
        );
      case STATUS.SUCCESS:
        return (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Message Sent!
          </>
        );
      case STATUS.ERROR:
        return (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Failed to Send
          </>
        );
      default:
        return (
          <>
            Send Message
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        );
    }
  };

  return (
    <section className="section contact" id="contact" ref={sectionRef}>
      <div className="section-inner">
        <div className="about__label font-mono">
          <span className="about__label-line"></span>
          GET IN TOUCH
        </div>

        <h2 className="contact__title">
          Let's Work <span className="gradient-text">Together</span>
        </h2>

        <div className="contact__grid" ref={formRef}>
          <form className="contact__form glass" onSubmit={handleSubmit} ref={formElRef}>
            <div className="contact__field">
              <label htmlFor="contact-name" className="contact__label font-mono">NAME</label>
              <input
                type="text"
                id="contact-name"
                className="contact__input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Your name"
                disabled={status === STATUS.SENDING}
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-email" className="contact__label font-mono">EMAIL</label>
              <input
                type="email"
                id="contact-email"
                className="contact__input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="your@email.com"
                disabled={status === STATUS.SENDING}
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-message" className="contact__label font-mono">MESSAGE</label>
              <textarea
                id="contact-message"
                className="contact__input contact__textarea"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="5"
                required
                placeholder="Tell me about your project..."
                disabled={status === STATUS.SENDING}
              />
            </div>

            {/* Error message display */}
            {status === STATUS.ERROR && errorMsg && (
              <div className="contact__error font-mono">{errorMsg}</div>
            )}

            <button
              type="submit"
              className={`contact__submit contact__submit--${status}`}
              id="contact-submit"
              disabled={status === STATUS.SENDING || status === STATUS.SUCCESS}
            >
              {getButtonContent()}
            </button>
          </form>

          <div className="contact__info">
            <div className="contact__info-card glass">
              <h4 className="contact__info-title font-mono">CONTACT INFO</h4>
              <div className="contact__info-item">
                <span className="contact__info-icon">📧</span>
                <a href="mailto:rohit.ghosal1234@gmail.com">rohit.ghosal1234@gmail.com</a>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-icon">📱</span>
                <a href="tel:+918016626188">(+91) 8016626188</a>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-icon">📍</span>
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>

            {/* Download Resume Button */}
            <button
              className="contact__resume-btn glass"
              onClick={() => setResumeOpen(true)}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              Download My Resume
            </button>

            <div className="contact__socials">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__social-link glass"
                  aria-label={social.name}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Rotating badge */}
        <div className="contact__badge-container">
          <div className="contact__badge" ref={badgeRef}>
            <svg viewBox="0 0 100 100" className="contact__badge-svg">
              <defs>
                <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text fontSize="8.5" fontFamily="'JetBrains Mono', monospace" fontWeight="600" fill="currentColor">
                <textPath href="#circle" startOffset="0%">
                  AVAILABLE FOR WORK • OPEN TO COLLABORATE •{' '}
                </textPath>
              </text>
            </svg>
            <span className="contact__badge-inner">✦</span>
          </div>
        </div>

        <footer className="contact__footer">
          <p className="contact__copyright font-mono">
            © {new Date().getFullYear()} Rohit Ghosal. Built with ⚡ React + Three.js
          </p>
        </footer>
      </div>

      {/* Resume Modal */}
      {resumeOpen && (
        <div className="resume-modal-overlay" onClick={() => setResumeOpen(false)}>
          <div className="resume-modal glass" onClick={(e) => e.stopPropagation()}>
            <div className="resume-modal__header">
              <h3 className="resume-modal__title font-mono">MY RESUME</h3>
              <button
                className="resume-modal__close"
                onClick={() => setResumeOpen(false)}
                aria-label="Close resume"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="resume-modal__body">
              <iframe
                src="/resume.pdf"
                className="resume-modal__viewer"
                title="Rohit Ghosal Resume"
              />
            </div>
            <div className="resume-modal__footer">
              <a
                href="/resume.pdf"
                download="Rohit_Ghosal_Resume.pdf"
                className="resume-modal__download"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </a>
              <button
                className="resume-modal__close-btn"
                onClick={() => setResumeOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
