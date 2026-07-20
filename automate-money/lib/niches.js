import fs from 'fs';
import path from 'path';

// Define the file path for niches.json
const NICHES_FILE_PATH = path.resolve('lib/niches.json');

const DEFAULT_NICHES = {
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

/**
 * Get all niches, initializing the file if it does not exist.
 */
export function getNiches() {
  try {
    if (!fs.existsSync(NICHES_FILE_PATH)) {
      // If the file doesn't exist, we write the default settings
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

/**
 * Write all niches to the JSON file.
 */
export function saveNiches(niches) {
  try {
    fs.writeFileSync(NICHES_FILE_PATH, JSON.stringify(niches, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to save niches.json:', err);
    throw new Error('Failed to write niche database file: ' + err.message);
  }
}

/**
 * Add or update a niche.
 */
export function setNiche(key, nicheData) {
  const niches = getNiches();
  // Ensure basic fields exist
  niches[key] = {
    label: nicheData.label || key,
    templateBases: nicheData.templateBases || [`webhype${key}-1`, `webhype${key}-2`, `webhype${key}-3`],
    templateDomain: nicheData.templateDomain || 'vercel.app',
    messageTemplate: nicheData.messageTemplate || 'Hi there! We have a web design deal for you.',
    searchKeywords: Array.isArray(nicheData.searchKeywords)
      ? nicheData.searchKeywords
      : (nicheData.searchKeywords || '').split(',').map(s => s.trim()).filter(Boolean)
  };
  saveNiches(niches);
  return niches[key];
}

/**
 * Delete a niche.
 */
export function deleteNiche(key) {
  const niches = getNiches();
  if (niches[key]) {
    delete niches[key];
    saveNiches(niches);
    return true;
  }
  return false;
}
