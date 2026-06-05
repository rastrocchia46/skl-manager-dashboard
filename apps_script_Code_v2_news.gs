const SHEET_ID = "1j8yfmr1SDIQt_zt9y5UVF04QVkneR92HVPxA9uX8PU8";

const TEAM_TABS = [
  { id: "avreliana", sheet: "Strocchia", displayName: "AVRELIANA" },
  { id: "gisa_saviano", sheet: "Ciccone", displayName: "GISA SAVIANO" },
  { id: "tnt_legacy", sheet: "Napolitano/Tufano", displayName: "TNT LEGACY" },
  { id: "la_pasta_con_le_noci", sheet: "La Pasta/Nocerino", displayName: "LA PASTA CON LE NOCI" },
  { id: "rione_sant_erasmo", sheet: "Arianna/Buglione", displayName: "RIONE SANT. ERASMO" },
  { id: "fc_parco_s_giovanni", sheet: "Silvestri", displayName: "FC PARCO S. GIOVANNI" },
  { id: "tigers_saviano", sheet: "Manzo/Tamburro", displayName: "TIGERS SAVIANO" },
  { id: "hydra_saviano", sheet: "Allocca", displayName: "HYDRA SAVIANO" },
  { id: "ludopatykos", sheet: "Franzese", displayName: "LUDOPATYKOS" },
  { id: "fc_one_piece", sheet: "Annunziata", displayName: "FC ONE PIECE" }
];

const RULES = {
  maxFido: 150,
  minPlayers: 22,
  maxPlayers: 30,
  maxGoalkeepers: 4,
  stadiumMaintenance: {0:0,1:15,2:22,3:40,4:70,5:120,6:180,7:300,8:450},
  stadiumBonus: {0:0,1:0.5,2:1,3:1.5,4:2,5:2.5,6:3,7:3.5,8:4}
};

const NEWS_FEEDS = [
  "https://www.gazzetta.it/dynamic-feed/rss/section/Calcio/Serie-A.xml",
  "https://www.gazzetta.it/rss/serie-a.xml",
  "https://www.gazzetta.it/rss/calcio.xml"
];

function doGet(e) {
  const data = buildDashboardData();
  const output = JSON.stringify(data);
  const callback = e && e.parameter && e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${output})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

function buildDashboardData() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const riepilogo = parseRiepilogo(ss);

  const teams = TEAM_TABS.map(teamInfo => {
    const summary = riepilogo[teamInfo.id] || {};
    return parseTeamSheet(ss, teamInfo, summary);
  });

  return {
    updatedFrom: `Dati live dal Google Sheet · ${new Date().toLocaleString("it-IT")}`,
    teams,
    rules: RULES,
    news: getGazzettaNews()
  };
}

function getGazzettaNews() {
  for (const feedUrl of NEWS_FEEDS) {
    try {
      const response = UrlFetchApp.fetch(feedUrl, {
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          "User-Agent": "Mozilla/5.0 SKL-Dashboard"
        }
      });

      if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
        continue;
      }

      const xml = response.getContentText();
      const document = XmlService.parse(xml);
      const root = document.getRootElement();
      const channel = root.getChild("channel");
      if (!channel) continue;

      const items = channel.getChildren("item")
        .slice(0, 8)
        .map(item => {
          const title = textOf(item, "title");
          const description = cleanHtml(textOf(item, "description"));
          return {
            title: title,
            text: shorten(description, 135)
          };
        })
        .filter(item => item.title);

      if (items.length) return items;

    } catch (err) {
      console.warn(`Feed non leggibile: ${feedUrl}`, err);
    }
  }

  return [
    { title: "Gazzetta Serie A", text: "notizie non disponibili in questo momento" }
  ];
}

function textOf(xmlElement, childName) {
  const child = xmlElement.getChild(childName);
  return child ? child.getText() : "";
}

