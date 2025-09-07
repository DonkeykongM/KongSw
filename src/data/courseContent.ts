export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ReflectionQuestion {
  question: string;
  placeholder: string;
}

export interface PracticalStep {
  step: string;
  description: string;
}

export interface Exercise {
  title: string;
  duration: string;
  materials: string[];
  instructions: string;
}

export interface Resource {
  title: string;
  type: 'bok' | 'artikel' | 'video' | 'podcast';
  url?: string;
}

export interface ModuleOverview {
  mainGoal: string;
  keyTakeaways: string[];
  applicationGuidance: string;
}

export interface ModuleContent {
  id: number;
  title: string;
  description: string;
  icon: string;
  purpose: string;
  overview: ModuleOverview;
  keyPrinciples: string[];
  practicalSteps: PracticalStep[];
  commonPitfalls: string[];
  exercises: Exercise[];
  lessonText: string;
  quote: string;
  reflectionQuestions: ReflectionQuestion[];
  quiz: QuizQuestion[];
  resources: Resource[];
}

export const courseContent: ModuleContent[] = [
  {
    id: 1,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCRMBAuaZL82uQhim9v5k6AYnDXPIbEgysaoBe',
    title: "Önskans kraft",
    description: "Upptäck hemligheten bakom brinnande önskan och hur den förvandlas från dröm till verklighet genom definitivt syfte.",
    icon: "Target",
    purpose: "Denna modul lär dig att kultivera en brinnande önskan för dina mål och förvandla vaga önskningar till definitivt syfte.",
    overview: {
      mainGoal: "Att utveckla en brinnande önskan som driver dig mot dina mål med oövervinnlig kraft",
      keyTakeaways: [
        "Skillnaden mellan önskning och brinnande önskan är nyckeln till framgång",
        "Ett definitivt syfte ger ditt liv riktning och kraft",
        "Känslomässig intensitet förvandlar tankar till verkliga resultat",
        "Obsession för ditt mål är ett krav för extraordinära resultat"
      ],
      applicationGuidance: "Investera tid varje dag i att visualisera och känna din brinnande önskan. Skriv ner ditt definitivt huvudmål och läs det högt två gånger dagligen med passion och övertygelse."
    },
    keyPrinciples: [
      "Alla framgångar börjar med en brinnande önskan efter något definitivt",
      "Svag önskan ger svaga resultat, precis som en liten eld ger lite värme",
      "Du måste vara villig att bränna alla broar bakom dig för att uppnå ditt mål",
      "Önskan + Tro + Uthållighet = Framgång",
      "Din önskan måste bli en obsession innan den blir en verklighet"
    ],
    practicalSteps: [
      {
        step: "Definiera ditt exakta mål",
        description: "Skriv ner exakt vad du vill uppnå, när du vill uppnå det, och vad du är villig att ge i utbyte för det"
      },
      {
        step: "Skapa en plan",
        description: "Utveckla en konkret handlingsplan med specifika steg och tidsfrister"
      },
      {
        step: "Läs ditt mål dagligen",
        description: "Läs ditt skriftliga mål högt två gånger dagligen - när du vaknar och innan du sover"
      },
      {
        step: "Visualisera framgång",
        description: "Använd all din kreativa fantasi för att se dig själv som redan har uppnått ditt mål"
      },
      {
        step: "Utveckla känslomässig intensitet",
        description: "Ladda ditt mål med så mycket känslomässig energi som möjligt - se, känna, och upplev det"
      }
    ],
    commonPitfalls: [
      "Att sätta vaga eller otydliga mål utan specifika detaljer",
      "Att ge upp när hinder dyker upp istället för att intensifiera önskan",
      "Att blanda ihop önskan med hopp eller önsketänkande",
      "Att inte vara villig att betala priset som krävs för framgång",
      "Att förlita sig på andras åsikter istället för din egen inre övertygelse"
    ],
    exercises: [
      {
        title: "Skriv ditt Definitivt Huvudmål",
        duration: "30 minuter",
        materials: ["Penna", "Papper", "Ostörd tid"],
        instructions: "Skriv en detaljerad beskrivning av exakt vad du vill uppnå, när du vill uppnå det, vad du kommer att ge i utbyte, och vilken plan du kommer att följa. Var så specifik som möjligt."
      },
      {
        title: "Daglig målvisualisering",
        duration: "15 minuter dagligen",
        materials: ["Lugn miljö", "Ditt skriftliga mål"],
        instructions: "Varje morgon och kväll, läs ditt mål högt och visualisera dig själv som redan har uppnått det. Känn de känslor du skulle ha om målet redan var verklighet."
      }
    ],
    lessonText: `Önskans kraft är den startande punkten för alla prestationer. Det är den första principen eftersom utan en brinnande önskan kommer inget av värde att uppnås.

Napoleon Hill upptäckte genom sin studie av framgångsrika människor att de alla hade en gemensam egenskap: en brinnande, intensiv önskan efter något specifikt. Denna önskan var så stark att den blev en obsession som drev dem framåt trots alla hinder.

Skillnaden mellan en vanlig önskning och en brinnande önskan är som skillnaden mellan en gnista och en förödande brand. En gnista kan lätt släckas, men en brand sprider sig och förstör allt som står i dess väg.

För att utveckla en brinnande önskan måste du:

1. Vara helt specifik om vad du vill
2. Bestämma exakt när du vill ha det
3. Bestämma vad du är villig att ge för det
4. Skapa en definitiv plan för att få det
5. Skriv ner allt detta i ett tydligt uttalande
6. Läs detta uttalande två gånger dagligen

Kom ihåg: "Det som sinnet kan konceptualisera och tro på, kan det uppnå."`,
    quote: "Det som sinnet kan konceptualisera och tro på, kan det uppnå.",
    reflectionQuestions: [
      {
        question: "Vad är ditt mest brinnande mål just nu? Beskriv det i detalj och förklara varför det är så viktigt för dig.",
        placeholder: "Tänk på vad som verkligen driver dig framåt. Vad skulle förändra ditt liv helt om du uppnådde det?"
      },
      {
        question: "Vad är du villig att offra eller ge upp för att uppnå detta mål? Var ärlig och specifik.",
        placeholder: "Framgång kräver utbyten. Vilka bekvämligheter, vanor eller aktiviteter är du redo att överge?"
      },
      {
        question: "Hur skulle ditt liv se ut om du redan hade uppnått ditt mål? Beskriv en typisk dag.",
        placeholder: "Visualisera i detalj - hur skulle du känna dig, vad skulle du göra, hur skulle andra se dig?"
      }
    ],
    quiz: [
      {
        question: "Vad är skillnaden mellan en önskning och en brinnande önskan enligt Napoleon Hill?",
        options: [
          "En önskning är mer realistisk än en brinnande önskan",
          "En brinnande önskan är känslomässigt laddad och blir en obsession",
          "En önskning kräver mindre arbete att uppnå",
          "Det finns ingen verklig skillnad mellan dem"
        ],
        correctAnswer: 1,
        explanation: "En brinnande önskan är känslomässigt intensiv och blir en drivande kraft som övervinner alla hinder."
      },
      {
        question: "Vad är det första steget för att förvandla önskan till verklighet?",
        options: [
          "Börja arbeta hårt mot målet",
          "Berätta för alla om ditt mål",
          "Var specifik om exakt vad du vill uppnå",
          "Spara pengar för att uppnå målet"
        ],
        correctAnswer: 2,
        explanation: "Specificitet är avgörande - du måste veta exakt vad du vill innan du kan skapa en plan för att få det."
      },
      {
        question: "Hur ofta bör du läsa ditt skriftliga mål enligt Hills metod?",
        options: [
          "En gång i veckan",
          "En gång i månaden", 
          "Två gånger dagligen",
          "Bara när du känner för det"
        ],
        correctAnswer: 2,
        explanation: "Två gånger dagligen - morgon och kväll - för att programmera det undermedvetna sinnet."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 1",
        type: "bok"
      },
      {
        title: "Målsättning som förändrar liv",
        type: "artikel"
      },
      {
        title: "Kraften i visualisering",
        type: "video"
      }
    ]
  },
  {
    id: 2,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCZxYRpNCxAw9HLk7Rs5SQid8zNE0cpXVgelUa',
    title: "Tro och övertygelse",
    description: "Lär dig hur du utvecklar orubblig tro på din förmåga att uppnå dina mål och övervinner tvivel och rädsla.",
    icon: "Heart",
    purpose: "Denna modul lär dig att utveckla orubblig tro på din förmåga att uppnå dina mål, oavsett nuvarande omständigheter.",
    overview: {
      mainGoal: "Att bygga stark självförtroende och eliminera begränsande övertygelser som hindrar din framgång",
      keyTakeaways: [
        "Tro kan utvecklas genom repetition av positiva tankar",
        "Ditt undermedvetna accepterar vad du upprepar med känslomässig intensitet",
        "Självförtroende byggs genom små framgångar över tid",
        "Du måste övertyga dig själv innan du kan övertyga andra"
      ],
      applicationGuidance: "Skapa positiva bekräftelser och upprepa dem dagligen med känslomässig övertygelse. Omge dig med bevis på andras framgång för att stärka din egen tro."
    },
    keyPrinciples: [
      "Tro är det enda motgiftet mot misslyckande",
      "Tankar som blandas med tro blir magnetiska och attraherar relaterade tankar",
      "Du kan övertala dig själv att tro på vad som helst genom repetition",
      "Självförtroende är grundstenen för all framgång",
      "Din tro formar din verklighet mer än externa omständigheter"
    ],
    practicalSteps: [
      {
        step: "Skriv en självförtroendeförklaring",
        description: "Skapa en kraftfull bekräftelse av din förmåga att uppnå ditt mål och läs den dagligen"
      },
      {
        step: "Eliminera negativa tankar",
        description: "Aktivt ersätt tvivel och negativa tankar med positiva, stärkande tankar"
      },
      {
        step: "Omge dig med positivitet",
        description: "Läs inspirerande böcker, lyssna på motiverande material, och umgås med positiva människor"
      },
      {
        step: "Fira små framgångar",
        description: "Erkänn och fira varje litet steg framåt för att bygga momentum och förtroende"
      },
      {
        step: "Visualisera framgång dagligen",
        description: "Se dig själv som redan framgångsrik och känn känslorna av uppnåelse"
      }
    ],
    commonPitfalls: [
      "Att låta andras tvivel påverka din egen tro",
      "Att förvänta dig omedelbar framgång utan att ge tro tid att utvecklas",
      "Att fokusera på hinder istället för möjligheter", 
      "Att jämföra din resa med andras framsteg",
      "Att ge upp när tro testas av motgångar"
    ],
    exercises: [
      {
        title: "Skapa din självförtroendeförklaring",
        duration: "45 minuter",
        materials: ["Penna", "Papper", "Lugn miljö"],
        instructions: "Skriv en kraftfull förklaring som bekräftar din förmåga att uppnå ditt mål. Inkludera vad du kommer att ge i utbyte och när du kommer att uppnå det. Läs detta högt dagligen med passion."
      },
      {
        title: "Daglig tro-förstärkning",
        duration: "10 minuter dagligen",
        materials: ["Din självförtroendeförklaring", "Spegel"],
        instructions: "Stå framför en spegel och läs din självförtroendeförklaring högt med övertygelse och känslomässig intensitet. Se dig själv i ögonen och tro på varje ord."
      }
    ],
    lessonText: `Tro är den andra principen i Napoleon Hills formel för framgång, och den är lika avgörande som önskan. Utan tro förblir dina önskningar bara drömmar.

Hill definierade tro som "en sinnesstämning som kan induceras eller skapas av bekräftelse eller upprepade instruktioner till det undermedvetna sinnet, genom principen om autosuggestion."

Det viktiga att förstå är att tro inte är något mystiskt eller något du antingen har eller inte har. Tro är något du kan utveckla och stärka genom medvetna handlingar.

De fem grundläggande stegen för att utveckla tro är:

1. **Repetition**: Upprepa dina mål och bekräftelser dagligen
2. **Känslomässig intensitet**: Ladda dina tankar med stark känsla
3. **Visualisering**: Se dig själv som redan framgångsrik
4. **Positiv självprat**: Ersätt negativa tankar med positiva
5. **Omgivning**: Omge dig med människor och material som stärker din tro

Kom ihåg att ditt undermedvetna sinne accepterar allt du matar det med genom repetition, vare sig det är positivt eller negativt. Därför är det avgörande att du medvetet matar det med tankar om framgång och uppnåelse.`,
    quote: "Tro är den enda kända medicinen mot misslyckande!",
    reflectionQuestions: [
      {
        question: "Vilka begränsande övertygelser har hindrat dig i det förflutna? Skriv ner dem och skapa motsatsen som positiva bekräftelser.",
        placeholder: "Tänk på tankar som 'Jag är inte bra nog' eller 'Jag förtjänar inte framgång'. Omformulera dem positivt."
      },
      {
        question: "Beskriv en tid när du lyckades trots odds emot dig. Vad gav dig tro att fortsätta?",
        placeholder: "Reflektera över en personlig framgång och identifiera källan till din inre styrka."
      },
      {
        question: "Hur kan du dagligen stärka din tro på din förmåga att uppnå ditt mål?",
        placeholder: "Tänk på konkreta handlingar, läsning, affirmationer eller aktiviteter som bygger förtroende."
      }
    ],
    quiz: [
      {
        question: "Enligt Napoleon Hill, vad är tro?",
        options: [
          "En medfödd egenskap som vissa människor har",
          "En sinnesstämning som kan skapas genom autosuggestion",
          "Något som kommer naturligt till framgångsrika människor",
          "En religiös övertygelse"
        ],
        correctAnswer: 1,
        explanation: "Tro är en sinnesstämning som kan utvecklas genom repetition och autosuggestion."
      },
      {
        question: "Vad är det viktigaste för att utveckla stark tro?",
        options: [
          "Att ha perfekta omständigheter",
          "Att ha stöd från alla omkring dig",
          "Repetition av positiva tankar med känslomässig intensitet",
          "Att vara naturligt optimistisk"
        ],
        correctAnswer: 2,
        explanation: "Repetition med känslomässig kraft programmerar det undermedvetna sinnet att tro."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 2",
        type: "bok"
      },
      {
        title: "Självförtroende och tro",
        type: "artikel"
      }
    ]
  },
  {
    id: 3,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCMaSD4JpaES95dj1pBAJ4iwc3fNXxvqYhzGT2',
    title: "Autosuggestionens kraft",
    description: "Bemästra konsten att programmera ditt undermedvetna sinne för framgång genom självpåverkan och mental konditionering.",
    icon: "Brain",
    purpose: "Denna modul lär dig att använda autosuggestion för att programmera ditt undermedvetna sinne och skapa automatiska framgångsbeteenden.",
    overview: {
      mainGoal: "Att behärska tekniken att påverka ditt undermedvetna sinne genom medvetna, repetitiva budskap",
      keyTakeaways: [
        "Ditt undermedvetna sinne accepterar vad du upprepar med övertygelse",
        "Autosuggestion är bron mellan medvetet och undermedvetet sinne",
        "Känslomässig intensitet förstärker autosuggestionens effekt",
        "Regelbunden praktik skapar permanenta mentala förändringar"
      ],
      applicationGuidance: "Praktisera dagliga affirmationer med känslomässig kraft. Kombinera visuella, auditiva och känslomässiga element för maximal påverkan på det undermedvetna."
    },
    keyPrinciples: [
      "Autosuggestion är mediet för att påverka det undermedvetna sinnet",
      "All tro är resultatet av autosuggestion",
      "Du måste 'tro' på dina egna ord för att de ska ha kraft",
      "Repetition + Känsla = Programmering av undermedvetna",
      "Det undermedvetna sinnet tar bokstavligt allt du berättar för det"
    ],
    practicalSteps: [
      {
        step: "Skapa kraftfulla affirmationer",
        description: "Formulera positiva, nuvarande uttalanden om dina mål som om de redan vore sanna"
      },
      {
        step: "Läs med känslomässig intensitet",
        description: "Läs dina affirmationer med passion, övertygelse och stark känsla"
      },
      {
        step: "Visualisera medan du affirmerar",
        description: "Se dig själv som redan har uppnått det du affirmerar"
      },
      {
        step: "Upprepa konsekvent",
        description: "Praktisera autosuggestion samma tid varje dag utan undantag"
      },
      {
        step: "Övervaka dina tankar",
        description: "Var uppmärksam på negativa tankar och ersätt dem omedelbart med positiva"
      }
    ],
    commonPitfalls: [
      "Att bara säga orden utan att känna dem",
      "Att ge upp för tidigt innan det undermedvetna är programmerat",
      "Att blanda negativa tankar med positiva affirmationer",
      "Att inte vara specifik nog i sina meddelanden",
      "Att förvänta sig omedelbar förändring utan tålamod"
    ],
    exercises: [
      {
        title: "Skapa din personliga affirmationsrutin",
        duration: "20 minuter dagligen",
        materials: ["Dina skriftliga affirmationer", "Lugn plats"],
        instructions: "Läs dina affirmationer högt med maximal känslomässig intensitet. Visualisera dig själv som redan framgångsrik medan du säger varje ord."
      },
      {
        title: "Undermedveten programmering före sömn",
        duration: "10 minuter varje kväll",
        materials: ["Dina mål och affirmationer"],
        instructions: "Precis innan du somnar, upprepa dina huvudmål och affirmationer. Det undermedvetna sinnet är mest mottagligt just före sömn."
      }
    ],
    lessonText: `Autosuggestion är det verktyg genom vilket du kan nå och påverka ditt undermedvetna sinne. Det är kommunikationskanalen mellan den medvetna delen av sinnet och det undermedvetna.

Napoleon Hill förklarade att allt du upprepade för dig själv, vare sig det var positivt eller negativt, skulle så småningom accepteras av ditt undermedvetna sinne som sanning. Detta undermedvetna sinne arbetar sedan 24 timmar om dygnet för att materialisera dessa "sanningar" i din fysiska verklighet.

Nyckelkomponenterna i effektiv autosuggestion är:

1. **Tydlighet**: Dina meddelanden måste vara specifika och tydliga
2. **Repetition**: Konstant upprepning skapar djupa mentala spår  
3. **Känsla**: Känslomässig intensitet ger kraft åt dina ord
4. **Tro**: Du måste tro på vad du säger för att det ska ha verkan
5. **Visualisering**: Se dig själv som redan framgångsrik

Det är viktigt att förstå att ditt undermedvetna sinne inte kan skilja mellan verkliga och föreställda upplevelser. Om du konsekvent matar det med bilder av framgång, kommer det att arbeta för att göra dessa bilder till verklighet.

Autosuggestion kräver tålamod och konsistens. De flesta människor ger upp för tidigt, innan deras undermedvetna sinne har hunnit programmeras fullständigt.`,
    quote: "Ditt undermedvetna sinne känner igen och agerar endast på tankar som har blandats väl med känsla eller sinnesstämning.",
    reflectionQuestions: [
      {
        question: "Vilka negativa meddelanden har du upprepat för dig själv? Hur kan du omformulera dem positivt?",
        placeholder: "Identifiera självkritik eller begränsande tankar och skapa kraftfulla positiva motsatser."
      },
      {
        question: "Beskriv hur du känner när du läser dina affirmationer med full känslomässig kraft.",
        placeholder: "Reflektera över den fysiska och emotionella upplevelsen av kraftfull autosuggestion."
      },
      {
        question: "Hur märker du att ditt undermedvetna sinne börjar acceptera dina nya programmering?",
        placeholder: "Tänk på subtila förändringar i ditt tänkande, beteende eller möjligheter som dyker upp."
      }
    ],
    quiz: [
      {
        question: "Vad är autosuggestion enligt Napoleon Hill?",
        options: [
          "Ett sätt att hypnotisera andra människor",
          "Kommunikationskanalen mellan medvetet och undermedvetet sinne",
          "En form av meditation",
          "Ett sätt att läsa andras tankar"
        ],
        correctAnswer: 1,
        explanation: "Autosuggestion är verktyget för att kommunicera med och påverka ditt undermedvetna sinne."
      },
      {
        question: "Vad är det viktigaste elementet för effektiv autosuggestion?",
        options: [
          "Att säga orden snabbt",
          "Att upprepa dem många gånger",
          "Att kombinera orden med stark känsla och tro",
          "Att säga dem tyst"
        ],
        correctAnswer: 2,
        explanation: "Känslomässig intensitet och tro ger kraft åt autosuggestion och gör den effektiv."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 3",
        type: "bok"
      },
      {
        title: "Affirmationer som fungerar",
        type: "artikel"
      }
    ]
  },
  {
    id: 4,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCNXxRtWYRD8GvHU1IrtSico405zgsT7FKykEl',
    title: "Specialiserad kunskap",
    description: "Förvärva den specifika kunskap som krävs för att nå dina mål och förvandla den till praktiska resultat.",
    icon: "BookOpen",
    purpose: "Denna modul visar dig hur du identifierar, förvärvar och tillämpar den specialiserade kunskap som krävs för din framgång.",
    overview: {
      mainGoal: "Att förstå skillnaden mellan allmän och specialiserad kunskap och hur du strategiskt bygger expertis",
      keyTakeaways: [
        "Allmän kunskap har lite värde för att skapa rikedom",
        "Specialiserad kunskap inom ditt område är ovärderlig",
        "Kunskap måste organiseras och riktas mot ett definitivt syfte",
        "Du behöver inte veta allt - du behöver veta var du hittar information"
      ],
      applicationGuidance: "Identifiera kunskapsluckor i ditt mål och skapa en systematisk plan för att fylla dem. Fokusera på kunskap som direkt bidrar till ditt definitivt huvudmål."
    },
    keyPrinciples: [
      "Kunskap är bara potentiell kraft - den blir kraft endast när den organiseras och riktas",
      "Specialiserad kunskap är en av de mest rikligt tillgängliga tjänsterna på jorden",
      "Din förmåga att använda kunskap, inte mängden kunskap, bestämmer din framgång",
      "Det är ofta mer värdefullt att veta var man hittar kunskap än att memorera den",
      "Kontinuerligt lärande är ett krav för bestående framgång"
    ],
    practicalSteps: [
      {
        step: "Identifiera kunskapsbehov",
        description: "Analysera vilken specifik kunskap du behöver för att uppnå ditt mål"
      },
      {
        step: "Skapa en utbildningsplan",
        description: "Utveckla en systematisk plan för att förvärva den kunskap du behöver"
      },
      {
        step: "Hitta experter och mentorer",
        description: "Identifiera personer som redan har den kunskap du söker"
      },
      {
        step: "Tillämpa medan du lär",
        description: "Använd ny kunskap omedelbart istället för att bara samla information"
      },
      {
        step: "Undervisa andra",
        description: "Fördjupa din förståelse genom att lära ut vad du har lärt dig"
      }
    ],
    commonPitfalls: [
      "Att samla allmän kunskap utan specifikt syfte",
      "Att inte tillämpa kunskap utan bara ackumulera den",
      "Att tro att du måste veta allt innan du börjar",
      "Att inte söka experthjälp när det behövs",
      "Att sluta lära när du uppnår initial framgång"
    ],
    exercises: [
      {
        title: "Kunskapsanalys för ditt mål",
        duration: "60 minuter",
        materials: ["Penna", "Papper", "Ditt definitivt huvudmål"],
        instructions: "Lista all kunskap du behöver för att uppnå ditt mål. Kategorisera den som 'har redan', 'behöver lära' och 'kan delegera till experter'."
      },
      {
        title: "30-dagars lärplan",
        duration: "30 dagar",
        materials: ["Böcker", "Onlinekurser", "Mentorer"],
        instructions: "Skapa en 30-dagars intensiv lärplan fokuserad på den mest kritiska kunskapen för ditt mål. Lägg 1-2 timmar dagligen på strukturerat lärande."
      }
    ],
    lessonText: `Specialiserad kunskap är den tredje principen och en av de mest praktiska. Hill gjorde en viktig distinktion mellan allmän kunskap och specialiserad kunskap.

Allmän kunskap, oavsett hur omfattande, är av liten värde för att generera rikedom. Universitetsutbildning ger ofta allmän kunskap men inte nödvändigtvis den specialiserade kunskap som krävs för specifik framgång.

Specialiserad kunskap, å andra sidan, är kunskap som är fokuserad och direkt tillämpbar på ditt specifika mål. Det är denna typ av kunskap som skapar värde och möjliggör rikedom.

Hill betonade att det inte är nödvändigt att personligen besitta all specialiserad kunskap du behöver. Viktigt är att:

1. **Veta vad du behöver**: Identifiera exakt vilken kunskap som krävs
2. **Veta var du hittar den**: Böcker, kurser, experter, mentorer
3. **Organisera kunskapen**: Strukturera den för praktisk tillämpning  
4. **Skapa handlingsplaner**: Förvandla kunskap till konkreta steg
5. **Bygga team**: Omge dig med människor som kompletterar din kunskap

Kom ihåg att kunskap i sig är inte makt - det är organiserad och riktad kunskap som blir makt.`,
    quote: "Kunskap kommer inte att attrahera pengar om den inte organiseras och intelligiskt riktas genom praktiska handlingsplaner för det definitiva syftet att skapa rikedom.",
    reflectionQuestions: [
      {
        question: "Vilken specialiserad kunskap behöver du för att uppnå ditt huvudmål? Var specifik.",
        placeholder: "Lista konkreta färdigheter, information eller expertis du behöver utveckla."
      },
      {
        question: "Vem i din omgivning eller bransch har redan den kunskap du behöver? Hur kan du lära av dem?",
        placeholder: "Identifiera potentiella mentorer, experter eller resurser för lärande."
      },
      {
        question: "Hur kan du omedelbart börja tillämpa ny kunskap du förvärvar?",
        placeholder: "Tänk på sätt att omsätta teori i praktisk handling och verkliga resultat."
      }
    ],
    quiz: [
      {
        question: "Vad är skillnaden mellan allmän och specialiserad kunskap?",
        options: [
          "Allmän kunskap är viktigare för framgång",
          "Specialiserad kunskap är fokuserad på specifika mål och har praktiskt värde",
          "Allmän kunskap är lättare att förvärva",
          "Det finns ingen verklig skillnad"
        ],
        correctAnswer: 1,
        explanation: "Specialiserad kunskap är fokuserad, målriktad och direkt tillämpbar för specifik framgång."
      },
      {
        question: "Enligt Hill, vad förvandlar kunskap till makt?",
        options: [
          "Att ha mer kunskap än andra",
          "Att memorera stora mängder information",
          "Att organisera och rikta kunskap mot definitiva mål",
          "Att ha universitetsutbildning"
        ],
        correctAnswer: 2,
        explanation: "Kunskap blir makt när den organiseras och riktas mot specifika, definitiva mål."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 4",
        type: "bok"
      },
      {
        title: "Livslångt lärande för framgång",
        type: "artikel"
      }
    ]
  },
  {
    id: 5,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCnTWHHeEFKO0tf9DmyeZR8ENqYGAnxdwvXWc3',
    title: "Kreativ fantasi",
    description: "Utveckla din kreativa förmåga att visualisera möjligheter och skapa innovativa lösningar på utmaningar.",
    icon: "Lightbulb",
    purpose: "Denna modul utvecklar din kreativa fantasi som verktyg för problemlösning och möjlighetsskapande.",
    overview: {
      mainGoal: "Att aktivera och utveckla din kreativa fantasi för att hitta unika lösningar och möjligheter",
      keyTakeaways: [
        "Kreativ fantasi är källan till alla nya idéer och innovationer",
        "Fantasin måste tränas och utvecklas precis som en muskel",
        "Kombinera kunskap på nya sätt för att skapa innovation",
        "Fantasin fungerar bäst när den är riktad mot definitiva mål"
      ],
      applicationGuidance: "Avsätt daglig tid för kreativ visualisering och brainstorming. Kombinera din specialiserade kunskap med fantasin för att skapa nya möjligheter."
    },
    keyPrinciples: [
      "Fantasin är det verktyg genom vilket alla mänskliga planer skapas",
      "Idéer är de enda produkterna av fantasin",
      "Kreativ fantasi blir mer alert och mottaglig genom användning",
      "De mest framgångsrika människorna kombinerar fakta på nya sätt",
      "Fantasin arbetar automatiskt när det ges definitiva instruktioner"
    ],
    practicalSteps: [
      {
        step: "Daglig visualisering",
        description: "Tillbringa 15-30 minuter dagligen med att visualisera ditt mål som redan uppnått"
      },
      {
        step: "Idégenereringssessioner",
        description: "Regelbundna brainstormingsessioner för att lösa specifika utmaningar"
      },
      {
        step: "Kombinera koncept",
        description: "Ta två orelaterade idéer och hitta sätt att kombinera dem kreativt"
      },
      {
        step: "Fråga 'Tänk om?'",
        description: "Ställ regelbundet frågor som 'Tänk om det fanns ett bättre sätt att...?'"
      },
      {
        step: "Studera innovatörer",
        description: "Lär av hur framgångsrika innovatörer använder kreativ fantasi"
      }
    ],
    commonPitfalls: [
      "Att avfärda idéer som 'orealistiska' för snabbt",
      "Att vänta på 'perfekt' inspiration istället för att träna fantasin",
      "Att inte dokumentera kreativa idéer när de uppstår",
      "Att låta andras tvivel döda din kreativitet",
      "Att använda fantasi utan att koppla den till handlingsplaner"
    ],
    exercises: [
      {
        title: "Kreativ målvisualisering",
        duration: "20 minuter dagligen",
        materials: ["Lugn miljö", "Öppet sinne"],
        instructions: "Visualisera ditt mål som redan uppnått. Använd alla dina sinnen - se, hör, känn, lukta och smaka framgången. Gör det så verkligt som möjligt."
      },
      {
        title: "Problemlösnings-brainstorming",
        duration: "30 minuter",
        materials: ["Penna", "Papper", "Specifikt problem"],
        instructions: "Välj en utmaning relaterad till ditt mål. Skriv ner 20 möjliga lösningar utan att censurera. Sedan utvärdera och förfina de bästa idéerna."
      }
    ],
    lessonText: `Kreativ fantasi är den femte principen och den verkstad där alla mänskliga planer skapas. Det är genom fantasin som önskan ges form och substans.

Napoleon Hill identifierade två former av fantasi:

1. **Syntetisk fantasi**: Kombinerar existerande koncept, idéer och planer på nya sätt
2. **Kreativ fantasi**: Skapar helt nya idéer och koncept från ingenting

De flesta framgångsrika affärsidéer kommer från syntetisk fantasi - att ta existerande element och kombinera dem på innovativa sätt.

Din fantasi kan tränas och utvecklas genom:

- **Daglig visualisering** av dina mål
- **Regelbunden brainstorming** för att lösa problem  
- **Studier av innovatörer** och hur de tänker
- **Fråga 'tänk om' frågor** för att utmana antaganden
- **Kombinera orelaterade koncept** för att skapa något nytt

Fantasin fungerar bäst när den är:
- Riktad mot ett definitivt mål
- Kombinerad med specialiserad kunskap
- Använd regelbundet och konsekvent
- Stödd av stark önskan och tro

Kom ihåg att varje stor uppfinning, varje framgångsrik verksamhet, och varje betydande prestation började som en idé i någons fantasi.`,
    quote: "Fantasin är den verkstad där alla planer för människans prestationer formas.",
    reflectionQuestions: [
      {
        question: "Beskriv en situation där din kreativa fantasi hjälpte dig lösa ett problem. Vad kan du lära av den upplevelsen?",
        placeholder: "Tänk på en tid när du tänkte utanför boxen och kom på en kreativ lösning."
      },
      {
        question: "Hur kan du använda kreativ fantasi för att hitta nya sätt att närma dig ditt huvudmål?",
        placeholder: "Brainstorma innovativa metoder, strategier eller tillvägagångssätt för ditt mål."
      },
      {
        question: "Vilka begränsningar lägger du på din egen kreativitet? Hur kan du överkomma dem?",
        placeholder: "Identifiera mentala block eller begränsande övertygelser om din kreativa förmåga."
      }
    ],
    quiz: [
      {
        question: "Vilka är de två typerna av fantasi enligt Napoleon Hill?",
        options: [
          "Positiv och negativ fantasi",
          "Syntetisk och kreativ fantasi",
          "Medveten och undermedveten fantasi",
          "Personlig och professionell fantasi"
        ],
        correctAnswer: 1,
        explanation: "Syntetisk fantasi kombinerar existerande koncept, medan kreativ fantasi skapar helt nya idéer."
      },
      {
        question: "När fungerar fantasin bäst enligt Hill?",
        options: [
          "När du är helt avslappnad",
          "När den är riktad mot ett definitivt mål",
          "När du är ensam",
          "När du inte tänker på problem"
        ],
        correctAnswer: 1,
        explanation: "Fantasin är mest kraftfull när den är fokuserad och riktad mot specifika, definitiva mål."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 5",
        type: "bok"
      },
      {
        title: "Kreativitet och innovation",
        type: "artikel"
      }
    ]
  },
  {
    id: 6,
    title: "Organiserad planering",
    description: "Skapa solida, genomförbara planer som förvandlar dina mål från idéer till verklighet genom systematisk handling.",
    icon: "ClipboardCheck",
    purpose: "Denna modul lär dig att skapa detaljerade, genomförbara planer och att organisera dem för maximal effektivitet.",
    overview: {
      mainGoal: "Att utveckla färdigheten att skapa praktiska planer som förvandlar önskningar till verkliga resultat",
      keyTakeaways: [
        "Alla framgångar kräver definitiva, välorganiserade planer",
        "Planer måste vara flexibla och justerbara när omständigheter förändras",
        "Samarbete med andra förstärker dina planers kraft",
        "Misslyckade planer är steppingstenar till framgång om du lär av dem"
      ],
      applicationGuidance: "Skapa detaljerade handlingsplaner med specifika steg, tidsfrister och ansvarigheter. Granska och justera dina planer regelbundet baserat på resultat."
    },
    keyPrinciples: [
      "Du kan uppnå praktiskt taget allt du vill ha om du planerar ditt arbete och arbetar din plan",
      "Inga prestationer uppnås utan organiserad ansträngning",
      "Planer är värdelösa om de inte leder till handling",
      "Misslyckade planer kan ersättas av nya planer",
      "Ledarskap är essentiellt för organiserad planering"
    ],
    practicalSteps: [
      {
        step: "Bryt ner ditt mål",
        description: "Dela upp ditt huvudmål i mindre, hanterbara delmål"
      },
      {
        step: "Sätt tidsfrister",
        description: "Tilldela specifika datum för varje steg i din plan"
      },
      {
        step: "Identifiera resurser",
        description: "Lista alla resurser du behöver: människor, pengar, kunskap, verktyg"
      },
      {
        step: "Skapa dagliga handlingar",
        description: "Identifiera vad du kan göra varje dag för att komma närmare ditt mål"
      },
      {
        step: "Etablera mätsystem",
        description: "Skapa sätt att mäta framsteg och justera planer vid behov"
      }
    ],
    commonPitfalls: [
      "Att skapa planer som är för komplexa eller orealistiska",
      "Att inte revidera planer när de inte fungerar",
      "Att planera utan att agera på planerna",
      "Att försöka göra allt själv istället för att samarbeta",
      "Att ge upp på första planens misslyckande"
    ],
    exercises: [
      {
        title: "Skapa din masterplan",
        duration: "2 timmar",
        materials: ["Penna", "Papper", "Ditt definitivt huvudmål", "Kalender"],
        instructions: "Skapa en detaljerad plan som bryter ner ditt mål i specifika steg, med tidsfrister och resurskrav. Inkludera dagliga, veckovisa och månatliga handlingar."
      },
      {
        title: "Veckovis plangenomgång",
        duration: "30 minuter varje vecka",
        materials: ["Din masterplan", "Framstegsjournal"],
        instructions: "Granska din plans framsteg varje vecka. Identifiera vad som fungerade, vad som inte fungerade, och justera nästa veckas handlingar därefter."
      }
    ],
    lessonText: `Organiserad planering är den sjätte principen och den som förvandlar önskan från abstrakt till konkret. Utan en plan förblir även den starkaste önskan bara ett hopp.

Hill studerade hundratals framgångsrika individuer och fann att de alla hade en gemensam egenskap: de hade klara, definitiva planer för att uppnå sina mål.

En effektiv plan måste ha följande egenskaper:

1. **Definitivt**: Tydligt definierad med specifika mål
2. **Praktisk**: Genomförbar med tillgängliga resurser
3. **Flexibel**: Kan justeras när omständigheter förändras
4. **Tidsbunden**: Har specifika tidsfrister och milstolpar
5. **Mätbar**: Framsteg kan spåras och utvärderas

Hill betonade vikten av att skapa din plan i samarbete med andra - din Master Mind-grupp. Denna samarbetande planering drar nytta av kollektiv kunskap och erfarenhet.

Kom ihåg att din första plan sannolikt kommer att misslyckas, och det är helt normalt. Hill sa att "misslyckande är bara en signal att dina planer inte är sunda. Bygg nya planer och fortsätt mot ditt mål."

Nyckeln är att aldrig sluta planera och aldrig acceptera misslyckande som permanent.`,
    quote: "Du kan uppnå nästan alla mål du sätter för dig själv om du först planerar ditt arbete och sedan arbetar din plan.",
    reflectionQuestions: [
      {
        question: "Vilka konkreta steg behöver du ta de närmaste 30 dagarna för att komma närmare ditt mål?",
        placeholder: "Brytet ner ditt mål i dagliga handlingar som du kan börja imorgon."
      },
      {
        question: "Vilka potentiella hinder kan du förutse, och hur kommer du att hantera dem?",
        placeholder: "Tänk proaktivt på utmaningar och skapa lösningar i förväg."
      },
      {
        question: "Vem kan hjälpa dig med din plan? Hur kommer du att involvera dem?",
        placeholder: "Identifiera människor vars kunskap, resurser eller stöd skulle accelerera din framgång."
      }
    ],
    quiz: [
      {
        question: "Vad bör du göra när en plan misslyckas enligt Napoleon Hill?",
        options: [
          "Ge upp målet helt",
          "Vänta tills förhållandena förbättras",
          "Skapa en ny plan och fortsätta mot målet",
          "Minska målet för att göra det enklare"
        ],
        correctAnswer: 2,
        explanation: "Misslyckade planer ska ersättas med nya planer - målet förblir konstant."
      },
      {
        question: "Vad är det viktigaste elementet i en framgångsrik plan?",
        options: [
          "Att den är perfekt från början",
          "Att den är flexibel och kan justeras",
          "Att den är hemlig från andra",
          "Att den är enkel och kort"
        ],
        correctAnswer: 1,
        explanation: "Flexibilitet är avgörande eftersom omständigheter förändras och planer måste anpassas."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 6",
        type: "bok"
      },
      {
        title: "Strategisk planering för framgång",
        type: "artikel"
      }
    ]
  },
  {
    id: 7,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCqiMD0I9R7afjmQzviD6CJUcZrLTg1owd4SyG',
    title: "Uthållighet",
    description: "Utveckla den mentala styrka och beslutsamhet som krävs för att övervinna motgångar och nå dina mål.",
    icon: "Shield",
    purpose: "Denna modul bygger din mentala uthållighet och ger dig verktyg för att övervinna hinder och motgångar.",
    overview: {
      mainGoal: "Att utveckla orubblig uthållighet som gör att du fortsätter trots hinder och motgångar",
      keyTakeaways: [
        "Uthållighet är den kvalité som förvandlar misslyckande till framgång",
        "De flesta ger upp precis innan genombrottet skulle ske",
        "Mental styrka kan tränas och utvecklas som fysisk styrka",
        "Uthållighet måste kombineras med organiserade planer för att vara effektiv"
      ],
      applicationGuidance: "Utveckla dagliga rutiner som bygger mental styrka. Sätt små utmaningar för dig själv och övervinn dem för att bygga uthållighetsmuskel."
    },
    keyPrinciples: [
      "Uthållighet är en nödvändig faktor för att förvandla önskan till dess monetära motsvarighet",
      "Grundstenen för uthållighet är kraft av vilja",
      "De flesta människor är bra på att börja men dåliga på att avsluta",
      "Uthållighet kan utvecklas genom att börja med det du kan kontrollera",
      "Svaga önskningar ger svag uthållighet"
    ],
    practicalSteps: [
      {
        step: "Stärk din önskan",
        description: "Återgå regelbundet till din brinnande önskan för att förnya din motivation"
      },
      {
        step: "Utveckla dagliga rutiner",
        description: "Skapa och följ dagliga rutiner som bygger disciplin och mental styrka"
      },
      {
        step: "Hitta inspirerande exempel",
        description: "Studera människor som har övervunnit stora hinder för att uppnå framgång"
      },
      {
        step: "Bryt ner hinder",
        description: "Dela stora utmaningar i mindre, hanterbara delar"
      },
      {
        step: "Belöna framsteg",
        description: "Erkänn och belöna dig själv för uthållighet och framsteg"
      }
    ],
    commonPitfalls: [
      "Att förvänta sig framgång utan motgångar",
      "Att tolka tillfälliga nederlag som permanenta misslyckanden",
      "Att jämföra din resa med andras synligt enkla vägar",
      "Att inte ha tillräckligt stark 'varför' bakom ditt mål",
      "Att ge upp när du är närmast genombrott"
    ],
    exercises: [
      {
        title: "Bygg uthållighetsmuskel",
        duration: "30 dagar",
        materials: ["Dagbok", "Litet dagligt åtagande"],
        instructions: "Välj en enkel daglig aktivitet (som motion eller läsning) och genomför den varje dag i 30 dagar utan undantag. Dokumentera din framgång dagligen."
      },
      {
        title: "Hinderanalys och lösningar",
        duration: "1 timme",
        materials: ["Penna", "Papper", "Dina nuvarande utmaningar"],
        instructions: "Lista alla hinder du för närvarande står inför. För varje hinder, brainstorma minst 3 möjliga lösningar eller sätt att övervinna det."
      }
    ],
    lessonText: `Uthållighet är den sjunde principen och enligt Hill den punkt där de flesta människor misslyckas. Det är den egenskap som separerar dem som uppnår sina mål från dem som ger upp.

Hill observerade att de flesta människor är snabba att börja men långsamma att avsluta. De första tecknen på motgångar eller nederlag får dem att ge upp sina planer.

Uthållighet baseras på fyra grundstenar:

1. **Definitivt syfte**: Att veta exakt vad du vill
2. **Önskan**: Brinnande längtan efter att uppnå ditt syfte  
3. **Självförtroende**: Tro på din förmåga att genomföra planer
4. **Definitiva planer**: Organiserade, praktiska steg mot målet

Hill betonade att de flesta stora framgångar kommer precis efter den punkt där nederlag verkade säkert. De som utvecklar uthållighet lär sig att se tillfälliga nederlag som lektioner och steppingstenar.

För att utveckla uthållighet:

- **Stärk din önskan** regelbundet genom visualisering
- **Bygg små framgångar** för att skapa momentum
- **Studera uthållighet** hos andra framgångsrika människor
- **Skapa ansvarsskyldighet** genom Master Mind-grupper
- **Fokusera på framsteg** istället för perfektion

Kom ihåg: "I varje motgång bär frön av motsvarande eller större nytta."`,
    quote: "Uthållighet är till mental attitude vad kol är till stål.",
    reflectionQuestions: [
      {
        question: "Beskriv en tid när du visade exceptionell uthållighet. Vad motiverade dig att inte ge upp?",
        placeholder: "Reflektera över en utmanande situation där du fortsatte trots svårigheter."
      },
      {
        question: "Vilka områden i ditt liv behöver du utveckla mer uthållighet? Varför är det viktigt?",
        placeholder: "Identifiera specifika utmaningar där ökad uthållighet skulle göra skillnad."
      },
      {
        question: "Hur kommer du att påminna dig själv om att fortsätta när du känner dig motlös?",
        placeholder: "Skapa konkreta strategier för att återfå motivation under svåra perioder."
      }
    ],
    quiz: [
      {
        question: "Vilka är de fyra grundstenarna för uthållighet enligt Hill?",
        options: [
          "Önskan, tro, kunskap, planering",
          "Definitivt syfte, önskan, självförtroende, definitiva planer", 
          "Motivation, disciplin, fokus, handling",
          "Mål, strategi, utförande, utvärdering"
        ],
        correctAnswer: 1,
        explanation: "De fyra grundstenarna är: definitivt syfte, önskan, självförtroende och definitiva planer."
      },
      {
        question: "När uppstår de flesta stora framgångarna enligt Hill?",
        options: [
          "I början av processen",
          "När allt går smidigt",
          "Precis efter punkten där nederlag verkade säkert",
          "När man har mycket stöd från andra"
        ],
        correctAnswer: 2,
        explanation: "De flesta genombrott kommer precis efter de svåraste motgångarna."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 7",
        type: "bok"
      },
      {
        title: "Mental styrka och uthållighet",
        type: "artikel"
      }
    ]
  },
  {
    id: 8,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCdyZMiYDEpoeiQ9cS2t37XHPKLvYszFlfBryu',
    title: "Beslutskraft",
    description: "Lär dig att fatta snabba, definitiva beslut och att stå fast vid dem för att skapa momentum och framgång.",
    icon: "Zap",
    purpose: "Denna modul utvecklar din förmåga att fatta snabba, definitiva beslut och att stå fast vid dem trots motstånd.",
    overview: {
      mainGoal: "Att utveckla avgörande ledarskapsegenskaper genom att behärska konsten att fatta och hålla fast vid beslut",
      keyTakeaways: [
        "Framgångsrika människor fattar beslut snabbt och ändrar dem långsamt",
        "Oförmåga att besluta är en av de största orsakerna till misslyckande",
        "Andras åsikter kan förgifta dina egna beslut om du låter dem",
        "Snabba beslut skapar momentum och möjligheter"
      ],
      applicationGuidance: "Träna på att fatta snabba beslut i små saker dagligen. Undvik att söka för många åsikter och lita på din egen bedömning efter att ha samlat nödvändig information."
    },
    keyPrinciples: [
      "Människor som inte kan besluta definitivt får sällan mycket",
      "Närhelst du talar om dina planer till personer som inte kan hjälpa dig, gör du sannolikt ett misstag",
      "Håll din egen råd och var på din vakt mot välmenande vänner",
      "Ledare fattar beslut snabbt och står fast vid dem",
      "Obeslutsamhet är en vanlig orsak till misslyckande"
    ],
    practicalSteps: [
      {
        step: "Sätt beslutstidsfrister",
        description: "Ge dig själv specifika tidsfrister för att fatta beslut"
      },
      {
        step: "Samla nödvändig information snabbt",
        description: "Identifiera minimal information som behövs och stoppa där"
      },
      {
        step: "Begränsa rådgivare",
        description: "Sök endast råd från människor som kan direkt hjälpa dig uppnå ditt mål"
      },
      {
        step: "Agera på beslut omedelbart",
        description: "Ta åtminstone ett litet steg för att implementera varje beslut du fattar"
      },
      {
        step: "Utvärdera resultat",
        description: "Spåra resultaten av dina beslut för att förbättra framtida beslutsfattande"
      }
    ],
    commonPitfalls: [
      "Att söka för många åsikter och bli förvirrad",
      "Att vänta på 'perfekt' information innan man beslutar",
      "Att ändra beslut vid första tecken på motstånd",
      "Att låta rädsla för fel beslut förhindra alla beslut",
      "Att inte agera på beslut efter att ha fattat dem"
    ],
    exercises: [
      {
        title: "Daglig beslutsträning",
        duration: "10 minuter dagligen",
        materials: ["Dagbok", "Lista över väntande beslut"],
        instructions: "Identifiera ett beslut du har skjutit upp. Sätt en 5-minuters timer, samla grundläggande information och fatta beslutet. Dokumentera processen och resultatet."
      },
      {
        title: "Skapa ditt beslutsramverk",
        duration: "1 timme",
        materials: ["Penna", "Papper", "Dina värderingar och mål"],
        instructions: "Utveckla ett personligt ramverk för beslutsfattande baserat på dina värderingar och mål. Använd detta som guide för framtida beslut."
      }
    ],
    lessonText: `Beslutskraft är den åttonde principen och en avgörande ledarskapsegenskaper. Hill fann att framgångsrika människor har förmågan att fatta beslut snabbt och att stå fast vid dem.

Analysen av flera hundra människor som ackumulerat stora förmögenheter visade att de alla hade vanan att fatta definitiva beslut snabbt, och att ändra dessa beslut långsamt, om alls.

Kontrasten är påfallande när man jämför med människor som misslyckas med att ackumulera rikedom. De fattar beslut, om de överhuvudtaget fattar definitiva beslut, mycket långsamt, och ändrar dessa beslut snabbt och ofta.

Obeslutsamhet är en av de viktigaste orsakerna till misslyckande. Hill observerade att obeslutsamhet och förhalning går hand i hand, och att där den ena hittas, brukar den andra också finnas.

För att utveckla beslutskraft:

1. **Träna på små beslut**: Bygg förmågan genom att fatta snabba beslut i vardagliga situationer
2. **Begränsa indata**: Sök endast råd från kvalificerade personer
3. **Sätt tidsfrister**: Ge dig själv specifika tidsramar för beslut
4. **Agera snabbt**: Implementera beslut omedelbart med åtminstone ett litet steg
5. **Lär av resultat**: Använd resultat för att förbättra framtida beslutsfattande

Kom ihåg att de flesta beslut kan justeras längs vägen om ny information blir tillgänglig.`,
    quote: "Den värld vi ser idag är resultatet av någons beslut.",
    reflectionQuestions: [
      {
        question: "Vilket viktigt beslut har du skjutit upp? Varför, och vad behöver du för att fatta det nu?",
        placeholder: "Identifiera ett väntande beslut och analysera vad som hindrar dig från att agera."
      },
      {
        question: "Beskriv ett beslut du fattade snabbt som ledde till positiva resultat. Vad lärde du dig?",
        placeholder: "Reflektera över framgångsrika snabba beslut för att identifiera framgångsfaktorer."
      },
      {
        question: "Hur påverkar andras åsikter dina beslut? Är detta alltid hjälpsamt?",
        placeholder: "Utvärdera hur yttre inflytande påverkar din beslutsprocess och självständighet."
      }
    ],
    quiz: [
      {
        question: "Hur fattar framgångsrika människor beslut enligt Hill?",
        options: [
          "Långsamt och ändrar dem snabbt",
          "Snabbt och ändrar dem långsamt",
          "Efter att ha frågat många människor",
          "Bara när de är 100% säkra"
        ],
        correctAnswer: 1,
        explanation: "Framgångsrika människor fattar beslut snabbt och står fast vid dem, medan misslyckade människor gör tvärtom."
      },
      {
        question: "Vad är en av huvudorsakerna till misslyckande enligt denna princip?",
        options: [
          "Att fatta för många beslut",
          "Obeslutsamhet och förhalning",
          "Att fatta beslut för snabbt",
          "Att inte lyssna på andras råd"
        ],
        correctAnswer: 1,
        explanation: "Obeslutsamhet och förhalning hindrar framsteg och skapar förlorade möjligheter."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 8",
        type: "bok"
      },
      {
        title: "Ledarskap och beslutsfattande",
        type: "artikel"
      }
    ]
  },
  {
    id: 9,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCMLybnQpaES95dj1pBAJ4iwc3fNXxvqYhzGT2',
    title: "Master Mind-principen",
    description: "Lär dig kraften i att samarbeta med andra sinnen i harmoni för att uppnå extraordinära resultat.",
    icon: "Users",
    purpose: "Denna modul lär dig att bygga och leda Master Mind-grupper som accelererar din framgång genom kollektiv intelligens.",
    overview: {
      mainGoal: "Att förstå och implementera Master Mind-principen för att dra nytta av kollektiv kunskap och energi",
      keyTakeaways: [
        "Ingen stor framgång uppnås av en ensam individ",
        "Master Mind skapar en 'tredje intelligens' större än summan av delarna",
        "Harmoni mellan gruppmedlemmar är absolut avgörande",
        "Master Mind ger både ekonomisk och psykisk kraft"
      ],
      applicationGuidance: "Identifiera 2-4 personer som kan komplettera dina styrkor och som delar ditt engagemang för framgång. Skapa regelbundna möten med tydlig agenda och gemensamma mål."
    },
    keyPrinciples: [
      "Master Mind är koordination av kunskap och ansträngning mellan två eller flera personer",
      "När två sinnen kommer samman skapas en tredje, osynlig kraft",
      "Ekonomisk Master Mind ger praktiska fördelar och resurser",
      "Psykisk Master Mind ger sympati, förståelse och moral stöd",
      "Harmoni är absolut nödvändig för Master Mind att fungera"
    ],
    practicalSteps: [
      {
        step: "Identifiera potentiella medlemmar",
        description: "Hitta personer med kompletterande färdigheter, kunskap och resurser"
      },
      {
        step: "Definiera gemensamt syfte",
        description: "Skapa ett tydligt, gemensamt mål som gynnar alla gruppmedlemmar"
      },
      {
        step: "Etablera mötesrutiner",
        description: "Sätt regelbundna möten med tydlig agenda och struktur"
      },
      {
        step: "Upprätthåll harmoni",
        description: "Aktivt arbeta för att upprätthålla positiva relationer och lösa konflikter"
      },
      {
        step: "Bidra lika mycket som du tar",
        description: "Säkerställ att du ger värde till gruppen och inte bara tar"
      }
    ],
    commonPitfalls: [
      "Att försöka dominera gruppen istället för att samarbeta",
      "Att välja medlemmar baserat på vänskap snarare än kompetens",
      "Att inte ha ett tillräckligt definitivt gemensamt syfte",
      "Att låta ego och konflikter förstöra harmoni",
      "Att förvänta sig resultat utan att investera i relationerna"
    ],
    exercises: [
      {
        title: "Designa din Master Mind-grupp",
        duration: "2 timmar",
        materials: ["Penna", "Papper", "Kontaktlista"],
        instructions: "Skapa en detaljerad plan för din Master Mind-grupp. Identifiera potentiella medlemmar, definiera gruppens syfte, och skissera hur mötena kommer att struktureras."
      },
      {
        title: "Första Master Mind-mötet",
        duration: "2 timmar",
        materials: ["Agenda", "Anteckningsblock", "Gruppmedlemmar"],
        instructions: "Organisera och genomför ditt första Master Mind-möte. Etablera mål, roller och mötesrutiner. Dokumentera beslut och nästa steg."
      }
    ],
    lessonText: `Master Mind-principen är den nionde principen och enligt Hill den mest kraftfulla av alla. Den bygger på principen att "två huvuden är bättre än ett" - men mycket mer än så.

När två eller flera sinnen arbetar i perfekt harmoni mot ett gemensamt mål, skapas en tredje, osynlig intelligens som är tillgänglig för varje individ i gruppen. Denna kollektiva intelligens överträffar de individuella bidragen.

Hill identifierade två typer av Master Mind-fördelar:

1. **Ekonomiska fördelar**: Tillgång till andras kunskap, erfarenhet, träning och kontakter
2. **Psykiska fördelar**: Sympati, förståelse, uppmuntran och moraliskt stöd

För att bygga en effektiv Master Mind-grupp:

**Välj medlemmar som:**
- Har kunskap eller färdigheter som kompletterar dina
- Är helt engagerade i framgång
- Kan bidra med resurser eller kontakter
- Du har förtroende för och kan arbeta med harmoniskt

**Gruppens struktur:**
- 2-6 medlemmar (fler blir svårt att koordinera)
- Regelbundna möten (helst veckovis)
- Tydlig agenda och målsättning
- Ömsesidigt utbyte av värde

**Håll harmoni genom att:**
- Fokusera på gemensamma mål
- Respektera varje medlems bidrag
- Lösa konflikter snabbt och konstruktivt
- Säkerställa att alla drar nytta av gruppen

Master Mind-principen är så kraftfull att Hill krediterade den som den främsta orsaken till sina egna framgångar.`,
    quote: "Ingen individuell har tillräcklig erfarenhet, utbildning, naturlig förmåga och kunskap för att säkerställa ackumulering av stor rikedom utan samarbete med andra människor.",
    reflectionQuestions: [
      {
        question: "Vilka personer i ditt nätverk skulle kunna vara värdefulla Master Mind-partners? Vad skulle var och en bidra med?",
        placeholder: "Lista potentiella medlemmar och deras unika styrkor och resurser."
      },
      {
        question: "Vad kan du erbjuda en Master Mind-grupp? Vilka är dina starkaste bidrag?",
        placeholder: "Inventera dina färdigheter, kunskap, kontakter och resurser som skulle gynna andra."
      },
      {
        question: "Hur kommer du att upprätthålla harmoni och positivitet i din Master Mind-grupp?",
        placeholder: "Utveckla strategier för gruppledning och konfliktlösning."
      }
    ],
    quiz: [
      {
        question: "Vad skapas när två eller flera sinnen arbetar i harmoni enligt Master Mind-principen?",
        options: [
          "Bättre organisation",
          "En tredje, osynlig intelligens",
          "Mer motivation",
          "Mindre arbete för alla"
        ],
        correctAnswer: 1,
        explanation: "Master Mind skapar en kollektiv intelligens som är större än summan av individuella bidrag."
      },
      {
        question: "Vad är absolut nödvändigt för att Master Mind ska fungera?",
        options: [
          "Att alla medlemmar är likadana",
          "Att gruppen är stor",
          "Perfekt harmoni mellan medlemmarna",
          "Att möten hålls dagligen"
        ],
        correctAnswer: 2,
        explanation: "Harmoni är det mest kritiska elementet - utan harmoni finns ingen Master Mind-effekt."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 9",
        type: "bok"
      },
      {
        title: "Byggande av framgångsrika team",
        type: "artikel"
      }
    ]
  },
  {
    id: 10,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCm9SE2bVjDzCAnl1tUye7pQSZV0kdXaI6iFx4',
    title: "Hjärnan och ditt sinne",
    description: "Förstå hur din hjärna fungerar som en sändnings- och mottagningsstation för tankar och idéer.",
    icon: "Radio",
    purpose: "Denna modul utforskar hjärnans roll som kommunikationsverktyg och hur du kan optimera dess funktion för framgång.",
    overview: {
      mainGoal: "Att förstå hjärnans funktion som en tanke-sändare och mottagare, och hur du kan använda denna kunskap",
      keyTakeaways: [
        "Hjärnan fungerar som en radiomottagare för tankar och idéer",
        "Starkt laddade tankar sänds ut och attraherar liknande tankar",
        "Det undermedvetna sinnet filtrerar och tolkar mottagna tankar",
        "Master Mind-grupper förstärker hjärnans sändnings- och mottagningsförmåga"
      ],
      applicationGuidance: "Utveckla medvetenhet om dina tankeprocesser och träna din förmåga att ställa in på positiva tankevågor. Använd Master Mind-grupper för att förstärka denna effekt."
    },
    keyPrinciples: [
      "Hjärnan är både en sändnings- och mottagningsstation för tankar",
      "Kreativ fantasi är mottagningsapparaten för hjärnan",
      "Starkt emotionella tankar sänder starkare signaler",
      "Det undermedvetna sinnet är det medium genom vilket hjärnan kommunicerar",
      "Master Mind förstärker hjärnans kraft exponentiellt"
    ],
    practicalSteps: [
      {
        step: "Rena din mentala atmosfär",
        description: "Eliminera negativa influenser som stör din mentala mottagning"
      },
      {
        step: "Ladda tankar med känsla",
        description: "Ge dina mål och planer stark känslomässig energi"
      },
      {
        step: "Öva mental stilhet",
        description: "Skapa perioder av mental ro för att förbättra mottaglighet"
      },
      {
        step: "Använd Master Mind",
        description: "Samarbeta med andra för att förstärka din mentala kraft"
      },
      {
        step: "Dokumentera insikter",
        description: "Anteckna alla plötsliga idéer eller inspirationer du får"
      }
    ],
    commonPitfalls: [
      "Att ignorera eller avfärda plötsliga inspirationer",
      "Att fylla sinnet med för mycket 'brus' från negativa källor",
      "Att inte ge tankar tillräcklig känslomässig energi",
      "Att arbeta isolerat istället för att använda Master Mind",
      "Att inte träna förmågan att 'ställa in' på rätt tankevågor"
    ],
    exercises: [
      {
        title: "Mental inställningspraktik",
        duration: "15 minuter dagligen",
        materials: ["Lugn miljö", "Dina mål"],
        instructions: "Varje dag, ägna 15 minuter åt att 'ställa in' ditt sinne på dina mål. Ladda dina tankar med känslomässig energi och var öppen för nya idéer och inspiration."
      },
      {
        title: "Insiktsdagbok",
        duration: "5 minuter dagligen",
        materials: ["Anteckningsbok", "Penna"],
        instructions: "Föra en dagbok över alla plötsliga idéer, inspirationer eller insikter du får. Granska regelbundet för att identifiera mönster och användbar information."
      }
    ],
    lessonText: `Hjärnan och ditt sinne utgör den tionde principen och förklarar de mer mystiska aspekterna av hur framgång materialiseras.

Hill föreslog att hjärnan fungerar som en sofistikerad radiomottagare, kapabel att både sända ut och ta emot tankevibrationer. Denna teori, som verkade revolutionerande på Hills tid, är nu mer accepterad i ljuset av modern neurovetenskap och kvantfysik.

Nyckelpunkter om hjärnans funktion:

**Som sändare:**
- Tankar laddade med stark känsla sänder kraftfulla signaler
- Dessa signaler attraherar liknande tanker och människor
- Konsistenta tankemönster skapar en "mental atmosfär" omkring dig

**Som mottagare:**
- Hjärnan plockar upp tankevågor från andra källor
- Det undermedvetna sinnet filtrerar och tolkar dessa signaler
- Kreativ fantasi fungerar som den primära mottagningsapparaten

**Faktorer som påverkar hjärnans effektivitet:**
1. **Mental renhet**: Fri från negativa influenser
2. **Känslomässig intensitet**: Starka känslor förstärker signaler
3. **Mental harmoni**: Inre frid förbättrar mottaglighet
4. **Master Mind-allianser**: Förstärker både sändning och mottagning

För att optimera din hjärnas funktion, eliminera mentalt "brus" från negativa källor och omge dig med positiva influenser som stöder dina mål.`,
    quote: "När stimulerad, eller 'stämd upp' till en hög grad av vibration, blir sinnet mer mottagligt för tanken som når det från utomstående källor.",
    reflectionQuestions: [
      {
        question: "Vilka externa influenser påverkar dina tankar dagligen? Vilka är positiva och vilka negativa?",
        placeholder: "Analysera nyhetsmedia, sociala medier, människor och miljöer som formar ditt tänkande."
      },
      {
        question: "Beskriv en tid när du fick en plötslig inspiration eller idé. Var kom den ifrån enligt dig?",
        placeholder: "Reflektera över kreativa genombrott och vad som möjliggjorde dem."
      },
      {
        question: "Hur kan du skapa en mer 'mottaglig' mental atmosfär för positiva tankar och idéer?",
        placeholder: "Utveckla strategier för att optimera din mentala miljö för kreativitet och inspiration."
      }
    ],
    quiz: [
      {
        question: "Enligt Hill, vad fungerar som hjärnans primära mottagningsapparat?",
        options: [
          "Det medvetna sinnet",
          "Kreativ fantasi",
          "Logiskt tänkande",
          "Minnet"
        ],
        correctAnswer: 1,
        explanation: "Kreativ fantasi är hjärnans mottagningsapparat för tankar från externa källor."
      },
      {
        question: "Vad förstärker hjärnans förmåga att både sända och ta emot enligt Master Mind-principen?",
        options: [
          "Att arbeta ensam",
          "Harmonisk samverkan med andra sinnen",
          "Att undvika andras påverkan",
          "Att fokusera endast på egna tankar"
        ],
        correctAnswer: 1,
        explanation: "Master Mind-samverkan förstärker hjärnans kommunikationsförmåga exponentiellt."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 10",
        type: "bok"
      },
      {
        title: "Medvetenhet och mental optimering",
        type: "artikel"
      }
    ]
  },
  {
    id: 11,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHC2FUD0EX4Xuw0sOU5gWozk6clEfde8bBYInQF',
    title: "Transmutation av sexuell energi",
    description: "Lär dig att kanalisera din mest kraftfulla energi mot kreativa och produktiva ändamål för extraordinära resultat.",
    icon: "Flame",
    purpose: "Denna modul lär dig att omvandla sexuell energi till kreativ kraft för att uppnå högre nivåer av prestation och genialitet.",
    overview: {
      mainGoal: "Att förstå och praktisera transmutation av sexuell energi för att förstärka kreativitet och produktivitet",
      keyTakeaways: [
        "Sexuell energi är den mest kraftfulla av alla mänskliga drivkrafter",
        "Denna energi kan omvandlas till kreativ och intellektuell kraft",
        "Transmutation leder till förhöjd mental förmåga och genialitet",
        "Kanaliserad sexuell energi förstärker alla andra framgångsprinciper"
      ],
      applicationGuidance: "Lär dig att känna igen denna energi och medvetet rikta den mot dina mål och kreativa projekt. Använd intensiteten för att förstärka din fokus och produktivitet."
    },
    keyPrinciples: [
      "Sexuell energi är den mest kraftfulla stimulatorn för handling",
      "När omvandlad kan denna energi lyfta en person till genialitet",
      "De mest framgångsrika människorna utvecklar sexuell transmutation",
      "Denna energi måste riktas mot kreativa och konstruktiva ändamål",
      "Transmutation förstärker fantasi, mod, kraft av vilja och uthållighet"
    ],
    practicalSteps: [
      {
        step: "Känna igen energin",
        description: "Lär dig att identifiera när denna kraftfulla energi är aktiv"
      },
      {
        step: "Rikta energin medvetet",
        description: "Kanalisera energin mot kreativa projekt och måluppnåelse"
      },
      {
        step: "Använd för kreativitet",
        description: "Tillämpa denna energi under perioder av kreativt arbete"
      },
      {
        step: "Förstärk andra principer",
        description: "Använd energin för att intensifiera autosuggestion, visualisering och planering"
      },
      {
        step: "Utveckla mental disciplin",
        description: "Bygg förmågan att styra och rikta denna kraftfulla energi"
      }
    ],
    commonPitfalls: [
      "Att förneka eller undertrycka denna naturliga energi",
      "Att slösa energin på icke-produktiva aktiviteter",
      "Att inte förstå kopplingen mellan sexuell energi och kreativitet",
      "Att sakna mental disciplin för att rikta energin",
      "Att inte kombinera transmutation med andra framgångsprinciper"
    ],
    exercises: [
      {
        title: "Energi-medvetenhetspraktik",
        duration: "20 minuter dagligen",
        materials: ["Lugn miljö", "Kreativt projekt"],
        instructions: "När du känner stark energi, kanalisera den omedelbart mot ett kreativt eller produktivt projekt. Observera hur detta påverkar din prestation och kvalitet."
      },
      {
        title: "Kreativ transmutationssession",
        duration: "45 minuter",
        materials: ["Kreativt projekt", "Dina mål"],
        instructions: "Under perioder av hög energi, ägna intensiv tid åt kreativt arbete relaterat till dina mål. Fokusera helt på uppgiften och låt energin driva din produktivitet."
      }
    ],
    lessonText: `Transmutation av sexuell energi är den elfte principen och en av de mest kraftfulla, men också missförstådda, av Hills läror.

Hill observerade att de mest framgångsrika männen och kvinnorna utvecklade förmågan att omvandla sexuell energi till andra former av ansträngning. Denna transmutation är vad som separerar geniala prestationer från vanliga resultat.

Sexuell energi är:
- Den mest kraftfulla av alla mänskliga känslor
- Den energi som driver kreativitet och innovation
- En källa till mental skärpa och fokus
- Det som ger uthållighet och intensitet åt ansträngningar

**Vad transmutation innebär:**
Transmutation betyder att förvandla sexuell energi från enbart fysisk uttryck till mental och kreativ kraft. Det handlar inte om förnekelse eller undertryckning, utan om medveten kanalisering.

**Fördelar med transmutation:**
1. **Förhöjd kreativitet**: Kraftfull energi för innovativa idéer
2. **Intensifierat fokus**: Ökad förmåga att koncentrera sig
3. **Förstärkt mod**: Större vilja att ta risker och agera
4. **Ökad magnetism**: Mer attraktiv personlighet och ledarskap
5. **Förbättrad uthållighet**: Större mental och fysisk energi

Hill noterade att män sällan uppnår stor framgång före 40 års ålder eftersom de inte har lärt sig att transmutera sexuell energi effektivt.

Praktisk transmutation involverar att känna igen denna kraftfulla energi och medvetet rikta den mot dina mål, kreativa projekt och affärsverksamheter.`,
    quote: "Geniet ligger inte i att ha nya tankar, utan i att tänka gamla tankar på nya sätt.",
    reflectionQuestions: [
      {
        question: "Hur känner du igen perioder av intensiv mental energi? Vad triggar dem?",
        placeholder: "Identifiera mönster och triggers för dina mest energiska och kreativa perioder."
      },
      {
        question: "Vilka kreativa projekt eller mål skulle dra nytta av intensifierad energi och fokus?",
        placeholder: "Lista aktiviteter där extra mental kraft skulle göra betydande skillnad."
      },
      {
        question: "Hur kan du bättre disciplinera dig själv att rikta kraftfull energi mot produktiva ändamål?",
        placeholder: "Utveckla strategier för mental disciplin och energikanalisering."
      }
    ],
    quiz: [
      {
        question: "Vad är sexuell transmutation enligt Napoleon Hill?",
        options: [
          "Att förneka sexuella impulser",
          "Att omvandla sexuell energi till kreativ och mental kraft",
          "Att undvika romantiska relationer",
          "Att endast fokusera på fysiska aspekter"
        ],
        correctAnswer: 1,
        explanation: "Transmutation är att omvandla sexuell energi till kraftfull mental och kreativ energi."
      },
      {
        question: "Enligt Hill, vid vilken ålder börjar de flesta män uppnå stor framgång?",
        options: [
          "Före 30 års ålder",
          "Omkring 25 års ålder",
          "Inte före 40 års ålder",
          "Det spelar ingen roll"
        ],
        correctAnswer: 2,
        explanation: "Hill observerade att män sällan uppnår stor framgång före 40 eftersom de inte lärt sig transmutation."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 11",
        type: "bok"
      },
      {
        title: "Energi och kreativitet",
        type: "artikel"
      }
    ]
  },
  {
    id: 12,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCRMgBjfzL82uQhim9v5k6AYnDXPIbEgysaoBe',
    title: "Det sjätte sinnet",
    description: "Utveckla din intuition och förmåga att ta emot vägledning från Oändlig Intelligens för överlägsen beslutsfattande.",
    icon: "Eye",
    purpose: "Denna modul utvecklar ditt sjätte sinne - din direkta koppling till universell visdom och intuition.",
    overview: {
      mainGoal: "Att utveckla och lita på din intuition som en källa till överlägsen vägledning och insikt",
      keyTakeaways: [
        "Det sjätte sinnet är kulmen av alla andra principer",
        "Intuition är din direkta koppling till Oändlig Intelligens",
        "Detta sinne utvecklas genom praktik av de andra principerna",
        "Det sjätte sinnet ger vägledning som logik ensam inte kan ge"
      ],
      applicationGuidance: "Utveckla dagliga rutiner för reflektion och meditation. Lär dig att lyssna på din inre röst och agera på intuition kombinerat med logisk analys."
    },
    keyPrinciples: [
      "Det sjätte sinnet är den del av undermedvetna som kallas 'kreativ fantasi'",
      "Genom detta sinne får du varningar om kommande faror och inspiration",
      "Det kan endast utvecklas genom meditation och själv-utveckling",
      "Det sjätte sinnet fungerar automatiskt bara efter att de andra principerna behärskats",
      "Det är din direkta kommunikationslinje med Oändlig Intelligens"
    ],
    practicalSteps: [
      {
        step: "Tillämpa alla tidigare principer",
        description: "Fortsätt praktisera de första 11 principerna konsekvent"
      },
      {
        step: "Utveckla mental stilhet",
        description: "Skapa regelbundna perioder av meditation och reflektion"
      },
      {
        step: "Lyssna på intuition",
        description: "Var uppmärksam på första intryck och magkänslor"
      },
      {
        step: "Testa intuitive hunches",
        description: "Agera på små intuitive impulser för att bygga förtroende"
      },
      {
        step: "Dokumentera insikter",
        description: "Föra journal över intuitive upplevelser och deras resultat"
      }
    ],
    commonPitfalls: [
      "Att försöka utveckla sjätte sinnet utan att behärska de andra principerna",
      "Att ignorera intuition till förmån för enbart logik",
      "Att vänta på 'spektakulära' manifestationer istället för subtila signaler",
      "Att inte ha tålamod med utvecklingsprocessen",
      "Att blanda ihop önsketänkande med äkta intuition"
    ],
    exercises: [
      {
        title: "Daglig intuitionspraktik",
        duration: "15 minuter dagligen",
        materials: ["Lugn miljö", "Öppet sinne"],
        instructions: "Ägna 15 minuter dagligen åt tyst reflektion. Fokusera på dina mål och var öppen för vägledning, idéer eller insikter som kan uppstå."
      },
      {
        title: "Intuitionsdagbok",
        duration: "5 minuter dagligen",
        materials: ["Dagbok", "Penna"],
        instructions: "Dokumentera alla intuitive impulser, föraningar eller plötsliga insikter. Spåra vilka som visade sig vara korrekta för att bygga förtroende för ditt sjätte sinne."
      }
    ],
    lessonText: `Det sjätte sinnet är den tolfte principen och kulmen av Hills filosofi. Det är den punkt där det mänskliga sinnet kommer i kontakt med Oändlig Intelligens.

Hill beskrev det sjätte sinnet som "den del av det undermedvetna sinnet som kallas 'kreativ fantasi'". Det är genom detta sinne som "hunches" och inspirationer tas emot. Det är ofta kallat "intuition".

Det sjätte sinnet:
- Kan inte förklaras fullt ut vetenskapligt
- Utvecklas endast genom meditation och mental utveckling  
- Fungerar automatiskt endast efter behärskning av de andra principerna
- Ger tillgång till kunskap som inte kan förvärvas genom de fem fysiska sinnena

**Utveckling av det sjätte sinnet:**

1. **Tillämpa de andra principerna**: Det sjätte sinnet är resultatet av att behärska de första 11
2. **Regelbunden meditation**: Skapa dagliga perioder av mental stilhet
3. **Öppet sinne**: Var mottaglig för nya idéer och oväntade insikter
4. **Dokumentera upplevelser**: Anteckna intuitive impulser och deras resultat
5. **Agera på vägledning**: Bygg förtroende genom att följa intuition

**Tecken på utvecklat sjätte sinne:**
- Plötsliga lösningar på komplexa problem
- Rätt timing i beslut och handlingar
- Förmåga att känna människors sanna avsikter
- Vägledning i osäkra situationer
- Kreativa genombrott och innovation

Hill varnade för att det sjätte sinnet inte kan forceras fram - det utvecklas naturligt genom konsekvent tillämpning av de andra principerna.`,
    quote: "Det sjätte sinnet är den delen av det undermedvetna sinnet som kallas kreativ fantasi. Det har också kallats 'mottagningsantenn' för idéer, planer och tankar som blixtrar in i sinnet.",
    reflectionQuestions: [
      {
        question: "Hur skiljer du mellan äkta intuition och önsketänkande eller rädsla?",
        placeholder: "Utveckla kriterier för att känna igen äkta intuitiv vägledning."
      },
      {
        question: "Beskriv ett tillfälle när du följde din intuition och det ledde till ett positivt resultat.",
        placeholder: "Reflektera över framgångsrika intuitive beslut för att bygga förtroende."
      },
      {
        question: "Hur kan du skapa mer utrymme i ditt liv för att höra din inre vägledning?",
        placeholder: "Identifiera sätt att minska mental 'buller' och öka receptivitet för insikter."
      }
    ],
    quiz: [
      {
        question: "Vad kallar Hill det sjätte sinnet?",
        options: [
          "Logiskt tänkande",
          "Kreativ fantasi eller mottagningsantenn för tankar",
          "Minne och erfarenhet",
          "Social intelligens"
        ],
        correctAnswer: 1,
        explanation: "Det sjätte sinnet är den del av kreativ fantasi som tar emot idéer och inspiration."
      },
      {
        question: "När utvecklas det sjätte sinnet enligt Hill?",
        options: [
          "Automatiskt med åldern",
          "Genom att läsa mycket",
          "Endast efter behärskning av de andra principerna",
          "Genom att undvika logiskt tänkande"
        ],
        correctAnswer: 2,
        explanation: "Det sjätte sinnet utvecklas som en naturlig följd av att tillämpa de första 11 principerna."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 12",
        type: "bok"
      },
      {
        title: "Intuition och beslutsfattande",
        type: "artikel"
      }
    ]
  },
  {
    id: 13,
    videoUrl: 'https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHC2bVNqfbX4Xuw0sOU5gWozk6clEfde8bBYInQ',
    title: "Filosofin om rikedom",
    description: "Integrera alla principer till en sammanhängande livsfilosofi för bestående framgång och rikedom.",
    icon: "Crown",
    purpose: "Denna avslutande modul integrerar alla 12 principer till en sammanhängande filosofi för livslång framgång och rikedom.",
    overview: {
      mainGoal: "Att sammanfoga alla framgångsprinciper till en personlig filosofi som guidar alla aspekter av ditt liv",
      keyTakeaways: [
        "Alla 13 principer måste tillämpas tillsammans för maximal effekt",
        "Filosofin måste bli en del av din dagliga livsstil",
        "Bestående framgång kräver kontinuerlig tillämpning av principerna",
        "Din framgång bör användas för att hjälpa andra lyckas"
      ],
      applicationGuidance: "Skapa en personlig framgångsfilosofi som integrerar alla 13 principer. Gör denna filosofi till grunden för alla dina beslut och handlingar."
    },
    keyPrinciples: [
      "Alla tretton principerna måste tillämpas som en sammanhängande helhet",
      "Filosofin måste praktiseras dagligen för att vara effektiv",
      "Framgång utan bidrag till andra är ofullständig",
      "Kontinuerlig självutveckling är livslång process",
      "Den 'stora hemligheten' ligger i synergistisk tillämpning av alla principer"
    ],
    practicalSteps: [
      {
        step: "Skapa din personliga filosofi",
        description: "Integrera alla 13 principer till en sammanhängande livsfilosofi"
      },
      {
        step: "Daglig filosofisk praktik",
        description: "Tillämpa aspekter av din filosofi i varje beslut och handling"
      },
      {
        step: "Regelbunden reflektion",
        description: "Granska och förfina din filosofi baserat på erfarenhet och resultat"
      },
      {
        step: "Dela din kunskap",
        description: "Undervisa och mentora andra i framgångsprinciperna"
      },
      {
        step: "Kontinuerlig utveckling",
        description: "Fortsätt att lära och växa genom att studera framgång och utveckla din filosofi"
      }
    ],
    commonPitfalls: [
      "Att tro att du är 'klar' efter att ha lärt principerna",
      "Att tillämpa principerna sporadiskt istället för konsekvent",
      "Att fokusera på materiell framgång utan att bidra till andra",
      "Att inte anpassa filosofin när livet förändras",
      "Att glömma principerna när framgång uppnås"
    ],
    exercises: [
      {
        title: "Skapa din framgångsfilosofi",
        duration: "3 timmar",
        materials: ["Alla dina anteckningar från kursen", "Penna", "Papper"],
        instructions: "Skriv en omfattande personlig framgångsfilosofi som integrerar alla 13 principer. Beskriv hur du kommer att tillämpa varje princip i ditt dagliga liv."
      },
      {
        title: "Månadsvis filosofisk granskning",
        duration: "1 timme månaden",
        materials: ["Din framgångsfilosofi", "Framstegsjournal"],
        instructions: "Varje månad, granska hur väl du har levt enligt din filosofi. Identifiera framsteg, utmaningar och områden för förbättring."
      }
    ],
    lessonText: `Filosofin om rikedom är den trettonde och sista principen, som sammanför alla tidigare läror till en sammanhängande livsfilosofi.

Hill betonade att den verkliga "hemligheten" i "Tänk och Bli Rik" inte är någon enskild princip, utan den synergistiska kraften som uppstår när alla tretton principerna tillämpas tillsammans i harmoni.

**Den stora hemligheten:**
Hemligheten ligger inte i att bara läsa eller förstå principerna, utan i att tillämpa dem systematiskt och konsekvent i alla aspekter av ditt liv. Det är transformationen av kunskap till handling som skapar resultat.

**Kärnkomponenter i rikedomsfilosofin:**

1. **Helhetsperspektiv**: Se alla 13 principer som delar av ett enda system
2. **Livslång praktik**: Kontinuerlig tillämpning, inte bara tillfällig användning
3. **Service till andra**: Använda framgång för att hjälpa andra lyckas
4. **Balanserad rikedom**: Sträva efter rikedom i alla livets områden - hälsa, relationer, syfte, inte bara pengar
5. **Kontinuerlig utveckling**: Aldrig sluta lära, växa och förbättra

**Övervinna de sex grundläggande rädslorna:**
Som en del av denna filosofi måste du identifiera och övervinna Hills sex grundläggande rädslor:
1. Rädsla för fattigdom
2. Rädsla för kritik  
3. Rädsla för dålig hälsa
4. Rädsla för förlust av kärlek
5. Rädsla för ålderdom
6. Rädsla för döden

**Implementering av filosofin:**
Din personliga rikedomsfilosofi bör bli din dagliga guide för beslut, relationer och handlingar. Den bör ständigt påminna dig om dina högsta värderingar och mål.

Kom ihåg att denna filosofi är en levande, andas dokument som växer och utvecklas med dig genom livet.`,
    quote: "Rikedom börjar med en sinnesstämning, med definitivt syfte, med liten eller ingen hård ansträngning.",
    reflectionQuestions: [
      {
        question: "Hur har din förståelse av framgång och rikedom förändrats genom denna kurs?",
        placeholder: "Reflektera över din mentala transformation och nya perspektiv på framgång."
      },
      {
        question: "Vilka av de 13 principerna resonerar starkast med dig och varför?",
        placeholder: "Identifiera vilka principer känns mest kraftfulla för din personliga situation."
      },
      {
        question: "Hur kommer du att använda din framgång för att hjälpa andra uppnå sina mål?",
        placeholder: "Planera hur du kan bidra till andras framgång som en del av din egen filosofi."
      }
    ],
    quiz: [
      {
        question: "Vad är den 'stora hemligheten' i Think and Grow Rich enligt Hill?",
        options: [
          "En specifik teknik för att tjäna pengar",
          "Synergistisk tillämpning av alla 13 principer tillsammans",
          "Att bara tänka positivt",
          "Att arbeta hårdare än alla andra"
        ],
        correctAnswer: 1,
        explanation: "Hemligheten är i den kombinerade, synergistiska kraften av alla principer tillämpade tillsammans."
      },
      {
        question: "Vad bör din attityd vara efter att ha behärskat alla principerna?",
        options: [
          "Att du är klar med lärande",
          "Att fortsätta tillämpa och hjälpa andra",
          "Att fokusera endast på dina egna mål", 
          "Att sluta följa principerna"
        ],
        correctAnswer: 1,
        explanation: "Äkta behärskning innebär kontinuerlig tillämpning och att hjälpa andra lyckas."
      }
    ],
    resources: [
      {
        title: "Tänk och Bli Rik - Kapitel 13",
        type: "bok"
      },
      {
        title: "Livslång framgångsfilosofi",
        type: "artikel"
      }
    ]
  }
];