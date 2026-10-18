import React, { useState, useEffect, useRef } from 'react';
import { 
  Unit, 
  UnitStatus, 
  BlockId, 
  KprApplication, 
  NotificationItem, 
  UserRole, 
  DocumentStatus,
  KprStage,
  AppSettings,
  WhatsAppReminder
} from './types';
import { 
  generateInitialUnits, 
  generateInitialApplications, 
  INITIAL_NOTIFICATIONS, 
  KPR_STAGES_INFO,
  INITIAL_SETTINGS,
  INITIAL_REMINDERS
} from './data/initialData';
import SitePlanMasterplan from './components/SitePlanMasterplan';
import UnitPopupModal from './components/UnitPopupModal';
import KprApplicationTracker from './components/KprApplicationTracker';
import NotificationCenter from './components/NotificationCenter';
import NewBookingModal from './components/NewBookingModal';
import SettingsView from './components/SettingsView';
import WhatsAppReminderView from './components/WhatsAppReminderView';
import CustomerDetailModal from './components/CustomerDetailModal';
import { 
  Building2, 
  Layers, 
  FileText, 
  Search, 
  Sparkles, 
  AlertCircle,
  Clock,
  Shield,
  CheckCircle2,
  Settings,
  MessageSquare,
  Send,
  ChevronRight,
  Check,
  X,
  User,
  Home,
  Compass
} from 'lucide-react';

