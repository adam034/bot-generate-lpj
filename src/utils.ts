import * as path from "node:path";
import * as fs from "fs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
export const ROOT_PATH = path.join(process.cwd());

export function formatTerbilang(n: number): string {
  const bilangan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  if (n >= 0 && n < 12) {
    return bilangan[n]!;
  } else if (n < 20) {
    return (bilangan[n - 10] ?? "") + " Belas";
  } else if (n < 100) {
    return (
      (bilangan[Math.floor(n / 10)] ?? "") +
      " Puluh " +
      (bilangan[n % 10] ?? "")
    );
  } else if (n < 200) {
    return "Seratus " + formatTerbilang(n - 100);
  } else if (n < 1000) {
    return (
      (bilangan[Math.floor(n / 100)] ?? "") +
      " Ratus " +
      formatTerbilang(n % 100)
    );
  } else if (n < 2000) {
    return "Seribu " + formatTerbilang(n - 1000);
  } else if (n < 1000000) {
    return (
      formatTerbilang(Math.floor(n / 1000)) +
      " Ribu " +
      formatTerbilang(n % 1000)
    );
  } else if (n < 1000000000) {
    return (
      formatTerbilang(Math.floor(n / 1000000)) +
      " Juta " +
      formatTerbilang(n % 1000000)
    );
  } else if (n < 1000000000000) {
    return (
      formatTerbilang(Math.floor(n / 1000000000)) +
      " Milyar " +
      formatTerbilang(n % 1000000000)
    );
  } else if (n < 1000000000000000) {
    return (
      formatTerbilang(Math.floor(n / 1000000000000)) +
      " Trilyun " +
      formatTerbilang(n % 1000000000000)
    );
  }

  return "";
}
export function formatTglBulanTahun(tanggal: string): {
  hari: string;
  tanggal: string;
  bulan: string;
  tahun: string;
  num_tahun: number;
  num_tanggal: number;
} {
  let date = new Date(tanggal);
  let tahun = formatTerbilang(date.getFullYear());
  let bulan = date.toLocaleDateString("id-ID", { month: "long" });
  let tgl = formatTerbilang(date.getDate());
  let hari = date.toLocaleDateString("id-ID", { weekday: "long" });
  return {
    hari: hari,
    tanggal: tgl,
    bulan: bulan,
    tahun: tahun,
    num_tahun: date.getFullYear(),
    num_tanggal: date.getDate(),
  };
}
export function formatRupiah(n: string, prefix?: string): string {
  let angkaString = n.replace(/\./g, ",").replace(/[^,\d]/g, "");
  let split = angkaString.split(",");

  const bagianDepan = split[0] ?? "";
  const bagianBelakang = split[1];

  let sisa = bagianDepan.length % 3;
  let rupiah = bagianDepan.slice(0, sisa);
  let ribuan = bagianDepan.slice(sisa).match(/\d{3}/gi);

  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  if (bagianBelakang !== undefined) {
    rupiah += "," + bagianBelakang;
  }

  return prefix ? (rupiah ? "Rp. " + rupiah : "") : rupiah;
}

export async function convertToDocx(data: any) {
  delete data["temp"];

  const tmpPath = path.join(ROOT_PATH, "assets");
  const content = fs.readFileSync(`${tmpPath}/gabung.docx`);
  const zip: PizZip = new PizZip(content);
  const doc: Docxtemplater<PizZip> = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render(data);

  const buf = doc.getZip().generate({
    type: "nodebuffer",

    compression: "DEFLATE",
  });

  fs.writeFileSync(`${tmpPath}/result.docx`, buf);

  return {
    path: `${tmpPath}/result.docx`,
  };
}
