import React from 'react';
import { Unit, UnitStatus, KprApplication } from '../types';
import { STATUS_CONFIG, BLOCK_THEME } from './SitePlanMasterplan';
import { 
  X, 
  Home, 
  User, 
  FileText, 
  Hammer, 
  ExternalLink, 
  UserPlus, 
  AlertCircle, 
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface UnitPopupModalProps {
  unit: Unit | null;
  onClose: () => void;
  application: KprApplication | null;
  onOpenDocuments: (unit: Unit, app: KprApplication) => void;
  onOpenTracker: (unit: Unit, app: KprApplication) => void;
  onOpenNewBooking: (unit: Unit) => void;
  onUpdateUnitStatus: (unitId: string, newStatus: UnitStatus, newProgress?: number) => void;
  onOpenWhatsAppReminder?: (unit: Unit, app: KprApplication) => void;
  housingName?: string;
  companyName?: string;
}

export default function UnitPopupModal({
  unit,
  onClose,
  application,
  onOpenDocuments,
  onOpenTracker,
  onOpenNewBooking,
  onUpdateUnitStatus,
  onOpenWhatsAppReminder,
  housingName,
  companyName,
}: UnitPopupModalProps) {
  if (!unit) return null;

  const statusInfo = STATUS_CONFIG[unit.status];
  const blockInfo = BLOCK_THEME[unit.block];

  const totalDocs = application ? application.documents.length : 13;
  const verifiedDocs = application
    ? application.documents.filter((d) => d.status === 'TERVERIFIKASI').length
    : 0;
  const revisionDocs = application
    ? application.documents.filter((d) => d.status === 'PERLU_REVISI').length
    : 0;

  const docPercent = Math.round((verifiedDocs / totalDocs) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="relative px-5 py-4 flex items-center justify-between border-b border-slate-200"
          style={{
            background: `linear-gradient(135deg, ${statusInfo.hex}12 0%, #ffffff 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs font-mono font-extrabold text-lg text-white"
              style={{ backgroundColor: statusInfo.hex }}
            >
              {unit.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-slate-900">
                  Unit Rumah {unit.id}
                </h3>
                <span 
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border"
                  style={{
                    backgroundColor: `${statusInfo.hex}15`,
                    borderColor: `${statusInfo.hex}40`,
                    color: statusInfo.hex,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusInfo.hex }} />
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {unit.type} · {blockInfo.label} · LT {unit.luasTanah} m² / LB {unit.luasBangunan} m²
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick-Switch Status Bar (Light) */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs overflow-x-auto">
          <span className="text-slate-500 font-medium whitespace-nowrap mr-2 text-[11px]">
            Ubah Status (Admin):
          </span>
          <div className="flex items-center gap-1">
            {(['TERSEDIA', 'TERBOOKING', 'PROSES_PEMBANGUNAN', 'PROSES_KPR', 'REALISASI_AKAD'] as UnitStatus[]).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => onUpdateUnitStatus(unit.id, st)}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all text-[11px] whitespace-nowrap ${
                    unit.status === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {STATUS_CONFIG[st].label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Left Card: Specs */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-emerald-600" />
                  Spesifikasi Rumah Subsidi
                </span>
                <span className="text-xs font-bold text-emerald-700 font-mono">
                  Rp {unit.harga.toLocaleString('id-ID')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Luas Tanah</span>
                  <span className="font-bold text-slate-800">{unit.luasTanah} m²</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Luas Bangunan</span>
                  <span className="font-bold text-slate-800">{unit.luasBangunan} m² (Type 36)</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Kamar / Listrik</span>
                  <span className="font-bold text-slate-800">2 KT, 1 KM · 1300 VA</span>
                </div>
                <div className="p-2 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Pondasi & Rangka</span>
                  <span className="font-bold text-slate-800">Batu Kali, Baja Ringan</span>
                </div>
              </div>

              {/* Progress */}
              <div className="pt-1.5 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 font-medium flex items-center gap-1 text-[11px]">
                    <Hammer className="w-3.5 h-3.5 text-sky-600" />
                    Progres Konstruksi Fisik
                  </span>
                  <span className="font-mono font-bold text-sky-700 text-xs">
                    {unit.constructionProgress}% ({unit.constructionStage})
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{ width: `${unit.constructionProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Card: KPR Status */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    Data Pemohon / Debitur
                  </span>
                  {application && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {application.id}
                    </span>
                  )}
                </div>

                {application ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {application.customer.nama}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        NIK: {application.customer.nik} · {application.customer.pekerjaan}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-white border border-slate-200 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Bank Penyalur:</span>
                        <span className="font-bold text-emerald-700">{application.bankPenyalur}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Plafon Subsidi:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          Rp {application.plafonKpr.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Marketing PIC:</span>
                        <span className="text-slate-700">{application.marketingName}</span>
                      </div>
                    </div>

                    {/* Document gauge */}
                    <div className="pt-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium text-[11px]">
                          Kelengkapan Dokumen KPR
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          {verifiedDocs}/{totalDocs} ({docPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${docPercent}%` }}
                        />
                      </div>
                      {revisionDocs > 0 && (
                        <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1 font-semibold">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          {revisionDocs} berkas perlu perbaikan
                        </p>
                      )}
                    </div>
                  </div>
                ) : unit.status === 'TERSEDIA' ? (
                  <div className="text-center py-4 px-2 space-y-2.5">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Unit Belum Dipesan</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Unit {unit.id} siap dipasarkan. Booking fee Rp 1.500.000.
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenNewBooking(unit)}
                      className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Daftarkan Pemesan (Booking)
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-slate-500">
                    <p>Unit {unit.id} dalam status {statusInfo.label}.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {application && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => onOpenDocuments(unit, application)}
                className="p-3 rounded-xl bg-blue-50/80 hover:bg-blue-50 border border-blue-200 text-slate-900 flex items-center justify-between group transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs text-blue-900">
                      Kelengkapan Berkas & Audit Legal
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Upload e-KTP, KK, Slip Gaji, SPT PPh 21
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onOpenTracker(unit, application)}
                className="p-3 rounded-xl bg-indigo-50/80 hover:bg-indigo-50 border border-indigo-200 text-slate-900 flex items-center justify-between group transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs text-indigo-900">
                      Lacak Alur KPR Real-Time
                    </div>
                    <div className="text-[10px] text-slate-500">
                      SLIK OJK, Wawancara, SP3K & Akad Notaris
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {onOpenWhatsAppReminder && (
                <button
                  onClick={() => onOpenWhatsAppReminder(unit, application)}
                  className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-slate-900 flex items-center justify-between group transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-xs text-emerald-900">
                        Kirim Pengingat WhatsApp
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Jadwal wawancara, berkas, atau SP3K via WhatsApp
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 truncate mr-2">
            {housingName || 'Perumahan Griya Prima'} · Developer {companyName || 'PT Prima Karya'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shrink-0"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
