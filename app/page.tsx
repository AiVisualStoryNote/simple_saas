"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gamepad2, BookOpen, BookOpenText, Film } from "lucide-react";
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
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Experience AI Masterpieces <br className="hidden sm:inline" />
                体验 AI 作品
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
                Welcome to explore our collection of AI-generated stories and videos, bringing you a whole new visual experience
                <br className="hidden sm:inline" />
                欢迎探索AI创作的故事和视频，为您带来视觉上的新体验
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center"
            >
              <Link href="/games">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Game Center
                </Button>
              </Link>
              <Link href="/reading-room?mkt=cn">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                  <BookOpen className="w-4 h-4" />
                  中文阅览室
                </Button>
              </Link>
              <Link href="/reading-room">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2 bg-purple-700 hover:bg-purple-600 dark:hover:bg-purple-800">
                  <BookOpenText className="w-4 h-4" />
                  Reading Room
                </Button>
              </Link>
              <Link href="/theater/cn">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2">
                  <Film className="w-4 h-4" />
                  中文剧场
                </Button>
              </Link>
              <Link href="/theater">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg gap-2 bg-purple-700 hover:bg-purple-600 dark:hover:bg-purple-800">
                  <Film className="w-4 h-4" />
                  International Theater
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 border-y">
        <div className="relative -top-14 text-center text-xl text-muted-foreground h-0">
          Target
          <br />
          未来目标
        </div>
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.labelEn}</div>
                <div className="text-sm text-muted-foreground">{stat.labelZh}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PricingSection />    </div>
  );
}

const stats = [
  { value: "1000+", labelEn: "Books Available", labelZh: "书籍数量" },
  { value: "500+", labelEn: "China Market", labelZh: "中国市场" },
  { value: "70%", labelEn: "AI-Assisted", labelZh: "AI辅助创作" },
  { value: "30%", labelEn: "Human Created", labelZh: "人工创作" },
];
