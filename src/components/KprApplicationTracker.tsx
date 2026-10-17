import React, { useState } from 'react';
import { Unit, KprApplication, KprStage } from '../types';
import { KPR_STAGES_INFO } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  X, 
  Clock, 
  Plus, 
  Check, 
  User, 
  Sparkles, 
  Send 
} from 'lucide-react';

interface KprApplicationTrackerProps {
  unit: Unit;
  application: KprApplication;
  onClose: () => void;
  onUpdateStage: (appId: string, newStage: KprStage, note: string) => void;
}

export default function KprApplicationTracker({
  unit,
  application,
  onClose,
  onUpdateStage,
}: KprApplicationTrackerProps) {
  const [selectedStageToAdvance, setSelectedStageToAdvance] = useState<KprStage>(application.currentStage);
  const [advanceNote, setAdvanceNote] = useState<string>('');
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  const currentStageIndex = KPR_STAGES_INFO.findIndex((s) => s.stage === application.currentStage);

  const handleAdvanceStage = () => {
    if (!advanceNote.trim()) {
      alert('Mohon isi catatan perkembangan tahapan pengajuan.');
      return;
    }
    onUpdateStage(application.id, selectedStageToAdvance, advanceNote.trim());
    setIsAdvancing(false);
    setAdvanceNote('');

    if (selectedStageToAdvance === 'AKAD_KREDIT' || selectedStageToAdvance === 'BAST_KUNCI') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-700">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Monitoring Alur KPR Real-Time
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Unit {unit.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                No: <span className="font-mono text-slate-700">{application.id}</span> · Debitur: <span className="text-slate-900 font-medium">{application.customer.nama}</span>
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

        {/* Live Summary Bar */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Bank Penyalur</span>
            <span className="font-bold text-emerald-700 text-xs">{application.bankPenyalur}</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Plafon KPR</span>
            <span className="font-bold text-slate-900 font-mono text-xs">
              Rp {application.plafonKpr.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Status SP3K</span>
            <span className="font-bold text-indigo-700 text-xs">
              {application.sp3kNumber ? 'SP3K Terbit' : 'Analisa Bank'}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block text-[10px]">Tahap Aktif</span>
            <span className="font-bold text-slate-800 text-xs">
              Langkah {currentStageIndex + 1} dari 8
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Horizontal Stepper */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              8 Tahapan Pengajuan KPR Subsidi FLPP
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
              {KPR_STAGES_INFO.map((item, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={item.stage}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between min-h-[92px] transition-all ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-400 shadow-xs ring-1 ring-indigo-400'
                        : isPassed
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono mb-1 ${
                        isCurrent
                          ? 'bg-indigo-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="text-[10px] font-bold line-clamp-2 text-slate-800 leading-tight">
                      {item.label.split('. ')[1]}
                    </div>

                    <div className="text-[9px] text-slate-500 mt-0.5">
                      {isPassed ? 'Selesai' : isCurrent ? 'Aktif' : 'Menunggu'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advance Stage Form Action */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div>
              <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Pembaruan Tahapan KPR (Legal & Bank)
              </div>
              <div className="text-[11px] text-slate-500">
                Ubah tahapan KPR atau catat hasil perkembangan wawancara/SP3K secara real-time.
              </div>
            </div>
            <button
              onClick={() => setIsAdvancing(!isAdvancing)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAdvancing ? 'Tutup' : 'Update Tahapan'}</span>
            </button>
          </div>

          {/* Form */}
          {isAdvancing && (
            <div className="p-3.5 rounded-xl bg-white border border-indigo-300 space-y-3 shadow-xs">
              <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Formulir Update Tahapan KPR
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Tahapan Baru:
                  </label>
                  <select
                    value={selectedStageToAdvance}
                    onChange={(e) => setSelectedStageToAdvance(e.target.value as KprStage)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
                  >
                    {KPR_STAGES_INFO.map((st) => (
                      <option key={st.stage} value={st.stage}>
                        {st.label} ({st.roleResponsible})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Pelaksana Update:
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Tim Legalitas & Analis Bank"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Catatan Progres Real-Time:
                </label>
                <textarea
                  value={advanceNote}
                  onChange={(e) => setAdvanceNote(e.target.value)}
                  placeholder="Contoh: Analis Bank BTN menyetujui plafon penuh Rp 180.500.000. SP3K terbit."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => setIsAdvancing(false)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleAdvanceStage}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  Simpan & Notifikasi
                </button>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              Riwayat Perjalanan Berkas
            </h4>

            <div className="space-y-2.5 pl-2 border-l-2 border-slate-200">
              {application.timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative pl-4">
                  <div className="absolute -left-[13px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white shadow-xs" />

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                      <span className="font-bold text-xs text-slate-900">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-700 px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Diproses: <strong className="text-slate-700">{item.actor}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Riwayat tersinkronisasi otomatis dengan portal pemantauan nasabah.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
