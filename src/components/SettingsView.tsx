import React, { useState } from 'react';
import { 
  AppSettings, 
  MarketingStaff, 
  PartnerBank, 
  CustomKprStage, 
  Unit 
} from '../types';
import { 
  Settings, 
  Building, 
  Briefcase, 
  Banknote, 
  Users, 
  Landmark, 
  GitCommit, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  X, 
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  units: Unit[];
  onApplyPriceToAllUnits: (price: number) => void;
  onLogHistory: (title: string, message: string) => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  units,
  onApplyPriceToAllUnits,
  onLogHistory,
}: SettingsViewProps) {
  // Local state for basic fields
  const [appTitle, setAppTitle] = useState(settings.appTitle);
  const [housingName, setHousingName] = useState(settings.housingName);
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [defaultUnitPrice, setDefaultUnitPrice] = useState(settings.defaultUnitPrice);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sub-tabs in Settings
  const [activeSection, setActiveSection] = useState<'general' | 'marketing' | 'banks' | 'stages'>('general');

  // Marketing modal / form state
  const [editingMarketing, setEditingMarketing] = useState<MarketingStaff | null>(null);
  const [isAddingMarketing, setIsAddingMarketing] = useState(false);
  const [mktForm, setMktForm] = useState({ name: '', phone: '', email: '', notes: '', active: true });

  // Bank modal / form state
  const [editingBank, setEditingBank] = useState<PartnerBank | null>(null);
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [bankForm, setBankForm] = useState({ name: '', code: '', branch: '', picName: '', picPhone: '', active: true });

  // Stage modal / form state
  const [editingStage, setEditingStage] = useState<CustomKprStage | null>(null);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [stageForm, setStageForm] = useState<{
    label: string;
    roleResponsible: 'Marketing' | 'Legal' | 'Bank / Notaris';
    description: string;
  }>({
    label: '',
    roleResponsible: 'Marketing',
    description: '',
  });

  // Save General Info
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      ...settings,
      appTitle: appTitle.trim() || 'SI-KPR PRIMA',
      housingName: housingName.trim() || 'Griya Prima Asri',
      companyName: companyName.trim() || 'PT. Prima Karya Mandiri',
      defaultUnitPrice: Number(defaultUnitPrice) || 185000000,
    };
    onUpdateSettings(updated);
    onLogHistory(
      'Pengaturan Umum Diperbarui',
      `Judul: "${updated.appTitle}", Perumahan: "${updated.housingName}", Pengembang: "${updated.companyName}"`
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Bulk Apply Price to all units
  const handleApplyPriceToAll = () => {
    if (window.confirm(`Perbarui harga SEMUA (${units.length}) unit menjadi Rp ${Number(defaultUnitPrice).toLocaleString('id-ID')}?`)) {
      onApplyPriceToAllUnits(Number(defaultUnitPrice));
      const updated: AppSettings = {
        ...settings,
        defaultUnitPrice: Number(defaultUnitPrice),
      };
      onUpdateSettings(updated);
      onLogHistory(
        'Harga Unit Massal Diperbarui',
        `Harga seluruh ${units.length} unit rumah disesuaikan menjadi Rp ${Number(defaultUnitPrice).toLocaleString('id-ID')}`
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // ================= MARKETING ACTIONS =================
  const handleSaveMarketing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mktForm.name.trim() || !mktForm.phone.trim()) return;

    let updatedMarketings = [...settings.marketings];
    if (editingMarketing) {
      updatedMarketings = updatedMarketings.map((m) =>
        m.id === editingMarketing.id
          ? { ...m, ...mktForm }
          : m
      );
      onLogHistory('Data Marketing Diperbarui', `Marketing "${mktForm.name}" (${mktForm.phone}) diperbarui.`);
    } else {
      const newMkt: MarketingStaff = {
        id: `mkt-${Date.now()}`,
        name: mktForm.name.trim(),
        phone: mktForm.phone.trim(),
        email: mktForm.email.trim(),
        notes: mktForm.notes.trim(),
        active: mktForm.active,
      };
      updatedMarketings.push(newMkt);
      onLogHistory('Marketing Baru Ditambahkan', `Marketing "${newMkt.name}" (${newMkt.phone}) ditambahkan.`);
    }

    onUpdateSettings({ ...settings, marketings: updatedMarketings });
    setIsAddingMarketing(false);
    setEditingMarketing(null);
    setMktForm({ name: '', phone: '', email: '', notes: '', active: true });
  };

  const handleDeleteMarketing = (id: string, name: string) => {
    if (window.confirm(`Hapus marketing "${name}"?`)) {
      const updated = settings.marketings.filter((m) => m.id !== id);
      onUpdateSettings({ ...settings, marketings: updated });
      onLogHistory('Marketing Dihapus', `Marketing "${name}" telah dihapus.`);
    }
  };

  // ================= BANK ACTIONS =================
  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.name.trim()) return;

    let updatedBanks = [...settings.banks];
    if (editingBank) {
      updatedBanks = updatedBanks.map((b) =>
        b.id === editingBank.id
          ? { ...b, ...bankForm }
          : b
      );
      onLogHistory('Data Bank Rekanan Diperbarui', `Bank "${bankForm.name}" diperbarui.`);
    } else {
      const newBank: PartnerBank = {
        id: `bank-${Date.now()}`,
        name: bankForm.name.trim(),
        code: bankForm.code.trim() || bankForm.name.substring(0, 4).toUpperCase(),
        branch: bankForm.branch.trim(),
        picName: bankForm.picName.trim(),
        picPhone: bankForm.picPhone.trim(),
        active: bankForm.active,
      };
      updatedBanks.push(newBank);
      onLogHistory('Bank Rekanan Ditambahkan', `Bank "${newBank.name}" cabang ${newBank.branch} ditambahkan.`);
    }

    onUpdateSettings({ ...settings, banks: updatedBanks });
    setIsAddingBank(false);
    setEditingBank(null);
    setBankForm({ name: '', code: '', branch: '', picName: '', picPhone: '', active: true });
  };

  const handleDeleteBank = (id: string, name: string) => {
    if (window.confirm(`Hapus bank "${name}" dari rekanan?`)) {
      const updated = settings.banks.filter((b) => b.id !== id);
      onUpdateSettings({ ...settings, banks: updated });
      onLogHistory('Bank Rekanan Dihapus', `Bank "${name}" telah dihapus.`);
    }
  };

  // ================= STAGE ACTIONS =================
  const handleSaveStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageForm.label.trim()) return;

    let updatedStages = [...settings.stages];
    if (editingStage) {
      updatedStages = updatedStages.map((s) =>
        s.id === editingStage.id
          ? { ...s, ...stageForm }
          : s
      );
      onLogHistory('Tahapan KPR Diperbarui', `Tahap "${stageForm.label}" diperbarui.`);
    } else {
      const newStage: CustomKprStage = {
        id: `stg-${Date.now()}`,
        key: `STAGE_${Date.now()}`,
        label: stageForm.label.trim(),
        step: updatedStages.length + 1,
        roleResponsible: stageForm.roleResponsible,
        description: stageForm.description.trim(),
      };
      updatedStages.push(newStage);
      onLogHistory('Tahapan KPR Ditambahkan', `Tahap baru "${newStage.label}" (${newStage.roleResponsible}) ditambahkan.`);
    }

    onUpdateSettings({ ...settings, stages: updatedStages });
    setIsAddingStage(false);
    setEditingStage(null);
    setStageForm({ label: '', roleResponsible: 'Marketing', description: '' });
  };

  const handleDeleteStage = (id: string, label: string) => {
    if (window.confirm(`Hapus tahapan alur "${label}"?`)) {
      const updated = settings.stages
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, step: idx + 1 }));
      onUpdateSettings({ ...settings, stages: updated });
      onLogHistory('Tahapan KPR Dihapus', `Tahap "${label}" telah dihapus.`);
    }
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= settings.stages.length) return;

    const updated = [...settings.stages];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const reordered = updated.map((s, idx) => ({ ...s, step: idx + 1 }));
    onUpdateSettings({ ...settings, stages: reordered });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 animate-in fade-in pb-10">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Settings className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Pengaturan Sistem & Master Data</h1>
            <p className="text-xs text-slate-500">
              Konfigurasi judul aplikasi, identitas perumahan, harga unit, tim marketing, bank rekanan, dan alur KPR
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      {/* Nav Tabs for Settings */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('general')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSection === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Judul, Perumahan & Harga</span>
        </button>

        <button
          onClick={() => setActiveSection('marketing')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSection === 'marketing'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tim Marketing ({settings.marketings.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('banks')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSection === 'banks'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Bank Rekanan ({settings.banks.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('stages')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeSection === 'stages'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GitCommit className="w-4 h-4" />
          <span>Tahapan Alur Pengajuan ({settings.stages.length})</span>
        </button>
      </div>

      {/* SECTION 1: GENERAL INFO & PRICING */}
      {activeSection === 'general' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-6">
          <form onSubmit={handleSaveGeneral} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Judul Aplikasi */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Judul Aplikasi (Header Navbar)
                </label>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="Contoh: SI KPR PRIMA"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-bold"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Nama sistem yang tampil di pojok kiri atas navbar dan kop laporan.
                </p>
              </div>

              {/* Nama Perumahan */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nama Perumahan
                </label>
                <input
                  type="text"
                  value={housingName}
                  onChange={(e) => setHousingName(e.target.value)}
                  placeholder="Contoh: Perumahan Griya Prima Indah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Kawasan perumahan yang tertera pada denah dan surat pemesanan rumah.
                </p>
              </div>

              {/* Nama Perusahaan Developer */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nama Perusahaan (Pengembang / Developer)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: PT. Prima Karya Mandiri"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Entitas legal developer pemegang izin kawasan & rekening escrow.
                </p>
              </div>

              {/* Menentukan Harga Unit Rumah */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Harga Standar Unit Rumah (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={defaultUnitPrice}
                    onChange={(e) => setDefaultUnitPrice(Number(e.target.value))}
                    step={1000000}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                    = Rp {Number(defaultUnitPrice || 0).toLocaleString('id-ID')}
                  </span>
                  <button
                    type="button"
                    onClick={handleApplyPriceToAll}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Terapkan ke Seluruh {units.length} Unit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Action Save */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Perubahan langsung tersimpan otomatis di sistem real-time.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Umum</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 2: MARKETING STAFF */}
      {activeSection === 'marketing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Daftar Tim Marketing Perumahan</h2>
              <p className="text-xs text-slate-500">
                Petugas pemasaran yang menangani booking unit dan pengingat WhatsApp
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMarketing(null);
                setMktForm({ name: '', phone: '', email: '', notes: '', active: true });
                setIsAddingMarketing(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Marketing</span>
            </button>
          </div>

          {/* Form Add / Edit Marketing */}
          {(isAddingMarketing || editingMarketing) && (
            <form onSubmit={handleSaveMarketing} className="p-4 rounded-xl bg-slate-50 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  {editingMarketing ? 'Edit Data Marketing' : 'Tambah Marketing Baru'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingMarketing(false);
                    setEditingMarketing(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={mktForm.name}
                    onChange={(e) => setMktForm({ ...mktForm, name: e.target.value })}
                    placeholder="Contoh: Dewi Sartika"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                  <input
                    type="text"
                    value={mktForm.phone}
                    onChange={(e) => setMktForm({ ...mktForm, phone: e.target.value })}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    value={mktForm.email}
                    onChange={(e) => setMktForm({ ...mktForm, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Catatan / Wilayah Blok</label>
                  <input
                    type="text"
                    value={mktForm.notes}
                    onChange={(e) => setMktForm({ ...mktForm, notes: e.target.value })}
                    placeholder="Contoh: Penanggung jawab Blok A"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={mktForm.active}
                    onChange={(e) => setMktForm({ ...mktForm, active: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Status Aktif</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingMarketing(false);
                      setEditingMarketing(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Marketing</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Table List of Marketing */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Nama Marketing</th>
                  <th className="px-3 py-2.5">Kontak WhatsApp</th>
                  <th className="px-3 py-2.5">Email</th>
                  <th className="px-3 py-2.5">Penempatan / Catatan</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settings.marketings.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                        {m.name.charAt(0)}
                      </div>
                      <span>{m.name}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-700">
                      <a 
                        href={`https://wa.me/${m.phone.replace(/^0/, '62')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{m.phone}</span>
                      </a>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{m.email || '-'}</td>
                    <td className="px-3 py-2.5 text-slate-600">{m.notes || '-'}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.active 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {m.active ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingMarketing(m);
                            setMktForm({
                              name: m.name,
                              phone: m.phone,
                              email: m.email || '',
                              notes: m.notes || '',
                              active: m.active,
                            });
                            setIsAddingMarketing(false);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Marketing"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMarketing(m.id, m.name)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Hapus Marketing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: PARTNER BANKS */}
      {activeSection === 'banks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Daftar Bank Penyalur KPR Subsidi</h2>
              <p className="text-xs text-slate-500">
                Lembaga perbankan rekanan untuk penyaluran FLPP/Tapera dan penerbitan SP3K
              </p>
            </div>
            <button
              onClick={() => {
                setEditingBank(null);
                setBankForm({ name: '', code: '', branch: '', picName: '', picPhone: '', active: true });
                setIsAddingBank(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Bank</span>
            </button>
          </div>

          {/* Form Add / Edit Bank */}
          {(isAddingBank || editingBank) && (
            <form onSubmit={handleSaveBank} className="p-4 rounded-xl bg-slate-50 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  {editingBank ? 'Edit Data Bank Rekanan' : 'Tambah Bank Rekanan Baru'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBank(false);
                    setEditingBank(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Bank</label>
                  <input
                    type="text"
                    value={bankForm.name}
                    onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                    placeholder="Contoh: Bank BTN"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kode Singkat</label>
                  <input
                    type="text"
                    value={bankForm.code}
                    onChange={(e) => setBankForm({ ...bankForm, code: e.target.value.toUpperCase() })}
                    placeholder="BTN"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kantor Cabang</label>
                  <input
                    type="text"
                    value={bankForm.branch}
                    onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
                    placeholder="Contoh: KC Cikarang"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama PIC Analis</label>
                  <input
                    type="text"
                    value={bankForm.picName}
                    onChange={(e) => setBankForm({ ...bankForm, picName: e.target.value })}
                    placeholder="Nama staf analis bank"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Kontak PIC Bank</label>
                  <input
                    type="text"
                    value={bankForm.picPhone}
                    onChange={(e) => setBankForm({ ...bankForm, picPhone: e.target.value })}
                    placeholder="0812..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={bankForm.active}
                    onChange={(e) => setBankForm({ ...bankForm, active: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Bank Aktif Bekerjasama</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingBank(false);
                      setEditingBank(null);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Bank</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Table List of Banks */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Nama Bank Rekanan</th>
                  <th className="px-3 py-2.5">Kode</th>
                  <th className="px-3 py-2.5">Kantor Cabang</th>
                  <th className="px-3 py-2.5">PIC / Analis Kredit</th>
                  <th className="px-3 py-2.5">Kontak</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settings.banks.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-3 py-2.5 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                        <Landmark className="w-3.5 h-3.5" />
                      </div>
                      <span>{b.name}</span>
                    </td>
                    <td className="px-3 py-2.5 font-mono font-bold text-blue-700">{b.code}</td>
                    <td className="px-3 py-2.5 text-slate-600">{b.branch || '-'}</td>
                    <td className="px-3 py-2.5 text-slate-700 font-medium">{b.picName || '-'}</td>
                    <td className="px-3 py-2.5 font-mono text-slate-600">
                      {b.picPhone ? (
                        <a 
                          href={`https://wa.me/${b.picPhone.replace(/^0/, '62')}`}
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{b.picPhone}</span>
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.active 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {b.active ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingBank(b);
                            setBankForm({
                              name: b.name,
                              code: b.code,
                              branch: b.branch,
                              picName: b.picName,
                              picPhone: b.picPhone,
                              active: b.active,
                            });
                            setIsAddingBank(false);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit Bank"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBank(b.id, b.name)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Hapus Bank"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: KPR PROCESS STAGES */}
      {activeSection === 'stages' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Tahapan Alur Pengajuan KPR</h2>
              <p className="text-xs text-slate-500">
                Susunan langkah resmi proses KPR dari booking, audit berkas, analisa perbankan hingga akad kredit
              </p>
            </div>
            <button
              onClick={() => {
                setEditingStage(null);
                setStageForm({ label: '', roleResponsible: 'Marketing', description: '' });
                setIsAddingStage(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tahapan</span>
            </button>
          </div>

          {/* Form Add / Edit Stage */}
          {(isAddingStage || editingStage) && (
            <form onSubmit={handleSaveStage} className="p-4 rounded-xl bg-slate-50 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  {editingStage ? 'Edit Tahapan Alur' : 'Tambah Tahapan Baru'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingStage(false);
                    setEditingStage(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Tahapan</label>
                  <input
                    type="text"
                    value={stageForm.label}
                    onChange={(e) => setStageForm({ ...stageForm, label: e.target.value })}
                    placeholder="Contoh: 9. Pengurusan IMB & PBB Pecahan"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Penanggung Jawab</label>
                  <select
                    value={stageForm.roleResponsible}
                    onChange={(e) => setStageForm({ ...stageForm, roleResponsible: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Marketing">Marketing</option>
                    <option value="Legal">Legal</option>
                    <option value="Bank / Notaris">Bank / Notaris</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Deskripsi & Instruksi Alur</label>
                  <textarea
                    value={stageForm.description}
                    onChange={(e) => setStageForm({ ...stageForm, description: e.target.value })}
                    placeholder="Jelaskan apa yang dikerjakan pada tahap ini..."
                    rows={2}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingStage(false);
                    setEditingStage(null);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Tahapan</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Stages */}
          <div className="space-y-2">
            {settings.stages.map((stage, idx) => (
              <div
                key={stage.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {stage.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{stage.label}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                        stage.roleResponsible === 'Marketing'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : stage.roleResponsible === 'Legal'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {stage.roleResponsible}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{stage.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Move Up / Down */}
                  <button
                    onClick={() => handleMoveStage(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Naikkan Urutan"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveStage(idx, 'down')}
                    disabled={idx === settings.stages.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                    title="Turunkan Urutan"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingStage(stage);
                      setStageForm({
                        label: stage.label,
                        roleResponsible: stage.roleResponsible,
                        description: stage.description,
                      });
                      setIsAddingStage(false);
                    }}
                    className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit Tahapan"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStage(stage.id, stage.label)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Hapus Tahapan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
