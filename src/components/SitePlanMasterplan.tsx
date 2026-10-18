import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Unit, UnitStatus, BlockId, KprApplication, NotificationItem, UserRole } from '../types';
import { 
  Compass, 
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
  Move,
  Building2,
  FileText,
  MessageSquare,
  Settings,
  Sparkles,
  RotateCcw,
  MapPin,
  ExternalLink,
  Navigation,
  Copy
} from 'lucide-react';
import { 
  saveSiteplanImageToDB, 
  loadSiteplanImageFromDB, 
  clearSiteplanImageFromDB 
} from '../utils/imageStorage';
import { DEFAULT_SITEPLAN_SVG, convertSvgToJpegDataUrl } from '../utils/defaultSiteplanSvg';
import UnitStatusTableModal from './UnitStatusTableModal';
import CustomerDetailModal from './CustomerDetailModal';
import NotificationCenter from './NotificationCenter';

interface SitePlanMasterplanProps {
  units: Unit[];
  applications?: KprApplication[];
  selectedUnit: Unit | null;
  onSelectUnit: (unit: Unit) => void;
  statusFilter: UnitStatus | 'ALL';
  setStatusFilter: (status: UnitStatus | 'ALL') => void;
  blockFilter: BlockId | 'ALL';
  setBlockFilter: (block: BlockId | 'ALL') => void;
  onAddUnit?: (newUnit: Unit, coords: { x: number; y: number }) => void;
  onUpdateUnit?: (updatedUnit: Unit, coords?: { x: number; y: number }) => void;
  onDeleteUnit?: (unitId: string) => void;
  onOpenCustomerDoc?: (unit: Unit, app: KprApplication) => void;
  housingName?: string;
  housingAddress?: string;
  appTitle?: string;
  onOpenTab?: (tab: 'masterplan' | 'pemberkasan' | 'whatsapp' | 'settings') => void;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  notifications?: NotificationItem[];
  onTriggerSimulatedEvent?: () => void;
  onMarkNotificationAsRead?: (id: string) => void;
  onMarkAllNotificationsAsRead?: () => void;
  activeToast?: NotificationItem | null;
  onDismissToast?: () => void;
  onClearHistory?: () => void;
  onSelectUnitById?: (unitId: string) => void;
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
  A: { label: 'Blok A', count: 13, hex: '#dc2626', desc: '13 Unit (A.01 - A.13)' },
  B: { label: 'Blok B', count: 21, hex: '#d97706', desc: '21 Unit (B.01 - B.21)' },
  C: { label: 'Blok C', count: 20, hex: '#059669', desc: '20 Unit (C.01 - C.20)' },
  D: { label: 'Blok D', count: 16, hex: '#2563eb', desc: '16 Unit (D.01 - D.16)' },
};

