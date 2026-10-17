import { 
  Unit, 
  KprApplication, 
  NotificationItem, 
  DocumentItem, 
  DocumentType, 
  KprStage,
  AppSettings,
  MarketingStaff,
  PartnerBank,
  CustomKprStage,
  WhatsAppReminder
} from '../types';

export const STANDARD_DOCUMENTS_TEMPLATE: {
  type: DocumentType;
  title: string;
  description: string;
  required: boolean;
}[] = [
  {
    type: 'KTP_PEMOHON',
    title: 'e-KTP Pemohon',
    description: 'KTP elektronik asli masih berlaku dan terbaca jelas (Depan & Belakang)',
    required: true,
  },
  {
    type: 'KTP_PASANGAN',
    title: 'e-KTP Pasangan',
    description: 'Wajib dilampirkan jika status pemohon telah menikah',
    required: false,
  },
  {
    type: 'KARTU_KELUARGA',
    title: 'Kartu Keluarga (KK)',
    description: 'KK terbaru dengan barcode Kemendagri / legalisir Disdukcapil',
    required: true,
  },
  {
    type: 'NPWP',
    title: 'NPWP Pribadi',
    description: 'Kartu NPWP / bukti validasi NIK-NPWP DJP Online',
    required: true,
  },
  {
    type: 'SURAT_NIKAH',
    title: 'Buku Nikah / Ket. Belum Menikah',
    description: 'Buku nikah legalisir KUA atau Surat Ket. Belum Menikah dari Kelurahan',
    required: true,
  },
  {
    type: 'SLIP_GAJI',
    title: 'Slip Gaji 3 Bulan Terakhir',
    description: 'Slip gaji resmi 3 bulan terakhir bertanda tangan HRD/Keuangan & stempel basah',
    required: true,
  },
  {
    type: 'SPT_PPH21',
    title: 'SPT Tahunan PPh 21',
    description: 'Bukti lapor SPT Tahunan Orang Pribadi 1 tahun terakhir (e-filing)',
    required: true,
  },
  {
    type: 'SURAT_KET_KERJA',
    title: 'Surat Keterangan Kerja Aktif',
    description: 'Masa kerja minimal 1 tahun untuk karyawan tetap atau 2 tahun kontrak',
    required: true,
  },
  {
    type: 'SK_BELUM_PUNYA_RUMAH',
    title: 'SK Belum Memiliki Rumah',
    description: 'Surat Keterangan dari Kepala Desa / Lurah setempat sesuai domisili',
    required: true,
  },
  {
    type: 'REKENING_KORAN',
    title: 'Rekening Koran 3 Bulan',
    description: 'Mutasi rekening payroll/gaji 3 bulan terakhir berstempel bank',
    required: true,
  },
  {
    type: 'FORMULIR_KPR',
    title: 'Formulir Aplikasi KPR Bank',
    description: 'Formulir KPR Subsidi FLPP/Tapera yang telah ditandatangani pemohon di atas materai',
    required: true,
  },
  {
    type: 'SURAT_PERNYATAAN_SUBSIDI',
    title: 'Surat Pernyataan Pemohon Subsidi',
    description: 'Surat pernyataan tidak memiliki rumah dan gaji di bawah batasan FLPP pemerintah',
    required: true,
  },
  {
    type: 'PAS_FOTO',
    title: 'Pas Foto 3x4 (2 Lembar)',
    description: 'Foto berwarna background merah/biru pemohon dan pasangan',
    required: true,
  },
];

export const KPR_STAGES_INFO: {
  stage: KprStage;
  label: string;
  step: number;
  description: string;
  roleResponsible: 'Marketing' | 'Legal' | 'Bank / Notaris';
}[] = [
  {
    stage: 'BOOKING_REGISTRASI',
    label: '1. Booking & Kunci Unit',
    step: 1,
    description: 'Pembayaran booking fee Rp 1.500.000 dan penerbitan Surat Pemesanan Rumah (SPR)',
    roleResponsible: 'Marketing',
  },
  {
    stage: 'PEMBERKASAN_LEGAL',
    label: '2. Audit Berkas Legal',
    step: 2,
    description: 'Pemeriksaan keabsahan dokumen kependudukan & penghasilan oleh tim legal developer',
    roleResponsible: 'Legal',
  },
  {
    stage: 'SLIK_BI_CHECKING',
    label: '3. SLIK OJK / BI Checking',
    step: 3,
    description: 'Verifikasi riwayat kredit perbankan pemohon untuk memastikan kolektibilitas lancar (Kol 1)',
    roleResponsible: 'Bank / Notaris',
  },
  {
    stage: 'WAWANCARA_BANK',
    label: '4. Wawancara & Analisa',
    step: 4,
    description: 'Wawancara kredit tatap muka atau video call oleh pihak analis bank pelaksana (BTN/BRI)',
    roleResponsible: 'Bank / Notaris',
  },
  {
    stage: 'ANALISA_SP3K',
    label: '5. Penerbitan SP3K',
    step: 5,
    description: 'Surat Penegasan Persetujuan Penyediaan Kredit resmi terbit dengan plafon subsidi disetujui',
    roleResponsible: 'Bank / Notaris',
  },
  {
    stage: 'PROSES_KONSTRUKSI',
    label: '6. Pembangunan Fisik Unit',
    step: 6,
    description: 'Penyelesaian fisik rumah subsidi hingga 100% dan sertifikat layak huni siap',
    roleResponsible: 'Legal',
  },
  {
    stage: 'AKAD_KREDIT',
    label: '7. Akad Kredit & Realisasi',
    step: 7,
    description: 'Tanda tangan perjanjian kredit di depan Notaris, dana KPR cair ke Escrow Developer',
    roleResponsible: 'Bank / Notaris',
  },
  {
    stage: 'BAST_KUNCI',
    label: '8. Serah Terima Kunci (BAST)',
    step: 8,
    description: 'Penyerahan kunci fisik rumah, meteran listrik PLN, dan buku tabungan KPR ke debitur',
    roleResponsible: 'Legal',
  },
];

