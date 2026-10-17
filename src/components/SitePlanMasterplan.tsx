import React, { useState, useRef, useEffect } from 'react';
import { Unit, UnitStatus, BlockId } from '../types';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Hammer, 
  Home, 
  ShieldCheck, 
  Upload, 
  Check, 
  Maximize2, 
  Trash2, 
  Plus, 
  Edit3, 
  X, 
  MousePointer, 
  Save,
  Info,
  Move
} from 'lucide-react';
import { 
  saveSiteplanImageToDB, 
  loadSiteplanImageFromDB, 
  clearSiteplanImageFromDB 
} from '../utils/imageStorage';

interface SitePlanMasterplanProps {
  units: Unit[];
  selectedUnit: Unit | null;
  onSelectUnit: (unit: Unit) => void;
  statusFilter: UnitStatus | 'ALL';
  setStatusFilter: (status: UnitStatus | 'ALL') => void;
  blockFilter: BlockId | 'ALL';
  setBlockFilter: (block: BlockId | 'ALL') => void;
  onAddUnit?: (newUnit: Unit, coords: { x: number; y: number }) => void;
  onUpdateUnit?: (updatedUnit: Unit, coords?: { x: number; y: number }) => void;
  onDeleteUnit?: (unitId: string) => void;
}

export const STATUS_CONFIG: Record<
  UnitStatus,
  { label: string; bgClass: string; borderClass: string; textClass: string; hex: string; icon: any }
> = {
  TERSEDIA: {
    label: 'Tersedia',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-700',
    hex: '#059669',
    icon: CheckCircle2,
  },
  TERBOOKING: {
    label: 'Terbooking',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-700',
    hex: '#d97706',
    icon: Clock,
  },
  PROSES_PEMBANGUNAN: {
    label: 'Pembangunan',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-500',
    textClass: 'text-sky-700',
    hex: '#0284c7',
    icon: Hammer,
  },
  PROSES_KPR: {
    label: 'Proses KPR',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-500',
    textClass: 'text-indigo-700',
    hex: '#7c3aed',
    icon: ShieldCheck,
  },
  REALISASI_AKAD: {
    label: 'Realisasi Akad',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-500',
    textClass: 'text-rose-700',
    hex: '#e11d48',
    icon: Home,
  },
};

export const BLOCK_THEME: Record<BlockId, { label: string; count: number; hex: string; desc: string }> = {
  A: { label: 'Blok A (A.01 - A.13)', count: 13, hex: '#dc2626', desc: '13 Unit' },
  B: { label: 'Blok B (B.01 - B.21)', count: 21, hex: '#d97706', desc: '21 Unit' },
  C: { label: 'Blok C (C.01 - C.20)', count: 20, hex: '#059669', desc: '20 Unit' },
  D: { label: 'Blok D (D.01 - D.16)', count: 16, hex: '#2563eb', desc: '16 Unit' },
};

