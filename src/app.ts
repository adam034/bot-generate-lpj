import { Telegraf, Context, Scenes, session } from "telegraf";
import { ResponseBot, ResponseGsheet, Items, TempData } from "./schema.js";
import { getGoogleSheet } from "./integrations/google-sheet/client.js";

import {
  formatTerbilang,
  formatRupiah,
  formatTglBulanTahun,
  convertToDocx,
} from "./utils.js";
import * as fs from "fs";

async function LoadDocument(sheetName: string): Promise<ResponseBot> {
  const items: Items[] = [];
  const temps: TempData[] = [];

  const doc = getGoogleSheet();
  const sheet = doc.sheetsByTitle[`${sheetName}`];
  if (!sheet) {
    return {
      message: "sheet not found",
      status: 404,
      data: null,
    };
  }

  const rows = (await sheet.getRows())
    .map((r) => r.toObject() as ResponseGsheet)
    .filter((data) => data.kode_berkas === "spj");

  rows.forEach((r, index) => {
    items.push({
      no: index + 1,
      daftar_belanja: r.daftar_belanja,
      quantity: r.quantity,
      satuan: r.satuan,
      harga: formatRupiah(r.harga),
      jumlah: formatRupiah(r.jumlah),
      pagu: formatRupiah(r.pagu),
      dpp: formatRupiah(r.dpp),
      ppn: formatRupiah(r.ppn),
      ket: "",
    });
    temps.push({
      harga: +r.harga,
      jumlah: +r.jumlah,
    });
  });

  let total = temps.reduce((acc, rows) => {
    return acc + rows.jumlah;
  }, 0);
  let tax = Math.round((total * 11) / 100);
  let totalIncludeTax = total + Math.round(tax);

  const results = {
    ...rows[0],
    tanggal_pesanan: `${
      formatTglBulanTahun(rows[0]!.tanggal_pesanan).num_tanggal
    } ${formatTglBulanTahun(rows[0]!.tanggal_pesanan).bulan} ${
      formatTglBulanTahun(rows[0]!.tanggal_pesanan).num_tahun
    }`,
    tanggal_kontrak: `${
      formatTglBulanTahun(rows[0]!.tanggal_Kontrak).num_tanggal
    } ${formatTglBulanTahun(rows[0]!.tanggal_Kontrak).bulan} ${
      formatTglBulanTahun(rows[0]!.tanggal_Kontrak).num_tahun
    }`,
    tanggal_tersedia: `${
      formatTglBulanTahun(rows[0]!.tanggal_tersedia).num_tanggal
    } ${formatTglBulanTahun(rows[0]!.tanggal_tersedia).bulan} ${
      formatTglBulanTahun(rows[0]!.tanggal_tersedia).num_tahun
    }`,
    terbilang_tanggal_pesanan: formatTglBulanTahun(rows[0]!.tanggal_pesanan)
      .tanggal,
    terbilang_hari_pesanan: formatTglBulanTahun(rows[0]!.tanggal_pesanan).hari,
    terbilang_bulan_pesanan: formatTglBulanTahun(rows[0]!.tanggal_pesanan)
      .bulan,
    terbilang_tahun_pesanan: formatTglBulanTahun(rows[0]!.tanggal_pesanan)
      .tahun,
    terbilang_tanggal_tersedia: formatTglBulanTahun(rows[0]!.tanggal_tersedia)
      .tanggal,
    terbilang_hari_tersedia: formatTglBulanTahun(rows[0]!.tanggal_tersedia)
      .hari,
    terbilang_bulan_tersedia: formatTglBulanTahun(rows[0]!.tanggal_tersedia)
      .bulan,
    terbilang_tahun_tersedia: formatTglBulanTahun(rows[0]!.tanggal_tersedia)
      .tahun,
    total: formatRupiah(totalIncludeTax.toString()),
    pajak: formatRupiah(tax.toString()),
    total_jumlah: formatRupiah(total.toString()),
    terbilang_total_jumlah: `${formatTerbilang(total)} Rupiah`,
    items,
    temps,
  };

  return {
    message: "success",
    status: 200,
    data: results,
  };
}

export async function App(bot: Telegraf<Context>): Promise<Telegraf<Context>> {
  const generateScene = new Scenes.WizardScene(
    "generate",
    async (ctx) => {
      await ctx.reply("Masukkan kode sheet");
      return ctx.wizard.next();
    },
    async (ctx: any) => {
      const message = ctx.message.text;
      const docs = await LoadDocument(message);

      if (docs.status === 404) {
        ctx.reply(`Sheet ${message} tidak ditemukan`);
        return await ctx.scene.leave();
      }

      const result = await convertToDocx(docs.data);

      await ctx
        .replyWithDocument({
          source: result.path,
        })
        .then(() => {
          fs.unlink(result.path, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      ctx.reply(`Berkas  Telah di proses `);
      return await ctx.scene.leave();
    },
  );
  bot.use(session());
  const stage = new Scenes.Stage([generateScene]);
  bot.use(stage.middleware());

  bot.command("generate", async (ctx: any) => {
    await ctx.scene.enter("generate");
  });

  bot.command("start", (ctx) => {
    ctx.reply(`Hallo ${ctx.from.username}`);
  });

  return bot;
}