// Calibrated percentage coordinates for the vertical/portrait denah kawasan (70 Units)
export const DEFAULT_UNIT_COORDINATES: Record<string, { x: number; y: number }> = {
  // BLOK A (13 Unit: A.01 - A.13) - Atap Merah
  'A.01': { x: 33.2, y: 18.2 },
  'A.02': { x: 38.2, y: 19.5 },
  'A.03': { x: 43.2, y: 20.8 },
  'A.04': { x: 48.2, y: 22.1 },
  'A.05': { x: 53.2, y: 23.4 },
  'A.06': { x: 58.2, y: 24.7 },
  'A.07': { x: 63.2, y: 26.0 },
  'A.08': { x: 68.0, y: 27.3 },
  'A.09': { x: 72.8, y: 28.6 },
  'A.10': { x: 77.8, y: 29.9 },
  'A.11': { x: 82.6, y: 31.2 },
  'A.12': { x: 87.4, y: 32.5 },
  'A.13': { x: 92.2, y: 33.8 },

  // BLOK B (21 Unit: B.01 - B.21) - Atap Oranye
  'B.01': { x: 27.0, y: 33.4 },
  'B.02': { x: 29.0, y: 30.9 },
  'B.03': { x: 31.0, y: 28.4 },
  'B.04': { x: 37.5, y: 30.1 },
  'B.05': { x: 43.0, y: 31.5 },
  'B.06': { x: 48.5, y: 32.9 },
  'B.07': { x: 54.0, y: 34.3 },
  'B.08': { x: 59.5, y: 35.7 },
  'B.09': { x: 65.0, y: 37.1 },
  'B.10': { x: 70.5, y: 38.5 },
  'B.11': { x: 76.0, y: 39.9 },
  'B.12': { x: 81.5, y: 41.3 },
  'B.13': { x: 79.0, y: 46.1 },
  'B.14': { x: 73.5, y: 44.7 },
  'B.15': { x: 68.0, y: 43.3 },
  'B.16': { x: 62.5, y: 41.9 },
  'B.17': { x: 57.0, y: 40.5 },
  'B.18': { x: 51.5, y: 39.1 },
  'B.19': { x: 46.0, y: 37.7 },
  'B.20': { x: 40.5, y: 36.3 },
  'B.21': { x: 35.0, y: 34.9 },

  // BLOK C (20 Unit: C.01 - C.20) - Atap Hijau
  'C.01': { x: 27.5, y: 44.4 },
  'C.02': { x: 33.0, y: 45.8 },
  'C.03': { x: 38.5, y: 47.2 },
  'C.04': { x: 44.0, y: 48.6 },
  'C.05': { x: 49.5, y: 50.0 },
  'C.06': { x: 55.0, y: 51.4 },
  'C.07': { x: 60.5, y: 52.8 },
  'C.08': { x: 66.0, y: 54.2 },
  'C.09': { x: 71.5, y: 55.6 },
  'C.10': { x: 77.0, y: 57.0 },
  'C.11': { x: 74.5, y: 61.8 },
  'C.12': { x: 69.0, y: 60.4 },
  'C.13': { x: 63.5, y: 59.0 },
  'C.14': { x: 58.0, y: 57.6 },
  'C.15': { x: 52.5, y: 56.2 },
  'C.16': { x: 47.0, y: 54.8 },
  'C.17': { x: 41.5, y: 53.4 },
  'C.18': { x: 36.0, y: 52.0 },
  'C.19': { x: 30.5, y: 50.6 },
  'C.20': { x: 25.0, y: 49.2 },

  // BLOK D (16 Unit: D.01 - D.16) - Atap Biru
  'D.01': { x: 23.5, y: 58.7 },
  'D.02': { x: 29.0, y: 60.1 },
  'D.03': { x: 34.5, y: 61.5 },
  'D.04': { x: 40.0, y: 62.9 },
  'D.05': { x: 45.5, y: 64.3 },
  'D.06': { x: 51.0, y: 65.7 },
  'D.07': { x: 56.5, y: 67.1 },
  'D.08': { x: 62.0, y: 68.5 },
  'D.09': { x: 59.5, y: 73.3 },
  'D.10': { x: 54.0, y: 71.9 },
  'D.11': { x: 48.5, y: 70.5 },
  'D.12': { x: 43.0, y: 69.1 },
  'D.13': { x: 37.5, y: 67.7 },
  'D.14': { x: 32.0, y: 66.3 },
  'D.15': { x: 26.5, y: 64.9 },
  'D.16': { x: 21.0, y: 63.5 },
};

