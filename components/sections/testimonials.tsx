"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Web Developer",
    avatar: "AJ",
    content:
      "This tool saved me hundreds of hours. I built 15 websites in a single day for local businesses and closed 8 deals worth $12,000 in total.",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    name: "Sarah Martinez",
    role: "Agency Owner",
    avatar: "SM",
    content:
      "Our agency has tripled our output since using this tool. The templates look professional and save us a ton of time on the initial design phase.",
    accent: "from-pink-500 to-rose-500",
  },
  {
    name: "Michael Chang",
    role: "Freelancer",
    avatar: "MC",
    content:
      "As a solo freelancer, this has completely changed my business. I can now take on 5x more clients with the same amount of time investment.",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    name: "Jessica Lee",
    role: "Marketing Consultant",
    avatar: "JL",
    content:
      "My clients love how quickly I can deliver websites for them. This has become an essential part of my service offering.",
    accent: "from-amber-500 to-orange-500",
  },
];

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });

  return (
    <section ref={sectionRef} className="py-20 md:py-28 relative section-divider-top">
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid-bg opacity-10 pointer-events-none" />
      <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-violet-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6"
          >
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[13px] text-white/40 font-medium tracking-wide">Loved by Developers</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              What Our Users{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Say</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-lg text-white/40">
              Join hundreds of satisfied developers and agency owners
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                  <div className="h-full">
                    <div className="h-full p-6 bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl transition-all duration-500 hover:bg-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.1)] group cursor-default relative overflow-hidden">
                      {/* Top gradient accent */}
                      <div className={`absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r ${testimonial.accent} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                      
                      {/* Quote icon */}
                      <Quote className="h-6 w-6 text-white/[0.06] mb-3 group-hover:text-white/[0.1] transition-colors duration-300" />
                      
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 border border-white/[0.08]">
                            <AvatarFallback className="bg-white/[0.05] text-white/50 text-sm font-semibold">{testimonial.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-white/80 text-sm">{testimonial.name}</h3>
                            <p className="text-xs text-white/30">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3.5 w-3.5 fill-yellow-500/80 text-yellow-500/80" />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/50 transition-colors duration-300">{testimonial.content}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8 gap-2">
              <CarouselPrevious className="static transform-none bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/50 hover:text-white/80 transition-all duration-200 cursor-pointer" />
              <CarouselNext className="static transform-none bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-white/50 hover:text-white/80 transition-all duration-200 cursor-pointer" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
}