export const DEFAULT_UNIT_COORDINATES: Record<string, { x: number; y: number }> = {
  // BLOK A (13 Unit: A.01 - A.13) - Sisi Atas Jalan Utama 1
  'A.01': { x: 37.0, y: 14.5 },
  'A.02': { x: 40.5, y: 15.8 },
  'A.03': { x: 44.0, y: 17.2 },
  'A.04': { x: 47.5, y: 18.5 },
  'A.05': { x: 51.0, y: 19.8 },
  'A.06': { x: 54.5, y: 21.2 },
  'A.07': { x: 58.0, y: 22.5 },
  'A.08': { x: 61.5, y: 23.8 },
  'A.09': { x: 65.0, y: 25.2 },
  'A.10': { x: 68.5, y: 26.5 },
  'A.11': { x: 72.0, y: 27.8 },
  'A.12': { x: 75.5, y: 29.2 },
  'A.13': { x: 79.0, y: 30.5 },

  // BLOK B (21 Unit: B.01 - B.21) - Antara Jalan 1 dan Jalan 2
  // Baris Atas Blok B (Menghadap Jalan 1)
  'B.01': { x: 38.0, y: 24.5 },
  'B.02': { x: 41.5, y: 25.8 },
  'B.03': { x: 45.0, y: 27.2 },
  'B.04': { x: 48.5, y: 28.5 },
  'B.05': { x: 52.0, y: 29.8 },
  'B.06': { x: 55.5, y: 31.2 },
  'B.07': { x: 59.0, y: 32.5 },
  'B.08': { x: 62.5, y: 33.8 },
  'B.09': { x: 66.0, y: 35.2 },
  'B.10': { x: 69.5, y: 36.5 },
  'B.11': { x: 73.0, y: 37.8 },
  // Baris Bawah Blok B (Menghadap Jalan 2)
  'B.12': { x: 36.5, y: 35.5 },
  'B.13': { x: 40.5, y: 37.0 },
  'B.14': { x: 44.5, y: 38.5 },
  'B.15': { x: 48.5, y: 40.0 },
  'B.16': { x: 52.5, y: 41.5 },
  'B.17': { x: 56.5, y: 43.0 },
  'B.18': { x: 60.5, y: 44.5 },
  'B.19': { x: 64.5, y: 46.0 },
  'B.20': { x: 68.5, y: 47.5 },
  'B.21': { x: 72.5, y: 49.0 },

  // BLOK C (20 Unit: C.01 - C.20) - Antara Jalan 2 dan Jalan 3
  // Baris Atas Blok C (Menghadap Jalan 2)
  'C.01': { x: 35.0, y: 47.0 },
  'C.02': { x: 39.0, y: 48.5 },
  'C.03': { x: 43.0, y: 50.0 },
  'C.04': { x: 47.0, y: 51.5 },
  'C.05': { x: 51.0, y: 53.0 },
  'C.06': { x: 55.0, y: 54.5 },
  'C.07': { x: 59.0, y: 56.0 },
  'C.08': { x: 63.0, y: 57.5 },
  'C.09': { x: 67.0, y: 59.0 },
  'C.10': { x: 71.0, y: 60.5 },
  // Baris Bawah Blok C (Menghadap Jalan 3)
  'C.11': { x: 33.0, y: 57.5 },
  'C.12': { x: 37.0, y: 59.0 },
  'C.13': { x: 41.0, y: 60.5 },
  'C.14': { x: 45.0, y: 62.0 },
  'C.15': { x: 49.0, y: 63.5 },
  'C.16': { x: 53.0, y: 65.0 },
  'C.17': { x: 57.0, y: 66.5 },
  'C.18': { x: 61.0, y: 68.0 },
  'C.19': { x: 65.0, y: 69.5 },
  'C.20': { x: 69.0, y: 71.0 },

  // BLOK D (16 Unit: D.01 - D.16) - Antara Jalan 3 dan Jalan 4
  // Baris Atas Blok D (Menghadap Jalan 3)
  'D.01': { x: 31.0, y: 69.5 },
  'D.02': { x: 35.0, y: 71.0 },
  'D.03': { x: 39.0, y: 72.5 },
  'D.04': { x: 43.0, y: 74.0 },
  'D.05': { x: 47.0, y: 75.5 },
  'D.06': { x: 51.0, y: 77.0 },
  'D.07': { x: 55.0, y: 78.5 },
  'D.08': { x: 59.0, y: 80.0 },
  // Baris Bawah Blok D (Menghadap Jalan 4)
  'D.09': { x: 28.0, y: 78.0 },
  'D.10': { x: 32.0, y: 79.5 },
  'D.11': { x: 36.0, y: 81.0 },
  'D.12': { x: 40.0, y: 82.5 },
  'D.13': { x: 44.0, y: 84.0 },
  'D.14': { x: 48.0, y: 85.5 },
  'D.15': { x: 52.0, y: 87.0 },
  'D.16': { x: 56.0, y: 88.5 },
};

