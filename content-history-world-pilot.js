(function () {
  "use strict";

  const SOURCES = [
    {
      id: "romeinse-grens",
      onderwerp: "De Romeinse grens",
      themas: ["geschiedenis", "wereld"],
      alineas: [
        ["Langs de Rijn liep bijna tweeduizend jaar geleden de noordgrens van het Romeinse Rijk.", "Romeinse soldaten bewaakten die grens vanuit forten die dicht bij de rivier stonden.", "Daartussen lagen wachttorens en wegen waarover berichten en voorraden werden vervoerd."],
        ["Rond de forten ontstonden kleine nederzettingen met ambachtslieden, handelaren en gezinnen.", "Daardoor was de grens niet alleen een militaire lijn, maar ook een gebied waar mensen elkaar ontmoetten.", "Archeologen vinden er nog steeds munten, aardewerk en resten van houten gebouwen."]
      ],
      sections: [
        { kop: "Bewaking langs de Rijn", zinnen: ["Langs de Rijn liep de noordgrens van het Romeinse Rijk.", "Soldaten bewaakten deze grens vanuit forten en wachttorens.", "Via wegen werden berichten en voorraden vervoerd."] },
        { kop: "Leven rond de forten", zinnen: ["Bij de forten groeiden nederzettingen met winkels en werkplaatsen.", "Soldaten, handelaren en gezinnen kwamen er met elkaar in contact.", "Opgravingen laten zien hoe zij daar leefden."] }
      ],
      titel: "Leven aan de Romeinse grens",
      titleOptions: ["Leven aan de Romeinse grens", "Een rivier zonder bewoners", "Waarom Romeinen nooit handelden", "De bouw van moderne snelwegen"],
      sign: [
        { type: "verband", zin: "Daardoor was de grens niet alleen een militaire lijn, maar ook een gebied waar mensen elkaar ontmoetten.", mark: "Daardoor", correct: "oorzaak", options: ["oorzaak", "tijd", "voorbeeld", "opsomming"], uitleg: "\"Daardoor\" geeft het gevolg aan van de nederzettingen en contacten rond de forten." },
        { type: "kies", zin: "Rond de forten ontstonden kleine nederzettingen met ambachtslieden, handelaren en gezinnen. {{blank}} was de grens ook een ontmoetingsgebied.", target: "Daardoor was de grens niet alleen een militaire lijn, maar ook een gebied waar mensen elkaar ontmoetten.", correct: "Daardoor", relatie: "oorzaak", options: ["Daardoor", "Eerst", "Bijvoorbeeld", "Toch"], uitleg: "De tweede zin beschrijft een gevolg van de nederzettingen rond de forten." }
      ],
      vw: [
        { zin: "Romeinse soldaten bewaakten die grens vanuit forten die dicht bij de rivier stonden.", mark: "die grens", verwijstNaar: "de noordgrens van het Romeinse Rijk", antwoord: "de noordgrens van het Romeinse Rijk", options: ["de noordgrens van het Romeinse Rijk", "de rivier de Rijn", "de Romeinse wegen", "de kleine nederzettingen"], uitleg: "\"Die grens\" verwijst naar de eerder genoemde noordgrens van het Romeinse Rijk." },
        { zin: "Archeologen vinden er nog steeds munten, aardewerk en resten van houten gebouwen.", mark: "er", verwijstNaar: "Rond de forten", antwoord: "het gebied rond de forten", options: ["het gebied rond de forten", "de rivier zelf", "het hele Romeinse Rijk", "een moderne stad"], uitleg: "\"Er\" verwijst naar het gebied rond de forten waar de nederzettingen lagen." }
      ],
      summary: "Langs de Romeinse grens aan de Rijn stonden forten waar soldaten, handelaren en gezinnen samenleefden en waarvan archeologen nog resten vinden.",
      summaryOptions: ["Langs de Romeinse grens aan de Rijn stonden forten waar soldaten, handelaren en gezinnen samenleefden en waarvan archeologen nog resten vinden.", "Archeologen onderzoeken langs de hele Rijn uitsluitend munten die Romeinse soldaten tijdens gevechten in het water gooiden, omdat andere resten van het grensleven volledig verdwenen zijn.", "De Romeinen bouwden langs iedere Europese rivier een grote stad met moderne wegen.", "Langs de Rijn stonden enkele houten gebouwen."],
      conclusion: "De Romeinse grens was naast een verdedigingsgebied ook een plek voor handel en dagelijks leven.",
      conclusionOptions: ["De Romeinse grens was naast een verdedigingsgebied ook een plek voor handel en dagelijks leven.", "Alle bewoners van de grens waren Romeinse soldaten.", "De forten stonden ver van rivieren en belangrijke wegen.", "Archeologen hebben niets meer van het grensgebied teruggevonden."]
    },
    {
      id: "middeleeuwse-gilden",
      onderwerp: "Gilden in de middeleeuwse stad",
      themas: ["geschiedenis", "samenleving"],
      alineas: [
        ["In middeleeuwse steden werkten veel ambachtslieden samen in een gilde.", "Bakkers, smeden en kleermakers hadden ieder hun eigen vereniging.", "Het gilde bepaalde bijvoorbeeld hoe een product gemaakt moest worden en wie het beroep mocht uitoefenen."],
        ["Een leerling begon meestal met eenvoudige taken bij een ervaren meester.", "Daarna kon hij gezel worden en uiteindelijk een eigen werkplaats openen.", "Zo bewaakten gilden de kwaliteit, maar beperkten ze ook de vrijheid om zomaar een beroep te beginnen."]
      ],
      sections: [
        { kop: "Afspraken over het vak", zinnen: ["Ambachtslieden vormden verenigingen die gilden werden genoemd.", "Een gilde maakte afspraken over producten, prijzen en opleiding.", "Niet iedereen mocht zonder toestemming een werkplaats openen."] },
        { kop: "Van leerling tot meester", zinnen: ["Een leerling oefende bij een ervaren vakman.", "Later kon hij gezel en daarna meester worden.", "Pas als meester kon hij meestal een eigen werkplaats beginnen."] }
      ],
      titel: "Werken binnen een middeleeuws gilde",
      titleOptions: ["Werken binnen een middeleeuws gilde", "Gratis beroepen voor iedereen", "Machines in moderne fabrieken", "Reizen zonder stadsregels"],
      sign: [
        { type: "verband", zin: "Daarna kon hij gezel worden en uiteindelijk een eigen werkplaats openen.", mark: "Daarna", correct: "tijd", options: ["tijd", "reden", "voorbeeld", "tegenstelling"], uitleg: "\"Daarna\" geeft de volgende stap in de opleiding aan." },
        { type: "kies", zin: "Gilden bewaakten de kwaliteit, {{blank}} ze beperkten ook wie een beroep mocht beginnen.", target: "Zo bewaakten gilden de kwaliteit, maar beperkten ze ook de vrijheid om zomaar een beroep te beginnen.", correct: "maar", relatie: "tegenstelling", options: ["maar", "daarom", "bijvoorbeeld", "vervolgens"], uitleg: "De zin noemt eerst een voordeel en daarna een beperking. \"Maar\" laat die tegenstelling zien." }
      ],
      vw: [
        { zin: "Bakkers, smeden en kleermakers hadden ieder hun eigen vereniging.", mark: "hun", verwijstNaar: "Bakkers, smeden en kleermakers", antwoord: "de ambachtslieden", options: ["de ambachtslieden", "de inwoners", "de leerlingen", "de producten"], uitleg: "\"Hun\" verwijst naar de genoemde ambachtslieden: bakkers, smeden en kleermakers." },
        { zin: "Daarna kon hij gezel worden en uiteindelijk een eigen werkplaats openen.", mark: "hij", verwijstNaar: "Een leerling", antwoord: "de leerling", options: ["de leerling", "de meester", "de kleermaker", "het gilde"], uitleg: "\"Hij\" verwijst naar de leerling die het vak leert." }
      ],
      summary: "Middeleeuwse gilden regelden hoe ambachtslieden werden opgeleid en wie een beroep of eigen werkplaats mocht hebben.",
      summaryOptions: ["Middeleeuwse gilden regelden hoe ambachtslieden werden opgeleid en wie een beroep of eigen werkplaats mocht hebben.", "Iedere leerling in een middeleeuwse stad werd zonder oefentijd automatisch meester en mocht meteen een eigen bakkerij, smederij of kledingwinkel openen.", "Gilden waren grote stadsscholen waar kinderen jarenlang uitsluitend leerden lezen en schrijven voordat zij zonder verdere proef ieder ambacht mochten kiezen.", "Een leerling kon later gezel worden."],
      conclusion: "Een gilde bood vakmensen steun en kwaliteitsregels, maar gaf niet iedereen vrije toegang tot het beroep.",
      conclusionOptions: ["Een gilde bood vakmensen steun en kwaliteitsregels, maar gaf niet iedereen vrije toegang tot het beroep.", "Gilden zorgden ervoor dat iedereen zonder opleiding meester kon worden.", "Een gilde had uitsluitend als doel om producten goedkoper te maken.", "Middeleeuwse ambachtslieden werkten nooit samen."]
    },
    {
      id: "boekdrukkunst",
      onderwerp: "De komst van de boekdrukkunst",
      themas: ["geschiedenis", "media-communicatie"],
      alineas: [
        ["Voor de komst van de drukpers werden boeken meestal met de hand overgeschreven.", "Dat kostte veel tijd, waardoor boeken duur en zeldzaam waren.", "Met losse metalen letters konden drukkers dezelfde bladzijde steeds opnieuw afdrukken."],
        ["Hierdoor konden teksten sneller en in grotere aantallen worden verspreid.", "Steeds meer mensen kregen toegang tot nieuws, ideeën en kennis.", "De drukpers veranderde dus niet alleen het maken van boeken, maar ook de manier waarop informatie door Europa reisde."]
      ],
      sections: [
        { kop: "Boeken met de hand", zinnen: ["Boeken werden vroeger letter voor letter overgeschreven.", "Dat werk duurde lang en maakte boeken kostbaar.", "Er waren daarom maar weinig exemplaren beschikbaar."] },
        { kop: "Informatie op grotere schaal", zinnen: ["Drukkers gebruikten losse letters om veel afdrukken te maken.", "Teksten bereikten daardoor meer lezers.", "Nieuws en ideeën konden zich sneller verspreiden."] }
      ],
      titel: "Hoe de drukpers informatie veranderde",
      titleOptions: ["Hoe de drukpers informatie veranderde", "Waarom mensen stopten met lezen", "De uitvinding van digitaal nieuws", "Een zeldzame metalen pen"],
      sign: [
        { type: "verband", zin: "Hierdoor konden teksten sneller en in grotere aantallen worden verspreid.", mark: "Hierdoor", correct: "oorzaak", options: ["oorzaak", "voorbeeld", "tijd", "opsomming"], uitleg: "\"Hierdoor\" kondigt het gevolg van drukken met losse letters aan." },
        { type: "kies", zin: "Boeken werden met de hand overgeschreven. {{blank}} waren ze duur en zeldzaam.", target: "Dat kostte veel tijd, waardoor boeken duur en zeldzaam waren.", correct: "Daardoor", relatie: "oorzaak", options: ["Daardoor", "Toch", "Eerst", "Bijvoorbeeld"], uitleg: "De hoge prijs en zeldzaamheid zijn een gevolg van het tijdrovende overschrijven." }
      ],
      vw: [
        { zin: "Dat kostte veel tijd, waardoor boeken duur en zeldzaam waren.", mark: "Dat", verwijstNaar: "met de hand overgeschreven", antwoord: "boeken met de hand overschrijven", options: ["boeken met de hand overschrijven", "metalen letters maken", "nieuws verspreiden", "boeken verkopen"], uitleg: "\"Dat\" verwijst naar het met de hand overschrijven van boeken." },
        { zin: "Hierdoor konden teksten sneller en in grotere aantallen worden verspreid.", mark: "Hierdoor", verwijstNaar: "dezelfde bladzijde steeds opnieuw afdrukken", antwoord: "dezelfde bladzijde opnieuw kunnen afdrukken", options: ["dezelfde bladzijde opnieuw kunnen afdrukken", "boeken zeldzaam houden", "met de hand schrijven", "door Europa reizen"], uitleg: "\"Hierdoor\" verwijst naar de mogelijkheid om dezelfde bladzijde herhaaldelijk af te drukken." }
      ],
      summary: "De drukpers maakte het mogelijk om teksten sneller en goedkoper te vermenigvuldigen, waardoor informatie meer mensen bereikte.",
      summaryOptions: ["De drukpers maakte het mogelijk om teksten sneller en goedkoper te vermenigvuldigen, waardoor informatie meer mensen bereikte.", "Metalen letters werden uitgevonden om handgeschreven boeken duurder en zeldzamer te maken, zodat alleen rijke geleerden nog toegang hadden tot nieuws, kennis en nieuwe ideeën.", "De drukpers verspreidde alleen nieuws en werd niet voor boeken of ideeën gebruikt.", "Vroeger werden boeken met de hand geschreven."],
      conclusion: "De boekdrukkunst droeg eraan bij dat kennis en ideeën voor een grotere groep mensen bereikbaar werden.",
      conclusionOptions: ["De boekdrukkunst droeg eraan bij dat kennis en ideeën voor een grotere groep mensen bereikbaar werden.", "Na de uitvinding van de drukpers kon iedereen meteen lezen.", "Handgeschreven boeken verdwenen op dezelfde dag volledig.", "De drukpers zorgde ervoor dat informatie langzamer reisde."]
    },
    {
      id: "waterlinie",
      onderwerp: "Water als verdediging",
      themas: ["geschiedenis", "wereld"],
      alineas: [
        ["Nederland gebruikte vroeger op sommige plaatsen water om vijandelijke legers tegen te houden.", "Bij gevaar konden lage stukken land gecontroleerd onder water worden gezet.", "Het water was te diep om gemakkelijk doorheen te lopen, maar vaak te ondiep voor grote boten."],
        ["Forten bewaakten wegen en dijken die boven het water uitstaken.", "Toch werkte deze verdediging niet onder alle omstandigheden, bijvoorbeeld wanneer het water bevroor.", "Het landschap zelf werd zo onderdeel van een uitgebreid verdedigingssysteem."]
      ],
      sections: [
        { kop: "Land onder water zetten", zinnen: ["Lage gebieden konden bij gevaar gecontroleerd overstromen.", "Het water maakte de doorgang voor soldaten en voertuigen moeilijk.", "De waterhoogte moest daarom precies worden geregeld."] },
        { kop: "Forten bij de doorgangen", zinnen: ["Niet ieder deel van het gebied kon onder water verdwijnen.", "Forten beschermden wegen, spoorlijnen en dijken.", "Samen vormden water en bouwwerken een verdedigingslinie."] }
      ],
      titel: "Het landschap als verdedigingsmiddel",
      titleOptions: ["Het landschap als verdedigingsmiddel", "Varen met grote oorlogsschepen", "Waarom alle polders bevroren", "De aanleg van recreatiestranden"],
      sign: [
        { type: "verband", zin: "Toch werkte deze verdediging niet onder alle omstandigheden, bijvoorbeeld wanneer het water bevroor.", mark: "Toch", correct: "tegenstelling", options: ["tegenstelling", "reden", "tijd", "conclusie"], uitleg: "\"Toch\" geeft aan dat er ondanks het slimme systeem ook beperkingen waren." },
        { type: "kies", zin: "Forten bewaakten wegen en dijken, {{blank}} die boven het water bleven uitsteken.", target: "Forten bewaakten wegen en dijken die boven het water uitstaken.", correct: "omdat", relatie: "reden", options: ["omdat", "daarna", "kortom", "zoals"], uitleg: "De uitstekende wegen en dijken vormden doorgangen en moesten daarom worden bewaakt." }
      ],
      vw: [
        { zin: "Het water was te diep om gemakkelijk doorheen te lopen, maar vaak te ondiep voor grote boten.", mark: "Het water", verwijstNaar: "lage stukken land gecontroleerd onder water", antwoord: "het water op de lage stukken land", options: ["het water op de lage stukken land", "het water in de zee", "de bevroren rivier", "het water rond de forten"], uitleg: "\"Het water\" verwijst naar het water waarmee de lage gebieden werden overstroomd." },
        { zin: "Toch werkte deze verdediging niet onder alle omstandigheden, bijvoorbeeld wanneer het water bevroor.", mark: "deze verdediging", verwijstNaar: "water om vijandelijke legers tegen te houden", antwoord: "land onder water zetten", options: ["land onder water zetten", "grote boten gebruiken", "wegen bouwen", "op forten wonen"], uitleg: "\"Deze verdediging\" verwijst naar het gecontroleerd onder water zetten van land." }
      ],
      summary: "Door land gecontroleerd onder water te zetten en doorgangen met forten te bewaken, gebruikte Nederland het landschap als verdediging.",
      summaryOptions: ["Door land gecontroleerd onder water te zetten en doorgangen met forten te bewaken, gebruikte Nederland het landschap als verdediging.", "Nederland liet alle polders het hele jaar diep onder water staan, zodat oorlogsschepen via weilanden naar iedere stad konden varen en vijanden geen droge weg vonden.", "De forten bij de waterlinie waren vooral warme schuilplaatsen waar bewoners zich tijdens strenge winters tegen bevroren sloten en gladde wegen konden beschermen.", "Sommige wegen en dijken staken boven het water uit."],
      conclusion: "De waterlinie werkte alleen goed als waterhoogte, landschap en forten zorgvuldig op elkaar waren afgestemd.",
      conclusionOptions: ["De waterlinie werkte alleen goed als waterhoogte, landschap en forten zorgvuldig op elkaar waren afgestemd.", "Water alleen hield onder alle omstandigheden ieder leger tegen.", "Bevroren water maakte de verdediging altijd sterker.", "De forten hadden geen verband met de overstroomde gebieden."]
    },
    {
      id: "kinderarbeid-fabrieken",
      onderwerp: "Kinderen in de fabriek",
      themas: ["geschiedenis", "samenleving"],
      alineas: [
        ["Tijdens de industrialisatie werkten veel kinderen lange dagen in fabrieken en werkplaatsen.", "Hun inkomen was voor arme gezinnen vaak hard nodig.", "Het werk was zwaar en machines konden gevaarlijk zijn."],
        ["Kinderen die dagelijks werkten, gingen meestal weinig of helemaal niet naar school.", "Later kwamen er wetten die kinderarbeid beperkten en onderwijs belangrijker maakten.", "Daardoor veranderde langzaam het dagelijks leven van veel kinderen."]
      ],
      sections: [
        { kop: "Lange dagen en weinig school", zinnen: ["Veel kinderen verdienden geld in fabrieken.", "Het werk duurde lang en was soms gevaarlijk.", "Voor onderwijs bleef weinig tijd over."] },
        { kop: "Nieuwe regels", zinnen: ["Steeds meer mensen maakten bezwaar tegen kinderarbeid.", "Wetten beperkten het werk van jonge kinderen.", "School kreeg daardoor een grotere plaats in hun leven."] }
      ],
      titel: "Van fabriekswerk naar meer onderwijs",
      titleOptions: ["Van fabriekswerk naar meer onderwijs", "Waarom machines speelgoed werden", "Een vrije dag in de moderne fabriek", "Rijke kinderen zonder school"],
      sign: [
        { type: "verband", zin: "Daardoor veranderde langzaam het dagelijks leven van veel kinderen.", mark: "Daardoor", correct: "oorzaak", options: ["oorzaak", "voorbeeld", "opsomming", "tijd"], uitleg: "\"Daardoor\" geeft het gevolg van de nieuwe wetten en het belangrijker worden van onderwijs aan." },
        { type: "kies", zin: "Kinderen werkten lange dagen. {{blank}} gingen zij vaak weinig naar school.", target: "Kinderen die dagelijks werkten, gingen meestal weinig of helemaal niet naar school.", correct: "Daardoor", relatie: "oorzaak", options: ["Daardoor", "Toch", "Bijvoorbeeld", "Vervolgens"], uitleg: "Weinig onderwijs was een gevolg van de lange werkdagen." }
      ],
      vw: [
        { zin: "Hun inkomen was voor arme gezinnen vaak hard nodig.", mark: "Hun", verwijstNaar: "veel kinderen", antwoord: "de werkende kinderen", options: ["de werkende kinderen", "de fabriekseigenaren", "de leraren", "de machines"], uitleg: "\"Hun\" verwijst naar de kinderen die in fabrieken en werkplaatsen werkten." },
        { zin: "Daardoor veranderde langzaam het dagelijks leven van veel kinderen.", mark: "Daardoor", verwijstNaar: "wetten die kinderarbeid beperkten en onderwijs belangrijker maakten", antwoord: "de nieuwe wetten en meer onderwijs", options: ["de nieuwe wetten en meer onderwijs", "de gevaarlijke machines", "het inkomen van gezinnen", "de lange werkdagen"], uitleg: "\"Daardoor\" verwijst naar de regels tegen kinderarbeid en de grotere rol van onderwijs." }
      ],
      summary: "Tijdens de industrialisatie werkten veel kinderen zwaar en gingen zij weinig naar school, totdat wetten hun werk beperkten en onderwijs belangrijker werd.",
      summaryOptions: ["Tijdens de industrialisatie werkten veel kinderen zwaar en gingen zij weinig naar school, totdat wetten hun werk beperkten en onderwijs belangrijker werd.", "Tijdens de industrialisatie kozen alle kinderen vrijwillig voor lange dagen in gevaarlijke fabrieken, omdat scholen bij wet gesloten waren en gezinnen geen ander werk mochten aannemen.", "Nieuwe machines maakten onderwijs overbodig en zorgden voor kortere werkdagen.", "Veel arme gezinnen hadden het inkomen van kinderen nodig."],
      conclusion: "Regels tegen kinderarbeid gaven meer kinderen de mogelijkheid om onderwijs te volgen.",
      conclusionOptions: ["Regels tegen kinderarbeid gaven meer kinderen de mogelijkheid om onderwijs te volgen.", "De regels zorgden ervoor dat kinderen juist langer moesten werken.", "Onderwijs werd minder belangrijk toen kinderarbeid werd beperkt.", "Kinderarbeid kwam alleen voor bij rijke gezinnen."]
    },
    {
      id: "rivierdelta",
      onderwerp: "Wonen in een rivierdelta",
      themas: ["wereld", "natuur-milieu"],
      alineas: [
        ["Een rivierdelta ontstaat waar een rivier zich voor de kust in meerdere takken splitst.", "Het water voert zand en klei mee en laat een deel daarvan achter.", "Daardoor is de bodem in veel delta's vruchtbaar en geschikt voor landbouw."],
        ["Tegelijk liggen delta's vaak laag en kunnen ze bij hoogwater overstromen.", "Dijken, waterberging en waarschuwingssystemen moeten bewoners beschermen.", "Mensen in een delta profiteren dus van het water, maar moeten ook rekening houden met de risico's ervan."]
      ],
      sections: [
        { kop: "Vruchtbare grond", zinnen: ["Rivieren brengen zand, klei en voedingsstoffen mee.", "In de delta blijft een deel van dit materiaal achter.", "De bodem is daardoor vaak geschikt voor landbouw."] },
        { kop: "Bescherming tegen hoogwater", zinnen: ["Veel deltagebieden liggen maar weinig boven de zeespiegel.", "Hoogwater kan huizen en akkers bedreigen.", "Dijken en waterberging verkleinen het risico."] }
      ],
      titel: "Kansen en risico's in een rivierdelta",
      titleOptions: ["Kansen en risico's in een rivierdelta", "Landbouw zonder water", "Bergen aan de kust", "Waarom rivieren nooit overstromen"],
      sign: [
        { type: "verband", zin: "Tegelijk liggen delta's vaak laag en kunnen ze bij hoogwater overstromen.", mark: "Tegelijk", correct: "tegenstelling", options: ["tegenstelling", "tijd", "voorbeeld", "conclusie"], uitleg: "\"Tegelijk\" voegt hier een andere, minder gunstige kant van delta's toe." },
        { type: "kies", zin: "Rivieren laten zand en klei achter. {{blank}} is de bodem vaak vruchtbaar.", target: "Daardoor is de bodem in veel delta's vruchtbaar en geschikt voor landbouw.", correct: "Daardoor", relatie: "oorzaak", options: ["Daardoor", "Echter", "Eerst", "Zoals"], uitleg: "De vruchtbare bodem is een gevolg van het materiaal dat de rivier achterlaat." }
      ],
      vw: [
        { zin: "Het water voert zand en klei mee en laat een deel daarvan achter.", mark: "daarvan", verwijstNaar: "zand en klei", antwoord: "het zand en de klei", options: ["het zand en de klei", "de kust", "de landbouw", "de riviertakken"], uitleg: "\"Daarvan\" verwijst naar het zand en de klei die door het water worden meegevoerd." },
        { zin: "Mensen in een delta profiteren dus van het water, maar moeten ook rekening houden met de risico's ervan.", mark: "ervan", verwijstNaar: "het water", antwoord: "het water", options: ["het water", "de landbouw", "de bodem", "het waarschuwingssysteem"], uitleg: "\"Ervan\" verwijst naar het water, dat zowel voordelen als risico's heeft." }
      ],
      summary: "Rivierdelta's hebben vaak vruchtbare grond, maar door hun lage ligging zijn maatregelen tegen overstromingen nodig.",
      summaryOptions: ["Rivierdelta's hebben vaak vruchtbare grond, maar door hun lage ligging zijn maatregelen tegen overstromingen nodig.", "Iedere rivierdelta ligt hoog tussen steile bergen, waardoor bewoners nauwelijks water voor landbouw hebben en geen bescherming tegen overstromingen nodig hebben.", "Dijken houden al het rivierwater, zand en klei voorgoed tegen, waardoor een delta nooit meer verandert en landbouwgrond vanzelf hoger en droger wordt.", "Een rivier splitst zich bij de kust in meerdere takken."],
      conclusion: "Bewoners van een delta moeten een evenwicht zoeken tussen het gebruiken en beheersen van water.",
      conclusionOptions: ["Bewoners van een delta moeten een evenwicht zoeken tussen het gebruiken en beheersen van water.", "Landbouw is in alle delta's onmogelijk door het gevaar van hoogwater.", "Waarschuwingssystemen maken dijken en waterberging volledig overbodig.", "Een delta heeft alleen voordelen voor de mensen die er wonen."]
    },
    {
      id: "terrassen-andes",
      onderwerp: "Landbouw op berghellingen",
      themas: ["wereld", "geschiedenis"],
      alineas: [
        ["In het Andesgebergte zijn veel hellingen te steil voor gewone akkers.", "Boeren legden er daarom al eeuwen geleden terrassen aan: brede, vlakke stroken in de bergwand.", "Stenen muren houden de aarde op haar plaats en remmen het wegstromende regenwater."],
        ["Op verschillende hoogtes groeien andere gewassen, omdat temperatuur en vocht er veranderen.", "De terrassen vragen veel onderhoud, maar maken landbouw op moeilijke hellingen mogelijk.", "Ze laten zien hoe mensen hun manier van werken aan een berglandschap aanpassen."]
      ],
      sections: [
        { kop: "Vlakke stroken in de berg", zinnen: ["Steile hellingen zijn lastig te bewerken.", "Boeren maakten daarom terrassen met stenen muren.", "De muren houden grond en water beter vast."] },
        { kop: "Gewassen op verschillende hoogtes", zinnen: ["De omstandigheden veranderen als je hoger in de bergen komt.", "Boeren kiezen per hoogte passende gewassen.", "Zo gebruiken zij meerdere klimaatzones op één berg."] }
      ],
      titel: "Boeren op de hellingen van de Andes",
      titleOptions: ["Boeren op de hellingen van de Andes", "Een vlak landschap zonder stenen", "Waarom regenwater altijd verdwijnt", "Moderne wolkenkrabbers in Zuid-Amerika"],
      sign: [
        { type: "verband", zin: "Boeren legden er daarom al eeuwen geleden terrassen aan: brede, vlakke stroken in de bergwand.", mark: "daarom", correct: "oorzaak", options: ["oorzaak", "voorbeeld", "opsomming", "tijd"], uitleg: "\"Daarom\" geeft de oplossing aan voor de te steile hellingen." },
        { type: "kies", zin: "Op verschillende hoogtes groeien andere gewassen, {{blank}} temperatuur en vocht er veranderen.", target: "Op verschillende hoogtes groeien andere gewassen, omdat temperatuur en vocht er veranderen.", correct: "omdat", relatie: "reden", options: ["omdat", "toch", "daarna", "kortom"], uitleg: "De verandering in temperatuur en vocht is de reden voor andere gewassen." }
      ],
      vw: [
        { zin: "Boeren legden er daarom al eeuwen geleden terrassen aan: brede, vlakke stroken in de bergwand.", mark: "er", verwijstNaar: "het Andesgebergte", antwoord: "het Andesgebergte", options: ["het Andesgebergte", "de gewone akkers", "het regenwater", "de stenen muren"], uitleg: "\"Er\" verwijst naar het Andesgebergte waar de hellingen liggen." },
        { zin: "Ze laten zien hoe mensen hun manier van werken aan een berglandschap aanpassen.", mark: "Ze", verwijstNaar: "De terrassen", antwoord: "de terrassen", options: ["de terrassen", "de gewassen", "de boeren", "de temperaturen"], uitleg: "\"Ze\" verwijst naar de terrassen die het aangepaste landgebruik zichtbaar maken." }
      ],
      summary: "Andesboeren gebruiken terrassen om steile hellingen te beschermen en op verschillende hoogtes gewassen te verbouwen.",
      summaryOptions: ["Andesboeren gebruiken terrassen om steile hellingen te beschermen en op verschillende hoogtes gewassen te verbouwen.", "Boeren in de Andes verwijderen de stenen muren van hun akkers, zodat regenwater en vruchtbare aarde snel naar het dal stromen en alle gewassen daar op dezelfde hoogte groeien.", "In de Andes groeit op iedere hoogte precies hetzelfde gewas onder gelijke omstandigheden.", "Terrassen zijn brede stroken in een bergwand."],
      conclusion: "Terraslandbouw is een voorbeeld van hoe mensen landbouw aanpassen aan natuurlijke omstandigheden.",
      conclusionOptions: ["Terraslandbouw is een voorbeeld van hoe mensen landbouw aanpassen aan natuurlijke omstandigheden.", "Berglandbouw lukt alleen als een helling volledig vlak wordt gemaakt.", "De terrassen worden niet onderhouden omdat stenen muren nooit beschadigen.", "Temperatuur en hoogte hebben geen invloed op landbouw in de Andes."]
    },
    {
      id: "moesson",
      onderwerp: "De moesson",
      themas: ["wereld", "natuur-milieu"],
      alineas: [
        ["In delen van Zuid-Azië verandert de overheersende windrichting met de seizoenen.", "In de zomer voert de wind veel vochtige lucht vanaf zee aan.", "Daardoor kan wekenlang veel regen vallen; deze regenperiode wordt de moesson genoemd."],
        ["Boeren zijn voor hun rijstvelden vaak afhankelijk van voldoende moessonregen.", "Te weinig regen kan droogte veroorzaken, terwijl extreem veel regen tot overstromingen leidt.", "Een betrouwbare weersverwachting helpt bewoners zich op beide situaties voor te bereiden."]
      ],
      sections: [
        { kop: "Vochtige lucht vanaf zee", zinnen: ["In de zomer draait de wind in delen van Zuid-Azië.", "De wind brengt vochtige zeelucht naar het land.", "Hierdoor begint een periode met veel regen."] },
        { kop: "Nodig en soms gevaarlijk", zinnen: ["Landbouw heeft de moessonregen nodig.", "Te weinig regen veroorzaakt droogte.", "Heel veel regen kan juist overstromingen veroorzaken."] }
      ],
      titel: "De moesson tussen droogte en overstroming",
      titleOptions: ["De moesson tussen droogte en overstroming", "Een wind die nooit verandert", "Rijst verbouwen zonder regen", "Sneeuwstormen in Zuid-Azië"],
      sign: [
        { type: "verband", zin: "Te weinig regen kan droogte veroorzaken, terwijl extreem veel regen tot overstromingen leidt.", mark: "terwijl", correct: "tegenstelling", options: ["tegenstelling", "tijd", "voorbeeld", "conclusie"], uitleg: "\"Terwijl\" zet de gevolgen van te weinig en te veel regen tegenover elkaar." },
        { type: "kies", zin: "De zomerwind brengt vochtige lucht vanaf zee. {{blank}} kan lange tijd veel regen vallen.", target: "Daardoor kan wekenlang veel regen vallen; deze regenperiode wordt de moesson genoemd.", correct: "Daardoor", relatie: "oorzaak", options: ["Daardoor", "Echter", "Vervolgens", "Zoals"], uitleg: "De langdurige regen is een gevolg van de aangevoerde vochtige lucht." }
      ],
      vw: [
        { zin: "Daardoor kan wekenlang veel regen vallen; deze regenperiode wordt de moesson genoemd.", mark: "deze regenperiode", verwijstNaar: "wekenlang veel regen", antwoord: "de weken met veel regen", options: ["de weken met veel regen", "de vochtige lucht", "de zomerwind", "de rijstvelden"], uitleg: "\"Deze regenperiode\" verwijst naar de weken waarin veel regen valt." },
        { zin: "Een betrouwbare weersverwachting helpt bewoners zich op beide situaties voor te bereiden.", mark: "beide situaties", verwijstNaar: "droogte", antwoord: "droogte en overstromingen", options: ["droogte en overstromingen", "zomer en winter", "zee en land", "wind en rijst"], uitleg: "\"Beide situaties\" verwijst naar droogte door te weinig regen en overstromingen door te veel regen." }
      ],
      summary: "De zomermoesson brengt noodzakelijke regen naar Zuid-Azië, maar te weinig of te veel regen kan grote problemen veroorzaken.",
      summaryOptions: ["De zomermoesson brengt noodzakelijke regen naar Zuid-Azië, maar te weinig of te veel regen kan grote problemen veroorzaken.", "De moesson is een langdurige sneeuwstorm die alle rijstvelden in Zuid-Azië tegelijk tegen droogte, overstromingen en mislukte oogsten beschermt.", "Boeren hoeven geen weersverwachtingen te volgen, omdat de moesson ieder jaar op exact dezelfde dag begint, altijd evenveel regen brengt en nergens schade veroorzaakt.", "In de zomer komt vochtige lucht vanaf zee."],
      conclusion: "De moesson is tegelijk belangrijk voor landbouw en een risico waarvoor bewoners zich moeten voorbereiden.",
      conclusionOptions: ["De moesson is tegelijk belangrijk voor landbouw en een risico waarvoor bewoners zich moeten voorbereiden.", "Hoe meer moessonregen valt, hoe beter dat altijd voor bewoners is.", "Zonder rijstvelden zouden er geen moessonwinden bestaan.", "Een weersverwachting kan droogte en overstromingen volledig voorkomen."]
    },
    {
      id: "hitte-in-de-stad",
      onderwerp: "Warmte in de stad",
      themas: ["wereld", "natuur-milieu"],
      alineas: [
        ["Op warme dagen blijft het centrum van een stad vaak langer heet dan het omliggende platteland.", "Donkere daken, asfalt en stenen slaan overdag veel zonnewarmte op.", "'s Avonds geven deze materialen de warmte langzaam weer af."],
        ["Bomen en planten zorgen voor schaduw en verkoeling doordat ze water verdampen.", "Daarom leggen sommige steden groene daken aan en vervangen ze tegels door plantvakken.", "Zo proberen gemeenten buurten tijdens hittegolven leefbaarder te houden."]
      ],
      sections: [
        { kop: "Stenen houden warmte vast", zinnen: ["Asfalt, daken en muren worden overdag warm.", "In de avond geven ze die warmte langzaam af.", "Daardoor koelt een dichtbebouwde wijk minder snel af."] },
        { kop: "Meer groen voor verkoeling", zinnen: ["Bomen geven schaduw en verdampen water.", "Groene daken en plantvakken zorgen voor minder steen.", "Gemeenten gebruiken deze maatregelen tegen extreme hitte."] }
      ],
      titel: "Waarom steden extra warm worden",
      titleOptions: ["Waarom steden extra warm worden", "Een koude nacht op het platteland", "Alle daken moeten zwart zijn", "Regenwater zonder planten"],
      sign: [
        { type: "verband", zin: "Daarom leggen sommige steden groene daken aan en vervangen ze tegels door plantvakken.", mark: "Daarom", correct: "conclusie", options: ["conclusie", "voorbeeld", "tijd", "opsomming"], uitleg: "\"Daarom\" leidt de maatregel af uit de verkoelende werking van bomen en planten." },
        { type: "kies", zin: "Stenen slaan warmte op. {{blank}} koelt het centrum 's avonds langzaam af.", target: "'s Avonds geven deze materialen de warmte langzaam weer af.", correct: "Daardoor", relatie: "oorzaak", options: ["Daardoor", "Toch", "Bijvoorbeeld", "Eerst"], uitleg: "Het langzaam afkoelen is een gevolg van de opgeslagen warmte." }
      ],
      vw: [
        { zin: "'s Avonds geven deze materialen de warmte langzaam weer af.", mark: "deze materialen", verwijstNaar: "Donkere daken, asfalt en stenen", antwoord: "donkere daken, asfalt en stenen", options: ["donkere daken, asfalt en stenen", "bomen en planten", "groene daken", "het platteland"], uitleg: "\"Deze materialen\" verwijst naar de daken, het asfalt en de stenen uit de vorige zin." },
        { zin: "Bomen en planten zorgen voor schaduw en verkoeling doordat ze water verdampen.", mark: "ze", verwijstNaar: "Bomen en planten", antwoord: "bomen en planten", options: ["bomen en planten", "donkere daken", "gemeenten", "hittegolven"], uitleg: "\"Ze\" verwijst naar bomen en planten, die water verdampen." }
      ],
      summary: "Steden blijven door steen en asfalt langer warm; meer bomen, groene daken en plantvakken kunnen voor verkoeling zorgen.",
      summaryOptions: ["Steden blijven door steen en asfalt langer warm; meer bomen, groene daken en plantvakken kunnen voor verkoeling zorgen.", "Steden worden tijdens hittegolven vooral warmer doordat bomen 's avonds hun opgeslagen zonnewarmte aan donkere daken afgeven; daarom helpt het om planten en schaduwplekken te verwijderen.", "Gemeenten verwijderen alle planten zodat regenwater sneller over tegels kan stromen.", "Asfalt en stenen slaan overdag zonnewarmte op."],
      conclusion: "Een stad kan hitte verminderen door bij de inrichting minder steen en meer groen te gebruiken.",
      conclusionOptions: ["Een stad kan hitte verminderen door bij de inrichting minder steen en meer groen te gebruiken.", "Alleen het platteland kan tijdens een hittegolf worden verkoeld.", "Groene daken maken een stad juist warmer doordat planten water verdampen.", "De kleur en hoeveelheid bestrating hebben geen invloed op stedelijke warmte."]
    },
    {
      id: "panamakanaal",
      onderwerp: "Een kanaal tussen twee oceanen",
      themas: ["wereld", "wetenschap-techniek"],
      alineas: [
        ["Het Panamakanaal vormt een vaarroute door het smalle land van Panama.", "Schepen hoeven daardoor niet helemaal om de zuidpunt van Zuid-Amerika te varen.", "Een reeks sluizen tilt schepen omhoog naar een hoger gelegen meer en laat ze later weer dalen."],
        ["De doorvaart bespaart veel afstand en tijd, maar het kanaal heeft grote hoeveelheden zoet water nodig.", "Bij langdurige droogte kan er minder water voor de sluizen beschikbaar zijn.", "Het kanaal laat zo zien hoe wereldhandel, techniek en natuurlijke omstandigheden met elkaar verbonden zijn."]
      ],
      sections: [
        { kop: "Een kortere vaarroute", zinnen: ["Het kanaal verbindt vaarroutes aan twee kanten van Midden-Amerika.", "Schepen vermijden een lange omweg rond Zuid-Amerika.", "Dat bespaart afstand, brandstof en tijd."] },
        { kop: "Sluizen hebben water nodig", zinnen: ["Sluizen brengen schepen naar een hoger en lager waterniveau.", "Daarbij wordt veel zoet water gebruikt.", "Droogte kan daarom gevolgen hebben voor het aantal doorvaarten."] }
      ],
      titel: "Het Panamakanaal: korter varen met sluizen",
      titleOptions: ["Het Panamakanaal: korter varen met sluizen", "Een spoorlijn over de oceaan", "Waarom schepen bergen beklimmen", "Zuid-Amerika zonder handel"],
      sign: [
        { type: "verband", zin: "Schepen hoeven daardoor niet helemaal om de zuidpunt van Zuid-Amerika te varen.", mark: "daardoor", correct: "oorzaak", options: ["oorzaak", "voorbeeld", "tijd", "tegenstelling"], uitleg: "\"Daardoor\" geeft het gevolg aan van de vaarroute door Panama." },
        { type: "kies", zin: "Het kanaal bespaart veel tijd, {{blank}} het gebruikt ook grote hoeveelheden zoet water.", target: "De doorvaart bespaart veel afstand en tijd, maar het kanaal heeft grote hoeveelheden zoet water nodig.", correct: "maar", relatie: "tegenstelling", options: ["maar", "daarom", "vervolgens", "zoals"], uitleg: "De zin zet een voordeel tegenover een belangrijk nadeel." }
      ],
      vw: [
        { zin: "Een reeks sluizen tilt schepen omhoog naar een hoger gelegen meer en laat ze later weer dalen.", mark: "ze", verwijstNaar: "schepen", antwoord: "de schepen", options: ["de schepen", "de sluizen", "de oceanen", "de vaarroutes"], uitleg: "\"Ze\" verwijst naar de schepen die later weer naar een lager niveau dalen." },
        { zin: "Bij langdurige droogte kan er minder water voor de sluizen beschikbaar zijn.", mark: "er", verwijstNaar: "het kanaal", antwoord: "bij het kanaal", options: ["bij het kanaal", "rond Zuid-Amerika", "in de schepen", "op de oceanen"], uitleg: "\"Er\" verwijst naar de omgeving en werking van het kanaal waar water nodig is." }
      ],
      summary: "Het Panamakanaal verkort scheepsroutes met behulp van sluizen, maar de werking ervan vraagt veel zoet water.",
      summaryOptions: ["Het Panamakanaal verkort scheepsroutes met behulp van sluizen, maar de werking ervan vraagt veel zoet water.", "Schepen varen alleen via Panama omdat zij zonder sluizen niet over open oceanen kunnen reizen en nergens anders goederen tussen werelddelen mogen vervoeren.", "Het kanaal gebruikt onbeperkt zout oceaanwater om ieder schip rechtstreeks over de hoogste bergen van Panama te tillen, waardoor droogte geen invloed op de scheepvaart heeft.", "Schepen hoeven niet om de zuidpunt van Zuid-Amerika te varen."],
      conclusion: "Droogte kan niet alleen de natuur, maar ook internationale scheepvaart en handel beïnvloeden.",
      conclusionOptions: ["Droogte kan niet alleen de natuur, maar ook internationale scheepvaart en handel beïnvloeden.", "Het kanaal blijft bij iedere hoeveelheid water evenveel schepen verwerken.", "Wereldhandel heeft geen verband met techniek of natuurlijke omstandigheden.", "Sluizen maken zoet water overbodig bij het passeren van het kanaal."]
    }
  ];

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function append(name, items) {
    if (!Array.isArray(window[name])) window[name] = [];
    const existing = new Set(window[name].map((item) => String(item.id)));
    items.forEach((item) => { if (!existing.has(String(item.id))) window[name].push(item); });
  }

  append("SIGN_ITEMS", SOURCES.map((source) => ({ id: "pilot-" + source.id, onderwerp: source.onderwerp, themas: source.themas, alineas: clone(source.alineas), vragen: clone(source.sign) })));
  append("VW_ITEMS", SOURCES.map((source) => ({ id: "pilot-" + source.id, onderwerp: source.onderwerp, themas: source.themas, alineas: clone(source.alineas), vragen: clone(source.vw) })));
  append("TK_ITEMS", SOURCES.map((source) => ({
    id: "pilot-" + source.id,
    onderwerp: source.onderwerp,
    themas: source.themas,
    titel: source.titel,
    sections: clone(source.sections),
    vragen: [{ type: "titel", correct: source.titel, options: clone(source.titleOptions), uitleg: "Deze titel noemt het centrale onderwerp en past bij alle delen van de tekst." }]
  })));
  append("SAM_ITEMS", SOURCES.map((source) => ({
    id: "pilot-" + source.id,
    onderwerp: source.onderwerp,
    soort: "Informatief",
    themas: source.themas,
    alineas: clone(source.alineas),
    correct: source.summary,
    opties: source.summaryOptions.map((tekst, index) => ({
      tekst,
      type: index === 0 ? "goed" : (index === 1 ? "onjuist" : index === 2 ? "verzonnen informatie" : "te beperkt"),
      uitleg: index === 0 ? "Deze samenvatting noemt de hoofdzaak zonder onnodige details." : "Deze keuze geeft de hoofdzaak niet volledig en correct weer."
    }))
  })));
  append("CONC_ITEMS", SOURCES.map((source) => ({
    id: "pilot-" + source.id,
    onderwerp: source.onderwerp,
    soort: "Informatief",
    themas: source.themas,
    alineas: clone(source.alineas),
    vraag: "Welke conclusie kun je trekken?",
    correct: source.conclusion,
    opties: source.conclusionOptions.map((tekst, index) => ({
      tekst,
      type: index === 0 ? "goed" : (index === 1 ? "te sterke conclusie" : index === 2 ? "tegenstrijdig" : "staat niet in de tekst"),
      uitleg: index === 0 ? "Deze conclusie volgt logisch uit meerdere aanwijzingen in de tekst." : "Deze conclusie wordt niet ondersteund door de informatie in de tekst."
    }))
  })));
})();
