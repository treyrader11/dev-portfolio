"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import Rounded from "@/components/Rounded";
import {
  RiCheckLine,
  RiStarFill,
  RiArrowRightLine,
  RiPaintBrushLine,
  RiArticleLine,
  RiDoorOpenLine,
  RiChat3Line,
  RiPlugLine,
  RiSearchEyeLine,
  RiPaletteLine,
  RiTimerLine,
} from "react-icons/ri";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const },
};

function staggerDelay(i: number) {
  return {
    ...fadeUp,
    transition: { ...fadeUp.transition, delay: 0.08 * i },
  };
}

interface Tier {
  name: string;
  price: string;
  subtitle: string;
  recommended?: boolean;
  features: string[];
}

const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$6,500",
    subtitle: "Clean marketing site",
    features: [
      "7 pages (all standard pages)",
      "Modern animated design",
      "Mobile-first responsive layout",
      "Contact + Quote Request form",
      "Email notifications on form submissions",
      "SEO, sitemap, Google Analytics",
      "Vercel deployment",
      "30-day post-launch support",
    ],
  },
  {
    name: "Professional",
    price: "$12,000",
    subtitle: "Full-featured + admin tools",
    recommended: true,
    features: [
      "Everything in Starter",
      "Custom admin dashboard",
      "Secure login system for staff",
      "Premium scroll animations",
      "Media library for photos & videos",
      "Spam protection on all forms",
      "Client portal to track quote requests",
      "Database for content & form submissions",
      "60-day post-launch support",
    ],
  },
  {
    name: "Enterprise",
    price: "$18,500+",
    subtitle: "Everything + custom integrations",
    features: [
      "Everything in Professional",
      "Careers portal with job applications",
      "Client file upload / download portal",
      "Automated email workflows",
      "Custom API integrations",
      "Analytics dashboard in admin",
      "File portal integration",
      "Priority support — 90 days",
      "Quarterly strategy check-ins",
    ],
  },
];

const deliverables = [
  "Professional, mobile-friendly design across all screen sizes",
  "Contact form + Quote Request form (submissions go to your inbox)",
  "SEO basics — Google-friendly page structure and metadata",
  "Google Analytics setup",
  "Spam protection on all forms",
  "Live deployment with full technical documentation",
  "30-day post-launch support window",
  "Full code ownership transferred to you on final payment",
  "Accessibility-first UI (keyboard nav, screen reader support, color contrast)",
];

interface AddOn {
  name: string;
  price: string;
  desc: string;
}

interface AddOnCategory {
  label: string;
  icon: typeof RiPaintBrushLine;
  items: AddOn[];
}

const addOnCategories: AddOnCategory[] = [
  {
    label: "Animation",
    icon: RiPaintBrushLine,
    items: [
      {
        name: "Premium scroll animations",
        price: "$1,200",
        desc: "Eye-catching reveal effects and motion storytelling as visitors scroll",
      },
      {
        name: "Interactive 3D homepage hero",
        price: "$2,000–$3,500",
        desc: "A stunning interactive 3D scene — the kind that wins design awards",
      },
      {
        name: "Cursor & hover micro-effects",
        price: "$600",
        desc: "Magnetic buttons, hover effects — makes the site feel premium",
      },
    ],
  },
  {
    label: "Content",
    icon: RiArticleLine,
    items: [
      {
        name: "Blog / News module",
        price: "$1,500",
        desc: "A news section your team manages from admin, with categories and tags",
      },
      {
        name: "Project portfolio / Case studies",
        price: "$1,200",
        desc: "Showcase work with photos, descriptions, and testimonials",
      },
      {
        name: "Equipment & fleet showcase page",
        price: "$800",
        desc: "Visually rich page with photos and specs",
      },
    ],
  },
  {
    label: "Portals",
    icon: RiDoorOpenLine,
    items: [
      {
        name: "Client document portal",
        price: "$2,500",
        desc: "Secure per-client login to upload and download project files",
      },
      {
        name: "Job application portal",
        price: "$1,800",
        desc: "Applicants submit online; your team manages the pipeline in admin",
      },
      {
        name: "Quote request tracker",
        price: "$1,400",
        desc: "Clients log in to see real-time status of their quote request",
      },
    ],
  },
  {
    label: "Chat",
    icon: RiChat3Line,
    items: [
      {
        name: "AI-powered chat support",
        price: "$1,200",
        desc: "Automated assistant answers common questions 24/7, no staff needed",
      },
      {
        name: "Real-time live chat (WebSocket)",
        price: "$1,800",
        desc: "Instant push notification to your phone when a visitor opens chat; you reply directly",
      },
    ],
  },
  {
    label: "Integrations",
    icon: RiPlugLine,
    items: [
      {
        name: "Analytics dashboard in admin",
        price: "$900",
        desc: "Site traffic and top pages visible inside your admin, no extra logins",
      },
      {
        name: "Email list / newsletter signup",
        price: "$500",
        desc: "Connected to Mailchimp to grow your audience",
      },
      {
        name: "Interactive service area map",
        price: "$700",
        desc: "Custom-styled interactive map showing your operating regions",
      },
    ],
  },
  {
    label: "SEO & Maintenance",
    icon: RiSearchEyeLine,
    items: [
      {
        name: "Advanced SEO package",
        price: "$800",
        desc: "Structured data markup, Core Web Vitals audit, local business schema",
      },
      {
        name: "Monthly maintenance retainer",
        price: "$350/mo",
        desc: "Ongoing updates, performance monitoring, dependency upgrades, priority support",
      },
    ],
  },
  {
    label: "Branding",
    icon: RiPaletteLine,
    items: [
      {
        name: "Logo & brand refresh",
        price: "$750–$1,500",
        desc: "Updated logo, color palette, and typography delivered as a complete brand guide",
      },
    ],
  },
];

