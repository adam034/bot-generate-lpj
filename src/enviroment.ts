import "dotenv/config";

export const environment = {
  token: process.env.TOKEN!,
  sheet_id: process.env.SHEET_ID,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  private_key: process.env.PRIVATE_KEY!.split(String.raw`\n`).join("\n"),
};
