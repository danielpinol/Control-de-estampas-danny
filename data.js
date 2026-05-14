/* ============ Album data + storage ============
 * Source of truth: OFFICIAL Panini FIFA WC26 checklist (full 980-sticker listing).
 * Teams stored in ALBUM ORDER (not group order). Confederations + groups inferred.
 * Player names verbatim from the official checklist (typos preserved on codes:
 *   SWI9/SWI20 instead of SUI9/SUI20, KAS12 instead of KSA12).
 */

(function (global) {
  'use strict';

  // ---------- Intro (00, FWC1..FWC8) ----------
  const INTRO_STICKERS = [
    { code: '00',   name: 'Panini Logo',                       foil: true },
    { code: 'FWC1', name: 'Official Emblem',                   foil: true },
    { code: 'FWC2', name: 'Official Emblem',                   foil: true },
    { code: 'FWC3', name: 'Official Mascots',                  foil: true },
    { code: 'FWC4', name: 'Official Slogan',                   foil: true },
    { code: 'FWC5', name: 'Official Ball',                     foil: true },
    { code: 'FWC6', name: 'Canada — Host Countries & Cities',  foil: true },
    { code: 'FWC7', name: 'Mexico — Host Countries & Cities',  foil: true },
    { code: 'FWC8', name: 'USA — Host Countries & Cities',     foil: true },
  ];

  // ---------- FIFA Museum (FWC9..FWC19) ----------
  const MUSEUM_STICKERS = [
    { code: 'FWC9',  name: 'Italy 1934',        foil: true },
    { code: 'FWC10', name: 'Uruguay 1950',      foil: true },
    { code: 'FWC11', name: 'West Germany 1954', foil: true },
    { code: 'FWC12', name: 'Brazil 1962',       foil: true },
    { code: 'FWC13', name: 'West Germany 1974', foil: true },
    { code: 'FWC14', name: 'Argentina 1986',    foil: true },
    { code: 'FWC15', name: 'Brazil 1994',       foil: true },
    { code: 'FWC16', name: 'Brazil 2002',       foil: true },
    { code: 'FWC17', name: 'Italy 2006',        foil: true },
    { code: 'FWC18', name: 'Germany 2014',      foil: true },
    { code: 'FWC19', name: 'Argentina 2022',    foil: true },
  ];

  // ---------- 48 teams in GROUP ORDER (A → L, official draw) ----------
  // [code, name, group, confed, hostOrFlag, [18 player names]]
  // Position 1 = Escudo (FOIL). Position 13 = Team Photo. Rest = players.
  const TEAM_DATA = [
    // ── GRUPO A ──────────────────────────────────────────────────────────────
    ['MEX', 'México', 'A', 'CONCACAF', 'host',
      ['Luis Malagón','Johan Vasquez','Jorge Sánchez','Cesar Montes','Jesus Gallardo','Israel Reyes','Diego Lainez','Carlos Rodriguez','Edson Alvarez','Orbelin Pineda','Marcel Ruiz','Érick Sánchez','Hirving Lozano','Santiago Giménez','Raúl Jiménez','Alexis Vega','Roberto Alvarado','Cesar Huerta']],
    ['RSA', 'Sudáfrica', 'A', 'CAF', null,
      ['Ronwen Williams','Sipho Chaine','Aubrey Modiba','Samukele Kabini','Mbekezeli Mbokazi','Khulumani Ndamane','Siyabonga Ngezana','Khuliso Mudau','Nkosinathi Sibisi','Teboho Mokoena','Thalente Mbatha','Bathasi Aubaas','Yaya Sithole','Sipho Mbule','Lyle Foster','Iqraam Rayners','Mohau Nkota','Oswin Appollis']],
    ['KOR', 'Corea del Sur', 'A', 'AFC', null,
      ['Hyeon-woo Jo','Seung-Gyu Kim','Min-jae Kim','Yu-min Cho','Young-woo Seol','Han-beom Lee','Tae-seok Lee','Myung-jae Lee','Jae-sung Lee','In-beom Hwang','Kang-in Lee','Seung-ho Paik','Jens Castrop','Dongg-yeong Lee','Gue-sung Cho','Heung-min Son','Hee-chan Hwang','Hyeon-Gyu Oh']],
    ['CZE', 'República Checa', 'A', 'UEFA', null,
      ['Matej Kovar','Jindrich Stanek','Ladislav Krejci','Vladimir Coufal','Jaroslav Zeleny','Tomas Holes','David Zima','Michal Sadilek','Lukas Provod','Lukas Cerv','Tomas Soucek','Pavel Sulc','Matej Vydra','Vasil Kusej','Tomas Chory','Vaclav Cerny','Adam Hlozek','Patrik Schick']],
    // ── GRUPO B ──────────────────────────────────────────────────────────────
    ['CAN', 'Canadá', 'B', 'CONCACAF', 'host',
      ['Dayne St.Clair','Alphonso Davies','Alistair Johnston','Samuel Adekugbe','Riche Larvea','Derek Cornelius','Moïse Bombito','Kamal Miller','Stephen Eustáquio','Ismaël Koné','Jonathan Osorio','Jacob Shaffelburg','Mathieu Choinière','Niko Sigur','Tajon Buchanan','Liam Millar','Cyle Larin','Jonathan David']],
    ['BIH', 'Bosnia y Herzegovina', 'B', 'UEFA', null,
      ['Nikola Vasilj','Amer Dedic','Sead Kolasinac','Tarik Muharemovic','Nihad Mujakic','Nikola Katic','Amir Hadziahmetovic','Benjamin Tahirovic','Armin Gigovic','Ivan Sunjic','Ivan Basic','Dzenis Burnic','Esmir Bajraktarevic','Amar Memic','Ermedin Demirovic','Edin Dzeko','Samed Bazdar','Haris Tabakovic']],
    ['QAT', 'Qatar', 'B', 'AFC', null,
      ['Meshaal Barsham','Sultan Albrake','Lucas Mendes','Homam Ahmed','Boualem Khoukhi','Pedro Miguel','Tarek Salman','Mohamed Al-Mannai','Karim Boudiaf','Assim Madibo','Ahmed Fatehi','Mohammed Waad','Abdulaziz Hatem','Hassan Al-Haydos','Edmilson Junior','Akram Hassan Afif','Ahmed Al Ganehi','Almoez Ali']],
    // SUI has typos: SWI9 (Granit Xhaka) and SWI20 (Zeki Amdouni) — preserved as printed
    ['SUI', 'Suiza', 'B', 'UEFA', null,
      ['Gregor Kobel','Yvon Mvogo','Manuel Akanji','Ricardo Rodriguez','Nico Elvedi','Aurèle Amenda','Silvan Widmer','Granit Xhaka','Denis Zakaria','Remo Freuler','Fabian Rieder','Ardon Jashari','Johan Manzambi','Michel Aebischer','Breel Embolo','Ruben Vargas','Dan Ndoye','Zeki Amdouni'],
      { typoCodes: { 9: 'SWI9', 20: 'SWI20' } }],
    // ── GRUPO C ──────────────────────────────────────────────────────────────
    ['BRA', 'Brasil', 'C', 'CONMEBOL', null,
      ['Alisson','Bento','Marquinhos','Éder Militão','Gabriel Magalhães','Danilo','Wesley','Lucas Paquetá','Casemiro','Bruno Guimarães','Luiz Henrique','Vinicius Júnior','Rodrygo','João Pedro','Matheus Cunha','Gabriel Martinelli','Raphinha','Estévão']],
    ['MAR', 'Marruecos', 'C', 'CAF', null,
      ['Yassine Bounou','Munir El Kajoui','Achraf Hakimi','Noussair Mazraoui','Nayef Aguerd','Roman Saiss','Jawad El Yamio','Adam Masina','Sofyan Amrabat','Azzedine Ounahi','Eliesse Ben Seghir','Bilal El Khannouss','Ismael Saibari','Youssef En-Nesyri','Abde Ezzalzouli','Soufiane Rahimi','Brahim Diaz','Ayoub El Kaabi']],
    ['HAI', 'Haití', 'C', 'CONCACAF', null,
      ['Johny Placide','Carlens Arcus','Martin Expérience','Jean-Kevin Duverne','Ricardo Adé','Duke Lacroix','Garven Metusala','Hannes Delcroix','Leverton Pierre','Danley Jean Jacques','Jean-Ricner Bellegarde','Christopher Attys','Derrick Etienne Jr','Josue Casimir','Ruben Providence','Duckens Nazon','Louicius Deedson','Frantzdy Pierrot']],
    ['SCO', 'Escocia', 'C', 'UEFA', null,
      ['Angus Gunn','Jack Hendry','Kieran Tierney','Aaron Hickey','Andrew Robertson','Scott McKenna','John Souttar','Anthony Ralston','Grant Hanley','Scott McTominay','Billy Gilmour','Lewis Ferguson','Ryan Christie','Kenny McLean','John McGinn','Lyndon Dykes','Che Adams','Ben Gannon-Doak']],
    // ── GRUPO D ──────────────────────────────────────────────────────────────
    ['USA', 'Estados Unidos', 'D', 'CONCACAF', 'host',
      ['Math Freese','Chris Richards','Tim Ream','Mark McKenzie','Alex Freeman','Antonee Robinson','Tyler Adams','Tanner Tessmann','Weston McKenny','Christian Roldan','Timothy Weah','Diego Luna','Malik Tillman','Christian Pulisic','Brenden Aaronson','Ricardo Pepi','Haji Wright','Folarin Balogun']],
    ['PAR', 'Paraguay', 'D', 'CONMEBOL', null,
      ['Roberto Fernandez','Orlando Gill','Gustavo Gomez','Fabián Balbuena','Juan José Cáceres','Omar Alderete','Junior Alonso','Mathías Villasanti','Diego Gomez','Damián Bobadilla','Andres Cubas','Matias Galarza Fonda','Julio Enciso','Alejandro Romero Gamarra','Miguel Almirón','Ramon Sosa','Angel Romero','Antonio Sanabria']],
    ['AUS', 'Australia', 'D', 'AFC', null,
      ['Mathew Ryan','Joe Gauci','Harry Souttar','Alessandro Circati','Jordan Bos','Aziz Behich','Cameron Burgess','Lewis Miller','Milos Degenek','Jackson Irvine','Riley McGree','Aiden O\'Neill','Connor Metcalfe','Patrick Yazbek','Craig Goodwin','Kusini Vengi','Nestory Irankunda','Mohamed Touré']],
    ['TUR', 'Türkiye', 'D', 'UEFA', null,
      ['Ugurcan Cakir','Mert Muldur','Zeki Celik','Abdulkerim Bardakci','Caglar Soyuncu','Merih Demiral','Ferdi Kadioglu','Kaan Ayhan','Ismail Yuksek','Hakan Calhanoglu','Orkun Kokcu','Arda Guler','Irfan Can Kahveci','Yunus Akgun','Can Uzun','Baris Alper Yilmaz','Kerem Akturkoglu','Kenan Yildiz']],
    // ── GRUPO E ──────────────────────────────────────────────────────────────
    ['GER', 'Alemania', 'E', 'UEFA', null,
      ['Marc-André ter Stegen','Jonathan Tah','David Raum','Nico Schlotterbeck','Antonio Rüdiger','Waldemar Anton','Ridle Baku','Maximilian Mittelstadt','Joshua Kimmich','Florian Wirtz','Felix Nmecha','Leon Goretzka','Jamal Musiala','Serge Gnabry','Kai Havertz','Leroy Sane','Karim Adeyemi','Nick Woltemade']],
    ['CUW', 'Curazao', 'E', 'CONCACAF', 'debut',
      ['Eloy Room','Armando Obispo','Sherel Floranus','Jurien Gaari','Joshua Brenet','Roshon Van Eijma','Shurandy Sambo','Livano Comenencia','Godfried Roemeratoe','Juninho Bacuna','Leandro Bacuna','Tahith Chong','Kenji Gorre','Jearl Margaritha','Jurgen Locadia','Jeremy Antonisse','Gervane Kastaneer','Sontje Hansen']],
    ['CIV', 'Costa de Marfil', 'E', 'CAF', null,
      ['Yahia Fofana','Ghislain Konan','Wilfried Singo','Odilon Kossounou','Evan Ndicka','Willy Boly','Emmanuel Agbadou','Ousmane Diomande','Franck Kessie','Seko Fofana','Ibrahim Sangare','Jean-Philippe Gbamin','Amad Diallo','Sébastien Haller','Simon Adingra','Yan Diomande','Evann Guessand','Oumar Diakite']],
    ['ECU', 'Ecuador', 'E', 'CONMEBOL', null,
      ['Hernán Galíndez','Gonzalo Valle','Piero Hincapié','Pervis Estupiñán','Willian Pacho','Ángelo Preciado','Joel Ordóñez','Moises Caicedo','Alan Franco','Kendry Paez','Pedro Vite','John Veboah','Leonardo Campana','Gonzalo Plata','Nilson Angulo','Alan Minda','Kevin Rodriguez','Enner Valencia']],
    // ── GRUPO F ──────────────────────────────────────────────────────────────
    ['NED', 'Países Bajos', 'F', 'UEFA', null,
      ['Bart Verbruggen','Virgil van Dijk','Micky van de Ven','Jurrien Timber','Denzel Dumfries','Nathan Aké','Jeremie Frimpong','Jan Paul van Hecke','Tijjani Reijnders','Ryan Gravenberch','Teun Koopmeiners','Frenkie de Jong','Xavi Simons','Justin Kluivert','Memphis Depay','Donyell Malen','Wout Weghorst','Cody Gakpo']],
    ['JPN', 'Japón', 'F', 'AFC', null,
      ['Zion Suzuki','Henry Heroki Mochizuki','Ayumu Seko','Junnosuke Suzuki','Shogo Taniguchi','Tsuyoshi Watanabe','Kaishu Sano','Yuki Soma','Ao Tanaka','Daichi Kamada','Takefusa Kubo','Ritsu Doan','Keito Nakamura','Takumi Minamino','Shuto Machino','Junya Ito','Koki Ogawa','Ayase Ueda']],
    ['SWE', 'Suecia', 'F', 'UEFA', null,
      ['Victor Johansson','Isak Hien','Gabriel Gudmundsson','Emil Holm','Victor Nilsson Lindelöf','Gustaf Lagerbielke','Lucas Bergvall','Hugo Larsson','Jesper Karlström','Yasin Ayari','Mattias Svanberg','Daniel Svensson','Ken Sema','Roony Bardghji','Dejan Kulusevski','Anthony Elanga','Alexander Isak','Viktor Gyökeres']],
    ['TUN', 'Túnez', 'F', 'CAF', null,
      ['Bechir Ben Said','Aymen Dahmen','Yan Valery','Montassar Talbi','Yassine Meriah','Ali Abdi','Dylan Bronn','Ellyes Skhiri','Aissa Laidouni','Ferjani Sassi','Mohamed Ali Ben Romdhane','Hannibal Mejbri','Elias Achouri','Elias Saad','Hazem Mastouri','Ismael Gharbi','Sayfallah Ltaief','Naim Sliti']],
    // ── GRUPO G ──────────────────────────────────────────────────────────────
    ['BEL', 'Bélgica', 'G', 'UEFA', null,
      ['Thibaut Courtois','Arthur Theate','Timothy Castagne','Zeno Debast','Brandon Mechele','Maxim De Cuyper','Thomas Meunier','Youri Tielemans','Amadou Onana','Nicolas Raskin','Alexis Saelemaekers','Hans Vanaken','Kevin De Bruyne','Jérémy Doku','Charles De Ketelaere','Leandro Trossard','Loïs Openda','Romelu Lukaku']],
    ['EGY', 'Egipto', 'G', 'CAF', null,
      ['Mohamed El Shenawy','Mohamed Hany','Mohamed Hamdy','Yasser Ibrahim','Khaled Sobhi','Ramy Rabia','Hossam Abdelmaguid','Ahmed Fatouh','Marwan Attia','Zizo','Hamdy Fathy','Mohamed Lasheen','Emam Ashour','Osama Faisal','Mohamed Salah','Mostafa Mohamed','Trezeguet','Omar Marmoush']],
    ['IRN', 'Irán', 'G', 'AFC', null,
      ['Alireza Beiranvand','Morteza Pouraliganji','Ehsan Hajsafi','Milad Mohammadi','Shojae Khalilzadeh','Ramin Rezaeian','Hossein Kanaani','Sadegh Moharrami','Saleh Hardani','Saeed Ezatolahi','Saman Ghoddos','Omid Noorafkan','Roozbeh Cheshmi','Mohammad Mohebi','Sardar Azmoun','Mehdi Taremi','Alireza Jahanbakhsh','Ali Gholizadeh']],
    ['NZL', 'Nueva Zelanda', 'G', 'OFC', null,
      ['Max Crocombe Payne','Alex Paulsen','Michael Boxall','Liberato Cacace','Tim Payne','Tyler Bindon','Francis de Vries','Finn Surman','Joe Bell','Sarpreet Singh','Ryan Thomas','Matthew Garbett','Marko Stamenić','Ben Old','Chris Wood','Elijah Just','Callum McCowatt','Kosta Barbarouses']],
    // ── GRUPO H ──────────────────────────────────────────────────────────────
    ['ESP', 'España', 'H', 'UEFA', null,
      ['Unai Simon','Robin Le Normand','Aymeric Laporte','Dean Huijsen','Pedro Porro','Dani Carvajal','Marc Cucurella','Martín Zubimendi','Rodri','Pedri','Fabian Ruiz','Mikel Merino','Lamine Yamal','Dani Olmo','Nico Williams','Ferran Torres','Álvaro Morata','Mikel Oyarzabal']],
    // KSA has typo: KAS12 (Nasser Aldawsari) — preserved as printed
    ['KSA', 'Arabia Saudita', 'H', 'AFC', null,
      ['Nawaf Alaqidi','Abdulrahman Al-Sanbi','Saud Abdulhamid','Nawaf Bouwashl','Jihad Thakri','Moteb Al-Harbi','Hassan Altambakti','Musab Aljuwayr','Ziyad Aljohani','Abdullah Alkhaibari','Nasser Aldawsari','Saleh Abu Alshamat','Marwan Alsahafi','Salem Aldawsari','Abdulrahman Al-Aboud','Feras Akbrikan','Saleh Alshehri','Abdullah Al-Hamdan'],
      { typoCodes: { 12: 'KAS12' } }],
    ['URU', 'Uruguay', 'H', 'CONMEBOL', null,
      ['Sergio Rochet','Santiago Mele','Ronald Araujo','José María Giménez','Sebastian Caceres','Mathias Olivera','Guillermo Varela','Nahitan Nandez','Federico Valverde','Giorgian De Arrascaeta','Rodrigo Bentancur','Manuel Ugarte','Nicolás de la Cruz','Maxi Araujo','Darwin Núñez','Federico Viñas','Rodrigo Aguirre','Facundo Pellistri']],
    ['CPV', 'Cabo Verde', 'H', 'CAF', 'debut',
      ['Vozinha','Logan Costa','Pico','Diney','Steven Moreira','Wagner Pina','Joao Paulo','Yannick Semedo','Kevin Pina','Patrick Andrade','Jamiro Monteiro','Deroy Duarte','Garry Rodrigues','Jovane Cabral','Ryan Mendes','Dailon Livramento','Willy Semedo','Bebe']],
    // ── GRUPO I ──────────────────────────────────────────────────────────────
    ['FRA', 'Francia', 'I', 'UEFA', null,
      ['Mike Maignan','Theo Hernandez','William Saliba','Jules Kounde','Ibrahima Konate','Dayot Upamecano','Lucas Digne','Aurélien Tchouaméni','Eduardo Camavinga','Manu Kone','Adrien Rabiot','Michael Olise','Ousmane Dembele','Bradley Barcola','Désiré Doué','Kingsley Coman','Hugo Ekitike','Kylian Mbappe']],
    ['SEN', 'Senegal', 'I', 'CAF', null,
      ['Edouard Mendy','Yehvann Diouf','Moussa Niakhaté','Abdoulaye Seck','Ismail Jakobs','El Hadji Malick Diouf','Kalidou Koulibaly','Idrissa Gana Gueye','Pape Matar Sarr','Pape Gueye','Habib Diarra','Lamine Camara','Sadio Mane','Ismaïla Sarr','Boulaye Dia','Iliman Ndiaye','Nicolas Jackson','Krepin Diatta']],
    ['IRQ', 'Irak', 'I', 'AFC', null,
      ['Jalal Hassan','Rebin Sulaka','Hussein Ali','Akam Hashem','Merchas Doski','Zaid Tahseen','Manaf Younis','Zidane Iqbal','Amir Al-Ammari','Ibrahim Bavesh','Ali Jasim','Youssef Amyn','Aimar Sher','Marko Farji','Osama Rashid','Ali Al-Hamadi','Aymen Hussein','Mohanad Ali']],
    ['NOR', 'Noruega', 'I', 'UEFA', null,
      ['Orjan Nyland','Julian Ryerson','Leo Ostigård','Kristoffer Vassbakk Ajer','Marcus Holmgren Pedersen','David Møller Wolfe','Torbjørn Heggem','Morten Thorsby','Martin Ødegaard','Sander Berge','Andreas Schjelderup','Patrick Berg','Erling Haaland','Alexander Sørloth','Aron Dønnum','Jorgen Strand Larsen','Antonio Nusa','Oscar Bobb']],
    // ── GRUPO J ──────────────────────────────────────────────────────────────
    ['ARG', 'Argentina', 'J', 'CONMEBOL', 'champion',
      ['Emiliano Martinez','Nahuel Molina','Cristian Romero','Nicolas Otamendi','Nicolas Tagliafico','Leonardo Balerdi','Enzo Fernandez','Alexis Mac Allister','Rodrigo De Paul','Exequiel Palacios','Leandro Paredes','Nico Paz','Franco Mastantuono','Nico Gonzalez','Lionel Messi','Lautaro Martinez','Julian Alvarez','Giuliano Simeone']],
    ['ALG', 'Argelia', 'J', 'CAF', null,
      ['Alexis Guendouz','Ramy Bensebaini','Youcef Atal','Rayan Aït-Nouri','Mohamed Amine Tougai','Aïssa Mandi','Ismael Bennacer','Houssem Aquar','Hicham Boudaoui','Ramiz Zerrouki','Nabil Bentalab','Farés Chaibi','Riyad Mahrez','Said Benrahma','Anis Hadj Moussa','Amine Gouiri','Baghdad Bounedjah','Mohammed Amoura']],
    ['AUT', 'Austria', 'J', 'UEFA', null,
      ['Alexander Schlager','Patrick Pentz','David Alaba','Kevin Danso','Philipp Lienhart','Stefan Posch','Phillipp Mwene','Alexander Prass','Xaver Schlager','Marcel Sabitzer','Konrad Laimer','Florian Grillitsch','Nicolas Seiwald','Romano Schmid','Patrick Wimmer','Christoph Baumgartner','Michael Gregoritsch','Marko Arnautović']],
    ['JOR', 'Jordania', 'J', 'AFC', 'debut',
      ['Yazeed Abulaila','Ihsan Haddad','Mohammad Abu Hashish','Yazan Al-Arab','Abdallah Nasib','Saleem Obaid','Mohammad Abualnadi','Ibrahim Saadeh','Nizar Al-Rashdan','Noor Al-Rawabdeh','Mohannad Abu Taha','Amer Jamous','Musa Al-Taamari','Yazan Al-Naimat','Mahmoud Al-Mardi','Ali Olwan','Mohammad Abu Zrayq','Ibrahim Sabra']],
    // ── GRUPO K ──────────────────────────────────────────────────────────────
    ['POR', 'Portugal', 'K', 'UEFA', null,
      ['Diogo Costa','Jose Sa','Ruben Dias','João Cancelo','Diogo Dalot','Nuno Mendes','Gonçalo Inácio','Bernardo Silva','Bruno Fernandes','Ruben Neves','Vitinha','João Neves','Cristiano Ronaldo','Francisco Trincao','João Felix','Gonçalo Ramos','Pedro Neto','Rafael Leão']],
    ['COD', 'RD Congo', 'K', 'CAF', null,
      ['Lionel Mpasi','Aaron Wan-Bissaka','Axel Tuanzebe','Arthur Masuaku','Chancel Mbemba','Joris Kayembe','Charles Pickel','Ngal\'ayel Mukau','Edo Kayembe','Samuel Moutoussamy','Noah Sadiki','Théo Bongonda','Meschak Elia','Yoane Wissa','Brian Cipenga','Fiston Mayele','Cédric Bakambu','Nathanaël Mbuku']],
    ['UZB', 'Uzbekistán', 'K', 'AFC', 'debut',
      ['Utkir Yusupov','Farrukh Savfiev','Sherzod Nasrullaev','Umar Eshmurodov','Husniddin Aliqulov','Rustamjon Ashurmatov','Khojiakbar Alijonov','Abdukodir Khusanov','Odiljon Hamrobekov','Otabek Shukurov','Jamshid Iskanderov','Azizbek Turgunboev','Khojimat Erkinov','Eldor Shomurodov','Oston Urunov','Jaloliddin Masharipov','Igor Sergeev','Abbosbek Fayzullaev']],
    ['COL', 'Colombia', 'K', 'CONMEBOL', null,
      ['Camilo Vargas','David Ospina','Dávinson Sánchez','Yerry Mina','Daniel Munoz','Johan Mojica','Jhon Lucumí','Santiago Arias','Jefferson Lerma','Kevin Castaño','Richard Rios','James Rodriguez','Juan Fernando Quintero','Jorge Carrascal','Jon Arias','Jhon Cordova','Luis Suarez','Luis Diaz']],
    // ── GRUPO L ──────────────────────────────────────────────────────────────
    ['ENG', 'Inglaterra', 'L', 'UEFA', null,
      ['Jordan Pickford','John Stones','Marc Guéhi','Ezri Konsa','Trent Alexander-Arnold','Reece James','Dan Burn','Jordan Henderson','Declan Rice','Jude Bellingham','Cole Palmer','Morgan Rogers','Anthony Gordon','Phil Foden','Bukayo Saka','Harry Kane','Marcus Rashford','Ollie Watkins']],
    ['CRO', 'Croacia', 'L', 'UEFA', null,
      ['Dominik Livaković','Duje Caleta-Car','Josko Gvardiol','Josip Stanišić','Luka Vušković','Josip Sutalo','Kristijan Jakic','Luka Modrić','Mateo Kovacic','Martin Baturina','Lovro Majer','Mario Pasalic','Petar Sucic','Ivan Perišić','Marco Pasalic','Ante Budimir','Andrej Kramarić','Franjo Ivanovic']],
    ['GHA', 'Ghana', 'L', 'CAF', null,
      ['Lawrence Ati Zigi','Tariq Lamptey','Mohammed Salisu','Alidu Seidu','Alexander Djiku','Gideon Mensah','Caleb Yirenkyi','Abdul Issahaku Fatawu','Thomas Partey','Salis Abdul Samed','Kamaldeen Sulemana','Mohammed Kudus','Inaki Williams','Jordan Ayew','Andrew Ayew','Joseph Paintsil','Osman Bukari','Antoine Semenyo']],
    ['PAN', 'Panamá', 'L', 'CONCACAF', null,
      ['Orlando Mosquera','Luis Mejia','Fidel Escobar','Andres Andrade','Michael Amir Murillo','Eric Davis','Jose Cordoba','Cesar Blackman','Cristian Martinez','Aníbal Godoy','Adalberto Carrasquilla','Édgar Bárcenas','Carlos Harvey','Ismael Díaz','Jose Fajardo','Cecilio Waterman','Jose Luiz Rodriguez','Alberto Quintero']],
  ];

  function buildTeamStickers(team) {
    const [code, , , , , playerNames, opts] = team;
    const typoCodes = (opts && opts.typoCodes) || {};
    const out = [];
    // Position 1: Escudo (FOIL)
    out.push({
      code: typoCodes[1] || `${code}1`, idx: 1,
      name: `Team Logo - ${team[1]}`, kind: 'crest',
      foil: true, verified: true,
    });
    // Positions 2..12: 11 players (pre-team-photo)
    for (let i = 2; i <= 12; i++) {
      out.push({
        code: typoCodes[i] || `${code}${i}`, idx: i,
        name: playerNames[i - 2], kind: 'player',
        foil: false, verified: true,
      });
    }
    // Position 13: Team Photo
    out.push({
      code: typoCodes[13] || `${code}13`, idx: 13,
      name: `Team Photo - ${team[1]}`, kind: 'group',
      foil: false, verified: true,
    });
    // Positions 14..20: 7 more players
    for (let i = 14; i <= 20; i++) {
      out.push({
        code: typoCodes[i] || `${code}${i}`, idx: i,
        name: playerNames[i - 3], kind: 'player',
        foil: false, verified: true,
      });
    }
    return out;
  }

  function buildAlbum() {
    const sections = [];
    let stickerCount = 0;
    const allStickers = [];

    // 1. Intro
    {
      const items = INTRO_STICKERS.map((s, i) => ({
        ...s, id: `intro_${i}`, section: 'intro', team: null,
        kind: i === 0 ? 'intro' : 'intro', verified: true,
      }));
      items.forEach((s) => allStickers.push(s));
      sections.push({
        id: 'intro', name: 'Introducción', kind: 'intro',
        verified: true, count: items.length, items,
      });
      stickerCount += items.length;
    }

    // 2. Teams (in album order)
    const teams = TEAM_DATA.map((t, idx) => {
      const [code, name, group, confed, flag] = t;
      const items = buildTeamStickers(t).map((s) => ({
        ...s, id: `${code}_${s.idx}`, section: `team_${code}`, team: code,
      }));
      items.forEach((s) => allStickers.push(s));
      const sec = {
        id: `team_${code}`, name, kind: 'team',
        code, group, confed,
        host: flag === 'host', debut: flag === 'debut', champion: flag === 'champion',
        verified: true, count: 20, items, teamIdx: idx,
      };
      sections.push(sec);
      stickerCount += 20;
      return sec;
    });

    // 3. FIFA Museum (placed after teams per checklist order)
    {
      const items = MUSEUM_STICKERS.map((s, i) => ({
        ...s, id: `museum_${i}`, section: 'museum', team: null,
        kind: 'museum', verified: true,
      }));
      items.forEach((s) => allStickers.push(s));
      sections.push({
        id: 'museum', name: 'FIFA Museum', kind: 'museum',
        verified: true, count: items.length, items,
      });
      stickerCount += items.length;
    }

    // 4. Extras (placeholder, official structure not confirmed)
    sections.push({
      id: 'extras', name: 'Extra Stickers', kind: 'extras',
      verified: false, count: 0, items: [],
      note: 'Sección separada del set base. Sin numeración tradicional.',
    });

    return {
      total: 980,
      pages: 112,
      teamsCount: 48,
      generatedCount: stickerCount, // 9 + 48*20 + 11 = 980
      sections,
      teams,
      allStickers,
    };
  }

  // ---------- LocalStorage ----------
  const STORAGE_KEY = 'wc26_collection_v1';
  const ACTIVITY_KEY = 'wc26_activity_v1';
  const PREFS_KEY = 'wc26_prefs_v1';

  function loadCollection() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveCollection(c) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  }
  function loadActivity() {
    try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveActivity(a) {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(a.slice(0, 80)));
  }
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function savePrefs(p) {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  }

  // ---------- Stats ----------
  function statsFor(items, coll) {
    let got = 0, dupes = 0;
    items.forEach((s) => {
      const u = coll[s.id];
      if (u && u.have) got++;
      if (u && u.dupes) dupes += u.dupes;
    });
    return {
      total: items.length,
      got,
      missing: items.length - got,
      dupes,
      pct: items.length === 0 ? 0 : Math.round((got / items.length) * 100),
    };
  }

  global.AlbumData = {
    buildAlbum,
    loadCollection, saveCollection,
    loadActivity, saveActivity,
    loadPrefs, savePrefs,
    statsFor,
  };
})(window);
