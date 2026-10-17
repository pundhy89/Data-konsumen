import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { 
  History, 
  CheckCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileUp, 
  FileText, 
  Sparkles, 
  X, 
  ExternalLink,
  Play,
  Users,
  Shield,
  Briefcase,
  User,
  Landmark,
  MessageSquare,
  Clock,
  Trash2
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSelectUnitById: (unitId: string) => void;
  onTriggerSimulatedEvent: (customScenario?: {
    title: string;
    message: string;
    actor: string;
    actorRole: 'ADMIN_LEGAL' | 'MARKETING' | 'KONSUMEN' | 'BANK';
    unitId: string;
  }) => void;
  activeToast: NotificationItem | null;
  onDismissToast: () => void;
  onClearHistory?: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectUnitById,
  onTriggerSimulatedEvent,
  activeToast,
  onDismissToast,
  onClearHistory,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [accountFilter, setAccountFilter] = useState<'ALL' | 'LEGAL' | 'MARKETING' | 'KONSUMEN' | 'BANK'>('ALL');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredHistory = notifications.filter((n) => {
    if (accountFilter === 'ALL') return true;
    if (accountFilter === 'LEGAL') return n.actorRole === 'ADMIN_LEGAL';
    if (accountFilter === 'MARKETING') return n.actorRole === 'MARKETING';
    if (accountFilter === 'KONSUMEN') return n.actorRole === 'KONSUMEN';
    if (accountFilter === 'BANK') return n.actorRole === 'BANK';
    return true;
  });

  const getActorBadge = (item: NotificationItem) => {
    const role = item.actorRole || 'ADMIN_LEGAL';
    switch (role) {
      case 'KONSUMEN':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
            <User className="w-2.5 h-2.5 text-purple-600" />
            <span>Debitur</span>
          </span>
        );
      case 'MARKETING':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
            <Briefcase className="w-2.5 h-2.5 text-amber-600" />
            <span>Marketing</span>
          </span>
        );
      case 'BANK':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
            <Landmark className="w-2.5 h-2.5 text-indigo-600" />
            <span>Bank / Notaris</span>
          </span>
        );
      case 'SISTEM':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <MessageSquare className="w-2.5 h-2.5 text-emerald-600" />
            <span>WhatsApp Bot</span>
          </span>
        );
      case 'ADMIN_LEGAL':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
            <Shield className="w-2.5 h-2.5 text-blue-600" />
            <span>Tim Legal</span>
          </span>
        );
    }
  };

  const getHistoryIcon = (item: NotificationItem) => {
    switch (item.type) {
      case 'document_rejected':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'document_uploaded':
        return <FileUp className="w-4 h-4 text-blue-600" />;
      case 'document_verified':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'sp3k_issued':
      case 'payment_received':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'whatsapp_sent':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleItemClick = (item: NotificationItem) => {
    onMarkAsRead(item.id);
    if (item.targetUnitId) {
      onSelectUnitById(item.targetUnitId);
      setIsOpen(false);
    }
  };

  // Multi-account simulation scenarios
  const triggerDebiturUpload = () => {
    onTriggerSimulatedEvent({
      title: 'Unggah Berkas Baru via Portal Debitur',
      message: 'Akun Debitur Tri Joko (Unit A.04) baru saja mengunggah revisi Slip Gaji & Rekening Koran.',
      actor: 'Tri Joko (Debitur / Konsumen)',
      actorRole: 'KONSUMEN',
      unitId: 'A.04',
    });
  };

  const triggerMarketingBooking = () => {
    onTriggerSimulatedEvent({
      title: 'Booking Unit Baru Diinput Marketing',
      message: 'Akun Marketing Rizky Pratama mengunci Unit C.09 untuk pemohon baru.',
      actor: 'Rizky Pratama (Marketing)',
      actorRole: 'MARKETING',
      unitId: 'C.09',
    });
  };

  const triggerBankSP3K = () => {
    onTriggerSimulatedEvent({
      title: 'Persetujuan SP3K dari Bank BTN',
      message: 'Akun Analis Bank BTN mengesahkan SP3K Unit B.07 dengan plafon Rp 180.500.000.',
      actor: 'Hendra Kusuma (Analis Bank BTN)',
      actorRole: 'BANK',
      unitId: 'B.07',
    });
  };

  return (
    <>
      {/* Header History Trigger Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-bold ${
            isOpen
              ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs'
          }`}
          title="Riwayat Aktivitas Real-Time (Multi-Akun)"
        >
          <History className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline text-xs font-bold">History</span>
          {unreadCount > 0 && (
            <span className="min-w-[18px] h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold font-mono flex items-center justify-center shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Menu (Clean History Panel) */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <History className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Riwayat Aktivitas Real-Time</span>
                    {unreadCount > 0 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {unreadCount} Baru
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Log multi-akun: Legal, Marketing, Konsumen & Bank
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-[10px] text-slate-300 hover:text-white transition-colors flex items-center gap-0.5 px-2 py-0.5 rounded bg-white/10"
                    title="Tandai semua dibaca"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Dibaca</span>
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Multi-Account Simulation Bar */}
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
              <div className="text-[10px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                <span>Simulasi Real-Time Multi-Akun:</span>
                <span className="text-slate-400 font-normal">Klik untuk tes upload</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={triggerDebiturUpload}
                  className="px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <User className="w-2.5 h-2.5" />
                  <span>+ Debitur Unggah</span>
                </button>
                <button
                  onClick={triggerMarketingBooking}
                  className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <Briefcase className="w-2.5 h-2.5" />
                  <span>+ Marketing Input</span>
                </button>
                <button
                  onClick={triggerBankSP3K}
                  className="px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[10px] font-bold flex items-center gap-1"
                >
                  <Landmark className="w-2.5 h-2.5" />
                  <span>+ Bank SP3K</span>
                </button>
              </div>
            </div>

            {/* Filter by Account Source */}
            <div className="px-3 py-1.5 bg-white border-b border-slate-200 flex items-center gap-1 text-xs overflow-x-auto">
              <button
                onClick={() => setAccountFilter('ALL')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                  accountFilter === 'ALL' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                onClick={() => setAccountFilter('KONSUMEN')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                  accountFilter === 'KONSUMEN' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-500 hover:text-purple-700'
                }`}
              >
                Debitur
              </button>
              <button
                onClick={() => setAccountFilter('MARKETING')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                  accountFilter === 'MARKETING' ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-500 hover:text-amber-800'
                }`}
              >
                Marketing
              </button>
              <button
                onClick={() => setAccountFilter('LEGAL')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                  accountFilter === 'LEGAL' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-500 hover:text-blue-700'
                }`}
              >
                Legal
              </button>
              <button
                onClick={() => setAccountFilter('BANK')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                  accountFilter === 'BANK' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-500 hover:text-indigo-700'
                }`}
              >
                Bank
              </button>
            </div>

            {/* History List */}
            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Tidak ada riwayat aktivitas pada filter ini.
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                      item.read
                        ? 'opacity-80 hover:opacity-100 hover:bg-slate-50'
                        : 'bg-blue-50/50 border border-blue-200 hover:bg-blue-50 shadow-2xs'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-white shrink-0 border border-slate-200 shadow-2xs">
                      {getHistoryIcon(item)}
                    </div>
                    <div className="flex-1 space-y-1">
                      {/* Top Row: Actor Badge + Unit */}
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {getActorBadge(item)}
                          {item.targetUnitId && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              Unit {item.targetUnitId}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {item.timestamp}
                        </span>
                      </div>

                      {/* Title & Actor Name */}
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                          {item.title}
                          {!item.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                          )}
                        </div>
                        {item.actor && (
                          <div className="text-[10px] text-slate-500 font-medium">
                            Oleh: <strong className="text-slate-700">{item.actor}</strong>
                          </div>
                        )}
                      </div>

                      {/* Message */}
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {item.message}
                      </p>

                      {item.targetUnitId && (
                        <div className="text-[10px] text-blue-700 font-bold flex items-center gap-0.5 pt-0.5">
                          <span>Buka Lokasi Kavling</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Toast Banner (Real-Time Live Notification) */}
      {activeToast && (
        <div className="fixed bottom-4 right-4 z-60 max-w-sm w-full animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white/95 border border-slate-300 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
              {getHistoryIcon(activeToast)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">
                  {activeToast.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Baru saja
                </span>
              </div>
              <div className="mt-0.5">
                {getActorBadge(activeToast)}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-snug">
                {activeToast.message}
              </p>
              {activeToast.targetUnitId && (
                <button
                  onClick={() => {
                    onSelectUnitById(activeToast.targetUnitId!);
                    onDismissToast();
                  }}
                  className="mt-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Buka Unit {activeToast.targetUnitId}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={onDismissToast}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