// Generate exactly 70 units matching the site plan image:
// Blok A: 13 units (A.01 to A.13)
// Blok B: 21 units (B.01 to B.21)
// Blok C: 20 units (C.01 to C.20)
// Blok D: 16 units (D.01 to D.16)
export function generateInitialUnits(): Unit[] {
  const units: Unit[] = [];

  // BLOK A (13 Unit) - A.01 to A.13
  for (let i = 1; i <= 13; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    const id = `A.${num}`;
    let status: Unit['status'] = 'TERSEDIA';
    let constructionProgress = 100;
    let constructionStage: Unit['constructionStage'] = 'Siap BAST';
    let customerName: string | undefined;
    let marketingName: string | undefined;
    let sp3kStatus: Unit['sp3kStatus'] = 'Belum Terbit';

    if (i === 1 || i === 2) {
      status = 'REALISASI_AKAD';
      customerName = i === 1 ? 'Hendri Saputra' : 'Rian Wahyudi';
      marketingName = 'Dewi Sartika';
      sp3kStatus = 'Disetujui';
    } else if (i === 3 || i === 4 || i === 5) {
      status = 'PROSES_KPR';
      customerName = i === 3 ? 'Bambang Irawan' : i === 4 ? 'Tri Joko' : 'Aisyah Putri';
      marketingName = 'Rizky Pratama';
      sp3kStatus = i === 3 ? 'Disetujui' : 'Proses Bank';
      constructionProgress = 90;
      constructionStage = 'Finishing';
    } else if (i === 6 || i === 7 || i === 8) {
      status = 'PROSES_PEMBANGUNAN';
      customerName = i === 6 ? 'Agus Setiawan' : i === 7 ? 'Novi Melinda' : 'Hadi Permana';
      marketingName = 'Fajar Nugraha';
      constructionProgress = 65;
      constructionStage = 'Dinding & Atap';
      sp3kStatus = 'Proses Bank';
    } else if (i === 9 || i === 10) {
      status = 'TERBOOKING';
      customerName = i === 9 ? 'Siti Rahmawati' : 'Dedi Kurniawan';
      marketingName = 'Dewi Sartika';
      constructionProgress = 40;
      constructionStage = 'Pondasi';
    } else {
      status = 'TERSEDIA';
      constructionProgress = 30;
      constructionStage = 'Pondasi';
    }

    units.push({
      id,
      block: 'A',
      number: num,
      type: 'Tipe 36/60 Subsidi',
      luasBangunan: 36,
      luasTanah: i === 1 || i === 13 ? 77 : 60,
      harga: i === 1 || i === 13 ? 195000000 : 185000000,
      status,
      constructionProgress,
      constructionStage,
      customerName,
      marketingName,
      sp3kStatus,
      row: 0,
      col: i - 1,
    });
  }

  // BLOK B (21 Unit) - B.01 to B.21
  for (let i = 1; i <= 21; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    const id = `B.${num}`;
    let status: Unit['status'] = 'TERSEDIA';
    let constructionProgress = 70;
    let constructionStage: Unit['constructionStage'] = 'Dinding & Atap';
    let customerName: string | undefined;
    let marketingName: string | undefined;
    let sp3kStatus: Unit['sp3kStatus'] = 'Belum Terbit';

    if (i <= 5) {
      status = 'REALISASI_AKAD';
      customerName = `Keluarga ${['Wahyudi', 'Kusuma', 'Gunawan', 'Hartono', 'Hidayat'][i - 1]}`;
      marketingName = 'Dewi Sartika';
      sp3kStatus = 'Disetujui';
      constructionProgress = 100;
      constructionStage = 'Siap BAST';
    } else if (i <= 10) {
      status = 'PROSES_KPR';
      customerName = `Nasabah ${['Santoso', 'Prabowo', 'Lestari', 'Maulana', 'Firmansyah'][i - 6]}`;
      marketingName = 'Rizky Pratama';
      sp3kStatus = i <= 8 ? 'Disetujui' : 'Proses Bank';
      constructionProgress = 85;
      constructionStage = 'Finishing';
    } else if (i <= 14) {
      status = 'PROSES_PEMBANGUNAN';
      customerName = `Pemohon ${['Anugrah', 'Saputra', 'Suryanto', 'Nurhaliza'][i - 11]}`;
      marketingName = 'Fajar Nugraha';
      sp3kStatus = 'Proses Bank';
      constructionProgress = 50;
      constructionStage = 'Dinding & Atap';
    } else if (i <= 17) {
      status = 'TERBOOKING';
      customerName = `Pemesanan ${['Indra', 'Bagus', 'Fitriani'][i - 15]}`;
      marketingName = 'Rizky Pratama';
      constructionProgress = 35;
      constructionStage = 'Pondasi';
    } else {
      status = 'TERSEDIA';
      constructionProgress = 20;
      constructionStage = 'Pondasi';
    }

    units.push({
      id,
      block: 'B',
      number: num,
      type: 'Tipe 36/60 Subsidi',
      luasBangunan: 36,
      luasTanah: i === 1 || i === 21 ? 75 : 60,
      harga: 185000000,
      status,
      constructionProgress,
      constructionStage,
      customerName,
      marketingName,
      sp3kStatus,
      row: i <= 11 ? 1 : 2,
      col: i <= 11 ? i - 1 : i - 12,
    });
  }

  // BLOK C (20 Unit) - C.01 to C.20
  for (let i = 1; i <= 20; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    const id = `C.${num}`;
    let status: Unit['status'] = 'TERSEDIA';
    let constructionProgress = 60;
    let constructionStage: Unit['constructionStage'] = 'Dinding & Atap';
    let customerName: string | undefined;
    let marketingName: string | undefined;
    let sp3kStatus: Unit['sp3kStatus'] = 'Belum Terbit';

    if (i <= 4) {
      status = 'REALISASI_AKAD';
      customerName = `Debitur C-${num} ${['Arianto', 'Mustofa', 'Zulfa', 'Herlambang'][i - 1]}`;
      marketingName = 'Dewi Sartika';
      sp3kStatus = 'Disetujui';
      constructionProgress = 100;
      constructionStage = 'Siap BAST';
    } else if (i <= 9) {
      status = 'PROSES_KPR';
      customerName = `Debitur C-${num} ${['Faisal', 'Ratna', 'Suhendra', 'Widia', 'Yusuf'][i - 5]}`;
      marketingName = 'Rizky Pratama';
      sp3kStatus = i <= 7 ? 'Disetujui' : 'Proses Bank';
      constructionProgress = 75;
      constructionStage = 'Finishing';
    } else if (i <= 13) {
      status = 'PROSES_PEMBANGUNAN';
      customerName = `Debitur C-${num} ${['Arifin', 'Salma', 'Lukman', 'Kurnia'][i - 10]}`;
      marketingName = 'Fajar Nugraha';
      constructionProgress = 60;
      constructionStage = 'Dinding & Atap';
    } else if (i <= 16) {
      status = 'TERBOOKING';
      customerName = `Pemesanan C-${num}`;
      marketingName = 'Dewi Sartika';
      constructionProgress = 30;
      constructionStage = 'Pondasi';
    } else {
      status = 'TERSEDIA';
      constructionProgress = 15;
      constructionStage = 'Pondasi';
    }

    units.push({
      id,
      block: 'C',
      number: num,
      type: 'Tipe 36/60 Subsidi',
      luasBangunan: 36,
      luasTanah: 60,
      harga: 185000000,
      status,
      constructionProgress,
      constructionStage,
      customerName,
      marketingName,
      sp3kStatus,
      row: i <= 10 ? 3 : 4,
      col: i <= 10 ? i - 1 : i - 11,
    });
  }

  // BLOK D (16 Unit) - D.01 to D.16
  for (let i = 1; i <= 16; i++) {
    const num = i < 10 ? `0${i}` : `${i}`;
    const id = `D.${num}`;
    let status: Unit['status'] = 'TERSEDIA';
    let constructionProgress = 40;
    let constructionStage: Unit['constructionStage'] = 'Pondasi';
    let customerName: string | undefined;
    let marketingName: string | undefined;
    let sp3kStatus: Unit['sp3kStatus'] = 'Belum Terbit';

    if (i <= 2) {
      status = 'REALISASI_AKAD';
      customerName = `Debitur ${['Budi Santoso', 'Muhammad Rizki'][i - 1]}`;
      marketingName = 'Rizky Pratama';
      sp3kStatus = 'Disetujui';
      constructionProgress = 100;
      constructionStage = 'Siap BAST';
    } else if (i <= 5) {
      status = 'PROSES_KPR';
      customerName = `Debitur D-${num}`;
      marketingName = 'Dewi Sartika';
      sp3kStatus = 'Proses Bank';
      constructionProgress = 80;
      constructionStage = 'Finishing';
    } else if (i <= 8) {
      status = 'PROSES_PEMBANGUNAN';
      customerName = `Debitur D-${num}`;
      marketingName = 'Fajar Nugraha';
      constructionProgress = 50;
      constructionStage = 'Dinding & Atap';
    } else if (i <= 11) {
      status = 'TERBOOKING';
      customerName = `Pemesanan D-${num}`;
      marketingName = 'Rizky Pratama';
      constructionProgress = 25;
      constructionStage = 'Pondasi';
    } else {
      status = 'TERSEDIA';
      constructionProgress = 10;
      constructionStage = 'Belum Dibangun';
    }

    units.push({
      id,
      block: 'D',
      number: num,
      type: 'Tipe 36/60 Subsidi',
      luasBangunan: 36,
      luasTanah: 60,
      harga: 185000000,
      status,
      constructionProgress,
      constructionStage,
      customerName,
      marketingName,
      sp3kStatus,
      row: i <= 8 ? 5 : 6,
      col: i <= 8 ? i - 1 : i - 9,
    });
  }

  return units;
}

