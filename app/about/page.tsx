"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Film, Wand2, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">About Us</h1>
              <p className="text-sm text-muted-foreground">
                Learn more about our mission and story
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Creative Platform
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Experience the Future of
              <br />
              <span className="text-primary">AI-Created Stories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We believe AI is revolutionizing content creation. Our platform showcases 
              the endless possibilities of AI-generated stories and videos, bringing 
              entertainment in ways never before imagined.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Film className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To bring AI stories to users as a new form of entertainment, 
                  exploring the infinite possibilities of AI-generated content.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To create a new model for AI work display, making AI-generated 
                  content accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A personal project born from love for AI creative works, 
                  dedicated to exploring new forms of entertainment.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Our Story
              </h3>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  This platform is a personal project created by an individual developer 
                  passionate about AI-generated content. What started as an experiment with 
                  AI storytelling has evolved into a platform dedicated to showcasing the 
                  creative potential of artificial intelligence.
                </p>
                <p>
                  We believe AI-generated stories represent a new frontier in entertainment. 
                  By combining advanced AI technology with creative storytelling, we can 
                  offer users unique and engaging content that pushes the boundaries of 
                  what's possible.
                </p>
                <p>
                  Whether you're curious about AI creativity or looking for fresh 
                  entertainment experiences, our platform offers a window into the 
                  future of content creation. Join us on this exciting journey!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">What We Believe</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These principles guide everything we do
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Innovation</h4>
                  <p className="text-muted-foreground">
                    We embrace new AI technologies to push the boundaries of 
                    what's possible in creative content.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Entertainment First</h4>
                  <p className="text-muted-foreground">
                    We focus on creating enjoyable experiences that entertain 
                    and inspire our users.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Accessibility</h4>
                  <p className="text-muted-foreground">
                    We believe AI creativity should be available to everyone, 
                    regardless of technical background.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Continuous Evolution</h4>
                  <p className="text-muted-foreground">
                    AI technology is ever-changing, and so are we. We're always 
                    exploring new possibilities.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Explore AI Stories?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Dive into our collection of AI-generated stories and videos. 
              Experience entertainment in a whole new way!
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="font-medium">
                <Link href="/reading-room?mkt=cn">
                  中文阅览室
                </Link>
              </Button>
              <Button asChild size="lg" className="font-medium">
                <Link href="/reading-room?">
                  Reading room
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}