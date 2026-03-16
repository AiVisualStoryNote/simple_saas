"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users, Sparkles } from "lucide-react";

export default function TermsPage() {
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
              <h1 className="text-xl font-bold">Terms of Service</h1>
              <p className="text-sm text-muted-foreground">
                Terms and conditions for using our service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <Scale className="mr-2 h-4 w-4" />
              Legal Terms
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Terms of Service
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              These terms govern your use of our AI-generated stories and videos platform. 
              By using our service, you agree to these terms and conditions.
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> March 16, 2026
            </p>
          </motion.div>

          {/* Key Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">What You Can Do</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Browse and read AI-generated stories, watch videos, save favorites, and manage your account.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">What You Cannot Do</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Misuse our content, redistribute without permission, or use AI-generated content for illegal purposes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Our Commitment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Provide quality AI content, protect your privacy, and maintain a safe platform for entertainment.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Our Service
              </h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We provide an AI-powered platform that creates and displays AI-generated stories and videos for entertainment purposes. Our service includes:
                </p>
                
                <ul className="space-y-2">
                  <li>• <strong>AI Stories:</strong> Browse and read AI-generated story content</li>
                  <li>• <strong>AI Videos:</strong> Watch AI-generated video content</li>
                  <li>• <strong>Credits System:</strong> Purchase credits to access premium content</li>
                  <li>• <strong>Personal Collections:</strong> Save and manage your favorite content</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* User Responsibilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Your Responsibilities</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3 text-green-700">Acceptable Use</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Use the service for personal entertainment purposes</li>
                    <li>• Provide accurate information when creating an account</li>
                    <li>• Respect intellectual property rights</li>
                    <li>• Keep your account credentials secure</li>
                    <li>• Report any technical issues or misuse</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-red-700">Prohibited Activities</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Redistributing AI-generated content without permission</li>
                    <li>• Attempting to extract or copy our AI models</li>
                    <li>• Sharing account credentials with others</li>
                    <li>• Using automated tools to scrape or bulk-download content</li>
                    <li>• Violating any applicable laws or regulations</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Intellectual Property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Intellectual Property</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">AI-Generated Content</h4>
                  <p>
                    All stories and videos on our platform are AI-generated content. While we strive to create quality content, 
                    these are creative works produced by artificial intelligence and should be viewed as entertainment only.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Your Rights to Content</h4>
                  <p>
                    You may browse and read AI-generated content for personal entertainment. However, you may not 
                    reproduce, distribute, or commercially exploit any AI-generated content without our explicit permission.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Our Intellectual Property</h4>
                  <p>
                    The platform, including our AI algorithms, website design, brand elements, and proprietary technology, 
                    remains our intellectual property. You may not copy, modify, or redistribute our platform or technology.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Content Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                AI Content Disclaimer
              </h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong>Important:</strong> All content on this platform is generated by artificial intelligence. Please note the following:
                </p>
                
                <ul className="space-y-2">
                  <li>• <strong>Entertainment Only:</strong> AI-generated content is for entertainment purposes only and should not be taken as factual information</li>
                  <li>• <strong>No Fact-Checking:</strong> Stories may contain inaccuracies or fictional elements. We do not guarantee the accuracy of any content</li>
                  <li>• <strong>Creative License:</strong> AI generates creative fiction. Any resemblance to real persons, places, or events is purely coincidental</li>
                  <li>• <strong>User Responsibility:</strong> Users are responsible for ensuring their use of content complies with local laws and regulations</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Service Availability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Service Availability and Disclaimers</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Service Availability</h4>
                  <p>
                    While we strive to maintain 24/7 service availability, we cannot guarantee uninterrupted access. 
                    We may temporarily suspend service for maintenance, updates, or due to circumstances beyond our control.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">No Warranties</h4>
                  <p>
                    Our service is provided "as is" without warranties of any kind. We do not guarantee the quality, 
                    accuracy, or suitability of AI-generated content for any specific purpose.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Credits and Payment Terms</h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-3">Purchasing Credits</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Credits are used to access premium content</li>
                    <li>• Multiple credit packages available for purchase</li>
                    <li>• Secure payment processing through trusted providers</li>
                    <li>• Credits are added to your account immediately after purchase</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">No Refunds Policy</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• All credit purchases are final and non-refundable</li>
                    <li>• Credits are virtual currency with no real monetary value</li>
                    <li>• Please purchase credits responsibly based on your needs</li>
                    <li>• No refunds for unused credits</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Changes to Terms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Changes to These Terms</h3>
              
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We may update these Terms of Service from time to time to reflect changes in our service, 
                  legal requirements, or business practices. When we make changes:
                </p>
                
                <ul className="space-y-2">
                  <li>• We will update the "Last updated" date at the top of this page</li>
                  <li>• For significant changes, we will notify users via email or service notifications</li>
                  <li>• Continued use of our service after changes constitutes acceptance of new terms</li>
                  <li>• You can always find the current version of our terms on this page</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need clarification about your rights and responsibilities, 
              please contact us. We're here to help ensure you understand and can comply with these terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/">
                  Start Exploring
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}