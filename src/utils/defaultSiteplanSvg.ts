// Architectural vector representation of the 70-unit residential masterplan
// Converted to high-definition JPEG on initialization for the default fullscreen map

export const DEFAULT_SITEPLAN_SVG = `<svg viewBox="0 0 1000 1780" width="1000" height="1780" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="paddyPattern" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="#588e3e" />
      <path d="M 0,20 Q 30,15 60,20 M 0,40 Q 30,35 60,40" stroke="#4c7c34" stroke-width="1.2" opacity="0.6" />
      <circle cx="15" cy="15" r="3" fill="#6ba84c" opacity="0.8" />
      <circle cx="45" cy="45" r="4" fill="#6ba84c" opacity="0.8" />
    </pattern>

    <linearGradient id="riverWater" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- 1. BACKGROUND RUMPUT & PERSAWAHAN SEKITAR -->
  <rect width="1000" height="1780" fill="url(#paddyPattern)" />

  <rect x="740" y="20" width="220" height="140" fill="#75a855" stroke="#4c7c34" stroke-width="2" opacity="0.7" />
  <rect x="760" y="180" width="200" height="120" fill="#689a49" stroke="#4c7c34" stroke-width="2" opacity="0.7" />
  <rect x="40" y="1420" width="180" height="160" fill="#689a49" stroke="#4c7c34" stroke-width="2" opacity="0.6" />
  <rect x="240" y="1400" width="200" height="180" fill="#75a855" stroke="#4c7c34" stroke-width="2" opacity="0.6" />

  <!-- 2. SUNGAI BIRU DI SISI KANAN & BAWAH KAWASAN -->
  <path
    d="M 940,0 Q 990,200 950,420 T 910,750 T 880,1050 T 820,1320 Q 750,1430 520,1410 Q 320,1390 100,1350 L 0,1350 L 0,1400 Q 300,1440 540,1450 Q 820,1470 910,1330 Q 980,1080 990,750 Q 1020,400 970,0 Z"
    fill="url(#riverWater)"
    filter="url(#softShadow)"
  />
  <path
    d="M 960,100 Q 980,300 935,500 T 895,850 T 850,1150 Q 790,1360 520,1380 Q 300,1360 80,1330"
    stroke="#bae6fd"
    stroke-width="3"
    stroke-dasharray="16 8"
    fill="none"
    opacity="0.7"
  />

  <!-- 3. KOMPAS MATA ANGIN DI SUDUT KIRI ATAS -->
  <g transform="translate(110, 110)">
    <circle cx="0" cy="0" r="48" fill="#1b4d1b" stroke="#ffffff" stroke-width="3" filter="url(#softShadow)" />
    <circle cx="0" cy="0" r="42" fill="#2d6e2e" stroke="#86efac" stroke-width="1" stroke-dasharray="3 3" />
    <polygon points="0,-36 7,-8 0,-2 -7,-8" fill="#ef4444" stroke="#ffffff" stroke-width="1" />
    <polygon points="0,36 7,8 0,2 -7,8" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
    <polygon points="-36,0 -8,-7 -2,0 -8,7" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
    <polygon points="36,0 8,-7 2,0 8,7" fill="#ffffff" stroke="#94a3b8" stroke-width="1" />
    <circle cx="0" cy="0" r="4" fill="#fbbf24" stroke="#ffffff" stroke-width="1" />
    <text x="0" y="-40" text-anchor="middle" fill="#ffffff" font-size="13" font-weight="900">U</text>
    <text x="0" y="47" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">S</text>
    <text x="45" y="4" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">T</text>
    <text x="-45" y="4" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold">B</text>
  </g>

  <!-- 4. JARINGAN JALAN UTAMA & JALAN LINGKUNGAN -->
  <polygon
    points="40,1650 180,1650 360,1180 260,1180"
    fill="#334155"
    stroke="#ffffff"
    stroke-width="2"
  />
  <g transform="rotate(-65, 180, 1420)">
    <rect x="90" y="1405" width="180" height="26" rx="4" fill="#0f172a" opacity="0.85" />
    <text x="180" y="1423" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="900" letter-spacing="2">
      JL. SECAWAN
    </text>
  </g>

  <!-- Jalan Lingkungan Blok A -->
  <polygon
    points="260,350 960,530 945,475 250,295"
    fill="#475569"
    stroke="#ffffff"
    stroke-width="1.5"
  />
  <text x="600" y="420" transform="rotate(15, 600, 420)" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold" letter-spacing="1">
    JALAN LINGKUNGAN 5.50 M
  </text>

  <!-- Jalan Lingkungan Blok B & C -->
  <polygon
    points="220,670 870,840 855,785 210,615"
    fill="#475569"
    stroke="#ffffff"
    stroke-width="1.5"
  />
  <text x="540" y="735" transform="rotate(15, 540, 735)" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold" letter-spacing="1">
    JALAN LINGKUNGAN 5.50 M
  </text>

  <!-- Jalan Lingkungan Blok C & D -->
  <polygon
    points="180,980 780,1135 765,1080 170,925"
    fill="#475569"
    stroke="#ffffff"
    stroke-width="1.5"
  />
  <text x="470" y="1035" transform="rotate(15, 470, 1035)" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="bold" letter-spacing="1">
    JALAN LINGKUNGAN 5.50 M
  </text>

  <!-- ================= BLOK A ================= -->
  <g id="blokA-render">
    <circle cx="610" cy="270" r="18" fill="#ffffff" stroke="#b91c1c" stroke-width="3" filter="url(#softShadow)" />
    <text x="610" y="277" text-anchor="middle" fill="#b91c1c" font-size="20" font-weight="900">A</text>

    <!-- Lots A.01 to A.12 -->
    <g transform="rotate(15, 332, 279)"><rect x="310" y="254" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="332" cy="279" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="332" y="283" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.01</text></g>
    <g transform="rotate(15, 382, 302)"><rect x="360" y="277" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="382" cy="302" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="382" y="306" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.02</text></g>
    <g transform="rotate(15, 432, 325)"><rect x="410" y="300" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="432" cy="325" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="432" y="329" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.03</text></g>
    <g transform="rotate(15, 482, 348)"><rect x="460" y="323" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="482" cy="348" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="482" y="352" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.04</text></g>
    <g transform="rotate(15, 532, 371)"><rect x="510" y="346" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="532" cy="371" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="532" y="375" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.05</text></g>
    <g transform="rotate(15, 582, 394)"><rect x="560" y="369" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="582" cy="394" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="582" y="398" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.06</text></g>
    <g transform="rotate(15, 632, 417)"><rect x="610" y="392" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="632" cy="417" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="632" y="421" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.07</text></g>
    <g transform="rotate(15, 680, 440)"><rect x="658" y="415" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="680" cy="440" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="680" y="444" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.08</text></g>
    <g transform="rotate(15, 728, 463)"><rect x="706" y="438" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="728" cy="463" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="728" y="467" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.09</text></g>
    <g transform="rotate(15, 778, 486)"><rect x="756" y="461" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="778" cy="486" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="778" y="490" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.10</text></g>
    <g transform="rotate(15, 826, 509)"><rect x="804" y="484" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="826" cy="509" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="826" y="513" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.11</text></g>
    <g transform="rotate(15, 874, 532)"><rect x="852" y="507" width="44" height="48" rx="2" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" /><circle cx="874" cy="532" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" /><text x="874" y="536" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.12</text></g>

    <!-- A.13 Hook -->
    <g transform="rotate(15, 922, 555)">
      <rect x="900" y="525" width="46" height="52" rx="2" fill="#f87171" stroke="#991b1b" stroke-width="1.5" />
      <circle cx="922" cy="555" r="11" fill="#b91c1c" stroke="#ffffff" stroke-width="1" />
      <text x="922" y="559" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">A.13</text>
      <text x="922" y="572" text-anchor="middle" fill="#7f1d1d" font-size="7" font-weight="bold">TRS3P 77m²</text>
    </g>
  </g>

  <!-- ================= BLOK B ================= -->
  <g id="blokB-render">
    <circle cx="560" cy="520" r="18" fill="#ffffff" stroke="#c2410c" stroke-width="3" filter="url(#softShadow)" />
    <text x="560" y="527" text-anchor="middle" fill="#c2410c" font-size="20" font-weight="900">B</text>

    <!-- B.01 - B.03 -->
    <g transform="rotate(15, 310, 505)"><rect x="288" y="487" width="44" height="40" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="310" cy="507" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="310" y="511" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.03</text></g>
    <g transform="rotate(15, 290, 550)"><rect x="268" y="532" width="44" height="40" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="290" cy="552" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="290" y="556" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.02</text></g>
    <g transform="rotate(15, 270, 595)"><rect x="248" y="577" width="44" height="40" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="270" cy="597" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="270" y="601" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.01</text></g>

    <!-- Baris Atas B.04 - B.12 -->
    <g transform="rotate(15, 375, 535)"><rect x="353" y="515" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="375" cy="536" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="375" y="540" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.04</text></g>
    <g transform="rotate(15, 430, 560)"><rect x="408" y="540" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="430" cy="561" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="430" y="565" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.05</text></g>
    <g transform="rotate(15, 485, 585)"><rect x="463" y="565" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="485" cy="586" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="485" y="590" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.06</text></g>
    <g transform="rotate(15, 540, 610)"><rect x="518" y="590" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="540" cy="611" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="540" y="615" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.07</text></g>
    <g transform="rotate(15, 595, 635)"><rect x="573" y="615" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="595" cy="636" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="595" y="640" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.08</text></g>
    <g transform="rotate(15, 650, 660)"><rect x="628" y="640" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="650" cy="661" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="650" y="665" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.09</text></g>
    <g transform="rotate(15, 705, 685)"><rect x="683" y="665" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="705" cy="686" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="705" y="690" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.10</text></g>
    <g transform="rotate(15, 760, 710)"><rect x="738" y="690" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="760" cy="711" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="760" y="715" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.11</text></g>
    <g transform="rotate(15, 815, 735)"><rect x="793" y="715" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="815" cy="736" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="815" y="740" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.12</text></g>

    <!-- Baris Bawah B.21 - B.13 -->
    <g transform="rotate(15, 350, 620)"><rect x="328" y="600" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="350" cy="621" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="350" y="625" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.21</text></g>
    <g transform="rotate(15, 405, 645)"><rect x="383" y="625" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="405" cy="646" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="405" y="650" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.20</text></g>
    <g transform="rotate(15, 460, 670)"><rect x="438" y="650" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="460" cy="671" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="460" y="675" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.19</text></g>
    <g transform="rotate(15, 515, 695)"><rect x="493" y="675" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="515" cy="696" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="515" y="700" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.18</text></g>
    <g transform="rotate(15, 570, 720)"><rect x="548" y="700" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="570" cy="721" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="570" y="725" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.17</text></g>
    <g transform="rotate(15, 625, 745)"><rect x="603" y="725" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="625" cy="746" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="625" y="750" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.16</text></g>
    <g transform="rotate(15, 680, 770)"><rect x="658" y="750" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="680" cy="771" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="680" y="775" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.15</text></g>
    <g transform="rotate(15, 735, 795)"><rect x="713" y="775" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="735" cy="796" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="735" y="800" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.14</text></g>
    <g transform="rotate(15, 790, 820)"><rect x="768" y="800" width="44" height="42" rx="2" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" /><circle cx="790" cy="821" r="11" fill="#d97706" stroke="#ffffff" stroke-width="1" /><text x="790" y="825" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">B.13</text></g>

    <!-- IPAL 94 m² -->
    <g transform="rotate(15, 865, 780)">
      <rect x="840" y="765" width="48" height="45" fill="#15803d" stroke="#86efac" stroke-width="1.5" rx="3" />
      <text x="864" y="785" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="bold">IPAL</text>
      <text x="864" y="798" text-anchor="middle" fill="#86efac" font-size="9" font-weight="bold">94 m²</text>
    </g>
  </g>

  <!-- ================= BLOK C ================= -->
  <g id="blokC-render">
    <circle cx="530" cy="800" r="18" fill="#ffffff" stroke="#15803d" stroke-width="3" filter="url(#softShadow)" />
    <text x="530" y="807" text-anchor="middle" fill="#15803d" font-size="20" font-weight="900">C</text>

    <!-- Sarana Pengayaan 18 m² -->
    <g transform="rotate(15, 205, 785)">
      <rect x="180" y="765" width="50" height="46" fill="#334155" stroke="#94a3b8" stroke-width="1.5" rx="3" />
      <text x="205" y="783" text-anchor="middle" fill="#ffffff" font-size="8" font-weight="bold">SARANA</text>
      <text x="205" y="794" text-anchor="middle" fill="#ffffff" font-size="7">PENGAYAAN</text>
      <text x="205" y="805" text-anchor="middle" fill="#38bdf8" font-size="8" font-weight="bold">18 m²</text>
    </g>

    <!-- Baris Atas C.01 - C.10 -->
    <g transform="rotate(15, 275, 790)"><rect x="253" y="770" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="275" cy="791" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="275" y="795" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.01</text></g>
    <g transform="rotate(15, 330, 815)"><rect x="308" y="795" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="330" cy="816" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="330" y="820" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.02</text></g>
    <g transform="rotate(15, 385, 840)"><rect x="363" y="820" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="385" cy="841" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="385" y="845" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.03</text></g>
    <g transform="rotate(15, 440, 865)"><rect x="418" y="845" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="440" cy="866" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="440" y="870" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.04</text></g>
    <g transform="rotate(15, 495, 890)"><rect x="473" y="870" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="495" cy="891" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="495" y="895" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.05</text></g>
    <g transform="rotate(15, 550, 915)"><rect x="528" y="895" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="550" cy="916" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="550" y="920" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.06</text></g>
    <g transform="rotate(15, 605, 940)"><rect x="583" y="920" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="605" cy="941" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="605" y="945" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.07</text></g>
    <g transform="rotate(15, 660, 965)"><rect x="638" y="945" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="660" cy="966" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="660" y="970" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.08</text></g>
    <g transform="rotate(15, 715, 990)"><rect x="693" y="970" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="715" cy="991" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="715" y="995" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.09</text></g>
    <g transform="rotate(15, 770, 1015)"><rect x="748" y="995" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="770" cy="1016" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="770" y="1020" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.10</text></g>

    <!-- Baris Bawah C.20 - C.11 -->
    <g transform="rotate(15, 250, 875)"><rect x="228" y="855" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="250" cy="876" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="250" y="880" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.20</text></g>
    <g transform="rotate(15, 305, 900)"><rect x="283" y="880" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="305" cy="901" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="305" y="905" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.19</text></g>
    <g transform="rotate(15, 360, 925)"><rect x="338" y="905" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="360" cy="926" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="360" y="930" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.18</text></g>
    <g transform="rotate(15, 415, 950)"><rect x="393" y="930" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="415" cy="951" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="415" y="955" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.17</text></g>
    <g transform="rotate(15, 470, 975)"><rect x="448" y="955" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="470" cy="976" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="470" y="980" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.16</text></g>
    <g transform="rotate(15, 525, 1000)"><rect x="503" y="980" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="525" cy="1001" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="525" y="1005" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.15</text></g>
    <g transform="rotate(15, 580, 1025)"><rect x="558" y="1005" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="580" cy="1026" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="580" y="1030" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.14</text></g>
    <g transform="rotate(15, 635, 1050)"><rect x="613" y="1030" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="635" cy="1051" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="635" y="1055" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.13</text></g>
    <g transform="rotate(15, 690, 1075)"><rect x="668" y="1055" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="690" cy="1076" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="690" y="1080" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.12</text></g>
    <g transform="rotate(15, 745, 1100)"><rect x="723" y="1080" width="44" height="42" rx="2" fill="#10b981" stroke="#047857" stroke-width="1.5" /><circle cx="745" cy="1101" r="11" fill="#059669" stroke="#ffffff" stroke-width="1" /><text x="745" y="1105" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">C.11</text></g>
  </g>

  <!-- ================= BLOK D ================= -->
  <g id="blokD-render">
    <circle cx="480" cy="1110" r="18" fill="#ffffff" stroke="#1d4ed8" stroke-width="3" filter="url(#softShadow)" />
    <text x="480" y="1117" text-anchor="middle" fill="#1d4ed8" font-size="20" font-weight="900">D</text>

    <!-- Baris Atas D.01 - D.08 -->
    <g transform="rotate(15, 235, 1045)"><rect x="213" y="1025" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="235" cy="1046" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="235" y="1050" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.01</text></g>
    <g transform="rotate(15, 290, 1070)"><rect x="268" y="1050" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="290" cy="1071" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="290" y="1075" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.02</text></g>
    <g transform="rotate(15, 345, 1095)"><rect x="323" y="1075" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="345" cy="1096" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="345" y="1100" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.03</text></g>
    <g transform="rotate(15, 400, 1120)"><rect x="378" y="1100" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="400" cy="1121" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="400" y="1125" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.04</text></g>
    <g transform="rotate(15, 455, 1145)"><rect x="433" y="1125" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="455" cy="1146" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="455" y="1150" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.05</text></g>
    <g transform="rotate(15, 510, 1170)"><rect x="488" y="1150" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="510" cy="1171" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="510" y="1175" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.06</text></g>
    <g transform="rotate(15, 565, 1195)"><rect x="543" y="1175" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="565" cy="1196" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="565" y="1200" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.07</text></g>
    <g transform="rotate(15, 620, 1220)"><rect x="598" y="1200" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="620" cy="1221" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="620" y="1225" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.08</text></g>

    <!-- Baris Bawah D.16 - D.09 -->
    <g transform="rotate(15, 210, 1130)"><rect x="188" y="1110" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="210" cy="1131" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="210" y="1135" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.16</text></g>
    <g transform="rotate(15, 265, 1155)"><rect x="243" y="1135" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="265" cy="1156" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="265" y="1160" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.15</text></g>
    <g transform="rotate(15, 320, 1180)"><rect x="298" y="1160" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="320" cy="1181" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="320" y="1185" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.14</text></g>
    <g transform="rotate(15, 375, 1205)"><rect x="353" y="1185" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="375" cy="1206" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="375" y="1210" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.13</text></g>
    <g transform="rotate(15, 430, 1230)"><rect x="408" y="1210" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="430" cy="1231" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="430" y="1235" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.12</text></g>
    <g transform="rotate(15, 485, 1255)"><rect x="463" y="1235" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="485" cy="1256" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="485" y="1260" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.11</text></g>
    <g transform="rotate(15, 540, 1280)"><rect x="518" y="1260" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="540" cy="1281" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="540" y="1285" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.10</text></g>
    <g transform="rotate(15, 595, 1305)"><rect x="573" y="1285" width="44" height="42" rx="2" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" /><circle cx="595" cy="1306" r="11" fill="#2563eb" stroke="#ffffff" stroke-width="1" /><text x="595" y="1310" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="bold">D.09</text></g>
  </g>

  <!-- FASILITAS UMUM BAWAH -->
  <g transform="translate(180, 1270)">
    <rect x="0" y="0" width="130" height="95" rx="4" fill="#047857" stroke="#34d399" stroke-width="2" filter="url(#softShadow)" />
    <circle cx="65" cy="38" r="16" fill="#065f46" stroke="#ffffff" stroke-width="1.5" />
    <text x="65" y="43" text-anchor="middle" fill="#ffffff" font-size="16">🕌</text>
    <text x="65" y="68" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900">SARANA PERIBADATAN</text>
    <text x="65" y="82" text-anchor="middle" fill="#a7f3d0" font-size="9" font-weight="bold">LUAS = 240 m²</text>
  </g>

  <g transform="translate(325, 1315)">
    <rect x="0" y="0" width="115" height="85" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2" filter="url(#softShadow)" />
    <circle cx="57" cy="32" r="14" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />
    <text x="57" y="37" text-anchor="middle" fill="#ffffff" font-size="14">🏪</text>
    <text x="57" y="58" text-anchor="middle" fill="#ffffff" font-size="10" font-weight="900">SARANA NIAGA</text>
    <text x="57" y="72" text-anchor="middle" fill="#38bdf8" font-size="9" font-weight="bold">LUAS = 120 m²</text>
  </g>

  <!-- 5. TABEL LEGENDA & REKAPITULASI RESMI -->
  <g transform="translate(560, 1420)">
    <rect x="0" y="0" width="410" height="310" rx="6" fill="#ffffff" stroke="#0f172a" stroke-width="2.5" filter="url(#softShadow)" />
    <rect x="0" y="0" width="410" height="42" rx="4" fill="#0f172a" />
    <text x="205" y="27" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="900" letter-spacing="1">
      LEGENDA & REKAPITULASI UNIT
    </text>

    <!-- Baris Blok A -->
    <rect x="18" y="54" width="22" height="22" rx="3" fill="#ef4444" stroke="#991b1b" stroke-width="1.5" />
    <text x="52" y="70" fill="#0f172a" font-size="12" font-weight="bold">BLOK A (A.01 - A.13)</text>
    <text x="365" y="70" text-anchor="end" fill="#991b1b" font-size="12" font-weight="900">= 13 Unit</text>
    <line x1="18" y1="84" x2="390" y2="84" stroke="#e2e8f0" stroke-width="1" />

    <!-- Baris Blok B -->
    <rect x="18" y="94" width="22" height="22" rx="3" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
    <text x="52" y="110" fill="#0f172a" font-size="12" font-weight="bold">BLOK B (B.01 - B.21)</text>
    <text x="365" y="110" text-anchor="end" fill="#b45309" font-size="12" font-weight="900">= 21 Unit</text>
    <line x1="18" y1="124" x2="390" y2="124" stroke="#e2e8f0" stroke-width="1" />

    <!-- Baris Blok C -->
    <rect x="18" y="134" width="22" height="22" rx="3" fill="#10b981" stroke="#047857" stroke-width="1.5" />
    <text x="52" y="150" fill="#0f172a" font-size="12" font-weight="bold">BLOK C (C.01 - C.20)</text>
    <text x="365" y="150" text-anchor="end" fill="#047857" font-size="12" font-weight="900">= 20 Unit</text>
    <line x1="18" y1="164" x2="390" y2="164" stroke="#e2e8f0" stroke-width="1" />

    <!-- Baris Blok D -->
    <rect x="18" y="174" width="22" height="22" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" />
    <text x="52" y="190" fill="#0f172a" font-size="12" font-weight="bold">BLOK D (D.01 - D.16)</text>
    <text x="365" y="190" text-anchor="end" fill="#1d4ed8" font-size="12" font-weight="900">= 16 Unit</text>
    <line x1="18" y1="204" x2="390" y2="204" stroke="#cbd5e1" stroke-width="1.5" />

    <!-- Total Kavling -->
    <rect x="12" y="212" width="386" height="34" rx="4" fill="#f1f5f9" />
    <text x="24" y="234" fill="#0f172a" font-size="13" font-weight="900">JUMLAH KAVLING RUMAH</text>
    <text x="382" y="235" text-anchor="end" fill="#059669" font-size="15" font-weight="900">= 70 Unit</text>

    <!-- Fasum / Fasos -->
    <text x="24" y="264" fill="#475569" font-size="10" font-weight="bold">• Sarana Peribadatan : 240 m²</text>
    <text x="24" y="279" fill="#475569" font-size="10" font-weight="bold">• Sarana Niaga &amp; IPAL : 120 m² &amp; 94 m²</text>
    <text x="24" y="294" fill="#475569" font-size="10" font-weight="bold">• Jalan Lingkungan : 5.50 m &amp; 6.00 m</text>
  </g>
</svg>`;

export function convertSvgToJpegDataUrl(svgString: string, width = 1200, height = 2136): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#3d7a36';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            URL.revokeObjectURL(url);
            resolve(jpegDataUrl);
            return;
          }
        } catch (e) {
          console.warn('Canvas conversion to JPEG failed, using SVG Data URL fallback', e);
        }
        URL.revokeObjectURL(url);
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
      };

      img.src = url;
    } catch {
      resolve(`data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`);
    }
  });
}
