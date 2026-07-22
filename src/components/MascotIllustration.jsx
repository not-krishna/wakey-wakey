import React from 'react';

/**
 * MascotIllustration Component
 * Renders Koa the Koala in different states:
 * - 'idle'     : Sleepy Koa hugging eucalyptus leaf
 * - 'watching' : Alert Koa holding map pin with perked ear
 * - 'waking'   : Waking-up Koa with arms up and motion lines
 * - 'happy'    : Waving/thumbs up Happy Koa
 * - 'error'    : Confused Koa scratching head
 * - 'badge'    : Circular green splash badge with Koa face
 */
export default function MascotIllustration({ state = 'idle', className = '', size = 180 }) {
  if (state === 'badge') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="80" cy="80" r="80" fill="#FFFFFF" />
        {/* Ears */}
        <circle cx="45" cy="55" r="24" fill="#9E9E9E" />
        <circle cx="115" cy="55" r="24" fill="#9E9E9E" />
        <circle cx="47" cy="57" r="15" fill="#E0E0E0" />
        <circle cx="113" cy="57" r="15" fill="#E0E0E0" />
        {/* Head */}
        <circle cx="80" cy="88" r="48" fill="#BDBDBD" />
        <ellipse cx="80" cy="95" rx="32" ry="28" fill="#EEEEEE" />
        {/* Nose */}
        <ellipse cx="80" cy="86" rx="11" ry="16" fill="#424242" />
        <ellipse cx="78" cy="80" rx="4" ry="6" fill="#616161" />
        {/* Closed Eyes */}
        <path d="M 54 84 Q 61 91 68 84" stroke="#333333" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 92 84 Q 99 91 106 84" stroke="#333333" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Cheeks */}
        <circle cx="52" cy="95" r="6" fill="#A5D6A7" opacity="0.7" />
        <circle cx="108" cy="95" r="6" fill="#A5D6A7" opacity="0.7" />
      </svg>
    );
  }

  if (state === 'watching') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Perked Ear Left, Normal Right */}
        <circle cx="50" cy="50" r="32" fill="#9E9E9E" />
        <circle cx="150" cy="70" r="28" fill="#9E9E9E" />
        <circle cx="52" cy="52" r="20" fill="#E0E0E0" />
        <circle cx="148" cy="72" r="17" fill="#E0E0E0" />

        {/* Head */}
        <circle cx="100" cy="110" r="58" fill="#BDBDBD" />
        <ellipse cx="100" cy="118" rx="40" ry="34" fill="#EEEEEE" />

        {/* Nose */}
        <ellipse cx="100" cy="108" rx="14" ry="20" fill="#424242" />
        <ellipse cx="97" cy="100" rx="5" ry="7" fill="#616161" />

        {/* One eye wide open (Left), one wink/semi open (Right) */}
        <circle cx="72" cy="102" r="7" fill="#333333" />
        <circle cx="70" cy="100" r="2" fill="#FFFFFF" />
        <path d="M 118 105 Q 126 112 134 105" stroke="#333333" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="65" cy="118" r="8" fill="#A5D6A7" opacity="0.7" />
        <circle cx="135" cy="118" r="8" fill="#A5D6A7" opacity="0.7" />

        {/* Body & Arms holding Map Pin */}
        <ellipse cx="100" cy="175" rx="46" ry="25" fill="#BDBDBD" />
        {/* Map Pin in hand */}
        <g transform="translate(130, 130)">
          <path
            d="M 12 0 C 5.37 0 0 5.37 0 12 C 0 21 12 32 12 32 C 12 32 24 21 24 12 C 24 5.37 18.63 0 12 0 Z"
            fill="#2E7D32"
          />
          <circle cx="12" cy="12" r="5" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  if (state === 'waking') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Motion lines overhead */}
        <path d="M 110 15 L 110 25" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M 70 25 L 78 33" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
        <path d="M 150 25 L 142 33" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

        {/* Ears */}
        <circle cx="50" cy="70" r="32" fill="#9E9E9E" />
        <circle cx="170" cy="70" r="32" fill="#9E9E9E" />
        <circle cx="52" cy="72" r="20" fill="#E0E0E0" />
        <circle cx="168" cy="72" r="20" fill="#E0E0E0" />

        {/* Head */}
        <circle cx="110" cy="120" r="58" fill="#BDBDBD" />
        <ellipse cx="110" cy="128" rx="40" ry="34" fill="#EEEEEE" />

        {/* Nose */}
        <ellipse cx="110" cy="118" rx="14" ry="20" fill="#424242" />

        {/* Both eyes WIDE open */}
        <circle cx="82" cy="110" r="9" fill="#333333" />
        <circle cx="80" cy="107" r="3" fill="#FFFFFF" />

        <circle cx="138" cy="110" r="9" fill="#333333" />
        <circle cx="136" cy="107" r="3" fill="#FFFFFF" />

        {/* Surprised mouth */}
        <ellipse cx="110" cy="138" rx="7" ry="10" fill="#E57373" />

        {/* Cheeks */}
        <circle cx="70" cy="125" r="9" fill="#FFCDD2" />
        <circle cx="150" cy="125" r="9" fill="#FFCDD2" />

        {/* Raised Arms */}
        <path d="M 52 145 C 35 125 30 100 42 95 C 50 92 60 105 65 125" fill="#BDBDBD" />
        <path d="M 168 145 C 185 125 190 100 178 95 C 170 92 160 105 155 125" fill="#BDBDBD" />
      </svg>
    );
  }

  if (state === 'happy') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Ears */}
        <circle cx="50" cy="65" r="30" fill="#9E9E9E" />
        <circle cx="150" cy="65" r="30" fill="#9E9E9E" />
        <circle cx="52" cy="67" r="18" fill="#E0E0E0" />
        <circle cx="148" cy="67" r="18" fill="#E0E0E0" />

        {/* Head */}
        <circle cx="100" cy="110" r="56" fill="#BDBDBD" />
        <ellipse cx="100" cy="118" rx="38" ry="32" fill="#EEEEEE" />

        {/* Nose */}
        <ellipse cx="100" cy="108" rx="13" ry="18" fill="#424242" />

        {/* Happy Curved Eyes ^ ^ */}
        <path d="M 72 104 Q 80 94 88 104" stroke="#333333" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 112 104 Q 120 94 128 104" stroke="#333333" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Big Smile */}
        <path d="M 85 125 Q 100 140 115 125" stroke="#333333" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="68" cy="118" r="8" fill="#A5D6A7" />
        <circle cx="132" cy="118" r="8" fill="#A5D6A7" />

        {/* Waving Arm (Right) */}
        <path d="M 145 135 Q 175 110 165 90 C 158 85 145 105 135 130" fill="#BDBDBD" />
        <circle cx="165" cy="88" r="7" fill="#BDBDBD" />
      </svg>
    );
  }

  if (state === 'error') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Ears */}
        <circle cx="50" cy="65" r="30" fill="#9E9E9E" />
        <circle cx="150" cy="65" r="30" fill="#9E9E9E" />
        <circle cx="52" cy="67" r="18" fill="#E0E0E0" />
        <circle cx="148" cy="67" r="18" fill="#E0E0E0" />

        {/* Head */}
        <circle cx="100" cy="110" r="56" fill="#BDBDBD" />
        <ellipse cx="100" cy="118" rx="38" ry="32" fill="#EEEEEE" />

        {/* Nose */}
        <ellipse cx="100" cy="108" rx="13" ry="18" fill="#424242" />

        {/* Confused Eyes (Spiral / Asymmetric) */}
        <circle cx="76" cy="102" r="6" fill="#333333" />
        <path d="M 115 98 L 131 108 M 131 98 L 115 108" stroke="#333333" strokeWidth="3.5" strokeLinecap="round" />

        {/* Wavy confused mouth */}
        <path d="M 86 132 Q 94 126 102 134 T 114 130" stroke="#333333" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Scratching Head Arm */}
        <path d="M 135 135 C 150 110 160 70 142 65 C 132 62 130 85 125 100" stroke="#BDBDBD" strokeWidth="12" strokeLinecap="round" fill="none" />

        {/* Question mark above */}
        <path d="M 70 30 C 70 20 85 20 85 30 C 85 38 77 40 77 48" stroke="#2E7D32" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="77" cy="56" r="3" fill="#2E7D32" />
      </svg>
    );
  }

  // Default: 'idle' Sleepy Koa
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-breathe ${className}`}
    >
      {/* Ears */}
      <circle cx="50" cy="65" r="30" fill="#9E9E9E" />
      <circle cx="150" cy="65" r="30" fill="#9E9E9E" />
      <circle cx="52" cy="67" r="18" fill="#E0E0E0" />
      <circle cx="148" cy="67" r="18" fill="#E0E0E0" />

      {/* Head */}
      <circle cx="100" cy="110" r="56" fill="#BDBDBD" />
      <ellipse cx="100" cy="118" rx="38" ry="32" fill="#EEEEEE" />

      {/* Nose */}
      <ellipse cx="100" cy="108" rx="13" ry="18" fill="#424242" />
      <ellipse cx="97" cy="102" rx="4" ry="6" fill="#616161" />

      {/* Sleeping Eyes (curved arches) */}
      <path d="M 70 104 Q 78 112 86 104" stroke="#333333" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M 114 104 Q 122 112 130 104" stroke="#333333" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="65" cy="118" r="7" fill="#A5D6A7" opacity="0.7" />
      <circle cx="135" cy="118" r="7" fill="#A5D6A7" opacity="0.7" />

      {/* Eucalyptus Leaf hugged in arms */}
      <path d="M 80 140 C 60 170 110 185 130 150 C 140 135 100 130 80 140 Z" fill="#66BB6A" />
      <path d="M 85 142 Q 105 155 125 152" stroke="#2E7D32" strokeWidth="2" fill="none" />

      {/* Paws holding leaf */}
      <ellipse cx="78" cy="142" rx="10" ry="8" fill="#BDBDBD" />
      <ellipse cx="122" cy="144" rx="10" ry="8" fill="#BDBDBD" />
    </svg>
  );
}
