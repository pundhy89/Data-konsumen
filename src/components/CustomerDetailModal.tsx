import React, { useState } from 'react';
import { Unit, KprApplication } from '../types';
import { STATUS_CONFIG, BLOCK_THEME } from './SitePlanMasterplan';
import HousePlanType36_66 from './HousePlanType36_66';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  DollarSign,
  Home,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  Compass,
  Hammer,
  Layers,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  FileCheck,
} from 'lucide-react';

interface CustomerDetailModalProps {
  unit: Unit;
  application: KprApplication;
  onClose: () => void;
  onBackToTable?: () => void;
  onOpenTracker?: (unit: Unit, app: KprApplication) => void;
  onOpenUnitModal?: (unit: Unit) => void;
  initialTab?: 'profil' | 'kavling' | 'berkas';
}

export default function CustomerDetailModal({
  unit,
  application,
  onClose,
  onBackToTable,
  onOpenTracker,
  onOpenUnitModal,
  initialTab = 'profil',
}: CustomerDetailModalProps) {
  // Tab berkas disatukan ke Data Konsumen atau tombol Pantau Berkas memunculkan Popup Berkas
  const [activeTab, setActiveTab] = useState<'profil' | 'kavling'>(
    initialTab === 'kavling' ? 'kavling' : 'profil'
  );
  const [denahMode, setDenahMode] = useState<'ruangan' | 'blok'>('ruangan');
  const [showDocsPopup, setShowDocsPopup] = useState<boolean>(initialTab === 'berkas');
  const [docFilter, setDocFilter] = useState<'ALL' | 'VERIFIED' | 'REVISION' | 'WAITING'>('ALL');

  const statusInfo = STATUS_CONFIG[unit.status] || STATUS_CONFIG['TERSEDIA'];
  const blockInfo = BLOCK_THEME[unit.block] || { label: `Blok ${unit.block}`, hex: '#2563eb' };

  // Kelengkapan berkas KPR
  const totalDocs = application.documents.length || 13;
  const verifiedDocs = application.documents.filter((d) => d.status === 'TERVERIFIKASI').length;
  const revisionDocs = application.documents.filter((d) => d.status === 'PERLU_REVISI').length;
  const waitingDocs = application.documents.filter(
    (d) => d.status === 'MENUNGGU_VERIFIKASI' || d.status === 'BELUM_UNGGAH'
  ).length;
  const docPercent = Math.round((verifiedDocs / totalDocs) * 100);

  const filteredDocs = application.documents.filter((d) => {
    if (docFilter === 'VERIFIED') return d.status === 'TERVERIFIKASI';
    if (docFilter === 'REVISION') return d.status === 'PERLU_REVISI';
    if (docFilter === 'WAITING') return d.status === 'MENUNGGU_VERIFIKASI' || d.status === 'BELUM_UNGGAH';
    return true;
  });

  // Link WhatsApp
  const cleanPhone = application.customer.telepon.replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const waMessage = encodeURIComponent(
    `Halo Bapak/Ibu ${application.customer.nama}, kami dari Manajemen Perumahan mengonfirmasi terkait Kavling Unit ${unit.id} (Blok ${unit.block}).`
  );
  const waUrl = `https://wa.me/${waPhone}?text=${waMessage}`;

  // 5 Tahapan Konstruksi Sederhana & Mudah Dimengerti
  const progress = unit.constructionProgress || 0;
  const stages = [
    {
      id: 1,
      title: 'Pondasi & Struktur Bawah',
      desc: 'Galian tanah, batu kali, sloof beton bertulang',
      done: progress >= 20,
      active: progress > 0 && progress < 20,
      pct: Math.min(100, Math.round((progress / 20) * 100)),
    },
    {
      id: 2,
      title: 'Dinding Bata & Kusen',
      desc: 'Bata ringan hebel, plester aci, kusen aluminium',
      done: progress >= 45,
      active: progress >= 20 && progress < 45,
      pct: progress < 20 ? 0 : Math.min(100, Math.round(((progress - 20) / 25) * 100)),
    },
    {
      id: 3,
      title: 'Rangka Atap & Genteng',
      desc: 'Rangka baja ringan kokoh, genteng metal pasir',
      done: progress >= 70,
      active: progress >= 45 && progress < 70,
      pct: progress < 45 ? 0 : Math.min(100, Math.round(((progress - 45) / 25) * 100)),
    },
    {
      id: 4,
      title: 'Finishing Keramik & Sanitair',
      desc: 'Keramik lantai 40x40, instalasi pipa air & listrik PLN',
      done: progress >= 90,
      active: progress >= 70 && progress < 90,
      pct: progress < 70 ? 0 : Math.min(100, Math.round(((progress - 70) / 20) * 100)),
    },
    {
      id: 5,
      title: 'Pengecatan & Serah Terima Kunci',
      desc: 'Cat dinding interior-eksterior, pembersihan akhir & BAST',
      done: progress >= 100,
      active: progress >= 90 && progress < 100,
      pct: progress < 90 ? 0 : Math.min(100, Math.round(((progress - 90) / 10) * 100)),
    },
  ];

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL: Bersih, Jelas, & Ringkas */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {onBackToTable && (
              <button
                type="button"
                onClick={onBackToTable}
                className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 shadow-2xs"
                title="Kembali ke tabel status"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Kembali</span>
              </button>
            )}

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-white text-base shadow-xs shrink-0"
              style={{ backgroundColor: statusInfo.hex }}
            >
              {unit.id}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 truncate">
                  {application.customer.nama}
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0"
                  style={{
                    backgroundColor: `${statusInfo.hex}15`,
                    borderColor: `${statusInfo.hex}40`,
                    color: statusInfo.hex,
                  }}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Kavling {unit.id} ({blockInfo.label}) · {unit.type} · {application.bankPenyalur}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors shrink-0 ml-2"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB NAVIGATION: 2 Tab Utama Simpel (Data Konsumen & Denah/Progres Kavling) */}
        <div className="px-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs overflow-x-auto">
          <div className="flex items-center gap-2 -mb-px">
            {/* Tab 1: Data Konsumen (Berkas disatukan di sini) */}
            <button
              type="button"
              onClick={() => setActiveTab('profil')}
              className={`py-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'profil'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Data Konsumen</span>
            </button>

            {/* Tab 2: Denah & Progress Kavling */}
            <button
              type="button"
              onClick={() => setActiveTab('kavling')}
              className={`py-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'kavling'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Denah & Progres Kavling</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200">
                {unit.constructionProgress}%
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Pantau Berkas Cepat di Header Tabs */}
            <button
              type="button"
              onClick={() => setShowDocsPopup(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] shadow-2xs transition-colors shrink-0"
              title="Buka popup pantau 13 berkas KPR konsumen"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pantau Berkas</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-200/70 text-indigo-900 font-mono text-[10px]">
                {verifiedDocs}/{totalDocs}
              </span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat WA</span>
            </a>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* ========================================================
              TAB 1: DATA KONSUMEN (SIMPEL & RINGKAS)
             ======================================================== */}
          {activeTab === 'profil' && (
            <div className="space-y-3.5 animate-in fade-in">
              {/* KARTU 1: PROFIL PRIBADI KONSUMEN (RINGKAS & JELAS) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    Identitas Konsumen
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Status: <strong className="text-slate-700">{application.customer.statusPernikahan}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {/* Nama & NIK */}
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Nama Lengkap (KTP)</span>
                    <span className="font-bold text-slate-900 text-sm">{application.customer.nama}</span>
                    <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                      NIK: {application.customer.nik}
                    </span>
                  </div>

                  {/* Kontak & WhatsApp */}
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">No. Telepon / WhatsApp</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {application.customer.telepon}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {application.customer.email || 'Email: -'}
                      </span>
                    </div>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                      title="Buka Chat WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </a>
                  </div>

                  {/* Pekerjaan */}
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-emerald-600" /> Pekerjaan & Instansi
                    </span>
                    <span className="font-bold text-slate-800 block text-xs mt-0.5">
                      {application.customer.pekerjaan}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {application.customer.perusahaan} · Gaji Rp {application.customer.gajiBulanan.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {/* Alamat */}
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-500" /> Alamat Domisili
                    </span>
                    <span className="font-medium text-slate-800 block text-xs mt-0.5 truncate" title={application.customer.alamat}>
                      {application.customer.alamat}
                    </span>
                    {application.customer.namaPasangan && (
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        Pasangan: {application.customer.namaPasangan}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* KARTU 2: RINGKASAN KAVLING & KPR (DENGAN TOMBOL PANTAU BERKAS) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Data Pembelian & Pembiayaan KPR
                  </h4>
                  <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {application.bankPenyalur}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Harga Rumah</span>
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      Rp {unit.harga.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Cicilan KPR</span>
                    <span className="font-mono font-bold text-indigo-700 text-xs sm:text-sm">
                      Rp {application.cicilanPerBulan.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">/bln ({application.tenorTahun} Thn)</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Uang Muka (DP)</span>
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                      Rp {application.uangMuka.toLocaleString('id-ID')}
                    </span>
                    <span className={`text-[10px] font-bold block ${application.uangMukaPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {application.uangMukaPaid ? '✓ Lunas' : 'Belum Lunas'}
                    </span>
                  </div>

                  {/* Tombol Interaktif Pantau Berkas di Card Grid */}
                  <button
                    type="button"
                    onClick={() => setShowDocsPopup(true)}
                    className="p-2 rounded-lg bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 text-left transition-colors group cursor-pointer"
                    title="Klik untuk membuka popup berkas KPR"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 block text-[10px] font-bold">Berkas KPR</span>
                      <Eye className="w-3 h-3 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                      {verifiedDocs} / {totalDocs} Lengkap
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 block mt-0.5 underline">
                      Pantau Berkas →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: DENAH & PROGRESS PEMBANGUNAN UNIT KAVLING
             ======================================================== */}
          {activeTab === 'kavling' && (
            <div className="space-y-4 animate-in fade-in">
              {/* 1. BAGIAN PROGRESS PEMBANGUNAN UNIT */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-sky-600" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Progress Pembangunan Unit {unit.id}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {unit.type} · {blockInfo.label} · No. Rumah {unit.number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Tahapan Saat Ini:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-300">
                      {unit.constructionStage}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar Besar */}
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Realisasi Fisik Lapangan
                      </span>
                      <div className="text-2xl font-black font-mono text-slate-900 tracking-tight flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-sky-600">{unit.constructionProgress}%</span>
                        <span className="text-xs font-semibold text-slate-400">/ 100% Selesai</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">Estimasi Serah Terima (BAST):</span>
                      <span className="font-bold text-slate-800 text-xs flex items-center gap-1 justify-end mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {unit.constructionProgress === 100
                          ? 'Siap BAST Kunci (Siap Huni)'
                          : unit.constructionProgress >= 70
                          ? '1 - 2 Bulan ke Depan'
                          : '3 - 4 Bulan ke Depan'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar Gradient */}
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${unit.constructionProgress}%` }}
                    />
                  </div>
                </div>

                {/* 5 Tahapan Ringkas & Rapi */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    Rincian 5 Tahapan Konstruksi Rumah:
                  </span>

                  <div className="grid grid-cols-1 gap-1.5">
                    {stages.map((st) => (
                      <div
                        key={st.id}
                        className={`px-3 py-2 rounded-lg border text-xs flex items-center justify-between gap-3 transition-colors ${
                          st.done
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : st.active
                            ? 'bg-sky-50/80 border-sky-400 shadow-2xs ring-1 ring-sky-300'
                            : 'bg-white border-slate-200 opacity-70 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                              st.done
                                ? 'bg-emerald-600 text-white'
                                : st.active
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {st.done ? <Check className="w-3 h-3" /> : st.id}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate text-xs">
                              {st.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block truncate">
                              {st.desc}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            st.done
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.active
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {st.done ? 'Selesai' : st.active ? `Proses (${st.pct}%)` : 'Menunggu'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. BAGIAN DENAH UNIT KAVLING (DENAH TATA RUANG 2D & BLOK) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Denah Kavling Unit {unit.id} ({unit.type})
                    </h4>
                  </div>

                  <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setDenahMode('ruangan')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all text-[11px] ${
                        denahMode === 'ruangan'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Denah Tata Ruang
                    </button>
                    <button
                      type="button"
                      onClick={() => setDenahMode('blok')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all text-[11px] ${
                        denahMode === 'blok'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Posisi di Blok
                    </button>
                  </div>
                </div>

                {denahMode === 'ruangan' ? (
                  /* GAMBAR DENAH ARSITEKTUR 2D YANG BERSIH & PRESISI */
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center">
                    <div className="text-center mb-2.5">
                      <span className="font-extrabold text-xs text-slate-900 block">
                        DENAH TATA RUANG TIPE 36 / 60 M²
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Lebar 6.00 M × Panjang 10.00 M · Luas Tanah {unit.luasTanah} m² · Luas Bangunan {unit.luasBangunan} m²
                      </span>
                    </div>

                    <div className="w-full max-w-sm border border-slate-300 rounded-xl bg-slate-50/50 p-2 shadow-2xs">
                      <svg
                        className="w-full h-auto select-none"
                        viewBox="0 0 340 460"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="15" y="15" width="310" height="430" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />

                        {/* Area Belakang: Sisa Lahan & Dapur */}
                        <rect x="15" y="15" width="155" height="75" fill="#f0fdf4" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="92" y="52" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="bold">SISA LAHAN</text>
                        <text x="92" y="66" textAnchor="middle" fill="#15803d" fontSize="8" fontFamily="monospace">3.00 × 2.00 m</text>

                        <rect x="170" y="15" width="155" height="75" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                        <rect x="220" y="18" width="102" height="22" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
                        <circle cx="255" cy="29" r="6" fill="#cbd5e1" />
                        <text x="240" y="60" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold">DAPUR</text>
                        <text x="240" y="73" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">3.00 × 2.00 m</text>

                        {/* Kamar Tidur 2, KM/WC, R. Tamu */}
                        <rect x="15" y="90" width="155" height="115" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                        <rect x="25" y="100" width="65" height="45" rx="3" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
                        <text x="92" y="155" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">KAMAR TIDUR 2</text>
                        <text x="92" y="169" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">3.00 × 2.75 m</text>

                        <rect x="170" y="90" width="75" height="75" fill="#ecfeff" stroke="#334155" strokeWidth="2" />
                        <ellipse cx="195" cy="115" rx="8" ry="11" fill="#ffffff" stroke="#0891b2" strokeWidth="1.5" />
                        <text x="207" y="145" textAnchor="middle" fill="#0e7490" fontSize="8.5" fontWeight="bold">KM/WC</text>
                        <text x="207" y="156" textAnchor="middle" fill="#155e75" fontSize="7" fontFamily="monospace">1.5×1.5 m</text>

                        <rect x="170" y="165" width="155" height="145" fill="#ffffff" stroke="#334155" strokeWidth="2" />
                        <rect x="210" y="210" width="45" height="20" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                        <rect x="260" y="210" width="20" height="30" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                        <text x="245" y="195" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">R. KELUARGA & TAMU</text>
                        <text x="245" y="260" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">3.00 × 4.00 m</text>

                        {/* Kamar Utama */}
                        <rect x="15" y="205" width="155" height="125" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                        <rect x="25" y="218" width="75" height="70" rx="3" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.2" />
                        <text x="92" y="305" textAnchor="middle" fill="#0f172a" fontSize="10.5" fontWeight="bold">KAMAR UTAMA</text>
                        <text x="92" y="318" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">3.00 × 3.00 m</text>

                        {/* Depan: Carport & Taman */}
                        <rect x="170" y="310" width="75" height="25" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" />
                        <text x="207" y="327" textAnchor="middle" fill="#475569" fontSize="8.5" fontWeight="bold">TERAS</text>

                        <rect x="170" y="335" width="155" height="110" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                        <rect x="205" y="355" width="85" height="60" rx="8" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" opacity="0.6" />
                        <text x="247" y="425" textAnchor="middle" fill="#1e293b" fontSize="9.5" fontWeight="bold">CARPORT MOBIL</text>
                        <text x="247" y="437" textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">3.00 × 4.50 m</text>

                        <rect x="15" y="330" width="155" height="115" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
                        <circle cx="75" cy="380" r="20" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" opacity="0.7" />
                        <circle cx="75" cy="380" r="10" fill="#4ade80" />
                        <text x="75" y="425" textAnchor="middle" fill="#166534" fontSize="9.5" fontWeight="bold">TAMAN DEPAN</text>
                        <text x="75" y="437" textAnchor="middle" fill="#15803d" fontSize="7.5" fontFamily="monospace">3.00 × 2.75 m</text>
                      </svg>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs w-full mt-3 pt-2.5 border-t border-slate-200">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Kamar Tidur</span>
                        <span className="font-bold text-slate-800">2 Ruang</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Kamar Mandi</span>
                        <span className="font-bold text-slate-800">1 (Kloset Duduk)</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Carport</span>
                        <span className="font-bold text-slate-800">1 Mobil + Motor</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Listrik & Air</span>
                        <span className="font-bold text-slate-800">1300 VA / Sumur</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Peta Blok Kavling */
                  <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3">
                    <div className="text-center">
                      <span className="font-extrabold text-sm block">
                        PETA POSISI KAVLING {unit.id} ({blockInfo.label})
                      </span>
                      <span className="text-xs text-slate-400">
                        Kavling Anda ditandai warna biru terang di deretan kavling {blockInfo.label}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 max-w-md mx-auto">
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {Array.from({ length: 12 }).map((_, i) => {
                          const lotNum = i + 1;
                          const lotId = `${unit.block}.${lotNum < 10 ? '0' + lotNum : lotNum}`;
                          const isCurrentUnit = lotId === unit.id;

                          return (
                            <div
                              key={lotId}
                              className={`p-2 rounded-lg text-center transition-all ${
                                isCurrentUnit
                                  ? 'bg-blue-600 ring-2 ring-white shadow-md font-black text-white scale-105'
                                  : 'bg-slate-700/60 border border-slate-600 text-slate-300'
                              }`}
                            >
                              <div className="font-mono text-xs">{lotId}</div>
                              <div className="text-[9px] truncate font-medium mt-0.5">
                                {isCurrentUnit ? 'Unit Anda' : 'Tetangga'}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 p-1.5 rounded bg-slate-950 border border-slate-700 text-center text-[10px] font-bold text-slate-400">
                        ═ JALAN ROW 6.5 METER ═
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {onBackToTable && (
              <button
                type="button"
                onClick={onBackToTable}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Tabel</span>
              </button>
            )}

            {/* Quick Toggle Button between Profil Konsumen & Denah Kavling */}
            {activeTab === 'profil' ? (
              <button
                type="button"
                onClick={() => setActiveTab('kavling')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-colors flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5 text-blue-600" />
                <span>Lihat Kavling (Denah & Progres)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('profil')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 transition-colors flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Lihat Data Konsumen</span>
              </button>
            )}

            {/* Tombol Pantau Berkas di Footer */}
            <button
              type="button"
              onClick={() => setShowDocsPopup(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition-colors flex items-center gap-1.5"
              title="Buka popup daftar 13 berkas KPR"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pantau Berkas ({verifiedDocs}/{totalDocs})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenUnitModal && (
              <button
                type="button"
                onClick={() => {
                  onOpenUnitModal(unit);
                  onClose();
                }}
                className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 font-semibold border border-slate-300 transition-colors items-center gap-1 text-[11px]"
                title="Lihat posisi pin pada denah kawasan masterplan"
              >
                <Compass className="w-3 h-3 text-slate-500" />
                <span>Sorot Denah</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          POPUP BERKAS KPR (MUNCUL SAAT TOMBOL PANTAU BERKAS DI-KLIK)
         ======================================================== */}
      {showDocsPopup && (
        <div
          className="fixed inset-0 z-80 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowDocsPopup(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Popup Berkas */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-50 via-white to-blue-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Popup Pantau Berkas KPR
                    </h3>
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Unit {unit.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Konsumen: <strong className="text-slate-800">{application.customer.nama}</strong> ({application.bankPenyalur})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDocsPopup(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Tutup popup berkas"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ringkasan Status & Filter Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">
                      Kelengkapan Dokumen: {docPercent}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      ({verifiedDocs} dari {totalDocs} Berkas)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {verifiedDocs} Valid
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      {revisionDocs} Perlu Revisi
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {waitingDocs} Menunggu
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${docPercent}%` }}
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setDocFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    docFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Semua ({totalDocs})
                </button>
                <button
                  type="button"
                  onClick={() => setDocFilter('VERIFIED')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                    docFilter === 'VERIFIED'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Valid ({verifiedDocs})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocFilter('REVISION')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                    docFilter === 'REVISION'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>Revisi ({revisionDocs})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocFilter('WAITING')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                    docFilter === 'WAITING'
                      ? 'bg-slate-700 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Menunggu ({waitingDocs})</span>
                </button>
              </div>
            </div>

            {/* List Berkas */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {filteredDocs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada dokumen dengan filter ini.
                </div>
              ) : (
                filteredDocs.map((doc, idx) => {
                  const isVerified = doc.status === 'TERVERIFIKASI';
                  const isRevision = doc.status === 'PERLU_REVISI';

                  return (
                    <div
                      key={doc.id || idx}
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                        isVerified
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : isRevision
                          ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {isVerified ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isRevision ? (
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs">
                              {doc.title}
                            </span>
                            {doc.required ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                Wajib
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                Opsional
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {doc.description}
                          </p>
                          {doc.notes && (
                            <div className="mt-1 p-1.5 rounded bg-amber-100/70 text-amber-900 text-[10px] font-medium flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-amber-700 shrink-0" />
                              <span>Catatan: {doc.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isRevision
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {isVerified ? '✓ Valid' : isRevision ? 'Perlu Revisi' : 'Menunggu'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Popup Berkas */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Total 13 berkas KPR FLPP Bank BTN/BRI
              </span>
              <button
                type="button"
                onClick={() => setShowDocsPopup(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
              >
                Tutup Popup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