export function generateInitialApplications(): KprApplication[] {
  const apps: KprApplication[] = [
    {
      id: 'KPR-2026-001',
      unitId: 'A.04',
      customer: {
        nama: 'Tri Joko Santoso',
        nik: '3201123456780003',
        telepon: '081288992211',
        email: 'trijoko.kpr@gmail.com',
        pekerjaan: 'Operator Produksi Industri Manufaktur',
        perusahaan: 'PT Mayora Indah Tbk',
        gajiBulanan: 5850000,
        statusPernikahan: 'Menikah',
        namaPasangan: 'Lina Marlina',
        alamat: 'Jl. Melati Raya No. 14, RT 02/05, Cikarang',
      },
      marketingName: 'Rizky Pratama',
      bankPenyalur: 'Bank BTN',
      currentStage: 'ANALISA_SP3K',
      bookingFee: 1500000,
      bookingFeePaid: true,
      uangMuka: 3000000,
      uangMukaPaid: true,
      plafonKpr: 180500000,
      tenorTahun: 20,
      cicilanPerBulan: 1185000,
      sp3kNumber: 'SP3K/BTN-CKR/X/2026/092',
      sp3kDate: '2026-10-12',
      sp3kPlafon: 180500000,
      documents: STANDARD_DOCUMENTS_TEMPLATE.map((tpl, idx) => {
        if (tpl.type === 'SLIP_GAJI') {
          return {
            id: `doc-1-${idx}`,
            type: tpl.type,
            title: tpl.title,
            description: tpl.description,
            required: tpl.required,
            status: 'PERLU_REVISI',
            fileName: 'slip_gaji_3bulan_joko.pdf',
            fileSize: '1.4 MB',
            uploadedAt: '2026-10-14 10:20',
            verifiedBy: 'Tim Legal (Amanda SH)',
            notes: 'Stempel perusahaan pada bulan Agustus belum ada cap basah resmi HRD.',
          };
        }
        if (tpl.type === 'SURAT_PERNYATAAN_SUBSIDI') {
          return {
            id: `doc-1-${idx}`,
            type: tpl.type,
            title: tpl.title,
            description: tpl.description,
            required: tpl.required,
            status: 'MENUNGGU_VERIFIKASI',
            fileName: 'surat_pernyataan_subsidi_materai.pdf',
            fileSize: '2.1 MB',
            uploadedAt: '2026-10-15 14:10',
          };
        }
        return {
          id: `doc-1-${idx}`,
          type: tpl.type,
          title: tpl.title,
          description: tpl.description,
          required: tpl.required,
          status: 'TERVERIFIKASI',
          fileName: `${tpl.type.toLowerCase()}_terverifikasi.pdf`,
          fileSize: '980 KB',
          uploadedAt: '2026-10-10 09:15',
          verifiedAt: '2026-10-11 11:30',
          verifiedBy: 'Tim Legal (Amanda SH)',
        };
      }),
      timeline: [
        {
          id: 'tl-1',
          stage: 'BOOKING_REGISTRASI',
          title: 'Booking Fee Dibayarkan',
          description: 'Konsumen membayar booking fee Rp 1.500.000 via transfer BCA Developer. Unit A.04 dikunci.',
          timestamp: '2026-10-01 10:15',
          actor: 'Marketing (Rizky)',
          status: 'completed',
        },
        {
          id: 'tl-2',
          stage: 'PEMBERKASAN_LEGAL',
          title: 'Berkas Masuk ke Bagian Legalitas',
          description: '11 dari 13 berkas persyaratan KPR Subsidi FLPP telah diperiksa dan dinyatakan sah.',
          timestamp: '2026-10-05 14:30',
          actor: 'Legalitas (Amanda SH)',
          status: 'completed',
        },
        {
          id: 'tl-3',
          stage: 'SLIK_BI_CHECKING',
          title: 'SLIK OJK Bersih (Kolektibilitas 1)',
          description: 'Hasil pengecekan perbankan BI Checking menunjukkan histori kredit lancar tanpa tunggakan.',
          timestamp: '2026-10-08 09:00',
          actor: 'Bank BTN Cabang Cikarang',
          status: 'completed',
        },
        {
          id: 'tl-4',
          stage: 'WAWANCARA_BANK',
          title: 'Wawancara Kredit Selesai',
          description: 'Wawancara analis bank BTN berjalan lancar. Hasil verifikasi tempat kerja PT Mayora valid.',
          timestamp: '2026-10-10 13:45',
          actor: 'Analis KPR BTN (Bpk Hendro)',
          status: 'completed',
        },
        {
          id: 'tl-5',
          stage: 'ANALISA_SP3K',
          title: 'Surat Persetujuan SP3K Terbit',
          description: 'SP3K resmi terbit nomor SP3K/BTN-CKR/X/2026/092 dengan plafon Rp 180.500.000.',
          timestamp: '2026-10-12 16:00',
          actor: 'Bank BTN',
          status: 'in_progress',
        },
        {
          id: 'tl-6',
          stage: 'PROSES_KONSTRUKSI',
          title: 'Finishing Unit Rumah',
          description: 'Progres konstruksi rumah mencapai 90% (pengecatan akhir & instalasi sanitair).',
          timestamp: '2026-10-14 11:00',
          actor: 'Site Project Engineer',
          status: 'pending',
        },
        {
          id: 'tl-7',
          stage: 'AKAD_KREDIT',
          title: 'Jadwal Akad Kredit Notaris',
          description: 'Menunggu kesiapan berkas sertifikat pecah dan kesiapan debitur.',
          timestamp: 'Estimasi 24 Okt 2026',
          actor: 'Notaris PPAT & Bank BTN',
          status: 'pending',
        },
      ],
      createdAt: '2026-10-01 10:15',
      updatedAt: '2026-10-15 14:10',
    },
    {
      id: 'KPR-2026-002',
      unitId: 'B.03',
      customer: {
        nama: 'Aisyah Putri Rahmadani',
        nik: '3201123456780011',
        telepon: '085711223344',
        email: 'aisyah.putri@sekolah.sch.id',
        pekerjaan: 'Guru Honorer Bersertifikasi',
        perusahaan: 'Dinas Pendidikan Kab. Bekasi',
        gajiBulanan: 4500000,
        statusPernikahan: 'Lajang',
        alamat: 'Kp. Pulo Kapuk RT 01/03, Cikarang Utara',
      },
      marketingName: 'Dewi Sartika',
      bankPenyalur: 'Bank BRI',
      currentStage: 'AKAD_KREDIT',
      bookingFee: 1500000,
      bookingFeePaid: true,
      uangMuka: 2000000,
      uangMukaPaid: true,
      plafonKpr: 181500000,
      tenorTahun: 20,
      cicilanPerBulan: 1190000,
      sp3kNumber: 'SP3K/BRI-FLPP/2026/410',
      sp3kDate: '2026-10-02',
      sp3kPlafon: 181500000,
      akadDate: '2026-10-18',
      documents: STANDARD_DOCUMENTS_TEMPLATE.map((tpl, idx) => ({
        id: `doc-2-${idx}`,
        type: tpl.type,
        title: tpl.title,
        description: tpl.description,
        required: tpl.required,
        status: 'TERVERIFIKASI',
        fileName: `${tpl.type.toLowerCase()}_lengkap.pdf`,
        fileSize: '1.2 MB',
        uploadedAt: '2026-09-25 11:00',
        verifiedAt: '2026-09-26 15:00',
        verifiedBy: 'Tim Legal (Amanda SH)',
      })),
      timeline: [
        {
          id: 'tl-b1',
          stage: 'BOOKING_REGISTRASI',
          title: 'Booking Unit B.03',
          description: 'Pembayaran booking fee Rp 1.500.000 lunas.',
          timestamp: '2026-09-18 11:20',
          actor: 'Marketing (Dewi)',
          status: 'completed',
        },
        {
          id: 'tl-b2',
          stage: 'PEMBERKASAN_LEGAL',
          title: 'Pemberkasan 100% Lengkap',
          description: 'Semua berkas persyaratan KPR bersubsidi dinyatakan lengkap dan valid.',
          timestamp: '2026-09-22 09:30',
          actor: 'Legalitas',
          status: 'completed',
        },
        {
          id: 'tl-b3',
          stage: 'SLIK_BI_CHECKING',
          title: 'SLIK OJK Disetujui',
          description: 'Kolektibilitas BI lancar tanpa catatan negatif.',
          timestamp: '2026-09-26 14:00',
          actor: 'Bank BRI',
          status: 'completed',
        },
        {
          id: 'tl-b4',
          stage: 'ANALISA_SP3K',
          title: 'SP3K Terbit Penuh Rp 181.5 Juta',
          description: 'Surat persetujuan KPR telah ditandatangani Pimpinan Cabang Bank BRI.',
          timestamp: '2026-10-02 10:00',
          actor: 'Bank BRI',
          status: 'completed',
        },
        {
          id: 'tl-b5',
          stage: 'PROSES_KONSTRUKSI',
          title: 'Rumah 100% Siap Huni',
          description: 'Fisik bangunan telah lolos checklist QA/QC Developer.',
          timestamp: '2026-10-10 16:30',
          actor: 'Site Project Engineer',
          status: 'completed',
        },
        {
          id: 'tl-b6',
          stage: 'AKAD_KREDIT',
          title: 'Jadwal Akad Kredit 18 Oktober 2026',
          description: 'Persiapan penandatanganan akad notarial dan pencairan dana KPR.',
          timestamp: '2026-10-18 10:00',
          actor: 'Notaris & Bank BRI',
          status: 'in_progress',
        },
      ],
      createdAt: '2026-09-18 11:20',
      updatedAt: '2026-10-15 11:00',
    },
    {
      id: 'KPR-2026-003',
      unitId: 'C.08',
      customer: {
        nama: 'Bambang Irawan',
        nik: '3201123456780077',
        telepon: '087899001122',
        email: 'bambang.irawan@gmail.com',
        pekerjaan: 'Staf Administrasi Logistik',
        perusahaan: 'PT Sumber Alfaria Trijaya',
        gajiBulanan: 5200000,
        statusPernikahan: 'Menikah',
        namaPasangan: 'Nur Hasanah',
        alamat: 'Desa Telagamurni RT 03/04, Cikarang Barat',
      },
      marketingName: 'Fajar Nugraha',
      bankPenyalur: 'Bank Mandiri',
      currentStage: 'PEMBERKASAN_LEGAL',
      bookingFee: 1500000,
      bookingFeePaid: true,
      uangMuka: 2500000,
      uangMukaPaid: false,
      plafonKpr: 181000000,
      tenorTahun: 15,
      cicilanPerBulan: 1420000,
      documents: STANDARD_DOCUMENTS_TEMPLATE.map((tpl, idx) => {
        if (idx < 5) {
          return {
            id: `doc-3-${idx}`,
            type: tpl.type,
            title: tpl.title,
            description: tpl.description,
            required: tpl.required,
            status: 'TERVERIFIKASI',
            fileName: `${tpl.type.toLowerCase()}.pdf`,
            uploadedAt: '2026-10-12 14:00',
            verifiedAt: '2026-10-13 11:00',
            verifiedBy: 'Tim Legal (Amanda SH)',
          };
        } else if (idx === 5) {
          return {
            id: `doc-3-${idx}`,
            type: tpl.type,
            title: tpl.title,
            description: tpl.description,
            required: tpl.required,
            status: 'MENUNGGU_VERIFIKASI',
            fileName: 'slip_gaji_alfamart_bambang.pdf',
            fileSize: '850 KB',
            uploadedAt: '2026-10-16 08:30',
          };
        }
        return {
          id: `doc-3-${idx}`,
          type: tpl.type,
          title: tpl.title,
          description: tpl.description,
          required: tpl.required,
          status: 'BELUM_UNGGAH',
        };
      }),
      timeline: [
        {
          id: 'tl-c1',
          stage: 'BOOKING_REGISTRASI',
          title: 'Booking Unit C.08',
          description: 'Booking fee Rp 1.500.000 diterima via virtual account.',
          timestamp: '2026-10-11 15:40',
          actor: 'Marketing (Fajar)',
          status: 'completed',
        },
        {
          id: 'tl-c2',
          stage: 'PEMBERKASAN_LEGAL',
          title: 'Tahap Unggah & Verifikasi Dokumen',
          description: 'Konsumen sedang mengunggah sisa dokumen persyaratan.',
          timestamp: '2026-10-12 14:00',
          actor: 'Marketing & Konsumen',
          status: 'in_progress',
        },
      ],
      createdAt: '2026-10-11 15:40',
      updatedAt: '2026-10-16 08:30',
    },
  ];

  return apps;
}

