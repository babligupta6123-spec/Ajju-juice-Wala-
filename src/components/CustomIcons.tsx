import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * 1. OrangeSliceIcon:
 * Vibrant citrus wheel cross-section with layered rind, pith, pulp segments and center core.
 */
export const OrangeSliceIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <radialGradient id="orangeRind" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stopColor="#FF7A00" />
        <stop offset="95%" stopColor="#E65100" />
        <stop offset="100%" stopColor="#C43E00" />
      </radialGradient>
      <linearGradient id="pulpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFA726" />
        <stop offset="100%" stopColor="#FF6D00" />
      </linearGradient>
    </defs>
    {/* Outer peel */}
    <circle cx="16" cy="16" r="14.5" fill="url(#orangeRind)" stroke="#C43E00" strokeWidth="0.8" />
    {/* Inner pith (white membrane) */}
    <circle cx="16" cy="16" r="12" fill="#FFF8E1" />
    {/* Pulp Segments (8 symmetric wedges) */}
    <path
      d="M16 16 L16 5.5 A10.5 10.5 0 0 1 23.4 8.6 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    <path
      d="M16 16 L23.4 8.6 A10.5 10.5 0 0 1 26.5 16 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    <path
      d="M16 16 L26.5 16 A10.5 10.5 0 0 1 23.4 23.4 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    <path
      d="M16 16 L23.4 23.4 A10.5 10.5 0 0 1 16 26.5 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    <path
      d="M16 16 L16 26.5 A10.5 10.5 0 0 1 8.6 23.4 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    <path
      d="M16 16 L8.6 23.4 A10.5 10.5 0 0 1 5.5 16 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    <path
      d="M16 16 L5.5 16 A10.5 10.5 0 0 1 8.6 8.6 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    <path
      d="M16 16 L8.6 8.6 A10.5 10.5 0 0 1 16 5.5 Z"
      fill="url(#pulpGrad)"
      stroke="#FFE082"
      strokeWidth="0.6"
    />
    {/* Center Core */}
    <circle cx="16" cy="16" r="2.2" fill="#FFF9C4" stroke="#FFE082" strokeWidth="0.5" />
    <circle cx="16" cy="16" r="0.8" fill="#FF8F00" />
  </svg>
);

/**
 * 2. MangoIcon:
 * Alphonso mango shape with warm golden gradient and fresh green stem leaf.
 */
export const MangoIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="mangoBody" x1="20%" y1="10%" x2="80%" y2="90%">
        <stop offset="0%" stopColor="#FFD54F" />
        <stop offset="45%" stopColor="#FFA000" />
        <stop offset="85%" stopColor="#FF6F00" />
        <stop offset="100%" stopColor="#E65100" />
      </linearGradient>
      <linearGradient id="mangoLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#66BB6A" />
        <stop offset="100%" stopColor="#2E7D32" />
      </linearGradient>
    </defs>
    {/* Stem */}
    <path d="M16 8 C16 4 17.5 3 19 2.5" stroke="#5D4037" strokeWidth="1.8" strokeLinecap="round" />
    {/* Leaf */}
    <path
      d="M17.5 4 C23 3 26 7 24 10 C20 11 18 7 17.5 4 Z"
      fill="url(#mangoLeaf)"
      stroke="#1B5E20"
      strokeWidth="0.6"
    />
    <path d="M18 5 C21 6.5 22.5 8 23.5 9" stroke="#A5D6A7" strokeWidth="0.6" strokeLinecap="round" />
    {/* Mango Body */}
    <path
      d="M16 7 C21 7 25 11 25.5 17 C26 23.5 20 28.5 15 28.5 C9.5 28.5 6 23.5 6.5 18 C7 11 11.5 7 16 7 Z"
      fill="url(#mangoBody)"
      stroke="#D84315"
      strokeWidth="0.8"
    />
    {/* Highlight shine */}
    <path
      d="M10 14 C10 10.5 12.5 9 15 9"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.55"
    />
  </svg>
);

/**
 * 3. WatermelonSliceIcon:
 * Crispy triangular wedge with bright crimson center, dark teardrop seeds, and green rind.
 */
