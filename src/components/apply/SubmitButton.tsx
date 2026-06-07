import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';

export const SubmitButton = ({ onClick }: { onClick: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onClick();
    }, 1000); // Fake delay for animation
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isSubmitting}
      whileHover={{ scale: 1.02, backgroundColor: '#f97316', color: '#09090b' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`w-full border border-zinc-800 font-mono font-bold uppercase tracking-widest text-sm py-6 flex items-center justify-center space-x-3 rounded-none transition-colors ${isSubmitting ? 'bg-orange-500 text-zinc-950' : 'bg-zinc-950 text-orange-500 hover:border-orange-500'}`}
    >
      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
      <span>{isSubmitting ? 'Initializing...' : 'Initialize AI Pipeline'}</span>
    </motion.button>
  );
};