export const INITIAL_SETTINGS: AppSettings = {
  appTitle: 'SI-KPR PRIMA',
  housingName: 'Griya Prima Asri Cikarang',
  companyName: 'PT. Prima Karya Mandiri Developer',
  defaultUnitPrice: 185000000,
  marketings: [
    {
      id: 'mkt-1',
      name: 'Dewi Sartika',
      phone: '081234567890',
      email: 'dewi.sartika@primakarya.co.id',
      active: true,
      notes: 'Lead Marketing Blok A & B',
    },
    {
      id: 'mkt-2',
      name: 'Rizky Pratama',
      phone: '081398765432',
      email: 'rizky.pratama@primakarya.co.id',
      active: true,
      notes: 'Marketing Senior Blok C',
    },
    {
      id: 'mkt-3',
      name: 'Fajar Nugraha',
      phone: '081512345678',
      email: 'fajar.nugraha@primakarya.co.id',
      active: true,
      notes: 'Marketing Blok D & Digital Ads',
    },
  ],
  banks: [
    {
      id: 'bank-1',
      name: 'Bank BTN',
      code: 'BTN',
      branch: 'Kantor Cabang Cikarang',
      picName: 'Hendra Kusuma (Analis KPR)',
      picPhone: '08122334455',
      active: true,
    },
    {
      id: 'bank-2',
      name: 'Bank BTN Syariah',
      code: 'BTNS',
      branch: 'Kantor Cabang Bekasi',
      picName: 'Anita Rahayu (Pembiayaan)',
      picPhone: '08133445566',
      active: true,
    },
    {
      id: 'bank-3',
      name: 'Bank BNI',
      code: 'BNI',
      branch: 'Kantor Cabang Karawang',
      picName: 'Dimas Anggara (Kredit Konsumer)',
      picPhone: '08177889900',
      active: true,
    },
    {
      id: 'bank-4',
      name: 'Bank BRI',
      code: 'BRI',
      branch: 'Kantor Cabang Tambun',
      picName: 'Siti Aminah (Account Officer)',
      picPhone: '08188990011',
      active: true,
    },
    {
      id: 'bank-5',
      name: 'Bank Mandiri',
      code: 'MANDIRI',
      branch: 'Kantor Cabang Jababeka',
      picName: 'Bambang Hartono (Sales Leader)',
      picPhone: '08199001122',
      active: true,
    },
  ],
  stages: [
    {
      id: 'stg-1',
      key: 'BOOKING_REGISTRASI',
      label: '1. Booking & Kunci Unit',
      step: 1,
      roleResponsible: 'Marketing',
      description: 'Pembayaran booking fee Rp 1.500.000 dan penerbitan Surat Pemesanan Rumah (SPR)',
    },
    {
      id: 'stg-2',
      key: 'PEMBERKASAN_LEGAL',
      label: '2. Audit Berkas Legal',
      step: 2,
      roleResponsible: 'Legal',
      description: 'Pemeriksaan keabsahan dokumen kependudukan & penghasilan oleh tim legal developer',
    },
    {
      id: 'stg-3',
      key: 'SLIK_BI_CHECKING',
      label: '3. SLIK OJK / BI Checking',
      step: 3,
      roleResponsible: 'Bank / Notaris',
      description: 'Verifikasi riwayat kredit perbankan pemohon untuk memastikan kolektibilitas lancar (Kol 1)',
    },
    {
      id: 'stg-4',
      key: 'WAWANCARA_BANK',
      label: '4. Wawancara & Analisa',
      step: 4,
      roleResponsible: 'Bank / Notaris',
      description: 'Wawancara kredit tatap muka atau video call oleh pihak analis bank pelaksana (BTN/BRI)',
    },
    {
      id: 'stg-5',
      key: 'ANALISA_SP3K',
      label: '5. Penerbitan SP3K',
      step: 5,
      roleResponsible: 'Bank / Notaris',
      description: 'Surat Penegasan Persetujuan Penyediaan Kredit resmi terbit dengan plafon subsidi disetujui',
    },
    {
      id: 'stg-6',
      key: 'PROSES_KONSTRUKSI',
      label: '6. Pembangunan Fisik Unit',
      step: 6,
      roleResponsible: 'Legal',
      description: 'Penyelesaian fisik rumah subsidi hingga 100% dan sertifikat layak huni siap',
    },
    {
      id: 'stg-7',
      key: 'AKAD_KREDIT',
      label: '7. Akad Kredit & Realisasi',
      step: 7,
      roleResponsible: 'Bank / Notaris',
      description: 'Tanda tangan perjanjian kredit di depan Notaris, dana KPR cair ke Escrow Developer',
    },
    {
      id: 'stg-8',
      key: 'BAST_KUNCI',
      label: '8. Serah Terima Kunci (BAST)',
      step: 8,
      roleResponsible: 'Legal',
      description: 'Penyerahan kunci fisik rumah, meteran listrik PLN, dan buku tabungan KPR ke debitur',
    },
  ],
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Dokumen Perlu Revisi',
    message: 'Slip Gaji pemohon Tri Joko Santoso (Unit A.04) ditolak Tim Legal: Mohon sertakan stempel basah resmi HRD perusahaan.',
    type: 'document_rejected',
    targetUnitId: 'A.04',
    applicationId: 'KPR-2026-001',
    timestamp: '10 menit yang lalu',
    read: false,
    severity: 'urgent',
    actor: 'Sarah Fitriani (Tim Legal Developer)',
    actorRole: 'ADMIN_LEGAL',
  },
  {
    id: 'notif-2',
    title: 'Dokumen Baru Diunggah Real-Time',
    message: 'Pemohon Bambang Irawan mengunggah berkas Slip Gaji 3 Bulan melalui portal debitur.',
    type: 'document_uploaded',
    targetUnitId: 'C.08',
    applicationId: 'KPR-2026-003',
    timestamp: '35 menit yang lalu',
    read: false,
    severity: 'info',
    actor: 'Bambang Irawan (Debitur / Konsumen)',
    actorRole: 'KONSUMEN',
  },
  {
    id: 'notif-3',
    title: 'SP3K Disetujui Bank BTN',
    message: 'Analis KPR Bank BTN menerbitkan SP3K untuk pemohon Hendri Saputra (Unit A.01) plafon Rp 180.500.000.',
    type: 'sp3k_issued',
    targetUnitId: 'A.01',
    applicationId: 'KPR-2026-002',
    timestamp: '2 jam yang lalu',
    read: false,
    severity: 'success',
    actor: 'Hendra Kusuma (Analis Bank BTN)',
    actorRole: 'BANK',
  },
  {
    id: 'notif-4',
    title: 'Pengingat WhatsApp Otomatis Terkirim',
    message: 'Pesan pengingat wawancara bank otomatis terkirim ke WhatsApp Hendri Saputra (+6281298765432).',
    type: 'whatsapp_sent',
    targetUnitId: 'A.01',
    timestamp: '3 jam yang lalu',
    read: true,
    severity: 'info',
    actor: 'Sistem Pengingat WhatsApp',
    actorRole: 'SISTEM',
  },
  {
    id: 'notif-5',
    title: 'Akad Kredit Selesai',
    message: 'Realisasi Akad Kredit Unit B.01 berhasil di Notaris. Dana KPR Rp 180.500.000 cair ke rekening Escrow Developer.',
    type: 'payment_received',
    targetUnitId: 'B.01',
    timestamp: 'Kemarin, 14:20',
    read: true,
    severity: 'success',
    actor: 'H. Sudirman, S.H., M.Kn (Notaris Rekanan)',
    actorRole: 'BANK',
  },
  {
    id: 'notif-6',
    title: 'Booking Unit Baru Diinput',
    message: 'Marketing Dewi Sartika mengunci booking fee unit B.15 untuk pemohon Fitriani.',
    type: 'stage_changed',
    targetUnitId: 'B.15',
    timestamp: 'Kemarin, 10:15',
    read: true,
    severity: 'info',
    actor: 'Dewi Sartika (Marketing)',
    actorRole: 'MARKETING',
  },
];

