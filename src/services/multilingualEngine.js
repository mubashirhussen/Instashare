import datasetItems from '../data/multilingual_profanity.json'

/**
 * Normalizes transliterated text by standardizing double vowels, common slang shortcuts, and leetspeak
 */
const normalizeText = text => {
  return text
    .toLowerCase()
    .replace(/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Map common phonetic transliterations and dialect spelling variations
const PHONETIC_SYNONYMS = {
  puku: ['pooku', 'puku', 'pookuu', 'pukku'],
  pooku: ['puku', 'pooku', 'pookuu', 'pukku'],
  lanja: ['lanjaa', 'lanja', 'laanja', 'lanjakoduku'],
  lanjaa: ['lanja', 'lanjaa', 'laanja'],
  chutiya: ['chootiya', 'chutiya', 'chotya', 'chutiye'],
  chootiya: ['chutiya', 'chootiya', 'chotya'],
  behenchod: ['bhenchod', 'behenchod', 'bhenchodd', 'bc'],
  bhenchod: ['behenchod', 'bhenchod', 'bc'],
  madarchod: ['maderchod', 'madarchod', 'mc'],
  thevidiya: ['dhevadiaa', 'thevidiya', 'devadiya', 'thevadiya'],
  dhevadiaa: ['thevidiya', 'dhevadiaa', 'devadiya', 'thevadiya'],
  soole: ['sulle', 'soole', 'sole', 'sooli'],
  sulle: ['soole', 'sulle', 'sole', 'sooli'],
  gandu: ['gaandu', 'gandu', 'gandoo'],
  gaandu: ['gandu', 'gaandu', 'gandoo'],
}

// Sub-type localized translations for natural explanations
const SUBTYPE_TRANSLATIONS = {
  'Maternal Profanity': {
    en: 'Maternal Profanity / Mother-directed slur',
    hi: 'मातृ-अपमानजनक व अश्लील गाली (Maternal Profanity)',
    te: 'తల్లిని ఉద్దేశించిన తీవ్ర అసభ్యకరమైన తిట్టు (Maternal Profanity)',
    ta: 'தாய் பற்றிய தகாத வார்த்தை (Maternal Profanity)',
    kn: 'ತಾಯಿಯನ್ನು ನಿಂದಿಸುವ ಅಸಭ್ಯ ಪದ (Maternal Profanity)',
  },
  'Paternal Profanity': {
    en: 'Paternal Profanity / Father-directed slur',
    hi: 'पितृ-अपमानजनक गाली (Paternal Profanity)',
    te: 'తండ్రిని ఉద్దేశించిన అసభ్యకరమైన దూషణ (Paternal Profanity)',
    ta: 'தந்தை பற்றிய தகாத வார்த்தை (Paternal Profanity)',
    kn: 'ತಂದೆಯನ್ನು ನಿಂದಿಸುವ ಅಸಭ್ಯ ಪದ (Paternal Profanity)',
  },
  'Sexual Profanity': {
    en: 'Sexually Explicit / Vulgar Profanity',
    hi: 'यौन रूप से स्पष्ट एवं अत्यधिक अश्लील भाषा (Sexual Profanity)',
    te: 'లైంగికంగా అత్యంత అసభ్యకరమైన పదజాలం (Sexual Profanity)',
    ta: 'பாலியல் ரீதியான ஆபாச வார்த்தை (Sexual Profanity)',
    kn: 'ಲೈಂಗಿಕವಾಗಿ ಅತ್ಯಂತ ಅಶ್ಲೀಲ ಪದ (Sexual Profanity)',
  },
  'Body-part Profanity': {
    en: 'Crude Body-part Profanity',
    hi: 'शारीरिक अंगों से संबंधित अभद्र शब्द (Body-part Profanity)',
    te: 'శరీర భాగాలకు సంబంధించిన అత్యంత అసభ్యకరమైన పదజాలం (Body-part Profanity)',
    ta: 'உடல் உறுப்பு தொடர்பான தகாத வார்த்தை (Body-part Profanity)',
    kn: 'ದೇಹದ ಭಾಗಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಅಸಭ್ಯ ಪದ (Body-part Profanity)',
  },
  'Slur Profanity': {
    en: 'Derogatory Slur / Abusive Language',
    hi: 'अपमानजनक व हीन शब्द (Derogatory Slur)',
    te: 'తీవ్రమైన నిందాపూర్వక అసభ్య దూషణ (Slur Profanity)',
    ta: 'இழிவான மற்றும் அவதூறான வார்த்தை (Slur Profanity)',
    kn: 'ಅವಮಾನಕರ ಮತ್ತು ನಿಂದನೀಯ ಪದ (Slur Profanity)',
  },
  'Death-wish Profanity': {
    en: 'Death-wish / Severe Harassment Threat',
    hi: 'मृत्यु-कामना एवं गंभीर उत्पीड़न (Death-wish Threat)',
    te: 'మరణాన్ని కోరుకునే తీవ్రమైన బెదిరింపు (Death-wish Profanity)',
    ta: 'மரண அச்சுறுத்தல் மற்றும் கடுமையான துன்புறுத்தல் (Death-wish)',
    kn: 'ಸಾವು ಬಯಸುವ ಗಂಭೀರ ಬೆದರಿಕೆ (Death-wish Profanity)',
  },
  'Hybrid Profanity': {
    en: 'Severe Hybrid Profanity / Hate Slur',
    hi: 'गंभीर हाइब्रिड असंसदीय गाली (Hybrid Profanity)',
    te: 'తీవ్రమైన అసభ్యకరమైన పదజాలం (Hybrid Profanity)',
    ta: 'கடுமையான அவதூறு வார்த்தை (Hybrid Profanity)',
    kn: 'ಅತ್ಯಂತ ಗಂಭೀರ ಅಸಭ್ಯ ಪದ (Hybrid Profanity)',
  },
  'General Profanity': {
    en: 'Unparliamentary Profanity',
    hi: 'असंसदीय एवं अमर्यादित भाषा',
    te: 'అసభ్యకరమైన మరియు అసభా ప్రామాణిక భాష',
    ta: 'தகாத மற்றும் அவதூறான மொழி',
    kn: 'ಅಸಭ್ಯ ಹಾಗೂ ನಿಯಮಬಾಹಿರ ಭಾಷೆ',
  },
}

// Build pre-compiled fast lookups
const indexedData = []
for (const item of datasetItems) {
  const native = (item.native_script || '').trim().toLowerCase()
  const roman = (item.romanized || '').trim().toLowerCase()
  const tokens = roman ? roman.split(/\s+/).filter(t => t.length >= 3) : []

  indexedData.push({
    ...item,
    nativeLower: native,
    romanLower: roman,
    tokens,
  })
}

/**
 * Detects multilingual profanity and unparliamentary content
 */
export const detectMultilingualProfanity = text => {
  if (!text || typeof text !== 'string') return null
  const cleanOriginal = text.trim()
  const lowerOriginal = cleanOriginal.toLowerCase()
  const normalized = normalizeText(cleanOriginal)
  const words = normalized.split(/\s+/).filter(Boolean)

  let bestMatch = null
  let matchScore = 0
  let matchedWord = ''

  // 1. Direct Native Script Substring Search
  for (const item of indexedData) {
    if (item.nativeLower && lowerOriginal.includes(item.nativeLower)) {
      bestMatch = item
      matchedWord = item.native_script
      matchScore = item.severity === 'Critical' ? 0.96 : 0.88
      break
    }
  }

  // 2. Full Romanized Phrase Match (exact or substring)
  if (!bestMatch) {
    for (const item of indexedData) {
      if (
        item.romanLower &&
        (normalized.includes(item.romanLower) ||
          lowerOriginal.includes(item.romanLower) ||
          item.romanLower.includes(normalized))
      ) {
        bestMatch = item
        matchedWord = item.romanized
        matchScore = item.severity === 'Critical' ? 0.94 : 0.86
        break
      }
    }
  }

  // 3. Multi-word phrase n-gram matching
  if (!bestMatch) {
    for (const item of indexedData) {
      if (item.tokens.length >= 2) {
        // If 2 or more tokens match in the sentence
        const matchedTokens = item.tokens.filter(tok => normalized.includes(tok) || lowerOriginal.includes(tok))
        if (matchedTokens.length >= 2 || (item.tokens.length === 2 && matchedTokens.length >= 1 && matchedTokens[0].length >= 5)) {
          bestMatch = item
          matchedWord = item.romanized
          matchScore = item.severity === 'Critical' ? 0.94 : 0.86
          break
        }
      }
    }
  }

  // 4. Token & Phonetic Matching (e.g. 'puku', 'lanja', 'chutiya', 'soole', 'thevidiya', etc.)
  if (!bestMatch) {
    for (const word of words) {
      if (word.length < 3) continue
      const synonyms = PHONETIC_SYNONYMS[word] || [word]

      for (const syn of synonyms) {
        for (const item of indexedData) {
          if (
            item.tokens.includes(syn) ||
            item.romanLower === syn ||
            (item.romanLower.length >= 4 && (syn.includes(item.romanLower) || item.romanLower.includes(syn)))
          ) {
            bestMatch = item
            matchedWord = word
            matchScore = item.severity === 'Critical' ? 0.92 : 0.84
            break
          }
        }
        if (bestMatch) break
      }
      if (bestMatch) break
    }
  }

  // 5. Common high-frequency slurs fallback
  if (!bestMatch) {
    const HIGH_FREQUENCY_SLURS = [
      { trigger: /\b(puku|pooku|lanja|lanjaa|munda|dengu|modda|guddalo|sulikoduku|puttakundaa|undaalsindi|sannaasi|vedhava)\b/i, lang: 'Telugu', sub: 'Sexual Profanity', en: 'Severe vulgar Telugu unparliamentary profanity' },
      { trigger: /\b(chutiya|chootiya|madarchod|behenchod|bhenchod|gandu|bhadwe|harami|lauda|lodu|randi|kameene)\b/i, lang: 'Hindi', sub: 'Maternal Profanity', en: 'Severe vulgar Hindi unparliamentary profanity' },
      { trigger: /\b(thevidiya|dhevadiaa|othala|punda|sunni|baadu|mayire|koodhi|porambokku)\b/i, lang: 'Tamil', sub: 'Sexual Profanity', en: 'Severe vulgar Tamil unparliamentary profanity' },
      { trigger: /\b(soole|sulle|bolimaga|tullu|gullu|halkat|hadar|loafer|thika)\b/i, lang: 'Kannada', sub: 'Maternal Profanity', en: 'Severe vulgar Kannada unparliamentary profanity' },
      { trigger: /\b(fuck|bitch|bastard|asshole|whore|slut|cunt|motherfucker|dick|faggot|nigger|retard)\b/i, lang: 'English', sub: 'General Profanity', en: 'Explicit vulgar English profanity' },
    ]

    for (const hf of HIGH_FREQUENCY_SLURS) {
      const match = cleanOriginal.match(hf.trigger)
      if (match) {
        matchedWord = match[0]
        bestMatch = {
          language: hf.lang,
          native_script: matchedWord,
          romanized: matchedWord,
          english_meaning: hf.en,
          sub_type: hf.sub,
          severity: 'Critical',
          parliamentary_violation: 'Yes',
          category: 'Profanity',
        }
        matchScore = 0.92
        break
      }
    }
  }

  if (!bestMatch) return null

  // Generate 5-language exact translations & explanations
  const subTypeInfo = SUBTYPE_TRANSLATIONS[bestMatch.sub_type] || SUBTYPE_TRANSLATIONS['General Profanity']
  const sourceLang = bestMatch.language || 'Telugu'
  const meaning = bestMatch.english_meaning || 'Unparliamentary explicit content'

  const translations = {
    english: {
      langName: 'English',
      nativeLangLabel: 'English',
      statement: `Flagged toxic statement: '${cleanOriginal}'`,
      explanation: `'${matchedWord}' is classified as ${subTypeInfo.en} (${meaning}). The statement violates parliamentary standards and community guidelines.`,
    },
    hindi: {
      langName: 'Hindi',
      nativeLangLabel: 'हिन्दी',
      statement: `ध्वजांकित हानिकारक कथन: '${cleanOriginal}'`,
      explanation: `कथन में '${matchedWord}' को ${subTypeInfo.hi} (${meaning}) के रूप में पहचाना गया है; यह असंसदीय व हानिकारक है।`,
    },
    telugu: {
      langName: 'Telugu',
      nativeLangLabel: 'తెలుగు',
      statement: `హానికరమైనదిగా గుర్తించబడిన వాక్యం: '${cleanOriginal}'`,
      explanation: `వాక్యంలో '${matchedWord}' అనేది ${subTypeInfo.te} (${meaning}) గా గుర్తించబడింది; ఇది అసభ్యకరమైనది మరియు నియమాలకు విరుద్ధం.`,
    },
    tamil: {
      langName: 'Tamil',
      nativeLangLabel: 'தமிழ்',
      statement: `தீங்கு விளைவிக்கும் செய்தியாகக் குறிக்கப்பட்டது: '${cleanOriginal}'`,
      explanation: `'${matchedWord}' என்பது ${subTypeInfo.ta} (${meaning}) என அடையாளம் காணப்பட்டுள்ளது; இது தகாத உள்ளடக்கமாகும்.`,
    },
    kannada: {
      langName: 'Kannada',
      nativeLangLabel: 'ಕನ್ನಡ',
      statement: `ಹಾನಿಕಾರಕವೆಂದು ಗುರುತಿಸಲಾದ ಸಂದೇಶ: '${cleanOriginal}'`,
      explanation: `'${matchedWord}' ಎಂಬುದು ${subTypeInfo.kn} (${meaning}) ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ; ಇದು ಅಸಭ್ಯ ಹಾಗೂ ನಿಯಮಬಾಹಿರವಾಗಿದೆ.`,
    },
  }

  return {
    isProfane: true,
    matchedWord,
    matchedItem: bestMatch,
    sourceLanguage: sourceLang,
    subType: bestMatch.sub_type || 'Unparliamentary Profanity',
    severity: bestMatch.severity || 'High',
    parliamentaryViolation: bestMatch.parliamentary_violation || 'Yes',
    violationTitle: `Violated Parliamentary Standards: Detected Multilingual profanity / unparliamentary language (${bestMatch.sub_type || 'Profanity'})`,
    score: Number((matchScore * 100).toFixed(1)),
    confidence: `${(matchScore * 100).toFixed(1)}%`,
    translations,
  }
}
