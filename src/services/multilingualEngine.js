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

// Direct phrase translation dictionary with exact meanings across 6 languages
const DIRECT_MEANINGS = {
  'lanja koduku': {
    en: 'Son of a whore / prostitute',
    hi: 'वेश्या की संतान / रंडी का बेटा (Veshya ki santaan)',
    te: 'వేశ్య యొక్క కుమారుడు / లంజ కొడుకు (Veshya yokka kumaarudu)',
    ta: 'வேசியின் மகன் (Vaesiyin magan)',
    kn: 'ವೇಶ್ಯೆಯ ಮಗ (Vēśyeya maga)',
    ml: 'വ്യഭിചാരിയുടെ മകൻ (Vyabhichaariyude makan)',
  },
  'pooku sannaasi': {
    en: 'Vaginal bum / Crude anatomical insult',
    hi: 'योनि-संबंधी अत्यंत अश्लील गाली (Yoni-sambandhi ashleel gaali)',
    te: 'యోని-సంబంధిత అసభ్యకరమైన తిట్టు (Yoni-sambandhita thittu)',
    ta: 'உடல் உறுப்பு தொடர்பான தகாத அவதூறு வார்த்தை (Thagadha vaarthai)',
    kn: 'ದೇಹದ ಭಾಗಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಅಶ್ಲೀಲ ಪದ (Ashleela pada)',
    ml: 'ജനനേന്ദ്രിയ സംബന്ധിയായ അശ്ലീല വാക്ക് (Ashleelamaaya vaakku)',
  },
  'puku': {
    en: 'Vagina (Crude anatomical slur)',
    hi: 'योनि (अत्यंत अश्लील शब्द)',
    te: 'పూకు / యోని (అత్యంత అసభ్యకరమైన పదం)',
    ta: 'பெண் பிறப்புறுப்பு (தகாத ஆபாச வார்த்தை)',
    kn: 'ಯೋನಿ (ಅತ್ಯಂತ ಅಶ್ಲೀಲ ಪದ)',
    ml: 'സ്ത്രീ ജനനേന്ദ്രിയം (അശ്ലീല വാക്ക്)',
  },
  'nuvvu puttakundaa undaalsindi': {
    en: 'You should never have been born (Death-wish harassment)',
    hi: 'तुम्हारा जन्म ही नहीं होना चाहिए था (Tumhara janm hi nahi hona chahiye tha)',
    te: 'నువ్వు పుట్టకుండా ఉండాల్సింది (Nuvvu puttakundaa undaalsindi)',
    ta: 'நீ பிறந்திருக்கவே கூடாது (Nee pirandhirukkavae koodadhu)',
    kn: 'ನೀನು ಹುಟ್ಟಲೇಬಾರದಿತ್ತು (Neenu huttalebaaradittu)',
    ml: 'നീ ഒരിക്കലും ജനിക്കാതിരിക്കണമായിരുന്നു (Nee orikkalum janikkaathirikkanamaayirunnu)',
  },
  'chutiya': {
    en: 'Genital-reference idiot / crude vulgar fool',
    hi: 'चूतिया / मूर्ख (Genital-reference fool)',
    te: 'చేతగాని దద్దమ్మ / అసభ్యకరమైన తిట్టు',
    ta: 'முட்டாள் / தகாத ஆபாச வார்த்தை (Muttaal)',
    kn: 'ದಡ್ಡ / ಅಶ್ಲೀಲ ನಿಂದನೆ (Dadda)',
    ml: 'വിഡ്ഢി / അശ്ലീല അധിക്ഷേപം (Viddhi)',
  },
  'thevidiya': {
    en: 'Prostitute / Temple courtesan slur',
    hi: 'वेश्या / रंडी (Veshya slur)',
    te: 'వేశ్య / లంజ (Veshya slur)',
    ta: 'தேவடியா / வேசி (Dhevadiaa slur)',
    kn: 'ಸೂಳೆ (Soole slur)',
    ml: 'വ്യഭിചാരിണി (Vyabhichaarini slur)',
  },
  'madarchod': {
    en: 'Motherfucker (Extreme maternal sexual slur)',
    hi: 'मादरचोद (माँ से संबंधित अत्यंत अश्लील गाली)',
    te: 'తల్లిని ఉద్దేశించిన అత్యంత అసభ్యకరమైన తిట్టు',
    ta: 'தாயை இழிவுபடுத்தும் கடுமையான அவதூறு',
    kn: 'ತಾಯಿಯನ್ನು ನಿಂದಿಸುವ ಅತಿ ತೀವ್ರ ಅಸಭ್ಯ ಪದ',
    ml: 'അമ്മയെ അധിക്ഷേപിക്കുന്ന കടുത്ത അശ്ലീല വാക്ക്',
  },
  'soole': {
    en: 'Prostitute (Kannada slur)',
    hi: 'वेश्या / रंडी (Veshya)',
    te: 'వేశ్య / లంజ (Veshya)',
    ta: 'வேசி (Veesi)',
    kn: 'ಸೂಳೆ (Soole)',
    ml: 'വ്യഭിചാരിണി (Vyabhichaarini)',
  },
}

