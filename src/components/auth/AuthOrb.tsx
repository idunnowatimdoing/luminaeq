import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AuthOrbProps {
  className?: string;
}

export const AuthOrb = ({ className }: AuthOrbProps) => {
  const isMobile = useIsMobile();

  // Animation variants
  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-20, 0, -20],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const hoverAnimation = {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.3 }
  };

  const tapAnimation = {
    scale: 0.95,
    rotate: -5,
    transition: { duration: 0.1 }
  };

  // Gradient animation
  const gradientTransition = {
    background: [
      "linear-gradient(135deg, #00ffd5 0%, #0077b6 100%)",
      "linear-gradient(225deg, #00ffd5 0%, #0077b6 100%)",
      "linear-gradient(315deg, #00ffd5 0%, #0077b6 100%)",
      "linear-gradient(45deg, #00ffd5 0%, #0077b6 100%)",
      "linear-gradient(135deg, #00ffd5 0%, #0077b6 100%)",
    ],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  };

  return (
    <motion.div 
      className={cn(
        "absolute w-[300px] h-[300px] rounded-full opacity-80 blur-3xl",
        className
      )}
      initial="initial"
      animate="animate"
      variants={floatAnimation}
      whileHover={!isMobile ? hoverAnimation : undefined}
      whileTap={tapAnimation}
      style={{
        background: "linear-gradient(135deg, #00ffd5 0%, #0077b6 100%)",
      }}
      animate={gradientTransition}
    />
  );
};