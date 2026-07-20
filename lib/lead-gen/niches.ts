import fs from 'fs';
import path from 'path';

const NICHES_FILE_PATH = path.resolve(process.cwd(), 'lib/lead-gen/niches.json');

const DEFAULT_NICHES: Record<string, any> = {
  gym: {
    label: "Gym / Fitness",
    templateBases: ["webhypegym-1", "webhypegym-2", "webhypegym-3"],
    templateDomain: "vercel.app",
    messageTemplate: "Sorry for bothering u but I have a deal for u. I have designed 3 free website for u also a logo + mobile app + 2 free ads graphics + whatsapp automation in just ₹5000 deal. Let me know if u want to see demo",
    searchKeywords: ["gym", "fitness center", "fitness studio", "personal training", "crossfit"]
  },
  salon: {
    label: "Salon / Beauty",
    templateBases: ["webhypesalon-1", "webhypesalon-2", "webhypesalon-3"],
    templateDomain: "vercel.app",
    messageTemplate: "Sorry for bothering u but I have a deal for u. I have designed 3 free website for u also a logo + mobile app + 2 free ads graphics + whatsapp automation in just ₹5000 deal. Let me know if u want to see demo",
    searchKeywords: ["salon", "beauty studio", "hair salon", "nail salon", "spa"]
  },
  coaching: {
    label: "Coaching / Consulting",
    templateBases: ["webhypecoach-1", "webhypecoach-2", "webhypecoach-3"],
    templateDomain: "vercel.app",
    messageTemplate: "Sorry for bothering u but I have a deal for u. I have designed 3 free website for u also a logo + mobile app + 2 free ads graphics + whatsapp automation in just ₹5000 deal. Let me know if u want to see demo",
    searchKeywords: ["life coach", "business coach", "consultant", "coaching", "mentorship"]
  }
};

export function getNiches() {
  try {
    if (!fs.existsSync(NICHES_FILE_PATH)) {
      fs.mkdirSync(path.dirname(NICHES_FILE_PATH), { recursive: true });
      fs.writeFileSync(NICHES_FILE_PATH, JSON.stringify(DEFAULT_NICHES, null, 2), 'utf-8');
      return DEFAULT_NICHES;
    }
    const content = fs.readFileSync(NICHES_FILE_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading niches.json, using defaults:', err);
    return DEFAULT_NICHES;
  }
}

export function saveNiches(niches: Record<string, any>) {
  try {
    fs.mkdirSync(path.dirname(NICHES_FILE_PATH), { recursive: true });
    fs.writeFileSync(NICHES_FILE_PATH, JSON.stringify(niches, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save niches.json:', err);
    throw new Error('Failed to write niche database file: ' + (err as Error).message);
  }
}

export function setNiche(key: string, nicheData: any) {
  const niches = getNiches();
  niches[key] = {
    label: nicheData.label || key,
    templateBases: nicheData.templateBases || [`webhype${key}-1`, `webhype${key}-2`, `webhype${key}-3`],
    templateDomain: nicheData.templateDomain || 'vercel.app',
    messageTemplate: nicheData.messageTemplate || 'Hi there! We have a web design deal for you.',
    searchKeywords: Array.isArray(nicheData.searchKeywords)
      ? nicheData.searchKeywords
      : (nicheData.searchKeywords || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  };
  saveNiches(niches);
  return niches[key];
}

export function deleteNiche(key: string) {
  const niches = getNiches();
  if (niches[key]) {
    delete niches[key];
    saveNiches(niches);
    return true;
  }
  return false;
}