export const WatermelonSliceIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="wmFlesh" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF5252" />
        <stop offset="100%" stopColor="#D50000" />
      </linearGradient>
    </defs>
    {/* Outer Green Rind */}
    <path
      d="M3 13 C9 26 23 26 29 13 C23 28 9 28 3 13 Z"
      fill="#2E7D32"
      stroke="#1B5E20"
      strokeWidth="0.8"
    />
    {/* Pale Pith Layer */}
    <path
      d="M4.5 13 C9.8 24.5 22.2 24.5 27.5 13 C22.5 26.5 9.5 26.5 4.5 13 Z"
      fill="#DCEDC8"
    />
    {/* Red Flesh */}
    <path
      d="M5.5 13 C10.5 23.5 21.5 23.5 26.5 13 Z"
      fill="url(#wmFlesh)"
      stroke="#B71C1C"
      strokeWidth="0.5"
    />
    {/* Black Teardrop Seeds */}
    <circle cx="11" cy="16" r="0.9" fill="#212121" />
    <circle cx="16" cy="18" r="0.9" fill="#212121" />
    <circle cx="21" cy="16" r="0.9" fill="#212121" />
    <circle cx="13.5" cy="19.5" r="0.8" fill="#212121" />
    <circle cx="18.5" cy="19.5" r="0.8" fill="#212121" />
  </svg>
);

/**
 * 4. StrawberryIcon:
 * Heart-shaped strawberry with fine golden seeds and leafy calyx.
 */
export const StrawberryIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="berryBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF1744" />
        <stop offset="70%" stopColor="#D50000" />
        <stop offset="100%" stopColor="#880E4F" />
      </linearGradient>
    </defs>
    {/* Berry Silhouette */}
    <path
      d="M16 28 C12 25 7 19.5 7 13.5 C7 9 10 7 14 7.5 C15.2 7.7 16 8.5 16 8.5 C16 8.5 16.8 7.7 18 7.5 C22 7 25 9 25 13.5 C25 19.5 20 25 16 28 Z"
      fill="url(#berryBody)"
      stroke="#880E4F"
      strokeWidth="0.8"
    />
    {/* Seed specks */}
    <circle cx="12" cy="12" r="0.6" fill="#FFF176" />
    <circle cx="16" cy="12" r="0.6" fill="#FFF176" />
    <circle cx="20" cy="12" r="0.6" fill="#FFF176" />
    <circle cx="10" cy="16" r="0.6" fill="#FFF176" />
    <circle cx="14" cy="16" r="0.6" fill="#FFF176" />
    <circle cx="18" cy="16" r="0.6" fill="#FFF176" />
    <circle cx="22" cy="16" r="0.6" fill="#FFF176" />
    <circle cx="12" cy="20" r="0.6" fill="#FFF176" />
    <circle cx="16" cy="20" r="0.6" fill="#FFF176" />
    <circle cx="20" cy="20" r="0.6" fill="#FFF176" />
    <circle cx="14" cy="24" r="0.5" fill="#FFF176" />
    <circle cx="18" cy="24" r="0.5" fill="#FFF176" />
    {/* Calyx Leaves */}
    <path
      d="M16 9 L13 4 L14.5 7.5 L10 6 L13 8.5 L9 10.5 L14 10 L16 8.5 L18 10 L23 10.5 L19 8.5 L22 6 L17.5 7.5 L19 4 Z"
      fill="#43A047"
      stroke="#1B5E20"
      strokeWidth="0.5"
    />
    {/* Stem */}
    <path d="M16 6 C15.5 3.5 17 2 18 1.5" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * 5. PineappleIcon:
 * Golden tropical pineapple with diamond grid texture and frond crown.
 */
