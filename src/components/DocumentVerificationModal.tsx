import React, { useState } from 'react';
import { Unit, KprApplication, DocumentItem, DocumentStatus, UserRole } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UploadCloud, 
  Eye, 
  Check, 
  RefreshCw, 
  FileText, 
  Printer, 
  ShieldCheck, 
  MessageSquare 
} from 'lucide-react';

interface DocumentVerificationModalProps {
  unit: Unit;
  application: KprApplication;
  role: UserRole;
  onClose: () => void;
  onUpdateDocumentStatus: (
    appId: string,
    docId: string,
    status: DocumentStatus,
    notes?: string
  ) => void;
  onUploadDocument: (appId: string, docId: string, fileName: string) => void;
}

export default function DocumentVerificationModal({
  unit,
  application,
  role,
  onClose,
  onUpdateDocumentStatus,
  onUploadDocument,
}: DocumentVerificationModalProps) {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'REVISION' | 'VERIFIED'>('ALL');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [revisionModalDoc, setRevisionModalDoc] = useState<DocumentItem | null>(null);
  const [revisionNotes, setRevisionNotes] = useState<string>('');
  const [simulatingUploadId, setSimulatingUploadId] = useState<string | null>(null);

  const verifiedCount = application.documents.filter((d) => d.status === 'TERVERIFIKASI').length;
  const pendingCount = application.documents.filter((d) => d.status === 'MENUNGGU_VERIFIKASI').length;
  const revisionCount = application.documents.filter((d) => d.status === 'PERLU_REVISI').length;
  const totalCount = application.documents.length;
  const percentComplete = Math.round((verifiedCount / totalCount) * 100);

  const filteredDocs = application.documents.filter((doc) => {
    if (filter === 'PENDING') return doc.status === 'MENUNGGU_VERIFIKASI';
    if (filter === 'REVISION') return doc.status === 'PERLU_REVISI';
    if (filter === 'VERIFIED') return doc.status === 'TERVERIFIKASI';
    return true;
  });

  const handleSimulateUpload = (doc: DocumentItem) => {
    setSimulatingUploadId(doc.id);
    setTimeout(() => {
      const generatedName = `${doc.type.toLowerCase()}_${application.customer.nama.toLowerCase().replace(/\s+/g, '_')}_final.pdf`;
      onUploadDocument(application.id, doc.id, generatedName);
      setSimulatingUploadId(null);
    }, 600);
  };

  const handleApprove = (doc: DocumentItem) => {
    onUpdateDocumentStatus(application.id, doc.id, 'TERVERIFIKASI');
    if (verifiedCount + 1 === totalCount) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleOpenRevisionModal = (doc: DocumentItem) => {
    setRevisionModalDoc(doc);
    setRevisionNotes(doc.notes || '');
  };

  const handleConfirmRevision = () => {
    if (!revisionModalDoc) return;
    onUpdateDocumentStatus(
      application.id,
      revisionModalDoc.id,
      'PERLU_REVISI',
      revisionNotes.trim() || 'Mohon unggah ulang dokumen yang lebih jelas dan bertanda tangan sah.'
    );
    setRevisionModalDoc(null);
    setRevisionNotes('');
  };

  const printSummary = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Clean Light) */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Audit Berkas KPR Subsidi FLPP
                </h3>
                <span className="font-mono text-xs font-bold px-2 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Unit {unit.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pemohon: <span className="text-slate-900 font-medium">{application.customer.nama}</span> · Bank: <span className="text-emerald-700 font-medium">{application.bankPenyalur}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={printSummary}
              className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium hidden sm:flex items-center gap-1"
              title="Cetak Berkas"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kontrol</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress & Stat Strip */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <div className="text-xs text-slate-600">
              Validasi: <strong className="text-slate-900 font-mono">{verifiedCount}/{totalCount} ({percentComplete}%)</strong>
            </div>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          {/* Quick Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                filter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'PENDING' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <span>Antre Legal</span>
              {pendingCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-800 text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('REVISION')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'REVISION' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <span>Perlu Revisi</span>
              {revisionCount > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center justify-center">
                  {revisionCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter('VERIFIED')}
              className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                filter === 'VERIFIED' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Sah ({verifiedCount})
            </button>
          </div>
        </div>

        {/* Document List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2">
          {filteredDocs.map((doc) => {
            const isVerified = doc.status === 'TERVERIFIKASI';
            const isRevision = doc.status === 'PERLU_REVISI';
            const isPending = doc.status === 'MENUNGGU_VERIFIKASI';
            const isUploading = simulatingUploadId === doc.id;

            return (
              <div
                key={doc.id}
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isVerified
                    ? 'bg-slate-50/70 border-slate-200'
                    : isRevision
                    ? 'bg-amber-50/60 border-amber-300'
                    : isPending
                    ? 'bg-blue-50/60 border-blue-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${
                      isVerified
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                        : isRevision
                        ? 'bg-amber-100 border-amber-300 text-amber-700'
                        : isPending
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isVerified ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isRevision ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : isPending ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">{doc.title}</span>
                      {doc.required && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-200">
                          Wajib
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isRevision
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : isPending
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {isVerified
                          ? 'Sah / Terverifikasi'
                          : isRevision
                          ? 'Perlu Revisi'
                          : isPending
                          ? 'Menunggu Audit'
                          : 'Belum Diunggah'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500">{doc.description}</p>

                    {doc.fileName && (
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-0.5 font-mono">
                        <span className="text-blue-700 underline flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {doc.fileName}
                        </span>
                        {doc.verifiedBy && <span>· Diverifikasi: {doc.verifiedBy}</span>}
                      </div>
                    )}

                    {doc.notes && (
                      <div className="mt-1 p-1.5 rounded-lg bg-amber-100/70 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Catatan Legal:</strong> {doc.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
                  {doc.fileName && (
                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs flex items-center gap-1 transition-colors"
                      title="Pratinjau"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Preview</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleSimulateUpload(doc)}
                    disabled={isUploading}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isUploading
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
                        <span className="text-[11px]">Upload...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px]">{doc.fileName ? 'Ganti' : 'Unggah'}</span>
                      </>
                    )}
                  </button>

                  {(role === 'ADMIN_LEGAL' || role === 'MARKETING') && doc.fileName && (
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5">
                      {!isVerified && (
                        <button
                          onClick={() => handleApprove(doc)}
                          className="px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs"
                          title="Sahkan Dokumen"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Sahkan</span>
                        </button>
                      )}

                      {!isRevision && (
                        <button
                          onClick={() => handleOpenRevisionModal(doc)}
                          className="px-2 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 transition-all border border-amber-300"
                          title="Minta Revisi"
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Revisi</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Perubahan status berkas otomatis memicu notifikasi real-time ke nasabah & marketing.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Revision Modal Prompt (Light) */}
      {revisionModalDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Permintaan Revisi Dokumen
                </h4>
                <p className="text-xs text-slate-500">
                  {revisionModalDoc.title}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Catatan Revisi untuk Marketing / Pemohon:
              </label>
              <textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Contoh: Dokumen slip gaji bulan ke-3 terpotong / belum ada stempel basah."
                rows={3}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setRevisionModalDoc(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRevision}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Kirim Revisi & Notifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document File Preview Modal (Light) */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs text-slate-900">
                  Pratinjau Berkas: {selectedDocForPreview.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-16 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-500 font-mono text-xs shadow-xs">
                PDF
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs">
                  {selectedDocForPreview.fileName}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Ukuran: {selectedDocForPreview.fileSize || '1.2 MB'} · Format: PDF Resmi
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
