import React, { useState, useEffect } from 'react';
import { WhatsAppReminder, KprApplication, MarketingStaff, AppSettings } from '../types';
import { 
  MessageSquare, 
  Send, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Phone, 
  User, 
  Sparkles,
  Search,
  Filter,
  CheckCheck
} from 'lucide-react';

interface WhatsAppReminderViewProps {
  reminders: WhatsAppReminder[];
  onAddReminder: (reminder: WhatsAppReminder) => void;
  onUpdateReminder: (reminder: WhatsAppReminder) => void;
  onDeleteReminder: (id: string) => void;
  applications: KprApplication[];
  marketings: MarketingStaff[];
  settings: AppSettings;
  onLogHistory: (title: string, message: string) => void;
}

export default function WhatsAppReminderView({
  reminders,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  applications,
  marketings,
  settings,
  onLogHistory,
}: WhatsAppReminderViewProps) {
  // Form state
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [unitId, setUnitId] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState(() => {
    // Default tomorrow at 09:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SCHEDULED' | 'READY' | 'SENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick message templates
  const applyTemplate = (type: string) => {
    const nama = recipientName || '[NAMA]';
    const unit = unitId || '[UNIT]';
    const perumahan = settings.housingName || 'Perumahan Griya Prima';
    const dev = settings.companyName || 'Developer';

    let text = '';
    switch (type) {
      case 'berkas':
        text = `Halo Yth. Bapak/Ibu ${nama}, ini pengingat resmi dari ${dev} mengenai pengajuan KPR Unit ${unit} di ${perumahan}. Mohon dapat segera melengkapi dokumen persyaratan (KTP, KK, Slip Gaji 3 bulan, NPWP) agar berkas dapat kami serahkan ke analis bank. Terima kasih.`;
        break;
      case 'wawancara':
        text = `Halo Yth. Bapak/Ibu ${nama}, jadwal wawancara kredit KPR dengan pihak Bank untuk Unit ${unit} di ${perumahan} telah ditentukan. Harap hadir tepat waktu dan membawa berkas asli. Untuk konfirmasi hubungi kami di nomor ini. Terima kasih. - Tim Legal & Marketing ${dev}`;
        break;
      case 'sp3k':
        text = `Kabar Baik! Selamat Bapak/Ibu ${nama}, Surat Penegasan Persetujuan Penyediaan Kredit (SP3K) untuk Unit ${unit} di ${perumahan} telah resmi TERBIT dan DISETUJUI oleh Bank. Mohon kesediaannya menyiapkan kelengkapan biaya pra-akad. Info: ${dev}`;
        break;
      case 'akad':
        text = `Undangan Akad Kredit: Yth. Bapak/Ibu ${nama}, jadwal penandatanganan Akad Kredit KPR Unit ${unit} di ${perumahan} dijadwalkan bersama Notaris & Bank. Mohon hadir bersama pasangan (jika menikah) membawa e-KTP & Buku Nikah asli. Salam, ${dev}`;
        break;
      case 'bast':
        text = `Selamat Bapak/Ibu ${nama}! Pembangunan fisik rumah Unit ${unit} di ${perumahan} telah selesai 100% dan siap huni. Kami mengundang Bapak/Ibu untuk serah terima kunci (BAST) dan pengecekan fisik unit. Terima kasih atas kepercayaannya. - ${dev}`;
        break;
      default:
        text = `Halo Bapak/Ibu ${nama}, ada informasi penting terkait proses KPR Unit ${unit} di ${perumahan}. Silakan hubungi kami untuk konfirmasi lebih lanjut. Terima kasih.`;
    }
    setMessage(text);
  };

  // Quick recipient autofill from application
  const handleSelectApplication = (appId: string) => {
    setSelectedAppId(appId);
    if (!appId) return;
    const found = applications.find((a) => a.id === appId);
    if (found) {
      setRecipientName(found.customer.nama);
      setPhoneNumber(found.customer.telepon);
      setUnitId(found.unitId);
    }
  };

  // Format phone to WhatsApp international format
  const cleanPhoneForWa = (phone: string): string => {
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62' + cleaned;
    }
    return cleaned;
  };

  // Submit new reminder
  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phoneNumber.trim() || !message.trim()) {
      alert('Mohon isi nama penerima, nomor WhatsApp, dan pesan pengingat.');
      return;
    }

    const newReminder: WhatsAppReminder = {
      id: `wa-rem-${Date.now()}`,
      recipientName: recipientName.trim(),
      phoneNumber: phoneNumber.trim(),
      unitId: unitId.trim() || undefined,
      applicationId: selectedAppId || undefined,
      message: message.trim(),
      scheduledDate,
      status: new Date(scheduledDate) <= new Date() ? 'READY' : 'SCHEDULED',
      createdAt: new Date().toISOString(),
    };

    onAddReminder(newReminder);
    onLogHistory(
      'Pengingat WhatsApp Dijadwalkan',
      `Pengingat untuk ${newReminder.recipientName} (${newReminder.phoneNumber}) Unit ${newReminder.unitId || '-'} dijadwalkan pada ${new Date(scheduledDate).toLocaleString('id-ID')}`
    );

    // Reset some fields
    setMessage('');
    alert(`Pengingat WhatsApp berhasil dijadwalkan untuk ${newReminder.recipientName}!`);
  };

  // Direct send via WhatsApp Web/App
  const handleSendNow = (reminder: WhatsAppReminder) => {
    const cleanPhone = cleanPhoneForWa(reminder.phoneNumber);
    const encodedMsg = encodeURIComponent(reminder.message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    // Mark as sent
    const updated: WhatsAppReminder = {
      ...reminder,
      status: 'SENT',
      sentAt: new Date().toISOString(),
    };
    onUpdateReminder(updated);

    onLogHistory(
      'WhatsApp Terkirim',
      `Pesan pengingat dikirim ke ${reminder.recipientName} (${reminder.phoneNumber}) via WhatsApp`
    );

    // Open WhatsApp
    window.open(waUrl, '_blank');
  };

  // Filter reminders
  const filteredReminders = reminders.filter((rem) => {
    const matchesFilter = 
      filterStatus === 'ALL' ? true :
      filterStatus === 'SCHEDULED' ? rem.status === 'SCHEDULED' :
      filterStatus === 'READY' ? rem.status === 'READY' || (rem.status === 'SCHEDULED' && new Date(rem.scheduledDate) <= new Date()) :
      rem.status === 'SENT';

    const matchesSearch = 
      rem.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rem.phoneNumber.includes(searchQuery) ||
      (rem.unitId && rem.unitId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rem.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in pb-10">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Pengingat WhatsApp Otomatis</h1>
            <p className="text-xs text-slate-500">
              Kirim pesan pengingat langsung ke nomor WhatsApp debitur atau jadwalkan otomatis sesuai tanggal & alur KPR
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-600 font-medium">Total Jadwal Pengingat:</span>
          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            {reminders.length} Pesan
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: FORM INPUT PENGINGAT (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Buat & Jadwalkan Pesan</span>
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              WhatsApp Direct
            </span>
          </div>

          <form onSubmit={handleCreateReminder} className="space-y-3.5">
            {/* Quick Picker from Applications */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Pilih Cepat dari Debitur Terdaftar
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => handleSelectApplication(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="">-- Pilih Debitur KPR --</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    Unit {app.unitId} - {app.customer.nama} ({app.customer.telepon})
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Name & Unit */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Nama Penerima <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Contoh: Hendri Saputra"
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-700">
                  Unit Kavling
                </label>
                <input
                  type="text"
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value.toUpperCase())}
                  placeholder="A.01"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-center focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Nomor yang dituju (WhatsApp Phone) */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Nomor WhatsApp yang Dituju <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-emerald-600" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Contoh: 081234567890 atau 6281234567890"
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Format otomatis disesuaikan dengan WhatsApp API ({cleanPhoneForWa(phoneNumber || '08...')})
              </p>
            </div>

            {/* Template Buttons */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Template Pesan Cepat:
              </label>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => applyTemplate('berkas')}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors"
                >
                  📝 Kelengkapan Berkas
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('wawancara')}
                  className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-semibold transition-colors"
                >
                  🏛️ Wawancara Bank
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('sp3k')}
                  className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold transition-colors"
                >
                  📜 SP3K Terbit
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('akad')}
                  className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-semibold transition-colors"
                >
                  ✍️ Jadwal Akad
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('bast')}
                  className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-semibold transition-colors"
                >
                  🔑 Serah Terima (BAST)
                </button>
              </div>
            </div>

            {/* Isi Pesan WhatsApp */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Isi Pesan WhatsApp <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pesan pengingat di sini..."
                rows={4}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                required
              />
            </div>

            {/* Tanggal Otomatis Mengirim Pesan */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700">
                Tanggal & Jam Otomatis Mengirim Pesan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Sistem menandai dan mengirim notifikasi saat tanggal & waktu jadwal ini tiba.
              </p>
            </div>

            {/* Action Buttons: Kirim Langsung & Jadwalkan */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simpan Jadwal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!recipientName.trim() || !phoneNumber.trim() || !message.trim()) {
                    alert('Mohon isi nama penerima, nomor WhatsApp, dan pesan pengingat terlebih dahulu.');
                    return;
                  }
                  handleSendNow({
                    id: `wa-rem-${Date.now()}`,
                    recipientName: recipientName.trim(),
                    phoneNumber: phoneNumber.trim(),
                    unitId: unitId.trim() || undefined,
                    message: message.trim(),
                    scheduledDate: new Date().toISOString().slice(0, 16),
                    status: 'SENT',
                    createdAt: new Date().toISOString(),
                  });
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim WA Sekarang</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: DAFTAR PENGINGAT TERJADWAL & RIWAYAT (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Daftar Pesan & Jadwal Pengingat</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pantau antrean pengingat otomatis dan riwayat pengiriman
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                  filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Semua ({reminders.length})
              </button>
              <button
                onClick={() => setFilterStatus('SCHEDULED')}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                  filterStatus === 'SCHEDULED' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Terjadwal
              </button>
              <button
                onClick={() => setFilterStatus('READY')}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                  filterStatus === 'READY' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Siap Kirim
              </button>
              <button
                onClick={() => setFilterStatus('SENT')}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                  filterStatus === 'SENT' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Terkirim
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari penerima, unit, atau isi pesan..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* List items */}
          {filteredReminders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada data pengingat WhatsApp yang sesuai filter.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredReminders.map((rem) => {
                const isOverdueOrReady = new Date(rem.scheduledDate) <= new Date() && rem.status !== 'SENT';
                const dateObj = new Date(rem.scheduledDate);
                const formattedDate = dateObj.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={rem.id}
                    className={`p-3 rounded-xl border transition-all ${
                      rem.status === 'SENT'
                        ? 'bg-slate-50/70 border-slate-200'
                        : isOverdueOrReady
                        ? 'bg-amber-50/60 border-amber-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">
                            {rem.recipientName}
                          </span>
                          {rem.unitId && (
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              Unit {rem.unitId}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-500">
                            ({rem.phoneNumber})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Jadwal: <strong>{formattedDate}</strong></span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {rem.status === 'SENT' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCheck className="w-3 h-3" />
                            <span>Terkirim</span>
                          </span>
                        ) : isOverdueOrReady ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            <span>Waktunya Kirim!</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Calendar className="w-3 h-3" />
                            <span>Terjadwal</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Message Preview */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                      {rem.message}
                    </div>

                    {/* Actions */}
                    <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">
                        {rem.sentAt ? `Terkirim pada: ${new Date(rem.sentAt).toLocaleTimeString('id-ID')}` : 'Belum dikirim'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onDeleteReminder(rem.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Hapus Jadwal Pengingat"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleSendNow(rem)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-all ${
                            rem.status === 'SENT'
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>{rem.status === 'SENT' ? 'Kirim Ulang' : 'Kirim Sekarang'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
