import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PricingTier {
  name: string;
  price: string;
  interval: string;
  description: string;
  features: Array<{
    name: string;
    included: boolean;
  }>;
  highlight?: boolean;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "0",
    interval: "forever",
    description: "Perfect for getting started with emotional intelligence",
    features: [
      { name: "5 Safe Space Journal entries per month", included: true },
      { name: "Basic EQ Assessment", included: true },
      { name: "Monthly recommendations", included: true },
      { name: "Access to pillar journals", included: true },
      { name: "Basic Dashboard", included: true },
      { name: "Earn Basic tier through referrals", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "Lumina Connect Access", included: false },
      { name: "EQ Coach Access", included: false },
    ],
    buttonText: "Get Started Free",
  },
  {
    name: "Basic",
    price: "49",
    interval: "month",
    description: "Enhanced features for dedicated EQ development",
    features: [
      { name: "Unlimited Journal Entries", included: true },
      { name: "Advanced EQ Assessment", included: true },
      { name: "Weekly recommendations", included: true },
      { name: "Access to pillar journals", included: true },
      { name: "Enhanced Dashboard", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "Lumina Connect Access", included: false },
      { name: "EQ Coach Access", included: false },
    ],
    highlight: true,
    buttonText: "Start Basic Plan",
  },
  {
    name: "Premium",
    price: "99",
    interval: "year",
    description: "Complete EQ development suite with advanced features",
    features: [
      { name: "Everything in Basic tier", included: true },
      { name: "Advanced Analytics Dashboard", included: true },
      { name: "Lumina Connect Platform Access", included: true },
      { name: "Priority EQ Coach Access", included: true },
      { name: "Custom Development Path", included: true },
      { name: "Early Access to New Features", included: true },
      { name: "Priority Support", included: true },
    ],
    buttonText: "Go Premium",
  },
];

export const Pricing = () => {
  const navigate = useNavigate();
  
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-4 text-lumina-blue">Choose Your Growth Path</h2>
          <p className="text-center text-lumina-neutral mb-12 max-w-2xl mx-auto">
            Start your emotional intelligence journey today with a plan that fits your needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.name}
                className={`backdrop-blur-md bg-white/40 p-8 border-lumina-teal/20 relative ${
                  tier.highlight ? 'ring-2 ring-lumina-yellow shadow-lg scale-105' : ''
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-lumina-yellow text-lumina-dark text-sm px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-lumina-blue">
                    ${tier.price}
                  </span>
                  <span className="text-lumina-neutral">/{tier.interval}</span>
                </div>
                
                <p className="text-sm text-lumina-neutral mb-6">
                  {tier.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-lumina-teal mr-2 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-lumina-neutral/50 mr-2 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-lumina-dark' : 'text-lumina-neutral'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => navigate("/auth")}
                  className={`w-full ${
                    tier.highlight
                      ? 'bg-gradient-to-r from-lumina-yellow to-lumina-teal hover:opacity-90'
                      : 'bg-lumina-blue hover:bg-lumina-blue/90'
                  }`}
                >
                  {tier.buttonText}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};