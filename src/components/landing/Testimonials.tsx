import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="backdrop-blur-md bg-black/40 p-6 border-lumina-teal/20">
                <Quote className="w-8 h-8 text-lumina-teal mb-4" />
                <p className="text-white/90 mb-4 italic">{testimonial.text}</p>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/80">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    text: "Lumina has transformed how I understand my emotions. The insights are incredible!",
    name: "Sarah Chen",
    role: "Product Manager"
  },
  {
    text: "The daily journaling prompts have helped me develop better emotional awareness.",
    name: "Marcus Johnson",
    role: "Team Lead"
  },
  {
    text: "Using Lumina with my team has improved our communication significantly.",
    name: "Emily Rodriguez",
    role: "HR Director"
  }
];