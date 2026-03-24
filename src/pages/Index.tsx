import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Target, BarChart3, Megaphone, Palette, MonitorSmartphone, CheckCircle, MessageSquare, Lightbulb, Rocket, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import amLogo from "@/assets/am-logo.png";
import type { Tables } from "@/integrations/supabase/types";

const services = [
  { icon: Target, title: "Meta Ads", desc: "Strategic Facebook & Instagram ad campaigns that convert." },
  { icon: TrendingUp, title: "Google Ads", desc: "Data-driven PPC campaigns to maximize your ROI." },
  { icon: Megaphone, title: "TikTok Ads", desc: "Viral content strategies for massive reach and sales." },
  { icon: Palette, title: "Branding", desc: "Complete brand identity from logo to visual guidelines." },
  { icon: BarChart3, title: "Analytics", desc: "In-depth reporting and campaign optimization." },
  { icon: MonitorSmartphone, title: "Social Media", desc: "Content creation and growth across all platforms." },
];

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "100+", label: "Projects Delivered" },
  { value: "50+", label: "Happy Clients" },
  { value: "10M+", label: "Ad Spend Managed" },
];

const process = [
  { step: "01", icon: Search, title: "Discovery", desc: "We analyze your business goals, target audience, and competitive landscape." },
  { step: "02", icon: Lightbulb, title: "Strategy", desc: "Craft a customized marketing plan with clear KPIs and milestones." },
  { step: "03", icon: Rocket, title: "Execution", desc: "Launch campaigns across selected platforms with optimized creatives." },
  { step: "04", icon: BarChart3, title: "Optimize", desc: "Continuously monitor, test, and refine for maximum ROI." },
];

const faqs = [
  { q: "Do you work with businesses from all countries?", a: "Yes! We work with clients globally, adjusting to their timezone and market." },
  { q: "How much do your services cost?", a: "Pricing depends on your project scope and needs. Contact us for a free consultation and custom quote." },
  { q: "What platforms do you specialize in?", a: "We specialize in Meta (Facebook/Instagram), Google Ads, TikTok, and comprehensive social media management." },
  { q: "How soon can I see results?", a: "Most clients see initial improvements within 2-4 weeks. Significant ROI typically shows within 2-3 months." },
  { q: "Do you offer long-term contracts?", a: "We offer both project-based and retainer arrangements. We believe in transparency — all agreements are clearly documented." },
];

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [logos, setLogos] = useState<Tables<"client_logos">[]>([]);
  const [blogPosts, setBlogPosts] = useState<Tables<"blog_posts">[]>([]);
  const [testimonials, setTestimonials] = useState<Tables<"testimonials">[]>([]);

  useEffect(() => {
    supabase.from("client_logos").select("*").eq("published", true).order("sort_order").then(({ data }) => setLogos(data || []));
    supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3).then(({ data }) => setBlogPosts(data || []));
    supabase.from("testimonials").select("*").eq("published", true).order("sort_order").limit(3).then(({ data }) => setTestimonials(data || []));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-fade-up opacity-0">
            <img src={amLogo} alt="AM Marketing" className="h-24 w-24 mx-auto mb-6 animate-float" width={512} height={512} />
          </div>
          <h1 className="animate-fade-up opacity-0 delay-100 font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-gradient-gold">Digital Marketing</span>
            <br />
            <span className="text-foreground">Agency</span>
          </h1>
          <p className="animate-fade-up opacity-0 delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
            Maximize Your Online Success with <span className="text-primary font-semibold">Asma Mahar</span> — Your Ultimate E-Commerce and Social Media Strategist!
          </p>
          <div className="animate-fade-up opacity-0 delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm tracking-wide hover:scale-105 transition-transform glow-gold">
              Contact Now <ArrowRight size={18} />
            </Link>
            <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass border border-primary/30 text-primary font-body font-semibold text-sm tracking-wide hover:scale-105 transition-transform">
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding -mt-20 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 text-center animate-fade-up opacity-0" style={{ animationDelay: `${i * 100 + 400}ms` }}>
              <div className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1 font-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Logos */}
      {logos.length > 0 && (
        <section className="section-padding py-12">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-muted-foreground text-sm font-body mb-8 tracking-widest uppercase">Trusted By Leading Brands</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {logos.map((logo) => (
                <a key={logo.id} href={logo.website_url || "#"} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                  {logo.logo_url ? (
                    <img src={logo.logo_url} alt={logo.name} className="h-10 md:h-12 object-contain grayscale hover:grayscale-0 transition-all" loading="lazy" />
                  ) : (
                    <span className="text-muted-foreground font-display font-semibold text-lg">{logo.name}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-4">
            <span className="text-gradient-gold">Services</span> I Provide
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Comprehensive digital marketing solutions tailored to grow your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <div key={i} className="glass-card rounded-2xl p-8 group animate-fade-up opacity-0" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:glow-gold transition-all">
                  <svc.icon className="text-primary" size={28} />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{svc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-primary font-body font-semibold hover:gap-3 transition-all">
              View All Services <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works / Process */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-4">
            How It <span className="text-gradient-gold">Works</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
            A simple, proven process to deliver exceptional marketing results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <div key={i} className="relative glass-card rounded-2xl p-8 text-center animate-fade-up opacity-0" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="text-5xl font-display font-bold text-primary/10 absolute top-4 right-4">{step.step}</div>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      {testimonials.length > 0 && (
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-4">
              What <span className="text-gradient-gold">Clients</span> Say
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Real results, real people.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="glass-card rounded-2xl p-8">
                  <MessageSquare className="text-primary/30 mb-4" size={28} />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                  <div className="font-display font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/testimonials" className="inline-flex items-center gap-2 text-primary font-body font-semibold hover:gap-3 transition-all">
                See All Testimonials <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className="section-padding">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-4">
              Latest <span className="text-gradient-gold">Insights</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Tips and strategies from the digital marketing world.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="glass-card rounded-2xl overflow-hidden group">
                  {post.cover_image && <img src={post.cover_image} alt={post.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                  <div className="p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>}
                    <span className="inline-flex items-center gap-1 text-primary text-sm font-body font-semibold mt-3 group-hover:gap-2 transition-all">Read More <ArrowRight size={14} /></span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-body font-semibold hover:gap-3 transition-all">
                View All Posts <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-4">
            Frequently <span className="text-gradient-gold">Asked</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">Quick answers to common questions.</p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center text-sm font-body font-medium text-foreground/90 hover:text-primary transition-colors"
                >
                  {faq.q}
                  <span className="text-primary text-lg ml-4">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed animate-fade-up" style={{ animationDuration: "0.3s" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-10 md:p-16 text-center glow-teal">
          <Users className="text-accent mx-auto mb-4" size={40} />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Worked With Us?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Share your experience and help others discover quality digital marketing.
          </p>
          <Link to="/feedback" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-accent-foreground font-body font-semibold hover:scale-105 transition-transform">
            Leave Feedback <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl p-10 md:p-16 text-center glow-gold">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-4">Ready to Grow Your Business?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Let's discuss how we can take your brand to the next level with data-driven marketing strategies.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-body font-semibold hover:scale-105 transition-transform">
            Get In Touch <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
