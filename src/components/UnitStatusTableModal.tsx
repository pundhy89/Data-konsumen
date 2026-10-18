import React, { useState, useMemo } from 'react';
import { Unit, UnitStatus, BlockId, KprApplication } from '../types';
import { STATUS_CONFIG, BLOCK_THEME } from './SitePlanMasterplan';
import {
  X,
  Search,
  User,
  Home,
  CheckCircle2,
  Clock,
  Hammer,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Filter,
  UserCheck,
  Building2,
  Sparkles,
} from 'lucide-react';
import { STANDARD_DOCUMENTS_TEMPLATE } from '../data/initialData';

interface UnitStatusTableModalProps {
  status: UnitStatus;
  onClose: () => void;
  units: Unit[];
  applications: KprApplication[];
  onSelectCustomer: (unit: Unit, app: KprApplication) => void;
  onSelectUnit?: (unit: Unit) => void;
  onSwitchStatus?: (newStatus: UnitStatus) => void;
}

// Helper to get or create complete application for a unit
export function getOrCreateAppForUnit(unit: Unit, applications: KprApplication[]): KprApplication {
  const found = applications.find((a) => a.unitId === unit.id);
  if (found) return found;

  const name = unit.customerName || `Konsumen Unit ${unit.id}`;
  const charSum = unit.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const phoneSuffix = Math.abs(charSum * 137) % 90000000 + 10000000;
  const nikSuffix = Math.abs(charSum * 953) % 90000000 + 10000000;

  return {
    id: `KPR-2026-${unit.block}${unit.number}`,
    unitId: unit.id,
    customer: {
      nama: name,
      nik: `3201${nikSuffix}0001`,
      telepon: `0812${phoneSuffix}`,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`,
      pekerjaan: 'Karyawan Swasta Industri',
      perusahaan: 'PT Industri Manufaktur Cikarang',
      gajiBulanan: 5800000,
      statusPernikahan: 'Menikah',
      namaPasangan: 'Pasangan ' + name.split(' ')[0],
      alamat: `Jl. Raya Utama No. ${unit.number}, Perumahan Subsidi Blok ${unit.block}`,
    },
    marketingName: unit.marketingName || 'Dewi Sartika',
    bankPenyalur: 'Bank BTN',
    currentStage:
      unit.status === 'REALISASI_AKAD'
        ? 'BAST_KUNCI'
        : unit.status === 'PROSES_KPR'
        ? 'ANALISA_SP3K'
        : unit.status === 'PROSES_PEMBANGUNAN'
        ? 'PROSES_KONSTRUKSI'
        : 'BOOKING_REGISTRASI',
    bookingFee: 1500000,
    bookingFeePaid: true,
    uangMuka: 3000000,
    uangMukaPaid: unit.status !== 'TERBOOKING',
    plafonKpr: unit.harga - 4500000,
    tenorTahun: 20,
    cicilanPerBulan: 1185000,
    sp3kNumber:
      unit.sp3kStatus === 'Disetujui'
        ? `SP3K/BTN/${unit.id}/2026`
        : unit.status === 'PROSES_KPR'
        ? `SP3K/PROSES/${unit.id}`
        : undefined,
    sp3kDate: '2026-10-10',
    documents: STANDARD_DOCUMENTS_TEMPLATE.map((tpl, idx) => ({
      id: `doc-${unit.id}-${idx}`,
      type: tpl.type,
      title: tpl.title,
      description: tpl.description,
      required: tpl.required,
      status:
        unit.status === 'REALISASI_AKAD' || unit.status === 'PROSES_KPR'
          ? 'TERVERIFIKASI'
          : idx < 6
          ? 'TERVERIFIKASI'
          : 'MENUNGGU_VERIFIKASI',
      fileName: `${tpl.type.toLowerCase()}_${unit.id.toLowerCase()}.pdf`,
      uploadedAt: '2026-10-10',
      verifiedAt: idx < 6 ? '2026-10-12' : undefined,
      verifiedBy: 'Legal KPR',
    })),
    timeline: [
      {
        id: `tl-init-${unit.id}`,
        stage: 'BOOKING_REGISTRASI',
        title: 'Booking Fee & Registrasi Unit',
        description: `Unit ${unit.id} berhasil terdaftar atas nama ${name}`,
        timestamp: '2026-10-05 10:00',
        actor: unit.marketingName || 'Marketing',
        status: 'completed',
      },
    ],
    createdAt: '2026-10-05',
    updatedAt: '2026-10-10',
  };
}

export default function UnitStatusTableModal({
  status,
  onClose,
  units,
  applications,
  onSelectCustomer,
  onSelectUnit,
  onSwitchStatus,
}: UnitStatusTableModalProps) {
  const [currentStatus, setCurrentStatus] = useState<UnitStatus>(status);
  const [selectedBlock, setSelectedBlock] = useState<BlockId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize when prop changes
  React.useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const activeStatusCfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['TERSEDIA'];

  // Handle status tab change
  const handleChangeStatus = (st: UnitStatus) => {
    setCurrentStatus(st);
    if (onSwitchStatus) {
      onSwitchStatus(st);
    }
  };

  // Filtered units matching current status, block, and search query
  const filteredUnits = useMemo(() => {
    return units
      .filter((u) => u.status === currentStatus)
      .filter((u) => selectedBlock === 'ALL' || u.block === selectedBlock)
      .filter((u) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const blockMatch = `blok ${u.block}`.toLowerCase().includes(q) || u.block.toLowerCase().includes(q);
        const numberMatch = u.number.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
        const customerMatch = (u.customerName || '').toLowerCase().includes(q);
        const app = applications.find((a) => a.unitId === u.id);
        const appNameMatch = app?.customer.nama.toLowerCase().includes(q) || false;
        return blockMatch || numberMatch || customerMatch || appNameMatch;
      })
      .sort((a, b) => {
        if (a.block !== b.block) return a.block.localeCompare(b.block);
        return parseInt(a.number, 10) - parseInt(b.number, 10);
      });
  }, [units, currentStatus, selectedBlock, searchQuery, applications]);

  const totalStatusCount = units.filter((u) => u.status === currentStatus).length;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="relative px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200"
          style={{
            background: `linear-gradient(135deg, ${activeStatusCfg.hex}14 0%, #ffffff 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs font-mono font-black text-white shrink-0"
              style={{ backgroundColor: activeStatusCfg.hex }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                  Daftar Unit {activeStatusCfg.label}
                </h3>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  style={{
                    backgroundColor: `${activeStatusCfg.hex}15`,
                    borderColor: `${activeStatusCfg.hex}40`,
                    color: activeStatusCfg.hex,
                  }}
                >
                  {totalStatusCount} Unit
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih atau klik nama konsumen pada kolom <strong>Atas Nama</strong> untuk membuka jendela data konsumen lengkap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Tutup jendela tabel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Switcher Tabs */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-500 font-semibold text-[11px] whitespace-nowrap mr-1">
            Status:
          </span>
          {(['TERBOOKING', 'PROSES_PEMBANGUNAN', 'PROSES_KPR', 'REALISASI_AKAD', 'TERSEDIA'] as UnitStatus[]).map(
            (st) => {
              const cfg = STATUS_CONFIG[st];
              const count = units.filter((u) => u.status === st).length;
              const isActive = currentStatus === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleChangeStatus(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cfg.hex }}
                  />
                  <span>{cfg.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Search & Block Filter Bar */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Blok, Nomor Rumah (misal: A.09), atau Nama Konsumen..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Block Filter Buttons */}
          <div className="flex items-center gap-1 text-xs overflow-x-auto pb-0.5 sm:pb-0">
            <span className="text-slate-400 text-[11px] font-medium mr-1 hidden md:inline">Blok:</span>
            {(['ALL', 'A', 'B', 'C', 'D'] as const).map((blk) => (
              <button
                key={blk}
                type="button"
                onClick={() => setSelectedBlock(blk)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                  selectedBlock === blk
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {blk === 'ALL' ? 'Semua Blok' : `Blok ${blk}`}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredUnits.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Tidak ada unit ditemukan</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery
                  ? `Tidak ada unit ${activeStatusCfg.label} yang cocok dengan kata kunci "${searchQuery}". Coba ubah pencarian atau filter blok.`
                  : `Saat ini belum ada unit dengan status ${activeStatusCfg.label} pada filter ini.`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3.5 w-12 text-center">No</th>
                  <th className="py-2.5 px-3.5 w-24">Blok</th>
                  <th className="py-2.5 px-3.5 w-32">Nomor Rumah</th>
                  <th className="py-2.5 px-4 min-w-[200px]">Atas Nama (Klik untuk Buka Data)</th>
                  <th className="py-2.5 px-3.5 hidden sm:table-cell">Spesifikasi / Harga</th>
                  <th className="py-2.5 px-3.5 hidden md:table-cell">Keterangan / Bank</th>
                  <th className="py-2.5 px-3.5 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUnits.map((u, idx) => {
                  const blockTheme = BLOCK_THEME[u.block] || { label: `Blok ${u.block}`, hex: '#2563eb' };
                  const app = getOrCreateAppForUnit(u, applications);
                  const hasCustomer = Boolean(u.customerName || app.customer.nama);
                  const customerName = u.customerName || app.customer.nama;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      {/* No */}
                      <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 font-medium text-[11px]">
                        {idx + 1}
                      </td>

                      {/* Blok */}
                      <td className="py-2.5 px-3.5">
                        <span
                          className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px] border"
                          style={{
                            backgroundColor: `${blockTheme.hex}12`,
                            borderColor: `${blockTheme.hex}35`,
                            color: blockTheme.hex,
                          }}
                        >
                          Blok {u.block}
                        </span>
                      </td>

                      {/* Nomor Rumah */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-1.5 font-mono font-black text-slate-900 text-sm">
                          <Home className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.id}</span>
                        </div>
                      </td>

                      {/* Atas Nama - JIKA DI-KLIK MAKA MUNCUL JENDELA DATA KONSUMEN */}
                      <td className="py-2.5 px-4">
                        {hasCustomer ? (
                          <button
                            type="button"
                            onClick={() => onSelectCustomer(u, app)}
                            className="group/cust text-left flex items-center gap-2 py-1 px-2 -ml-2 rounded-lg hover:bg-blue-100/70 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            title="Klik untuk membuka jendela data konsumen ini"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200 group-hover/cust:bg-blue-600 group-hover/cust:text-white transition-colors">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-extrabold text-blue-700 group-hover/cust:text-blue-900 group-hover/cust:underline flex items-center gap-1 text-[13px] tracking-tight">
                                <span>{customerName}</span>
                                <ExternalLink className="w-3 h-3 text-blue-500 opacity-60 group-hover/cust:opacity-100 transition-opacity shrink-0" />
                              </div>
                              <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5">
                                <span>NIK: {app.customer.nik}</span>
                                <span>·</span>
                                <span className="text-emerald-700 font-semibold">{app.customer.telepon}</span>
                              </div>
                            </div>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-400 italic text-xs py-1">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            <span>Belum ada konsumen (Unit Tersedia)</span>
                          </div>
                        )}
                      </td>

                      {/* Spesifikasi / Harga */}
                      <td className="py-2.5 px-3.5 hidden sm:table-cell">
                        <div className="font-semibold text-slate-800 text-[11px]">{u.type}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          LT {u.luasTanah} m² · Rp {u.harga.toLocaleString('id-ID')}
                        </div>
                      </td>

                      {/* Keterangan / Bank */}
                      <td className="py-2.5 px-3.5 hidden md:table-cell">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{app.bankPenyalur}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {u.status === 'PROSES_PEMBANGUNAN' ? (
                            <span className="text-sky-700 font-semibold">Progres: {u.constructionProgress}% ({u.constructionStage})</span>
                          ) : u.status === 'REALISASI_AKAD' ? (
                            <span className="text-rose-700 font-semibold">Akad Selesai · Siap BAST</span>
                          ) : (
                            <span>{app.customer.pekerjaan}</span>
                          )}
                        </div>
                      </td>

                      {/* Tombol Aksi */}
                      <td className="py-2.5 px-3.5 text-center">
                        {hasCustomer ? (
                          <button
                            type="button"
                            onClick={() => onSelectCustomer(u, app)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 hover:border-blue-600 font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs"
                            title="Buka jendela data konsumen"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span className="hidden sm:inline">Data Konsumen</span>
                            <span className="sm:hidden">Data</span>
                          </button>
                        ) : onSelectUnit ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectUnit(u);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 font-bold text-[11px] transition-all inline-flex items-center gap-1"
                            title="Buka detail unit untuk booking"
                          >
                            <Home className="w-3 h-3" />
                            <span>Lihat Unit</span>
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold">
              Menampilkan {filteredUnits.length} dari {totalStatusCount} unit berstatus {activeStatusCfg.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
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
    </div>
  );
}
