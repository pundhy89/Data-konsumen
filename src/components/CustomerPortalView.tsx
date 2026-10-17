import React, { useState } from 'react';
import { Unit, KprApplication } from '../types';
import { KPR_STAGES_INFO } from '../data/initialData';
import { 
  Search, 
  Clock, 
  AlertCircle, 
  UploadCloud, 
  ShieldCheck, 
  Phone 
} from 'lucide-react';

interface CustomerPortalViewProps {
  applications: KprApplication[];
  units: Unit[];
  onOpenDocuments: (unit: Unit, app: KprApplication) => void;
  onOpenTracker: (unit: Unit, app: KprApplication) => void;
}

export default function CustomerPortalView({
  applications,
  units,
  onOpenDocuments,
  onOpenTracker,
}: CustomerPortalViewProps) {
  const [searchQuery, setSearchQuery] = useState('3201123456780003');
  const [activeApp, setActiveApp] = useState<KprApplication | null>(applications[0] || null);
  const [searchFeedback, setSearchFeedback] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = applications.find(
      (a) =>
        a.id.toLowerCase() === q ||
        a.customer.nik.toLowerCase() === q ||
        a.customer.nama.toLowerCase().includes(q) ||
        a.unitId.toLowerCase() === q
    );

    if (found) {
      setActiveApp(found);
      setSearchFeedback('');
    } else {
      setSearchFeedback('Data pengajuan tidak ditemukan. Pastikan NIK atau No. Registrasi KPR benar.');
    }
  };

  const activeUnit = activeApp ? units.find((u) => u.id === activeApp.unitId) : null;
  const currentStageIndex = activeApp
    ? KPR_STAGES_INFO.findIndex((s) => s.stage === activeApp.currentStage)
    : 0;

  const revisionDocs = activeApp
    ? activeApp.documents.filter((d) => d.status === 'PERLU_REVISI')
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-3">
      {/* Search Header Banner (Clean Light) */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 text-center space-y-2.5 shadow-2xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Portal Pemantauan Mandiri Debitur KPR Bersubsidi</span>
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Lacak Sampai Mana Pengajuan KPR Anda Berjalan
        </h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Masukkan 16 Digit NIK e-KTP Anda atau Nomor Registrasi KPR (contoh: KPR-2026-001) untuk memeriksa status berkas dan SP3K.
        </p>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masukkan NIK atau No. Registrasi..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>Cek Status</span>
          </button>
        </form>

        {searchFeedback && (
          <p className="text-xs text-red-600 font-medium">{searchFeedback}</p>
        )}
      </div>

      {/* Results View (Light Theme) */}
      {activeApp && activeUnit && (
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 space-y-4 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {activeApp.customer.nama}
                </h3>
                <span className="font-mono text-xs px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeApp.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Unit Rumah: <strong className="text-slate-800">Blok {activeUnit.id}</strong> ({activeUnit.type}) · Bank: <strong className="text-emerald-700">{activeApp.bankPenyalur}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenDocuments(activeUnit, activeApp)}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Unggah Berkas</span>
              </button>
              <button
                onClick={() => onOpenTracker(activeUnit, activeApp)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Lihat Timeline</span>
              </button>
            </div>
          </div>

          {/* Urgent Revision Alert */}
          {revisionDocs.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Perhatian: Ada {revisionDocs.length} Dokumen Memerlukan Revisi
                </h4>
                {revisionDocs.map((doc) => (
                  <div key={doc.id} className="text-xs text-amber-800">
                    • <strong>{doc.title}</strong>: {doc.notes || 'Mohon unggah dokumen yang lebih jelas.'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Stage Stepper */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Tahapan Alur Pengajuan Saat Ini:
              </span>
              <span className="font-mono text-indigo-700 font-bold text-xs">
                Tahap {currentStageIndex + 1} dari 8 ({KPR_STAGES_INFO[currentStageIndex].label.split('. ')[1]})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {KPR_STAGES_INFO.slice(0, 4).map((st, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={st.stage}
                    className={`p-2.5 rounded-lg border text-xs ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-400 shadow-2xs ring-1 ring-indigo-400'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-slate-500 mb-0.5">
                      Langkah 0{idx + 1}
                    </div>
                    <div className="font-bold text-slate-800 line-clamp-1">{st.label.split('. ')[1]}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">
                      {isPassed ? '✓ Selesai' : isCurrent ? '⚡ Berjalan' : 'Menunggu'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {KPR_STAGES_INFO.slice(4, 8).map((st, idx) => {
                const actualIdx = idx + 4;
                const isPassed = actualIdx < currentStageIndex;
                const isCurrent = actualIdx === currentStageIndex;

                return (
                  <div
                    key={st.stage}
                    className={`p-2.5 rounded-lg border text-xs ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-400 shadow-2xs ring-1 ring-indigo-400'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="font-mono text-[9px] text-slate-500 mb-0.5">
                      Langkah 0{actualIdx + 1}
                    </div>
                    <div className="font-bold text-slate-800 line-clamp-1">{st.label.split('. ')[1]}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">
                      {isPassed ? '✓ Selesai' : isCurrent ? '⚡ Berjalan' : 'Menunggu'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Help */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-900 font-bold">Butuh Bantuan Pemberkasan?</div>
                <div className="text-slate-500">Marketing PIC: <strong className="text-slate-800">{activeApp.marketingName}</strong> (WA: 0812-8800-9922)</div>
              </div>
            </div>

            <div className="text-slate-500 text-right">
              <div>Plafon KPR: <strong className="text-emerald-700 font-mono">Rp {activeApp.plafonKpr.toLocaleString('id-ID')}</strong></div>
              <div>Tenor: <strong className="text-slate-800">{activeApp.tenorTahun} Thn</strong> (~Rp {activeApp.cicilanPerBulan.toLocaleString('id-ID')}/bln)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
