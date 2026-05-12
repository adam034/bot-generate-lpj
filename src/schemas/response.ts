export type Bot = {
  message: string;
  status: number;
  data:
    | (Gsheet & {
        items: Items[];
        temps: TempData[];
        total_pagu_2: string;
        ttd_pengirim: string;
      })
    | null;
};

export type Gsheet = {
  nama_pptk: string;
  nip_pptk: string;
  nama_bidang: string;
  nama_kegiatan: string;
  kode_sub_kegiatan: string;
  nama_sub_kegiatan: string;
  kode_belanja: string;
  nama_belanja: string;
  kode_rup: string;
  nama_penyedia: string;
  nama_toko: string;
  alamat: string;
  nama_bank: string;
  no_rekening: string;
  nama_pemilik_rekening: string;
  daftar_belanja: string;
  pagu: string;
  quantity: string;
  satuan: string;
  dpp: string;
  ppn: string;
  harga: string;
  jumlah: string;
  tanggal_pesanan: string;
  tanggal_Kontrak: string;
  tanggal_tersedia: string;
  no_pptk_ppkm: string;
  no_ppkm_ppbj: string;
  no_dpp: string;
  no_kontrak: string;
  no_bast_ppkm: string;
  no_bast_ppkm2: string;
  no_bast_pb: string;
  kode_berkas: string;
  keterangan: string;
};

export type Items = {
  no: number;
  daftar_belanja: string;
  quantity: string;
  satuan: string;
  harga: string;
  jumlah: string;
  pagu: string;
  dpp: string;
  ppn: string;
  ket: string;
  pagu_2: string;
  pagu_2_non_str: number;
};

export type TempData = {
  harga: number;
  jumlah: number;
};