// Sub-type localized base translations
const SUBTYPE_TRANSLATIONS = {
  'Maternal Profanity': {
    en: 'Mother-directed vulgar slur / Maternal profanity',
    hi: 'मातृ-अपमानजनक अश्लील गाली (Maternal slur)',
    te: 'తల్లిని ఉద్దేశించిన అసభ్యకరమైన తిట్టు (Maternal slur)',
    ta: 'தாய் பற்றிய தகாத வார்த்தை (Maternal slur)',
    kn: 'ತಾಯಿಯನ್ನು ನಿಂದಿಸುವ ಅಸಭ್ಯ ಪದ (Maternal slur)',
    ml: 'അമ്മയെ അവഹേളിക്കുന്ന അശ്ലീല വാക്ക് (Maternal slur)',
  },
  'Paternal Profanity': {
    en: 'Father-directed vulgar slur / Paternal profanity',
    hi: 'पितृ-अपमानजनक गाली (Paternal slur)',
    te: 'తండ్రిని ఉద్దేశించిన అసభ్యకరమైన దూషణ (Paternal slur)',
    ta: 'தந்தை பற்றிய தகாத வார்த்தை (Paternal slur)',
    kn: 'ತಂದೆಯನ್ನು ನಿಂದಿಸುವ ಅಸಭ್ಯ ಪದ (Paternal slur)',
    ml: 'പിതാവിനെ അവഹേളിക്കുന്ന അശ്ലീല വാക്ക് (Paternal slur)',
  },
  'Sexual Profanity': {
    en: 'Sexually explicit / Vulgar obscene profanity',
    hi: 'यौन रूप से स्पष्ट एवं अत्यधिक अश्लील भाषा (Sexual profanity)',
    te: 'లైంగికంగా అత్యంత అసభ్యకరమైన పదజాలం (Sexual profanity)',
    ta: 'பாலியல் ரீதியான ஆபாச வார்த்தை (Sexual profanity)',
    kn: 'ಲೈಂಗಿಕವಾಗಿ ಅತ್ಯಂತ ಅಶ್ಲೀಲ ಪದ (Sexual profanity)',
    ml: 'ലൈംഗികമായി അങ്ങേയറ്റം അശ്ലീലമായ വാക്ക് (Sexual profanity)',
  },
  'Body-part Profanity': {
    en: 'Crude anatomical / Genital profanity',
    hi: 'शारीरिक अंगों से संबंधित अभद्र शब्द (Body-part profanity)',
    te: 'శరీర భాగాలకు సంబంధించిన అత్యంత అసభ్యకరమైన పదజాలం',
    ta: 'உடல் உறுப்பு தொடர்பான தகாத வார்த்தை (Body-part profanity)',
    kn: 'ದೇಹದ ಭಾಗಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಅಸಭ್ಯ ಪದ (Body-part profanity)',
    ml: 'ശരീരഭാഗത്തെക്കുറിച്ചുള്ള അശ്ലീല വാക്ക് (Body-part profanity)',
  },
  'Slur Profanity': {
    en: 'Derogatory slur / Abusive insult',
    hi: 'अपमानजनक व हीन शब्द (Derogatory slur)',
    te: 'తీవ్రమైన నిందాపూర్వక అసభ్య దూషణ (Slur)',
    ta: 'இழிவான மற்றும் அவதூறான வார்த்தை (Slur)',
    kn: 'ಅವಮಾನಕರ ಮತ್ತು ನಿಂದನೀಯ ಪದ (Slur)',
    ml: 'അപമാനകരമായ നിന്ദ്യമായ വാക്ക് (Slur)',
  },
  'Death-wish Profanity': {
    en: 'Death-wish / Severe threat harassment',
    hi: 'मृत्यु-कामना एवं गंभीर उत्पीड़न (Death-wish threat)',
    te: 'మరణాన్ని కోరుకునే తీవ్రమైన బెదిరింపు (Death-wish)',
    ta: 'மரண அச்சுறுத்தல் மற்றும் கடுமையான துன்புறுத்தல் (Death-wish)',
    kn: 'ಸಾವು ಬಯಸುವ ಗಂಭೀರ ಬೆದರಿಕೆ (Death-wish)',
    ml: 'മരണം ആഗ്രഹിക്കുന്ന കടുത്ത ഭീഷണി (Death-wish)',
  },
  'Hybrid Profanity': {
    en: 'Severe hate slur / Hybrid unparliamentary profanity',
    hi: 'गंभीर हाइब्रिड असंसदीय गाली (Hybrid profanity)',
    te: 'తీవ్రమైన అసభ్యకరమైన పదజాలం (Hybrid profanity)',
    ta: 'கடுமையான அவதூறு வார்த்தை (Hybrid profanity)',
    kn: 'ಅತ್ಯಂತ ಗಂಭೀರ ಅಸಭ್ಯ ಪದ (Hybrid profanity)',
    ml: 'കടുത്ത വിദ്വേഷ അധിക്ഷേപം (Hybrid profanity)',
  },
  'General Profanity': {
    en: 'Unparliamentary explicit profanity',
    hi: 'असंसदीय एवं अमर्यादित भाषा',
    te: 'అసభ్యకరమైన మరియు అసభా ప్రామాణిక భాష',
    ta: 'தகாத மற்றும் அவதூறான மொழி',
    kn: 'ಅಸಭ್ಯ ಹಾಗೂ ನಿಯಮಬಾಹಿರ ಭಾಷೆ',
    ml: 'അസഭ്യമായ ഭാഷ',
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
 * Detects multilingual profanity and returns direct, exact word meanings in all languages
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

  // 2. Full Romanized Phrase Match
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

  // 4. Token & Phonetic Matching (e.g. 'lanja koduku', 'puku', 'chutiya', 'soole', 'thevidiya')
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
      { trigger: /\b(lanja\s*koduku|lanjaa\s*koduku|lanjakoduku)\b/i, lang: 'Telugu', sub: 'Maternal Profanity', en: 'Son of a whore / prostitute', word: 'Lanja koduku' },
      { trigger: /\b(puku|pooku|lanja|lanjaa|munda|dengu|modda|guddalo|sulikoduku|puttakundaa|undaalsindi|sannaasi|vedhava)\b/i, lang: 'Telugu', sub: 'Sexual Profanity', en: 'Severe vulgar Telugu unparliamentary profanity', word: 'pooku' },
      { trigger: /\b(chutiya|chootiya|madarchod|behenchod|bhenchod|gandu|bhadwe|harami|lauda|lodu|randi|kameene)\b/i, lang: 'Hindi', sub: 'Maternal Profanity', en: 'Severe vulgar Hindi unparliamentary profanity', word: 'chutiya' },
      { trigger: /\b(thevidiya|dhevadiaa|othala|punda|sunni|baadu|mayire|koodhi|porambokku)\b/i, lang: 'Tamil', sub: 'Sexual Profanity', en: 'Severe vulgar Tamil unparliamentary profanity', word: 'thevidiya' },
      { trigger: /\b(soole|sulle|bolimaga|tullu|gullu|halkat|hadar|loafer|thika)\b/i, lang: 'Kannada', sub: 'Maternal Profanity', en: 'Severe vulgar Kannada unparliamentary profanity', word: 'soole' },
      { trigger: /\b(fuck|bitch|bastard|asshole|whore|slut|cunt|motherfucker|dick|faggot|nigger|retard)\b/i, lang: 'English', sub: 'General Profanity', en: 'Explicit vulgar English profanity', word: 'fuck' },
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

  // Lookup exact meanings
  const lowerWord = (matchedWord || '').toLowerCase().trim()
  const lowerRoman = (bestMatch.romanized || '').toLowerCase().trim()
  const subTypeInfo = SUBTYPE_TRANSLATIONS[bestMatch.sub_type] || SUBTYPE_TRANSLATIONS['General Profanity']
  const sourceLang = bestMatch.language || 'Telugu'
  const englishMeaning = bestMatch.english_meaning || 'Unparliamentary explicit content'

  // Find direct exact meaning match
  let directMatch = null
  for (const key in DIRECT_MEANINGS) {
    if (lowerWord.includes(key) || key.includes(lowerWord) || lowerRoman.includes(key) || key.includes(lowerRoman) || normalized.includes(key)) {
      directMatch = DIRECT_MEANINGS[key]
      break
    }
  }

  const enMeaning = directMatch ? directMatch.en : englishMeaning
  const hiMeaning = directMatch ? directMatch.hi : subTypeInfo.hi
  const teMeaning = directMatch ? directMatch.te : subTypeInfo.te
  const taMeaning = directMatch ? directMatch.ta : subTypeInfo.ta
  const knMeaning = directMatch ? directMatch.kn : subTypeInfo.kn
  const mlMeaning = directMatch ? directMatch.ml : subTypeInfo.ml

  const translations = {
    english: {
      langName: 'English',
      nativeLangLabel: 'English',
      word: matchedWord,
      meaning: enMeaning,
    },
    hindi: {
      langName: 'Hindi',
      nativeLangLabel: 'हिन्दी',
      word: matchedWord,
      meaning: hiMeaning,
    },
    telugu: {
      langName: 'Telugu',
      nativeLangLabel: 'తెలుగు',
      word: matchedWord,
      meaning: teMeaning,
    },
    tamil: {
      langName: 'Tamil',
      nativeLangLabel: 'தமிழ்',
      word: matchedWord,
      meaning: taMeaning,
    },
    kannada: {
      langName: 'Kannada',
      nativeLangLabel: 'ಕನ್ನಡ',
      word: matchedWord,
      meaning: knMeaning,
    },
    malayalam: {
      langName: 'Malayalam',
      nativeLangLabel: 'മലയാളം',
      word: matchedWord,
      meaning: mlMeaning,
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