export const PineappleIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="pineBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFEE58" />
        <stop offset="50%" stopColor="#FDD835" />
        <stop offset="100%" stopColor="#F57F17" />
      </linearGradient>
    </defs>
    {/* Crown leaves */}
    <path d="M16 11 L16 2 C15 5 13 8 13 11 Z" fill="#2E7D32" />
    <path d="M16 11 L20 4 C18.5 6.5 17.5 9 16.5 11 Z" fill="#43A047" />
    <path d="M16 11 L12 4 C13.5 6.5 14.5 9 15.5 11 Z" fill="#388E3C" />
    <path d="M16 11 L23 7 C20.5 9 18 10.5 16.5 11.5 Z" fill="#66BB6A" />
    <path d="M16 11 L9 7 C11.5 9 14 10.5 15.5 11.5 Z" fill="#43A047" />
    {/* Pineapple Body */}
    <ellipse cx="16" cy="20" rx="8" ry="9.5" fill="url(#pineBody)" stroke="#E65100" strokeWidth="0.8" />
    {/* Diamond hatch pattern */}
    <path
      d="M10 16 L22 24 M9 20 L20 28 M14 12 L23 18 M22 16 L10 24 M23 20 L12 28 M18 12 L9 18"
      stroke="#E65100"
      strokeWidth="0.75"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);

/**
 * 6. JuiceGlassIcon:
 * Elegant curved glass with gradient cold-pressed juice, ice cubes, and striped eco straw.
 */
export const JuiceGlassIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="juiceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFA726" />
        <stop offset="100%" stopColor="#F57C00" />
      </linearGradient>
    </defs>
    {/* Straw */}
    <path d="M18 13 L24 2" stroke="#FF5252" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M19 11 L23 3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
    {/* Glass Rim */}
    <ellipse cx="16" cy="8" rx="7.5" ry="2.2" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="0.8" />
    {/* Juice Fluid */}
    <path
      d="M9.5 12 L10.8 24.5 C11 26 12 27 13.5 27 L18.5 27 C20 27 21 26 21.2 24.5 L22.5 12 Z"
      fill="url(#juiceGrad)"
    />
    {/* Floating Ice Cubes */}
    <rect x="12" y="13" width="3.5" height="3.5" rx="0.8" fill="white" fillOpacity="0.7" transform="rotate(15 12 13)" />
    <rect x="16" y="15" width="3" height="3" rx="0.6" fill="white" fillOpacity="0.7" transform="rotate(-10 16 15)" />
    {/* Glass Body Outlines */}
    <path
      d="M8.5 8 L10.5 25 C10.8 27.5 12 28.5 14 28.5 L18 28.5 C20 28.5 21.2 27.5 21.5 25 L23.5 8"
      stroke="#78909C"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Glass shine */}
    <path d="M11 11 L12 24" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
  </svg>
);

/**
 * 7. MintLeafIcon:
 * Organic spearmint leaf with central vein, serrated contour, and morning dew shine.
 */
export const MintLeafIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="mintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    {/* Main leaf */}
    <path
      d="M16 28 C9 25 5 18 6 11 C11 11 19 13 25 6 C26 13 24 22 16 28 Z"
      fill="url(#mintGrad)"
      stroke="#14532D"
      strokeWidth="0.8"
    />
    {/* Central Stem Vein */}
    <path d="M16 27 C15 20 18 14 23 8" stroke="#BBF7D0" strokeWidth="1.2" strokeLinecap="round" />
    {/* Side Veins */}
    <path d="M16 21 C13.5 20 11 20 9 20" stroke="#BBF7D0" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <path d="M17 17 C14 16 12 15 10 14" stroke="#BBF7D0" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <path d="M18 13 C20 14 22 15 24 16" stroke="#BBF7D0" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    {/* Dewdrop */}
    <circle cx="12" cy="18" r="1.3" fill="white" opacity="0.7" />
  </svg>
);

/**
 * 8. BlenderIcon:
 * High-speed cold-press juice bar blender pitcher with vortex blade.
 */
export const BlenderIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Pitcher Lid & Handle */}
    <rect x="10" y="4" width="12" height="2.5" rx="1.2" fill="#374151" />
    <circle cx="16" cy="3.5" r="1.5" fill="#1F2937" />
    <path d="M21 9 H25 C26 9 26.5 10 26 12 L24.5 19 C24 20 23 20.5 22 20.5 H20" stroke="#374151" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    {/* Jar Glass */}
    <path d="M11 6.5 L12.5 22.5 H19.5 L21 6.5 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" fillOpacity="0.7" />
    {/* Swirling Juice Blend inside */}
    <path d="M11.8 13 C14 14.5 18 12 20.2 13.5 L19.5 22.5 H12.5 Z" fill="#FB923C" />
    {/* Blade swirl */}
    <ellipse cx="16" cy="21.5" rx="3.5" ry="0.8" fill="#475569" />
    {/* Motor Base */}
    <path d="M10 23 H22 L23 29 H9 Z" fill="#1E293B" rx="1" />
    <circle cx="16" cy="26" r="1.2" fill="#F97316" />
  </svg>
);

