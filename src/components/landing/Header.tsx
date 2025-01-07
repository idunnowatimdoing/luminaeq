import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-lumina-blue">Lumina</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-lumina-dark hover:text-lumina-blue transition-colors">Features</a>
            <a href="#pricing" className="text-lumina-dark hover:text-lumina-blue transition-colors">Pricing</a>
            <a href="#testimonials" className="text-lumina-dark hover:text-lumina-blue transition-colors">Testimonials</a>
            <Button 
              onClick={() => navigate("/auth")}
              className="bg-lumina-blue hover:bg-lumina-blue/90"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-lumina-dark hover:text-lumina-blue transition-colors">Features</a>
              <a href="#pricing" className="text-lumina-dark hover:text-lumina-blue transition-colors">Pricing</a>
              <a href="#testimonials" className="text-lumina-dark hover:text-lumina-blue transition-colors">Testimonials</a>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-lumina-blue hover:bg-lumina-blue/90 w-full"
              >
                Get Started
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};