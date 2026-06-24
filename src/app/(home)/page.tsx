"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Server,
  Network,
  Layers,
  Brain,
  Code2,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";

const topics = [
  {
    title: "Backend Engineering",
    description: "Communication patterns, protocols, and core backend concepts.",
    href: "/docs/fundamentals-of-backend-engineering/backend-communication-design-patterns/sync-async",
    icon: Server,
  },
  {
    title: "Communication Patterns",
    description:
      "Request/response, polling, SSE, push, pub/sub, and more.",
    href: "/docs/fundamentals-of-backend-engineering/backend-communication-design-patterns/request-response",
    icon: Network,
  },
  {
    title: "Protocols",
    description: "OSI model, protocol properties, and networking layers.",
    href: "/docs/fundamentals-of-backend-engineering/protocols/protocol-properties",
    icon: Layers,
  },
  {
    title: "Object-Oriented Programming",
    description: "Classes, keywords, inheritance, and OOP fundamentals.",
    href: "/docs/oop/introduction",
    icon: Code2,
  },
  {
    title: "Generative AI",
    description: "AWS Bedrock, LLM tooling, and AI infrastructure.",
    href: "/docs/genai/aws/bedrock",
    icon: Brain,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        {/* Background grid */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
          <motion.div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-foreground/5 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full border bg-background/80 backdrop-blur-sm text-sm text-muted-foreground"
        >
          <Sparkles className="w-4 h-4" />
          <span>Structured notes for deep understanding</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4"
        >
          Learn by building{" "}
          <span className="underline decoration-foreground/20 underline-offset-4">
            mental models
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-xl mb-10"
        >
          Concise, interconnected engineering notes designed for active recall
          — not passive reading. Dive in, explore connections, and solidify
          your understanding.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4"
        >
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            <BookOpen className="w-4 h-4" />
            Start Reading
          </Link>
          <Link
            href="/docs/fundamentals-of-backend-engineering/backend-communication-design-patterns/sync-async"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-medium hover:bg-accent transition-colors"
          >
            Popular: Patterns
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Topic Cards */}
      <section className="px-4 pb-24 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
            >
              <Link
                href={topic.href}
                className="group relative flex flex-col gap-3 p-5 rounded-xl border bg-background transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-foreground/30"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg border bg-background text-foreground">
                    <topic.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold">{topic.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {topic.description}
                </p>
                <div className="flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
