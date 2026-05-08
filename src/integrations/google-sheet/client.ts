import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

let doc: GoogleSpreadsheet | null = null;

export async function InitGoogleSheet(
  sheetId: string,
  clientEmail: string,
  privateKey: string,
): Promise<GoogleSpreadsheet> {
  if (doc) return doc;
  const auth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  doc = new GoogleSpreadsheet(sheetId, auth);
  await doc.loadInfo();

  return doc;
}

export function getGoogleSheet() {
  if (!doc) {
    throw new Error("GoogleSheet not initialized");
  }
  return doc;
}