export default function App() {
  // Master states
  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('sikpr_units');
    return saved ? JSON.parse(saved) : generateInitialUnits();
  });

  const [applications, setApplications] = useState<KprApplication[]>(() => {
    const saved = localStorage.getItem('sikpr_apps');
    return saved ? JSON.parse(saved) : generateInitialApplications();
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sikpr_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Settings State (Title, Perumahan, Perusahaan, Harga Unit, Marketing, Bank, Stages)
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('sikpr_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // WhatsApp Reminders State
  const [reminders, setReminders] = useState<WhatsAppReminder[]>(() => {
    const saved = localStorage.getItem('sikpr_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });

  // Logo Menu Popover State (Menaruh menu tab di logo aplikasi)
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState<boolean>(false);
  const logoMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close logo menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (logoMenuRef.current && !logoMenuRef.current.contains(event.target as Node)) {
        setIsLogoMenuOpen(false);
      }
    };
    if (isLogoMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLogoMenuOpen]);

  // App navigation & filters (Tabs: masterplan, pemberkasan, whatsapp, settings)
  const [activeTab, setActiveTab] = useState<'masterplan' | 'pemberkasan' | 'whatsapp' | 'settings'>('masterplan');
  
  // Listen to Escape key to return to fullscreen masterplan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTab !== 'masterplan') {
        setActiveTab('masterplan');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN_LEGAL');
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'ALL'>('ALL');
  const [blockFilter, setBlockFilter] = useState<BlockId | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [trackerModalApp, setTrackerModalApp] = useState<{ unit: Unit; app: KprApplication } | null>(null);
  const [bookingUnit, setBookingUnit] = useState<Unit | null>(null);
  const [customerDetailModal, setCustomerDetailModal] = useState<{ unit: Unit; app: KprApplication } | null>(null);

  // Active floating toast
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sikpr_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('sikpr_apps', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('sikpr_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sikpr_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('sikpr_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Background automated scheduler for WhatsApp reminders
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setReminders((prev) => {
        let changed = false;
        const updated = prev.map((rem) => {
          if (rem.status === 'SCHEDULED' && new Date(rem.scheduledDate) <= now) {
            changed = true;
            pushNotification(
              'Pengingat WhatsApp Waktunya Dikirim!',
              `Jadwal kirim pesan ke ${rem.recipientName} (${rem.phoneNumber}) Unit ${rem.unitId || '-'} sudah tiba.`,
              'whatsapp_sent',
              rem.unitId,
              rem.applicationId,
              'urgent',
              'Sistem Pengingat WhatsApp',
              'SISTEM'
            );
            return { ...rem, status: 'READY' as const };
          }
          return rem;
        });
        return changed ? updated : prev;
      });
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  // Helper: Trigger Notification / History
  const pushNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'],
    targetUnitId?: string,
    applicationId?: string,
    severity: NotificationItem['severity'] = 'info',
    actor: string = 'Tim Legal / Admin',
    actorRole: NotificationItem['actorRole'] = 'ADMIN_LEGAL'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      targetUnitId,
      applicationId,
      timestamp: 'Baru saja',
      read: false,
      severity,
      actor,
      actorRole,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);

    setTimeout(() => {
      setActiveToast((current) => (current?.id === newNotif.id ? null : current));
    }, 6000);
  };

  // Unit Selection handler
  const handleSelectUnit = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleSelectUnitById = (unitId: string) => {
    const found = units.find((u) => u.id === unitId);
    if (found) {
      setSelectedUnit(found);
      setActiveTab('masterplan');
    }
  };

  const getAppForUnit = (unit: Unit | null): KprApplication | null => {
    if (!unit) return null;
    return applications.find((a) => a.unitId === unit.id) || null;
  };

  // Update Unit Status
  const handleUpdateUnitStatus = (unitId: string, newStatus: UnitStatus, newProgress?: number) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          const updated = {
            ...u,
            status: newStatus,
            constructionProgress: newProgress !== undefined ? newProgress : u.constructionProgress,
          };
          if (newStatus === 'REALISASI_AKAD') {
            updated.constructionProgress = 100;
            updated.constructionStage = 'Siap BAST';
          }
          return updated;
        }
        return u;
      })
    );

    if (selectedUnit?.id === unitId) {
      setSelectedUnit((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    pushNotification(
      'Status Unit Diperbarui',
      `Unit ${unitId} berhasil diubah statusnya menjadi ${newStatus.replace('_', ' ')} oleh ${currentRole}.`,
      'stage_changed',
      unitId,
      undefined,
      'info'
    );
  };

  // Add Pin Unit Handler
  const handleAddUnit = (newUnit: Unit, coords: { x: number; y: number }) => {
    setUnits((prev) => {
      const exists = prev.some((u) => u.id === newUnit.id);
      if (exists) {
        return prev.map((u) => (u.id === newUnit.id ? newUnit : u));
      }
      return [...prev, newUnit];
    });

    pushNotification(
      'Pin Unit Ditambahkan',
      `Pin Unit ${newUnit.id} berhasil ditambahkan pada denah kawasan.`,
      'stage_changed',
      newUnit.id,
      undefined,
      'success'
    );
  };

  // Update Pin Unit Handler
  const handleUpdateUnit = (updatedUnit: Unit) => {
    setUnits((prev) => prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u)));
    if (selectedUnit?.id === updatedUnit.id) {
      setSelectedUnit(updatedUnit);
    }

    pushNotification(
      'Pin Unit Diperbarui',
      `Data pin Unit ${updatedUnit.id} berhasil diperbarui.`,
      'stage_changed',
      updatedUnit.id,
      undefined,
      'info'
    );
  };

  // Delete Pin Unit Handler
  const handleDeleteUnit = (unitId: string) => {
    setUnits((prev) => prev.filter((u) => u.id !== unitId));
    if (selectedUnit?.id === unitId) {
      setSelectedUnit(null);
    }

    pushNotification(
      'Pin Unit Dihapus',
      `Pin Unit ${unitId} berhasil dihapus dari denah kawasan.`,
      'stage_changed',
      unitId,
      undefined,
      'urgent'
    );
  };

  // Update Document Status
  const handleUpdateDocumentStatus = (
    appId: string,
    docId: string,
    status: DocumentStatus,
    notes?: string
  ) => {
    let affectedUnitId = '';
    let docTitle = '';
    let custName = '';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          affectedUnitId = app.unitId;
          custName = app.customer.nama;
          const updatedDocs = app.documents.map((doc) => {
            if (doc.id === docId) {
              docTitle = doc.title;
              return {
                ...doc,
                status,
                notes: notes !== undefined ? notes : doc.notes,
                verifiedAt: status === 'TERVERIFIKASI' ? new Date().toISOString() : doc.verifiedAt,
                verifiedBy: status === 'TERVERIFIKASI' ? 'Tim Legal (Amanda SH)' : doc.verifiedBy,
              };
            }
            return doc;
          });
          return { ...app, documents: updatedDocs, updatedAt: new Date().toISOString() };
        }
        return app;
      })
    );

    if (status === 'TERVERIFIKASI') {
      pushNotification(
        'Dokumen Berhasil Diverifikasi',
        `Berkas "${docTitle}" pemohon ${custName} (Unit ${affectedUnitId}) telah disahkan oleh Tim Legalitas.`,
        'document_verified',
        affectedUnitId,
        appId,
        'success'
      );
    } else if (status === 'PERLU_REVISI') {
      pushNotification(
        'Dokumen Memerlukan Revisi',
        `Berkas "${docTitle}" pemohon ${custName} (Unit ${affectedUnitId}) ditolak Legal. Catatan: "${notes}"`,
        'document_rejected',
        affectedUnitId,
        appId,
        'urgent'
      );
    }
  };

  // Upload Document
  const handleUploadDocument = (appId: string, docId: string, fileName: string) => {
    let unitId = '';
    let customerName = '';
    let docTitle = '';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          unitId = app.unitId;
          customerName = app.customer.nama;
          const updatedDocs = app.documents.map((d) => {
            if (d.id === docId) {
              docTitle = d.title;
              return {
                ...d,
                fileName,
                fileSize: '1.2 MB',
                status: 'MENUNGGU_VERIFIKASI' as DocumentStatus,
                uploadedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              };
            }
            return d;
          });
          return { ...app, documents: updatedDocs };
        }
        return app;
      })
    );

    pushNotification(
      'Dokumen Baru Diunggah',
      `Dokumen "${docTitle}" untuk Unit ${unitId} (${customerName}) telah diunggah. Menunggu verifikasi tim legal.`,
      'document_uploaded',
      unitId,
      appId,
      'info'
    );
  };

  // Update KPR Stage
  const handleUpdateStage = (appId: string, newStage: KprStage, note: string) => {
    let unitId = '';
    let custName = '';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          unitId = app.unitId;
          custName = app.customer.nama;
          const newTimelineItem = {
            id: `tl-${Date.now()}`,
            stage: newStage,
            title: `Tahap: ${KPR_STAGES_INFO.find((s) => s.stage === newStage)?.label || newStage}`,
            description: note,
            timestamp: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            actor: currentRole === 'ADMIN_LEGAL' ? 'Legalitas Developer' : 'Marketing PIC',
            status: 'completed' as const,
          };

          return {
            ...app,
            currentStage: newStage,
            timeline: [newTimelineItem, ...app.timeline],
            updatedAt: new Date().toISOString(),
          };
        }
        return app;
      })
    );

    if (newStage === 'PROSES_KONSTRUKSI') {
      handleUpdateUnitStatus(unitId, 'PROSES_PEMBANGUNAN');
    } else if (newStage === 'AKAD_KREDIT' || newStage === 'BAST_KUNCI') {
      handleUpdateUnitStatus(unitId, 'REALISASI_AKAD');
    } else if (newStage === 'ANALISA_SP3K') {
      handleUpdateUnitStatus(unitId, 'PROSES_KPR');
    }

    pushNotification(
      'Tahapan KPR Bergerak',
      `Pemohon ${custName} (Unit ${unitId}) berpindah ke tahap: ${newStage.replace(/_/g, ' ')}. ${note}`,
      'stage_changed',
      unitId,
      appId,
      'success'
    );
  };

  // Confirm new booking
  const handleConfirmBooking = (newApp: KprApplication) => {
    setApplications((prev) => [newApp, ...prev]);

    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === newApp.unitId) {
          return {
            ...u,
            status: 'TERBOOKING',
            customerName: newApp.customer.nama,
            marketingName: newApp.marketingName,
            applicationId: newApp.id,
          };
        }
        return u;
      })
    );

    setBookingUnit(null);
    if (selectedUnit?.id === newApp.unitId) {
      setSelectedUnit((prev) => (prev ? { ...prev, status: 'TERBOOKING', customerName: newApp.customer.nama } : null));
    }

    pushNotification(
      'Booking Unit Baru Berhasil',
      `Unit ${newApp.unitId} berhasil dikunci atas nama ${newApp.customer.nama} (Marketing: ${newApp.marketingName}). Booking fee Rp 1.500.000 tercatat.`,
      'payment_received',
      newApp.unitId,
      newApp.id,
      'success'
    );
  };

  const handleTriggerSimulatedEvent = (customScenario?: {
    title: string;
    message: string;
    actor: string;
    actorRole: 'ADMIN_LEGAL' | 'MARKETING' | 'KONSUMEN' | 'BANK';
    unitId: string;
  }) => {
    if (customScenario) {
      pushNotification(
        customScenario.title,
        customScenario.message,
        'document_uploaded',
        customScenario.unitId,
        undefined,
        'info',
        customScenario.actor,
        customScenario.actorRole
      );
      return;
    }

    const scenarios = [
      {
        title: 'Dokumen Slip Gaji Diunggah Real-Time',
        message: 'Pemohon Hendri Saputra (Unit A.01) mengunggah pembaharuan dokumen Slip Gaji via portal.',
        type: 'document_uploaded' as const,
        unitId: 'A.01',
        severity: 'info' as const,
        actor: 'Hendri Saputra (Debitur)',
        actorRole: 'KONSUMEN' as const,
      },
      {
        title: 'SP3K Terbit dari Bank BTN',
        message: 'Bank BTN Cabang Cikarang menerbitkan SP3K Unit C.05 dengan plafon Rp 180.500.000.',
        type: 'sp3k_issued' as const,
        unitId: 'C.05',
        severity: 'success' as const,
        actor: 'Hendra Kusuma (Analis Bank BTN)',
        actorRole: 'BANK' as const,
      },
      {
        title: 'Verifikasi Berkas Disetujui',
        message: 'Tim Legal mengesahkan SK Belum Memiliki Rumah untuk Unit B.07.',
        type: 'document_verified' as const,
        unitId: 'B.07',
        severity: 'success' as const,
        actor: 'Sarah Fitriani (Tim Legal)',
        actorRole: 'ADMIN_LEGAL' as const,
      },
      {
        title: 'Realisasi Akad Kredit',
        message: 'Akad notaris selesai untuk Unit A.02. Dana pencairan KPR Rp 180.500.000 siap cair.',
        type: 'payment_received' as const,
        unitId: 'A.02',
        severity: 'success' as const,
        actor: 'H. Sudirman, S.H. (Notaris Rekanan)',
        actorRole: 'BANK' as const,
      },
    ];

    const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
    pushNotification(pick.title, pick.message, pick.type, pick.unitId, undefined, pick.severity, pick.actor, pick.actorRole);
  };

  // Pricing & Settings handlers
  const handleApplyPriceToAllUnits = (newPrice: number) => {
    setUnits((prev) =>
      prev.map((u) => ({
        ...u,
        harga: newPrice,
      }))
    );
  };

  // Reminder handlers
  const handleAddReminder = (newReminder: WhatsAppReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
  };

  const handleUpdateReminder = (updated: WhatsAppReminder) => {
    setReminders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const handleLogHistory = (title: string, message: string) => {
    pushNotification(
      title,
      message,
      'setting_updated',
      undefined,
      undefined,
      'info',
      currentRole === 'MARKETING' ? 'Tim Marketing' : 'Tim Legal / Admin',
      currentRole
    );
  };

  const availableCount = units.filter((u) => u.status === 'TERSEDIA').length;
  const bookedCount = units.filter((u) => u.status === 'TERBOOKING').length;
  const buildCount = units.filter((u) => u.status === 'PROSES_PEMBANGUNAN').length;
  const kprCount = units.filter((u) => u.status === 'PROSES_KPR').length;
  const akadCount = units.filter((u) => u.status === 'REALISASI_AKAD').length;

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-950 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white relative">
      {/* 1. PRIMARY FULLSCREEN INTERACTIVE SITEPLAN MAP */}
      <SitePlanMasterplan
        units={units}
        applications={applications}
        selectedUnit={selectedUnit}
        onSelectUnit={handleSelectUnit}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        blockFilter={blockFilter}
        setBlockFilter={setBlockFilter}
        onAddUnit={handleAddUnit}
        onUpdateUnit={handleUpdateUnit}
        onDeleteUnit={handleDeleteUnit}
        onOpenCustomerDoc={(u, a) => setCustomerDetailModal({ unit: u, app: a })}
        housingName={settings.housingName}
        housingAddress={settings.housingAddress}
        appTitle={settings.appTitle}
        onOpenTab={(tab) => setActiveTab(tab)}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        notifications={notifications}
        onTriggerSimulatedEvent={handleTriggerSimulatedEvent}
        onMarkNotificationAsRead={(id) =>
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        }
        onMarkAllNotificationsAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onSelectUnitById={handleSelectUnitById}
        activeToast={activeToast}
        onDismissToast={() => setActiveToast(null)}
        onClearHistory={() => setNotifications([])}
      />

      {/* 2. OVERLAY MODAL DRAWER FOR DATA KONSUMEN, WHATSAPP, AND SETTINGS */}
      {activeTab !== 'masterplan' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden flex flex-col items-center justify-center animate-in fade-in">
          <div className="w-full max-w-7xl h-full flex flex-col bg-slate-50 rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60">
            {/* Modal Header */}
            <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('masterplan')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                  title="Kembali ke Peta Kawasan Fullscreen"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>← Kembali ke Peta Fullscreen</span>
                </button>

                <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  {activeTab === 'pemberkasan' && (
                    <>
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Data Konsumen & Berkas KPR</span>
                      <span className="text-xs font-normal text-slate-500">
                        ({applications.length} Pemohon)
                      </span>
                    </>
                  )}
                  {activeTab === 'whatsapp' && (
                    <>
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Pengingat WhatsApp Otomatis</span>
                      <span className="text-xs font-normal text-slate-500">
                        ({reminders.length} Pesan Terjadwal)
                      </span>
                    </>
                  )}
                  {activeTab === 'settings' && (
                    <>
                      <Settings className="w-4 h-4 text-slate-700" />
                      <span>Pengaturan Sistem KPR</span>
                    </>
                  )}
                </h2>
              </div>

              <button
                onClick={() => setActiveTab('masterplan')}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                title="Tutup (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with internal scrolling */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* TAB 2: DATA KONSUMEN & PENGAJUAN KPR */}
        {activeTab === 'pemberkasan' && (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Data Konsumen
                </h2>
                <p className="text-xs text-slate-500">
                  Data pemohon, kelengkapan 13 dokumen legal FLPP & pemantauan status persetujuan bank
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Total Konsumen:</span>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                  {applications.length} Konsumen
                </span>
              </div>
            </div>

            {/* Applications Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {applications.map((app) => {
                const unit = units.find((u) => u.id === app.unitId);
                const verifiedDocs = app.documents.filter((d) => d.status === 'TERVERIFIKASI').length;
                const revisionDocs = app.documents.filter((d) => d.status === 'PERLU_REVISI').length;
                const totalDocs = app.documents.length;
                const percent = Math.round((verifiedDocs / totalDocs) * 100);

                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                          {app.id}
                        </span>
                        <span className="font-mono font-bold text-xs text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                          Unit {app.unitId}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (unit) setCustomerDetailModal({ unit, app });
                        }}
                        className="text-left group/cust hover:text-blue-700 transition-colors w-full"
                        title="Klik untuk membuka profil konsumen, denah kavling & progres pembangunan"
                      >
                        <h3 className="font-bold text-sm text-slate-900 group-hover/cust:text-blue-700 group-hover/cust:underline flex items-center justify-between">
                          <span>{app.customer.nama}</span>
                          <span className="text-[10px] text-blue-600 font-semibold opacity-0 group-hover/cust:opacity-100 transition-opacity">
                            Detail & Denah →
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">
                          {app.customer.pekerjaan} · <strong className="text-emerald-700">{app.bankPenyalur}</strong>
                        </p>
                      </button>

                      {/* Current Stage Badge */}
                      <div className="mt-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-medium">Tahapan Saat Ini:</div>
                        <div className="text-xs font-bold text-indigo-700 truncate">
                          {KPR_STAGES_INFO.find((s) => s.stage === app.currentStage)?.label || app.currentStage}
                        </div>
                      </div>

                      {/* Document Completion Progress */}
                      <div className="mt-2.5 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Validasi Berkas:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {verifiedDocs}/{totalDocs} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        {revisionDocs > 0 && (
                          <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 pt-0.5">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            {revisionDocs} berkas perlu perbaikan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Profil & Denah, Audit, and Alur */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {/* Tombol Lihat Kavling & Progres */}
                      <button
                        type="button"
                        onClick={() => {
                          if (unit) setCustomerDetailModal({ unit, app });
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        title="Lihat denah tata ruang dan progres pembangunan unit ini"
                      >
                        <Home className="w-3.5 h-3.5 text-blue-600" />
                        <span>Lihat Kavling, Denah & Progres</span>
                      </button>

                      <button
                        onClick={() => {
                          if (unit) setTrackerModalApp({ unit, app });
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Lacak Alur KPR</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('whatsapp');
                        }}
                        className="w-full py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kirim Pengingat WhatsApp</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PENGINGAT WHATSAPP OTOMATIS */}
        {activeTab === 'whatsapp' && (
          <div className="animate-in fade-in">
            <WhatsAppReminderView
              reminders={reminders}
              onAddReminder={handleAddReminder}
              onUpdateReminder={handleUpdateReminder}
              onDeleteReminder={handleDeleteReminder}
              applications={applications}
              marketings={settings.marketings}
              settings={settings}
              onLogHistory={handleLogHistory}
            />
          </div>
        )}

        {/* TAB 4: PENGATURAN SISTEM & MASTER DATA */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in">
            <SettingsView
              settings={settings}
              onUpdateSettings={setSettings}
              units={units}
              onApplyPriceToAllUnits={handleApplyPriceToAllUnits}
              onLogHistory={handleLogHistory}
            />
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: UNIT VISUAL POPUP */}
      {selectedUnit && (
        <UnitPopupModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          application={getAppForUnit(selectedUnit)}
          onOpenTracker={(u, a) => {
            setSelectedUnit(null);
            setTrackerModalApp({ unit: u, app: a });
          }}
          onOpenNewBooking={(u) => {
            setSelectedUnit(null);
            setBookingUnit(u);
          }}
          onUpdateUnitStatus={handleUpdateUnitStatus}
          onOpenWhatsAppReminder={(u, a) => {
            setSelectedUnit(null);
            setActiveTab('whatsapp');
          }}
          onOpenCustomerDetail={(u, a) => {
            setSelectedUnit(null);
            setCustomerDetailModal({ unit: u, app: a });
          }}
          housingName={settings.housingName}
          companyName={settings.companyName}
        />
      )}

      {/* MODAL 2: KPR REAL-TIME STAGE TRACKER MODAL */}
      {trackerModalApp && (
        <KprApplicationTracker
          unit={trackerModalApp.unit}
          application={trackerModalApp.app}
          onClose={() => setTrackerModalApp(null)}
          onUpdateStage={handleUpdateStage}
        />
      )}

      {/* MODAL 3: NEW BOOKING INTAKE MODAL */}
      {bookingUnit && (
        <NewBookingModal
          unit={bookingUnit}
          onClose={() => setBookingUnit(null)}
          onConfirmBooking={handleConfirmBooking}
          marketings={settings.marketings}
          banks={settings.banks}
        />
      )}

      {/* MODAL 4: CUSTOMER PROFILE, KAVLING DENAH & CONSTRUCTION PROGRESS */}
      {customerDetailModal && (
        <CustomerDetailModal
          unit={customerDetailModal.unit}
          application={customerDetailModal.app}
          onClose={() => setCustomerDetailModal(null)}
          onOpenTracker={(u, a) => {
            setCustomerDetailModal(null);
            setTrackerModalApp({ unit: u, app: a });
          }}
          onOpenUnitModal={(u) => {
            setCustomerDetailModal(null);
            setSelectedUnit(u);
          }}
        />
      )}
    </div>
  );
}