export default function Pricing() {
  return (
    <section className={cn("bg-neutral-100", "pb-40", "min-h-screen", "overflow-hidden")}>
      {/* Hero */}
      <motion.div
        className="px-6 pt-16 pb-12 max-w-4xl mx-auto text-center"
        {...fadeUp}
      >
        <h2 className="text-3xl md:text-4xl font-pp-acma text-gray-800 mb-4">
          Transparent Pricing. No Surprises.
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Every project is custom-built from scratch — no templates, no
          page builders. You get a real website that&apos;s yours to own,
          built by a developer who gives a damn.
        </p>
      </motion.div>

      {/* Pricing Tiers */}
      <div className="px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              {...staggerDelay(i)}
              className={cn(
                "relative",
                "rounded-2xl",
                "p-8",
                "flex",
                "flex-col",
                tier.recommended
                  ? "bg-dark text-white ring-2 ring-secondary"
                  : "bg-white text-gray-800 border border-gray-200/80"
              )}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <RiStarFill className="text-xs" />
                    RECOMMENDED
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-1">
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    "text-4xl",
                    "font-bold",
                    "font-pp-acma",
                    tier.recommended ? "text-secondary" : "text-gray-800"
                  )}
                >
                  {tier.price}
                </p>
                <p
                  className={cn(
                    "text-sm mt-1",
                    tier.recommended ? "text-gray-400" : "text-gray-500"
                  )}
                >
                  {tier.subtitle}
                </p>
              </div>

              <ul className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      "flex items-start gap-2.5 text-sm leading-relaxed",
                      tier.recommended ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    <RiCheckLine
                      className={cn(
                        "flex-shrink-0 mt-0.5",
                        tier.recommended ? "text-secondary" : "text-secondary"
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Rounded
                  href="/contact"
                  backgroundColor={tier.recommended ? "#A25600" : "#292929"}
                  className={cn(
                    "w-full",
                    "py-3.5",
                    "px-6",
                    "border-[.3px]",
                    tier.recommended
                      ? "bg-secondary border-secondary/50 text-white"
                      : "border-gray-300 text-gray-800"
                  )}
                >
                  <span
                    className={cn(
                      "relative",
                      "z-[1]",
                      "text-sm",
                      "font-semibold",
                      "transition-colors",
                      "duration-[400]",
                      "ease-linear",
                      "group-hover:text-white",
                      "whitespace-nowrap"
                    )}
                  >
                    Get Started
                  </span>
                </Rounded>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment note */}
        <motion.p
          className="text-sm text-gray-400 text-center max-w-3xl mx-auto mt-10 leading-relaxed"
          {...fadeUp}
        >
          These figures represent standard market rates — they&apos;re here to
          give you a real frame of reference. My preference is always to build
          incrementally so you see progress before significant money changes
          hands. Payment is typically split into thirds: to kick things off,
          mid-build once design is locked, and at launch when you&apos;re happy.
          Zelle, check, ACH, and PayPal accepted.
        </motion.p>
      </div>

      {/* Standard Deliverables */}
      <div className="px-4 max-w-4xl mx-auto mt-28">
        <motion.div {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-pp-acma text-gray-800 mb-2">
            Every package includes
          </h2>
          <p className="text-gray-500 mb-10">
            Regardless of which tier you choose, these are standard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          {deliverables.map((item, i) => (
            <motion.div
              key={item}
              {...staggerDelay(i)}
              className="flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RiCheckLine className="text-secondary text-xs" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optional Add-Ons */}
      <div className="px-4 max-w-5xl mx-auto mt-28">
        <motion.div {...fadeUp}>
          <h2 className="text-2xl md:text-3xl font-pp-acma text-gray-800 mb-2">
            Optional Add-Ons
          </h2>
          <p className="text-gray-500 mb-12">
            All prices are fixed and scoped before work begins. No surprises.
          </p>
        </motion.div>

        <div className="space-y-12">
          {addOnCategories.map((category, catIdx) => (
            <motion.div key={category.label} {...staggerDelay(catIdx)}>
              <div className="flex items-center gap-2 mb-5">
                <category.icon className="text-lg text-secondary" />
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {category.label}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.items.map((addon) => (
                  <div
                    key={addon.name}
                    className={cn(
                      "bg-white",
                      "rounded-xl",
                      "border",
                      "border-gray-200/80",
                      "p-5",
                      "hover:border-secondary/30",
                      "transition-colors",
                      "duration-300"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-sm font-semibold text-gray-800 leading-snug">
                        {addon.name}
                      </h4>
                      <span className="text-sm font-semibold text-secondary whitespace-nowrap">
                        {addon.price}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {addon.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        className="px-4 max-w-3xl mx-auto mt-28 text-center"
        {...fadeUp}
      >
        <div className="bg-dark rounded-2xl p-10 md:p-14">
          <RiTimerLine className="text-3xl text-secondary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-pp-acma text-white mb-3">
            Not sure which tier fits?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Let&apos;s talk it through. No commitment, no jargon — just a
            straightforward conversation about what you need and what it would
            take to build it.
          </p>
          <Link
            href="/contact"
            scroll={false}
            className={cn(
              "inline-flex",
              "items-center",
              "gap-2",
              "bg-secondary",
              "text-white",
              "px-8",
              "py-3.5",
              "rounded-full",
              "text-sm",
              "font-semibold",
              "hover:bg-secondary/90",
              "transition-colors",
              "duration-300"
            )}
          >
            Get in Touch
            <RiArrowRightLine />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