function cleanHtml(value) {
  return clean(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(value, maxLength) {
  const text = clean(value);
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "...";
}

function parseRiepilogo(ss) {
  const sheet = ss.getSheetByName("Riepilogo");
  if (!sheet) return {};

  const values = sheet.getDataRange().getDisplayValues();
  const result = {};

  let headerRow = -1;
  let squadraCol = -1;

  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < values[r].length; c++) {
      if (normalize(values[r][c]) === "SQUADRA") {
        headerRow = r;
        squadraCol = c;
        break;
      }
    }
    if (headerRow !== -1) break;
  }

  if (headerRow === -1 || squadraCol === -1) return {};

  const dirigenzaCol = squadraCol + 1;
  const stadioCol = squadraCol + 2;
  const calciatoriCol = squadraCol + 3;
  const fidoCol = squadraCol + 4;
  const saldoCol = squadraCol + 5;
  const sponsorCol = squadraCol + 6;

  for (let i = headerRow + 1; i < values.length; i++) {
    const r = values[i];
    const name = clean(r[squadraCol]);
    if (!name) continue;

    const teamInfo = TEAM_TABS.find(t => {
      return normalize(t.displayName) === normalize(name)
        || normalize(t.displayName).replace(/^FC /, "") === normalize(name)
        || normalize(name).replace(/^FC /, "") === normalize(t.displayName).replace(/^FC /, "");
    });

    if (!teamInfo) continue;

    result[teamInfo.id] = {
      id: teamInfo.id,
      name: teamInfo.displayName,
      management: r[dirigenzaCol] || "",
      stadiumLevel: num(r[stadioCol]) || 0,
      playersCountSummary: num(r[calciatoriCol]),
      fidoResidual: num(r[fidoCol]) || 0,
      saldo: num(r[saldoCol]) || 0,
      sponsor: r[sponsorCol] || ""
    };
  }

  return result;
}

function parseTeamSheet(ss, teamInfo, summary) {
  const sheet = ss.getSheetByName(teamInfo.sheet);

  if (!sheet) {
    return emptyTeam(teamInfo, summary);
  }

  const values = sheet.getDataRange().getDisplayValues();
  const top = values[1] || [];

  const team = {
    id: teamInfo.id,
    name: summary.name || teamInfo.displayName,
    management: summary.management || top[2] || "",
    stadiumLevel: valueOr(summary.stadiumLevel, 0),
    playersCountSummary: valueOr(summary.playersCountSummary, null),
    fidoResidual: valueOr(summary.fidoResidual, num(top[6]) || 0),
    saldo: valueOr(summary.saldo, num(top[5]) || 0),
    sponsor: summary.sponsor || "",
    sheetName: teamInfo.displayName,
    initialSaldo: num(top[4]),
    entrate: num(top[7]) || 0,
    stadiumIncome: num(top[8]) || 0,
    uscite: num(top[9]) || 0,
    stipendi: num(top[10]) || 0,
    sourceCsv: `Google Sheet - ${teamInfo.sheet}`,
    roster: [],
    market: []
  };

  const validRoles = ["Portiere", "Difensore", "Centrocampista", "Attaccante"];

  values.forEach(r => {
    const role = r[0];
    const playerName = r[1];

    if (validRoles.includes(role) && playerName) {
      team.roster.push({
        role,
        name: playerName,
        purchaseValue: num(r[3]),
        currentValue: num(r[4]),
        contractYears: num(r[5]),
        salary: num(r[6])
      });
    }

    const marketRow = {
      date: r[8] || "",
      type: r[9] || "",
      player: r[10] || "",
      otherTeam: r[11] || "",
      details: r[12] || "",
      amount: num(r[13])
    };

    const hasMarketData = Object.values(marketRow).some(v => v !== "" && v !== null);

    const isHeader =
      normalize(marketRow.date) === "DATA" ||
      normalize(marketRow.type).includes("TIPO OPERAZIONE");

    if (hasMarketData && !isHeader) {
      team.market.push(marketRow);
    }
  });

  team.roleCounts = {
    Portiere: team.roster.filter(p => p.role === "Portiere").length,
    Difensore: team.roster.filter(p => p.role === "Difensore").length,
    Centrocampista: team.roster.filter(p => p.role === "Centrocampista").length,
    Attaccante: team.roster.filter(p => p.role === "Attaccante").length
  };

  team.playersCountParsed = team.roster.length;

  return team;
}

function emptyTeam(teamInfo, summary) {
  return {
    id: teamInfo.id,
    name: summary.name || teamInfo.displayName,
    management: summary.management || "",
    stadiumLevel: summary.stadiumLevel || 0,
    playersCountSummary: summary.playersCountSummary || 0,
    fidoResidual: summary.fidoResidual || 0,
    saldo: summary.saldo || 0,
    sponsor: summary.sponsor || "",
    sheetName: teamInfo.displayName,
    initialSaldo: 0,
    entrate: 0,
    stadiumIncome: 0,
    uscite: 0,
    stipendi: 0,
    sourceCsv: `Google Sheet - ${teamInfo.sheet}`,
    roster: [],
    market: [],
    roleCounts: {
      Portiere: 0,
      Difensore: 0,
      Centrocampista: 0,
      Attaccante: 0
    },
    playersCountParsed: 0
  };
}

function clean(value) {
  return String(value || "").trim();
}

function normalize(value) {
  return clean(value).toUpperCase().replace(/\s+/g, " ");
}

function num(value) {
  const cleaned = clean(value)
    .replace(/\./g, "")
    .replace(",", ".");

  if (!cleaned || cleaned === "-") return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function valueOr(value, fallback) {
  return value === undefined || value === null ? fallback : value;
}