export default function SitePlanMasterplan({
  units,
  applications = [],
  selectedUnit,
  onSelectUnit,
  statusFilter,
  setStatusFilter,
  blockFilter,
  setBlockFilter,
  onAddUnit,
  onUpdateUnit,
  onDeleteUnit,
  housingName = 'Grand Surya Estate',
  housingAddress = 'Jl. Raya Cikarang - Cibarusah, Cikarang Selatan, Bekasi, Jawa Barat',
  appTitle = 'SI-KPR PRIMA',
  onOpenTab,
  currentRole = 'ADMIN_LEGAL',
  onRoleChange,
  notifications = [],
  onTriggerSimulatedEvent,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  activeToast,
  onDismissToast,
  onClearHistory,
  onSelectUnitById,
}: SitePlanMasterplanProps) {
  // Masterplan default JPEG image state
  const [siteplanImage, setSiteplanImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1000 / 1780);

  // Hover and selection
  const [hoveredUnit, setHoveredUnit] = useState<Unit | null>(null);

  // Halaman Map Modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [copiedCoord, setCopiedCoord] = useState<boolean>(false);

  // DOM Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Modals state
  const [statusModalKey, setStatusModalKey] = useState<UnitStatus | null>(null);
  const [selectedCustomerData, setSelectedCustomerData] = useState<{ unit: Unit; app: KprApplication } | null>(null);

  // Drag & drop mode: 'view' | 'edit' | 'add' | 'delete'
  const [pinToolMode, setPinToolMode] = useState<'view' | 'edit' | 'add' | 'delete'>('view');

  // Dragging pin state
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const [dragCurrentCoords, setDragCurrentCoords] = useState<{ x: number; y: number } | null>(null);
  const dragStartInfo = useRef<{ startX: number; startY: number; moved: boolean } | null>(null);

  // Storage key for calibrated coordinates
  const CALIBRATION_STORAGE_KEY = 'sikpr_calibrated_coords_v8_portrait';

  // Custom coordinates storage
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
  const [alignMessage, setAlignMessage] = useState<string | null>(null);

  // 1. INITIALIZE DEFAULT JPEG SITEPLAN & LOAD PERSISTED IMAGES
  useEffect(() => {
    let isMounted = true;
    let objectUrlToRevoke: string | null = null;

    loadSiteplanImageFromDB().then(async (url) => {
      if (!isMounted) return;
      if (url) {
        objectUrlToRevoke = url;
        setSiteplanImage(url);
      } else {
        // Convert the default masterplan SVG into a high-res JPEG Data URL
        const defaultJpeg = await convertSvgToJpegDataUrl(DEFAULT_SITEPLAN_SVG, 1200, 2136);
        if (isMounted) {
          setSiteplanImage(defaultJpeg);
        }
      }
    });

    return () => {
      isMounted = false;
      if (objectUrlToRevoke && objectUrlToRevoke.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrlToRevoke);
      }
    };
  }, []);

  // Save coordinates whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('sikpr_custom_unit_coordinates', JSON.stringify(coordsMap));
    } catch {}
  }, [coordsMap]);


  // Otomatis posisikan koordinat titik nomor berada tepat di atas nomor pada denah kawasan
  const handleAutoAlignCoordinates = () => {
    setCoordsMap(DEFAULT_UNIT_COORDINATES);
    try {
      localStorage.setItem('sikpr_custom_unit_coordinates', JSON.stringify(DEFAULT_UNIT_COORDINATES));
      localStorage.setItem(CALIBRATION_STORAGE_KEY, 'true');
    } catch {}
    setAlignMessage('Posisi titik point otomatis dipaskan tepat di atas nomor denah kawasan!');
    setTimeout(() => {
      setAlignMessage(null);
    }, 3500);
  };

  // Upload custom siteplan JPEG image
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const previewUrl = URL.createObjectURL(file);
        setSiteplanImage(previewUrl);
        await saveSiteplanImageToDB(file);
        setAlignMessage('Gambar denah kawasan (JPEG) berhasil dimuat & dijadikan default!');
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

  const handleResetToDefaultJpeg = async () => {
    await clearSiteplanImageFromDB();
    const defaultJpeg = await convertSvgToJpegDataUrl(DEFAULT_SITEPLAN_SVG, 1200, 2136);
    setSiteplanImage(defaultJpeg);
    setAspectRatio(1000 / 1780);
    handleAutoAlignCoordinates();
    setAlignMessage('Gambar denah kawasan dikembalikan ke JPEG standar.');
    setTimeout(() => setAlignMessage(null), 3500);
  };

  // =========================================================================
  // DRAG & DROP TITIK POINT TO ADJUST PLACEMENT (No Zoom/Pan Interference)
  // =========================================================================
  const handlePinPointerDown = (unit: Unit, e: React.PointerEvent) => {
    e.stopPropagation();
    // Only primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const currentCoords = coordsMap[unit.id] || DEFAULT_UNIT_COORDINATES[unit.id] || { x: 50, y: 50 };
    setDraggingPinId(unit.id);
    setDragCurrentCoords(currentCoords);

    dragStartInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };

    const handlePointerMove = (moveEv: PointerEvent) => {
      if (!dragStartInfo.current || !canvasRef.current) return;

      const deltaX = Math.abs(moveEv.clientX - dragStartInfo.current.startX);
      const deltaY = Math.abs(moveEv.clientY - dragStartInfo.current.startY);
      if (deltaX > 2 || deltaY > 2) {
        dragStartInfo.current.moved = true;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const x = Math.max(0.5, Math.min(99.5, Number((((moveEv.clientX - rect.left) / rect.width) * 100).toFixed(1))));
        const y = Math.max(0.5, Math.min(99.5, Number((((moveEv.clientY - rect.top) / rect.height) * 100).toFixed(1))));

        setDragCurrentCoords({ x, y });
        setCoordsMap((prev) => ({
          ...prev,
          [unit.id]: { x, y },
        }));
      }
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      const wasMoved = dragStartInfo.current?.moved;
      setDraggingPinId(null);
      setDragCurrentCoords(null);
      dragStartInfo.current = null;

      if (wasMoved) {
        // Persist immediately to localStorage
        const latestCoords = coordsMap[unit.id];
        if (latestCoords && onUpdateUnit) {
          onUpdateUnit(unit, latestCoords);
        }
        setAlignMessage(`Posisi titik Unit ${unit.id} berhasil disesuaikan & disimpan!`);
        setTimeout(() => setAlignMessage(null), 3000);
      } else {
        // Normal click behavior: select unit or open edit
        if (pinToolMode === 'delete') {
          const confirmDelete = window.confirm(`Hapus pin Unit ${unit.id} dari denah?`);
          if (confirmDelete) {
            setCoordsMap((prev) => {
              const next = { ...prev };
              delete next[unit.id];
              return next;
            });
            if (onDeleteUnit) onDeleteUnit(unit.id);
          }
        } else if (pinToolMode === 'edit') {
          setEditingUnit(unit);
          setEditUnitNumber(unit.number);
          setEditUnitStatus(unit.status);
        } else {
          onSelectUnit(unit);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { once: true });
    window.addEventListener('pointercancel', handlePointerUp, { once: true });
  };

  // Canvas Click (for Add Pin mode)
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (pinToolMode !== 'add' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1));
    const y = Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1));

    setPendingAddCoords({ x, y });
    const countBlockA = units.filter((u) => u.block === 'A').length;
    setNewUnitId(`A.${countBlockA + 1 < 10 ? `0${countBlockA + 1}` : countBlockA + 1}`);
    setShowAddModal(true);
  };

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
  };

  // Browser Fullscreen F11 Toggle
  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };


  const filteredUnits = units.filter((u) => {
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchBlock = blockFilter === 'ALL' || u.block === blockFilter;
    return matchStatus && matchBlock;
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col select-none">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileChange}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* =========================================================================
          1. FLOATING TOP HUD NAVBAR OVERLAY
         ========================================================================= */}
      <header className="absolute top-3 left-3 right-3 z-30 pointer-events-none flex items-center justify-between gap-2.5">
        {/* LEFT HUD: Hanya Tampil Logo (Dropdown & Ikon Panah Dihapus) */}
        <div className="pointer-events-auto shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 text-white backdrop-blur-md border border-slate-700/80 shadow-2xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-black tracking-tight text-white leading-tight">
              {appTitle}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">
              {units.length} Kavling
            </span>
          </div>
        </div>

        {/* CENTER HUD: Nama Perumahan & Ikon Lokasi (Klik Diarahkan ke Halaman Map) */}
        <div className="pointer-events-auto flex items-center justify-center">
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="group flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white backdrop-blur-md border border-slate-700/90 hover:border-emerald-500/60 shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            title="Klik untuk diarahkan ke Halaman Peta Lokasi & Navigasi GPS"
          >
            <span className="relative flex h-2.5 w-2.5 items-center justify-center shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <MapPin className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors shrink-0" />
            <div className="text-left flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  {housingName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full ml-1">
                  <Navigation className="w-2.5 h-2.5" />
                  <span>Peta Lokasi</span>
                </span>
              </div>
              {housingAddress && (
                <span className="text-[10px] text-slate-400 truncate max-w-[160px] sm:max-w-[260px] hidden md:block leading-tight">
                  {housingAddress}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* RIGHT HUD: Quick Filter Blok & Navigasi Tab */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Quick Block Filter Pills */}
          <div className="hidden xl:flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/90 rounded-2xl p-1 shadow-2xl gap-1">
            <button
              onClick={() => setBlockFilter('ALL')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                blockFilter === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            {(['A', 'B', 'C', 'D'] as BlockId[]).map((blk) => {
              const th = BLOCK_THEME[blk];
              const isAct = blockFilter === blk;
              return (
                <button
                  key={blk}
                  onClick={() => setBlockFilter(blk)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                    isAct ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                  style={isAct ? { borderLeft: `3px solid ${th.hex}` } : undefined}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: th.hex }} />
                  <span>{blk}</span>
                </button>
              );
            })}
          </div>

          {/* Direct Tab: Data Konsumen */}
          <button
            onClick={() => onOpenTab?.('pemberkasan')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Buka Data Konsumen & Verifikasi Berkas KPR"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Konsumen</span>
          </button>

          {/* Direct Tab: WhatsApp */}
          <button
            onClick={() => onOpenTab?.('whatsapp')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition-all active:scale-95"
            title="Pengingat WhatsApp Otomatis"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          {/* Direct Tab: Settings */}
          <button
            onClick={() => onOpenTab?.('settings')}
            className="p-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/90 text-xs shadow-2xl backdrop-blur-md transition-all active:scale-95 flex items-center justify-center"
            title="Pengaturan Sistem KPR"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {onRoleChange && (
            <div className="hidden lg:flex items-center bg-slate-900/90 backdrop-blur-md border border-slate-700/90 rounded-2xl p-1 text-xs text-white shadow-2xl">
              <button
                onClick={() => onRoleChange('ADMIN_LEGAL')}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  currentRole === 'ADMIN_LEGAL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚖️ Legal
              </button>
              <button
                onClick={() => onRoleChange('MARKETING')}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  currentRole === 'MARKETING'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💼 Marketing
              </button>
            </div>
          )}

          {onTriggerSimulatedEvent && (
            <button
              onClick={() => onTriggerSimulatedEvent()}
              className="p-2 rounded-2xl bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-400/30 text-xs shadow-2xl backdrop-blur-md transition-all active:scale-95 hidden sm:flex"
              title="Simulasikan pembaruan dokumen real-time"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}

          {onMarkNotificationAsRead && onMarkAllNotificationsAsRead && onSelectUnitById && onTriggerSimulatedEvent && onDismissToast && (
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={onMarkNotificationAsRead}
              onMarkAllAsRead={onMarkAllNotificationsAsRead}
              onSelectUnitById={onSelectUnitById}
              onTriggerSimulatedEvent={onTriggerSimulatedEvent}
              activeToast={activeToast || null}
              onDismissToast={onDismissToast}
              onClearHistory={onClearHistory}
            />
          )}
        </div>
      </header>

      {/* =========================================================================
          2. FLOATING TOOLBAR DOCK (Hanya Menyisakan Drag & Drop, Auto-Align & Upload)
         ========================================================================= */}
      <div className="absolute right-4 top-20 z-30 flex flex-col gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl">
        {/* Toggle Mode Geser / Edit Titik Point */}
        <button
          onClick={() => {
            setPinToolMode(pinToolMode === 'edit' ? 'view' : 'edit');
          }}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
            pinToolMode === 'edit'
              ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title={pinToolMode === 'edit' ? 'Keluar Mode Geser Titik' : 'Mode Geser / Sesuaikan Tata Letak Titik Point'}
        >
          <Move className="w-4 h-4" />
        </button>

        {/* Paskan Titik Otomatis di Atas Nomor Denah */}
        <button
          onClick={handleAutoAlignCoordinates}
          className="p-2.5 text-teal-400 hover:text-teal-200 hover:bg-teal-500/20 rounded-xl transition-all flex items-center justify-center"
          title="Paskan Titik Point Otomatis di Atas Nomor Denah (Reset Posisi)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <div className="w-full h-px bg-slate-700/80 my-0.5" />

        {/* Upload Custom JPEG Siteplan Image */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center"
          title="Ganti / Unggah Gambar Denah JPEG Sendiri"
        >
          <Upload className="w-4 h-4" />
        </button>

        {/* Reset ke Denah Standar */}
        <button
          onClick={handleResetToDefaultJpeg}
          className="p-2.5 text-amber-400 hover:text-amber-200 hover:bg-amber-500/20 rounded-xl transition-all flex items-center justify-center"
          title="Kembalikan ke Gambar Denah Standar"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Browser Fullscreen F11 Toggle */}
        <button
          onClick={toggleBrowserFullscreen}
          className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center"
          title="Layar Penuh Browser (F11)"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Notice Banner: Drag & Drop Info / Toast */}
      {pinToolMode === 'edit' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-blue-600/95 backdrop-blur-md text-white text-xs font-bold rounded-2xl shadow-2xl border border-blue-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <span>🖐️ <strong>Mode Geser Titik Aktif:</strong> Drag & drop titik point di denah untuk memindahkan letaknya sesuka hati.</span>
          <button
            onClick={handleAutoAlignCoordinates}
            className="px-2 py-0.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[11px] transition-colors"
          >
            Paskan Otomatis
          </button>
          <button
            onClick={() => setPinToolMode('view')}
            className="px-2.5 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px]"
          >
            Selesai
          </button>
        </div>
      )}

      {alignMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400/40 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          <span>{alignMessage}</span>
          <button onClick={() => setAlignMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =========================================================================
          3. MAIN FULLSCREEN JPEG MASTERPLAN CANVAS (Edge-to-Edge Fullscreen)
          (Zoom, Pan, and Rotation removed. Direct Point Drag & Drop preserved)
         ========================================================================= */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 select-none">
        {/* Canvas Holder matching exact JPEG Aspect Ratio */}
        <div 
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            maxWidth: '100vw',
            maxHeight: '100vh',
            aspectRatio: `${aspectRatio}`,
          }}
        >
          {/* JPEG DENAH KAWASAN FULLSCREEN SEBAGAI DEFAULT */}
          {siteplanImage && (
            <img
              src={siteplanImage}
              alt="Denah Kawasan Perumahan Fullscreen"
              onLoad={handleImageLoad}
              className="w-full h-full object-contain block select-none pointer-events-none"
            />
          )}

          {/* INTERACTIVE POINT MARKERS - DRAG & DROP ENABLED */}
          {units.map((unit) => {
            const coords = coordsMap[unit.id] || DEFAULT_UNIT_COORDINATES[unit.id] || { x: 50, y: 50 };
            const isFiltered = filteredUnits.some((u) => u.id === unit.id);
            const isSelected = selectedUnit?.id === unit.id;
            const statusCfg = STATUS_CONFIG[unit.status] || STATUS_CONFIG['TERSEDIA'];
            const isDraggingThis = draggingPinId === unit.id;

            const displayNumber = unit.number.includes('.')
              ? unit.number.split('.')[1]
              : unit.number;

            return (
              <button
                key={unit.id}
                type="button"
                onPointerDown={(e) => handlePinPointerDown(unit, e)}
                onMouseEnter={() => !draggingPinId && setHoveredUnit(unit)}
                onMouseLeave={() => setHoveredUnit(null)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center group touch-none select-none transition-transform ${
                  isDraggingThis
                    ? 'scale-150 z-50 cursor-grabbing shadow-2xl'
                    : isSelected
                    ? 'scale-130 z-40'
                    : pinToolMode === 'edit'
                    ? 'hover:scale-130 z-30 cursor-grab active:cursor-grabbing'
                    : 'hover:scale-125 hover:z-30 cursor-grab active:cursor-grabbing'
                } ${isFiltered ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                }}
                title={`Unit ${unit.id}: Drag & drop untuk memindahkan letak titik di denah`}
              >
                {/* Visual coordinate badge when dragging */}
                {isDraggingThis && dragCurrentCoords && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[9px] font-bold shadow-xl border border-blue-400 whitespace-nowrap pointer-events-none z-50">
                    {unit.id} · X:{dragCurrentCoords.x}% Y:{dragCurrentCoords.y}%
                  </div>
                )}

                {/* Highlight ring di Mode Edit atau Terpilih */}
                {isSelected && (
                  <span className="absolute -inset-1 rounded-full bg-white/40 ring-2 ring-white animate-pulse pointer-events-none" />
                )}

                {pinToolMode === 'edit' && (
                  <span className="absolute inset-0 rounded-full bg-blue-500/25 border border-blue-400 pointer-events-none transition-all group-hover:scale-115" />
                )}

                {/* Titik bulat dan nomor di dalamnya */}
                <div
                  className={`w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] rounded-full flex items-center justify-center font-mono font-black text-[7px] sm:text-[8px] leading-none border-[1px] border-white shadow-md select-none pointer-events-none transition-all ${
                    isDraggingThis
                      ? 'ring-2 ring-blue-500 shadow-xl scale-150'
                      : isSelected
                      ? 'ring-2 ring-white shadow-xl scale-125 z-30'
                      : pinToolMode === 'edit'
                      ? 'ring-1.5 ring-blue-400 hover:scale-125'
                      : 'group-hover:ring-1.5 group-hover:ring-white group-hover:scale-120'
                  }`}
                  style={{
                    backgroundColor: statusCfg.hex,
                    color: '#ffffff',
                  }}
                >
                  <span className="leading-none text-center pointer-events-none">{displayNumber}</span>
                </div>
              </button>
            );
          })}

          {/* Hover Tooltip Overlay (when not dragging) */}
          {hoveredUnit && pinToolMode === 'view' && !draggingPinId && (
            <div 
              className="absolute z-50 bg-slate-900/95 text-white border border-slate-700 p-2.5 rounded-xl shadow-2xl backdrop-blur pointer-events-none flex items-center gap-2.5 transition-opacity"
              style={{
                left: `${Math.min(Math.max((coordsMap[hoveredUnit.id]?.x || 50), 12), 78)}%`,
                top: `${Math.min((coordsMap[hoveredUnit.id]?.y || 50) + 4, 85)}%`,
              }}
            >
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 border border-white shadow-xs"
                style={{ backgroundColor: STATUS_CONFIG[hoveredUnit.status]?.hex || '#059669' }}
              />
              <div className="text-left text-xs">
                <div className="font-extrabold text-white flex items-center gap-1.5">
                  <span>Unit {hoveredUnit.id}</span>
                  <span className="text-[10px] text-slate-400">({hoveredUnit.type})</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Status: <strong className="text-white">{STATUS_CONFIG[hoveredUnit.status]?.label}</strong>
                  {hoveredUnit.customerName && ` · Atas Nama: ${hoveredUnit.customerName}`}
                </div>
                <div className="text-[10px] text-emerald-400 mt-0.5">
                  💡 Tips: Klik & geser untuk sesuaikan posisi
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          4. FLOATING BOTTOM STATUS DOCK (Glassmorphic Legend & Filter Island)
         ========================================================================= */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-5xl w-[96%] sm:w-auto pointer-events-auto">
        <div className="bg-slate-900/90 hover:bg-slate-900/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-2 shadow-2xl flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto transition-all">
          {/* Status Filter Chips */}
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === 'ALL'
                ? 'bg-slate-700 text-white shadow-xs ring-1 ring-slate-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Semua</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {units.length}
            </span>
          </button>

          {Object.entries(STATUS_CONFIG).map(([stKey, stCfg]) => {
            const count = units.filter((u) => u.status === stKey).length;
            const isAct = statusFilter === stKey;
            return (
              <button
                key={stKey}
                onClick={() => setStatusFilter(isAct ? 'ALL' : (stKey as UnitStatus))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isAct
                    ? 'ring-2 ring-white shadow-lg text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                style={{
                  backgroundColor: isAct ? stCfg.hex : undefined,
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: stCfg.hex }}
                />
                <span className="hidden sm:inline">{stCfg.label}</span>
                <span className="sm:hidden">{stCfg.label.split(' ')[0]}</span>
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold"
                  style={{
                    backgroundColor: isAct ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <div className="w-px h-6 bg-slate-700 shrink-0 mx-0.5" />

          {/* Button Buka Tabel Rekap Status */}
          <button
            onClick={() => setStatusModalKey('TERSEDIA')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-bold shadow-xs transition-all shrink-0"
            title="Lihat Rekapitulasi Data Kavling & Status Konsumen"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tabel Rekap</span>
          </button>
        </div>
      </footer>

      {/* =========================================================================
          5. MODALS: TAMBAH PIN, EDIT PIN, STATUS TABLE & CUSTOMER DETAIL
         ========================================================================= */}
      {/* Modal: Tambah Pin Baru */}
      {showAddModal && pendingAddCoords && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Plus className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Pasang Pin Unit Baru</h4>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-slate-700 block font-medium mb-1">
                  ID Unit / Nomor Kavling:
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

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-800 block text-[11px]">
                  Posisi Koordinat Pin Saat Ini:
                </span>
                <div className="text-[11px] text-slate-600 font-mono">
                  X: {coordsMap[editingUnit.id]?.x || 50}%, Y: {coordsMap[editingUnit.id]?.y || 50}%
                </div>
                <p className="text-[10px] text-slate-500">
                  Anda dapat langsung drag & drop titik ini di denah untuk memindahkan letaknya.
                </p>
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

      {/* Jendela Pop-up Tabel Status Unit */}
      {statusModalKey && (
        <UnitStatusTableModal
          status={statusModalKey}
          onClose={() => setStatusModalKey(null)}
          units={units}
          applications={applications || []}
          onSwitchStatus={(newStatus) => setStatusModalKey(newStatus)}
          onSelectCustomer={(u, app) => {
            setSelectedCustomerData({ unit: u, app });
          }}
          onSelectUnit={(u) => {
            setStatusModalKey(null);
            onSelectUnit(u);
          }}
        />
      )}

      {/* Jendela Data Konsumen */}
      {selectedCustomerData && (
        <CustomerDetailModal
          unit={selectedCustomerData.unit}
          application={selectedCustomerData.app}
          onClose={() => setSelectedCustomerData(null)}
          onBackToTable={() => {
            const lastStatus = selectedCustomerData.unit.status;
            setSelectedCustomerData(null);
            setStatusModalKey(lastStatus);
          }}
          onOpenTracker={(u) => {
            setSelectedCustomerData(null);
            setStatusModalKey(null);
            onSelectUnit(u);
          }}
          onOpenUnitModal={(u) => {
            setSelectedCustomerData(null);
            setStatusModalKey(null);
            onSelectUnit(u);
          }}
        />
      )}

      {/* =========================================================================
          6. MODAL HALAMAN PETA LOKASI PERUMAHAN & NAVIGASI GPS
         ========================================================================= */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-in fade-in">
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <span>{housingName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                      Peta Lokasi & Akses
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    {housingAddress || 'Kawasan Strategis, Cikarang Selatan, Bekasi'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${housingName} ${housingAddress || 'Cikarang'}`.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Buka di Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setIsMapModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                  title="Tutup (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Interactive Google Maps Embed */}
              <div className="relative w-full h-72 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/80 shadow-inner">
                <iframe
                  title={`Peta Lokasi ${housingName}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${housingName} ${housingAddress || 'Cikarang'}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Action Buttons & Fast Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Google Maps Direct */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${housingName} ${housingAddress || 'Cikarang'}`.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Google Maps Navigasi
                      </div>
                      <div className="text-[11px] text-slate-400">Rute GPS real-time</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </a>

                {/* 2. Waze Direct */}
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(`${housingName} ${housingAddress || 'Cikarang'}`.trim())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Buka di Waze
                      </div>
                      <div className="text-[11px] text-slate-400">Hindari kemacetan</div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>

                {/* 3. Salin Alamat & Koordinat */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${housingName}, ${housingAddress || 'Cikarang Selatan, Bekasi'}`);
                    setCopiedCoord(true);
                    setTimeout(() => setCopiedCoord(false), 2500);
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <Copy className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                        {copiedCoord ? '✓ Alamat Disalin!' : 'Salin Alamat Lengkap'}
                      </div>
                      <div className="text-[11px] text-slate-400">Untuk calon pembeli</div>
                    </div>
                  </div>
                  <Check className={`w-4 h-4 ${copiedCoord ? 'text-emerald-400' : 'text-slate-500'}`} />
                </button>
              </div>

              {/* Fasilitas & Aksesibilitas Kawasan */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/70 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Aksesibilitas & Lokasi Strategis {housingName}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-left">
                    <div className="text-[11px] text-slate-400">Akses Transportasi</div>
                    <div className="text-xs font-bold text-white mt-0.5">🚆 10 Menit Stasiun KRL</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-left">
                    <div className="text-[11px] text-slate-400">Jalan Tol</div>
                    <div className="text-xs font-bold text-white mt-0.5">🚗 8 Menit Pintu Tol</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-left">
                    <div className="text-[11px] text-slate-400">Layanan Kesehatan</div>
                    <div className="text-xs font-bold text-white mt-0.5">🏥 5 Menit RS Siloam</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/50 text-left">
                    <div className="text-[11px] text-slate-400">Pusat Belanja & Hiburan</div>
                    <div className="text-xs font-bold text-white mt-0.5">🛍️ 10 Menit Mall Lippo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
