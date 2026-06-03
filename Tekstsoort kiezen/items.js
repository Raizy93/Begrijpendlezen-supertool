window.TSK_TYPES = [
  { id: "nieuwsbericht", label: "Nieuwsbericht", hint: "kop, datum, plaats en feiten" },
  { id: "recept", label: "Recept", hint: "ingredienten en bereidingsstappen" },
  { id: "instructietekst", label: "Instructietekst", hint: "stappenplan om iets te doen" },
  { id: "verhaal", label: "Verhaal", hint: "personen, gebeurtenis en beleving" },
  { id: "informatieve_tekst", label: "Informatieve tekst", hint: "uitleg, feiten en tussenkopjes" },
  { id: "reclame", label: "Reclame", hint: "aanprijzen en overtuigen" },
  { id: "brief_email", label: "Brief / e-mail", hint: "aanhef, boodschap en afsluiting" },
  { id: "interview", label: "Interview", hint: "vragen en antwoorden" },
  { id: "recensie", label: "Recensie", hint: "oordeel met argumenten" },
  { id: "dagboek_blog", label: "Dagboek / blog", hint: "ik-vorm, datum en ervaring" }
];

window.TSK_ITEMS = [
  {
    id: 1,
    type: "nieuwsbericht",
    label: "Nieuwsbericht",
    options: ["nieuwsbericht", "informatieve_tekst", "interview", "brief_email"],
    blocks: [
      { kind: "headline", text: "Nieuwe fietsstraat bij basisschool officieel geopend" },
      { kind: "meta", text: "Door onze verslaggever - Dinsdag 3 juni 2026, Utrecht" },
      { kind: "paragraph", text: "Bij basisschool De Wilg is dinsdagmorgen een nieuwe fietsstraat geopend. De straat ligt tussen de school, de sporthal en de bibliotheek. Volgens de gemeente reden daar elke ochtend veel auto's en fietsen door elkaar." },
      { kind: "paragraph", text: "Wethouder Samira El Idrissi knipte om half negen een lint door. Daarna fietsten leerlingen uit groep 7 als eersten over het rode asfalt. Langs de weg stonden ouders, buurtbewoners en twee verkeersregelaars te kijken." },
      { kind: "paragraph", text: "De gemeente heeft de straat smaller gemaakt voor auto's en breder voor fietsers. Ook zijn er gele borden geplaatst met de tekst: fietsers eerst. Auto's mogen er nog wel rijden, maar zij moeten rustig achter fietsers blijven." },
      { kind: "paragraph", text: "Directeur Van Dijk zegt dat de school al langer om maatregelen vroeg. Vorig jaar telde de ouderraad in een week 312 bijna-botsingen bij het hek. De school hoopt dat kinderen nu veiliger zelfstandig naar school kunnen komen." },
      { kind: "paragraph", text: "De komende maand controleert de gemeente of bestuurders zich aan de nieuwe regels houden. Daarna wordt besloten of er nog extra verkeersdrempels nodig zijn." }
    ],
    uitleg: "Dit is een nieuwsbericht: er is een kop, datum, plaats, verslaggever en feitelijke informatie over een actuele gebeurtenis."
  },
  {
    id: 2,
    type: "recept",
    label: "Recept",
    options: ["recept", "instructietekst", "informatieve_tekst", "dagboek_blog"],
    blocks: [
      { kind: "headline", text: "Wraps met kip, komkommer en yoghurtsaus" },
      { kind: "meta", text: "Voor 4 personen - Bereidingstijd: 25 minuten" },
      { kind: "subhead", text: "Ingredienten" },
      { kind: "list", items: ["4 volkoren wraps", "300 gram kipfilet", "1 komkommer", "2 tomaten", "4 eetlepels yoghurt", "1 theelepel kerriepoeder", "peper, zout en een beetje olie"] },
      { kind: "subhead", text: "Bereiding" },
      { kind: "paragraph", text: "Snijd de kipfilet in kleine blokjes. Verhit een beetje olie in een koekenpan en bak de kip in ongeveer acht minuten gaar. Strooi er peper, zout en kerriepoeder overheen." },
      { kind: "paragraph", text: "Was ondertussen de komkommer en de tomaten. Snijd de komkommer in dunne reepjes en de tomaten in kleine stukjes. Roer de yoghurt los in een schaaltje en voeg eventueel nog wat kerriepoeder toe." },
      { kind: "paragraph", text: "Warm de wraps kort op in een droge pan. Leg op elke wrap wat kip, komkommer en tomaat. Schep er een lepel yoghurtsaus overheen. Rol de wrap stevig op en snijd hem schuin doormidden." },
      { kind: "paragraph", text: "Serveer de wraps meteen, zodat ze nog warm zijn. Bewaar restjes kip maximaal twee dagen afgedekt in de koelkast." }
    ],
    uitleg: "Dit is een recept: je ziet ingredienten, hoeveelheden, bereidingstijd en stappen om eten te maken."
  },
  {
    id: 3,
    type: "instructietekst",
    label: "Instructietekst",
    options: ["instructietekst", "recept", "informatieve_tekst", "nieuwsbericht"],
    blocks: [
      { kind: "headline", text: "Zo lever je een boekbespreking in via de digitale leeromgeving" },
      { kind: "meta", text: "Handleiding voor leerlingen van groep 7 en 8" },
      { kind: "paragraph", text: "Volg de stappen hieronder rustig en in de juiste volgorde. Controleer voordat je begint of je boekbespreking als document op je computer staat opgeslagen." },
      { kind: "steps", items: ["Log in met je schoolaccount.", "Klik links in het menu op Taal.", "Open de map Boekbespreking periode 3.", "Klik op Bestand toevoegen.", "Kies je document en wacht tot de groene vink verschijnt.", "Schrijf in het tekstvak de titel van je boek en je eigen naam.", "Klik op Inleveren en controleer of je de melding Klaar ziet."] },
      { kind: "paragraph", text: "Lukt uploaden niet, probeer dan eerst de pagina te vernieuwen. Sluit je browser niet terwijl het bestand nog bezig is met laden." },
      { kind: "paragraph", text: "Vraag pas hulp aan de leerkracht als je de stappen nog een keer hebt gecontroleerd. Zo weet je precies waar het misgaat." }
    ],
    uitleg: "Dit is een instructietekst: de tekst legt stap voor stap uit hoe je iets moet doen."
  },
  {
    id: 4,
    type: "verhaal",
    label: "Verhaal",
    options: ["verhaal", "dagboek_blog", "recensie", "interview"],
    blocks: [
      { kind: "headline", text: "De sleutel onder het klimrek" },
      { kind: "paragraph", text: "Noor bleef als laatste op het plein achter. De bel was al gegaan, maar onder het klimrek glinsterde iets tussen de houtsnippers. Ze bukte en veegde met haar mouw het zand weg." },
      { kind: "paragraph", text: "Het was een sleutel, klein en koperkleurig, met een label eraan. Op het label stond geen naam, alleen een tekening van een maan. Noor voelde meteen dat dit geen gewone sleutel was." },
      { kind: "paragraph", text: "Uit het lege fietsenhok klonk zacht geritsel. Noor stopte de sleutel in haar jaszak en liep erheen. Net toen ze de deur wilde openen, schoof er aan de binnenkant iets over de vloer." },
      { kind: "quote", text: "\"Wie is daar?\" fluisterde Noor." },
      { kind: "paragraph", text: "Er kwam geen antwoord. Wel gleed er een briefje onder de deur door. Noor pakte het op met trillende vingers. Op het papier stond: breng de sleutel terug voordat de maan opkomt." },
      { kind: "paragraph", text: "Noor keek naar de lucht. Boven het dak van de school werd het al donkerblauw." }
    ],
    uitleg: "Dit is een verhaal: er zijn personages, spanning, gebeurtenissen en beschrijvende zinnen die je laten meeleven."
  },
  {
    id: 5,
    type: "informatieve_tekst",
    label: "Informatieve tekst",
    options: ["informatieve_tekst", "nieuwsbericht", "instructietekst", "recept"],
    blocks: [
      { kind: "headline", text: "Waarom bijen belangrijk zijn" },
      { kind: "subhead", text: "Bestuiving" },
      { kind: "paragraph", text: "Bijen vliegen van bloem naar bloem om nectar te verzamelen. Terwijl ze dat doen, blijft er stuifmeel aan hun lijf hangen. Dat stuifmeel nemen ze mee naar de volgende bloem." },
      { kind: "paragraph", text: "Door die bestuiving kunnen veel planten vruchten en zaden maken. Appels, aardbeien, courgettes en kersen zijn voorbeelden van voedsel dat afhankelijk is van bestuivende insecten." },
      { kind: "subhead", text: "Meer dan honing" },
      { kind: "paragraph", text: "Veel mensen denken bij bijen vooral aan honing, maar hun werk in de natuur is veel groter. Zonder bijen zouden sommige planten minder goed groeien en zouden dieren minder voedsel vinden." },
      { kind: "paragraph", text: "Bijen hebben wel hulp nodig. Ze vinden minder bloemen in tuinen met alleen tegels. Ook kunnen bestrijdingsmiddelen schadelijk zijn voor bijenvolken." },
      { kind: "subhead", text: "Wat kun je doen?" },
      { kind: "paragraph", text: "Je kunt bijen helpen door bloemen te planten die in verschillende seizoenen bloeien. Ook een klein hoekje met wilde planten kan al verschil maken." }
    ],
    uitleg: "Dit is een informatieve tekst: de tekst geeft uitleg en feiten over een onderwerp, met tussenkopjes."
  },
  {
    id: 6,
    type: "reclame",
    label: "Reclame",
    options: ["reclame", "recensie", "brief_email", "informatieve_tekst"],
    blocks: [
      { kind: "headline", text: "Probeer nu de nieuwe StormRunner rugzak!" },
      { kind: "meta", text: "Introductieactie: deze week 20 procent korting" },
      { kind: "paragraph", text: "Ben jij klaar met natte schriften, kapotte ritsen en een tas die na twee maanden al slap hangt? De StormRunner rugzak is gemaakt voor drukke schooldagen, regenachtige fietstochten en volle gymtassen." },
      { kind: "paragraph", text: "Dankzij het stevige waterafstotende materiaal blijven je boeken beter droog. De brede schouderbanden zorgen ervoor dat de tas comfortabel zit, zelfs als je veel spullen meeneemt." },
      { kind: "list", items: ["Extra laptopvak", "Reflecterende strepen voor in het donker", "Drie ruime zijvakken", "Gratis naamlabel bij aankoop"] },
      { kind: "paragraph", text: "Bestel de StormRunner deze week voor 39,95 euro in plaats van 49,95 euro. De actie geldt zolang de voorraad strekt." },
      { kind: "paragraph", text: "Ga naar stormrunner.example en kies vandaag nog jouw kleur. Een goede schooldag begint met een tas die met je meekan." }
    ],
    uitleg: "Dit is reclame: de tekst prijst een product aan, noemt voordelen, een prijsactie en spoort je aan om te kopen."
  },
  {
    id: 7,
    type: "brief_email",
    label: "Brief / e-mail",
    options: ["brief_email", "nieuwsbericht", "dagboek_blog", "instructietekst"],
    blocks: [
      { kind: "meta", text: "Onderwerp: Informatie over het schoolkamp" },
      { kind: "paragraph", text: "Beste ouders en verzorgers," },
      { kind: "paragraph", text: "Volgende maand gaat groep 8 op schoolkamp naar Austerlitz. In deze e-mail leest u de belangrijkste informatie over vertrek, bagage en bereikbaarheid." },
      { kind: "paragraph", text: "We vertrekken op woensdag 24 juni om 09.00 uur vanaf het schoolplein. De leerlingen nemen een lunchpakket, een drinkfles, regenkleding en beddengoed mee. Mobiele telefoons blijven thuis, tenzij hierover met de leerkracht een aparte afspraak is gemaakt." },
      { kind: "paragraph", text: "Tijdens het kamp zijn de leerkrachten bereikbaar via het noodnummer van school. Foto's plaatsen we aan het einde van elke dag in de ouderapp, zodat u een indruk krijgt van de activiteiten." },
      { kind: "paragraph", text: "Wilt u het toestemmingsformulier uiterlijk vrijdag 12 juni ingevuld meegeven? Zonder formulier kan een leerling helaas niet mee." },
      { kind: "paragraph", text: "Met vriendelijke groet," },
      { kind: "signature", text: "Meester Danny en juf Samira" }
    ],
    uitleg: "Dit is een brief of e-mail: je ziet een onderwerp, aanhef, boodschap, afsluiting en afzender."
  },
  {
    id: 8,
    type: "interview",
    label: "Interview",
    options: ["interview", "nieuwsbericht", "recensie", "informatieve_tekst"],
    blocks: [
      { kind: "headline", text: "In gesprek met kinderboekenschrijver Lotte Vermeer" },
      { kind: "meta", text: "Door de redactie van de schoolkrant" },
      { kind: "qa", q: "Wanneer wist u dat u schrijver wilde worden?", a: "Toen ik in groep 7 zat. Ik schreef toen al korte verhalen achter in mijn rekenschrift. Mijn meester zei dat ik ze moest bewaren." },
      { kind: "qa", q: "Waar haalt u ideeen vandaan?", a: "Vaak uit gewone situaties. Een vergeten jas, een rare buurman of een geluid op zolder kan het begin van een verhaal worden." },
      { kind: "qa", q: "Schrijft u elke dag?", a: "Bijna wel. Soms schrijf ik nieuwe hoofdstukken, soms verbeter ik oude zinnen. Schrijven is ook veel schrappen." },
      { kind: "qa", q: "Heeft u een tip voor kinderen die zelf willen schrijven?", a: "Begin klein. Schrijf eerst een scene die je spannend of grappig vindt. Daarna kun je bedenken wat ervoor en erna gebeurt." },
      { kind: "qa", q: "Welk boek van uzelf vindt u het bijzonderst?", a: "Het geheim van kamer 12. Dat boek gaat over vriendschap en moed, en daar krijg ik nog vaak brieven over." }
    ],
    uitleg: "Dit is een interview: de tekst bestaat vooral uit vragen en antwoorden tussen interviewer en geinterviewde."
  },
  {
    id: 9,
    type: "recensie",
    label: "Recensie",
    options: ["recensie", "reclame", "verhaal", "dagboek_blog"],
    blocks: [
      { kind: "headline", text: "De Nachtbus naar Nergens" },
      { kind: "meta", text: "Yara, groep 8 - Beoordeling: 4 van de 5 sterren" },
      { kind: "paragraph", text: "De Nachtbus naar Nergens is een spannend jeugdboek over Finn, die per ongeluk in een bus stapt die niet op de kaart staat. Vanaf de eerste bladzijde wil je weten waar de bus heen gaat." },
      { kind: "paragraph", text: "Het sterkste aan het boek is de sfeer. De schrijver beschrijft de mistige haltes en vreemde passagiers zo duidelijk dat je het bijna voor je ziet. Ook Finn voelt echt: hij is bang, maar blijft toch nadenken." },
      { kind: "paragraph", text: "Soms gaat het verhaal wel erg snel. Een paar raadsels worden binnen twee bladzijden opgelost, terwijl ik daar graag langer over had gelezen. Toch blijft het boek spannend genoeg om door te lezen." },
      { kind: "paragraph", text: "Ik geef het boek vier sterren. Ik raad het vooral aan aan kinderen die houden van mysterie, korte hoofdstukken en een einde dat je nog even laat nadenken." }
    ],
    uitleg: "Dit is een recensie: de schrijver beoordeelt een boek, geeft argumenten en noemt een score."
  },
  {
    id: 10,
    type: "dagboek_blog",
    label: "Dagboek / blog",
    options: ["dagboek_blog", "verhaal", "brief_email", "recensie"],
    blocks: [
      { kind: "headline", text: "Mijn eerste dag als brugklasser voor een dag" },
      { kind: "meta", text: "Amir - Woensdag 3 juni 2026" },
      { kind: "paragraph", text: "Vandaag mochten we met groep 8 een ochtend meelopen op de middelbare school. Ik deed alsof ik heel rustig was, maar in mijn buik voelde het alsof er een blender aanstond." },
      { kind: "paragraph", text: "Bij binnenkomst kreeg ik meteen een rooster. Drie lokalen, twee pauzes en zelfs een lokaalnummer met een verdieping erbij. Op onze basisschool kun je bijna niet verdwalen, maar hier leek alles op elkaar." },
      { kind: "paragraph", text: "De eerste les was biologie. We bekeken een ui onder een microscoop. Ik vond het grappig dat iets wat je normaal in de pan gooit er ineens uitzag als een soort tegelvloer." },
      { kind: "paragraph", text: "In de pauze kocht ik voor het eerst zelf iets in de kantine. Ik koos een broodje kaas en deed net alsof ik precies wist waar ik moest betalen." },
      { kind: "paragraph", text: "Toen ik terugfietste, was ik nog steeds zenuwachtig voor volgend jaar. Maar nu weet ik ook dat ik het waarschijnlijk best kan. Als ik de weg kan vinden, komt de rest vast ook wel." }
    ],
    uitleg: "Dit is een dagboek of blog: de schrijver vertelt in de ik-vorm over een persoonlijke ervaring met gedachten en gevoelens."
  }
];
