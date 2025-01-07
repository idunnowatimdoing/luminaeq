import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Pricing = () => {
  const navigate = useNavigate();
  
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-4 text-lumina-blue">Simple, Transparent Pricing</h2>
          <p className="text-center text-lumina-neutral mb-12 max-w-2xl mx-auto">
            Start your emotional intelligence journey today with our annual subscription
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="backdrop-blur-md bg-white/40 p-8 border-lumina-teal/20">
              <h3 className="text-xl font-semibold mb-2">Monthly</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-lumina-blue">$12</span>
                <span className="text-lumina-neutral">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {monthlyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-lumina-teal mr-2" />
                    <span className="text-lumina-dark">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full bg-lumina-blue hover:bg-lumina-blue/90"
              >
                Get Started
              </Button>
            </Card>

            <Card className="backdrop-blur-md bg-white/40 p-8 border-lumina-yellow/20 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-lumina-yellow text-lumina-dark text-sm px-3 py-1 rounded-full">
                Best Value
              </div>
              <h3 className="text-xl font-semibold mb-2">Annual</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-lumina-blue">$99</span>
                <span className="text-lumina-neutral">/year</span>
              </div>
              <ul className="space-y-3 mb-8">
                {annualFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-lumina-yellow mr-2" />
                    <span className="text-lumina-dark">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full bg-gradient-to-r from-lumina-yellow to-lumina-teal hover:opacity-90"
              >
                Save 30% Annually
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

const monthlyFeatures = [
  "Unlimited Journal Entries",
  "Basic EQ Analytics",
  "Personal Growth Tracking",
  "Mobile App Access",
];

const annualFeatures = [
  "Everything in Monthly",
  "Advanced EQ Analytics",
  "Priority Support",
  "Early Access to New Features",
  "Lumina Connect (Coming Soon)",
  "Community Journal Access",
];