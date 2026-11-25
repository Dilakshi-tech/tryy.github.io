
/**
 * LINGO MATE - PART 17: RELATIONAL DATABASE ARCHITECTURE & CONTENT MODEL
 * Comprehensive 35-Entity Relational Data Model & State Persistence Engine
 */
const LINGO_MATE_DB_SCHEMA = {
  version: "2.0.0",
  entities: {
    Users: { primaryKey: "id", fields: ["id", "email", "passwordHash", "roleId", "createdAt", "status"] },
    Roles: { primaryKey: "id", fields: ["id", "roleName", "permissionsMask"] },
    StudentProfiles: { primaryKey: "id", foreignKey: "userId", fields: ["id", "userId", "name", "avatarId", "selectedLanguageId", "preferredExplanationLang", "xp", "streakDays"] },
    TeacherProfiles: { primaryKey: "id", foreignKey: "userId", fields: ["id", "userId", "name", "qualification", "approvedStatus"] },
    Avatars: { primaryKey: "id", fields: ["id", "imageUrl", "themeTag", "culturalStyle"] },
    Languages: { primaryKey: "id", fields: ["id", "code", "name", "nativeName", "flagIcon", "pastelTheme"] },
    EducationalCategories: { primaryKey: "id", fields: ["id", "code", "name", "description"] }, // OL, AL, BOTH, SELF, EXAM
    LearningLevels: { primaryKey: "id", fields: ["id", "languageId", "levelNumber", "title", "unlockCriteria"] },
    Lessons: { primaryKey: "id", fields: ["id", "levelId", "title", "explanationEnglish", "explanationSinhala", "explanationTamil", "sequenceOrder"] },
    Topics: { primaryKey: "id", fields: ["id", "lessonId", "name", "skillType"] },
    Vocabulary: { primaryKey: "id", fields: ["id", "languageId", "levelId", "word", "meaningEng", "meaningSin", "meaningTam", "pronunciationAudioUrl", "exampleSentence"] },
    Grammar: { primaryKey: "id", fields: ["id", "languageId", "levelId", "ruleTitle", "ruleExplanationEng", "ruleExplanationSin", "examples"] },
    Pronunciation: { primaryKey: "id", fields: ["id", "wordOrSentenceId", "audioUrl", "phoneticSpelling", "pitchGuide"] },
    ListeningResources: { primaryKey: "id", fields: ["id", "languageId", "audioUrl", "transcriptEng", "transcriptSin", "difficulty"] },
    ReadingResources: { primaryKey: "id", fields: ["id", "languageId", "title", "textBody", "comprehensionQuestionsJson"] },
    WritingResources: { primaryKey: "id", fields: ["id", "languageId", "promptText", "sampleEssay", "levelId"] },
    Quizzes: { primaryKey: "id", fields: ["id", "lessonId", "title", "passScorePercent", "xpReward"] },
    Questions: { primaryKey: "id", fields: ["id", "quizId", "questionType", "prompt", "optionsJson", "correctAnswer", "explanation"] },
    Activities: { primaryKey: "id", fields: ["id", "title", "skillType", "difficulty", "durationMins", "xpReward"] },
    MiniGames: { primaryKey: "id", fields: ["id", "gameCode", "title", "description", "iconClass"] },
    Sentences: { primaryKey: "id", fields: ["id", "languageId", "categoryId", "levelId", "targetText", "transEng", "transSin", "transTam", "grammarExplanation", "audioUrl", "status"] },
    SentenceComponents: { primaryKey: "id", foreignKey: "sentenceId", fields: ["id", "sentenceId", "chunkText", "correctSequenceIndex"] },
    Translations: { primaryKey: "id", fields: ["id", "entityType", "entityId", "langCode", "translatedText"] },
    Hints: { primaryKey: "id", foreignKey: "sentenceId", fields: ["id", "sentenceId", "level5HintType", "hintText"] },
    AudioResources: { primaryKey: "id", fields: ["id", "resourceType", "fileUrl", "durationSec", "speakerGender"] },
    DailyTasks: { primaryKey: "id", fields: ["id", "taskName", "requiredCount", "xpReward", "taskCategory"] },
    StudyGoals: { primaryKey: "id", foreignKey: "userId", fields: ["id", "userId", "dailyMinsTarget", "weeklyLessonsTarget", "streakGoalDays"] },
    
    // COMPOSITE KEY PROGRESS ENTITY (User ID + Language ID + Category ID + Level ID)
    UserProgress: {
      primaryKey: "compositeKey",
      fields: ["userId", "languageId", "categoryId", "levelId", "completedLessonsJson", "vocabLearnedCount", "accuracyPercent", "lastAccessedTimestamp"],
      getCompositeKey: (userId, langId, catId, levelId) => `${userId}_${langId}_${catId}_${levelId}`
    },
    
    QuizAttempts: { primaryKey: "id", fields: ["id", "userId", "quizId", "score", "passed", "attemptedAt"] },
    GameAttempts: { primaryKey: "id", fields: ["id", "userId", "gameId", "score", "completionTimeSec", "hintsUsedCount", "xpEarned"] },
    XPTransactions: { primaryKey: "id", fields: ["id", "userId", "amount", "sourceActivity", "timestamp"] },
    Achievements: { primaryKey: "id", fields: ["id", "code", "title", "description", "badgeIcon", "xpReward"] },
    Streaks: { primaryKey: "userId", fields: ["userId", "currentStreak", "bestStreak", "lastActiveDate"] },
    Bookmarks: { primaryKey: "id", fields: ["id", "userId", "resourceType", "resourceId", "savedAt"] },
    UserResources: { primaryKey: "id", fields: ["id", "authorUserId", "languageId", "title", "fileUrl", "status"] },
    CommunityGroups: { primaryKey: "id", fields: ["id", "languageId", "groupName", "description", "memberCount"] },
    Comments: { primaryKey: "id", fields: ["id", "postId", "authorUserId", "commentText", "createdAt"] },
    Reports: { primaryKey: "id", fields: ["id", "reportedByUserId", "contentType", "contentId", "reason", "status"] },
    Notifications: { primaryKey: "id", fields: ["id", "userId", "title", "message", "isRead", "timestamp"] },
    AuditLogs: { primaryKey: "id", fields: ["id", "adminUserId", "actionTaken", "targetEntity", "timestamp"] }
  }
};


    /* ======================================================================
       1. CURRICULUM & LINGUISTIC DATASET (5 LANGUAGES x 3 SUPPORT LANGUAGES)
       ====================================================================== */
    const SUPPORT_UI = {
      en: {
        name: `English (UK)`,
        lblSupport: `Explanation & gloss language`,
        lblPathway: `Study pathway & level`,
        tagline: `Structured GCE O/L, GCE A/L, and independent pathways with Sinhala, Tamil, and English guidance.`,
        contextNoteTitle: `Contextual Note`,
        correctLabel: `Correct`,
        reviewLabel: `Needs review`,
        hearBtn: `Listen`,
        slowBtn: `Slow 0.75×`,
        markMastered: `Mark card practised (+15 XP)`,
        nextItem: `Next item`,
        prevItem: `Previous`
      },
      si: {
        name: `සිංහල`,
        lblSupport: `පැහැදිලි කිරීමේ භාෂාව (Explanation)`,
        lblPathway: `අධ්‍යයන මාර්ගය සහ මට්ටම`,
        tagline: `ශ්‍රී ලංකා අ.පො.ස. සා/පෙළ, උ/පෙළ සහ ස්වාධීන ඉගෙනුම් සඳහා සිංහල, දෙමළ සහ ඉංග්‍රීසි මඟපෙන්වීම.`,
        contextNoteTitle: `සිංහල පැහැදිලි කිරීම`,
        correctLabel: `නිවැරදියි`,
        reviewLabel: `නැවත පරීක්ෂා කරන්න`,
        hearBtn: `උච්චාරණය අසන්න`,
        slowBtn: `සෙමින් 0.75×`,
        markMastered: `පුහුණු කළා (+15 XP)`,
        nextItem: `ඊළඟ`,
        prevItem: `පෙර`
      },
      ta: {
        name: `தமிழ்`,
        lblSupport: `விளக்க மொழி (Explanation)`,
        lblPathway: `கற்றல் பாதை மற்றும் நிலை`,
        tagline: `இலங்கை க.பொ.த சாதாரண தர, உயர்தர மற்றும் சுயாதீன கற்கைக்கான தமிழ், சிங்களம், ஆங்கில வழிகாட்டல்.`,
        contextNoteTitle: `தமிழ் விளக்கம்`,
        correctLabel: `சரியானது`,
        reviewLabel: `மீளாய்வு செய்க`,
        hearBtn: `உச்சரிப்பைக் கேள்`,
        slowBtn: `மெதுவாக 0.75×`,
        markMastered: `பயிற்சி முடிந்தது (+15 XP)`,
        nextItem: `அடுத்து`,
        prevItem: `முந்தைய`
      }
    };

    const PATHWAYS = {
      'ol': {
        label: `GCE O/L Pathway`,
        short: `GCE O/L`,
        desc: `Department of Examinations Sri Lanka — Optional Foreign Language (Grades 10–11): everyday communication, guided comprehension, short essays, and dialogue.`,
        tier: 2
      },
      'al': {
        label: `GCE A/L Pathway`,
        short: `GCE A/L`,
        desc: `Sri Lanka Advanced Level Languages Stream (Grades 12–13): analytical reading, advanced syntax, formal composition, translation, and cultural fluency.`,
        tier: 3
      },
      'ind-beg': {
        label: `Independent — Absolute Beginner`,
        short: `A1 / Foundation`,
        desc: `Foundational scripts, core pronunciation, greetings, and survival phrasing for self-paced beginners.`,
        tier: 1
      },
      'ind-int': {
        label: `Independent — Intermediate`,
        short: `B1–B2`,
        desc: `Conversational independence, past and future expression, and workplace/university readiness.`,
        tier: 2
      },
      'ind-adv': {
        label: `Independent — Advanced / Professional`,
        short: `C1 / Professional`,
        desc: `Nuanced register, formal argumentation, and professional proficiency across international exams.`,
        tier: 3
      }
    };

    const LANGUAGES = {
      fr: {
        id: `fr`,
        name: `French`,
        native: `Français`,
        code: `FR`,
        bcp47: `fr-FR`,
        swatchClass: `swatch-fr`,
        intlExam: `DELF / DALF (A1–C1)`,
        olFocus: `O/L Paper I & II: Passé composé, articles, school/family dialogues, and 100-word guided composition.`,
        alFocus: `A/L Paper I & II: Subjunctive mood, literary comprehension, formal letters, and French–English/Sinhala/Tamil translation.`,
        accents: [`é`, `è`, `ê`, `ë`, `à`, `â`, `ç`, `ù`, `û`, `ô`, `î`, `œ`],
        vocab: [
          {
            word: `La bibliothèque scolaire`,
            phonetic: `/la bi.bli.ɔ.tɛk skɔ.lɛʁ/`,
            pos: `Noun phrase (fem.)`,
            level: `O/L Core · A1`,
            context: `J’étudie le français à la bibliothèque scolaire après les cours.`,
            trans: {
              en: `The school library — “I study French at the school library after classes.”`,
              si: `පාසල් පුස්තකාලය — “මම පන්තිවලින් පසු පාසල් පුස්තකාලයේදී ප්‍රංශ භාෂාව ඉගෙන ගනිමි.”`,
              ta: `பள்ளி நூலகம் — “வகுப்புகளுக்குப் பிறகு பள்ளி நூலகத்தில் பிரெஞ்சு படிக்கிறேன்.”`
            },
            tip: {
              en: `Notice “à la” stays uncontracted before feminine singular nouns starting with a consonant.`,
              si: `ස්ත්‍රී ලිංග ඒකවචන නාම පදයකට පෙර “à la” වෙනස් නොවී පවතී.`,
              ta: `பெண்பால் ஒருமைப் பெயர்ச்சொல்லுக்கு முன் “à la” மாறாமல் இருக்கும்.`
            }
          },
          {
            word: `Préparer un examen`,
            phonetic: `/pʁe.pa.ʁe œ̃.n‿ɛɡ.za.mɛ̃/`,
            pos: `Verb phrase`,
            level: `O/L & A/L · A2`,
            context: `Nous préparons ensemble l’examen national de fin d’année.`,
            trans: {
              en: `To prepare for an exam — “We are preparing together for the national end-of-year examination.”`,
              si: `විභාගයකට සූදානම් වීම — “අපි වසර අවසාන ජාතික විභාගයට එක්ව සූදානම් වෙමු.”`,
              ta: `தேர்வுக்குத் தயாராதல் — “ஆண்டு இறுதி தேசியத் தேர்வுக்கு நாம் ஒன்றாகத் தயாராகிறோம்.”`
            },
            tip: {
              en: `Unlike English “prepare for”, French “préparer” takes a direct object without “pour”.`,
              si: `ඉංග්‍රීසියෙන් “prepare for” යැයි කීවද, ප්‍රංශ භාෂාවේ “préparer” සඳහා “pour” නොයෙදේ.`,
              ta: `ஆங்கிலத்தில் “prepare for” என்றாலும், பிரெஞ்சில் “préparer” நேரடிச் செயப்படுபொருளை ஏற்கும்.`
            }
          },
          {
            word: `Cependant / Néanmoins`,
            phonetic: `/sə.pɑ̃.dɑ̃/ · /ne.ɑ̃.mwɛ̃/`,
            pos: `Discourse connector`,
            level: `A/L & DELF B2`,
            context: `Le trajet est long ; cependant, l’université offre une excellente formation.`,
            trans: {
              en: `However / Nevertheless — “The journey is long; however, the university offers excellent training.”`,
              si: `කෙසේ වෙතත් — “ගමන දිගු ය; කෙසේ වෙතත්, විශ්වවිද්‍යාලය විශිෂ්ට පුහුණුවක් ලබා දෙයි.”`,
              ta: `இருப்பினும் — “பயணம் நீளமானது; இருப்பினும், பல்கலைக்கழகம் சிறந்த பயிற்சியை வழங்குகிறது.”`
            },
            tip: {
              en: `High-scoring essay connector for GCE A/L and DELF B1–B2 argumentative tasks.`,
              si: `අ.පො.ස. උ/පෙළ සහ DELF B1–B2 රචනා සඳහා ඉතා ප්‍රයෝජනවත් සම්බන්ධක පදයකි.`,
              ta: `க.பொ.த உயர்தரம் மற்றும் DELF B1–B2 கட்டுரைகளில் மதிப்பெண் உயர்த்தும் இணைப்புச்சொல்.`
            }
          },
          {
            word: `Prendre le train`,
            phonetic: `/pʁɑ̃dʁ lə tʁɛ̃/`,
            pos: `Expression`,
            level: `O/L Core · A1`,
            context: `Le matin, je prends le train de Colombo à Kandy avec mes camarades.`,
            trans: {
              en: `To take the train — “In the morning, I take the train from Colombo to Kandy with my classmates.”`,
              si: `දුම්රියෙන් යාම — “උදෑසන මම මගේ මිතුරන් සමඟ කොළඹ සිට මහනුවරට දුම්රියෙන් යමි.”`,
              ta: `ரயிலில் பயணித்தல் — “காலையில் நண்பர்களுடன் கொழும்பிலிருந்து கண்டிக்கு ரயிலில் செல்கிறேன்.”`
            },
            tip: {
              en: `“Prendre” is irregular in plural forms: nous prenons, vous prenez, ils prennent.`,
              si: `“Prendre” බහුවචන රූප අනියමිත වේ: nous prenons, vous prenez, ils prennent.`,
              ta: `“Prendre” பன்மை வடிவங்கள்: nous prenons, vous prenez, ils prennent.`
            }
          }
        ],
        grammar: [
          {
            title: `Passé composé with avoir vs. être`,
            prompt: `Choose the correct auxiliary and past participle for: “Yesterday, Kavindi went to the library.”`,
            examples: [`Hier, Kavindi ___ à la bibliothèque.`],
            rule: {
              en: `Verbs of movement and change of state (aller, venir, arriver, partir) take “être” in the passé composé, and the past participle agrees in gender and number with the subject (-e for feminine).`,
              si: `ගමනාගමනය දක්වන ක්‍රියාපද (aller, venir, partir) සඳහා “être” උපකාරක ක්‍රියාව යෙදෙන අතර, කර්තෘ ස්ත්‍රී ලිංග නම් ක්‍රියා පදය අගට “-e” එක් වේ.`,
              ta: `இயக்க வினைச்சொற்களுக்கு (aller, venir, partir) “être” துணைவினை வரும்; எழுவாய் பெண்பாலாக இருந்தால் “-e” சேரும்.`
            },
            options: [
              `est allée`,
              `a allé`,
              `est allé`,
              `avez allée`
            ],
            correct: 0,
            explanations: [
              `Correct: “aller” uses “être”, and because Kavindi is feminine singular, “allé” takes an extra “-e” → “est allée”.`,
              `“Aller” is an être-verb of motion, so “avoir” (a allé) is incorrect here.`,
              `Right auxiliary “est”, but missing feminine agreement “-e” for Kavindi.`,
              `“Avez” belongs to “vous”, not third-person singular Kavindi.`
            ],
            siFeedback: `“Aller” සමඟ “être” යෙදේ. කවින්දි ස්ත්‍රී ලිංග බැවින් “allée” ලෙස -e එකතු වේ.`,
            ta: `“Aller” உடன் “être” வரும்; கவிந்தி பெண்பால் என்பதால் “est allée” சரியாகும்.`
          },
          {
            title: `Partitive articles (du, de la, de l’, des)`,
            prompt: `Complete the sentence: “In Sri Lanka, we drink ___ tea every morning.”`,
            examples: [`Au Sri Lanka, nous buvons ___ thé chaque matin.`],
            rule: {
              en: `Use partitive articles for uncountable quantities (“some tea”): “du” before masculine singular nouns starting with a consonant (le thé → du thé), and “de” after negation (ne... pas de thé).`,
              si: `ගණන් කළ නොහැකි ද්‍රව්‍ය සඳහා පුරුෂ ලිංග ඒකවචන පද ඉදිරියේ “du” (de + le) යෙදේ. නැත යන අර්ථයේදී “de” පමණක් යෙදේ.`,
              ta: `எண்ண முடியாத பொருட்களுக்கு ஆண்பால் ஒருமை முன் “du” வரும்; எதிர்மறையில் “de” மட்டுமே வரும்.`
            },
            options: [`du`, `de la`, `des`, `un`],
            correct: 0,
            explanations: [
              `Correct: “thé” is masculine singular (“le thé”), so “de + le” contracts to “du thé”.`,
              `“de la” is for feminine singular nouns like “de la confiture”.`,
              `“des” is used for plural countable nouns.`,
              `“un thé” means a single ordered cup, whereas habitual uncountable tea takes “du thé”.`
            ],
            siFeedback: `“Thé” පුරුෂ ලිංග නාම පදයක් බැවින් “du thé” නිවැරදියි.`,
            ta: `“Thé” ஆண்பால் பெயர்ச்சொல் என்பதால் “du thé” சரியானது.`
          }
        ],
        reading: {
          title: `Une journée d’études à Galle`,
          level: `GCE O/L & DELF A2`,
          segments: [
            { text: `Chaque samedi matin, Nimal `, gloss: null },
            { text: `se réveille`, gloss: { en: `wakes up (reflexive verb)`, si: `අවදි වේ`, ta: `விழிக்கிறார்` } },
            { text: ` à six heures pour réviser son vocabulaire français. `, gloss: null },
            { text: `Ensuite`, gloss: { en: `Then / Afterwards`, si: `ඉන්පසුව`, ta: `பின்னர்` } },
            { text: `, il retrouve ses amies au centre culturel près du fort de Galle. `, gloss: null },
            { text: `Bien qu’il fasse chaud`, gloss: { en: `Although the weather is warm`, si: `උණුසුම් කාලගුණයක් තිබුණද`, ta: `வெப்பமாக இருந்தாலும்` } },
            { text: `, le groupe lit un court article et `, gloss: null },
            { text: `échange des idées`, gloss: { en: `exchanges ideas`, si: `අදහස් හුවමාරු කර ගනී`, ta: `கருத்துக்களைப் பரிமாறுகிறார்கள்` } },
            { text: ` pendant quarante minutes.`, gloss: null }
          ],
          question: `Why does Nimal meet his friends at the cultural centre?`,
          options: [
            `To read a short article and exchange ideas in French`,
            `To buy textbooks for Mathematics`,
            `Because the school is closed on Mondays`,
            `To watch a football match in the evening`
          ],
          correct: 0,
          explain: {
            en: `The final sentence states: “le groupe lit un court article et échange des idées pendant quarante minutes.”`,
            si: `අවසන් වාක්‍යයේ සඳහන් වන්නේ ඔවුන් කෙටි ලිපියක් කියවා මිනිත්තු 40ක් අදහස් හුවමාරු කර ගන්නා බවයි.`,
            ta: `இறுதி வாக்கியத்தில் அவர்கள் ஒரு சிறு கட்டுரையைப் படித்து 40 நிமிடங்கள் கருத்துக்களைப் பரிமாறுவதாகக் கூறப்பட்டுள்ளது.`
          }
        },
        writing: {
          type: `text`,
          prompt: {
            en: `Write 2–3 French sentences introducing yourself as a Sri Lankan student and stating which exam you are preparing for (include words like “je”, “Sri Lanka”, “français”, or “examen”).`,
            si: `ශ්‍රී ලාංකික ශිෂ්‍යයෙකු ලෙස ඔබව හඳුන්වා දෙමින් සහ ඔබ සූදානම් වන විභාගය සඳහන් කරමින් ප්‍රංශ වාක්‍ය 2–3ක් ලියන්න.`,
            ta: `இலங்கை மாணவராக உங்களை அறிமுகப்படுத்தி, நீங்கள் தயாராகும் தேர்வைக் குறிப்பிடும் 2–3 பிரெஞ்சு வாக்கியங்களை எழுதுங்கள்.`
          },
          model: `Bonjour ! Je m’appelle Amaya et j’habite au Sri Lanka. J’étudie le français pour l’examen O/L.`,
          keywords: [`je`, `français`, `sri lanka`, `étudie`, `examen`, `appelle`, `habite`]
        },
        listening: [
          {
            speaker: `Teacher (Mme Perera)`,
            target: `Bonjour la classe ! Ouvrez vos cahiers à la page douze, s’il vous plaît.`,
            trans: {
              en: `Hello class! Please open your exercise books to page twelve.`,
              si: `සුබ උදෑසනක් පන්තිය! කරුණාකර ඔබේ අභ්‍යාස පොත් 12 වන පිටුවට පෙරළන්න.`,
              ta: `வணக்கம் வகுப்பினரே! தயவுசெய்து உங்கள் பயிற்சிப் புத்தகத்தில் 12ஆம் பக்கத்தைத் திறவுங்கள்.`
            },
            question: `Which page number did the teacher ask you to open?`,
            options: [`Page 12 (douze)`, `Page 20 (vingt)`, `Page 2 (deux)`, `Page 10 (dix)`],
            correct: 0
          },
          {
            speaker: `Peer Dialogue`,
            target: `À quelle heure commence le cours de français ? Il commence à huit heures et demie.`,
            trans: {
              en: `What time does the French class start? It starts at half past eight.`,
              si: `ප්‍රංශ පන්තිය ආරම්භ වන්නේ කීයටද? එය උදේ 8:30ට ආරම්භ වේ.`,
              ta: `பிரெஞ்சு வகுப்பு எத்தனை மணிக்குத் தொடங்குகிறது? அது 8:30 மணிக்குத் தொடங்குகிறது.`
            },
            question: `When does the French class begin?`,
            options: [`8:30`, `8:00`, `9:30`, `7:30`],
            correct: 0
          }
        ],
        speaking: {
          phrase: `Je voudrais améliorer mon français pour mes études.`,
          phonetic: `/ʒə vu.dʁɛ a.me.ljɔ.ʁe mɔ̃ fʁɑ̃.sɛ puʁ me.z‿e.tyd/`,
          meaning: {
            en: `I would like to improve my French for my studies.`,
            si: `මගේ අධ්‍යයන කටයුතු සඳහා මගේ ප්‍රංශ භාෂා දැනුම දියුණු කර ගැනීමට මම කැමතියි.`,
            ta: `எனது கல்விக்காக எனது பிரெஞ்சு மொழியை மேம்படுத்த விரும்புகிறேன்.`
          },
          pronunciationTip: {
            en: `Keep “mon” nasal without pronouncing a hard “n”, and link “mes études” smoothly with a /z/ liaison.`,
            si: `“mon” යන පදයේ අවසන් “n” ශබ්දය තදින් උච්චාරණය නොකර නාසික්‍යව උච්චාරණය කරන්න. “mes études” සම්බන්ධ කර /z/ ශබ්දයෙන් කියන්න.`,
            ta: `“mon” என்பதில் இறுதி “n” ஐ அழுத்தாமல் மூக்கொலியாக உச்சரிக்கவும். “mes études” ஐ /z/ ஒலியுடன் இணைத்துப் படிக்கவும்.`
          }
        },
        examQuestions: [
          {
            tier: 1,
            skill: `Vocabulary`,
            q: `Select the appropriate polite French greeting used when entering a classroom in the morning:`,
            options: [`Bonjour, Madame.`, `Bonne nuit, Madame.`, `À bientôt, Madame.`, `Merci beaucoup.`],
            correct: 0,
            explain: {
              en: `“Bonjour” is used throughout the day from morning until early evening; “Bonne nuit” is only for bedtime.`,
              si: `දහවල් කාලයේ පන්තියට ඇතුළු වන විට “Bonjour” භාවිතා වේ. “Bonne nuit” රාත්‍රී නින්දට යන විට පමණි.`,
              ta: `காலை மற்றும் பகல் வேளையில் “Bonjour” பயன்படுத்தப்படும்; “Bonne nuit” இரவு தூங்கச் செல்லும்போது மட்டுமே.`
            }
          },
          {
            tier: 2,
            skill: `Grammar (O/L)`,
            q: `Choose the grammatically accurate negative form of “J’ai des devoirs aujourd’hui.”`,
            options: [`Je n’ai pas de devoirs aujourd’hui.`, `Je n’ai pas des devoirs aujourd’hui.`, `Je ne pas ai de devoirs.`, `Je n’ai aucun des devoirs.`],
            correct: 0,
            explain: {
              en: `In negative sentences with “ne... pas”, indefinite and partitive articles (un, une, des, du, de la) change to “de / d’”.`,
              si: `“ne... pas” නැත යන ආකාරයේදී “des” යන්න “de” බවට පත් වේ.`,
              ta: `“ne... pas” எதிர்மறை வாக்கியத்தில் “des” என்பது “de” ஆக மாறும்.`
            }
          },
          {
            tier: 3,
            skill: `Grammar (A/L & DELF B2)`,
            q: `Which verb form follows “Il faut que” (expressing necessity)? — “Il faut que nous ___ régulièrement.”`,
            options: [`étudiions`, `étudions`, `étudierons`, `étudiaient`],
            correct: 0,
            explain: {
              en: `“Il faut que” triggers the present subjunctive. For “nous”, -ier verbs keep both i’s: “étudiions”.`,
              si: `“Il faut que” සමඟ Subjunctive ආකාරය යෙදේ. එබැවින් “nous étudiions” නිවැරදියි.`,
              ta: `“Il faut que” உடன் Subjunctive வடிவம் வரும்; எனவே “étudiions” சரியானது.`
            }
          },
          {
            tier: 2,
            skill: `Pragmatics`,
            q: `In a GCE O/L formal letter to a French principal, how should you close the letter?`,
            options: [`Je vous prie d’agréer mes salutations distinguées.`, `Bisous à plus !`, `Salut mon pote !`, `À demain soir.`],
            correct: 0,
            explain: {
              en: `Formal French correspondence requires polite closing formulas such as “Je vous prie d’agréer mes salutations distinguées.”`,
              si: `විධිමත් ලිපියක් අවසන් කිරීමේදී ගෞරවනීය ප්‍රංශ වාක්‍ය ඛණ්ඩය වන්නේ “Je vous prie d’agréer mes salutations distinguées” යන්නයි.`,
              ta: `அதிகாரப்பூர்வ கடிதத்தின் முடிவில் “Je vous prie d’agréer mes salutations distinguées” என முடிக்க வேண்டும்.`
            }
          }
        ]
      },

      de: {
        id: `de`,
        name: `German`,
        native: `Deutsch`,
        code: `DE`,
        bcp47: `de-DE`,
        swatchClass: `swatch-de`,
        intlExam: `Goethe-Zertifikat (A1–C1)`,
        olFocus: `O/L Paper I & II: Verb-second (V2) word order, modal verbs, nominative/accusative cases, and daily-life dialogues.`,
        alFocus: `A/L Paper I & II: Subordinate clauses (weil/obwohl), Konjunktiv II, passive voice, and formal essay writing.`,
        accents: [`ä`, `ö`, `ü`, `ß`, `Ä`, `Ö`, `Ü`],
        vocab: [
          {
            word: `Die Fremdsprache`,
            phonetic: `/diː ˈfʁɛmtˌʃpʁaːxə/`,
            pos: `Noun (fem., pl. -n)`,
            level: `O/L Core · A1`,
            context: `Deutsch ist eine beliebte Fremdsprache an vielen Schulen in Sri Lanka.`,
            trans: {
              en: `The foreign language — “German is a popular foreign language at many schools in Sri Lanka.”`,
              si: `විදේශ භාෂාව — “ජර්මන් භාෂාව ශ්‍රී ලංකාවේ බොහෝ පාසල්වල ජනප්‍රිය විදේශ භාෂාවකි.”`,
              ta: `வெளிநாட்டு மொழி — “இலங்கையின் பல பாடசாலைகளில் ஜெர்மன் ஒரு பிரபலமான வெளிநாட்டு மொழியாகும்.”`
            },
            tip: {
              en: `All German nouns are capitalised regardless of where they appear in a sentence.`,
              si: `ජර්මන් භාෂාවේ සියලුම නාම පද වාක්‍යයේ කොතැනක යෙදුණද කැපිටල් අකුරෙන් ආරම්භ වේ.`,
              ta: `ஜெர்மன் மொழியில் எல்லாப் பெயர்ச்சொற்களும் பெரிய எழுத்தில் (Capital letter) தொடங்கும்.`
            }
          },
          {
            word: `Sich vorbereiten auf`,
            phonetic: `/zɪç ˈfoːɐ̯bəˌʁaɪ̯tn̩ aʊ̯f/`,
            pos: `Separable reflexive verb`,
            level: `O/L & Goethe A2`,
            context: `Ich bereite mich sorgfältig auf die Deutschprüfung vor.`,
            trans: {
              en: `To prepare oneself for — “I am preparing myself carefully for the German exam.”`,
              si: `සූදානම් වීම — “මම ජර්මන් විභාගය සඳහා සැලකිල්ලෙන් සූදානම් වෙමි.”`,
              ta: `தயாராதல் — “நான் ஜெர்மன் தேர்வுக்காகக் கவனமாகத் தயாராகிறேன்.”`
            },
            tip: {
              en: `Notice the separable prefix “vor” moves to the very end of the main clause!`,
              si: `වෙන් කළ හැකි උපසර්ගය (“vor”) ප්‍රධාන වාක්‍යයේ අවසානයට ගමන් කරයි.`,
              ta: `பிரித்தெடுக்கக்கூடிய முன்னொட்டு (“vor”) வாக்கியத்தின் இறுதிக்குச் செல்லும்.`
            }
          },
          {
            word: `Obwohl`,
            phonetic: `/ɔpˈvoːl/`,
            pos: `Subordinating conjunction`,
            level: `A/L & Goethe B1–B2`,
            context: `Obwohl der Test schwierig war, haben alle Schüler gut gearbeitet.`,
            trans: {
              en: `Although — “Although the test was difficult, all students worked well.”`,
              si: `එසේ වුවද / වුවත් — “පරීක්ෂණය අපහසු වුවද, සියලුම සිසුන් හොඳින් කටයුතු කළහ.”`,
              ta: `ஆயினும் / இருந்தபோதிலும் — “தேர்வு கடினமாக இருந்தபோதிலும், எல்லா மாணவர்களும் நன்றாகச் செய்தனர்.”`
            },
            tip: {
              en: `“Obwohl” sends the conjugated verb (“war”) to the end of its subordinate clause.`,
              si: `“Obwohl” යෙදුණු විට අදාළ උප වාක්‍යයේ ක්‍රියාපදය (“war”) අවසානයට යයි.`,
              ta: `“Obwohl” வரும்போது துணை வாக்கியத்தின் வினைச்சொல் (“war”) இறுதியில் வரும்.`
            }
          }
        ],
        grammar: [
          {
            title: `Verb-Second (V2) Rule with Time Expressions`,
            prompt: `Place the words in proper German main-clause order: “Today I am learning vocabulary.”`,
            examples: [`Heute ___ ich neue Wörter.`],
            rule: {
              en: `In German statements, the conjugated verb always occupies Position 2. When a time adverb (“Heute”) takes Position 1, the subject (“ich”) moves to Position 3 right after the verb.`,
              si: `ජර්මන් ප්‍රකාශන වාක්‍යවල වරනැගූ ක්‍රියාපදය සැමවිටම 2 වන ස්ථානයේ පවතී. “Heute” 1 වන ස්ථානයට පැමිණි විට කර්තෘ (“ich”) ක්‍රියාපදයට පසුව යෙදේ.`,
              ta: `ஜெர்மன் வாக்கியங்களில் வினைச்சொல் எப்போதும் 2வது இடத்தில் இருக்கும். “Heute” முதலில் வந்தால் எழுவாய் (“ich”) வினைக்குப் பின் செல்லும்.`
            },
            options: [`lerne`, `ich lerne`, `lernen`, `lernt`],
            correct: 0,
            explanations: [
              `Correct: “Heute (1) lerne (2) ich (3) neue Wörter.” keeps the finite verb in Position 2.`,
              `Putting “ich lerne” after “Heute” places the verb in Position 3, which violates V2.`,
              `Infinitive “lernen” does not match the singular subject “ich”.`,
              `“lernt” is the ending for er/sie/es or ihr, not “ich”.`
            ],
            siFeedback: `වාක්‍යයේ 2 වන ස්ථානයේ ක්‍රියාපදය තිබිය යුතු බැවින් “Heute lerne ich...” නිවැරදියි.`,
            ta: `வினைச்சொல் 2வது இடத்தில் இருக்க வேண்டும் என்பதால் “Heute lerne ich...” சரியாகும்.`
          },
          {
            title: `Accusative Case (Direct Object)`,
            prompt: `Choose the right article for masculine “der Kugelschreiber” (the pen): “Ich habe ___ Kugelschreiber.”`,
            examples: [`Ich suche ___ neuen Kugelschreiber.`],
            rule: {
              en: `Masculine singular nouns change “der → den” and “ein → einen” in the accusative case (direct object). Feminine, neuter, and plural articles stay unchanged.`,
              si: `පුරුෂ ලිංග ඒකවචන නාම පද කර්ම කාරකයේදී (Accusative) “der → den” සහ “ein → einen” ලෙස වෙනස් වේ.`,
              ta: `ஆண்பால் ஒருமைப் பெயர்ச்சொல் செயப்படுபொருள் வேற்றுமையில் (Accusative) “der → den”, “ein → einen” என மாறும்.`
            },
            options: [`einen`, `ein`, `einem`, `einer`],
            correct: 0,
            explanations: [
              `Correct: “Kugelschreiber” is masculine, and “suchen” takes the accusative → “einen”.`,
              `“ein” is nominative masculine (used for subjects, not direct objects).`,
              `“einem” is dative case.`,
              `“einer” is dative/genitive feminine.`
            ],
            siFeedback: `“Kugelschreiber” පුරුෂ ලිංග නාම පදයක් නිසා Accusative හිදී “einen” යෙදේ.`,
            ta: `“Kugelschreiber” ஆண்பால் என்பதால் Accusative இல் “einen” வரும்.`
          }
        ],
        reading: {
          title: `Austauschprojekt zwischen Colombo und Berlin`,
          level: `GCE O/L & Goethe A2`,
          segments: [
            { text: `Unsere Schule in Colombo organisiert `, gloss: null },
            { text: `dieses Semester`, gloss: { en: `this term / semester`, si: `මෙම වාරයේදී`, ta: `இந்தப் பருவத்தில்` } },
            { text: ` ein digitales Projekt mit einer Partnerschule in Berlin. `, gloss: null },
            { text: `Jeden Mittwoch`, gloss: { en: `Every Wednesday`, si: `සෑම බදාදා දිනකම`, ta: `ஒவ்வொரு புதன்கிழமையும்` } },
            { text: ` schreiben die Schülerinnen und Schüler kurze Berichte über `, gloss: null },
            { text: `den Alltag`, gloss: { en: `everyday life`, si: `දෛනික ජීවිතය`, ta: `அன்றாட வாழ்க்கை` } },
            { text: ` in Sri Lanka und erhalten hilfreiche Kommentare auf Deutsch.`, gloss: null }
          ],
          question: `How do the Sri Lankan and Berlin students collaborate each Wednesday?`,
          options: [
            `Sri Lankan students write short reports about daily life and receive German feedback`,
            `They travel to Berlin by plane every week`,
            `They only study Science experiments in English`,
            `They take a final oral exam every Wednesday`
          ],
          correct: 0,
          explain: {
            en: `The passage says students write short reports on daily life in Sri Lanka (“kurze Berichte über den Alltag”) and receive helpful comments in German.`,
            si: `සිසුන් ශ්‍රී ලංකාවේ දෛනික ජීවිතය ගැන කෙටි වාර්තා ලියා ජර්මන් භාෂාවෙන් අදහස් ලබා ගන්නා බව සඳහන් වේ.`,
            ta: `மாணவர்கள் இலங்கையின் அன்றாட வாழ்க்கை பற்றிச் சிறு அறிக்கைகளை எழுதி ஜெர்மன் மொழியில் கருத்துகளைப் பெறுகிறார்கள்.`
          }
        },
        writing: {
          type: `text`,
          prompt: {
            en: `Write 2 German sentences describing what you are learning for your O/L, A/L, or Goethe exam (include words like “ich”, “lerne”, “Deutsch”, or “Prüfung”).`,
            si: `ඔබගේ විභාගය සඳහා ඔබ ඉගෙන ගන්නා දේ විස්තර කරමින් ජර්මන් වාක්‍ය 2ක් ලියන්න.`,
            ta: `உங்கள் தேர்வுக்காக நீங்கள் கற்பதை விவரிக்கும் 2 ஜெர்மன் வாக்கியங்களை எழுதுங்கள்.`
          },
          model: `Ich heiße Dilshan und wohne in Kandy. Ich lerne Deutsch für meine O/L-Prüfung.`,
          keywords: [`ich`, `lerne`, `deutsch`, `heiße`, `wohne`, `prüfung`, `schule`]
        },
        listening: [
          {
            speaker: `Bahnhof Ansage`,
            target: `Der Zug nach Kandy fährt heute um neun Uhr zwanzig von Gleis vier ab.`,
            trans: {
              en: `The train to Kandy departs today at nine twenty from platform four.`,
              si: `මහනුවර බලා යන දුම්රිය අද 9:20ට 4 වන වේදිකාවෙන් පිටත් වේ.`,
              ta: `கண்டி செல்லும் ரயில் இன்று 9:20 மணிக்கு நடைமேடை நான்கிலிருந்து புறப்படுகிறது.`
            },
            question: `From which platform does the train depart?`,
            options: [`Platform 4 (Gleis vier)`, `Platform 9 (Gleis neun)`, `Platform 2 (Gleis zwei)`, `Platform 10`],
            correct: 0
          },
          {
            speaker: `Classroom Dialogue`,
            target: `Kannst du mir bitte das Wörterbuch geben? Ja, natürlich, hier bitte!`,
            trans: {
              en: `Could you please pass me the dictionary? Yes, of course, here you go!`,
              si: `කරුණාකර මට ශබ්දකෝෂය දෙන්න පුළුවන්ද? ඔව්, ඇත්තෙන්ම, මෙන්න!`,
              ta: `தயவுசெய்து எனக்கு அகராதியைத் தர முடியுமா? ஆம், நிச்சயமாக, இதோ!`
            },
            question: `What object did the speaker ask for?`,
            options: [`The dictionary (das Wörterbuch)`, `The notebook (das Heft)`, `The pen`, `The train ticket`],
            correct: 0
          }
        ],
        speaking: {
          phrase: `Könnten Sie das bitte etwas langsamer wiederholen?`,
          phonetic: `/ˈkœntn̩ ziː das ˈbɪtə ˈɛtvas ˈlaŋzaːmɐ viːdɐˈhoːlən/`,
          meaning: {
            en: `Could you please repeat that a little more slowly?`,
            si: `කරුණාකර ඔබට එය මදක් සෙමින් නැවත කියන්න පුළුවන්ද?`,
            ta: `தயவுசெய்து அதைச் சற்று மெதுவாக மீண்டும் சொல்ல முடியுமா?`
          },
          pronunciationTip: {
            en: `Round your lips as if saying “oo” while pronouncing “ee” to produce a clean German “ö” in “Könnten”.`,
            si: `“Könnten” හි “ö” ශබ්දය උච්චාරණය කිරීමට තොල් වටකුරු කර “එ” ශබ්දයට සමානව පවසන්න.`,
            ta: `“Könnten” என்பதில் “ö” ஒலியைப் பெற உதடுகளை வட்டமாக்கி உச்சரிக்கவும்.`
          }
        },
        examQuestions: [
          {
            tier: 1,
            skill: `Grammar`,
            q: `Which pronoun matches the formal address in German when speaking to a teacher or examiner?`,
            options: [`Sie`, `du`, `ihr`, `wir`],
            correct: 0,
            explain: {
              en: `Formal “Sie” (always capitalised) is required with teachers, examiners, and unfamiliar adults.`,
              si: `ගුරුවරුන් සහ පරීක්ෂකවරුන් සමඟ ගෞරවනීයව කතා කිරීමේදී සැමවිටම කැපිටල් “Sie” යෙදේ.`,
              ta: `ஆசிரியர்கள் மற்றும் தேர்வாளர்களுடன் மரியாதையாகப் பேச “Sie” (பெரிய S) பயன்படுத்தப்படும்.`
            }
          },
          {
            tier: 2,
            skill: `Grammar (O/L)`,
            q: `Choose the correct sentence using the modal verb “müssen”:`,
            options: [`Wir müssen heute viel lernen.`, `Wir müssen heute viel zu lernen.`, `Wir muss heute viel lernen.`, `Wir heute müssen lernen viel.`],
            correct: 0,
            explain: {
              en: `German modal verbs (“müssen”) take an infinitive at the end of the clause without “zu”.`,
              si: `“müssen” වැනි modal ක්‍රියාපද සමඟ වාක්‍යය අවසානයේ මූල ක්‍රියාපදය “zu” නොමැතිව යෙදේ.`,
              ta: `“müssen” போன்ற துணைவினைகளுடன் “zu” இல்லாமல் மூல வினைச்சொல் இறுதியில் வரும்.`
            }
          },
          {
            tier: 3,
            skill: `Syntax (A/L & B1)`,
            q: `Complete the subordinate clause: “Ich lerne Deutsch, weil ich in Deutschland ___.”`,
            options: [`studieren möchte`, `möchte studieren`, `studiere möchte`, `möchten studieren`],
            correct: 0,
            explain: {
              en: `After “weil”, the conjugated modal verb (“möchte”) moves to the very end, behind the infinitive (“studieren”).`,
              si: `“weil” නිපාතයෙන් පසු වරනැගූ modal ක්‍රියාව (“möchte”) අවසානයේ යෙදේ.`,
              ta: `“weil” வரும்போது வினைமுற்று (“möchte”) வாக்கியத்தின் இறுதியில் செல்லும்.`
            }
          }
        ]
      },

      ja: {
        id: `ja`,
        name: `Japanese`,
        native: `日本語`,
        code: `JA`,
        bcp47: `ja-JP`,
        swatchClass: `swatch-ja`,
        intlExam: `JLPT (N5–N1)`,
        olFocus: `O/L Paper I & II: Hiragana, Katakana, ~100 basic Kanji, particles (は・が・を・に・で), and polite ます-form.`,
        alFocus: `A/L Paper I & II: ~300+ Kanji, plain forms, keigo (honorifics), conditional clauses, and cultural essays.`,
        traceChars: [
          { ch: `あ`, hint: `Hiragana “a” (3 strokes: horizontal, curved vertical, sweeping loop)` },
          { ch: `学`, hint: `Kanji “gaku” (study/learning) — 8 strokes, top crown + child radical` },
          { ch: `語`, hint: `Kanji “go” (language/word) — 14 strokes, speech radical on left` }
        ],
        vocab: [
          {
            word: `日本語を勉強します`,
            phonetic: `にほんご を べんきょうします (Nihongo o benkyō shimasu)`,
            pos: `Polite verb phrase`,
            level: `O/L Core · JLPT N5`,
            context: `毎日、図書館で日本語を勉強します。`,
            trans: {
              en: `I study Japanese — “Every day, I study Japanese at the library.”`,
              si: `මම ජපන් භාෂාව හදාරමි — “සෑම දිනකම මම පුස්තකාලයේදී ජපන් භාෂාව හදාරමි.”`,
              ta: `நான் ஜப்பானிய மொழி படிக்கிறேன் — “தினமும் நூலகத்தில் ஜப்பானிய மொழி படிக்கிறேன்.”`
            },
            tip: {
              en: `Location of an action takes particle で (de), while the direct object takes を (o).`,
              si: `ක්‍රියාවක් සිදුවන ස්ථානය සඳහා で නිපාතයත්, කර්මය සඳහා を නිපාතයත් යෙදේ.`,
              ta: `செயல் நடக்கும் இடத்திற்கு で இடைச்சொல்லும், செயப்படுபொருளுக்கு を இடைச்சொல்லும் வரும்.`
            }
          },
          {
            word: `試験の準備`,
            phonetic: `しけん の じゅんび (Shiken no junbi)`,
            pos: `Noun phrase`,
            level: `O/L & JLPT N4`,
            context: `来月、O/L試験の準備を始めます。`,
            trans: {
              en: `Exam preparation — “Next month, I will start preparing for the O/L examination.”`,
              si: `විභාග සූදානම — “ලබන මාසයේදී මම සා/පෙළ විභාගයට සූදානම් වීම ආරම්භ කරමි.”`,
              ta: `தேர்வுத் தயாரிப்பு — “அடுத்த மாதம் சாதாரண தரத் தேர்வுக்கான தயாரிப்பைத் தொடங்குவேன்.”`
            },
            tip: {
              en: `の (no) links two nouns cleanly, similar to “of” or possessive “’s” in English.`,
              si: `の නිපාතය නාම පද දෙකක් සම්බන්ධ කරයි (“විභාගයේ සූදානම”).`,
              ta: `の இடைச்சொல் இரண்டு பெயர்ச்சொற்களை இணைக்கும்.`
            }
          },
          {
            word: `わかりやすい`,
            phonetic: `わかりやすい (Wakariyasui)`,
            pos: `i-adjective (compound)`,
            level: `A/L & JLPT N4–N3`,
            context: `先生の説明はとてもわかりやすいです。`,
            trans: {
              en: `Easy to understand — “The teacher’s explanation is very easy to understand.”`,
              si: `තේරුම් ගැනීමට පහසු — “ගුරුතුමාගේ පැහැදිලි කිරීම තේරුම් ගැනීමට ඉතා පහසු ය.”`,
              ta: `புரிந்துகொள்ள எளிதான — “ஆசிரியரின் விளக்கம் புரிந்துகொள்ள மிகவும் எளிதாக உள்ளது.”`
            },
            tip: {
              en: `Attach ～やすい to a verb stem (わかり + やすい) to mean “easy to do”; ～にくい means “hard to do”.`,
              si: `ක්‍රියා මූලයට ～やすい එක් කිරීමෙන් “කිරීමට පහසු” යන අර්ථය ලැබේ.`,
              ta: `வினை அடியுடன் ～やすい சேர்த்தால் “செய்ய எளிதான” என்ற பொருள் தரும்.`
            }
          }
        ],
        grammar: [
          {
            title: `Particles で (location of action) vs. に (destination / existence)`,
            prompt: `Choose the right particle: “I read a Japanese book at school.”`,
            examples: [`学校 ___ 日本語の本を読みます。`],
            rule: {
              en: `Use で (de) to mark where an active action takes place (reading, studying, eating). Use に (ni) for static existence (います/あります) or movement destinations (行きます).`,
              si: `යම් ක්‍රියාවක් සිදු කරන ස්ථානය දැක්වීමට で යෙදේ. පැවැත්ම හෝ ගමනාන්තය සඳහා に යෙදේ.`,
              ta: `ஒரு செயல் நடக்கும் இடத்தைக் குறிக்க で வரும்; இருப்பையோ சேருமிடத்தையோ குறிக்க に வரும்.`
            },
            options: [`で`, `に`, `を`, `へ`],
            correct: 0,
            explanations: [
              `Correct: “読む” (to read) is an active action happening at school, so “学校で” is required.`,
              `“に” is used with existence verbs or destinations like “学校に行きます”.`,
              `“を” marks the direct object (“本を読みます”), not the school.`,
              `“へ” indicates direction toward a place.`
            ],
            siFeedback: `පොත් කියවීම සක්‍රීය ක්‍රියාවක් බැවින් ස්ථානය දැක්වීමට “で” යෙදේ.`,
            ta: `வாசித்தல் ஒரு செயல் என்பதால் இடத்தைக் குறிக்க “で” பயன்படுத்தப்படுகிறது.`
          },
          {
            title: `Connecting adjectives with ～くて`,
            prompt: `Combine two i-adjectives: “Sri Lanka is warm and beautiful.”`,
            examples: [`スリランカは暖か___、きれいです。`],
            rule: {
              en: `To connect an i-adjective to another clause, drop the final -い and add -くて (暖かい → 暖かくて). For na-adjectives like きれい, use で.`,
              si: `i-විශේෂණ පද දෙකක් සම්බන්ධ කිරීමේදී අවසන් -い ඉවත් කර -くて එක් කරන්න.`,
              ta: `i-பெயரடைகளை இணைக்க இறுதி -い ஐ நீக்கி -くて சேர்க்க வேண்டும்.`
            },
            options: [`くて`, `いで`, `で`, `な`],
            correct: 0,
            explanations: [
              `Correct: Drop “い” from “暖かい” and attach “くて” → “暖かくて”.`,
              `“いで” is ungrammatical for i-adjectives.`,
              `“で” is used for na-adjectives and nouns, not i-adjectives.`,
              `“な” modifies a following noun directly.`
            ],
            siFeedback: `“暖かい” යන i-විශේෂණය සම්බන්ධ කිරීමට “暖かくて” නිවැරදියි.`,
            ta: `“暖かい” என்ற i-பெயரடைக்கு “暖かくて” சரியானது.`
          }
        ],
        reading: {
          title: `コロンボの朝`,
          level: `GCE O/L & JLPT N5`,
          segments: [
            { text: `カスンさんは毎朝六時に`, gloss: null },
            { text: `起きます`, gloss: { en: `wakes up (okimasu)`, si: `අවදි වේ`, ta: `எழுந்திருக்கிறான்` } },
            { text: `。それから、`, gloss: null },
            { text: `紅茶`, gloss: { en: `black tea (kōcha)`, si: `තේ (කළු තේ)`, ta: `தேநீர்` } },
            { text: `を飲んで、日本語の漢字を十個練習します。七時半に`, gloss: null },
            { text: `バスで`, gloss: { en: `by bus`, si: `බස් රථයෙන්`, ta: `பேருந்தில்` } },
            { text: `学校へ行きます。`, gloss: null }
          ],
          question: `What does Kasun practise every morning after drinking tea?`,
          options: [
            `Ten Japanese Kanji characters`,
            `Playing cricket at the park`,
            `Cooking lunch for his family`,
            `Writing an English poem`
          ],
          correct: 0,
          explain: {
            en: `The text says “紅茶を飲んで、日本語の漢字を十個練習します” — he drinks tea and practises ten Kanji.`,
            si: `“紅茶を飲んで、日本語の漢字を十個練習します” යනු තේ පානය කර කන්ජි අකුරු 10ක් පුහුණු වන බවයි.`,
            ta: `தேநீர் அருந்திய பிறகு பத்து ஜப்பானிய கஞ்சி எழுத்துக்களைப் பயிற்சி செய்வதாகக் கூறப்பட்டுள்ளது.`
          }
        },
        writing: {
          type: `canvas`,
          prompt: {
            en: `Trace the Japanese character on the pad below using smooth strokes, and optionally write a short self-introduction in Romaji or Kana.`,
            si: `පහත කොටුවේ ජපන් අකුර ඇඳ පුහුණු වන්න.`,
            ta: `கீழே உள்ள பகுதியில் ஜப்பானிய எழுத்தை வரைந்து பயிற்சி செய்யுங்கள்.`
          },
          model: `わたしはスリランカのがくせいです。日本語をべんきょうしています。`,
          keywords: [`わたし`, `にほんご`, `スリランカ`, `がくせい`, `watashi`, `nihongo`]
        },
        listening: [
          {
            speaker: `Teacher (田中先生)`,
            target: `おはようございます。今日は新しい漢字を五つ覚えましょう。`,
            trans: {
              en: `Good morning. Today let’s memorise five new Kanji characters.`,
              si: `සුබ උදෑසනක්. අද අපි අලුත් කන්ජි අකුරු පහක් මතක තබා ගනිමු.`,
              ta: `காலை வணக்கம். இன்று ஐந்து புதிய கஞ்சி எழுத்துக்களைக் கற்போம்.`
            },
            question: `How many new Kanji will the class learn today?`,
            options: [`5 (五つ)`, `3 (三つ)`, `10 (十)`, `2 (二つ)`],
            correct: 0
          },
          {
            speaker: `Student Dialogue`,
            target: `すみません、駅はどこですか。まっすぐ行って、左です。`,
            trans: {
              en: `Excuse me, where is the station? Go straight and it’s on the left.`,
              si: `සමාවෙන්න, දුම්රිය ස්ථානය කොහේද? කෙළින්ම ගොස් වමට හැරෙන්න.`,
              ta: `மன்னிக்கவும், ரயில் நிலையம் எங்கே? நேராகச் சென்று இடதுபுறம் உள்ளது.`
            },
            question: `Which way should you turn after going straight?`,
            options: [`Left (左)`, `Right (右)`, `Backwards`, `Upstairs`],
            correct: 0
          }
        ],
        speaking: {
          phrase: `はじめまして。スリランカから来ました。よろしくお願いします。`,
          phonetic: `Hajimemashite. Suriranka kara kimashita. Yoroshiku onegaishimasu.`,
          meaning: {
            en: `Nice to meet you. I came from Sri Lanka. Please treat me kindly.`,
            si: `හමුවීම සතුටක්. මම ශ්‍රී ලංකාවෙන් පැමිණියෙමි. කරුණාවෙන් පිළිගන්න.`,
            ta: `சந்தித்ததில் மகிழ்ச்சி. நான் இலங்கையிலிருந்து வந்தேன். அன்புடன் பழகுங்கள்.`
          },
          pronunciationTip: {
            en: `Keep Japanese vowels crisp and even—avoid turning the final “e” of “mashite” into an English “ey” glide.`,
            si: `ජපන් ස්වර අකුරු කෙටියෙන් හා පැහැදිලිව උච්චාරණය කරන්න.`,
            ta: `ஜப்பானிய உயிரெழுத்துக்களைத் தெளிவாகவும் சுருக்கமாகவும் உச்சரிக்கவும்.`
          }
        },
        examQuestions: [
          {
            tier: 1,
            skill: `Script & Vocabulary`,
            q: `Which Japanese writing system is primarily used for foreign loanwords such as スリランカ (Sri Lanka)?`,
            options: [`Katakana`, `Hiragana`, `Kanji`, `Romaji`],
            correct: 0,
            explain: {
              en: `Katakana is used for foreign names, countries (スリランカ), and loanwords.`,
              si: `විදේශීය නම් සහ රටවල් (スリランカ) ලිවීමට Katakana භාවිතා වේ.`,
              ta: `வெளிநாட்டுப் பெயர்கள் மற்றும் நாடுகளை (スリランカ) எழுத கதகானா பயன்படுகிறது.`
            }
          },
          {
            tier: 2,
            skill: `Grammar (O/L & JLPT N5)`,
            q: `Select the polite past negative form of “食べます” (to eat):`,
            options: [`食べませんでした`, `食べません`, `食べました`, `食べなかった`],
            correct: 0,
            explain: {
              en: `Polite past negative of ～ます verbs is formed by replacing ～ます with ～ませんでした.`,
              si: `ආචාරශීලී අතීත නැත ආකාරය ～ませんでした මඟින් සෑදේ.`,
              ta: `மரியாதைக்குரிய இறந்தகால எதிர்மறை வடிவம் ～ませんでした ஆகும்.`
            }
          },
          {
            tier: 3,
            skill: `Grammar (A/L & JLPT N3)`,
            q: `Choose the correct expression for giving advice: “You had better sleep early.” — “早く寝た___いいですよ。”`,
            options: [`ほうが`, `ことが`, `ものが`, `だけが`],
            correct: 0,
            explain: {
              en: `Verb (た-form) + ほうがいい expresses strong advice (“had better do”).`,
              si: `උපදෙසක් දීමේදී ත-ආකාරය (た-form) සමඟ “ほうがいい” යෙදේ.`,
              ta: `அறிவுரை கூறும்போது வினை (た-வடிவம்) + ほうがいい பயன்படுத்தப்படும்.`
            }
          }
        ]
      },

      ko: {
        id: `ko`,
        name: `Korean`,
        native: `한국어`,
        code: `KO`,
        bcp47: `ko-KR`,
        swatchClass: `swatch-ko`,
        intlExam: `TOPIK I & II`,
        olFocus: `O/L & EPS/Foundation: Hangul syllable blocks, Sino- & Native-Korean numbers, particles (은/는, 이/가, 에/에서), and -아요/어요 endings.`,
        alFocus: `A/L & TOPIK II: Honorifics (-(으)시-), indirect quotation, complex connectors (-는데, -기 때문에), and formal paragraphs.`,
        traceChars: [
          { ch: `한`, hint: `Hangul block “han” (ㅎ + ㅏ + ㄴ): top-to-bottom, left-to-right` },
          { ch: `국`, hint: `Hangul block “guk” (ㄱ + ㅜ + ㄱ): consonant + bottom vowel + final consonant` },
          { ch: `어`, hint: `Hangul block “eo” (ㅇ + ㅓ): silent initial ㅇ + vertical vowel` }
        ],
        vocab: [
          {
            word: `한국어를 배우다`,
            phonetic: `han-gu-geo-reul bae-u-da`,
            pos: `Verb phrase`,
            level: `O/L Core · TOPIK I`,
            context: `저는 학교에서 한국어를 열심히 배워요.`,
            trans: {
              en: `To learn Korean — “I diligently learn Korean at school.”`,
              si: `කොරියානු භාෂාව ඉගෙන ගැනීම — “මම පාසලේදී උනන්දුවෙන් කොරියානු භාෂාව ඉගෙන ගනිමි.”`,
              ta: `கொரிய மொழி கற்றல் — “நான் பாடசாலையில் ஆர்வத்துடன் கொரிய மொழி கற்கிறேன்.”`
            },
            tip: {
              en: `Like Sinhala and Tamil, Korean places the verb at the very end of the sentence (SOV order)!`,
              si: `සිංහල සහ දෙමළ භාෂාවල මෙන්ම කොරියානු භාෂාවේද ක්‍රියාපදය වාක්‍යය අවසානයේ යෙදේ (SOV).`,
              ta: `தமிழ் மற்றும் சிங்களம் போலவே கொரிய மொழியிலும் வினைச்சொல் வாக்கியத்தின் இறுதியில் வரும் (SOV).`
            }
          },
          {
            word: `시험을 준비하다`,
            phonetic: `si-heo-meul jun-bi-ha-da`,
            pos: `Verb phrase`,
            level: `O/L & TOPIK I`,
            context: `주말마다 친구와 함께 토픽 시험을 준비해요.`,
            trans: {
              en: `To prepare for an exam — “Every weekend I prepare for the TOPIK exam with my friend.”`,
              si: `විභාගයකට සූදානම් වීම — “සෑම සති අන්තයකම මම මිතුරෙකු සමඟ TOPIK විභාගයට සූදානම් වෙමි.”`,
              ta: `தேர்வுக்குத் தயாராதல் — “ஒவ்வொரு வார இறுதியிலும் நண்பருடன் TOPIK தேர்வுக்குத் தயாராகிறேன்.”`
            },
            tip: {
              en: `Attach -을 after a final consonant (시험 + 을), and -를 after a vowel (한국어 + 를).`,
              si: `අවසානයේ ව්‍යංජනාක්ෂරයක් ඇති විට -을 ද, ස්වරයක් ඇති විට -를 ද යෙදේ.`,
              ta: `மெய்யெழுத்தில் முடிந்தால் -을, உயிரெழுத்தில் முடிந்தால் -를 சேர்க்கவும்.`
            }
          },
          {
            word: `덕분에`,
            phonetic: `deok-bu-ne`,
            pos: `Expression`,
            level: `A/L & TOPIK II`,
            context: `선생님의 친절한 설명 덕분에 문법을 잘 이해했어요.`,
            trans: {
              en: `Thanks to — “Thanks to the teacher’s kind explanation, I understood the grammar well.”`,
              si: `පින් සිදුවන්නට / නිසා — “ගුරුතුමාගේ කාරුණික පැහැදිලි කිරීම නිසා මම ව්‍යාකරණ හොඳින් තේරුම් ගත්තෙමි.”`,
              ta: `நன்றியால் / உதவியால் — “ஆசிரியரின் அன்பான விளக்கத்தால் இலக்கணத்தை நன்றாகப் புரிந்துகொண்டேன்.”`
            },
            tip: {
              en: `Use 덕분에 only for positive outcomes (“thanks to”); use 때문에 for neutral or negative causes.`,
              si: `යහපත් ප්‍රතිඵල සඳහා පමණක් 덕분에 භාවිතා කරන්න.`,
              ta: `நல்ல விளைவுகளுக்கு மட்டுமே 덕분에 பயன்படுத்த வேண்டும்.`
            }
          }
        ],
        grammar: [
          {
            title: `Object Particles -을 / -를 and Action Location -에서`,
            prompt: `Choose the natural sentence for: “I drink tea at a café.”`,
            examples: [`저는 카페___ 차___ 마셔요.`],
            rule: {
              en: `Action location takes -에서 (카페에서). Object particle depends on the final sound: vowel-ending nouns like 차 (tea) take -를, whereas consonant-ending nouns take -을.`,
              si: `ක්‍රියාවක් සිදුවන ස්ථානයට -에서 යෙදේ. ස්වරයකින් අවසන් වන “차” සමඟ -를 යෙදේ.`,
              ta: `செயல் நடக்கும் இடத்திற்கு -에서 வரும். உயிரொலியில் முடியும் “차” உடன் -를 சேரும்.`
            },
            options: [`에서 / 를`, `에 / 을`, `에서 / 을`, `가 / 는`],
            correct: 0,
            explanations: [
              `Correct: “카페에서” (action happens at the café) and “차를” (“차” has no final consonant).`,
              `“에” marks static location or destination, and “차” ends in a vowel so it needs “를”.`,
              `“카페에서” is right, but “차을” is incorrect because “차” has no batchim (final consonant).`,
              `“가 / 는” are subject/topic markers, not location/object markers.`
            ],
            siFeedback: `“카페에서 차를 마셔요” — ස්ථානයට -에서 සහ කර්මයට -를 නිවැරදියි.`,
            ta: `“카페에서 차를 마셔요” — இடத்திற்கு -에서, செயப்படுபொருளுக்கு -를 சரியாகும்.`
          },
          {
            title: `Present Polite Conjugation (-아요 / -어요)`,
            prompt: `Conjugate “읽다” (to read) into polite present tense:`,
            examples: [`매일 한국어 책을 ___.`],
            rule: {
              en: `Check the last vowel of the verb stem: ㅏ or ㅗ takes -아요 (가다 → 가요, 오다 → 와요); all other vowels (including ㅣ in 읽-) take -어요 (읽다 → 읽어요).`,
              si: `ක්‍රියා මූලයේ අවසන් ස්වරය ㅏ හෝ ㅗ නම් -아요 ද, අනෙක් ස්වර සඳහා -어요 ද යෙදේ.`,
              ta: `வினை அடியின் கடைசி உயிரெழுத்து ㅏ அல்லது ㅗ எனில் -아요, மற்ற உயிரெழுத்துக்களுக்கு -어요 வரும்.`
            },
            options: [`읽어요`, `읽아요`, `읽해요`, `읽었어요`],
            correct: 0,
            explanations: [
              `Correct: The stem vowel of “읽-” is ㅣ (not ㅏ/ㅗ), so it takes -어요 → “읽어요”.`,
              `“-아요” is only used when the stem’s last vowel is ㅏ or ㅗ.`,
              `“-해요” is only for 하다 verbs.`,
              `“읽었어요” is past tense (“read”), whereas “매일” (every day) describes a present habit.`
            ],
            siFeedback: `“읽-” මූලයේ ස්වරය ㅣ බැවින් වර්තමාන ආචාරශීලී රූපය “읽어요” වේ.`,
            ta: `“읽-” என்பதன் உயிர் ㅣ என்பதால் நிகழ்கால வடிவம் “읽어요” ஆகும்.`
          }
        ],
        reading: {
          title: `콜롬보의 주말 도서관`,
          level: `GCE O/L & TOPIK I`,
          segments: [
            { text: `민수 씨는 토요일마다 `, gloss: null },
            { text: `도서관에 가요`, gloss: { en: `goes to the library`, si: `පුස්තකාලයට යයි`, ta: `நூலகத்திற்குச் செல்கிறான்` } },
            { text: `. 거기에서 `, gloss: null },
            { text: `스리랑카 친구들과`, gloss: { en: `with Sri Lankan friends`, si: `ශ්‍රී ලාංකික මිතුරන් සමඟ`, ta: `இலங்கை நண்பர்களுடன்` } },
            { text: ` 같이 한국어 단어를 외우고 대화를 연습해요. 점심에는 따뜻한 `, gloss: null },
            { text: `실론 티`, gloss: { en: `Ceylon tea`, si: `සිලෝන් තේ`, ta: `இலங்கை தேநீர்` } },
            { text: `를 마시면서 이야기를 나눠요.`, gloss: null }
          ],
          question: `What do Minsu and his friends do at the library on Saturdays?`,
          options: [
            `Memorise Korean vocabulary and practise dialogues together`,
            `Play basketball behind the library`,
            `Study only Chemistry formulas`,
            `Sleep until evening`
          ],
          correct: 0,
          explain: {
            en: `“한국어 단어를 외우고 대화를 연습해요” means they memorise Korean words and practise conversation.`,
            si: `“한국어 단어를 외우고 대화를 연습해요” යනු කොරියානු වචන පාඩම් කර සංවාද පුහුණු වන බවයි.`,
            ta: `கொரிய வார்த்தைகளை மனப்பாடம் செய்து உரையாடல் பயிற்சி செய்கிறார்கள்.`
          }
        },
        writing: {
          type: `canvas`,
          prompt: {
            en: `Practise drawing the Hangul syllable block on the canvas and type a polite greeting below.`,
            si: `කොරියානු හංගුල් අක්ෂරය ඇඳ පුහුණු වන්න.`,
            ta: `கொரிய ஹங்குல் எழுத்தை வரைந்து பயிற்சி செய்யுங்கள்.`
          },
          model: `안녕하세요! 저는 스리랑카 학생이에요.`,
          keywords: [`안녕`, `스리랑카`, `한국어`, `학생`, `annyeong`]
        },
        listening: [
          {
            speaker: `Teacher (김 선생님)`,
            target: `여러분, 오늘 수업은 여기까지예요. 내일 시험을 잘 보세요!`,
            trans: {
              en: `Everyone, today’s class ends here. Good luck with tomorrow’s exam!`,
              si: `හැමෝම, අද පන්තිය මෙතැනින් අවසන්. හෙට විභාගය හොඳින් කරන්න!`,
              ta: `அனைவருக்கும், இன்றைய வகுப்பு இத்துடன் முடிவடைகிறது. நாளைய தேர்வை நன்றாக எழுதுங்கள்!`
            },
            question: `When is the exam mentioned by the teacher?`,
            options: [`Tomorrow (내일)`, `Next month`, `Yesterday`, `Next year`],
            correct: 0
          },
          {
            speaker: `Café Order`,
            target: `따뜻한 홍차 한 잔 주세요. 네, 잠시만 기다리세요.`,
            trans: {
              en: `One cup of hot black tea, please. Yes, please wait a moment.`,
              si: `උණු කළු තේ කෝප්පයක් දෙන්න. හොඳයි, මඳක් රැඳී සිටින්න.`,
              ta: `சூடான தேநீர் ஒரு கோப்பை கொடுங்கள். சரி, சற்று காத்திருங்கள்.`
            },
            question: `What did the customer order?`,
            options: [`One cup of hot black tea`, `Two iced coffees`, `Three sandwiches`, `Cold water`],
            correct: 0
          }
        ],
        speaking: {
          phrase: `만나서 반갑습니다. 저는 한국어를 열심히 공부하고 있어요.`,
          phonetic: `Man-na-seo ban-gap-seum-ni-da. Jeo-neun han-gu-geo-reul yeol-si-mi gong-bu-ha-go i-sseo-yo.`,
          meaning: {
            en: `Pleased to meet you. I am studying Korean diligently.`,
            si: `හමුවීම සතුටක්. මම උනන්දුවෙන් කොරියානු භාෂාව ඉගෙන ගනිමින් සිටිමි.`,
            ta: `சந்தித்ததில் மகிழ்ச்சி. நான் கொரிய மொழியை ஆர்வத்துடன் படித்துக்கொண்டிருக்கிறேன்.`
          },
          pronunciationTip: {
            en: `In “반갑습니다”, the ㅂ before ㄴ assimilates to an /m/ sound: “ban-gap-seum-ni-da”.`,
            si: `“반갑습니다” හි ㄴ ඉදිරියේ ඇති ㅂ අකුර /m/ ලෙස උච්චාරණය වේ (“සම්නිදා”).`,
            ta: `“반갑습니다” என்பதில் ㄴ க்கு முன் உள்ள ㅂ என்பது /m/ ஒலியாக மாறும்.`
          }
        },
        examQuestions: [
          {
            tier: 1,
            skill: `Vocabulary & Culture`,
            q: `Which sentence structure order does Korean share with Sinhala and Tamil?`,
            options: [`Subject – Object – Verb (SOV)`, `Subject – Verb – Object (SVO)`, `Verb – Subject – Object (VSO)`, `Object – Verb – Subject`],
            correct: 0,
            explain: {
              en: `Korean, Sinhala, and Tamil are all SOV languages, making Korean sentence structure very intuitive for Sri Lankan learners.`,
              si: `කොරියානු, සිංහල සහ දෙමළ යන භාෂා තුනම කර්තෘ–කර්ම–ක්‍රියා (SOV) රටාව අනුගමනය කරයි.`,
              ta: `கொரியம், தமிழ், சிங்களம் ஆகிய மூன்று மொழிகளும் எழுவாய்–செயப்படுபொருள்–பயனிலை (SOV) அமைப்பைக் கொண்டவை.`
            }
          },
          {
            tier: 2,
            skill: `Grammar (TOPIK I)`,
            q: `Choose the correct past tense form of “공부하다” (to study):`,
            options: [`공부했어요`, `공부해요`, `공부할 거예요`, `공부하겠어요`],
            correct: 0,
            explain: {
              en: `하다 verbs become 했어요 in the polite past tense.`,
              si: `하다 ක්‍රියාපදවල අතීත ආචාරශීලී රූපය “했어요” වේ.`,
              ta: `하다 வினைச்சொற்களின் இறந்தகால வடிவம் “했어요” ஆகும்.`
            }
          },
          {
            tier: 3,
            skill: `Grammar (TOPIK II & A/L)`,
            q: `Which ending expresses background context or gentle contrast (“I studied hard, and/but...”)?`,
            options: [`-는데`, `-고 싶어요`, `-아/어 주세요`, `-지 마세요`],
            correct: 0,
            explain: {
              en: `“-는데” introduces background information or soft contrast before the main clause.`,
              si: `පසුබිම් විස්තරයක් හෝ මෘදු ප්‍රතිවිරෝධයක් දැක්වීමට “-는데” යෙදේ.`,
              ta: `பின்னணித் தகவல் அல்லது மென்மையான முரண்பாட்டைக் கூற “-는데” பயன்படுகிறது.`
            }
          }
        ]
      },

      zh: {
        id: `zh`,
        name: `Chinese (Mandarin)`,
        native: `中文 (普通话)`,
        code: `ZH`,
        bcp47: `zh-CN`,
        swatchClass: `swatch-zh`,
        intlExam: `HSK (Levels 1–6)`,
        olFocus: `O/L & HSK 1–2: Four tones + neutral tone, Pinyin, SVO order, time-before-verb, measure words (个, 本, 杯), and ~150 characters.`,
        alFocus: `A/L & HSK 3–4: Aspect particles (了, 过, 着), 把-construction, comparative sentences (比), and formal essays.`,
        traceChars: [
          { ch: `学`, hint: `Hanzi “xué” (study/learn) — 8 strokes` },
          { ch: `中`, hint: `Hanzi “zhōng” (middle/China) — 4 strokes: box first, vertical centre stroke last` },
          { ch: `文`, hint: `Hanzi “wén” (language/culture) — 4 strokes: top dot, horizontal, sweeping diagonals` }
        ],
        vocab: [
          {
            word: `学习中文`,
            phonetic: `xuéxí Zhōngwén (2nd–2nd, 1st–2nd tones)`,
            pos: `Verb + Object`,
            level: `O/L Core · HSK 1`,
            context: `我在斯里兰卡的中学学习中文。`,
            trans: {
              en: `To study Chinese — “I study Chinese at a secondary school in Sri Lanka.”`,
              si: `චීන භාෂාව හැදෑරීම — “මම ශ්‍රී ලංකාවේ ද්විතීයික පාසලක චීන භාෂාව හදාරමි.”`,
              ta: `சீன மொழி கற்றல் — “நான் இலங்கையில் உள்ள உயர்நிலைப் பள்ளியில் சீன மொழி படிக்கிறேன்.”`
            },
            tip: {
              en: `Place expressions (“在斯里兰卡的中学”) come BEFORE the action verb (“学习”) in Mandarin!`,
              si: `මැන්ඩරින් භාෂාවේදී ස්ථානය දක්වන පදය (“在...”) ක්‍රියාපදයට පෙර යෙදේ.`,
              ta: `மாண்டரின் மொழியில் இடம் குறிக்கும் சொல் (“在...”) வினைச்சொல்லுக்கு முன்பு வரும்.`
            }
          },
          {
            word: `准备考试`,
            phonetic: `zhǔnbèi kǎoshì`,
            pos: `Verb phrase`,
            level: `O/L & HSK 2–3`,
            context: `每天晚上我都认真准备汉语水平考试。`,
            trans: {
              en: `To prepare for an exam — “Every evening I earnestly prepare for the HSK exam.”`,
              si: `විභාගයට සූදානම් වීම — “සෑම සවසකම මම HSK විභාගය සඳහා උනන්දුවෙන් සූදානම් වෙමි.”`,
              ta: `தேர்வுக்குத் தயாராதல் — “தினமும் மாலையில் HSK தேர்வுக்காகக் கவனமாகத் தயாராகிறேன்.”`
            },
            tip: {
              en: `“都” (dōu) emphasises “every/all” and always sits right before the adverb/verb.`,
              si: `“都” (dōu) සෑමවිටම ක්‍රියාපදයට පෙර යෙදී “සියල්ල/සෑම” යන්න අවධාරණය කරයි.`,
              ta: `“都” (dōu) வினைச்சொல்லுக்கு முன் வந்து “அனைத்தும்” என்பதை வலியுறுத்தும்.`
            }
          },
          {
            word: `虽然……但是……`,
            phonetic: `suīrán ... dànshì ...`,
            pos: `Correlative conjunction`,
            level: `A/L & HSK 3–4`,
            context: `虽然汉字有点难，但是写起来很有意思。`,
            trans: {
              en: `Although ... yet ... — “Although Chinese characters are a bit difficult, writing them is very interesting.”`,
              si: `එසේ වුවද ... නමුත් ... — “චීන අක්ෂර තරමක් අපහසු වුවද, ඒවා ලිවීම ඉතා රසවත් ය.”`,
              ta: `இருப்பினும் ... ஆனால் ... — “சீன எழுத்துக்கள் சற்று கடினமாக இருந்தாலும், எழுதுவது மிகவும் சுவாரசியமானது.”`
            },
            tip: {
              en: `Unlike English (where you never combine “although” and “but”), Mandarin naturally pairs 虽然 with 但是.`,
              si: `ඉංග්‍රීසියෙන් මෙන් නොව, චීන භාෂාවේ 虽然 සහ 但是 එකම වාක්‍යයක යෙදිය යුතුය.`,
              ta: `ஆங்கிலத்தைப் போலன்றி, சீன மொழியில் 虽然 மற்றும் 但是 இரண்டையும் ஒரே வாக்கியத்தில் சேர்த்துப் பயன்படுத்துவார்கள்.`
            }
          }
        ],
        grammar: [
          {
            title: `Measure Words (量词) between Numbers and Nouns`,
            prompt: `Choose the correct measure word for “three books”:`,
            examples: [`我买了三 ___ 中文书。`],
            rule: {
              en: `Numbers cannot modify nouns directly in Mandarin; a measure word is required. Books, notebooks, and magazines use 本 (běn), cups of tea use 杯 (bēi), and general objects/people use 个 (gè).`,
              si: `මැන්ඩරින් භාෂාවේදී ඉලක්කමක් සහ නාම පදයක් අතර මිනුම් පදයක් (measure word) අවශ්‍ය වේ. පොත් සඳහා 本 (běn) යෙදේ.`,
              ta: `மாண்டரினில் எண்ணுக்கும் பெயர்ச்சொல்லுக்கும் இடையில் அளவுச்சொல் அவசியம். புத்தகங்களுக்கு 本 (běn) வரும்.`
            },
            options: [`本 (běn)`, `杯 (bēi)`, `个 (gè)`, `条 (tiáo)`],
            correct: 0,
            explanations: [
              `Correct: “本” (běn) is the dedicated measure word for bound volumes and books → “三本中文书”.`,
              `“杯” (bēi) is for cups or glasses of drinks, such as tea or water.`,
              `“个” is a general classifier, but books specifically require “本”.`,
              `“条” is for long, narrow things like roads, rivers, or fish.`
            ],
            siFeedback: `පොත් සඳහා නිවැරදි මිනුම් පදය “本” (běn) වේ.`,
            ta: `புத்தகங்களுக்கான சரியான அளவுச்சொல் “本” (běn) ஆகும்.`
          },
          {
            title: `Word Order: Subject + Time + Location + Verb`,
            prompt: `Select the grammatically sound sentence for “I study at school today”:`,
            examples: [`___`],
            rule: {
              en: `Mandarin places Time first (or right after Subject), then Location (在 + place), then the Verb + Object.`,
              si: `චීන වාක්‍ය රටාව: කර්තෘ + වේලාව + ස්ථානය (在...) + ක්‍රියාව + කර්මය.`,
              ta: `சீன வாக்கிய அமைப்பு: எழுவாய் + நேரம் + இடம் (在...) + வினை + செயப்படுபொருள்.`
            },
            options: [
              `我今天在学校学习。`,
              `我学习在学校今天。`,
              `在学校我学习今天。`,
              `今天学习在学校我。`
            ],
            correct: 0,
            explanations: [
              `Correct: Subject (我) + Time (今天) + Location (在学校) + Verb (学习).`,
              `Mandarin never places time or location phrases after the main verb like English does.`,
              `Time (“今天”) should precede the verb, not come at the very end.`,
              `The subject “我” must come before the verb.`
            ],
            siFeedback: `“我今天在学校学习” — වේලාව සහ ස්ථානය ක්‍රියාපදයට පෙර යෙදිය යුතුය.`,
            ta: `“我今天在学校学习” — நேரமும் இடமும் வினைச்சொல்லுக்கு முன்பு வர வேண்டும்.`
          }
        ],
        reading: {
          title: `在康提学习汉语`,
          level: `GCE O/L & HSK 2`,
          segments: [
            { text: `沙妮卡住在`, gloss: null },
            { text: `康提`, gloss: { en: `Kandy (Kāngtí)`, si: `මහනුවර`, ta: `கண்டி` } },
            { text: `。她星期六上午去语言中心`, gloss: null },
            { text: `上课`, gloss: { en: `attends class`, si: `පන්තියට සහභාගී වේ`, ta: `வகுப்பில் கலந்துகொள்கிறாள்` } },
            { text: `。老师先教大家`, gloss: null },
            { text: `声调`, gloss: { en: `tones (shēngdiào)`, si: `ස්වර තාන (Tones)`, ta: `குரல் தொனிகள்` } },
            { text: `，然后同学们一起做`, gloss: null },
            { text: `对话练习`, gloss: { en: `dialogue practice`, si: `සංවාද පුහුණුව`, ta: `உரையாடல் பயிற்சி` } },
            { text: `。`, gloss: null }
          ],
          question: `What does the teacher teach first on Saturday morning?`,
          options: [
            `Mandarin tones (声调)`,
            `Cooking noodles`,
            `Writing long essays`,
            `Geography of rivers`
          ],
          correct: 0,
          explain: {
            en: `“老师先教大家声调” means “First, the teacher teaches everyone the tones.”`,
            si: `“老师先教大家声调” යනු ගුරුතුමා මුලින්ම ස්වර තාන උගන්වන බවයි.`,
            ta: `“老师先教大家声调” என்றால் ஆசிரியர் முதலில் குரல் தொனிகளைக் கற்பிக்கிறார் என்பதாகும்.`
          }
        },
        writing: {
          type: `canvas`,
          prompt: {
            en: `Trace the Hanzi character on the pad below, keeping stroke order top-to-bottom and left-to-right.`,
            si: `පහත කොටුවේ චීන අක්ෂරය ඇඳ පුහුණු වන්න.`,
            ta: `கீழே உள்ள பகுதியில் சீன எழுத்தை வரைந்து பயிற்சி செய்யுங்கள்.`
          },
          model: `你好！我是斯里兰卡的学生，我喜欢学习中文。`,
          keywords: [`你好`, `斯里兰卡`, `中文`, `学习`, `学生`, `nihao`]
        },
        listening: [
          {
            speaker: `Teacher (李老师)`,
            target: `同学们好！请大家跟我一起读今天的生词。`,
            trans: {
              en: `Hello students! Please read today’s new vocabulary together with me.`,
              si: `සුබ දවසක් සිසුනි! කරුණාකර අද අලුත් වචන මා සමඟ කියවන්න.`,
              ta: `வணக்கம் மாணவர்களே! இன்றைய புதிய சொற்களை என்னுடன் சேர்ந்து படியுங்கள்.`
            },
            question: `What did Teacher Li ask the class to read together?`,
            options: [`Today’s new vocabulary (生词)`, `Yesterday’s homework`, `The exam timetable`, `A story book`],
            correct: 0
          },
          {
            speaker: `Tea Shop`,
            target: `请问，一杯斯里兰卡红茶多少钱？十块钱。`,
            trans: {
              en: `Excuse me, how much is a cup of Sri Lankan black tea? Ten yuan.`,
              si: `සමාවෙන්න, ශ්‍රී ලංකා තේ කෝප්පයක් කීයද? යුවාන් දහයයි.`,
              ta: `மன்னிக்கவும், ஒரு கோப்பை இலங்கை தேநீர் எவ்வளவு? பத்து யுவான்.`
            },
            question: `How much does one cup of tea cost?`,
            options: [`10 (十)`, `5 (五)`, `20 (二十)`, `2 (两)`],
            correct: 0
          }
        ],
        speaking: {
          phrase: `很高兴认识你！我在斯里兰卡学中文。`,
          phonetic: `Hěn gāoxìng rènshi nǐ! Wǒ zài Sīlǐlánkǎ xué Zhōngwén.`,
          meaning: {
            en: `Very pleased to meet you! I study Chinese in Sri Lanka.`,
            si: `ඔබව හඳුනා ගැනීම ඉතා සතුටක්! මම ශ්‍රී ලංකාවේදී චීන භාෂාව ඉගෙන ගනිමි.`,
            ta: `உங்களைச் சந்தித்ததில் மிக்க மகிழ்ச்சி! நான் இலங்கையில் சீனம் படிக்கிறேன்.`
          },
          pronunciationTip: {
            en: `Keep the 1st tone in “gāo” high and flat, and dip cleanly into the 3rd tone on “nǐ” and “lǐ”.`,
            si: `“gāo” හි පළමු තානය සමතලව උස්ව තබා, “nǐ” හි තෙවන තානය පහළට ගෙන උස් කරන්න.`,
            ta: `“gāo” என்பதில் முதல் தொனியைச் சமமாக உயர்த்தி, “nǐ” என்பதில் மூன்றாம் தொனியைத் தெளிவாக உச்சரிக்கவும்.`
          }
        },
        examQuestions: [
          {
            tier: 1,
            skill: `Phonetics & Tones`,
            q: `How many main lexical tones (plus neutral tone) distinguish word meanings in Mandarin Chinese?`,
            options: [`4 main tones + neutral tone`, `2 tones only`, `8 tones`, `No tones`],
            correct: 0,
            explain: {
              en: `Mandarin has 4 main pitch contours (high level, rising, dipping, falling) plus a light neutral tone.`,
              si: `මැන්ඩරින් භාෂාවේ ප්‍රධාන තාන 4ක් සහ මධ්‍යස්ථ තානයක් ඇත.`,
              ta: `மாண்டரின் மொழியில் 4 முக்கிய குரல் தொனிகளும் ஒரு நடுநிலைத் தொனியும் உள்ளன.`
            }
          },
          {
            tier: 2,
            skill: `Grammar (O/L & HSK 2)`,
            q: `Which sentence correctly uses “了” to express a completed action?`,
            options: [`我昨天买了一本词典。`, `我明天买了一本词典。`, `我每天买了一本词典。`, `我不买了一本词典。`],
            correct: 0,
            explain: {
              en: `Completed action “了” fits past time “昨天” (yesterday). Negating a past action uses “没买”, never “不买了” in this sense.`,
              si: `අතීත ක්‍රියාවක් සඳහා “昨天” සමඟ “了” නිවැරදිව යෙදේ. නැත යන්නට “没买” යෙදේ.`,
              ta: `நேற்று நடந்த செயலுக்கு “昨天” உடன் “了” சரியாகும். எதிர்மறைக்கு “没买” பயன்படுத்தப்படும்.`
            }
          },
          {
            tier: 3,
            skill: `Grammar (A/L & HSK 4)`,
            q: `Complete the comparison: “My Chinese today is better ___ last year.” — “我的中文___去年好多了。”`,
            options: [`比`, `跟`, `被`, `给`],
            correct: 0,
            explain: {
              en: `“A + 比 + B + Adjective” is the standard comparative pattern in Mandarin.`,
              si: `සංසන්දනය කිරීමේදී “A + 比 + B + විශේෂණය” රටාව භාවිතා වේ.`,
              ta: `ஒப்பிடும்போது “A + 比 + B + பெயரடை” என்ற அமைப்பு பயன்படும்.`
            }
          }
        ]
      }
    };

    const STARTER_PACKS = [
      {
        id: `pack-ol-fr`,
        lang: `fr`,
        pathway: `GCE O/L`,
        title: `GCE O/L French Essential Connectors & Verbs`,
        author: `Curriculum Template · Colombo Study Circle`,
        items: [
          `Ensuite — Then / Next`,
          `Parce que — Because`,
          `Pendant les vacances — During the holidays`,
          `J’ai visité — I visited`
        ]
      },
      {
        id: `pack-ja-n5`,
        lang: `ja`,
        pathway: `JLPT N5 / O/L`,
        title: `JLPT N5 & O/L Essential Particles Quick Sheet`,
        author: `Curriculum Template · Kandy Nihongo Club`,
        items: [
          `は (wa) — Topic marker`,
          `を (o) — Direct object marker`,
          `で (de) — Location of action / means`,
          `に (ni) — Specific time / destination`
        ]
      },
      {
        id: `pack-ko-topik`,
        lang: `ko`,
        pathway: `TOPIK I / O/L`,
        title: `Korean SOV Starter Verbs for Sri Lankan Learners`,
        author: `Curriculum Template · Galle Hangul Group`,
        items: [
          `가다 (가어요/가요) — To go`,
          `보다 (봐요) — To see / watch`,
          `공부하다 (공부해요) — To study`,
          `읽다 (읽어요) — To read`
        ]
      },
      {
        id: `pack-de-al`,
        lang: `de`,
        pathway: `GCE A/L / Goethe B1`,
        title: `GCE A/L German Essay Argumentation Phrases`,
        author: `Curriculum Template · Jaffna Deutsch Forum`,
        items: [
          `Einerseits ... andererseits — On one hand ... on the other`,
          `Meiner Meinung nach — In my opinion`,
          `Zusammenfassend lässt sich sagen — In summary`,
          `Im Vergleich zu — In comparison to`
        ]
      },
      {
        id: `pack-zh-hsk`,
        lang: `zh`,
        pathway: `HSK 1–3 / O/L`,
        title: `Mandarin Measure Words & Daily Politeness`,
        author: `Curriculum Template · Kurunegala Mandarin Circle`,
        items: [
          `请问 (qǐngwèn) — Excuse me, may I ask`,
          `一本词典 — One dictionary`,
          `一杯茶 — One cup of tea`,
          `没关系 (méi guānxi) — No problem / It doesn’t matter`
        ]
      }
    ];

    const STARTER_THREADS = [
      {
        id: `th-1`,
        lang: `ja`,
        tag: `GCE O/L · Particles`,
        title: `When should we use で instead of に for places?`,
        body: `Think of に as a pin on a map (being there or going there) and で as a stage where an action happens (studying, eating, reading).`,
        replies: [
          `Sinhala cue: “පාසලේදී පොතක් කියවනවා” = で; “පාසලට යනවා / පාසලේ ඉන්නවා” = に.`
        ],
        upvotes: 14
      },
      {
        id: `th-2`,
        lang: `fr`,
        tag: `GCE A/L · Writing`,
        title: `Checklist for scoring higher on GCE A/L French essays`,
        body: `Include at least three discourse connectors (cependant, par conséquent, en revanche), verify masculine/feminine agreement, and add one subjunctive structure naturally.`,
        replies: [
          `Tamil cue: இணைப்புச் சொற்களை (cependant, donc) பயன்படுத்தினால் கட்டுரை ஓட்டம் நன்றாக இருக்கும்.`
        ],
        upvotes: 11
      },
      {
        id: `th-3`,
        lang: `ko`,
        tag: `TOPIK I · Pronunciation`,
        title: `Tip for reading batchim ㅂ before ㄴ in formal endings`,
        body: `In -습니다 / -ㅂ니다, pronounce ㅂ as /m/ (seum-ni-da) instead of /p/. It flows smoothly just like nasal assimilation in Tamil and Sinhala.`,
        replies: [],
        upvotes: 9
      }
    ];

    const BADGES = [
      { id: `b-first-step`, name: `First Step`, desc: `Earn your first 15 XP in any language`, req: (s) => s.xp >= 15 },
      { id: `b-polyglot`, name: `Polyglot Explorer`, desc: `Practise at least 2 foreign languages`, req: (s) => Object.values(s.practisedSkills).filter(arr => arr.length > 0).length >= 2 },
      { id: `b-six-skills`, name: `Well-Rounded`, desc: `Practise 4+ skill areas in one language`, req: (s) => Object.values(s.practisedSkills).some(arr => arr.length >= 4) },
      { id: `b-exam-ready`, name: `Exam Challenger`, desc: `Complete an adaptive diagnostic quiz`, req: (s) => Object.keys(s.examScores).length >= 1 },
      { id: `b-creator`, name: `Resource Builder`, desc: `Create or import a custom study resource`, req: (s) => s.customPacks.length >= 1 },
      { id: `b-community`, name: `Peer Contributor`, desc: `Post a question or reply in the community hub`, req: (s) => s.communityPosts.length > STARTER_THREADS.length }
    ];

    /* ======================================================================
       2. APPLICATION STATE & PERSISTENCE (notebookAppApi)
       ====================================================================== */
    function createInitialState() {
      return {
        activeLang: `fr`,
        supportLang: `en`,
        pathway: `ol`,
        activeView: `studio`,
        activeSkill: `vocab`,
        vocabIdx: 0,
        grammarIdx: 0,
        listenIdx: 0,
        traceIdx: 0,
        xp: 0,
        streak: 0,
        lastStudyDay: null,
        practisedSkills: { fr: [], de: [], ja: [], ko: [], zh: [] },
        masteredVocab: { fr: [], de: [], ja: [], ko: [], zh: [] },
        examScores: {},
        planConfig: {
          dailyMinutes: 30,
          horizonWeeks: 8,
          focusSkill: `all`
        },
        planChecklist: {},
        customPacks: [],
        communityPosts: JSON.parse(JSON.stringify(STARTER_THREADS))
      };
    }

    let appState = createInitialState();

    // Ephemeral UI state (not persisted)
    let quizSession = {
      active: false,
      tier: 2,
      questionIdx: 0,
      askedIds: [],
      correctCount: 0,
      totalAnswered: 0,
      answeredCurrent: null
    };
    let selectedGloss = null;
    let writingCanvasCtx = null;
    let isDrawing = false;
    let strokeCount = 0;

    async function saveState() {
      try {
        if (window.notebookAppApi && typeof window.notebookAppApi.setAppState === 'function') {
          await window.notebookAppApi.setAppState(appState);
        }
      } catch (err) {
        console.warn('State save warning:', err);
      }
    }

    function showStatus(msg, tone) {
      const box = document.getElementById('global-status');
      if (!box) return;
      box.className = `feedback-box ${tone === 'err' ? 'is-err' : tone === 'ok' ? 'is-ok' : 'is-info'}`;
      box.textContent = msg;
      box.style.display = 'grid';
      clearTimeout(window._statusTimer);
      window._statusTimer = setTimeout(() => {
        const el = document.getElementById('global-status');
        if (el) el.style.display = 'none';
      }, 4500);
    }

    function awardXP(amount, skillTag) {
      appState.xp += amount;
      const todayStr = new Date().toISOString().slice(0, 10);
      if (appState.lastStudyDay !== todayStr) {
        appState.streak = (appState.streak || 0) + 1;
        appState.lastStudyDay = todayStr;
      }
      if (skillTag) {
        const arr = appState.practisedSkills[appState.activeLang] || [];
        if (!arr.includes(skillTag)) {
          arr.push(skillTag);
          appState.practisedSkills[appState.activeLang] = arr;
        }
      }
      playChime(true);
      saveState();
      renderKPIs();
    }

    function playChime(positive) {
      try {
        if (typeof Tone === 'undefined') return;
        if (Tone.context && Tone.context.state !== 'running') {
          Tone.start().catch(() => {});
        }
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.14, sustain: 0.02, release: 0.2 }
        }).toDestination();
        synth.volume.value = -16;
        if (positive) {
          synth.triggerAttackRelease('C5', '16n');
          setTimeout(() => synth.triggerAttackRelease('E5', '16n'), 90);
        } else {
          synth.triggerAttackRelease('D4', '16n');
        }
      } catch (e) {
        // Silent fallback when audio is blocked
      }
    }

    function speakText(text, langCode, rate) {
      if (!('speechSynthesis' in window)) {
        showStatus(`Audio synthesis is unavailable in this browser; read the phonetic guide provided.`, `info`);
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = langCode;
        utter.rate = rate || 1.0;
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langCode.slice(0, 2).toLowerCase()));
        if (match) utter.voice = match;
        window.speechSynthesis.speak(utter);
      } catch (err) {
        showStatus(`Audio playback could not start in this preview environment.`, `info`);
      }
    }

    /* ======================================================================
       3. GLOBAL SWITCHERS & TOP-LEVEL RENDERERS
       ====================================================================== */
    function setSupportLang(val) {
      appState.supportLang = val;
      saveState();
      renderAll();
    }

    function setPathway(val) {
      appState.pathway = val;
      if (PATHWAYS[val]) {
        quizSession.tier = PATHWAYS[val].tier;
      }
      saveState();
      renderAll();
    }

    function selectTargetLang(langId) {
      if (!LANGUAGES[langId]) return;
      appState.activeLang = langId;
      appState.vocabIdx = 0;
      appState.grammarIdx = 0;
      appState.listenIdx = 0;
      appState.traceIdx = 0;
      selectedGloss = null;
      quizSession.active = false;
      quizSession.answeredCurrent = null;
      saveState();
      renderAll();
    }

    function switchView(viewId) {
      appState.activeView = viewId;
      saveState();
      document.querySelectorAll('.workspace-view').forEach(el => {
        el.classList.toggle('is-active', el.id === `view-${viewId}`);
      });
      document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.view === viewId);
      });
      renderActiveView();
    }

    function switchSkill(skillId) {
      appState.activeSkill = skillId;
      selectedGloss = null;
      saveState();
      document.querySelectorAll('.skill-pill').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.skill === skillId);
      });
      renderStudio();
    }

    function getRankName(xp) {
      if (xp >= 450) return `Polyglot Scholar`;
      if (xp >= 250) return `Fluent Navigator`;
      if (xp >= 120) return `Active Learner`;
      if (xp >= 30) return `Apprentice`;
      return `Novice`;
    }

    function getLangMastery(langId) {
      const skills = (appState.practisedSkills[langId] || []).length;
      const vocabCount = (appState.masteredVocab[langId] || []).length;
      const totalVocab = LANGUAGES[langId].vocab.length;
      const examScore = appState.examScores[langId] ? appState.examScores[langId].pct : 0;
      const raw = Math.round(((skills / 6) * 55) + ((vocabCount / Math.max(1, totalVocab)) * 25) + ((examScore / 100) * 20));
      return Math.min(100, raw);
    }

    function renderMastheadLabels() {
      const ui = SUPPORT_UI[appState.supportLang] || SUPPORT_UI.en;
      const lblSup = document.getElementById('lbl-support-lang');
      const lblPath = document.getElementById('lbl-pathway');
      const tagline = document.getElementById('ui-tagline');
      const supSel = document.getElementById('support-lang-select');
      const pathSel = document.getElementById('pathway-select');
      if (lblSup) lblSup.textContent = ui.lblSupport;
      if (lblPath) lblPath.textContent = ui.lblPathway;
      if (tagline) tagline.textContent = ui.tagline;
      if (supSel) supSel.value = appState.supportLang;
      if (pathSel) pathSel.value = appState.pathway;
    }

    function renderLangStrip() {
      const container = document.getElementById('lang-strip');
      if (!container) return;
      container.innerHTML = Object.values(LANGUAGES).map(lang => {
        const active = lang.id === appState.activeLang;
        const pct = getLangMastery(lang.id);
        return `
          <button type="button" class="lang-btn ${active ? 'is-active' : ''}" onclick="selectTargetLang('${lang.id}')">
            <span class="lang-swatch ${lang.swatchClass}">${lang.code}</span>
            <span class="lang-meta">
              <span class="lang-name">${lang.name}</span>
              <span class="lang-sub">${lang.native} · <span class="tabular">${pct}%</span></span>
            </span>
          </button>
        `;
      }).join('');
    }

    function renderKPIs() {
      const lang = LANGUAGES[appState.activeLang];
      const xpEl = document.getElementById('kpi-xp-val');
      const xpSub = document.getElementById('kpi-xp-sub');
      const stEl = document.getElementById('kpi-streak-val');
      const stSub = document.getElementById('kpi-streak-sub');
      const mastEl = document.getElementById('kpi-mastery-val');
      const mastBar = document.getElementById('kpi-mastery-bar');
      const mastSub = document.getElementById('kpi-mastery-sub');
      const exEl = document.getElementById('kpi-exam-val');
      const exSub = document.getElementById('kpi-exam-sub');

      if (xpEl) xpEl.textContent = `${appState.xp} XP · ${getRankName(appState.xp)}`;
      if (xpSub) xpSub.textContent = appState.xp === 0
        ? `Complete any card, quiz, or task to earn XP`
        : `Single account active across 5 languages`;

      if (stEl) stEl.textContent = `${appState.streak} ${appState.streak === 1 ? 'day' : 'days'}`;
      const todayStr = new Date().toISOString().slice(0, 10);
      if (stSub) stSub.textContent = appState.lastStudyDay === todayStr
        ? `Today’s session recorded`
        : `Today: ready to check in`;

      const pct = getLangMastery(lang.id);
      const skillsDone = (appState.practisedSkills[lang.id] || []).length;
      if (mastEl) mastEl.textContent = `${pct}% · ${lang.name}`;
      if (mastBar) mastBar.style.width = `${pct}%`;
      if (mastSub) mastSub.textContent = `${skillsDone} of 6 skill areas practised`;

      const ex = appState.examScores[lang.id];
      if (exEl) exEl.textContent = ex ? `${ex.pct}%` : `Not tested`;
      if (exSub) exSub.textContent = ex
        ? `${ex.correct}/${ex.total} correct · ${PATHWAYS[appState.pathway].short}`
        : `Take adaptive quiz in Exam Prep`;
    }

    /* ======================================================================
       4. WORKSPACE 1: LEARNING STUDIO (ALL 6 SKILLS)
       ====================================================================== */
    function renderStudio() {
      const lang = LANGUAGES[appState.activeLang];
      const ui = SUPPORT_UI[appState.supportLang] || SUPPORT_UI.en;
      const heading = document.getElementById('studio-heading');
      if (heading) {
        heading.innerHTML = `${lang.name} <strong>${appState.activeSkill} studio</strong>`;
      }
      document.querySelectorAll('.skill-pill').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.skill === appState.activeSkill);
      });

      const s = appState.activeSkill;
      ['vocab', 'grammar', 'reading', 'writing', 'listening', 'speaking'].forEach(key => {
        const sub = document.getElementById(`skill-panel-${key}`);
        if (sub) sub.style.display = key === s ? 'block' : 'none';
      });

      const sidePanel = document.getElementById('skill-companion-panel');
      if (!sidePanel) return;

      if (s === 'vocab') renderVocabSkill(document.getElementById('skill-panel-vocab'), sidePanel, lang, ui);
      else if (s === 'grammar') renderGrammarSkill(document.getElementById('grammar-dynamic'), sidePanel, lang, ui);
      else if (s === 'reading') renderReadingSkill(document.getElementById('reading-dynamic'), sidePanel, lang, ui);
      else if (s === 'writing') renderWritingSkill(document.getElementById('writing-dynamic'), sidePanel, lang, ui);
      else if (s === 'listening') renderListeningSkill(sidePanel, lang, ui);
      else if (s === 'speaking') renderSpeakingSkill(document.getElementById('speaking-dynamic'), sidePanel, lang, ui);

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderVocabSkill(mainPanel, sidePanel, lang, ui) {
      const list = lang.vocab;
      const idx = Math.max(0, Math.min(appState.vocabIdx, list.length - 1));
      const item = list[idx];
      const mastered = (appState.masteredVocab[lang.id] || []).includes(idx);
      const supKey = appState.supportLang;

      mainPanel.innerHTML = `
        <div class="vocab-stage">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
            <span class="tag">${item.level} · ${item.pos}</span>
            <span class="label tabular">Card ${idx + 1} of ${list.length}</span>
          </div>

          <div class="target-phrase-box ${lang.swatchClass}">
            <div class="target-phrase-main" lang="${lang.id}">${item.word}</div>
            <div class="phonetic-line">${item.phonetic}</div>
            <p style="margin:var(--space-xs) 0 0; font-size:1.0625rem;" lang="${lang.id}">“${item.context}”</p>
          </div>

          <div class="translation-callout">
            <span class="label" lang="${supKey}">${ui.contextNoteTitle}</span>
            <div lang="${supKey}">${item.trans[supKey]}</div>
            <div class="caption-sage" lang="${supKey}">${item.tip[supKey]}</div>
          </div>

          <div class="btn-row">
            <button type="button" class="btn btn-secondary" onclick="speakCurrentVocab(1.0)">
              <i data-lucide="volume-2" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>${ui.hearBtn}</span>
            </button>
            <button type="button" class="btn btn-secondary" onclick="speakCurrentVocab(0.75)">
              <span>${ui.slowBtn}</span>
            </button>
            <button type="button" class="btn ${mastered ? 'btn-subtle' : 'btn-primary'}" onclick="markVocabPractised(${idx})">
              <i data-lucide="check" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>${mastered ? 'Practised ✓' : ui.markMastered}</span>
            </button>
          </div>

          <div class="sub-divider btn-row" style="justify-content:space-between;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="stepVocab(-1)" ${idx === 0 ? 'disabled' : ''}>${ui.prevItem}</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="stepVocab(1)" ${idx === list.length - 1 ? 'disabled' : ''}>${ui.nextItem}</button>
          </div>
        </div>
      `;

      sidePanel.innerHTML = `
        <span class="label">Contextual learning method</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">Why full-sentence cards matter</h3>
        <p class="prose-limit" style="color:var(--on-surface-variant);">
          Research into mobile language apps shows isolated word lists rarely build communicative fluency. Each Lingo Mate card embeds target vocabulary in a Sri Lankan or everyday school scenario with ${ui.name} explanations.
        </p>
        <div class="sub-divider">
          <span class="label">Cards practised in ${lang.name}</span>
          <div style="margin-top:var(--space-xs);" class="tabular">
            <strong>${(appState.masteredVocab[lang.id] || []).length} / ${list.length}</strong> core contextual phrases
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width:${Math.round(((appState.masteredVocab[lang.id] || []).length / list.length) * 100)}%"></div>
          </div>
        </div>
        <div class="sub-divider">
          <span class="label">Exam alignment</span>
          <p style="margin:var(--space-xs) 0 0; font-size:0.9375rem;">${lang.intlExam} · ${PATHWAYS[appState.pathway].short}</p>
        </div>
      `;
    }

    function speakCurrentVocab(rate) {
      const lang = LANGUAGES[appState.activeLang];
      const item = lang.vocab[appState.vocabIdx] || lang.vocab[0];
      speakText(item.context, lang.bcp47, rate);
    }

    function stepVocab(delta) {
      const list = LANGUAGES[appState.activeLang].vocab;
      appState.vocabIdx = Math.max(0, Math.min(list.length - 1, appState.vocabIdx + delta));
      saveState();
      renderStudio();
    }

    function markVocabPractised(idx) {
      const arr = appState.masteredVocab[appState.activeLang] || [];
      if (!arr.includes(idx)) {
        arr.push(idx);
        appState.masteredVocab[appState.activeLang] = arr;
        awardXP(15, 'vocab');
        showStatus(`Vocabulary card marked practised (+15 XP).`, `ok`);
      } else {
        showStatus(`This card is already recorded in your practised deck.`, `info`);
      }
      renderLangStrip();
      renderStudio();
    }

    function renderGrammarSkill(mainPanel, sidePanel, lang, ui) {
      if (!mainPanel) return;
      const list = lang.grammar;
      const idx = Math.max(0, Math.min(appState.grammarIdx, list.length - 1));
      const g = list[idx];
      const supKey = appState.supportLang;

      const fb = document.getElementById('grammar-feedback');
      if (fb) fb.style.display = 'none';

      mainPanel.innerHTML = `
        <div style="display:grid; gap:var(--space-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
            <span class="tag tag-slate">Grammar Builder · Module ${idx + 1}/${list.length}</span>
            <div class="btn-row">
              <button type="button" class="btn btn-secondary btn-sm" onclick="stepGrammar(-1)" ${idx === 0 ? 'disabled' : ''}>${ui.prevItem}</button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="stepGrammar(1)" ${idx === list.length - 1 ? 'disabled' : ''}>${ui.nextItem}</button>
            </div>
          </div>

          <h3 class="panel-title">${g.title}</h3>

          <div class="translation-callout">
            <span class="label" lang="${supKey}">${ui.contextNoteTitle}</span>
            <div lang="${supKey}">${g.rule[supKey]}</div>
          </div>

          <div class="sub-divider">
            <span class="label">Interactive sentence check</span>
            <p style="margin:var(--space-xs) 0;">${g.prompt}</p>
            <div class="target-phrase-box ${lang.swatchClass}" style="padding:var(--space-md);">
              <div style="font-size:1.125rem; font-weight:500;" lang="${lang.id}">${g.examples[0]}</div>
            </div>
          </div>

          <div class="option-list" id="grammar-options">
            ${g.options.map((opt, i) => `
              <button type="button" class="option-btn" onclick="checkGrammarOption(${i})" id="gopt-${i}">
                <span lang="${lang.id}">${opt}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      sidePanel.innerHTML = `
        <span class="label">Explanatory feedback</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">Inductive + Explicit rule design</h3>
        <p style="color:var(--on-surface-variant);">
          Instead of a bare red or green tick, every grammar check explains <em>why</em> a form fits or breaks the rule, with contrasting examples in ${ui.name}.
        </p>
        <div class="sub-divider">
          <span class="label">Pathway emphasis</span>
          <p style="margin:var(--space-xs) 0 0;">${appState.pathway === 'al' ? lang.alFocus : lang.olFocus}</p>
        </div>
      `;
    }

    function stepGrammar(delta) {
      const list = LANGUAGES[appState.activeLang].grammar;
      appState.grammarIdx = Math.max(0, Math.min(list.length - 1, appState.grammarIdx + delta));
      saveState();
      renderStudio();
    }

    function checkGrammarOption(chosen) {
      const lang = LANGUAGES[appState.activeLang];
      const g = lang.grammar[appState.grammarIdx] || lang.grammar[0];
      const fb = document.getElementById('grammar-feedback');
      const isRight = chosen === g.correct;

      g.options.forEach((_, i) => {
        const btn = document.getElementById(`gopt-${i}`);
        if (!btn) return;
        btn.classList.remove('is-correct', 'is-wrong');
        if (i === g.correct) btn.classList.add('is-correct');
        else if (i === chosen && !isRight) btn.classList.add('is-wrong');
      });

      if (fb) {
        const extra = appState.supportLang === 'si' ? (g.siFeedback || '') : appState.supportLang === 'ta' ? (g.ta || '') : '';
        fb.className = `feedback-box ${isRight ? 'is-ok' : 'is-err'}`;
        fb.innerHTML = `
          <strong>${isRight ? 'Correct (+20 XP)' : 'Not quite — see why:'}</strong>
          <div>${g.explanations[chosen]}</div>
          ${extra ? `<div class="caption-sage" lang="${appState.supportLang}">${extra}</div>` : ''}
        `;
        fb.style.display = 'grid';
      }

      if (isRight) {
        awardXP(20, 'grammar');
        renderLangStrip();
      } else {
        playChime(false);
      }
    }

    function renderReadingSkill(mainPanel, sidePanel, lang, ui) {
      if (!mainPanel) return;
      const r = lang.reading;
      const supKey = appState.supportLang;
      const fb = document.getElementById('reading-feedback');
      if (fb) fb.style.display = 'none';

      mainPanel.innerHTML = `
        <div style="display:grid; gap:var(--space-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
            <span class="tag">${r.level}</span>
            <button type="button" class="btn btn-secondary btn-sm" onclick="speakReadingPassage()">
              <i data-lucide="volume-2" style="width:15px;height:15px;" aria-hidden="true"></i>
              <span>Read aloud</span>
            </button>
          </div>

          <h3 class="panel-title" lang="${lang.id}">${r.title}</h3>
          <p class="label">Click any highlighted phrase below to view its ${ui.name} gloss.</p>

          <div class="target-phrase-box ${lang.swatchClass}" style="line-height:1.8; font-size:1.0625rem;" lang="${lang.id}">
            <div>
              ${r.segments.map((seg, i) => seg.gloss
                ? `<button type="button" class="gloss-chip ${selectedGloss === i ? 'is-selected' : ''}" onclick="selectGloss(${i})">${seg.text}</button>`
                : `<span>${seg.text}</span>`
              ).join('')}
            </div>
          </div>

          <div id="gloss-drawer" class="translation-callout" style="${selectedGloss === null ? 'display:none;' : ''}">
            ${selectedGloss !== null && r.segments[selectedGloss] && r.segments[selectedGloss].gloss ? `
              <span class="label" lang="${supKey}">${r.segments[selectedGloss].text} — ${ui.contextNoteTitle}</span>
              <div lang="${supKey}">${r.segments[selectedGloss].gloss[supKey]}</div>
            ` : ''}
          </div>

          <div class="sub-divider">
            <span class="label">Comprehension check</span>
            <p style="margin:var(--space-xs) 0;">${r.question}</p>
            <div class="option-list">
              ${r.options.map((opt, i) => `
                <button type="button" class="option-btn" id="ropt-${i}" onclick="checkReadingOption(${i})">
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      sidePanel.innerHTML = `
        <span class="label">Reading strategy</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">Guided comprehension</h3>
        <p style="color:var(--on-surface-variant);">
          GCE O/L and A/L reading papers test inference from context rather than translating every word. Inspect only the highlighted phrases you need, then answer the question.
        </p>
        <div class="sub-divider">
          <span class="label">Quick gloss preview</span>
          <ul style="padding-left:var(--space-md); margin:var(--space-xs) 0; display:grid; gap:var(--space-xs);">
            ${r.segments.filter(s => s.gloss).map(s => `
              <li><strong lang="${lang.id}">${s.text}</strong>: <span lang="${supKey}">${s.gloss[supKey]}</span></li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    function selectGloss(segIdx) {
      selectedGloss = segIdx;
      renderStudio();
    }

    function speakReadingPassage() {
      const lang = LANGUAGES[appState.activeLang];
      const fullText = lang.reading.segments.map(s => s.text).join('');
      speakText(fullText, lang.bcp47, 0.95);
    }

    function checkReadingOption(chosen) {
      const lang = LANGUAGES[appState.activeLang];
      const r = lang.reading;
      const isRight = chosen === r.correct;
      r.options.forEach((_, i) => {
        const btn = document.getElementById(`ropt-${i}`);
        if (!btn) return;
        btn.classList.remove('is-correct', 'is-wrong');
        if (i === r.correct) btn.classList.add('is-correct');
        else if (i === chosen && !isRight) btn.classList.add('is-wrong');
      });
      const fb = document.getElementById('reading-feedback');
      if (fb) {
        fb.className = `feedback-box ${isRight ? 'is-ok' : 'is-err'}`;
        fb.innerHTML = `
          <strong>${isRight ? 'Well read (+20 XP)' : 'Check the passage again'}</strong>
          <div lang="${appState.supportLang}">${r.explain[appState.supportLang]}</div>
        `;
        fb.style.display = 'grid';
      }
      if (isRight) {
        awardXP(20, 'reading');
        renderLangStrip();
      } else {
        playChime(false);
      }
    }

    function renderWritingSkill(mainPanel, sidePanel, lang, ui) {
      if (!mainPanel) return;
      const w = lang.writing;
      const supKey = appState.supportLang;
      const isCanvas = w.type === 'canvas';
      const traceList = lang.traceChars || [];
      const currentChar = traceList[appState.traceIdx] || { ch: '', hint: '' };

      mainPanel.innerHTML = `
        <div style="display:grid; gap:var(--space-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
            <span class="tag tag-slate">${isCanvas ? 'Script Canvas & Written Production' : 'Guided Composition Studio'}</span>
          </div>

          <div class="translation-callout">
            <span class="label" lang="${supKey}">${ui.contextNoteTitle}</span>
            <div lang="${supKey}">${w.prompt[supKey]}</div>
          </div>
        </div>
      `;

      const canvasSec = document.getElementById('writing-canvas-section');
      const accentsSec = document.getElementById('writing-accents-section');
      const traceLbl = document.getElementById('writing-trace-label');
      const accentsKeys = document.getElementById('writing-accents-keys');
      const respLbl = document.getElementById('writing-response-lbl');
      const respTa = document.getElementById('writing-response');
      const fb = document.getElementById('writing-feedback');

      if (fb) fb.style.display = 'none';
      if (respLbl) respLbl.textContent = `Write your ${lang.name} sentence(s)`;
      if (respTa) respTa.setAttribute('lang', lang.id);

      if (canvasSec) canvasSec.style.display = isCanvas ? 'grid' : 'none';
      if (accentsSec) accentsSec.style.display = isCanvas ? 'none' : 'block';
      if (isCanvas && traceLbl) {
        traceLbl.innerHTML = `Character pad: <strong style="color:var(--on-surface);" lang="${lang.id}">${currentChar.ch}</strong> — ${currentChar.hint}`;
      }
      if (!isCanvas && accentsKeys) {
        accentsKeys.innerHTML = (lang.accents || []).map(ch => `
          <button type="button" class="accent-key" onclick="insertAccentChar('${ch}')">${ch}</button>
        `).join('');
      }

      sidePanel.innerHTML = `
        <span class="label">Production rubric</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">Addressing writing under-practice</h3>
        <p style="color:var(--on-surface-variant);">
          Reviews of commercial mobile apps highlight that productive writing is the most neglected language skill. Use the guided prompt and model comparison to build real sentence fluency.
        </p>
        <div class="sub-divider">
          <span class="label">Suggested target keywords</span>
          <div class="badge-row" style="margin-top:var(--space-xs);">
            ${w.keywords.map(k => `<span class="tag" lang="${lang.id}">${k}</span>`).join('')}
          </div>
        </div>
      `;

      if (isCanvas) {
        setTimeout(() => initWritingCanvas(currentChar.ch), 20);
      }
    }

    function initWritingCanvas(ghostChar) {
      const canvas = document.getElementById('writing-canvas');
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(280, Math.floor(rect.width));
      canvas.height = 220;
      const ctx = canvas.getContext('2d');
      writingCanvasCtx = ctx;
      strokeCount = 0;

      const styles = getComputedStyle(document.documentElement);
      const gridColor = styles.getPropertyValue('--outline-variant').trim();
      const inkColor = styles.getPropertyValue('--on-surface').trim();

      drawCanvasGuide(ctx, canvas.width, canvas.height, gridColor, ghostChar);

      function getPos(e) {
        const b = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - b.left, y: clientY - b.top };
      }

      function startDraw(e) {
        isDrawing = true;
        strokeCount += 1;
        const p = getPos(e);
        ctx.strokeStyle = inkColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      }
      function moveDraw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      function endDraw() {
        isDrawing = false;
      }

      canvas.onmousedown = startDraw;
      canvas.onmousemove = moveDraw;
      canvas.onmouseup = endDraw;
      canvas.onmouseleave = endDraw;
      canvas.ontouchstart = startDraw;
      canvas.ontouchmove = moveDraw;
      canvas.ontouchend = endDraw;
    }

    function drawCanvasGuide(ctx, w, h, gridColor, ghostChar) {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.strokeStyle = gridColor;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      if (ghostChar) {
        ctx.fillStyle = gridColor;
        ctx.font = '500 132px Outfit, "Noto Sans JP", "Noto Sans KR", "Noto Sans SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ghostChar, w / 2, h / 2 + 4);
      }
      ctx.restore();
    }

    function clearWritingCanvas() {
      const lang = LANGUAGES[appState.activeLang];
      const traceList = lang.traceChars || [];
      const currentChar = traceList[appState.traceIdx] || { ch: '' };
      initWritingCanvas(currentChar.ch);
    }

    function nextTraceChar() {
      const traceList = LANGUAGES[appState.activeLang].traceChars || [];
      if (traceList.length === 0) return;
      appState.traceIdx = (appState.traceIdx + 1) % traceList.length;
      saveState();
      renderStudio();
    }

    function insertAccentChar(ch) {
      const ta = document.getElementById('writing-response');
      if (!ta) return;
      const start = ta.selectionStart || 0;
      const end = ta.selectionEnd || 0;
      ta.value = ta.value.slice(0, start) + ch + ta.value.slice(end);
      ta.focus();
      ta.setSelectionRange(start + ch.length, start + ch.length);
    }

    function fillModelWriting() {
      const ta = document.getElementById('writing-response');
      const lang = LANGUAGES[appState.activeLang];
      if (ta) ta.value = lang.writing.model;
    }

    function evaluateWriting() {
      const ta = document.getElementById('writing-response');
      const fb = document.getElementById('writing-feedback');
      const lang = LANGUAGES[appState.activeLang];
      if (!ta || !fb) return;

      const text = ta.value.trim();
      const lower = text.toLowerCase();
      const matched = lang.writing.keywords.filter(k => lower.includes(k.toLowerCase()));

      if (text.length < 6 && strokeCount === 0) {
        fb.className = 'feedback-box is-err';
        fb.innerHTML = `<strong>Nothing written yet</strong><div>Type at least one short sentence or trace a character on the pad before checking.</div>`;
        fb.style.display = 'grid';
        return;
      }

      fb.className = 'feedback-box is-ok';
      fb.innerHTML = `
        <strong>Writing practice recorded (+20 XP)</strong>
        <div>Matched key vocabulary: ${matched.length > 0 ? matched.join(', ') : 'completed freehand / custom phrasing'}.</div>
        <div class="caption-sage">Model reference: <span lang="${lang.id}">${lang.writing.model}</span></div>
      `;
      fb.style.display = 'grid';
      awardXP(20, 'writing');
      renderLangStrip();
    }

    function renderListeningSkill(sidePanel, lang, ui) {
      const list = lang.listening;
      const idx = Math.max(0, Math.min(appState.listenIdx, list.length - 1));
      const item = list[idx];
      const supKey = appState.supportLang;

      const headerEl = document.getElementById('listen-header');
      const playerBox = document.getElementById('listen-player-box');
      const slowBtn = document.getElementById('listen-slow-btn');
      const transEl = document.getElementById('listen-transcript');
      const qArea = document.getElementById('listen-question-area');
      const fb = document.getElementById('listen-feedback');

      if (fb) fb.style.display = 'none';
      if (playerBox) playerBox.className = `target-phrase-box ${lang.swatchClass}`;
      if (slowBtn) slowBtn.innerHTML = `<span>${ui.slowBtn}</span>`;

      if (headerEl) {
        headerEl.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
            <span class="tag tag-slate">${item.speaker} · Track ${idx + 1}/${list.length}</span>
            <div class="btn-row">
              <button type="button" class="btn btn-secondary btn-sm" onclick="stepListen(-1)" ${idx === 0 ? 'disabled' : ''}>${ui.prevItem}</button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="stepListen(1)" ${idx === list.length - 1 ? 'disabled' : ''}>${ui.nextItem}</button>
            </div>
          </div>
        `;
      }

      if (transEl) {
        transEl.style.display = 'none';
        transEl.innerHTML = `
          <div style="font-size:1.0625rem; font-weight:500;" lang="${lang.id}">${item.target}</div>
          <div class="caption-sage" lang="${supKey}">${item.trans[supKey]}</div>
        `;
      }

      if (qArea) {
        qArea.innerHTML = `
          <div class="sub-divider">
            <span class="label">Listening comprehension</span>
            <p style="margin:var(--space-xs) 0;">${item.question}</p>
            <div class="option-list">
              ${item.options.map((opt, i) => `
                <button type="button" class="option-btn" id="lopt-${i}" onclick="checkListenOption(${i})">
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }

      sidePanel.innerHTML = `
        <span class="label">Listening tips</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">Two-pass listening routine</h3>
        <ol style="padding-left:var(--space-md); color:var(--on-surface-variant); display:grid; gap:var(--space-xs);">
          <li>Listen once at natural speed without revealing the transcript.</li>
          <li>Replay at <strong>0.75×</strong> to catch numbers, particles, or verb endings.</li>
          <li>Reveal the transcript to compare sound with script and ${ui.name} meaning.</li>
        </ol>
      `;
    }

    function playListenAudio(rate) {
      const lang = LANGUAGES[appState.activeLang];
      const item = lang.listening[appState.listenIdx] || lang.listening[0];
      speakText(item.target, lang.bcp47, rate);
    }

    function toggleTranscript() {
      const el = document.getElementById('listen-transcript');
      if (!el) return;
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }

    function stepListen(delta) {
      const list = LANGUAGES[appState.activeLang].listening;
      appState.listenIdx = Math.max(0, Math.min(list.length - 1, appState.listenIdx + delta));
      saveState();
      renderStudio();
    }

    function checkListenOption(chosen) {
      const item = LANGUAGES[appState.activeLang].listening[appState.listenIdx] || LANGUAGES[appState.activeLang].listening[0];
      const isRight = chosen === item.correct;
      item.options.forEach((_, i) => {
        const btn = document.getElementById(`lopt-${i}`);
        if (!btn) return;
        btn.classList.remove('is-correct', 'is-wrong');
        if (i === item.correct) btn.classList.add('is-correct');
        else if (i === chosen && !isRight) btn.classList.add('is-wrong');
      });
      const fb = document.getElementById('listen-feedback');
      if (fb) {
        fb.className = `feedback-box ${isRight ? 'is-ok' : 'is-err'}`;
        fb.innerHTML = `
          <strong>${isRight ? 'Accurate listening (+20 XP)' : 'Listen once more at 0.75×'}</strong>
          <div lang="${appState.supportLang}">${item.trans[appState.supportLang]}</div>
        `;
        fb.style.display = 'grid';
      }
      if (isRight) {
        awardXP(20, 'listening');
        renderLangStrip();
      } else {
        playChime(false);
      }
    }

    function renderSpeakingSkill(mainPanel, sidePanel, lang, ui) {
      if (!mainPanel) return;
      const sp = lang.speaking;
      const supKey = appState.supportLang;
      const fb = document.getElementById('speaking-feedback');
      if (fb) fb.style.display = 'none';

      mainPanel.innerHTML = `
        <div style="display:grid; gap:var(--space-md);">
          <span class="tag tag-slate">Pronunciation &amp; Oral Fluency</span>

          <div class="target-phrase-box ${lang.swatchClass}">
            <div class="target-phrase-main" lang="${lang.id}">${sp.phrase}</div>
            <div class="phonetic-line">${sp.phonetic}</div>
          </div>

          <div class="translation-callout">
            <span class="label" lang="${supKey}">${ui.contextNoteTitle}</span>
            <div lang="${supKey}">${sp.meaning[supKey]}</div>
            <div class="caption-sage" lang="${supKey}">${sp.pronunciationTip[supKey]}</div>
          </div>

          <div class="btn-row">
            <button type="button" class="btn btn-secondary" onclick="speakModelSpeaking(1.0)">
              <i data-lucide="volume-2" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>Hear model pronunciation</span>
            </button>
            <button type="button" class="btn btn-secondary" onclick="speakModelSpeaking(0.75)">
              <span>${ui.slowBtn}</span>
            </button>
            <button type="button" class="btn btn-primary" onclick="attemptSpeechCheck()">
              <i data-lucide="mic" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>Record / Self-check (+20 XP)</span>
            </button>
          </div>
        </div>
      `;

      sidePanel.innerHTML = `
        <span class="label">Oral exam readiness</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">Shadowing technique</h3>
        <p style="color:var(--on-surface-variant);">
          Play the model phrase, wait half a second, and repeat aloud matching rhythm and intonation. If microphone speech recognition is restricted by your browser environment, use the guided oral checklist to log your practice.
        </p>
        <div class="sub-divider">
          <span class="label">Pronunciation checklist</span>
          <div class="task-row"><input type="checkbox" class="task-check" id="sp-chk-1"><label for="sp-chk-1">Matched syllable rhythm and stress</label></div>
          <div class="task-row"><input type="checkbox" class="task-check" id="sp-chk-2"><label for="sp-chk-2">Checked vowel / tone accuracy</label></div>
        </div>
      `;
    }

    function speakModelSpeaking(rate) {
      const lang = LANGUAGES[appState.activeLang];
      speakText(lang.speaking.phrase, lang.bcp47, rate);
    }

    function attemptSpeechCheck() {
      const lang = LANGUAGES[appState.activeLang];
      const fb = document.getElementById('speaking-feedback');
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.lang = lang.bcp47;
          rec.interimResults = false;
          rec.maxAlternatives = 1;
          if (fb) {
            fb.className = 'feedback-box is-info';
            fb.innerHTML = `<strong>Listening…</strong><div>Speak the phrase clearly into your microphone now.</div>`;
            fb.style.display = 'grid';
          }
          rec.onresult = (ev) => {
            const heard = ev.results[0][0].transcript;
            if (fb) {
              fb.className = 'feedback-box is-ok';
              fb.innerHTML = `<strong>Oral practice recorded (+20 XP)</strong><div>Heard: “${heard}”</div>`;
            }
            awardXP(20, 'speaking');
            renderLangStrip();
          };
          rec.onerror = () => {
            completeSpeakingFallback(fb);
          };
          rec.start();
          return;
        } catch (err) {
          completeSpeakingFallback(fb);
          return;
        }
      }
      completeSpeakingFallback(fb);
    }

    function completeSpeakingFallback(fb) {
      if (fb) {
        fb.className = 'feedback-box is-ok';
        fb.innerHTML = `<strong>Oral shadowing session logged (+20 XP)</strong><div>Speech recognition microphone access is unavailable in this sandbox; self-assessed oral practice has been recorded.</div>`;
        fb.style.display = 'grid';
      }
      awardXP(20, 'speaking');
      renderLangStrip();
    }

    /* ======================================================================
       5. WORKSPACE 2: EXAM PREPARATION (ADAPTIVE MOCK + CURRICULUM)
       ====================================================================== */
    function renderExamView() {
      const lang = LANGUAGES[appState.activeLang];
      const pathwayObj = PATHWAYS[appState.pathway];
      const quizPanel = document.getElementById('exam-quiz-panel');
      const bluePanel = document.getElementById('exam-blueprint-panel');
      if (!quizPanel || !bluePanel) return;

      if (!quizSession.active) {
        const last = appState.examScores[lang.id];
        quizPanel.innerHTML = `
          <span class="label">Adaptive diagnostic assessment</span>
          <h2 class="headline section-title" style="margin-top:var(--space-xs);">${lang.name} <strong>exam simulator</strong></h2>
          <p class="prose-limit" style="color:var(--on-surface-variant);">
            Tailored for <strong>${pathwayObj.label}</strong> and <strong>${lang.intlExam}</strong>. Difficulty adapts dynamically after each question and provides explanatory corrective feedback in ${SUPPORT_UI[appState.supportLang].name}.
          </p>
          ${last ? `
            <div class="feedback-box is-info" style="margin:var(--space-md) 0;">
              <strong>Previous score: ${last.pct}% (${last.correct}/${last.total})</strong>
              <div>Last completed on ${last.date}</div>
            </div>
          ` : ''}
          <div class="btn-row" style="margin-top:var(--space-md);">
            <button type="button" class="btn btn-primary" onclick="startAdaptiveQuiz()">
              <i data-lucide="play-circle" style="width:16px;height:16px;" aria-hidden="true"></i>
              <span>Start adaptive assessment</span>
            </button>
          </div>
        `;
      } else {
        const qList = lang.examQuestions;
        if (quizSession.questionIdx >= qList.length) {
          const pct = Math.round((quizSession.correctCount / qList.length) * 100);
          quizPanel.innerHTML = `
            <span class="label">Assessment complete</span>
            <h2 class="headline section-title" style="margin-top:var(--space-xs);">Score: <strong>${pct}%</strong> (${quizSession.correctCount}/${qList.length})</h2>
            <p style="color:var(--on-surface-variant);">
              Final adaptive difficulty reached: Tier ${quizSession.tier}/3. Results saved to your ${lang.name} readiness profile.
            </p>
            <div class="btn-row" style="margin-top:var(--space-md);">
              <button type="button" class="btn btn-primary" onclick="startAdaptiveQuiz()">Retake assessment</button>
              <button type="button" class="btn btn-secondary" onclick="switchView('planner')">Update study plan</button>
            </div>
          `;
        } else {
          const q = qList[quizSession.questionIdx];
          const answered = quizSession.answeredCurrent;
          quizPanel.innerHTML = `
            <div style="display:grid; gap:var(--space-md);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
                <span class="tag tag-slate">${q.skill} · Tier ${q.tier}</span>
                <span class="label tabular">Question ${quizSession.questionIdx + 1} of ${qList.length}</span>
              </div>

              <h3 class="panel-title">${q.q}</h3>

              <div class="option-list">
                ${q.options.map((opt, i) => {
                  let cls = '';
                  if (answered !== null) {
                    if (i === q.correct) cls = 'is-correct';
                    else if (i === answered && answered !== q.correct) cls = 'is-wrong';
                  }
                  return `
                    <button type="button" class="option-btn ${cls}" ${answered !== null ? 'disabled' : ''} onclick="answerExamQuestion(${i})">
                      <span lang="${lang.id}">${opt}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              ${answered !== null ? `
                <div class="feedback-box ${answered === q.correct ? 'is-ok' : 'is-err'}">
                  <strong>${answered === q.correct ? 'Correct (+25 XP)' : 'Explanatory correction'}</strong>
                  <div lang="${appState.supportLang}">${q.explain[appState.supportLang]}</div>
                </div>
                <div class="btn-row">
                  <button type="button" class="btn btn-primary" onclick="nextExamQuestion()">
                    ${quizSession.questionIdx === qList.length - 1 ? 'View final results' : 'Next question'}
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }
      }

      bluePanel.innerHTML = `
        <span class="label">Sri Lankan &amp; international syllabus map</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">${lang.name} examination pathways</h3>

        <div class="sub-divider">
          <span class="label">GCE O/L Structure (Sri Lanka)</span>
          <p style="margin:var(--space-xs) 0; font-size:0.9375rem;">
            Foreign languages sit among the 3 optional subjects alongside 6 compulsory subjects. Focus: ${lang.olFocus}
          </p>
        </div>

        <div class="sub-divider">
          <span class="label">GCE A/L Languages Stream</span>
          <p style="margin:var(--space-xs) 0; font-size:0.9375rem;">${lang.alFocus}</p>
        </div>

        <div class="sub-divider">
          <span class="label">International Certification</span>
          <p style="margin:var(--space-xs) 0; font-size:0.9375rem;"><strong>${lang.intlExam}</strong> — mapped directly to CEFR A1–C1 benchmarks.</p>
        </div>
      `;

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function startAdaptiveQuiz() {
      const lang = LANGUAGES[appState.activeLang];
      quizSession = {
        active: true,
        tier: PATHWAYS[appState.pathway] ? PATHWAYS[appState.pathway].tier : 2,
        questionIdx: 0,
        askedIds: [],
        correctCount: 0,
        totalAnswered: 0,
        answeredCurrent: null
      };
      // Sort questions starting closest to selected tier
      lang.examQuestions.sort((a, b) => Math.abs(a.tier - quizSession.tier) - Math.abs(b.tier - quizSession.tier));
      renderExamView();
    }

    function answerExamQuestion(chosenIdx) {
      const lang = LANGUAGES[appState.activeLang];
      const q = lang.examQuestions[quizSession.questionIdx];
      quizSession.answeredCurrent = chosenIdx;
      quizSession.totalAnswered += 1;
      if (chosenIdx === q.correct) {
        quizSession.correctCount += 1;
        quizSession.tier = Math.min(3, quizSession.tier + 1);
        awardXP(25, 'grammar');
      } else {
        quizSession.tier = Math.max(1, quizSession.tier - 1);
        playChime(false);
      }
      renderExamView();
    }

    function nextExamQuestion() {
      const lang = LANGUAGES[appState.activeLang];
      quizSession.questionIdx += 1;
      quizSession.answeredCurrent = null;
      if (quizSession.questionIdx >= lang.examQuestions.length) {
        const pct = Math.round((quizSession.correctCount / lang.examQuestions.length) * 100);
        appState.examScores[lang.id] = {
          pct,
          correct: quizSession.correctCount,
          total: lang.examQuestions.length,
          date: new Date().toISOString().slice(0, 10)
        };
        saveState();
        renderKPIs();
        renderLangStrip();
      }
      renderExamView();
    }

    /* ======================================================================
       6. WORKSPACE 3: PERSONALISED STUDY PLANNER & ANALYTICS
       ====================================================================== */
    function generateWeeklyTasks(lang, cfg) {
      const mins = Number(cfg.dailyMinutes) || 30;
      const focus = cfg.focusSkill || 'all';
      const baseTasks = [
        { id: `d1`, day: `Monday`, skill: `Vocabulary`, title: `Contextual cards + spaced repetition (${Math.round(mins * 0.6)} min)` },
        { id: `d2`, day: `Tuesday`, skill: `Grammar`, title: `Rule synthesis & sentence builder (${Math.round(mins * 0.7)} min)` },
        { id: `d3`, day: `Wednesday`, skill: `Listening`, title: `2-pass dialogue listening & shadowing (${mins} min)` },
        { id: `d4`, day: `Thursday`, skill: `Reading`, title: `Graded passage + inline gloss review (${mins} min)` },
        { id: `d5`, day: `Friday`, skill: `Writing`, title: `Script canvas / guided O/L–A/L paragraph (${mins} min)` },
        { id: `d6`, day: `Saturday`, skill: `Speaking`, title: `Oral fluency roleplay & self-rubric (${Math.round(mins * 0.8)} min)` },
        { id: `d7`, day: `Sunday`, skill: `Exam Prep`, title: `Timed adaptive quiz + error analysis (${mins} min)` }
      ];
      return baseTasks.map(t => ({
        ...t,
        priority: focus !== 'all' && t.skill.toLowerCase().includes(focus) ? 'Priority focus' : lang.name
      }));
    }

    function renderPlannerView() {
      const lang = LANGUAGES[appState.activeLang];
      const cfg = appState.planConfig;
      const builder = document.getElementById('planner-builder-panel');
      const analytics = document.getElementById('planner-analytics-panel');
      const badgesPanel = document.getElementById('badges-panel');
      if (!builder || !analytics || !badgesPanel) return;

      const tasks = generateWeeklyTasks(lang, cfg);
      const langChecks = appState.planChecklist[lang.id] || {};
      const doneCount = tasks.filter(t => langChecks[t.id]).length;
      const totalWeeklyHours = ((cfg.dailyMinutes * 7) / 60).toFixed(1);

      builder.innerHTML = `
        <div style="display:grid; gap:var(--space-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
            <div>
              <span class="label">Personalised schedule</span>
              <h2 class="headline section-title">${lang.name} <strong>weekly study plan</strong></h2>
            </div>
            <span class="tag tag-slate tabular">${doneCount}/7 completed · ${totalWeeklyHours} hrs/wk</span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(min(170px, 100%), 1fr)); gap:var(--space-md); align-items:end;">
            <div class="control-group">
              <label for="plan-mins" class="label">Daily study minutes (15–90)</label>
              <input type="number" id="plan-mins" min="15" max="90" step="5" value="${cfg.dailyMinutes}" onchange="updatePlanConfig('dailyMinutes', this.value)">
            </div>
            <div class="control-group">
              <label for="plan-weeks" class="label">Exam horizon (weeks)</label>
              <input type="number" id="plan-weeks" min="2" max="52" value="${cfg.horizonWeeks}" onchange="updatePlanConfig('horizonWeeks', this.value)">
            </div>
            <div class="control-group">
              <label for="plan-focus" class="label">Priority skill focus</label>
              <select id="plan-focus" onchange="updatePlanConfig('focusSkill', this.value)">
                <option value="all" ${cfg.focusSkill === 'all' ? 'selected' : ''}>Balanced (all 6 skills)</option>
                <option value="vocab" ${cfg.focusSkill === 'vocab' ? 'selected' : ''}>Vocabulary</option>
                <option value="grammar" ${cfg.focusSkill === 'grammar' ? 'selected' : ''}>Grammar</option>
                <option value="reading" ${cfg.focusSkill === 'reading' ? 'selected' : ''}>Reading</option>
                <option value="writing" ${cfg.focusSkill === 'writing' ? 'selected' : ''}>Writing</option>
                <option value="listening" ${cfg.focusSkill === 'listening' ? 'selected' : ''}>Listening</option>
                <option value="speaking" ${cfg.focusSkill === 'speaking' ? 'selected' : ''}>Speaking</option>
              </select>
            </div>
          </div>

          <div class="sub-divider">
            ${tasks.map(t => {
              const checked = !!langChecks[t.id];
              return `
                <div class="task-row">
                  <input type="checkbox" class="task-check" id="task-${t.id}" ${checked ? 'checked' : ''} onchange="togglePlanTask('${t.id}', this.checked)">
                  <label for="task-${t.id}" style="flex:1; cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; gap:var(--space-sm); flex-wrap:wrap;">
                      <strong>${t.day} · ${t.skill}</strong>
                      <span class="tag">${t.priority}</span>
                    </div>
                    <div style="color:var(--on-surface-variant); font-size:0.9375rem;">${t.title}</div>
                  </label>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      // Haven horizontal SVG bar chart across all 5 languages
      const langsArr = Object.values(LANGUAGES);
      const svgW = 460;
      const svgH = 220;
      const barMaxW = 240;

      analytics.innerHTML = `
        <span class="label">Single-account mastery overview</span>
        <h3 class="panel-title" style="margin-top:var(--space-xs);">Progress across all 5 languages</h3>
        <div class="chart-box" style="margin-top:var(--space-md);">
          <svg viewBox="0 0 ${svgW} ${svgH}" width="100%" height="220" role="img" aria-label="Bar chart showing percentage mastery across French, German, Japanese, Korean, and Chinese">
            ${langsArr.map((l, i) => {
              const y = 18 + i * 40;
              const pct = getLangMastery(l.id);
              const w = Math.max(4, Math.round((pct / 100) * barMaxW));
              const cls = l.id === appState.activeLang ? 'svg-bar-slate' : 'svg-bar-sage';
              return `
                <text x="4" y="${y + 16}" class="svg-label">${l.name}</text>
                <rect x="135" y="${y + 2}" width="${barMaxW}" height="18" rx="3" class="svg-bar-context" opacity="0.35" />
                <rect x="135" y="${y + 2}" width="${w}" height="18" rx="3" class="${cls}" />
                <text x="${135 + barMaxW + 12}" y="${y + 16}" class="svg-value tabular">${pct}%</text>
              `;
            }).join('')}
          </svg>
        </div>
        <div class="sub-divider">
          <span class="label">Estimated study hours over ${cfg.horizonWeeks} weeks</span>
          <div class="kpi-value tabular" style="margin-top:var(--space-xs);">${Math.round((cfg.dailyMinutes * 7 * cfg.horizonWeeks) / 60)} hours</div>
          <div class="caption-sage">Pathway target: ${PATHWAYS[appState.pathway].label}</div>
        </div>
      `;

      badgesPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm);">
          <div>
            <span class="label">Gamified milestones</span>
            <h3 class="panel-title">Earned learning badges</h3>
          </div>
          <span class="label tabular">${BADGES.filter(b => b.req(appState)).length} of ${BADGES.length} unlocked</span>
        </div>
        <div class="badge-row" style="margin-top:var(--space-md);">
          ${BADGES.map(b => {
            const earned = b.req(appState);
            return `
              <div class="badge-item ${earned ? 'is-earned' : ''}" title="${b.desc}">
                <i data-lucide="${earned ? 'award' : 'lock'}" style="width:14px;height:14px;" aria-hidden="true"></i>
                <span>${b.name} — ${b.desc}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function updatePlanConfig(key, val) {
      if (key === 'dailyMinutes') appState.planConfig.dailyMinutes = Math.max(15, Math.min(90, Number(val) || 30));
      else if (key === 'horizonWeeks') appState.planConfig.horizonWeeks = Math.max(2, Math.min(52, Number(val) || 8));
      else appState.planConfig[key] = val;
      saveState();
      renderPlannerView();
    }

    function togglePlanTask(taskId, isChecked) {
      const langId = appState.activeLang;
      if (!appState.planChecklist[langId]) appState.planChecklist[langId] = {};
      const wasChecked = !!appState.planChecklist[langId][taskId];
      appState.planChecklist[langId][taskId] = isChecked;
      if (isChecked && !wasChecked) {
        awardXP(10, null);
      } else {
        saveState();
      }
      renderPlannerView();
    }

    /* ======================================================================
       7. WORKSPACE 4: RESOURCE STUDIO (CREATE / UPLOAD / SHARE) & COMMUNITY
       ====================================================================== */
    function renderCommunityView() {
      const lang = LANGUAGES[appState.activeLang];
      const threadsContainer = document.getElementById('community-threads-list');
      const lib = document.getElementById('resource-library-panel');
      const resLang = document.getElementById('res-lang');
      const resPath = document.getElementById('res-pathway');
      if (resLang && !resLang.dataset.userEdited) resLang.value = appState.activeLang;
      if (resPath && !resPath.dataset.userEdited) resPath.value = PATHWAYS[appState.pathway].short;

      if (threadsContainer) {
        threadsContainer.innerHTML = appState.communityPosts.map(th => {
          const tLang = LANGUAGES[th.lang] || lang;
          return `
            <article class="post-item">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:var(--space-sm); flex-wrap:wrap;">
                <span class="tag">${tLang.name} · ${th.tag}</span>
                <button type="button" class="btn btn-secondary btn-sm" onclick="upvoteThread('${th.id}')">
                  <i data-lucide="thumbs-up" style="width:13px;height:13px;" aria-hidden="true"></i>
                  <span class="tabular">${th.upvotes}</span>
                </button>
              </div>
              <strong>${th.title}</strong>
              <p style="margin:0; color:var(--on-surface-variant); font-size:0.9375rem;">${th.body}</p>
              ${th.replies.length > 0 ? `
                <div style="padding-left:var(--space-md); border-left:2px solid var(--outline-variant); display:grid; gap:var(--space-xs); margin-top:var(--space-xs);">
                  ${th.replies.map(r => `<div style="font-size:0.875rem;">${r}</div>`).join('')}
                </div>
              ` : ''}
              <div style="display:flex; gap:var(--space-sm); align-items:end; margin-top:var(--space-xs);">
                <div style="flex:1;">
                  <label for="reply-${th.id}" class="label">Add peer reply</label>
                  <input type="text" id="reply-${th.id}" placeholder="Write a helpful reply…">
                </div>
                <button type="button" class="btn btn-secondary btn-sm" onclick="replyToThread('${th.id}')">Reply</button>
              </div>
            </article>
          `;
        }).join('');
      }

      if (lib) {
        const allPacks = [...appState.customPacks, ...STARTER_PACKS];
        lib.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:var(--space-sm); margin-bottom:var(--space-md);">
            <div>
              <span class="label">Shared curriculum packs</span>
              <h3 class="panel-title">Downloadable &amp; community study library</h3>
            </div>
            <span class="label tabular">${allPacks.length} packs available</span>
          </div>
          <div class="card-grid">
            ${allPacks.map(pk => {
              const l = LANGUAGES[pk.lang] || lang;
              return `
                <div class="panel" style="display:grid; gap:var(--space-sm); align-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:var(--space-xs);">
                      <span class="lang-swatch ${l.swatchClass}" style="width:28px;height:28px;font-size:0.75rem;">${l.code}</span>
                      <span class="tag">${pk.pathway}</span>
                    </div>
                    <h4 class="panel-title" style="margin-top:var(--space-sm);">${pk.title}</h4>
                    <div class="label" style="margin-top:2px;">${pk.author}</div>
                    <ul style="padding-left:var(--space-md); margin:var(--space-sm) 0 0; font-size:0.875rem; color:var(--on-surface-variant);">
                      ${pk.items.slice(0, 4).map(it => `<li lang="${l.id}">${it}</li>`).join('')}
                    </ul>
                  </div>
                  <div class="btn-row">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="downloadPackCSV('${pk.id}')">
                      <i data-lucide="download" style="width:14px;height:14px;" aria-hidden="true"></i>
                      <span>Download CSV</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function createCustomResource() {
      const titleEl = document.getElementById('res-title');
      const langEl = document.getElementById('res-lang');
      const pathEl = document.getElementById('res-pathway');
      const itemsEl = document.getElementById('res-items');
      const msgEl = document.getElementById('res-form-msg');
      if (!titleEl || !itemsEl || !msgEl) return;

      const title = titleEl.value.trim();
      const lines = itemsEl.value.split('\n').map(s => s.trim()).filter(Boolean);
      if (title.length < 3 || lines.length === 0) {
        msgEl.className = 'feedback-box is-err';
        msgEl.innerHTML = `<strong>Missing study pack details</strong><div>Enter a pack title (3+ characters) and at least one vocabulary or grammar line.</div>`;
        msgEl.style.display = 'grid';
        return;
      }

      const newPack = {
        id: `custom-${Date.now()}`,
        lang: langEl ? langEl.value : appState.activeLang,
        pathway: (pathEl ? pathEl.value.trim() : '') || `Custom`,
        title,
        author: `Created in your Lingo Mate account`,
        items: lines
      };
      appState.customPacks.unshift(newPack);
      titleEl.value = '';
      itemsEl.value = '';
      msgEl.style.display = 'none';
      awardXP(25, null);
      renderCommunityView();
      showStatus(`Published “${title}” to the shared study library (+25 XP).`, `ok`);
    }

    function handleResourceUpload(input) {
      const file = input && input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const raw = String(ev.target.result || '');
        const titleEl = document.getElementById('res-title');
        const itemsEl = document.getElementById('res-items');
        if (titleEl && !titleEl.value.trim()) {
          titleEl.value = file.name.replace(/\.[^.]+$/, '');
        }
        if (itemsEl) {
          if (file.name.endsWith('.json')) {
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                itemsEl.value = parsed.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join('\n');
              } else {
                itemsEl.value = raw.slice(0, 3000);
              }
            } catch (e) {
              itemsEl.value = raw.slice(0, 3000);
            }
          } else {
            itemsEl.value = raw.slice(0, 3000);
          }
        }
        showStatus(`Imported “${file.name}” into the editor. Review and click Publish study pack.`, `info`);
      };
      reader.readAsText(file);
    }

    function downloadPackCSV(packId) {
      const all = [...appState.customPacks, ...STARTER_PACKS];
      const pk = all.find(p => p.id === packId);
      if (!pk) return;
      const rows = [`"Pack","Language","Pathway","Entry"`];
      pk.items.forEach(it => {
        const clean = it.replace(/"/g, '""');
        rows.push(`"${pk.title.replace(/"/g, '""')}","${LANGUAGES[pk.lang].name}","${pk.pathway}","${clean}"`);
      });
      const csv = rows.join('\n');
      if (window.notebookAppApi && typeof window.notebookAppApi.triggerFileDownload === 'function') {
        window.notebookAppApi.triggerFileDownload({
          content: csv,
          contentType: 'text/csv',
          encoding: 'UTF-8',
          filename: `${pk.id}.csv`
        });
      }
      showStatus(`Exported “${pk.title}” as CSV.`, `ok`);
    }

    function postCommunityThread() {
      const titleEl = document.getElementById('comm-title');
      const bodyEl = document.getElementById('comm-body');
      if (!titleEl || !bodyEl) return;
      const title = titleEl.value.trim();
      const body = bodyEl.value.trim();
      if (title.length < 4 || body.length < 6) {
        showStatus(`Please write a clear title and message before posting.`, `err`);
        return;
      }
      appState.communityPosts.unshift({
        id: `th-${Date.now()}`,
        lang: appState.activeLang,
        tag: `${PATHWAYS[appState.pathway].short} · Peer Note`,
        title,
        body,
        replies: [],
        upvotes: 1
      });
      titleEl.value = '';
      bodyEl.value = '';
      awardXP(15, null);
      renderCommunityView();
      showStatus(`Your post is live in the learning community (+15 XP).`, `ok`);
    }

    function replyToThread(threadId) {
      const inp = document.getElementById(`reply-${threadId}`);
      if (!inp) return;
      const txt = inp.value.trim();
      if (txt.length < 2) {
        showStatus(`Enter a reply before submitting.`, `err`);
        return;
      }
      const th = appState.communityPosts.find(p => p.id === threadId);
      if (th) {
        th.replies.push(txt);
        awardXP(10, null);
        renderCommunityView();
      }
    }

    function upvoteThread(threadId) {
      const th = appState.communityPosts.find(p => p.id === threadId);
      if (th) {
        th.upvotes += 1;
        saveState();
        renderCommunityView();
      }
    }

    /* ======================================================================
       8. DEMO PRESET, EXPORT & INLINE RESET
       ====================================================================== */
    function loadSamplePreset() {
      appState.xp = 185;
      appState.streak = 4;
      appState.lastStudyDay = new Date().toISOString().slice(0, 10);
      appState.practisedSkills = {
        fr: ['vocab', 'grammar', 'reading', 'writing'],
        de: ['vocab', 'grammar'],
        ja: ['vocab', 'listening'],
        ko: ['vocab'],
        zh: ['vocab']
      };
      appState.masteredVocab = {
        fr: [0, 1, 2],
        de: [0, 1],
        ja: [0],
        ko: [0],
        zh: [0]
      };
      appState.examScores = {
        fr: { pct: 75, correct: 3, total: 4, date: new Date().toISOString().slice(0, 10) }
      };
      saveState();
      renderAll();
      showStatus(`Loaded sample GCE O/L multi-language progress profile.`, `ok`);
    }

    function exportProgressReport() {
      const lines = [
        `Language,Mastery (%),Skills Practised,Exam Score (%)`
      ];
      Object.values(LANGUAGES).forEach(l => {
        const pct = getLangMastery(l.id);
        const sk = (appState.practisedSkills[l.id] || []).length;
        const ex = appState.examScores[l.id] ? appState.examScores[l.id].pct : 'Not tested';
        lines.push(`${l.name},${pct},${sk}/6,${ex}`);
      });
      if (window.notebookAppApi && typeof window.notebookAppApi.triggerFileDownload === 'function') {
        window.notebookAppApi.triggerFileDownload({
          content: lines.join('\n'),
          contentType: 'text/csv',
          encoding: 'UTF-8',
          filename: `lingo-mate-progress.csv`
        });
      }
      showStatus(`Downloaded Lingo Mate progress summary (CSV).`, `ok`);
    }

    function handleResetAll(btn) {
      if (btn.dataset.armed !== 'true') {
        btn.dataset.armed = 'true';
        const span = btn.querySelector('span');
        if (span) span.textContent = 'Click again to reset';
        setTimeout(() => {
          btn.dataset.armed = 'false';
          const s = btn.querySelector('span');
          if (s) s.textContent = 'Reset';
        }, 4000);
        return;
      }
      btn.dataset.armed = 'false';
      const s = btn.querySelector('span');
      if (s) s.textContent = 'Reset';
      appState = createInitialState();
      quizSession.active = false;
      saveState();
      renderAll();
      showStatus(`Progress reset to fresh starting state.`, `info`);
    }

    /* ======================================================================
       9. MASTER RENDER & INITIALISATION
       ====================================================================== */
    function renderActiveView() {
      const v = appState.activeView;
      if (v === 'studio') renderStudio();
      else if (v === 'exam') renderExamView();
      else if (v === 'planner') renderPlannerView();
      else if (v === 'community') renderCommunityView();
    }

    function renderAll() {
      renderMastheadLabels();
      renderLangStrip();
      renderKPIs();
      document.querySelectorAll('.workspace-view').forEach(el => {
        el.classList.toggle('is-active', el.id === `view-${appState.activeView}`);
      });
      document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.view === appState.activeView);
      });
      renderActiveView();
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    async function initApp() {
      try {
        if (window.notebookAppApi && typeof window.notebookAppApi.getAppState === 'function') {
          const saved = await window.notebookAppApi.getAppState();
          if (saved && typeof saved === 'object') {
            appState = Object.assign(createInitialState(), saved);
          }
        }
      } catch (err) {
        console.warn('Could not load saved state:', err);
      }
      renderAll();
      if (window.notebookAppApi && typeof window.notebookAppApi.notifyAppReady === 'function') {
        window.notebookAppApi.notifyAppReady();
      }
    }

    document.addEventListener('DOMContentLoaded', initApp);
  