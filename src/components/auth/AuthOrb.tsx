// Critical Component DO NOT MODIFY
import { cn } from "@/lib/utils";

interface AuthOrbProps {
  className?: string;
}

export const AuthOrb = ({ className }: AuthOrbProps) => {
  return (
    <div 
      className={cn(
        "auth-orb left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2",
        className
      )} 
    />
  );
};