'use client';

import Link from 'next/link';

// Design System 项目占位页（后续可继续按你现有项目模板完善）
export default function DesignSystemProjectPage() {
  const fontStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  // 直接在页面内渲染文章内容：不要走 iframe/外部 html 模式
  const articleHtml = `<header>
        <h1>Decoding 12 Leading Design Systems</h1>
        <p>A 3-Layer Framework: Trend Analysis, Company Breakdown, and Practical Methods for Tomorrow's UI</p>
    </header>

    <div class="container">
        <!-- Hero Graphic -->
        <img src="https://placehold.co/1000x400/2563eb/ffffff?text=Design+System+Coordinate+Matrix" alt="Design System Coordinate Matrix" class="hero-img">

        <section>
            <h2>Introduction: The Dual-Axis Coordinate System</h2>
            <p>To thoroughly understand the 12 most representative design systems in the industry, we have constructed a <strong>Dual-Axis Coordinate System</strong>:</p>
            <ul>
                <li><strong>X-Axis (Design Philosophy):</strong> The left side represents "Ultimate Business Efficiency & Standardization (B2B)", while the right side represents "Intense Emotional Expression & Individuality (B2C)".</li>
                <li><strong>Y-Axis (Technical Infrastructure):</strong> The bottom represents "Cross-Platform Consistency & Multi-Framework Compatibility", while the top represents "AI-Driven & Spatial/Physical Adaptability".</li>
            </ul>
            <p>Under this coordinate system, digital product design is undergoing a massive paradigm shift. The era of "Homogenization" and boring applications is coming to an end. Future design systems will no longer be mere UI libraries, but "living architectures" that integrate AI, emotions, and cross-device adaptability.</p>
        </section>

        <section>
            <h2>Layer 1: Trend Analysis — Three Major Winds of Change</h2>
            <img src="https://placehold.co/800x300/f3f4f6/4b5563?text=Trend+1:+Expressive+Design+|+Trend+2:+AI+Native+|+Trend+3:+Underlying+Restructure" alt="Three Major Trends" class="img-placeholder">
            <ol>
                <li><strong>From Minimalist to "Expressive" Sensory Return:</strong> After a decade of standardization making software lose its soul, emotional design has returned to the core. Systems now emphasize physical world metaphors and micro-interactions, such as spring-based physics, shape morphing, and translucent glass materials, enhancing user cognitive and emotional connections <span class="citation">[1-3]</span>.</li>
                <li><strong>AI Evolves from "Auxiliary Tool" to "Native Component":</strong> Design systems no longer just dictate button aesthetics; they govern how AI converses with humans. Leading systems natively integrate generative AI chat components, AI output labels, and dedicated Copilot UI toolkits <span class="citation">[4-6]</span>.</li>
                <li><strong>Radical Underlying Restructure:</strong> Bloated CSS-in-JS runtimes are being discarded in favor of pure CSS Variables and Design Tokens <span class="citation">[7, 8]</span>. Furthermore, to accommodate upcoming multi-hinge foldables and XR spatial computing, UI layouts are shifting from hardcoded breakpoints to "Window Size Classes" and 3D spatial flexbox architectures <span class="citation">[9-11]</span>.</li>
            </ol>
        </section>

        <section>
            <h2>Layer 2: Company Breakdown — 12 Systems in the Coordinate Grid</h2>
            
            <h3>Quadrant 1: Pioneers of Emotion & Senses (Top Right)</h3>
            <p>These systems break homogenization by emphasizing physical textures and strong emotional resonance.</p>
            <ul>
                <li><strong>1. Apple (Liquid Glass):</strong> Introduced in macOS Tahoe 26 and iOS 26, this "liquid glass" material features dynamic blur, light refraction, and 3D depth <span class="citation">[1, 12]</span>. Controls float above content, reacting to device movement with fluid, droplet-like animations <span class="citation">[1, 2]</span>.</li>
                <li><strong>2. Google (Material 3 Expressive):</strong> Based on 46 studies and 18,000+ participants, this update introduces spring physics, 35 new shapes, and larger interactive elements <span class="citation">[3, 13, 14]</span>. It boosts visual appeal and enables users to spot key actions up to 4x faster <span class="citation">[15]</span>.</li>
                <li><strong>3. Meta (Horizon OS Spatial UI):</strong> Built for XR and spatial computing, it uses an HTML/CSS-like <code>uikitml</code> markup language to bring Flexbox layouts into 3D space, supporting natural physical interactions <span class="citation">[11, 16]</span>.</li>
            </ul>

            <img src="https://placehold.co/800x300/f3f4f6/4b5563?text=Enterprise+%26+AI+Engines" alt="Enterprise AI Engines" class="img-placeholder">

            <h3>Quadrant 2: Engines of AI & R&D Efficiency (Top Left)</h3>
            <p>The backbone of modern enterprise applications, solving production synergy and AI integration.</p>
            <ul>
                <li><strong>4. ByteDance (Semi Design):</strong> Its core strength is Design to Code (D2C) and Code to Design (C2D) tech. Offering 3000+ Design Tokens, it allows one-click conversion from Figma to React/Vue code, bridging DesignOps and DevOps <span class="citation">[17, 18]</span>.</li>
                <li><strong>5. Ant Group (Ant Design 6.0 & Ant Design X):</strong> Upgraded to a pure CSS variables architecture with "zero-runtime" capabilities and semantic DOM transformation, dropping IE support entirely <span class="citation">[7, 19, 20]</span>. Its companion, Ant Design X, provides powerful rendering for AI-driven interfaces <span class="citation">[21]</span>.</li>
                <li><strong>6. Salesforce (Lightning Design System 2 - SLDS 2):</strong> Prioritizing CSS custom properties, it combines Pro-code control with No-code design <span class="citation">[8, 22]</span>. It includes "Agentic Patterns" tailored for generative AI experiences in CRM <span class="citation">[22]</span>.</li>
            </ul>

            <h3>Quadrant 3: Cross-Platform Consistency & E-commerce/Content Matrices (Bottom Left)</h3>
            <ul>
                <li><strong>7. Tencent (TDesign):</strong> A model for enterprise open source, maintaining highly consistent APIs across independent codebases for Vue, React, Miniprogram, and Flutter <span class="citation">[23, 24]</span>.</li>
                <li><strong>8. Shopify (Polaris):</strong> The benchmark for e-commerce. With 60+ specialized components (e.g., complex data tables), its Telescope Sketch/Figma plugin ensures seamless handoffs, reducing development time by up to 40% <span class="citation">[25-27]</span>.</li>
                <li><strong>9. IBM (Carbon Design System):</strong> Renowned for rigorous data visualization, IBM Plex typography, and a 2x Grid system, ensuring absolute accessibility for enterprise software <span class="citation">[28, 29]</span>.</li>
                <li><strong>10. Amazon (Cloudscape):</strong> Built for high data-density cloud products. It features "Compact" and "Comfortable" density modes and provides native patterns for generative AI chats and artifact previews <span class="citation">[30, 31]</span>.</li>
            </ul>

            <h3>Quadrant 4: Predictive & System-Level Integration (Spanning the Center)</h3>
            <ul>
                <li><strong>11. Airbnb (DLS):</strong> Uses AI to analyze user behavior, predict needs, and automatically optimize search layout presentations, utilizing AI as a foundational UX structuring tool <span class="citation">[32, 33]</span>.</li>
                <li><strong>12. Microsoft (Fluent 2):</strong> Pushing the "One Microsoft" vision across Web, iOS, Android, and Windows. It features specialized <em>Copilot UI Kits</em> to foster consistent AI experiences while maintaining cross-platform fluidity <span class="citation">[4, 34]</span>.</li>
            </ul>
        </section>

        <section>
            <h2>Layer 3: Practical Methods — What Should Your Team Change Tomorrow?</h2>
            <img src="https://placehold.co/800x300/f3f4f6/4b5563?text=5+Actionable+Directives+for+Design+Teams" alt="5 Actionable Directives" class="img-placeholder">
            <p>The best design system is not the most restrictive, but the most empowering. Here are 5 immediate action items for your team:</p>
            
            <ol>
                <li><span class="highlight">Directive 1: Execute a Core Restructure to Pure CSS Variables & Tokens.</span> Stop writing hardcoded hex colors and drop heavy CSS-in-JS runtimes. Establish semantic Design Tokens (like Ant Design 6.0 and Shopify Polaris) to easily implement dark mode, reduce tech debt, and facilitate multi-brand white-labeling <span class="citation">[7, 35, 36]</span>.</li>
                <li><span class="highlight">Directive 2: Introduce "AI Native" Agentic Patterns.</span> Don't just patch a chat bubble onto your UI. Formalize AI patterns: Generative AI chat templates, output trust labels, and user authorization mechanisms (referencing Cloudscape and Fluent 2) <span class="citation">[4-6]</span>.</li>
                <li><span class="highlight">Directive 3: Implement D2C (Design-to-Code) Workflows.</span> Integrate tools like Semi Design or Shopify Telescope. Map Figma parameters directly to React components to cut interface building time by over 40% and eliminate pixel deviations <span class="citation">[18, 26, 27]</span>.</li>
                <li><span class="highlight">Directive 4: Inject "Micro-emotions" into Key Interactions.</span> Borrow from Material 3 Expressive: focus on your "Hero moments". Add spring physics to primary buttons and introduce varied shape transitions to make navigation feel alive without violating accessibility standards <span class="citation">[3, 14]</span>.</li>
                <li><span class="highlight">Directive 5: Abandon Absolute Breakpoints for "Window Size Classes".</span> Prepare for the 2026 tri-fold device surge. Stop hardcoding mobile/desktop CSS media queries. Use Compact, Medium, and Expanded states, ensuring UI state continuity (using ViewModel) so users never lose their input when unfolding a device <span class="citation">[9, 10, 37]</span>.</li>
            </ol>
            
            <p><strong>Conclusion:</strong> Your team's goal for tomorrow is singular: <em>Trade tokens for consistency, trade D2C for time, and invest that freed-up time into sculpting AI experiences and emotional interactions.</em></p>
        </section>
    </div>`;

  return (
    <div className="w-full" style={{ backgroundColor: '#FAFAFA' }}>
      <section
        className="w-screen"
        style={{
          backgroundColor: '#FAFAFA',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          paddingTop: '120px',
          paddingBottom: '80px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div style={{ marginBottom: '48px' }}>
            <Link
              href="/"
              style={{
                ...fontStyle,
                fontSize: '16px',
                lineHeight: '24px',
                fontWeight: 400,
                color: 'rgb(0, 0, 0)',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              ← Back to Work
            </Link>
          </div>

          <h1
            style={{
              ...fontStyle,
              fontSize: '40px',
              lineHeight: '52px',
              fontWeight: 300,
              color: '#171616',
              marginBottom: '16px',
            }}
          >
            Design System
          </h1>

          <p
            style={{
              ...fontStyle,
              fontSize: '18px',
              lineHeight: '30px',
              fontWeight: 300,
              color: '#171616',
              maxWidth: '760px',
              marginBottom: '32px',
            }}
          >
            Decoding 12 leading design systems through a clear 3-layer framework: trends, company breakdown,
            and actionable methods.
          </p>

          <div
            style={{
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* 文章内容容器：使用少量本地样式，避免保留你提供的整段 CSS */}
            <div
              id="design-system-article"
              style={{
                padding: '48px 24px',
                color: '#1f2937',
              }}
            >
              <style>{`
                #design-system-article { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; }
                #design-system-article header { background: #2563eb; color: #ffffff; padding: 48px 20px; text-align: center; border-radius: 12px; }
                #design-system-article .container { max-width: 1000px; margin: 32px auto 0 auto; padding: 0 2rem; }
                #design-system-article section { background: #ffffff; padding: 40px 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 32px; }
                #design-system-article h2 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 0; font-size: 22px; }
                #design-system-article h3 { color: #111827; margin-top: 18px; font-size: 18px; }
                #design-system-article ul { padding-left: 1.5rem; }
                #design-system-article li { margin-bottom: 12px; }
                #design-system-article .img-placeholder { width: 100%; border-radius: 8px; margin: 24px 0; border: 1px solid #e5e7eb; display: block; }
                #design-system-article .hero-img { width: 100%; height: auto; border-radius: 12px; margin: -32px 0 32px 0; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); display: block; }
                #design-system-article .highlight { font-weight: bold; color: #2563eb; }
                #design-system-article .citation { color: #4b5563; font-size: 0.85em; vertical-align: super; }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