export const INITIAL_REMINDERS: WhatsAppReminder[] = [
  {
    id: 'rem-1',
    recipientName: 'Tri Joko Santoso',
    phoneNumber: '081298765432',
    unitId: 'A.04',
    applicationId: 'KPR-2026-001',
    message: 'Halo Bapak Tri Joko Santoso, mohon melengkapi revisi dokumen Slip Gaji 3 bulan bertanda tangan HRD dan berstempel basah untuk proses KPR Unit A.04 Perumahan Griya Prima Asri. Terima kasih. - Tim Legal SI-KPR',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    status: 'SCHEDULED',
    createdAt: new Date().toISOString(),
    templateType: 'REVISI_DOKUMEN',
  },
  {
    id: 'rem-2',
    recipientName: 'Bambang Irawan',
    phoneNumber: '081387654321',
    unitId: 'C.08',
    applicationId: 'KPR-2026-003',
    message: 'Halo Bapak Bambang Irawan, pengajuan KPR Anda untuk Unit C.08 telah kami teruskan ke Bank BTN. Harap bersiap untuk sesi wawancara analis bank. Info lebih lanjut: 081234567890. - Tim Legal SI-KPR',
    scheduledDate: new Date(Date.now() + 172800000).toISOString().slice(0, 16),
    status: 'SCHEDULED',
    createdAt: new Date().toISOString(),
    templateType: 'WAWANCARA_BANK',
  },
];

