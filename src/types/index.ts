export type UnitStatus =
  | 'TERSEDIA'              // Available
  | 'TERBOOKING'             // Booked by applicant
  | 'PROSES_PEMBANGUNAN'    // Construction in progress
  | 'PROSES_KPR'            // In KPR processing (SLIK, Bank, SP3K)
  | 'REALISASI_AKAD';       // Akad Kredit finished & funds disbursed

export type BlockId = 'A' | 'B' | 'C' | 'D';

export interface Unit {
  id: string; // e.g., "A.01", "B.05"
  block: BlockId;
  number: string;
  type: string; // "Tipe 36/60 Subsidi"
  luasBangunan: number; // 36 m2
  luasTanah: number; // 60 m2 (or 77 m2 for corner)
  harga: number; // e.g. Rp 185.000.000
  status: UnitStatus;
  constructionProgress: number; // 0 - 100
  constructionStage: 'Belum Dibangun' | 'Pondasi' | 'Dinding & Atap' | 'Finishing' | 'Siap BAST';
  applicationId?: string;
  customerName?: string;
  marketingName?: string;
  sp3kStatus?: 'Belum Terbit' | 'Proses Bank' | 'Disetujui' | 'Ditolak';
  // coordinates for visual layout
  row: number;
  col: number;
}

export type DocumentType =
  | 'KTP_PEMOHON'
  | 'KTP_PASANGAN'
  | 'KARTU_KELUARGA'
  | 'NPWP'
  | 'SURAT_NIKAH'
  | 'SLIP_GAJI'
  | 'SPT_PPH21'
  | 'SURAT_KET_KERJA'
  | 'SK_BELUM_PUNYA_RUMAH'
  | 'REKENING_KORAN'
  | 'FORMULIR_KPR'
  | 'SURAT_PERNYATAAN_SUBSIDI'
  | 'PAS_FOTO';

export type DocumentStatus =
  | 'BELUM_UNGGAH'
  | 'MENUNGGU_VERIFIKASI'
  | 'TERVERIFIKASI'
  | 'PERLU_REVISI'
  | 'DITOLAK';

export interface DocumentItem {
  id: string;
  type: DocumentType;
  title: string;
  description: string;
  required: boolean;
  status: DocumentStatus;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export type KprStage =
  | 'BOOKING_REGISTRASI'      // 1. Booking fee & unit lock
  | 'PEMBERKASAN_LEGAL'        // 2. Berkas diserahkan & diverifikasi legalitas
  | 'SLIK_BI_CHECKING'         // 3. Pengecekan OJK / Bank
  | 'WAWANCARA_BANK'           // 4. Analisa & Wawancara Pemohon
  | 'ANALISA_SP3K'             // 5. Surat Penegasan Persetujuan Penyediaan Kredit
  | 'PROSES_KONSTRUKSI'        // 6. Progres fisik rumah subsidi
  | 'AKAD_KREDIT'              // 7. Akad Kredit di hadapan Notaris & Bank
  | 'BAST_KUNCI';              // 8. Serah Terima Kunci & Sertifikat

export interface StageTimelineItem {
  id: string;
  stage: KprStage;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface KprApplication {
  id: string; // "KPR-2026-001"
  unitId: string;
  customer: {
    nama: string;
    nik: string;
    telepon: string;
    email: string;
    pekerjaan: string;
    perusahaan: string;
    gajiBulanan: number;
    statusPernikahan: 'Lajang' | 'Menikah' | 'Cerai';
    namaPasangan?: string;
    alamat: string;
  };
  marketingName: string;
  bankPenyalur: 'Bank BTN' | 'Bank BRI' | 'Bank Mandiri' | 'Bank BNI' | 'Bank BSI';
  currentStage: KprStage;
  bookingFee: number;
  bookingFeePaid: boolean;
  uangMuka: number;
  uangMukaPaid: boolean;
  plafonKpr: number;
  tenorTahun: number;
  cicilanPerBulan: number;
  sp3kNumber?: string;
  sp3kDate?: string;
  sp3kPlafon?: number;
  akadDate?: string;
  cairDate?: string;
  danaCairNominal?: number;
  documents: DocumentItem[];
  timeline: StageTimelineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'document_uploaded' | 'document_verified' | 'document_rejected' | 'sp3k_issued' | 'stage_changed' | 'payment_received' | 'whatsapp_sent' | 'setting_updated';
  targetUnitId?: string;
  applicationId?: string;
  timestamp: string;
  read: boolean;
  severity: 'info' | 'success' | 'warning' | 'urgent';
  actor?: string;
  actorRole?: 'ADMIN_LEGAL' | 'MARKETING' | 'KONSUMEN' | 'BANK' | 'SISTEM';
}

export type UserRole = 'ADMIN_LEGAL' | 'MARKETING' | 'KONSUMEN';

export interface MarketingStaff {
  id: string;
  name: string;
  phone: string;
  email?: string;
  active: boolean;
  notes?: string;
}

export interface PartnerBank {
  id: string;
  name: string;
  code: string;
  branch: string;
  picName: string;
  picPhone: string;
  active: boolean;
}

export interface CustomKprStage {
  id: string;
  key: string;
  label: string;
  step: number;
  roleResponsible: 'Marketing' | 'Legal' | 'Bank / Notaris';
  description: string;
}

export interface AppSettings {
  appTitle: string;
  housingName: string;
  companyName: string;
  defaultUnitPrice: number;
  marketings: MarketingStaff[];
  banks: PartnerBank[];
  stages: CustomKprStage[];
}

export interface WhatsAppReminder {
  id: string;
  recipientName: string;
  phoneNumber: string;
  unitId?: string;
  applicationId?: string;
  message: string;
  scheduledDate: string; // YYYY-MM-DDTHH:mm
  status: 'SCHEDULED' | 'READY' | 'SENT';
  createdAt: string;
  sentAt?: string;
  templateType?: string;
}

