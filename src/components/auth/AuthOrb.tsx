import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AuthOrbProps {
  className?: string;
}

export const AuthOrb = ({ className }: AuthOrbProps) => {
  const isMobile = useIsMobile();

  // Combined animation variants
  const combinedAnimation = {
    initial: { 
      y: 0,
      background: "linear-gradient(135deg, #00ffd5 0%, #0077b6 100%)"
    },
    animate: {
      y: [-20, 0, -20],
      background: [
        "linear-gradient(135deg, #00ffd5 0%, #0077b6 100%)",
        "linear-gradient(225deg, #00ffd5 0%, #0077b6 100%)",
        "linear-gradient(315deg, #00ffd5 0%, #0077b6 100%)",
        "linear-gradient(45deg, #00ffd5 0%, #0077b6 100%)",
        "linear-gradient(135deg, #00ffd5 0%, #0077b6 100%)",
      ],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        },
        background: {
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }
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

  return (
    <motion.div 
      className={cn(
        "absolute w-[300px] h-[300px] rounded-full opacity-80 blur-3xl",
        className
      )}
      initial="initial"
      animate="animate"
      variants={combinedAnimation}
      whileHover={!isMobile ? hoverAnimation : undefined}
      whileTap={tapAnimation}
    />
  );
};