// AnimatedResult.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedResultProps {
  type: "remembered" | "forgot";
  isNewResponse: boolean;
  onAnimationComplete: () => void;
}

export const AnimatedResult: React.FC<AnimatedResultProps> = ({
  type,
  isNewResponse,
  onAnimationComplete,
}) => {
  const variants = {
    remembered: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
    },
    forgot: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
    },
  };

  const transitionProps = {
    remembered: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
    forgot: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isNewResponse ? (
        <motion.div
          key={type}
          variants={variants[type]}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationComplete={onAnimationComplete}
        >
          {type === "remembered" ? (
            <span className="flex items-center text-lg font-medium text-green-500">
              <span className="mr-2">😄</span>
              Remembered
            </span>
          ) : (
            <span className="flex items-center text-lg font-medium text-red-500">
              <span className="mr-2">😞</span>
              Forgot
            </span>
          )}
        </motion.div>
      ) : (
        <motion.div
          key={type}
          {...transitionProps[type]}
          onAnimationComplete={onAnimationComplete}
        >
          {type === "remembered" ? (
            <span className="flex items-center text-lg font-medium text-green-500">
              <span className="mr-2">😄</span>
              Remembered
            </span>
          ) : (
            <span className="flex items-center text-lg font-medium text-red-500">
              <span className="mr-2">😞</span>
              Forgot
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};