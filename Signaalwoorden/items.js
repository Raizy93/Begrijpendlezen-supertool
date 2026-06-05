window.SIGN_ITEMS = [
  {
    id: "schooltuin",
    onderwerp: "Schooltuin",
    alineas: [
      [
        "Groep 8 werkt dit voorjaar aan een kleine schooltuin achter het lokaal.",
        "Eerst haalde de klas onkruid weg en maakte meester Karim de grond los.",
        "Daarna verdeelden de kinderen de bedden voor kruiden, bloemen en aardbeien.",
        "De tuin ziet er nog kaal uit, maar over een paar weken komen de eerste groene puntjes boven de aarde."
      ],
      [
        "De leerlingen houden een schema bij, zodat elke groep weet wanneer er water gegeven moet worden.",
        "Sommige planten hebben veel zon nodig, bijvoorbeeld tomaten en basilicum.",
        "Kortom, de schooltuin is niet alleen een klus, maar ook een onderzoek naar groei en samenwerking."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Eerst haalde de klas onkruid weg en maakte meester Karim de grond los.",
        mark: "Eerst",
        correct: "tijd",
        options: ["tijd", "reden", "tegenstelling", "voorbeeld"],
        uitleg: "\"Eerst\" laat zien wat als eerste gebeurt. Het geeft dus een volgorde in de tijd aan."
      },
      {
        type: "verband",
        zin: "Sommige planten hebben veel zon nodig, bijvoorbeeld tomaten en basilicum.",
        mark: "bijvoorbeeld",
        correct: "voorbeeld",
        options: ["voorbeeld", "conclusie", "oorzaak", "opsomming"],
        uitleg: "\"Bijvoorbeeld\" kondigt voorbeelden aan van planten die veel zon nodig hebben."
      },
      {
        type: "kies",
        zin: "De tuin ziet er nog kaal uit, {{blank}} over een paar weken komen de eerste groene puntjes boven de aarde.",
        target: "De tuin ziet er nog kaal uit, maar over een paar weken komen de eerste groene puntjes boven de aarde.",
        correct: "maar",
        relatie: "tegenstelling",
        options: ["maar", "daarom", "bijvoorbeeld", "eerst"],
        uitleg: "Hier staat eerst iets negatiefs en daarna iets positiefs. \"Maar\" past bij die tegenstelling."
      }
    ]
  },
  {
    id: "nieuws-fietsbrug",
    onderwerp: "Nieuwe fietsbrug",
    alineas: [
      [
        "Zwolle, 12 juni - De nieuwe fietsbrug over het kanaal is vanochtend geopend.",
        "De brug is gebouwd omdat veel leerlingen elke dag een druk kruispunt moesten oversteken.",
        "Daardoor kunnen fietsers nu sneller en veiliger naar school rijden.",
        "Wethouder Noor Bakker knipte om negen uur een blauw lint door."
      ],
      [
        "Ook buurtbewoners kwamen kijken naar de opening.",
        "Volgens de gemeente blijven er de komende weken verkeersregelaars staan, aangezien sommige fietsers nog moeten wennen aan de nieuwe route.",
        "De brug is vanaf vandaag de hele dag open."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "De brug is gebouwd omdat veel leerlingen elke dag een druk kruispunt moesten oversteken.",
        mark: "omdat",
        correct: "reden",
        options: ["reden", "voorbeeld", "conclusie", "tijd"],
        uitleg: "\"Omdat\" geeft de reden waarom de brug is gebouwd."
      },
      {
        type: "verband",
        zin: "Daardoor kunnen fietsers nu sneller en veiliger naar school rijden.",
        mark: "Daardoor",
        correct: "oorzaak",
        options: ["oorzaak", "tegenstelling", "opsomming", "voorbeeld"],
        uitleg: "\"Daardoor\" wijst naar het gevolg van de nieuwe brug: fietsers rijden sneller en veiliger."
      },
      {
        type: "kies",
        zin: "Volgens de gemeente blijven er de komende weken verkeersregelaars staan, {{blank}} sommige fietsers nog moeten wennen aan de nieuwe route.",
        target: "Volgens de gemeente blijven er de komende weken verkeersregelaars staan, aangezien sommige fietsers nog moeten wennen aan de nieuwe route.",
        correct: "aangezien",
        relatie: "reden",
        options: ["aangezien", "echter", "tot slot", "zoals"],
        uitleg: "\"Aangezien\" geeft een reden of verklaring: verkeersregelaars blijven staan omdat fietsers moeten wennen."
      }
    ]
  },
  {
    id: "instructie-vogelhuis",
    onderwerp: "Vogelhuisje maken",
    alineas: [
      [
        "Voor een eenvoudig vogelhuisje heb je houten plankjes, spijkers, schuurpapier en verf nodig.",
        "Leg eerst alle materialen klaar op een stevige tafel.",
        "Schuur daarna de randen van de plankjes, zodat vogels zich niet kunnen bezeren.",
        "Vervolgens spijker je de zijkanten aan de bodem vast."
      ],
      [
        "Maak het dak niet helemaal dicht met lijm, want je moet het huisje later kunnen schoonmaken.",
        "Tot slot verf je de buitenkant met verf die tegen regen kan.",
        "Hang het huisje op een rustige plek, bijvoorbeeld aan een boom of tegen een schutting."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Vervolgens spijker je de zijkanten aan de bodem vast.",
        mark: "Vervolgens",
        correct: "tijd",
        options: ["tijd", "conclusie", "tegenstelling", "reden"],
        uitleg: "\"Vervolgens\" laat zien welke stap na de vorige stap komt."
      },
      {
        type: "kies",
        zin: "Maak het dak niet helemaal dicht met lijm, {{blank}} je moet het huisje later kunnen schoonmaken.",
        target: "Maak het dak niet helemaal dicht met lijm, want je moet het huisje later kunnen schoonmaken.",
        correct: "want",
        relatie: "reden",
        options: ["want", "maar", "kortom", "daarna"],
        uitleg: "\"Want\" geeft de reden waarom je het dak niet helemaal dichtmaakt."
      },
      {
        type: "verband",
        zin: "Hang het huisje op een rustige plek, bijvoorbeeld aan een boom of tegen een schutting.",
        mark: "bijvoorbeeld",
        correct: "voorbeeld",
        options: ["voorbeeld", "opsomming", "oorzaak", "tegenstelling"],
        uitleg: "\"Bijvoorbeeld\" laat voorbeelden zien van rustige plekken waar je het huisje kunt ophangen."
      }
    ]
  },
  {
    id: "blog-klassenuitje",
    onderwerp: "Blog over een klassenuitje",
    alineas: [
      [
        "Dinsdag gingen we met de klas naar het wetenschapsmuseum.",
        "Ik dacht dat het vooral stil en serieus zou zijn, maar dat viel enorm mee.",
        "We mochten proefjes doen met magneten, licht en geluid.",
        "Daarnaast kregen we een demonstratie met een robotarm."
      ],
      [
        "De proef met geluid vond ik het leukst, omdat je de trillingen echt kon voelen.",
        "Sommige opdrachten waren lastig; toch hielp bijna iedereen elkaar.",
        "Al met al was dit een uitje waar ik nog lang aan terugdenk."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Ik dacht dat het vooral stil en serieus zou zijn, maar dat viel enorm mee.",
        mark: "maar",
        correct: "tegenstelling",
        options: ["tegenstelling", "voorbeeld", "reden", "opsomming"],
        uitleg: "\"Maar\" laat een tegenstelling zien tussen de verwachting en hoe het echt was."
      },
      {
        type: "verband",
        zin: "Daarnaast kregen we een demonstratie met een robotarm.",
        mark: "Daarnaast",
        correct: "opsomming",
        options: ["opsomming", "conclusie", "tijd", "oorzaak"],
        uitleg: "\"Daarnaast\" voegt nog iets toe aan wat de klas allemaal deed."
      },
      {
        type: "kies",
        zin: "Sommige opdrachten waren lastig; {{blank}} hielp bijna iedereen elkaar.",
        target: "Sommige opdrachten waren lastig; toch hielp bijna iedereen elkaar.",
        correct: "toch",
        relatie: "tegenstelling",
        options: ["toch", "daarom", "zoals", "vervolgens"],
        uitleg: "\"Toch\" past omdat de tweede zin iets vertelt dat je misschien niet verwacht na \"lastig\"."
      }
    ]
  },
  {
    id: "informatief-bijen",
    onderwerp: "Bijen",
    alineas: [
      [
        "Bijen zijn belangrijk voor bloemen, fruitbomen en veel groenten.",
        "Ze vliegen van bloem naar bloem en nemen daarbij stuifmeel mee.",
        "Daardoor kunnen planten vruchten en zaden maken.",
        "Een bijenvolk bestaat uit een koningin, werkbijen en darren."
      ],
      [
        "Werkbijen hebben verschillende taken, zoals voedsel zoeken, larven verzorgen en de kast bewaken.",
        "Bijen kunnen steken wanneer ze zich bedreigd voelen.",
        "Daarom is het verstandig om rustig te blijven als er een bij in de buurt vliegt."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Daardoor kunnen planten vruchten en zaden maken.",
        mark: "Daardoor",
        correct: "oorzaak",
        options: ["oorzaak", "voorbeeld", "tijd", "tegenstelling"],
        uitleg: "\"Daardoor\" geeft het gevolg aan van het meenemen van stuifmeel."
      },
      {
        type: "verband",
        zin: "Werkbijen hebben verschillende taken, zoals voedsel zoeken, larven verzorgen en de kast bewaken.",
        mark: "zoals",
        correct: "voorbeeld",
        options: ["voorbeeld", "conclusie", "reden", "tegenstelling"],
        uitleg: "\"Zoals\" leidt voorbeelden in van taken die werkbijen hebben."
      },
      {
        type: "kies",
        zin: "Bijen kunnen steken wanneer ze zich bedreigd voelen. {{blank}} is het verstandig om rustig te blijven als er een bij in de buurt vliegt.",
        target: "Daarom is het verstandig om rustig te blijven als er een bij in de buurt vliegt.",
        correct: "Daarom",
        relatie: "conclusie",
        options: ["Daarom", "Echter", "Bijvoorbeeld", "Bovendien"],
        uitleg: "\"Daarom\" geeft hier een conclusie of gevolg: omdat bijen kunnen steken, blijf je beter rustig."
      }
    ]
  },
  {
    id: "recensie-film",
    onderwerp: "Filmrecensie",
    alineas: [
      [
        "De film De Vergeten Sleutel begint spannend, want hoofdpersoon Lina vindt een brief onder de vloer.",
        "De eerste helft is sterk: de kijker krijgt steeds kleine aanwijzingen.",
        "Halverwege zakt het tempo echter wat in.",
        "Sommige scenes duren lang, terwijl er weinig nieuws gebeurt."
      ],
      [
        "De muziek past goed bij de geheimzinnige sfeer.",
        "Bovendien speelt de jonge actrice de hoofdrol overtuigend.",
        "Kortom, de film is niet perfect, maar wel de moeite waard voor wie van raadsels houdt."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Halverwege zakt het tempo echter wat in.",
        mark: "echter",
        correct: "tegenstelling",
        options: ["tegenstelling", "tijd", "voorbeeld", "oorzaak"],
        uitleg: "\"Echter\" betekent ongeveer \"maar\". Het zet een tegenstelling neer na de positieve start."
      },
      {
        type: "verband",
        zin: "Bovendien speelt de jonge actrice de hoofdrol overtuigend.",
        mark: "Bovendien",
        correct: "opsomming",
        options: ["opsomming", "conclusie", "reden", "voorbeeld"],
        uitleg: "\"Bovendien\" voegt nog een extra positief punt toe."
      },
      {
        type: "verband",
        zin: "Kortom, de film is niet perfect, maar wel de moeite waard voor wie van raadsels houdt.",
        mark: "Kortom",
        correct: "conclusie",
        options: ["conclusie", "tijd", "oorzaak", "voorbeeld"],
        uitleg: "\"Kortom\" kondigt een samenvattende conclusie aan."
      }
    ]
  },
  {
    id: "recept-wraps",
    onderwerp: "Groentewraps",
    alineas: [
      [
        "Voor vier groentewraps heb je wraps, komkommer, paprika, wortel, hummus en geraspte kaas nodig.",
        "Snijd eerst de groenten in dunne reepjes.",
        "Smeer daarna op elke wrap een laagje hummus.",
        "Leg vervolgens de groenten in het midden van de wrap."
      ],
      [
        "Voeg niet te veel vulling toe, anders kun je de wrap moeilijk oprollen.",
        "Je kunt extra smaak toevoegen, bijvoorbeeld met peper, munt of een beetje citroensap.",
        "Tot slot snijd je de wrap schuin doormidden."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Smeer daarna op elke wrap een laagje hummus.",
        mark: "daarna",
        correct: "tijd",
        options: ["tijd", "tegenstelling", "reden", "conclusie"],
        uitleg: "\"Daarna\" laat zien dat deze stap na het snijden van de groenten komt."
      },
      {
        type: "kies",
        zin: "Je kunt extra smaak toevoegen, {{blank}} met peper, munt of een beetje citroensap.",
        target: "Je kunt extra smaak toevoegen, bijvoorbeeld met peper, munt of een beetje citroensap.",
        correct: "bijvoorbeeld",
        relatie: "voorbeeld",
        options: ["bijvoorbeeld", "daarentegen", "dus", "omdat"],
        uitleg: "\"Bijvoorbeeld\" past omdat peper, munt en citroensap voorbeelden zijn van extra smaakmakers."
      },
      {
        type: "verband",
        zin: "Tot slot snijd je de wrap schuin doormidden.",
        mark: "Tot slot",
        correct: "tijd",
        options: ["tijd", "opsomming", "oorzaak", "tegenstelling"],
        uitleg: "\"Tot slot\" geeft de laatste stap in de volgorde aan."
      }
    ]
  },
  {
    id: "brief-buurtfeest",
    onderwerp: "Brief over buurtfeest",
    alineas: [
      [
        "Beste buurtbewoners,",
        "Op zaterdag 6 juli organiseren we een buurtfeest op het grasveld bij de speeltuin.",
        "We beginnen om drie uur met spelletjes voor kinderen.",
        "Daarna is er een gezamenlijke maaltijd, waarvoor iedereen iets kleins kan meenemen."
      ],
      [
        "We vragen u om eigen borden en bekers mee te nemen, zodat we minder afval maken.",
        "Meld u aan voor 20 juni, want dan weten we hoeveel tafels we moeten regelen.",
        "Als het hard regent, verplaatsen we het feest naar de gymzaal van de basisschool."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "We vragen u om eigen borden en bekers mee te nemen, zodat we minder afval maken.",
        mark: "zodat",
        correct: "oorzaak",
        options: ["oorzaak", "voorbeeld", "tegenstelling", "opsomming"],
        uitleg: "\"Zodat\" laat hier het doel of gevolg zien: eigen spullen meenemen zorgt voor minder afval."
      },
      {
        type: "kies",
        zin: "Meld u aan voor 20 juni, {{blank}} dan weten we hoeveel tafels we moeten regelen.",
        target: "Meld u aan voor 20 juni, want dan weten we hoeveel tafels we moeten regelen.",
        correct: "want",
        relatie: "reden",
        options: ["want", "echter", "tot slot", "zoals"],
        uitleg: "\"Want\" geeft de reden voor het aanmelden voor 20 juni."
      }
    ]
  },
  {
    id: "interview-keeper",
    onderwerp: "Interview met een keeper",
    alineas: [
      [
        "Vraag: Wanneer wist je dat je keeper wilde worden?",
        "Antwoord: Ik vond duiken naar de bal altijd leuker dan scoren.",
        "Vraag: Train je anders dan de andere spelers?",
        "Antwoord: Ja, want ik oefen veel op reactiesnelheid en springen."
      ],
      [
        "Vraag: Wat doe je als je een fout maakt?",
        "Antwoord: Eerst baal ik even, daarna let ik weer op de volgende bal.",
        "Vraag: Vind je penalty's spannend?",
        "Antwoord: Zeker, maar ik zie ze ook als een kans om belangrijk te zijn voor het team."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Antwoord: Ja, want ik oefen veel op reactiesnelheid en springen.",
        mark: "want",
        correct: "reden",
        options: ["reden", "tijd", "conclusie", "voorbeeld"],
        uitleg: "\"Want\" geeft de reden waarom de keeper anders traint."
      },
      {
        type: "verband",
        zin: "Antwoord: Eerst baal ik even, daarna let ik weer op de volgende bal.",
        mark: "daarna",
        correct: "tijd",
        options: ["tijd", "opsomming", "oorzaak", "tegenstelling"],
        uitleg: "\"Daarna\" geeft aan wat er later gebeurt."
      },
      {
        type: "kies",
        zin: "Zeker, {{blank}} ik zie ze ook als een kans om belangrijk te zijn voor het team.",
        target: "Antwoord: Zeker, maar ik zie ze ook als een kans om belangrijk te zijn voor het team.",
        correct: "maar",
        relatie: "tegenstelling",
        options: ["maar", "dus", "bijvoorbeeld", "omdat"],
        uitleg: "\"Maar\" past omdat de keeper eerst spanning noemt en daarna een positieve kant laat zien."
      }
    ]
  },
  {
    id: "betoog-telefoons",
    onderwerp: "Telefoons op school",
    alineas: [
      [
        "Veel scholen maken afspraken over telefoons in de klas.",
        "Sommige leerlingen vinden dat streng, maar duidelijke regels zorgen voor rust.",
        "Tijdens een uitleg kan een trillende telefoon de aandacht van de hele groep verstoren.",
        "Daarom leggen sommige klassen hun telefoon aan het begin van de les in een bak."
      ],
      [
        "Toch kan een telefoon ook handig zijn, bijvoorbeeld om snel een foto van het huiswerk te maken.",
        "De beste afspraak hangt dus af van het doel van de les.",
        "Kortom, een telefoon is niet alleen een probleem of een hulpmiddel; het hangt ervan af hoe je hem gebruikt."
      ]
    ],
    vragen: [
      {
        type: "verband",
        zin: "Daarom leggen sommige klassen hun telefoon aan het begin van de les in een bak.",
        mark: "Daarom",
        correct: "conclusie",
        options: ["conclusie", "voorbeeld", "tijd", "opsomming"],
        uitleg: "\"Daarom\" geeft een gevolg of conclusie: door afleiding kiezen klassen voor een telefoonbak."
      },
      {
        type: "kies",
        zin: "Toch kan een telefoon ook handig zijn, {{blank}} om snel een foto van het huiswerk te maken.",
        target: "Toch kan een telefoon ook handig zijn, bijvoorbeeld om snel een foto van het huiswerk te maken.",
        correct: "bijvoorbeeld",
        relatie: "voorbeeld",
        options: ["bijvoorbeeld", "echter", "aangezien", "vervolgens"],
        uitleg: "\"Bijvoorbeeld\" past omdat het maken van een foto een voorbeeld is van handig gebruik."
      },
      {
        type: "verband",
        zin: "Kortom, een telefoon is niet alleen een probleem of een hulpmiddel; het hangt ervan af hoe je hem gebruikt.",
        mark: "Kortom",
        correct: "conclusie",
        options: ["conclusie", "tegenstelling", "reden", "tijd"],
        uitleg: "\"Kortom\" vat de belangrijkste gedachte samen en leidt de conclusie in."
      }
    ]
  }
];
