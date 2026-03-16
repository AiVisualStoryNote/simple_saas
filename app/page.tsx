"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BookOpen } from "lucide-react";
import { PricingSection } from "@/components/pricing-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background -z-10" />
        
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                v1.0 is now live
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Ship your SaaS in days, <br className="hidden sm:inline" />
                not months.
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
                The ultimate Next.js starter kit with Supabase Auth, Creem Payments, and a production-ready dashboard. save 200+ hours of development time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/reading-room?mkt=cn">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                  <BookOpen className="w-4 h-4" />
                  Chinese Reading room
                </Button>
              </Link>
              <Link href="/reading-room">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                  <BookOpen className="w-4 h-4" />
                  Reading room
                </Button>
              </Link>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground"
            >
                <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500"/> No credit card required</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500"/> 7-day free trial</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-y">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PricingSection />    </div>
  );
}

const stats = [
  { value: "10x", label: "Faster Development" },
  { value: "100+", label: "UI Components" },
  { value: "TS", label: "TypeScript First" },
  { value: "24/7", label: "Support" },
];