/**
 * 9. ColdPressDropIcon:
 * Nutrient-rich cold press droplet with golden glow and vitality leaf.
 */
export const ColdPressDropIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="dropGrad" x1="20%" y1="10%" x2="80%" y2="90%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="60%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    {/* Droplet */}
    <path
      d="M16 3 C16 3 24 13 24 19 C24 23.5 20.5 27 16 27 C11.5 27 8 23.5 8 19 C8 13 16 3 16 3 Z"
      fill="url(#dropGrad)"
      stroke="#C2410C"
      strokeWidth="0.8"
    />
    {/* Droplet Reflection */}
    <path
      d="M13 13 C11 16 11 19 12 21"
      stroke="white"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.65"
    />
    {/* Little Micro Leaf */}
    <path
      d="M21 7 C24 6 26 9 24 11 C22 11 21 8.5 21 7 Z"
      fill="#22C55E"
      stroke="#15803D"
      strokeWidth="0.5"
    />
  </svg>
);

/**
 * 10. IceCubeIcon:
 * Crisp faceted 3D ice cube with chilled crystalline reflections.
 */
export const IceCubeIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Top Face */}
    <polygon points="16,5 25,10 16,15 7,10" fill="#E0F7FA" stroke="#80DEEA" strokeWidth="0.8" />
    {/* Left Face */}
    <polygon points="7,10 16,15 16,26 7,21" fill="#B2EBF2" stroke="#4DD0E1" strokeWidth="0.8" />
    {/* Right Face */}
    <polygon points="16,15 25,10 25,21 16,26" fill="#80DEEA" stroke="#26C6DA" strokeWidth="0.8" />
    {/* Glint highlights */}
    <line x1="10" y1="12" x2="14" y2="14" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    <circle cx="19" cy="18" r="0.8" fill="white" opacity="0.9" />
  </svg>
);

/**
 * 11. DeliveryScooterIcon:
 * Juice delivery bike with carrier box.
 */
export const DeliveryScooterIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    {/* Wheels */}
    <circle cx="8" cy="24" r="4" fill="#374151" stroke="#1F2937" strokeWidth="1" />
    <circle cx="8" cy="24" r="1.5" fill="#9CA3AF" />
    <circle cx="24" cy="24" r="4" fill="#374151" stroke="#1F2937" strokeWidth="1" />
    <circle cx="24" cy="24" r="1.5" fill="#9CA3AF" />
    {/* Chassis */}
    <path d="M8 24 L13 24 L16 18 L21 18 L24 24" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    {/* Delivery Fresh Box */}
    <rect x="5" y="11" width="7" height="7" rx="1.5" fill="#FF7A00" stroke="#C2410C" strokeWidth="0.8" />
    <path d="M7 14.5 H10" stroke="white" strokeWidth="1" strokeLinecap="round" />
    {/* Handlebars */}
    <path d="M21 18 L23 10 H20" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    {/* Headlight beam */}
    <circle cx="24.5" cy="12" r="1" fill="#FACC15" />
  </svg>
);

/**
 * 12. AjjuShopBadgeIcon:
 * Artisanal seal badge for "Ajju juice Wala".
 */
export const AjjuShopBadgeIcon: React.FC<IconProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    aria-hidden="true"
    {...props}
  >
    <defs>
      <linearGradient id="ajjuBadge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7A00" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    {/* Scalloped badge base */}
    <circle cx="16" cy="16" r="14" fill="url(#ajjuBadge)" />
    <circle cx="16" cy="16" r="11.5" fill="#0A2616" stroke="#FEF08A" strokeWidth="0.8" />
    {/* Juice glass miniature inside badge */}
    <path d="M12.5 12 L13.5 21 C13.7 22 14.3 22.5 15.2 22.5 H16.8 C17.7 22.5 18.3 22 18.5 21 L19.5 12 Z" fill="#FB923C" />
    <path d="M15.5 15 L18 8" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="16" cy="16" r="1" fill="#FEF08A" />
  </svg>
);
