const sporocila: Record<string, string> = {
  USER_ALREADY_EXISTS: "Račun s tem e-poštnim naslovom že obstaja.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Račun s tem e-poštnim naslovom že obstaja.",
  INVALID_EMAIL_OR_PASSWORD: "Napačna e-pošta ali geslo.",
  PASSWORD_TOO_SHORT: "Geslo mora imeti najmanj 8 znakov.",
  INVALID_EMAIL: "Vnesi veljaven e-poštni naslov.",
};

export function prevediNapako(napaka: { code?: string; message?: string; status?: number }) {
  // blokada s statusom 403
  if (napaka.status === 403)
    return "Račun je blokiran.";
  
  if (napaka.code && sporocila[napaka.code])
    return sporocila[napaka.code];
  
  return "Nekaj je šlo narobe. Poskusi znova.";
}
