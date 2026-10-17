import React, { useState } from 'react';
import { Unit, KprApplication, MarketingStaff, PartnerBank } from '../types';
import { STANDARD_DOCUMENTS_TEMPLATE } from '../data/initialData';
import confetti from 'canvas-confetti';
import { 
  X, 
  UserPlus, 
  Check, 
  Home, 
  AlertCircle 
} from 'lucide-react';

interface NewBookingModalProps {
  unit: Unit | null;
  onClose: () => void;
  onConfirmBooking: (application: KprApplication) => void;
  marketings?: MarketingStaff[];
  banks?: PartnerBank[];
}

export default function NewBookingModal({
  unit,
  onClose,
  onConfirmBooking,
  marketings,
  banks,
}: NewBookingModalProps) {
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [pekerjaan, setPekerjaan] = useState('Karyawan Swasta Pabrik');
  const [perusahaan, setPerusahaan] = useState('PT Astra Otoparts Tbk');
  const [gajiBulanan, setGajiBulanan] = useState('5200000');
  const [statusNikah, setStatusNikah] = useState<'Lajang' | 'Menikah' | 'Cerai'>('Menikah');
  const [namaPasangan, setNamaPasangan] = useState('Siti Nurhaliza');
  const [bankPenyalur, setBankPenyalur] = useState<any>(banks && banks.length > 0 ? banks[0].name : 'Bank BTN');
  const [marketingName, setMarketingName] = useState(marketings && marketings.length > 0 ? marketings[0].name : 'Dewi Sartika');
  const [errorMsg, setErrorMsg] = useState('');

  if (!unit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !nik.trim() || !telepon.trim()) {
      setErrorMsg('Mohon lengkapi Nama Pemohon, NIK, dan Nomor Telepon.');
      return;
    }

    const gaji = parseInt(gajiBulanan, 10) || 5000000;
    if (gaji > 8000000) {
      setErrorMsg('Syarat Rumah Subsidi FLPP: Gaji pokok pemohon maksimal Rp 8.000.000/bulan.');
      return;
    }

    const newAppId = `KPR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newApplication: KprApplication = {
      id: newAppId,
      unitId: unit.id,
      customer: {
        nama: nama.trim(),
        nik: nik.trim(),
        telepon: telepon.trim(),
        email: email.trim() || `${nama.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        pekerjaan,
        perusahaan,
        gajiBulanan: gaji,
        statusPernikahan: statusNikah,
        namaPasangan: statusNikah === 'Menikah' ? namaPasangan : undefined,
        alamat: 'Bekasi / Cikarang, Jawa Barat',
      },
      marketingName,
      bankPenyalur,
      currentStage: 'BOOKING_REGISTRASI',
      bookingFee: 1500000,
      bookingFeePaid: true,
      uangMuka: 2500000,
      uangMukaPaid: false,
      plafonKpr: unit.harga - 3500000,
      tenorTahun: 20,
      cicilanPerBulan: 1195000,
      documents: STANDARD_DOCUMENTS_TEMPLATE.map((tpl, idx) => ({
        id: `doc-${newAppId}-${idx}`,
        type: tpl.type,
        title: tpl.title,
        description: tpl.description,
        required: tpl.required,
        status: 'BELUM_UNGGAH',
      })),
      timeline: [
        {
          id: `tl-${Date.now()}`,
          stage: 'BOOKING_REGISTRASI',
          title: 'Booking Unit & Registrasi Pemesan',
          description: `Pemesanan unit ${unit.id} oleh ${nama.trim()}. Booking fee Rp 1.500.000 disetor via Marketing ${marketingName}.`,
          timestamp: 'Hari ini',
          actor: `Marketing (${marketingName})`,
          status: 'completed',
        },
        {
          id: `tl-${Date.now() + 1}`,
          stage: 'PEMBERKASAN_LEGAL',
          title: 'Menunggu Kelengkapan Berkas KPR',
          description: 'Pemohon diminta melengkapi berkas 13 dokumen persyaratan FLPP.',
          timestamp: 'Menunggu',
          actor: 'Legalitas & Konsumen',
          status: 'in_progress',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    onConfirmBooking(newApplication);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Pendaftaran & Booking Unit {unit.id}
              </h3>
              <p className="text-xs text-slate-500">
                Penerbitan Surat Pemesanan Rumah (SPR) Subsidi FLPP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-800 font-bold">Unit {unit.id} ({unit.type})</span>
            </div>
            <span className="font-mono font-bold text-emerald-700">
              Rp {unit.harga.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Nama Lengkap (Sesuai KTP) *</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Muhammad Arif"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1 font-medium">NIK e-KTP (16 Digit) *</label>
              <input
                type="text"
                required
                maxLength={16}
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="3201xxxxxxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Nomor WhatsApp *</label>
              <input
                type="tel"
                required
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                placeholder="0812xxxxxxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Pekerjaan</label>
              <input
                type="text"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                placeholder="Operator Produksi / Staf"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Instansi / Perusahaan</label>
              <input
                type="text"
                value={perusahaan}
                onChange={(e) => setPerusahaan(e.target.value)}
                placeholder="PT Nama Perusahaan"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Gaji Bulanan (Maks Rp 8 Jt)</label>
              <input
                type="number"
                value={gajiBulanan}
                onChange={(e) => setGajiBulanan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Status Pernikahan</label>
              <select
                value={statusNikah}
                onChange={(e) => setStatusNikah(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="Menikah">Menikah (Wajib KTP Pasangan)</option>
                <option value="Lajang">Lajang (SK Belum Menikah)</option>
                <option value="Cerai">Cerai Hidup / Mati</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Bank Penyalur</label>
              <select
                value={bankPenyalur}
                onChange={(e) => setBankPenyalur(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {banks && banks.length > 0 ? (
                  banks.filter(b => b.active).map(b => (
                    <option key={b.id} value={b.name}>{b.name} ({b.branch || b.code})</option>
                  ))
                ) : (
                  <>
                    <option value="Bank BTN">Bank BTN (Spesialis FLPP)</option>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="Bank BSI">Bank BSI (Syariah)</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="text-slate-700 block mb-1 font-medium">Marketing PIC</label>
              <select
                value={marketingName}
                onChange={(e) => setMarketingName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {marketings && marketings.length > 0 ? (
                  marketings.filter(m => m.active).map(m => (
                    <option key={m.id} value={m.name}>{m.name} ({m.phone})</option>
                  ))
                ) : (
                  <>
                    <option value="Dewi Sartika">Dewi Sartika</option>
                    <option value="Rizky Pratama">Rizky Pratama</option>
                    <option value="Fajar Nugraha">Fajar Nugraha</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-between">
            <span>Booking Fee Disetor:</span>
            <span className="font-bold text-slate-900 font-mono">Rp 1.500.000</span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              Kunci Unit & Daftarkan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
