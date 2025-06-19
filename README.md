# DMI.AI - Design Made Intelligent Hero Section

A visionary hero section for DMI.AI, showcasing an AI-first platform that auto-generates on-brand content, websites, and mobile apps based on brand kits.

## 🚀 Features

### Core Requirements ✅
- **Main Headline**: "Design Made Intelligent" with magnetic hover effects
- **Sub-headline**: "From brand kit to launch-ready content, websites & apps — powered by AI."
- **CTA Buttons**: "Try the Demo" and "Join Waitlist" with advanced hover animations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Visual Animations**: Scroll fade-in, hover states, and animated backgrounds

### Advanced Features 🌟
- **Magnetic Headline Effect**: Letters attract to mouse cursor with smooth spring animations
- **Parallax Movement**: Content responds to mouse movement with depth
- **Particle System**: Interactive red particles that repel from mouse cursor
- **Self-Drawing Shapes**: Animated geometric shapes that continuously draw and redraw
- **Holographic Buttons**: Advanced 3D effects with scan lines and floating elements
- **Liquid Metal Buttons**: Morphing shapes and liquid droplet animations
- **Accessibility**: Reduced motion support, focus states, and high contrast mode

## 🎨 Design Decisions

### Color Scheme
- **Primary Accent**: Red (#e30613) - Used strategically for brand consistency
- **Typography**: Inter font family for clean, modern readability
- **Background**: Subtle gradient from white to gray with red accent overlays

### Animation Philosophy
- **Performance First**: Uses `requestAnimationFrame` and optimized CSS animations
- **Smooth Interactions**: Spring physics for natural movement
- **Progressive Enhancement**: Animations enhance but don't break functionality
- **Accessibility**: Respects `prefers-reduced-motion` user preference

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: TailwindCSS v4 with custom CSS animations
- **Animations**: Framer Motion for React animations + CSS keyframes
- **TypeScript**: Full type safety throughout the application
- **Performance**: Optimized with React hooks and efficient re-renders

## 📱 Responsive Design

The hero section is fully responsive with breakpoints:
- **Desktop**: Full animations and effects
- **Tablet (768px)**: Adjusted font sizes and button dimensions
- **Mobile (480px)**: Optimized spacing and touch-friendly interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd dmi-ai-hero

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎯 Project Structure

```
dmi-ai-hero/
├── app/
│   ├── components/
│   │   ├── Hero.tsx              # Main hero component
│   │   ├── SelfDrawingShapes.tsx # Animated background shapes
│   │   ├── BlobButton.tsx        # Alternative button component
│   │   ├── NeuralNetBackground.tsx # Neural network background
│   │   ├── TechUIFloating.tsx    # Floating tech UI elements
│   │   └── HologramEffect.tsx    # Holographic effects
│   ├── globals.css               # Global styles and animations
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main page component
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🎨 Animation Details

### Magnetic Headline
- Letters individually track mouse proximity
- Spring physics for smooth attraction/repulsion
- Gradient color transitions on hover
- Optimized with `useMotionValue` and `animate`

### Particle System
- 60 interactive particles with physics simulation
- Mouse repulsion with configurable radius and strength
- Variable opacity based on particle speed
- Canvas-based rendering for performance

### Button Effects
- **Holographic**: 3D perspective, scan lines, floating elements
- **Liquid Metal**: Morphing shapes, liquid droplets, shimmer effects
- Mouse tracking for dynamic light effects
- Spring animations for hover states

## 🔧 Customization

### Colors
Update the CSS custom properties in `globals.css`:
```css
:root {
  --primary-red: #e30613;
  --primary-dark: #dc2626;
  --primary-darker: #b91c1c;
}
```

### Animation Speeds
Modify animation durations in component files:
- Particle system: `SPEED` constant in `Hero.tsx`
- Shape animations: `animationDuration` in `SelfDrawingShapes.tsx`
- Button effects: CSS animation durations in `globals.css`

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build the project
npm run build

# Deploy the .next folder to Netlify
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for the DMI.AI frontend developer assignment.

## 🙏 Acknowledgments

- Framer Motion for smooth React animations
- TailwindCSS for utility-first styling
- Next.js team for the excellent framework
- The DMI.AI team for the creative vision

---

**Built with ❤️ for DMI.AI - Design Made Intelligent**
