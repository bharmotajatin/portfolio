import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { lockScroll } from '../lib/scroll';

function Shell({ onClose, label, className, children }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    lockScroll(true);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
    };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-3 md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ y: 60, rotateX: 18, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, rotateX: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, rotateX: 18, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        style={{ transformPerspective: 1400 }}
        className={`relative max-h-[92vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-2 shadow-2xl ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        {children}
        <button type="button" onClick={onClose} aria-label="Close" className="glass cursor-target absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl text-white transition-transform hover:rotate-90">
          <i className="ri-close-line" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function DetailModal({ item, onClose, label, className = 'max-w-3xl', children }) {
  return createPortal(
    <AnimatePresence>
      {item && (
        <Shell onClose={onClose} label={label(item)} className={className}>
          {children(item)}
        </Shell>
      )}
    </AnimatePresence>,
    document.body
  );
}
