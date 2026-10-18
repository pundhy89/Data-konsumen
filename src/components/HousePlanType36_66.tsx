import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Check,
  Download,
  Info,
} from 'lucide-react';
import {
  saveHouseplanImageToDB,
  loadHouseplanImageFromDB,
  clearHouseplanImageFromDB,
} from '../utils/imageStorage';

interface HousePlanType36_66Props {
  unitId?: string;
  block?: string;
}

export default function HousePlanType36_66({ unitId = 'A.01', block = 'A' }: HousePlanType36_66Props) {
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load custom image from IndexedDB on mount
  useEffect(() => {
    loadHouseplanImageFromDB().then((url) => {
      if (url) {
        setCustomImage(url);
      }
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await saveHouseplanImageToDB(file);
      const url = URL.createObjectURL(file);
      setCustomImage(url);
      setUploadSuccess('Denah rumah berhasil diperbarui & tersimpan!');
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (err) {
      console.error('Gagal menyimpan gambar denah:', err);
    }
  };

  const handleResetToDefault = async () => {
    await clearHouseplanImageFromDB();
    setCustomImage(null);
    setUploadSuccess('Denah kembali ke format standar Type 36/66.');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white border border-slate-300 rounded-2xl p-3 sm:p-5 shadow-xs overflow-hidden">
      {/* Top Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
              DENAH RUMAH TYPE 36 / 66 M²
            </h4>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-bold text-[11px] border border-blue-200">
              SKALA 1 : 100
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Lebar 6.00 M × Panjang 11.00 M · Luas Bangunan 36 m² · Luas Tanah 66 m²
          </p>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Ganti dengan gambar JPEG denah Anda sendiri"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Unggah JPEG Sendiri</span>
          </button>

          {customImage && (
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1 transition-colors border border-amber-200"
              title="Kembalikan ke denah gambar default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          )}

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
              className="p-1.5 hover:bg-white text-slate-600 rounded transition-colors"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold px-1 text-slate-600">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
              className="p-1.5 hover:bg-white text-slate-600 rounded transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:underline"
              >
                100%
              </button>
            )}
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div className="w-full mb-3 p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-1.5 font-medium animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Drawing Viewport Container */}
      <div className="w-full overflow-auto flex justify-center py-2 bg-slate-50/50 rounded-xl border border-slate-200">
        <div
          className="transition-transform duration-150 origin-top flex justify-center items-center select-none"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {customImage ? (
            /* IF USER UPLOADED A CUSTOM JPEG/PNG */
            <div className="relative max-w-xl shadow-lg rounded-xl overflow-hidden bg-white border border-slate-300">
              <img
                src={customImage}
                alt={`Denah Rumah Unit ${unitId} Type 36/66`}
                className="w-full h-auto object-contain block"
              />
            </div>
          ) : (
            /* EXACT ARCHITECTURAL REPLICA OF THE UPLOADED "DENAH RUMAH TYPE 36/66 SCALE 1:100" */
            <div className="w-full max-w-[560px] bg-white rounded-xl shadow-sm border border-slate-200 p-2 sm:p-4">
              <svg
                viewBox="0 0 880 1420"
                className="w-full h-auto drop-shadow-xs"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG DEFINITIONS FOR TEXTURES & SHADOWS */}
                <defs>
                  {/* Grass Garden Pattern */}
                  <pattern id="lawnGrass" width="24" height="24" patternUnits="userSpaceOnUse">
                    <rect width="24" height="24" fill="#609950" />
                    <circle cx="6" cy="6" r="3" fill="#6ba859" opacity="0.8" />
                    <circle cx="18" cy="14" r="4" fill="#528843" opacity="0.8" />
                    <circle cx="12" cy="20" r="2.5" fill="#78b765" opacity="0.6" />
                    <circle cx="18" cy="4" r="2" fill="#467638" opacity="0.7" />
                  </pattern>

                  {/* Wood Flooring Parquet Pattern */}
                  <pattern id="woodFlooring" width="40" height="20" patternUnits="userSpaceOnUse">
                    <rect width="40" height="20" fill="#dfbe99" />
                    <line x1="0" y1="10" x2="40" y2="10" stroke="#cfa679" strokeWidth="1" />
                    <line x1="0" y1="20" x2="40" y2="20" stroke="#cfa679" strokeWidth="1" />
                    <line x1="20" y1="0" x2="20" y2="10" stroke="#cfa679" strokeWidth="1" />
                    <line x1="40" y1="10" x2="40" y2="20" stroke="#cfa679" strokeWidth="1" />
                    <line x1="0" y1="10" x2="0" y2="20" stroke="#cfa679" strokeWidth="1" />
                  </pattern>

                  {/* Ceramic Bathroom Tile Pattern */}
                  <pattern id="bathroomTile" width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect width="16" height="16" fill="#ccd7dc" />
                    <rect x="0.5" y="0.5" width="15" height="15" fill="#d8e2e6" stroke="#b0bec5" strokeWidth="0.8" />
                  </pattern>

                  {/* Carport Paver Pattern */}
                  <pattern id="carportPaver" width="18" height="12" patternUnits="userSpaceOnUse">
                    <rect width="18" height="12" fill="#3a4249" />
                    <rect x="0.5" y="0.5" width="8.5" height="11" fill="#4b555d" stroke="#2b3137" strokeWidth="0.6" />
                    <rect x="9.5" y="0.5" width="8" height="11" fill="#454e56" stroke="#2b3137" strokeWidth="0.6" />
                  </pattern>

                  {/* Drop Shadow for Walls & Furniture */}
                  <filter id="wallShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
                  </filter>
                  <filter id="carShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="8" dy="10" stdDeviation="6" floodColor="#000000" floodOpacity="0.45" />
                  </filter>
                </defs>

                {/* BACKGROUND RECTANGLE */}
                <rect width="880" height="1420" fill="#ffffff" />

                {/* ========================================================
                    MAIN LOT AREA (Width: 600, Height: 1100)
                    Origin at (X: 140, Y: 130) -> Bottom Right at (740, 1230)
                   ======================================================== */}

                {/* 1. TAMAN BELAKANG (Top-Left: 300 x 308) -> (140, 130) to (440, 438) */}
                <g id="tamanBelakang">
                  <rect x="140" y="130" width="300" height="308" fill="url(#lawnGrass)" />
                  {/* Decorative Bush Clusters */}
                  <circle cx="165" cy="160" r="22" fill="#3f722f" opacity="0.8" />
                  <circle cx="180" cy="150" r="18" fill="#508d3e" />
                  <circle cx="150" cy="180" r="16" fill="#3f722f" />
                  <circle cx="185" cy="175" r="12" fill="#6ab052" />
                  {/* Palm frond plant */}
                  <circle cx="210" cy="160" r="14" fill="#346125" />
                  {/* Plant pots in corner */}
                  <circle cx="410" cy="155" r="9" fill="#c26d38" stroke="#874720" strokeWidth="1.5" />
                  <circle cx="428" cy="170" r="11" fill="#c26d38" stroke="#874720" strokeWidth="1.5" />
                  <circle cx="155" cy="245" r="8" fill="#c26d38" />
                  <circle cx="155" cy="265" r="7" fill="#c26d38" />
                  {/* Level text */}
                  <text x="290" y="235" textAnchor="middle" fill="#1b3812" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    FFL -0.25
                  </text>
                </g>

                {/* 2. KAMAR TIDUR BELAKANG (Top-Right: 300 x 308) -> (440, 130) to (740, 438) */}
                <g id="kamarTidurBelakang">
                  <rect x="440" y="130" width="300" height="308" fill="url(#woodFlooring)" />
                  
                  {/* Window on top wall */}
                  <rect x="520" y="126" width="110" height="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />

                  {/* Wardrobe along bottom wall */}
                  <rect x="580" y="388" width="150" height="42" fill="#694f38" stroke="#3b2b1d" strokeWidth="1.5" filter="url(#wallShadow)" />
                  <line x1="655" y1="388" x2="655" y2="430" stroke="#3b2b1d" strokeWidth="1.5" />
                  <line x1="580" y1="402" x2="730" y2="402" stroke="#82664d" strokeWidth="1" strokeDasharray="4 2" />

                  {/* Bed Carpet/Rug */}
                  <rect x="495" y="165" width="195" height="185" rx="4" fill="#b0bec5" opacity="0.6" />

                  {/* Double Bed & Headboard */}
                  <rect x="525" y="165" width="145" height="165" rx="3" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="2" filter="url(#wallShadow)" />
                  {/* Headboard */}
                  <rect x="525" y="165" width="145" height="18" fill="#5d4037" />
                  {/* Pillows */}
                  <rect x="535" y="188" width="55" height="32" rx="4" fill="#ffffff" stroke="#b0bec5" strokeWidth="1" />
                  <rect x="605" y="188" width="55" height="32" rx="4" fill="#ffffff" stroke="#b0bec5" strokeWidth="1" />
                  {/* Duvet Blanket */}
                  <rect x="525" y="235" width="145" height="95" fill="#eceff1" stroke="#cfd8dc" strokeWidth="1.5" />

                  {/* Nightstands */}
                  <rect x="475" y="168" width="36" height="34" rx="3" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.2" />
                  <circle cx="493" cy="185" r="7" fill="#fff9c4" stroke="#fbc02d" strokeWidth="1" />
                  <rect x="685" y="168" width="36" height="34" rx="3" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.2" />
                  <circle cx="703" cy="185" r="7" fill="#fff9c4" stroke="#fbc02d" strokeWidth="1" />

                  {/* Label Text */}
                  <text x="590" y="235" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    KAMAR TIDUR
                  </text>
                  <text x="590" y="258" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
                    FFL ±0.00
                  </text>
                </g>

                {/* 3. RUANG TAMU & KELUARGA (Middle-Left: 300 x 350) -> (140, 438) to (440, 788) */}
                <g id="ruangTamuKeluarga">
                  <rect x="140" y="438" width="300" height="350" fill="url(#woodFlooring)" />

                  {/* Potted Indoor Plant at Corner */}
                  <circle cx="168" cy="465" r="16" fill="#3f722f" />
                  <circle cx="168" cy="465" r="8" fill="#9a5a29" stroke="#663510" strokeWidth="1" />

                  {/* Living Room Area Rug */}
                  <rect x="155" y="495" width="180" height="175" rx="5" fill="#ded4c8" stroke="#c7b9a7" strokeWidth="1.5" />

                  {/* Comfortable Sofa L-Sectional */}
                  <rect x="155" y="500" width="48" height="145" rx="6" fill="#eceff1" stroke="#90a4ae" strokeWidth="2" filter="url(#wallShadow)" />
                  <rect x="160" y="505" width="38" height="135" rx="4" fill="#cfd8dc" />
                  {/* Sofa Arm & Backrest */}
                  <rect x="155" y="500" width="14" height="145" fill="#90a4ae" />
                  {/* Top Armrest */}
                  <rect x="155" y="500" width="48" height="14" fill="#90a4ae" />

                  {/* Modern Coffee Table */}
                  <rect x="225" y="540" width="60" height="45" rx="3" fill="#cfab82" stroke="#8d6e63" strokeWidth="1.5" filter="url(#wallShadow)" />

                  {/* TV Cabinet / Credenza at bottom */}
                  <rect x="155" y="735" width="165" height="28" fill="#4e342e" stroke="#2d1c16" strokeWidth="1.5" />
                  <rect x="195" y="742" width="85" height="6" rx="2" fill="#1e293b" />
                  <circle cx="310" cy="749" r="7" fill="#b0bec5" />

                  {/* Door Swing to Terrace */}
                  <path d="M 405 788 A 65 65 0 0 1 440 725" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="3 3" />
                  <line x1="440" y1="788" x2="440" y2="725" stroke="#334155" strokeWidth="2.5" />

                  {/* Label Text */}
                  <text x="290" y="575" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    RUANG TAMU &
                  </text>
                  <text x="290" y="598" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    RUANG KELUARGA
                  </text>
                  <text x="290" y="622" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
                    FFL ±0.00
                  </text>
                </g>

                {/* 4. KAMAR MANDI / WC (Middle-Right Top: 150 x 150) -> (440, 438) to (590, 588) */}
                <g id="kamarMandi">
                  <rect x="440" y="438" width="150" height="150" fill="url(#bathroomTile)" />

                  {/* Door Swing */}
                  <path d="M 440 545 A 50 50 0 0 1 490 588" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="440" y1="588" x2="440" y2="540" stroke="#334155" strokeWidth="2" />

                  {/* Washbasin / Sink */}
                  <rect x="450" y="445" width="38" height="26" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                  <circle cx="469" cy="458" r="3" fill="#cbd5e1" />

                  {/* Water Closet / Toilet */}
                  <ellipse cx="545" cy="510" rx="16" ry="22" fill="#ffffff" stroke="#64748b" strokeWidth="1.8" filter="url(#wallShadow)" />
                  <rect x="532" y="530" width="26" height="14" rx="3" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />

                  {/* Shower Head */}
                  <circle cx="465" cy="505" r="8" fill="#e2e8f0" stroke="#0891b2" strokeWidth="1.2" />

                  {/* Label Text */}
                  <text x="515" y="468" textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                    KM/WC
                  </text>
                  <text x="515" y="488" textAnchor="middle" fill="#334155" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
                    FFL -0.05
                  </text>
                </g>

                {/* 5. KAMAR TIDUR DEPAN (Middle-Right Bottom: 300 x 300) -> (440, 588) to (740, 888) */}
                <g id="kamarTidurDepan">
                  <rect x="440" y="588" width="300" height="300" fill="url(#woodFlooring)" />

                  {/* Wardrobe along top wall */}
                  <rect x="580" y="590" width="150" height="42" fill="#694f38" stroke="#3b2b1d" strokeWidth="1.5" filter="url(#wallShadow)" />
                  <line x1="655" y1="590" x2="655" y2="632" stroke="#3b2b1d" strokeWidth="1.5" />

                  {/* Desk / Console along left wall */}
                  <rect x="442" y="660" width="32" height="70" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.2" />
                  <rect x="480" y="680" width="18" height="24" rx="3" fill="#d7ccc8" stroke="#6d4c41" />

                  {/* Bed Rug */}
                  <rect x="525" y="665" width="165" height="185" rx="4" fill="#cfd8dc" opacity="0.6" />

                  {/* Double Bed */}
                  <rect x="535" y="675" width="145" height="165" rx="3" fill="#d7ccc8" stroke="#8d6e63" strokeWidth="2" filter="url(#wallShadow)" />
                  <rect x="535" y="822" width="145" height="18" fill="#5d4037" />
                  <rect x="545" y="775" width="55" height="32" rx="4" fill="#ffffff" stroke="#b0bec5" strokeWidth="1" />
                  <rect x="615" y="775" width="55" height="32" rx="4" fill="#ffffff" stroke="#b0bec5" strokeWidth="1" />
                  <rect x="535" y="675" width="145" height="95" fill="#eceff1" stroke="#cfd8dc" strokeWidth="1.5" />

                  {/* Nightstands */}
                  <rect x="485" y="805" width="36" height="34" rx="3" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.2" />
                  <circle cx="503" cy="822" r="7" fill="#fff9c4" stroke="#fbc02d" strokeWidth="1" />
                  <rect x="695" y="805" width="36" height="34" rx="3" fill="#8d6e63" stroke="#4e342e" strokeWidth="1.2" />
                  <circle cx="713" cy="822" r="7" fill="#fff9c4" stroke="#fbc02d" strokeWidth="1" />

                  {/* Window looking at Carport */}
                  <rect x="555" y="884" width="110" height="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />

                  {/* Label Text */}
                  <text x="590" y="695" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    KAMAR TIDUR
                  </text>
                  <text x="590" y="718" textAnchor="middle" fill="#334155" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
                    FFL ±0.00
                  </text>
                </g>

                {/* 6. TERAS DEPAN (Front-Left Top: 300 x 88) -> (140, 788) to (440, 876) */}
                <g id="terasDepan">
                  <rect x="140" y="788" width="300" height="88" fill="#d3dbe0" stroke="#94a3b8" strokeWidth="1" />
                  {/* Tile grid lines */}
                  <line x1="240" y1="788" x2="240" y2="876" stroke="#b0bec5" strokeWidth="1" />
                  <line x1="340" y1="788" x2="340" y2="876" stroke="#b0bec5" strokeWidth="1" />
                  <line x1="140" y1="832" x2="440" y2="832" stroke="#b0bec5" strokeWidth="1" />

                  {/* Plant pot */}
                  <rect x="155" y="800" width="24" height="24" rx="3" fill="#c26d38" stroke="#874720" strokeWidth="1.5" />
                  <circle cx="167" cy="812" r="8" fill="#3f722f" />

                  {/* Terrace steps down to garden */}
                  <line x1="360" y1="876" x2="440" y2="876" stroke="#475569" strokeWidth="2" />
                  <line x1="360" y1="884" x2="440" y2="884" stroke="#94a3b8" strokeWidth="1.5" />

                  {/* Label Text */}
                  <text x="290" y="828" textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="bold" fontFamily="sans-serif">
                    TERAS
                  </text>
                  <text x="290" y="848" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                    FFL -0.05
                  </text>
                </g>

                {/* 7. TAMAN DEPAN (Front-Left Bottom: 300 x 355) -> (140, 876) to (440, 1231) */}
                <g id="tamanDepan">
                  <rect x="140" y="876" width="300" height="355" fill="url(#lawnGrass)" />

                  {/* Lush Foliage & Shrubs */}
                  <circle cx="170" cy="910" r="24" fill="#3f722f" opacity="0.8" />
                  <circle cx="190" cy="925" r="20" fill="#508d3e" />
                  <circle cx="215" cy="910" r="16" fill="#3f722f" />

                  <circle cx="160" cy="980" r="22" fill="#346125" />
                  <circle cx="180" cy="1000" r="18" fill="#6ab052" />
                  <circle cx="155" cy="1030" r="20" fill="#3f722f" />

                  <circle cx="165" cy="1150" r="24" fill="#3f722f" />
                  <circle cx="190" cy="1165" r="18" fill="#508d3e" />
                  <circle cx="160" cy="1185" r="20" fill="#346125" />
                  <circle cx="210" cy="1180" r="15" fill="#6ab052" />

                  {/* Label Text */}
                  <text x="290" y="1055" textAnchor="middle" fill="#1b3812" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    FFL -0.25
                  </text>
                </g>

                {/* 8. CARPORT MOBIL (Front-Right Bottom: 300 x 342) -> (440, 888) to (740, 1230) */}
                <g id="carportMobil">
                  <rect x="440" y="888" width="300" height="342" fill="url(#carportPaver)" />

                  {/* Level text */}
                  <text x="590" y="1055" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                    FL -0.25
                  </text>

                  {/* REALISTIC YELLOW / GOLD CAR (Top-down view as in uploaded image) */}
                  <g id="yellowCar" transform="translate(510, 910)" filter="url(#carShadow)">
                    {/* Car Body Base */}
                    <rect x="0" y="0" width="160" height="270" rx="32" fill="#eab308" stroke="#ca8a04" strokeWidth="2.5" />

                    {/* Front Bumper & Headlights */}
                    <path d="M 12 30 Q 80 5 148 30" fill="none" stroke="#a16207" strokeWidth="2" />
                    {/* Headlights */}
                    <polygon points="12,18 35,10 42,24 16,30" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                    <polygon points="148,18 125,10 118,24 144,30" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />

                    {/* Hood character lines */}
                    <path d="M 45 28 L 50 75" stroke="#ca8a04" strokeWidth="1.5" />
                    <path d="M 115 28 L 110 75" stroke="#ca8a04" strokeWidth="1.5" />

                    {/* Windshield */}
                    <path d="M 22 78 Q 80 65 138 78 L 130 115 Q 80 108 30 115 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />

                    {/* Side Mirrors */}
                    <rect x="-14" y="82" width="16" height="24" rx="4" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.2" />
                    <rect x="158" y="82" width="16" height="24" rx="4" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.2" />

                    {/* Roof & Sunroof */}
                    <rect x="30" y="115" width="100" height="105" rx="10" fill="#ca8a04" />
                    <rect x="42" y="125" width="76" height="50" rx="6" fill="#334155" stroke="#1e293b" strokeWidth="1.2" />

                    {/* Rear Windshield */}
                    <path d="M 32 222 Q 80 216 128 222 L 134 246 Q 80 242 26 246 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />

                    {/* Rear Taillights */}
                    <rect x="14" y="260" width="30" height="8" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                    <rect x="116" y="260" width="30" height="8" rx="2" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                  </g>
                </g>

                {/* ========================================================
                    WALL STRUCTURE (Black Thick Lines as in CAD / Architectural Drawing)
                   ======================================================== */}
                <g id="walls" stroke="#0f172a" strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter">
                  {/* Outer Boundary Walls */}
                  <line x1="140" y1="130" x2="740" y2="130" />
                  <line x1="140" y1="130" x2="140" y2="1230" />
                  <line x1="740" y1="130" x2="740" y2="1230" />
                  <line x1="140" y1="1230" x2="740" y2="1230" />

                  {/* Internal Room Separation Walls */}
                  {/* Vertical middle wall dividing Left & Right (top to teras) */}
                  <line x1="440" y1="130" x2="440" y2="788" />
                  <line x1="440" y1="788" x2="440" y2="888" strokeWidth="5" />

                  {/* Horizontal wall between Taman Belakang/R. Tamu & Kamar Belakang/KM */}
                  <line x1="140" y1="438" x2="740" y2="438" />

                  {/* Horizontal wall between KM/WC and Kamar Depan */}
                  <line x1="440" y1="588" x2="740" y2="588" />

                  {/* Horizontal wall dividing R. Tamu and Teras */}
                  <line x1="140" y1="788" x2="440" y2="788" />

                  {/* Horizontal wall dividing Kamar Depan and Carport */}
                  <line x1="440" y1="888" x2="740" y2="888" />

                  {/* Wall dividing Teras and Taman Depan */}
                  <line x1="140" y1="876" x2="440" y2="876" strokeWidth="4" />

                  {/* Partition between KM/WC and Hallway */}
                  <line x1="590" y1="438" x2="590" y2="588" />
                </g>

                {/* GSB LINE (Garis Sempadan Bangunan - Blue line as in original drawing) */}
                <g id="gsbLine">
                  <line x1="100" y1="930" x2="780" y2="930" stroke="#2563eb" strokeWidth="2" strokeDasharray="10 4 2 4" />
                  <text x="815" y="934" fill="#1e40af" fontSize="18" fontWeight="bold" fontFamily="sans-serif">
                    GSB
                  </text>
                </g>

                {/* DRAINASE U-DITCH AT BOTTOM */}
                <g id="drainase">
                  <rect x="140" y="1230" width="600" height="28" fill="#d1d5db" stroke="#6b7280" strokeWidth="1.5" />
                  <text x="440" y="1250" textAnchor="middle" fill="#1f2937" fontSize="14" fontWeight="bold" fontFamily="monospace">
                    DRAINASE U-DITCH 30x30x120
                  </text>
                </g>

                {/* ========================================================
                    ARCHITECTURAL DIMENSION LINES & LABELS (TOP, LEFT, RIGHT, BOTTOM)
                   ======================================================== */}
                <g id="dimensions" stroke="#000000" strokeWidth="1" strokeLinecap="round">
                  {/* ====== TOP DIMENSIONS: 300, 300, 600 ====== */}
                  {/* Extension lines */}
                  <line x1="140" y1="125" x2="140" y2="40" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="440" y1="125" x2="440" y2="40" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="740" y1="125" x2="740" y2="40" stroke="#64748b" strokeWidth="0.8" />

                  {/* First Top Dimension Line (300 + 300) at Y=75 */}
                  <line x1="140" y1="75" x2="740" y2="75" />
                  {/* Dimension ticks (slashes) */}
                  <line x1="135" y1="80" x2="145" y2="70" strokeWidth="1.8" />
                  <line x1="435" y1="80" x2="445" y2="70" strokeWidth="1.8" />
                  <line x1="735" y1="80" x2="745" y2="70" strokeWidth="1.8" />
                  <text x="290" y="70" textAnchor="middle" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="sans-serif">300</text>
                  <text x="590" y="70" textAnchor="middle" fill="#000000" fontSize="16" fontWeight="bold" fontFamily="sans-serif">300</text>

                  {/* Overall Top Dimension Line (600) at Y=45 */}
                  <line x1="140" y1="45" x2="740" y2="45" />
                  <line x1="135" y1="50" x2="145" y2="40" strokeWidth="1.8" />
                  <line x1="735" y1="50" x2="745" y2="40" strokeWidth="1.8" />
                  <text x="440" y="40" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="bold" fontFamily="sans-serif">600</text>

                  {/* Center Datum Arrow Symbol: B DITE */}
                  <g transform="translate(440, 15)">
                    <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                    <polygon points="0,-14 6,-4 -6,-4" fill="#000000" />
                    <text x="0" y="-1" textAnchor="middle" fill="#000000" fontSize="10" fontWeight="bold">B</text>
                    <text x="0" y="9" textAnchor="middle" fill="#000000" fontSize="7" fontWeight="bold">DITE</text>
                  </g>

                  {/* Center Datum dashed line extending through plan */}
                  <line x1="440" y1="30" x2="440" y2="130" stroke="#000000" strokeWidth="1" strokeDasharray="8 4 2 4" />

                  {/* ====== LEFT DIMENSIONS: 308, 350, 88, 355 ====== */}
                  <line x1="135" y1="130" x2="60" y2="130" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="135" y1="438" x2="60" y2="438" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="135" y1="788" x2="60" y2="788" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="135" y1="876" x2="60" y2="876" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="135" y1="1231" x2="60" y2="1231" stroke="#64748b" strokeWidth="0.8" />

                  {/* Left Inner Dimension Line at X=100 */}
                  <line x1="100" y1="130" x2="100" y2="1231" />
                  <line x1="95" y1="135" x2="105" y2="125" strokeWidth="1.8" />
                  <line x1="95" y1="443" x2="105" y2="433" strokeWidth="1.8" />
                  <line x1="95" y1="793" x2="105" y2="783" strokeWidth="1.8" />
                  <line x1="95" y1="881" x2="105" y2="871" strokeWidth="1.8" />
                  <line x1="95" y1="1236" x2="105" y2="1226" strokeWidth="1.8" />

                  {/* Left Dimension Text Rotated */}
                  <text x="90" y="284" textAnchor="middle" transform="rotate(-90 90 284)" fill="#000000" fontSize="16" fontWeight="bold">308</text>
                  <text x="90" y="613" textAnchor="middle" transform="rotate(-90 90 613)" fill="#000000" fontSize="16" fontWeight="bold">350</text>
                  <text x="90" y="832" textAnchor="middle" transform="rotate(-90 90 832)" fill="#000000" fontSize="15" fontWeight="bold">88</text>
                  <text x="90" y="1053" textAnchor="middle" transform="rotate(-90 90 1053)" fill="#000000" fontSize="16" fontWeight="bold">355</text>

                  {/* Datum Marker Circle: MIC & 100 */}
                  <g transform="translate(45, 650)">
                    <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                    <polygon points="-14,0 -4,-6 -4,6" fill="#000000" />
                    <text x="-1" y="4" textAnchor="middle" fill="#000000" fontSize="7" fontWeight="bold">MIC</text>
                  </g>
                  <text x="65" y="500" fill="#000000" fontSize="16" fontWeight="bold" transform="rotate(-90 65 500)">100</text>

                  {/* ====== RIGHT DIMENSIONS: 308, 150, 300, 342 ====== */}
                  <line x1="745" y1="130" x2="820" y2="130" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="745" y1="438" x2="820" y2="438" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="745" y1="588" x2="820" y2="588" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="745" y1="888" x2="820" y2="888" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="745" y1="1230" x2="820" y2="1230" stroke="#64748b" strokeWidth="0.8" />

                  {/* Right Dimension Line at X=780 */}
                  <line x1="780" y1="130" x2="780" y2="1230" />
                  <line x1="775" y1="135" x2="785" y2="125" strokeWidth="1.8" />
                  <line x1="775" y1="443" x2="785" y2="433" strokeWidth="1.8" />
                  <line x1="775" y1="593" x2="785" y2="583" strokeWidth="1.8" />
                  <line x1="775" y1="893" x2="785" y2="883" strokeWidth="1.8" />
                  <line x1="775" y1="1235" x2="785" y2="1225" strokeWidth="1.8" />

                  {/* Right Dimension Text Rotated */}
                  <text x="790" y="284" textAnchor="middle" transform="rotate(90 790 284)" fill="#000000" fontSize="16" fontWeight="bold">308</text>
                  <text x="790" y="513" textAnchor="middle" transform="rotate(90 790 513)" fill="#000000" fontSize="15" fontWeight="bold">150</text>
                  <text x="790" y="738" textAnchor="middle" transform="rotate(90 790 738)" fill="#000000" fontSize="16" fontWeight="bold">300</text>
                  <text x="790" y="1059" textAnchor="middle" transform="rotate(90 790 1059)" fill="#000000" fontSize="16" fontWeight="bold">342</text>

                  {/* GSB Dimension (300) on right */}
                  <line x1="840" y1="930" x2="840" y2="1230" stroke="#2563eb" strokeWidth="1" />
                  <line x1="835" y1="935" x2="845" y2="925" stroke="#2563eb" strokeWidth="1.5" />
                  <line x1="835" y1="1235" x2="845" y2="1225" stroke="#2563eb" strokeWidth="1.5" />
                  <text x="850" y="1080" fill="#2563eb" fontSize="15" fontWeight="bold" transform="rotate(90 850 1080)">300</text>

                  {/* ====== BOTTOM DIMENSIONS: 300, 300, 600 ====== */}
                  <line x1="140" y1="1235" x2="140" y2="1330" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="440" y1="1235" x2="440" y2="1330" stroke="#64748b" strokeWidth="0.8" />
                  <line x1="740" y1="1235" x2="740" y2="1330" stroke="#64748b" strokeWidth="0.8" />

                  {/* Inner Bottom Line at Y=1285 */}
                  <line x1="140" y1="1285" x2="740" y2="1285" />
                  <line x1="135" y1="1290" x2="145" y2="1280" strokeWidth="1.8" />
                  <line x1="435" y1="1290" x2="445" y2="1280" strokeWidth="1.8" />
                  <line x1="735" y1="1290" x2="745" y2="1280" strokeWidth="1.8" />
                  <text x="290" y="1278" textAnchor="middle" fill="#000000" fontSize="16" fontWeight="bold">300</text>
                  <text x="590" y="1278" textAnchor="middle" fill="#000000" fontSize="16" fontWeight="bold">300</text>

                  {/* Outer Bottom Line at Y=1315 */}
                  <line x1="140" y1="1315" x2="740" y2="1315" />
                  <line x1="135" y1="1320" x2="145" y2="1310" strokeWidth="1.8" />
                  <line x1="735" y1="1320" x2="745" y2="1310" strokeWidth="1.8" />
                  <text x="440" y="1310" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="bold">600</text>

                  {/* Bottom Datum Arrow Symbol: B */}
                  <g transform="translate(440, 1345)">
                    <polygon points="0,0 -8,-14 8,-14" fill="#000000" />
                    <text x="-12" y="-2" fill="#000000" fontSize="13" fontWeight="bold">B</text>
                  </g>
                </g>

                {/* ========================================================
                    TITLE BLOCK: TARGET / COMPASS & TITLE
                    "DENAH RUMAH TYPE 36/66"
                    "SCALE 1 : 100"
                   ======================================================== */}
                <g id="titleBlock" transform="translate(440, 1395)">
                  {/* Circular target crosshair symbol with alternate black/white quadrants */}
                  <g transform="translate(-185, 0)">
                    <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="16" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                    {/* Top-Right and Bottom-Left Quadrants filled black */}
                    <path d="M 0 0 L 16 0 A 16 16 0 0 0 0 -16 Z" fill="#000000" />
                    <path d="M 0 0 L -16 0 A 16 16 0 0 0 0 16 Z" fill="#000000" />
                    {/* Target crosshair lines */}
                    <line x1="-28" y1="0" x2="28" y2="0" stroke="#000000" strokeWidth="1.8" />
                    <line x1="0" y1="-28" x2="0" y2="28" stroke="#000000" strokeWidth="1.8" />
                  </g>

                  {/* Main Title Text */}
                  <text x="-140" y="-4" fill="#000000" fontSize="23" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
                    DENAH RUMAH TYPE 36/66
                  </text>
                  {/* Underline */}
                  <line x1="-140" y1="4" x2="180" y2="4" stroke="#000000" strokeWidth="2" />
                  {/* Subtitle Scale */}
                  <text x="-140" y="20" fill="#000000" fontSize="14" fontWeight="600" fontFamily="sans-serif" letterSpacing="4">
                    SCALE   1 : 100
                  </text>
                </g>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Detail Ruangan & Spesifikasi Standar Type 36/66 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs w-full mt-4 pt-3 border-t border-slate-200">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
            2 Kamar Tidur
          </span>
          <span className="font-bold text-slate-800 text-xs">
            3.00 × 3.08 m & 3.00 × 3.00 m
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
            R. Tamu & Keluarga
          </span>
          <span className="font-bold text-slate-800 text-xs">
            3.00 × 3.50 m (Open Space)
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
            Carport + Mobil
          </span>
          <span className="font-bold text-slate-800 text-xs">
            3.00 × 3.42 m (Paving Blok)
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
            Taman Depan & Belakang
          </span>
          <span className="font-bold text-slate-800 text-xs">
            Depan 3.55m · Belakang 3.08m
          </span>
        </div>
      </div>
    </div>
  );
}
