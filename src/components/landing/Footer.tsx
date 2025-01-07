import { Mail, Github, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-lumina-blue mb-4">Lumina</h3>
            <p className="text-lumina-neutral">
              Empowering emotional intelligence through technology and community.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lumina-blue mb-4">Product</h4>
            <ul className="space-y-2 text-lumina-neutral">
              <li><a href="#features" className="hover:text-lumina-blue transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-lumina-blue transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-lumina-blue transition-colors">Testimonials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lumina-blue mb-4">Company</h4>
            <ul className="space-y-2 text-lumina-neutral">
              <li><a href="#about" className="hover:text-lumina-blue transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-lumina-blue transition-colors">Careers</a></li>
              <li><a href="#blog" className="hover:text-lumina-blue transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lumina-blue mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="mailto:contact@lumina.ai" className="text-lumina-neutral hover:text-lumina-blue transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://github.com/lumina" className="text-lumina-neutral hover:text-lumina-blue transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/lumina" className="text-lumina-neutral hover:text-lumina-blue transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-lumina-neutral">
          <p>&copy; {new Date().getFullYear()} Lumina. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};