export default function SitePlanMasterplan({
  units,
  selectedUnit,
  onSelectUnit,
  statusFilter,
  setStatusFilter,
  blockFilter,
  setBlockFilter,
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
}: SitePlanMasterplanProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredUnit, setHoveredUnit] = useState<Unit | null>(null);
  const [siteplanImage, setSiteplanImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(16 / 9);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Pin tool mode: 'view' | 'add' | 'edit' | 'delete'
  const [pinToolMode, setPinToolMode] = useState<'view' | 'add' | 'edit' | 'delete'>('view');

  // Dragging pin state for Edit Mode ("menggeser pin sesuka hati")
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const dragStartInfo = useRef<{ startX: number; startY: number; moved: boolean } | null>(null);

  // Storage key for automatic calibration to denah numbers
  const CALIBRATION_STORAGE_KEY = 'sikpr_calibrated_denah_coords_v5';

  // Custom coordinates storage - otomatis pastikan nomor point berada tepat di atas nomor denah
  const [coordsMap, setCoordsMap] = useState<Record<string, { x: number; y: number }>>(() => {
    try {
      const isCalibrated = localStorage.getItem(CALIBRATION_STORAGE_KEY);
      if (!isCalibrated) {
        localStorage.setItem(CALIBRATION_STORAGE_KEY, 'true');
        localStorage.setItem('sikpr_custom_unit_coordinates', JSON.stringify(DEFAULT_UNIT_COORDINATES));
        return DEFAULT_UNIT_COORDINATES;
      }
      const saved = localStorage.getItem('sikpr_custom_unit_coordinates');
      return saved ? JSON.parse(saved) : DEFAULT_UNIT_COORDINATES;
    } catch {
      return DEFAULT_UNIT_COORDINATES;
    }
  });

  // Modal states for Pin Add / Edit
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [pendingAddCoords, setPendingAddCoords] = useState<{ x: number; y: number } | null>(null);
  const [newUnitId, setNewUnitId] = useState<string>('');
  const [newUnitBlock, setNewUnitBlock] = useState<BlockId>('A');
  const [newUnitStatus, setNewUnitStatus] = useState<UnitStatus>('TERSEDIA');

  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [editUnitNumber, setEditUnitNumber] = useState<string>('');
  const [editUnitStatus, setEditUnitStatus] = useState<UnitStatus>('TERSEDIA');
  const [isRelocatingPin, setIsRelocatingPin] = useState<boolean>(false);
  const [alignMessage, setAlignMessage] = useState<string | null>(null);

  // Otomatis posisikan koordinat titik nomor berada tepat di atas nomor pada denah kawasan
  const handleAutoAlignCoordinates = () => {
    setCoordsMap(DEFAULT_UNIT_COORDINATES);
    try {
      localStorage.setItem('sikpr_custom_unit_coordinates', JSON.stringify(DEFAULT_UNIT_COORDINATES));
      localStorage.setItem(CALIBRATION_STORAGE_KEY, 'true');
    } catch {}
    setAlignMessage('Posisi titik point otomatis berada tepat di atas nomor gambar denah kawasan!');
    setTimeout(() => {
      setAlignMessage(null);
    }, 3500);
  };

  useEffect(() => {
    localStorage.setItem('sikpr_custom_unit_coordinates', JSON.stringify(coordsMap));
  }, [coordsMap]);

  // Otomatis pastikan posisi titik point berada di atas nomor denah saat komponen pertama kali dimuat
  useEffect(() => {
    const isCalibrated = localStorage.getItem(CALIBRATION_STORAGE_KEY);
    if (!isCalibrated) {
      setCoordsMap(DEFAULT_UNIT_COORDINATES);
      localStorage.setItem(CALIBRATION_STORAGE_KEY, 'true');
      localStorage.setItem('sikpr_custom_unit_coordinates', JSON.stringify(DEFAULT_UNIT_COORDINATES));
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.removeItem('sikpr_custom_siteplan_jpeg');
    } catch {}

    let isMounted = true;
    let objectUrlToRevoke: string | null = null;

    loadSiteplanImageFromDB().then((url) => {
      if (isMounted && url) {
        objectUrlToRevoke = url;
        setSiteplanImage(url);
      }
    });

    return () => {
      isMounted = false;
      if (objectUrlToRevoke && objectUrlToRevoke.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, []);

  const filteredUnits = units.filter((u) => {
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchBlock = blockFilter === 'ALL' || u.block === blockFilter;
    return matchStatus && matchBlock;
  });

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.75, prev + delta), 2.2));
  };

  const resetZoom = () => setZoomLevel(1);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const previewUrl = URL.createObjectURL(file);
        setSiteplanImage(previewUrl);
        await saveSiteplanImageToDB(file);
        // Otomatis samakan letak koordinat nomor point dengan denah kawasan yang diunggah
        setCoordsMap(DEFAULT_UNIT_COORDINATES);
        try {
          localStorage.setItem('sikpr_custom_unit_coordinates', JSON.stringify(DEFAULT_UNIT_COORDINATES));
          localStorage.setItem(CALIBRATION_STORAGE_KEY, 'true');
        } catch {}
        setAlignMessage('Denah baru dimuat! Posisi titik point otomatis diselaraskan di atas nomor kavling denah.');
        setTimeout(() => setAlignMessage(null), 3500);
      } catch (err) {
        console.error('Error saving siteplan image:', err);
      }
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight && naturalHeight > 0) {
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  const handleRemoveCustomImage = async () => {
    await clearSiteplanImageFromDB();
    if (siteplanImage && siteplanImage.startsWith('blob:')) {
      URL.revokeObjectURL(siteplanImage);
    }
    setSiteplanImage(null);
    setAspectRatio(16 / 9);
  };

  // Canvas Click Handler (for Add Pin or Relocate Pin)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    const y = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

    if (pinToolMode === 'add') {
      setPendingAddCoords({ x, y });
      // Suggest next unit ID
      const countBlockA = units.filter((u) => u.block === 'A').length;
      setNewUnitId(`A.${countBlockA + 1 < 10 ? `0${countBlockA + 1}` : countBlockA + 1}`);
      setShowAddModal(true);
    } else if (isRelocatingPin && editingUnit) {
      // Relocate position
      setCoordsMap((prev) => ({
        ...prev,
        [editingUnit.id]: { x, y },
      }));
      setIsRelocatingPin(false);
    }
  };

  // Save new pin
  const handleSaveNewPin = () => {
    if (!newUnitId.trim() || !pendingAddCoords) return;

    const cleanId = newUnitId.trim().toUpperCase();
    const numPart = cleanId.split('.')[1] || cleanId;

    const newUnit: Unit = {
      id: cleanId,
      block: newUnitBlock,
      number: numPart,
      type: 'Tipe 36/60 Subsidi',
      luasBangunan: 36,
      luasTanah: 60,
      harga: 185000000,
      status: newUnitStatus,
      constructionProgress: newUnitStatus === 'REALISASI_AKAD' ? 100 : 30,
      constructionStage: newUnitStatus === 'REALISASI_AKAD' ? 'Siap BAST' : 'Pondasi',
      row: 0,
      col: 0,
    };

    setCoordsMap((prev) => ({
      ...prev,
      [cleanId]: pendingAddCoords,
    }));

    if (onAddUnit) {
      onAddUnit(newUnit, pendingAddCoords);
    }

    setShowAddModal(false);
    setPendingAddCoords(null);
    setPinToolMode('view');
  };

  // Free Drag & Drop Handlers for Edit Mode with high sensitivity & smooth window tracking
  const handlePinPointerDown = (unit: Unit, e: React.PointerEvent) => {
    if (pinToolMode !== 'edit') return;
    e.stopPropagation();
    // Only primary mouse button (0) or touch/pen
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    setDraggingPinId(unit.id);
    dragStartInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };

    const handleGlobalPointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartInfo.current || !canvasRef.current) return;

      const deltaX = Math.abs(moveEvent.clientX - dragStartInfo.current.startX);
      const deltaY = Math.abs(moveEvent.clientY - dragStartInfo.current.startY);
      if (deltaX > 2 || deltaY > 2) {
        dragStartInfo.current.moved = true;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // High-precision percentage position [0.5% - 99.5%]
        const x = Math.max(0.5, Math.min(99.5, Number((((moveEvent.clientX - rect.left) / rect.width) * 100).toFixed(1))));
        const y = Math.max(0.5, Math.min(99.5, Number((((moveEvent.clientY - rect.top) / rect.height) * 100).toFixed(1))));

        setCoordsMap((prev) => ({
          ...prev,
          [unit.id]: { x, y },
        }));
      }
    };

    const handleGlobalPointerUp = () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);

      const wasMoved = dragStartInfo.current?.moved;
      setDraggingPinId(null);
      dragStartInfo.current = null;

      // If user tapped/clicked without significant drag, open Edit modal for unit number/status
      if (!wasMoved) {
        setEditingUnit(unit);
        setEditUnitNumber(unit.number);
        setEditUnitStatus(unit.status);
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerup', handleGlobalPointerUp, { once: true });
    window.addEventListener('pointercancel', handleGlobalPointerUp, { once: true });
  };

  // Handle pin click depending on current mode
  const handlePinClick = (unit: Unit, e: React.MouseEvent) => {
    e.stopPropagation();

    if (pinToolMode === 'delete') {
      const confirmDelete = window.confirm(`Hapus pin Unit ${unit.id} dari denah kawasan?`);
      if (confirmDelete) {
        setCoordsMap((prev) => {
          const next = { ...prev };
          delete next[unit.id];
          return next;
        });
        if (onDeleteUnit) {
          onDeleteUnit(unit.id);
        }
      }
      return;
    }

    if (pinToolMode === 'edit') {
      // Handled via onPointerDown/Up for free drag & drop or click
      return;
    }

    // Default 'view' mode: open popup modal
    onSelectUnit(unit);
  };

  // Save edit pin
  const handleSaveEditPin = () => {
    if (!editingUnit) return;
    const updated: Unit = {
      ...editingUnit,
      number: editUnitNumber.trim() || editingUnit.number,
      status: editUnitStatus,
    };

    if (onUpdateUnit) {
      onUpdateUnit(updated);
    }
    setEditingUnit(null);
    setPinToolMode('view');
  };

  return (
    <div className="relative w-full flex flex-col bg-slate-900">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* GAMBAR DENAH KAWASAN - TEPAT DI BAWAH HEADER, FULL SCREEN AUTOFIT KANAN-KIRI, TINGGI MENYESUAIKAN JPEG */}
      <div className="relative w-full overflow-hidden select-none flex justify-center items-center bg-slate-900">
        <div
          className="relative transition-all duration-200 ease-out origin-top w-full flex items-center justify-center"
          style={{
            transform: zoomLevel !== 1 ? `scale(${zoomLevel})` : undefined,
          }}
        >
          {/* Site Plan Display Canvas / Image Holder */}
          <div 
            ref={canvasRef}
            onClick={handleCanvasClick}
            className={`relative w-full overflow-hidden flex items-center justify-center ${
              pinToolMode === 'add' || isRelocatingPin ? 'cursor-crosshair' : 'cursor-default'
            }`}
            style={!siteplanImage ? { aspectRatio: `${aspectRatio}` } : undefined}
          >
            {/* 1. If user loaded JPEG, render the exact JPEG with w-full h-auto */}
            {siteplanImage ? (
              <img
                src={siteplanImage}
                alt="Denah Kawasan Perumahan Asli"
                onLoad={handleImageLoad}
                className="w-full h-auto block select-none pointer-events-none"
              />
            ) : (
              /* 2. Default Vector Reproduction of the Siteplan */
              <div className="relative w-full h-full bg-[#1e462c] overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-80"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #275736 0, #275736 20px, #1c4228 20px, #1c4228 40px)`,
                  }}
                />

                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 675">
                  {/* Landscape sungai / danau samping */}
                  <path
                    d="M 1040,160 Q 1120,320 860,460 T 780,675 L 820,675 Q 940,560 1180,340 L 1200,160 Z"
                    fill="#3b82f6"
                    opacity="0.35"
                  />
                  {/* Jalan Akses Masuk Gerbang */}
                  <path
                    d="M 400,0 L 260,260 L 50,675 L 140,675 L 340,260 L 460,0 Z"
                    fill="#334155"
                  />
                  {/* Area Lahan Kawasan Perumahan */}
                  <polygon
                    points="370,50 1020,180 910,500 750,620 180,590 310,250"
                    fill="#1e293b"
                    opacity="0.95"
                  />
                  {/* Jalan Aspal Utama & Lingkungan */}
                  <line x1="430" y1="130" x2="1000" y2="240" stroke="#0f172a" strokeWidth="32" />
                  <line x1="390" y1="280" x2="890" y2="380" stroke="#0f172a" strokeWidth="30" />
                  <line x1="340" y1="430" x2="820" y2="520" stroke="#0f172a" strokeWidth="30" />
                  <line x1="290" y1="560" x2="740" y2="640" stroke="#0f172a" strokeWidth="28" />

                  {/* Marka Jalan Putus-Putus */}
                  <line x1="430" y1="130" x2="1000" y2="240" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />
                  <line x1="390" y1="280" x2="890" y2="380" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />
                  <line x1="340" y1="430" x2="820" y2="520" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />
                  <line x1="290" y1="560" x2="740" y2="640" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />

                  {/* Nama Jalan pada Gambar Denah */}
                  <text x="490" y="125" fill="#cbd5e1" fontSize="10" fontWeight="bold" letterSpacing="1" transform="rotate(11, 490, 125)">JL. UTAMA I (8M)</text>
                  <text x="450" y="275" fill="#cbd5e1" fontSize="10" fontWeight="bold" letterSpacing="1" transform="rotate(11, 450, 275)">JL. FLAMBOYAN II (6M)</text>
                  <text x="410" y="425" fill="#cbd5e1" fontSize="10" fontWeight="bold" letterSpacing="1" transform="rotate(11, 410, 425)">JL. MELATI III (6M)</text>
                  <text x="360" y="555" fill="#cbd5e1" fontSize="10" fontWeight="bold" letterSpacing="1" transform="rotate(11, 360, 555)">JL. MAWAR IV (6M)</text>

                  {/* Gerbang Utama & Pos Keamanan */}
                  <rect x="235" y="270" width="75" height="28" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="272" y="287" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">GERBANG UTAMA</text>
                  <rect x="180" y="320" width="60" height="24" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5" />
                  <text x="210" y="335" textAnchor="middle" fill="#22c55e" fontSize="8" fontWeight="bold">POS SATPAM</text>

                  {/* Kavling Rumah dan Nomor Asli pada Gambar Denah */}
                  {Object.entries(DEFAULT_UNIT_COORDINATES).map(([id, coord]) => {
                    const cx = (coord.x / 100) * 1200;
                    const cy = (coord.y / 100) * 675;
                    const unitNum = id.includes('.') ? id.split('.')[1] : id;
                    return (
                      <g key={`lot-${id}`}>
                        <rect
                          x={cx - 15}
                          y={cy - 15}
                          width="30"
                          height="30"
                          rx="3"
                          fill="#334155"
                          stroke="#475569"
                          strokeWidth="1"
                        />
                        {/* Garis atap kavling */}
                        <line x1={cx - 15} y1={cy - 15} x2={cx + 15} y2={cy + 15} stroke="#1e293b" strokeWidth="0.5" opacity="0.5" />
                        <line x1={cx + 15} y1={cy - 15} x2={cx - 15} y2={cy + 15} stroke="#1e293b" strokeWidth="0.5" opacity="0.5" />
                        {/* Nomor kavling pada denah background */}
                        <text
                          x={cx}
                          y={cy + 3}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {unitNum}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* INTERACTIVE PINS: Titik bulat dan nomor di dalamnya saja + Bebas Geser di Mode Edit */}
            {units.map((unit) => {
              const coords = coordsMap[unit.id] || { x: 50, y: 50 };
              const isFiltered = filteredUnits.some((u) => u.id === unit.id);
              const isSelected = selectedUnit?.id === unit.id;
              const statusCfg = STATUS_CONFIG[unit.status] || STATUS_CONFIG['TERSEDIA'];
              const isDraggingThis = draggingPinId === unit.id;

              // Extract clean number to fit comfortably in the circle
              const displayNumber = unit.number.includes('.')
                ? unit.number.split('.')[1]
                : unit.number;

              return (
                <button
                  key={unit.id}
                  type="button"
                  onClick={(e) => handlePinClick(unit, e)}
                  onPointerDown={(e) => handlePinPointerDown(unit, e)}
                  onMouseEnter={() => !draggingPinId && setHoveredUnit(unit)}
                  onMouseLeave={() => setHoveredUnit(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center group touch-none select-none transition-transform ${
                    isDraggingThis
                      ? 'scale-150 z-50 cursor-grabbing shadow-2xl'
                      : isSelected
                      ? 'scale-125 z-40'
                      : pinToolMode === 'edit'
                      ? 'hover:scale-130 z-30 cursor-grab active:cursor-grabbing'
                      : 'hover:scale-120 hover:z-30 cursor-pointer'
                  } ${isFiltered ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                  }}
                  title={
                    pinToolMode === 'edit'
                      ? `Unit ${unit.id}: Sentuh/klik & geser sesuka hati untuk memindahkan posisi di denah`
                      : `Unit ${unit.id} - ${statusCfg.label}`
                  }
                >
                  {/* Lingkaran sentuh visual di Mode Edit agar sangat peka & mudah di-klik/geser */}
                  {pinToolMode === 'edit' && (
                    <span className="absolute inset-0.5 rounded-full bg-blue-500/15 border border-blue-400/50 pointer-events-none transition-all group-hover:bg-blue-500/25 group-hover:scale-110" />
                  )}

                  {/* Titik bulat dan nomor di dalamnya saja - ukuran visual tetap mungil dan presisi 11px */}
                  <div
                    className={`w-[11px] h-[11px] rounded-full flex items-center justify-center font-mono font-black text-[6px] leading-none border-[0.5px] border-white shadow-2xs select-none pointer-events-none transition-all ${
                      isDraggingThis
                        ? 'ring-2 ring-blue-500 shadow-xl scale-160'
                        : isSelected
                        ? 'ring-1.5 ring-slate-900 shadow-md scale-130 z-30'
                        : pinToolMode === 'delete'
                        ? 'hover:ring-1.5 hover:ring-red-600'
                        : pinToolMode === 'edit'
                        ? 'ring-1.5 ring-blue-500 hover:ring-2 hover:ring-blue-600 hover:scale-125'
                        : 'group-hover:ring-1 group-hover:ring-white group-hover:scale-125'
                    }`}
                    style={{
                      backgroundColor: statusCfg.hex,
                      color: '#ffffff',
                    }}
                  >
                    <span className="leading-none text-center transform scale-95 pointer-events-none">{displayNumber}</span>
                  </div>
                </button>
              );
            })}

            {/* Hover Tooltip Overlay */}
            {hoveredUnit && pinToolMode === 'view' && !draggingPinId && (
              <div 
                className="absolute z-50 bg-white/95 border border-slate-200 p-2.5 rounded-xl shadow-xl backdrop-blur pointer-events-none flex items-center gap-2.5 transition-opacity"
                style={{
                  left: `${Math.min(Math.max((coordsMap[hoveredUnit.id]?.x || 50), 15), 75)}%`,
                  top: `${Math.min((coordsMap[hoveredUnit.id]?.y || 50) + 6, 82)}%`,
                }}
              >
                <div
                  className="w-2.5 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_CONFIG[hoveredUnit.status]?.hex || '#059669' }}
                />
                <div className="text-left text-xs whitespace-nowrap">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="font-mono text-xs">{hoveredUnit.id}</span>
                    <span className="text-[10px] font-normal text-slate-500">({hoveredUnit.type})</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    Status: <strong style={{ color: STATUS_CONFIG[hoveredUnit.status]?.hex }}>{STATUS_CONFIG[hoveredUnit.status]?.label}</strong>
                  </div>
                  {hoveredUnit.customerName ? (
                    <div className="text-slate-500 text-[10px]">
                      Pemohon: <span className="text-slate-900 font-medium">{hoveredUnit.customerName}</span>
                    </div>
                  ) : (
                    <div className="text-emerald-700 text-[10px] font-semibold">Tersedia untuk Booking</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION JUDUL & MENU EDIT DI BAWAH GAMBAR DENAH */}
      <div className="w-full bg-white border-t border-slate-200 px-3 py-4 space-y-3.5">
        {/* 1. Judul Denah Kawasan - Border Sendiri Berwarna Biru Gradasi Ungu */}
        <div className="flex justify-center items-center">
          <div className="p-[2px] rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xs">
            <div className="flex items-center gap-2.5 px-6 py-2 rounded-[14px] bg-white">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
                Denah Kawasan
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xs">
                {units.length} Unit
              </span>
            </div>
          </div>
        </div>

        {/* 2. Menu Edit di Bawahnya */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Tool Mode: View/Select */}
          <button
            onClick={() => {
              setPinToolMode('view');
              setIsRelocatingPin(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              pinToolMode === 'view'
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-700 hover:text-slate-900 border-slate-300 hover:bg-slate-100'
            }`}
            title="Mode Lihat Detail Unit"
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>Pilih Unit</span>
          </button>

          {/* Button: Tambah Pin */}
          <button
            onClick={() => {
              setPinToolMode(pinToolMode === 'add' ? 'view' : 'add');
              setIsRelocatingPin(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              pinToolMode === 'add'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs ring-2 ring-emerald-300'
                : 'bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-400'
            }`}
            title="Klik pada denah untuk menambah pin baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pin</span>
          </button>

          {/* Button: Edit Pin */}
          <button
            onClick={() => {
              setPinToolMode(pinToolMode === 'edit' ? 'view' : 'edit');
              setIsRelocatingPin(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              pinToolMode === 'edit'
                ? 'bg-blue-600 text-white border-blue-600 shadow-2xs ring-2 ring-blue-300'
                : 'bg-white text-blue-700 hover:bg-blue-50 border-blue-400'
            }`}
            title="Sentuh & geser pin di denah"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Pin</span>
          </button>

          {/* Button: Hapus Pin */}
          <button
            onClick={() => {
              setPinToolMode(pinToolMode === 'delete' ? 'view' : 'delete');
              setIsRelocatingPin(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              pinToolMode === 'delete'
                ? 'bg-red-600 text-white border-red-600 shadow-2xs ring-2 ring-red-300'
                : 'bg-white text-red-700 hover:bg-red-50 border-red-300'
            }`}
            title="Klik pin yang ingin dihapus dari denah"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Pin</span>
          </button>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Tombol Otomatis Samakan Letak Point dengan Denah */}
          <button
            onClick={handleAutoAlignCoordinates}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-bold shadow-2xs transition-all active:scale-95"
            title="Otomatis posisikan seluruh titik point tepat di atas nomor kavling pada gambar denah kawasan"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-700" />
            <span>Otomatiskan ke Nomor Denah</span>
          </button>

          {/* Load/Upload JPEG button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
            title="Ganti/Pilih gambar JPEG denah"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload JPEG</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-white rounded-xl border border-slate-300 p-0.5 gap-0.5 shadow-2xs">
            <button
              onClick={resetZoom}
              className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                zoomLevel === 1
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Autofit Tampilan"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="text-[10px]">Fit</span>
            </button>
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1 text-slate-600 hover:text-slate-900 rounded-md"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1 text-slate-600 hover:text-slate-900 rounded-md"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Mode Notice Banner */}
        {pinToolMode !== 'view' && (
          <div className={`max-w-2xl mx-auto px-4 py-2.5 text-xs font-medium rounded-xl shadow-xs flex items-center justify-between border animate-in fade-in ${
            pinToolMode === 'add'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : pinToolMode === 'edit'
              ? 'bg-blue-50 text-blue-900 border-blue-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {pinToolMode === 'add' && <span>⚡ <strong>Mode Tambah Pin:</strong> Klik pada denah di lokasi rumah yang ingin dipasang pin.</span>}
              {pinToolMode === 'edit' && (
                <span className="flex items-center gap-2 flex-wrap">
                  <span>✏️ <strong>Mode Edit Pin:</strong> Sentuh/klik & geser pin sesuka hati di denah.</span>
                  <button
                    onClick={handleAutoAlignCoordinates}
                    className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Otomatiskan ke Nomor Denah</span>
                  </button>
                </span>
              )}
              {pinToolMode === 'delete' && <span>🗑️ <strong>Mode Hapus Pin:</strong> Klik pin yang ingin dihapus dari denah.</span>}
            </div>
            <button
              onClick={() => {
                setPinToolMode('view');
                setIsRelocatingPin(false);
              }}
              className="text-xs bg-white text-slate-900 px-3 py-1 rounded-lg font-bold border border-slate-300 shadow-2xs hover:bg-slate-100"
            >
              Selesai
            </button>
          </div>
        )}

        {/* Toast Notifikasi Penyesuaian Otomatis */}
        {alignMessage && (
          <div className="max-w-md mx-auto px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-between gap-2 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-white shrink-0" />
              <span>{alignMessage}</span>
            </div>
            <button onClick={() => setAlignMessage(null)} className="text-white/80 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Keterangan Status di Bawah Gambar Denah Kawasan */}
      <div className="px-3.5 py-2.5 bg-white border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 shrink-0">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Keterangan Status Unit:</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-center gap-2 text-xs flex-1 md:justify-end">
            {Object.entries(STATUS_CONFIG).map(([stKey, stCfg]) => {
              const count = units.filter((u) => u.status === stKey).length;
              return (
                <div
                  key={stKey}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs hover:bg-slate-100/90 transition-colors"
                >
                  {/* Titik bulat dengan nomor contoh di dalamnya */}
                  <div
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-black text-[7px] text-white shadow-2xs shrink-0 border border-white"
                    style={{ backgroundColor: stCfg.hex }}
                  >
                    01
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-slate-900 text-[11px]">
                      {stCfg.label}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {count} Unit
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Tambah Pin Baru */}
      {showAddModal && pendingAddCoords && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Tambah Pin Unit Baru
                </h4>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-500">
              Posisi di denah: <strong className="font-mono text-slate-800">X: {pendingAddCoords.x}%, Y: {pendingAddCoords.y}%</strong>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Preview Titik Pin */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-600">Preview Tampilan Titik:</span>
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-black text-[7px] border border-white shadow-xs text-white"
                  style={{ backgroundColor: STATUS_CONFIG[newUnitStatus]?.hex || '#059669' }}
                >
                  {newUnitId.includes('.') ? newUnitId.split('.')[1] : newUnitId || '01'}
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-medium mb-1">
                  Nomor Unit (Contoh: A.14, B.22, 14):
                </label>
                <input
                  type="text"
                  value={newUnitId}
                  onChange={(e) => setNewUnitId(e.target.value)}
                  placeholder="Contoh: A.14"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-700 block font-medium mb-1">
                    Blok:
                  </label>
                  <select
                    value={newUnitBlock}
                    onChange={(e) => setNewUnitBlock(e.target.value as BlockId)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="A">Blok A (Merah)</option>
                    <option value="B">Blok B (Oranye)</option>
                    <option value="C">Blok C (Hijau)</option>
                    <option value="D">Blok D (Biru)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block font-medium mb-1">
                    Status Awal:
                  </label>
                  <select
                    value={newUnitStatus}
                    onChange={(e) => setNewUnitStatus(e.target.value as UnitStatus)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    {Object.entries(STATUS_CONFIG).map(([stKey, stCfg]) => (
                      <option key={stKey} value={stKey}>
                        {stCfg.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-1.5 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNewPin}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pin</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Pin */}
      {editingUnit && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Edit Pin Unit {editingUnit.id}
                </h4>
              </div>
              <button
                onClick={() => setEditingUnit(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Preview Titik Pin */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-medium text-slate-600">Preview Tampilan Titik:</span>
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono font-black text-[7px] border border-white shadow-xs text-white"
                  style={{ backgroundColor: STATUS_CONFIG[editUnitStatus]?.hex || '#059669' }}
                >
                  {editUnitNumber || editingUnit.number}
                </div>
              </div>

              <div>
                <label className="text-slate-700 block font-medium mb-1">
                  Nomor Tampilan di Titik (Contoh: 01, 14):
                </label>
                <input
                  type="text"
                  value={editUnitNumber}
                  onChange={(e) => setEditUnitNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-slate-700 block font-medium mb-1">
                  Status Unit:
                </label>
                <select
                  value={editUnitStatus}
                  onChange={(e) => setEditUnitStatus(e.target.value as UnitStatus)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  {Object.entries(STATUS_CONFIG).map(([stKey, stCfg]) => (
                    <option key={stKey} value={stKey}>
                      {stCfg.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Geser Posisi Pin */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Posisi Koordinat Pin Saat Ini:
                </span>
                <div className="text-[11px] text-slate-600 font-mono">
                  X: {coordsMap[editingUnit.id]?.x || 50}%, Y: {coordsMap[editingUnit.id]?.y || 50}%
                </div>
                <button
                  onClick={() => {
                    setIsRelocatingPin(true);
                    setEditingUnit(null);
                  }}
                  className="w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <MousePointer className="w-3 h-3" />
                  <span>Klik di Denah untuk Pindahkan Posisi</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  if (window.confirm(`Hapus pin Unit ${editingUnit.id}?`)) {
                    setCoordsMap((prev) => {
                      const next = { ...prev };
                      delete next[editingUnit.id];
                      return next;
                    });
                    if (onDeleteUnit) {
                      onDeleteUnit(editingUnit.id);
                    }
                    setEditingUnit(null);
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1 border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Pin</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingUnit(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEditPin}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
