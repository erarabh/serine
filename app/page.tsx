'use client'

import { useState, useEffect } from 'react'
import { initHeroScene } from '@/lib/heroScene'
import './styles/homepage.css'

export default function HomePage() {
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly')

  useEffect(() => {
							 
    initHeroScene()

 
    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 100)
										  
				
											 
		 
      }
    }

    window.addEventListener('scroll', handleScroll)

    // Smooth scrolling for navigation links
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement
      const href = target.getAttribute('href') || ''
      if (!href.startsWith('#')) return

      e.preventDefault()
      const targetEl = document.querySelector(href)
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
							   
						  
			
		 
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor =>
      anchor.addEventListener('click', handleAnchorClick)
    )

    // Scroll animations
							 
					 
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
	 

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el)
    })

    // Parallax effect
    const handleParallaxScroll = () => {
      const scrolled = window.pageYOffset
      const parallax = document.querySelector<HTMLElement>('.hero')
								  
	  
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }

    window.addEventListener('scroll', handleParallaxScroll)

    // Interactive demo button
    const demoVideo = document.querySelector<HTMLElement>('.demo-video')
					
    const handleDemoClick = () => {
      if (!demoVideo) return
      demoVideo.innerHTML = '🎬 Loading Demo...'
      demoVideo.style.background = 'linear-gradient(135deg, #45b7d1, #96ceb4)'
		
      setTimeout(() => {
        demoVideo.innerHTML = '✨ Demo Ready! Click to Start'
        demoVideo.style.background = 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
      }, 2000)
	   
	  
														  
    }
    demoVideo?.addEventListener('click', handleDemoClick)

    // Floating particles background
    const createFloatingParticles = () => {
      const particleContainer = document.createElement('div')
      particleContainer.style.position = 'fixed'
      particleContainer.style.top = '0'
      particleContainer.style.left = '0'
      particleContainer.style.width = '100%'
      particleContainer.style.height = '100%'
      particleContainer.style.pointerEvents = 'none'
      particleContainer.style.zIndex = '1'
      document.body.appendChild(particleContainer)

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div')
        particle.style.position = 'absolute'
        particle.style.width = '2px'
        particle.style.height = '2px'
        particle.style.background = `rgba(78, 205, 196, ${Math.random() * 0.5 + 0.2})`
        particle.style.borderRadius = '50%'
        particle.style.left = `${Math.random() * 100}%`
        particle.style.top = `${Math.random() * 100}%`
        particle.style.animation = `float ${Math.random() * 10 + 10}s infinite linear`
        particleContainer.appendChild(particle)
      }
    }

    createFloatingParticles()

    // Enhanced button interactions
    const buttons = document.querySelectorAll<HTMLElement>('.btn, .cta-button')
							   
    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      target.style.transform = 'translateY(-3px) scale(1.05)'
    }
	  
    const handleMouseLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      target.style.transform = 'translateY(0) scale(1)'
    }
	  
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement
							   
      const ripple = document.createElement('span')
      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = `${size}px`
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.position = 'absolute'
      ripple.style.borderRadius = '50%'
      ripple.style.background = 'rgba(255, 255, 255, 0.3)'
      ripple.style.transform = 'scale(0)'
      ripple.style.animation = 'ripple 0.6s linear'
      ripple.style.pointerEvents = 'none'

      target.style.position = 'relative'
      target.appendChild(ripple)
		
      setTimeout(() => ripple.remove(), 600)
						 
			   
    }
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', handleMouseEnter)
      btn.addEventListener('mouseleave', handleMouseLeave)
      btn.addEventListener('click', handleButtonClick as any)
    })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleParallaxScroll)
      document.querySelectorAll('a[href^="#"]').forEach(anchor =>
        anchor.removeEventListener('click', handleAnchorClick)
      )
      demoVideo?.removeEventListener('click', handleDemoClick)
      buttons.forEach(btn => {
        btn.removeEventListener('mouseenter', handleMouseEnter)
        btn.removeEventListener('mouseleave', handleMouseLeave)
        btn.removeEventListener('click', handleButtonClick as any)
      })
      observer.disconnect()
    }
  }, [])

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar" id="navbar">
        <div className="logo">Serine</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#demo">Live Demo</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="#sponsors">Sponsors</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
        </ul>
        <div className="auth-buttons">
          <a href="/dashboard" className="btn btn-login">Login</a>
          <a href={`/checkout?plan=starter&billing=${billing}`} className="btn btn-signup">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="section">
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Transform Your Business with Intelligent AI Agents</h1>
            <p className="hero-subtitle">
              Unleash the power of autonomous AI agents that work 24/7 to automate your workflows,
              boost productivity, and accelerate growth. Join thousands already revolutionizing
              their operations with Serine.
            </p>
            <button className="cta-button">Start Your AI Revolution →</button>
          </div>
          <div className="hero-visual">
            <img
              src="/images/ai-agent-user.png"
              alt="Young man handshaking AI agent in phone"
              style={{
                width: '100%',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section features">
        <div className="container">
          <h2 className="section-title scroll-animate">Powerful Features</h2>
          <div className="features-grid">
            {[
													  
																	   
              { icon: '🤖', title: 'Intelligent Automation', desc: 'Deploy smart AI agents that learn and adapt to your business processes, automating complex tasks with human-like intelligence.' },
				  
														 
													 
															   
              { icon: '⚡', title: 'Lightning Fast', desc: 'Experience unprecedented speed with our optimized AI infrastructure, processing thousands of requests per second.' },
				  
														 
													  
																	
              { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-level security with end-to-end encryption, ensuring your data remains protected at all times.' },
				  
														 
													  
																									
              { icon: '📊', title: 'Advanced Analytics', desc: "Get deep insights into your AI agents' performance with comprehensive analytics and reporting tools." },
				  
														 
													  
															 
              { icon: '🌐', title: 'Global Scale', desc: 'Deploy your AI agents worldwide with our global infrastructure, ensuring low latency everywhere.' },
              { icon: '🔧', title: 'Easy Integration', desc: 'Seamlessly integrate with your existing tools and workflows using our robust API and pre-built connectors.' }
            ].map(({ icon, title, desc }) => (
              <div key={title} className="feature-card scroll-animate">
                <div className="feature-icon">{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-description">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="section demo">
        <div className="container">
          <h2 className="section-title scroll-animate">See It In Action</h2>
          <div className="demo-container scroll-animate">
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.8)' }}>
              Watch how our AI agents transform complex business processes into simple, automated workflows.
            </p>
            <div className="demo-video">▶️ Play Interactive Demo</div>
										  
				  
            <button className="cta-button">Try Live Demo</button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section pricing">
        <div className="container">
          <h2 className="section-title scroll-animate">Choose Your Plan</h2>

          {/* Billing toggle */}
          <div className="billing-toggle scroll-animate">
            <button
              onClick={() => setBilling('monthly')}
              className={billing === 'monthly' ? 'active' : ''}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={billing === 'yearly' ? 'active' : ''}
            >
              Yearly (–17%)
            </button>
          </div>

          <div className="pricing-grid scroll-animate">
            {/* Trial */}
            <div className="pricing-card">
              <h3 className="plan-name">Trial</h3>
              <div className="plan-price">
                <span className="price-number">Free</span>
                <span className="plan-period">(14 d)</span>
              </div>
              <ul className="plan-features">
                <li>1 AI Agent</li>
                <li>100 Q&A Pairs (manual)</li>
                <li>Up to 1 000 API Calls/mo</li>
                <li>Text + Voice Widget</li>
                <li>Basic Analytics</li>
                <li>Email Support (48 h)</li>
              </ul>
              <button className="btn btn-signup">Try for Free</button>
            </div>

            {/* Starter */}
            <div className="pricing-card featured">
              <h3 className="plan-name">Starter</h3>
              <div className="plan-price">
                {billing === 'monthly' ? (
                  <>
                    <span className="price-number">$59</span>
                    <span className="plan-period">/mo</span>
                  </>
                ) : (
                  <>
                    <span className="price-number">$590</span>
                    <span className="plan-period">/yr</span>
                  </>
                )}
              </div>
              <ul className="plan-features">
                <li>Up to 3 AI Agents</li>
                <li>500 Q&A Pairs/agent</li>
                <li>Up to 25 000 API Calls/mo</li>
                <li>Multi-lang Voice+Text</li>
                <li>Sentiment & Business Analytics</li>
                <li>Auto Q&A Tool</li>
                <li>Email Support (24 h)</li>
              </ul>
              <button
                className="btn btn-signup"
                onClick={() =>
                  window.location.assign(`/checkout?plan=starter&billing=${billing}`)
                }
              >
                Get Started
              </button>
            </div>

            {/* Professional */}
            <div className="pricing-card">
              <h3 className="plan-name">Professional</h3>
              <div className="plan-price">
                {billing === 'monthly' ? (
                  <>
                    <span className="price-number">$149</span>
                    <span className="plan-period">/mo</span>
                  </>
                ) : (
                  <>
                    <span className="price-number">$1490</span>
                    <span className="plan-period">/yr</span>
                  </>
                )}
              </div>
              <ul className="plan-features">
                <li>Up to 10 AI Agents</li>
                <li>2 000 Q&A Pairs/agent</li>
                <li>Up to 100 000 API Calls/mo</li>
                <li>Priority Widget Customization</li>
                <li>Advanced Analytics + Top 10 Unanswered</li>
                <li>Auto Q&A Tool</li>
                <li>Priority Email Support (12 h)</li>
              </ul>
              <button
                className="btn btn-signup"
                onClick={() =>
                  window.location.assign(`/checkout?plan=professional&billing=${billing}`)
                }
              >
                Most Popular
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="section dashboard">
        <div className="container">
          <h2 className="section-title scroll-animate">Powerful Dashboard</h2>
          <p
            className="scroll-animate"
            style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.8)' }}
          >
            Manage all your AI agents from one centralized, intuitive dashboard with real-time monitoring and control.
          </p>
          <div className="dashboard-preview scroll-animate">
            📊 Interactive Dashboard Preview
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section id="sponsors" className="section sponsors">
        <div className="container">
          <h2 className="section-title scroll-animate">Trusted By Industry Leaders</h2>
          <div className="sponsors-grid">
            {['TechCorp', 'InnovateLab', 'FutureWorks', 'DataFlow', 'CloudTech', 'AIVentures'].map(name => (
																			
              <div key={name} className="sponsor-logo scroll-animate">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <h2 className="section-title scroll-animate">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {[
              {
                text: "Serine transformed our customer service completely. Our AI agents handle 80% of inquiries automatically, and our team can focus on strategic initiatives. It's incredible!",
																							
				  
                author: 'Sarah Johnson',
                role: 'CEO, TechStart Inc.'
              },
              {
											  
                text: "The automation capabilities are mind-blowing. We've reduced our operational costs by 60% while improving service quality. Best investment we've made this year.",
																						   
				  
                author: 'Michael Chen',
                role: 'CTO, DataDrive Solutions'
              },
              {
											  
                text: "Setting up was incredibly easy, and the results were immediate. Our productivity has increased by 200% since implementing Serine. Highly recommended!",
                author: 'Emily Rodriguez',
                role: 'Operations Manager, GrowthCo'
              }
            ].map(({ text, author, role }) => (
              <div key={author} className="testimonial-card scroll-animate">
                <p className="testimonial-text">&quot;{text}&quot;</p>
                <div className="testimonial-author">{author}</div>
                <div className="testimonial-role">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          {[
            { title: 'Product', items: ['Features', 'Pricing', 'API Documentation', 'Integrations', 'Changelog'] },
            { title: 'Company', items: ['About Us', 'Careers', 'Blog', 'Press', 'Contact'] },
            { title: 'Resources', items: ['Documentation', 'Help Center', 'Community', 'Webinars', 'Case Studies'] },
            { title: 'Legal', items: ['Privacy Policy', 'Terms of Service', 'GDPR', 'Security', 'Compliance'] }
          ].map(({ title, items }) => (
            <div key={title} className="footer-section">
              <h3>{title}</h3>
              {items.map(item => (
                <a key={item} href="#">{item}</a>
              ))}
						
									  
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© 2025 Serine. All rights reserved. Empowering businesses with intelligent AI agents.</p>
        </div>
      </footer>
    </div>
  )
}