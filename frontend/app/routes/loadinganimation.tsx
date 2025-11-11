import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import '../assets/LoadingAnimation.css';

interface LoadingAnimationProps {
  onAnimationComplete: () => void;
}

const LoadingAnimation = ({ onAnimationComplete }: LoadingAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<number>(0);
  const hasCompletedRef = useRef(false); // Pour éviter les appels multiples

  useEffect(() => {
    const startVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.loop = true;
          await videoRef.current.play();
        } catch (error) {
          console.error('Erreur lecture vidéo:', error);
        }
      }
    };

    startVideo();

    const startTime = Date.now();
    const totalTime = 5000;

    progressRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalTime) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        if (progressRef.current) {
          window.clearInterval(progressRef.current);
        }
        setIsVisible(false);
        console.log('LoadingAnimation - Appel de onAnimationComplete');
        onAnimationComplete(); // Appel IMMÉDIAT sans setTimeout
      }
    }, 100);

    return () => {
      if (progressRef.current) {
        window.clearInterval(progressRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [onAnimationComplete]);

  const text = "Lead Your Teams, Master Your Time";
  const letters = text.split('');

  console.log('Rendering LoadingAnimation - isVisible:', isVisible);

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div 
      className="loading-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="video-wrapper">
        <motion.video
          ref={videoRef}
          className="logo-video"
          muted
          playsInline
          loop
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1,
            ease: "easeOut"
          }}
        >
          <source src="/Animation_du_logo.mp4" type="video/mp4" />
          <source src="/Animation_du_logo.webm" type="video/webm" />
          Votre navigateur ne supporte pas la vidéo.
        </motion.video>
        
        {/* Animation Wave avec répétition */}
        <motion.div 
          className="wave-text"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 1.0
              }
            }
          }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={{
                hidden: { 
                  y: 50, 
                  opacity: 0, 
                  rotate: -10 
                },
                visible: { 
                  y: 0, 
                  opacity: 1, 
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 2,
                    duration: 2
                  }
                }
              }}
              className="wave-letter"
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Barre de progression */}
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="progress-text">
            {Math.round(progress)}% - Chargement...
          </div>
        </div>

        {/* Message d'attente */}
        <motion.div 
          className="waiting-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
        >
          Préparation de votre expérience Time Manager...
        </motion.div>

        {/* Animation de particules en arrière-plan */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ 
                opacity: 0,
                scale: 0,
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
