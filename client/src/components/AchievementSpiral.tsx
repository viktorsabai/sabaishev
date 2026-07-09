import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { content } from "@/lib/content";

interface SpiralPoint {
  id: string;
  name: string;
  number: string;
  company: string;
  x: number;
  y: number;
  angle: number;
  radius: number;
  color: string;
}

// Company colors mapping
const COMPANY_COLORS: Record<string, string> = {
  "Company A": "#3B82F6", // blue
  "Company B": "#A855F7", // purple
  "Company C": "#EC4899", // pink
  "Company D": "#06B6D4", // cyan
};

export default function AchievementSpiral() {
  const { language } = useLanguage();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SpiralPoint | null>(null);

  // Get products from content
  const productModules = content[language].productModules;
  const products = productModules.products.slice(0, 12); // Take first 12 products

  // Generate spiral points
  const generateSpiralPoints = (): SpiralPoint[] => {
    const centerX = 300;
    const centerY = 300;
    const maxRadius = 240;
    const spiralTurns = 2.5; // Number of rotations

    return products.map((product: any, index: number) => {
      const t = index / (products.length - 1); // 0 to 1
      const angle = t * spiralTurns * Math.PI * 2; // Convert to radians
      const radius = (t * maxRadius) + 50; // Start from 50, go to maxRadius

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Assign company color (cycle through 4 companies)
      const companyIndex = index % 4;
      const companyNames = ["Company A", "Company B", "Company C", "Company D"];
      const company = companyNames[companyIndex];
      const color = COMPANY_COLORS[company];

      return {
        id: product.id,
        name: product.name,
        number: product.number,
        company,
        x,
        y,
        angle,
        radius,
        color,
      };
    });
  };

  const spiralPoints = generateSpiralPoints();
  const viewBoxSize = 600;
  const companies = ["Company A", "Company B", "Company C", "Company D"];

  return (
    <div className="w-full flex flex-col items-center gap-12">
      {/* Spiral SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-auto"
          style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.05))" }}
        >
          {/* Spiral guide line (optional, subtle) */}
          <defs>
            <path
              id="spiral"
              d={generateSpiralPath(300, 300, 40, 220, 2.5, 200)}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          </defs>

          {/* Spiral points (products) */}
          {spiralPoints.map((point, index) => (
            <motion.g
              key={point.id}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onMouseEnter={() => setHoveredProduct(point.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => setSelectedProduct(point)}
              style={{ cursor: "pointer" }}
            >
              {/* Glow circle on hover */}
              {hoveredProduct === point.id && (
                <motion.circle
                  cx={point.x}
                  cy={point.y}
                  r={28}
                  fill={point.color}
                  opacity={0.2}
                  animate={{ r: [28, 40] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}

              {/* Main point - larger */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r={hoveredProduct === point.id ? 13 : 11}
                fill={point.color}
                opacity={hoveredProduct === point.id ? 1 : 0.85}
                transition={{ duration: 0.2 }}
              />

              {/* Product number inside circle */}
              <motion.text
                x={point.x}
                y={point.y + 4}
                textAnchor="middle"
                className="text-[8px] font-bold"
                fill="rgba(0,0,0,0.8)"
                pointerEvents="none"
              >
                {index + 1}
              </motion.text>

              {/* Label on hover */}
              {hoveredProduct === point.id && (
                <motion.text
                  x={point.x}
                  y={point.y - 25}
                  textAnchor="middle"
                  className="text-xs font-semibold"
                  fill={point.color}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {point.name}
                </motion.text>
              )}
            </motion.g>
          ))}
        </svg>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4 md:gap-8 text-center"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-foreground">12</span>
          <span className="text-sm text-foreground-muted">Products</span>
        </div>
        <div className="w-px bg-border/30" />
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-foreground">4</span>
          <span className="text-sm text-foreground-muted">Companies</span>
        </div>
      </motion.div>

      {/* Selected product info */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-2xl p-6 bg-surface/50 backdrop-blur-sm border border-border/50 rounded-2xl"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-foreground-muted uppercase tracking-wide mb-1">
                {selectedProduct.number}
              </p>
              <h3 className="text-xl font-bold text-foreground">
                {selectedProduct.name}
              </h3>
            </div>
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-foreground-muted">
            Tap to see full details in Products section
          </p>
        </motion.div>
      )}

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-xs text-foreground-muted/50 text-center"
      >
        Hover or tap any point to see product details
      </motion.p>
    </div>
  );
}

// Helper function to generate spiral path
function generateSpiralPath(
  centerX: number,
  centerY: number,
  minRadius: number,
  maxRadius: number,
  turns: number,
  points: number
): string {
  let path = "";
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const angle = t * turns * Math.PI * 2;
    const radius = minRadius + (maxRadius - minRadius) * t;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    path += `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }
  return path;
}
