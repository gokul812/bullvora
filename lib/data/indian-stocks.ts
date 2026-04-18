import { NSEStock } from "@/lib/types";

export const INDIAN_STOCKS: NSEStock[] = [
  // ── NIFTY 50 ────────────────────────────────────────────────────────────────
  { symbol: "RELIANCE",    name: "Reliance Industries",          yahooSymbol: "RELIANCE.NS",    sector: "Energy",                   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "TCS",         name: "Tata Consultancy Services",    yahooSymbol: "TCS.NS",         sector: "Information Technology",   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "HDFCBANK",    name: "HDFC Bank",                    yahooSymbol: "HDFCBANK.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "BHARTIARTL",  name: "Bharti Airtel",                yahooSymbol: "BHARTIARTL.NS",  sector: "Communication Services",   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "ICICIBANK",   name: "ICICI Bank",                   yahooSymbol: "ICICIBANK.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "INFOSYS",     name: "Infosys",                      yahooSymbol: "INFY.NS",        sector: "Information Technology",   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "SBIN",        name: "State Bank of India",          yahooSymbol: "SBIN.NS",        sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "HINDUNILVR",  name: "Hindustan Unilever",           yahooSymbol: "HINDUNILVR.NS",  sector: "FMCG",                     exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "ITC",         name: "ITC Limited",                  yahooSymbol: "ITC.NS",         sector: "FMCG",                     exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "LT",          name: "Larsen & Toubro",              yahooSymbol: "LT.NS",          sector: "Capital Goods",            exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "BAJFINANCE",  name: "Bajaj Finance",                yahooSymbol: "BAJFINANCE.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "HCLTECH",     name: "HCL Technologies",             yahooSymbol: "HCLTECH.NS",     sector: "Information Technology",   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "MARUTI",      name: "Maruti Suzuki",                yahooSymbol: "MARUTI.NS",      sector: "Automobile",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "SUNPHARMA",   name: "Sun Pharmaceutical",           yahooSymbol: "SUNPHARMA.NS",   sector: "Healthcare",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "KOTAKBANK",   name: "Kotak Mahindra Bank",          yahooSymbol: "KOTAKBANK.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "TITAN",       name: "Titan Company",                yahooSymbol: "TITAN.NS",       sector: "Consumer Durables",        exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "ADANIENT",    name: "Adani Enterprises",            yahooSymbol: "ADANIENT.NS",    sector: "Diversified",              exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "ONGC",        name: "ONGC",                         yahooSymbol: "ONGC.NS",        sector: "Energy",                   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "NTPC",        name: "NTPC",                         yahooSymbol: "NTPC.NS",        sector: "Power",                    exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "POWERGRID",   name: "Power Grid Corp",              yahooSymbol: "POWERGRID.NS",   sector: "Power",                    exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "AXISBANK",    name: "Axis Bank",                    yahooSymbol: "AXISBANK.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "ASIANPAINT",  name: "Asian Paints",                 yahooSymbol: "ASIANPAINT.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "ULTRACEMCO",  name: "UltraTech Cement",             yahooSymbol: "ULTRACEMCO.NS",  sector: "Cement",                   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "WIPRO",       name: "Wipro",                        yahooSymbol: "WIPRO.NS",       sector: "Information Technology",   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "NESTLEIND",   name: "Nestle India",                 yahooSymbol: "NESTLEIND.NS",   sector: "FMCG",                     exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "JSWSTEEL",    name: "JSW Steel",                    yahooSymbol: "JSWSTEEL.NS",    sector: "Metals & Mining",          exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "TATAMOTORS",  name: "Tata Motors",                  yahooSymbol: "TATAMOTORS.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "TATASTEEL",   name: "Tata Steel",                   yahooSymbol: "TATASTEEL.NS",   sector: "Metals & Mining",          exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "TECHM",       name: "Tech Mahindra",                yahooSymbol: "TECHM.NS",       sector: "Information Technology",   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "BAJAJ-AUTO",  name: "Bajaj Auto",                   yahooSymbol: "BAJAJ-AUTO.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "INDUSINDBK",  name: "IndusInd Bank",                yahooSymbol: "INDUSINDBK.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "GRASIM",      name: "Grasim Industries",            yahooSymbol: "GRASIM.NS",      sector: "Diversified",              exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "APOLLOHOSP",  name: "Apollo Hospitals",             yahooSymbol: "APOLLOHOSP.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "CIPLA",       name: "Cipla",                        yahooSymbol: "CIPLA.NS",       sector: "Healthcare",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "DRREDDY",     name: "Dr Reddys Lab",                yahooSymbol: "DRREDDY.NS",     sector: "Healthcare",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "EICHERMOT",   name: "Eicher Motors",                yahooSymbol: "EICHERMOT.NS",   sector: "Automobile",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "HEROMOTOCO",  name: "Hero MotoCorp",                yahooSymbol: "HEROMOTOCO.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "DIVISLAB",    name: "Divis Laboratories",           yahooSymbol: "DIVISLAB.NS",    sector: "Healthcare",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "BAJAJFINSV",  name: "Bajaj Finserv",                yahooSymbol: "BAJAJFINSV.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "SBILIFE",     name: "SBI Life Insurance",           yahooSymbol: "SBILIFE.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "BRITANNIA",   name: "Britannia Industries",         yahooSymbol: "BRITANNIA.NS",   sector: "FMCG",                     exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "TATACONSUM",  name: "Tata Consumer Products",       yahooSymbol: "TATACONSUM.NS",  sector: "FMCG",                     exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "ADANIPORTS",  name: "Adani Ports",                  yahooSymbol: "ADANIPORTS.NS",  sector: "Infrastructure",           exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "COALINDIA",   name: "Coal India",                   yahooSymbol: "COALINDIA.NS",   sector: "Metals & Mining",          exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "BPCL",        name: "BPCL",                         yahooSymbol: "BPCL.NS",        sector: "Energy",                   exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "HDFCLIFE",    name: "HDFC Life Insurance",          yahooSymbol: "HDFCLIFE.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "M&M",         name: "Mahindra & Mahindra",          yahooSymbol: "M%26M.NS",       sector: "Automobile",               exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "SHRIRAMFIN",  name: "Shriram Finance",              yahooSymbol: "SHRIRAMFIN.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "HINDALCO",    name: "Hindalco Industries",          yahooSymbol: "HINDALCO.NS",    sector: "Metals & Mining",          exchange: "NSE", isNifty50: true,  isNifty500: true  },

  // ── NIFTY MIDCAP 150 / HIGH-CONVICTION MID-CAPS ─────────────────────────────
  // Information Technology
  { symbol: "LTIM",        name: "LTIMindtree",                  yahooSymbol: "LTIM.NS",        sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PERSISTENT",  name: "Persistent Systems",           yahooSymbol: "PERSISTENT.NS",  sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MPHASIS",     name: "Mphasis",                      yahooSymbol: "MPHASIS.NS",     sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "COFORGE",     name: "Coforge",                      yahooSymbol: "COFORGE.NS",     sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "KPITTECH",    name: "KPIT Technologies",            yahooSymbol: "KPITTECH.NS",    sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TATAELXSI",   name: "Tata Elxsi",                   yahooSymbol: "TATAELXSI.NS",   sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TANLA",       name: "Tanla Platforms",              yahooSymbol: "TANLA.NS",       sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "HAPPSTMNDS",  name: "Happiest Minds",               yahooSymbol: "HAPPSTMNDS.NS",  sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "OFSS",        name: "Oracle Financial Services",    yahooSymbol: "OFSS.NS",        sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MASTEK",      name: "Mastek",                       yahooSymbol: "MASTEK.NS",      sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ZENSARTECH",  name: "Zensar Technologies",          yahooSymbol: "ZENSARTECH.NS",  sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "CYIENT",      name: "Cyient",                       yahooSymbol: "CYIENT.NS",      sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },

  // Financial Services
  { symbol: "BANKBARODA",  name: "Bank of Baroda",               yahooSymbol: "BANKBARODA.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CANBK",       name: "Canara Bank",                  yahooSymbol: "CANBK.NS",       sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PNB",         name: "Punjab National Bank",         yahooSymbol: "PNB.NS",         sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "FEDERALBNK",  name: "Federal Bank",                 yahooSymbol: "FEDERALBNK.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "IDFCFIRSTB",  name: "IDFC First Bank",              yahooSymbol: "IDFCFIRSTB.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BANDHANBNK",  name: "Bandhan Bank",                 yahooSymbol: "BANDHANBNK.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "YESBANK",     name: "Yes Bank",                     yahooSymbol: "YESBANK.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RBLBANK",     name: "RBL Bank",                     yahooSymbol: "RBLBANK.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "INDIANB",     name: "Indian Bank",                  yahooSymbol: "INDIANB.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "UNIONBANK",   name: "Union Bank of India",          yahooSymbol: "UNIONBANK.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MUTHOOTFIN",  name: "Muthoot Finance",              yahooSymbol: "MUTHOOTFIN.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CHOLAFIN",    name: "Cholamandalam Investment",     yahooSymbol: "CHOLAFIN.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MANAPPURAM",  name: "Manappuram Finance",           yahooSymbol: "MANAPPURAM.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RECLTD",      name: "REC Limited",                  yahooSymbol: "RECLTD.NS",      sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PFC",         name: "Power Finance Corp",           yahooSymbol: "PFC.NS",         sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "IRFC",        name: "Indian Railway Finance Corp",  yahooSymbol: "IRFC.NS",        sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HDFCAMC",     name: "HDFC Asset Management",        yahooSymbol: "HDFCAMC.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NIPPONLIFE",  name: "Nippon Life India AMC",        yahooSymbol: "NIPPONLIFE.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ICICIGI",     name: "ICICI Lombard General Ins",    yahooSymbol: "ICICIGI.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NIACL",       name: "New India Assurance",          yahooSymbol: "NIACL.NS",       sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PAYTM",       name: "One 97 Communications",        yahooSymbol: "PAYTM.NS",       sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "POLICYBZR",   name: "PB Fintech (PolicyBazaar)",    yahooSymbol: "POLICYBZR.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SUNDARMFIN",  name: "Sundaram Finance",             yahooSymbol: "SUNDARMFIN.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AAVAS",       name: "Aavas Financiers",             yahooSymbol: "AAVAS.NS",       sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "HOMEFIRST",   name: "Home First Finance",           yahooSymbol: "HOMEFIRST.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },

  // Energy & Oil
  { symbol: "IOC",         name: "Indian Oil Corporation",       yahooSymbol: "IOC.NS",         sector: "Energy",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HINDPETRO",   name: "HPCL",                         yahooSymbol: "HINDPETRO.NS",   sector: "Energy",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "OIL",         name: "Oil India",                    yahooSymbol: "OIL.NS",         sector: "Energy",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PETRONET",    name: "Petronet LNG",                 yahooSymbol: "PETRONET.NS",    sector: "Energy",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GAIL",        name: "GAIL India",                   yahooSymbol: "GAIL.NS",        sector: "Energy",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CASTROLIND",  name: "Castrol India",                yahooSymbol: "CASTROLIND.NS",  sector: "Energy",                   exchange: "NSE", isNifty50: false, isNifty500: false },

  // Power
  { symbol: "TATAPOWER",   name: "Tata Power",                   yahooSymbol: "TATAPOWER.NS",   sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ADANIGREEN",  name: "Adani Green Energy",           yahooSymbol: "ADANIGREEN.NS",  sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SUZLON",      name: "Suzlon Energy",                yahooSymbol: "SUZLON.NS",      sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NHPC",        name: "NHPC",                         yahooSymbol: "NHPC.NS",        sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SJVN",        name: "SJVN",                         yahooSymbol: "SJVN.NS",        sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TORNTPOWER",  name: "Torrent Power",                yahooSymbol: "TORNTPOWER.NS",  sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CESC",        name: "CESC",                         yahooSymbol: "CESC.NS",        sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },

  // Metals & Mining
  { symbol: "VEDL",        name: "Vedanta",                      yahooSymbol: "VEDL.NS",        sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NMDC",        name: "NMDC",                         yahooSymbol: "NMDC.NS",        sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HINDZINC",    name: "Hindustan Zinc",               yahooSymbol: "HINDZINC.NS",    sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NATIONALUM",  name: "National Aluminium",           yahooSymbol: "NATIONALUM.NS",  sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SAIL",        name: "Steel Authority of India",     yahooSymbol: "SAIL.NS",        sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RATNAMANI",   name: "Ratnamani Metals",             yahooSymbol: "RATNAMANI.NS",   sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "WELCORP",     name: "Welspun Corp",                 yahooSymbol: "WELCORP.NS",     sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "APL",         name: "APL Apollo Tubes",             yahooSymbol: "APLAPOLLO.NS",   sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: true  },

  // Capital Goods
  { symbol: "BEL",         name: "Bharat Electronics",           yahooSymbol: "BEL.NS",         sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HAL",         name: "Hindustan Aeronautics",        yahooSymbol: "HAL.NS",         sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BHEL",        name: "Bharat Heavy Electricals",     yahooSymbol: "BHEL.NS",        sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ABB",         name: "ABB India",                    yahooSymbol: "ABB.NS",         sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SIEMENS",     name: "Siemens India",                yahooSymbol: "SIEMENS.NS",     sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CUMMINSIND",  name: "Cummins India",                yahooSymbol: "CUMMINSIND.NS",  sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "THERMAX",     name: "Thermax",                      yahooSymbol: "THERMAX.NS",     sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GRINDWELL",   name: "Grindwell Norton",             yahooSymbol: "GRINDWELL.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ELGIEQUIP",   name: "Elgi Equipments",              yahooSymbol: "ELGIEQUIP.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "KAYNES",      name: "Kaynes Technology",            yahooSymbol: "KAYNES.NS",      sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AIAENG",      name: "AIA Engineering",              yahooSymbol: "AIAENG.NS",      sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TIINDIA",     name: "Tube Investments",             yahooSymbol: "TIINDIA.NS",     sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "COCHINSHIP",  name: "Cochin Shipyard",              yahooSymbol: "COCHINSHIP.NS",  sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MAZDOCK",     name: "Mazagon Dock",                 yahooSymbol: "MAZDOCK.NS",     sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GRSE",        name: "Garden Reach Shipbuilders",    yahooSymbol: "GRSE.NS",        sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },

  // Automobile
  { symbol: "TVSMOTOR",    name: "TVS Motor Company",            yahooSymbol: "TVSMOTOR.NS",    sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ASHOKLEY",    name: "Ashok Leyland",                yahooSymbol: "ASHOKLEY.NS",    sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MRF",         name: "MRF",                          yahooSymbol: "MRF.NS",         sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BALKRISIND",  name: "Balkrishna Industries",        yahooSymbol: "BALKRISIND.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BOSCH",       name: "Bosch",                        yahooSymbol: "BOSCH.NS",       sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MOTHERSON",   name: "Samvardhana Motherson",        yahooSymbol: "MOTHERSON.NS",   sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "APOLLOTYRE",  name: "Apollo Tyres",                 yahooSymbol: "APOLLOTYRE.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CEATLTD",     name: "CEAT",                         yahooSymbol: "CEATLTD.NS",     sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SUNDRMFAST",  name: "Sundram Fasteners",            yahooSymbol: "SUNDRMFAST.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "EXIDEIND",    name: "Exide Industries",             yahooSymbol: "EXIDEIND.NS",    sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AMARAJABAT",  name: "Amara Raja Energy",            yahooSymbol: "AMARAJABAT.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: true  },

  // Healthcare & Pharma
  { symbol: "LUPIN",       name: "Lupin",                        yahooSymbol: "LUPIN.NS",       sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AUROPHARMA",  name: "Aurobindo Pharma",             yahooSymbol: "AUROPHARMA.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BIOCON",      name: "Biocon",                       yahooSymbol: "BIOCON.NS",      sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ALKEM",       name: "Alkem Laboratories",           yahooSymbol: "ALKEM.NS",       sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TORNTPHARM",  name: "Torrent Pharmaceuticals",      yahooSymbol: "TORNTPHARM.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "IPCALAB",     name: "IPCA Laboratories",            yahooSymbol: "IPCALAB.NS",     sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MANKIND",     name: "Mankind Pharma",               yahooSymbol: "MANKIND.NS",     sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MAXHEALTH",   name: "Max Healthcare",               yahooSymbol: "MAXHEALTH.NS",   sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "FORTIS",      name: "Fortis Healthcare",            yahooSymbol: "FORTIS.NS",      sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "LALPATHLAB",  name: "Dr Lal PathLabs",              yahooSymbol: "LALPATHLAB.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "METROPOLIS",  name: "Metropolis Healthcare",        yahooSymbol: "METROPOLIS.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ABBOTINDIA",  name: "Abbott India",                 yahooSymbol: "ABBOTINDIA.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PFIZER",      name: "Pfizer India",                 yahooSymbol: "PFIZER.NS",      sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "GLAXO",       name: "GlaxoSmithKline Pharma",       yahooSymbol: "GLAXO.NS",       sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "STAR",        name: "Star Health Insurance",        yahooSymbol: "STAR.NS",        sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },

  // FMCG
  { symbol: "GODREJCP",    name: "Godrej Consumer Products",     yahooSymbol: "GODREJCP.NS",    sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "DABUR",       name: "Dabur India",                  yahooSymbol: "DABUR.NS",       sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MARICO",      name: "Marico",                       yahooSymbol: "MARICO.NS",      sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "COLPAL",      name: "Colgate-Palmolive",            yahooSymbol: "COLPAL.NS",      sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MCDOWELL-N",  name: "United Spirits",               yahooSymbol: "MCDOWELL-N.NS",  sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RADICO",      name: "Radico Khaitan",               yahooSymbol: "RADICO.NS",      sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "VBL",         name: "Varun Beverages",              yahooSymbol: "VBL.NS",         sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "EMAMILTD",    name: "Emami",                        yahooSymbol: "EMAMILTD.NS",    sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HATSUN",      name: "Hatsun Agro Products",         yahooSymbol: "HATSUN.NS",      sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: false },

  // Consumer Durables
  { symbol: "DIXON",       name: "Dixon Technologies",           yahooSymbol: "DIXON.NS",       sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HAVELLS",     name: "Havells India",                yahooSymbol: "HAVELLS.NS",     sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BERGEPAINT",  name: "Berger Paints",                yahooSymbol: "BERGEPAINT.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "VOLTAS",      name: "Voltas",                       yahooSymbol: "VOLTAS.NS",      sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AMBER",       name: "Amber Enterprises",            yahooSymbol: "AMBER.NS",       sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BLUESTARCO",  name: "Blue Star",                    yahooSymbol: "BLUESTARCO.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CROMPTON",    name: "Crompton Greaves Consumer",    yahooSymbol: "CROMPTON.NS",    sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ORIENTELEC",  name: "Orient Electric",              yahooSymbol: "ORIENTELEC.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "KAJARIACER",  name: "Kajaria Ceramics",             yahooSymbol: "KAJARIACER.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CENTURYPLY",  name: "Century Plyboards",            yahooSymbol: "CENTURYPLY.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GREENPANEL",  name: "Greenpanel Industries",        yahooSymbol: "GREENPANEL.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "POLYCAB",     name: "Polycab India",                yahooSymbol: "POLYCAB.NS",     sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "KEI",         name: "KEI Industries",               yahooSymbol: "KEI.NS",         sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "FINOLEX",     name: "Finolex Cables",               yahooSymbol: "FINOLEXCAB.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },

  // Consumer Services
  { symbol: "ZOMATO",      name: "Zomato",                       yahooSymbol: "ZOMATO.NS",      sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NYKAA",       name: "FSN E-Commerce (Nykaa)",       yahooSymbol: "NYKAA.NS",       sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "IRCTC",       name: "IRCTC",                        yahooSymbol: "IRCTC.NS",       sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "JUBLFOOD",    name: "Jubilant FoodWorks",           yahooSymbol: "JUBLFOOD.NS",    sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "DEVYANI",     name: "Devyani International",        yahooSymbol: "DEVYANI.NS",     sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "WESTLIFE",    name: "Westlife Foodworld",           yahooSymbol: "WESTLIFE.NS",    sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "INDIAMART",   name: "IndiaMART InterMESH",          yahooSymbol: "INDIAMART.NS",   sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NAUKRI",      name: "Info Edge (Naukri)",           yahooSymbol: "NAUKRI.NS",      sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "INDIGOPNTS",  name: "Indigo Paints",                yahooSymbol: "INDIGOPNTS.NS",  sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },

  // Retail
  { symbol: "DMART",       name: "Avenue Supermarts (DMart)",    yahooSymbol: "DMART.NS",       sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TRENT",       name: "Trent (Westside / Zudio)",     yahooSymbol: "TRENT.NS",       sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "VMART",       name: "V-Mart Retail",                yahooSymbol: "VMART.NS",       sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SHOPERSTOP",  name: "Shoppers Stop",                yahooSymbol: "SHOPERSTOP.NS",  sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ABFRL",       name: "Aditya Birla Fashion",         yahooSymbol: "ABFRL.NS",       sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MANYAVAR",    name: "Vedant Fashions (Manyavar)",   yahooSymbol: "MANYAVAR.NS",    sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CAMPUS",      name: "Campus Activewear",            yahooSymbol: "CAMPUS.NS",      sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: false },

  // Chemicals
  { symbol: "PIDILITIND",  name: "Pidilite Industries",          yahooSymbol: "PIDILITIND.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SRF",         name: "SRF",                          yahooSymbol: "SRF.NS",         sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AARTI",       name: "Aarti Industries",             yahooSymbol: "AARTI.NS",       sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "DEEPAKNITRITE", name: "Deepak Nitrite",             yahooSymbol: "DEEPAKNITRITE.NS", sector: "Chemicals",              exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "VINATIORG",   name: "Vinati Organics",              yahooSymbol: "VINATIORG.NS",   sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NAVINFLUOR",  name: "Navin Fluorine",               yahooSymbol: "NAVINFLUOR.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CLEAN",       name: "Clean Science & Technology",   yahooSymbol: "CLEAN.NS",       sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "GALAXYSURF",  name: "Galaxy Surfactants",           yahooSymbol: "GALAXYSURF.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "FINEORG",     name: "Fine Organic Industries",      yahooSymbol: "FINEORG.NS",     sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "NOCIL",       name: "NOCIL",                        yahooSymbol: "NOCIL.NS",       sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "PCBL",        name: "PCBL",                         yahooSymbol: "PCBL.NS",        sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },

  // Cement
  { symbol: "ACC",         name: "ACC",                          yahooSymbol: "ACC.NS",         sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AMBUJACEM",   name: "Ambuja Cements",               yahooSymbol: "AMBUJACEM.NS",   sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SHREECEM",    name: "Shree Cement",                 yahooSymbol: "SHREECEM.NS",    sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RAMCOCEM",    name: "The Ramco Cements",            yahooSymbol: "RAMCOCEM.NS",    sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "JKCEMENT",    name: "JK Cement",                    yahooSymbol: "JKCEMENT.NS",    sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "DALMIACEM",   name: "Dalmia Bharat",                yahooSymbol: "DALMIACEM.NS",   sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HEIDELBERG",  name: "Heidelberg Cement India",      yahooSymbol: "HEIDELBERG.NS",  sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BIRLACORPN",  name: "Birla Corporation",            yahooSymbol: "BIRLACORPN.NS",  sector: "Cement",                   exchange: "NSE", isNifty50: false, isNifty500: false },

  // Infrastructure & Real Estate
  { symbol: "CONCOR",      name: "Container Corp of India",      yahooSymbol: "CONCOR.NS",      sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "DLF",         name: "DLF",                          yahooSymbol: "DLF.NS",         sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GODREJPROP",  name: "Godrej Properties",            yahooSymbol: "GODREJPROP.NS",  sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "OBEROIRLTY",  name: "Oberoi Realty",                yahooSymbol: "OBEROIRLTY.NS",  sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PRESTIGE",    name: "Prestige Estates",             yahooSymbol: "PRESTIGE.NS",    sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BRIGADE",     name: "Brigade Enterprises",          yahooSymbol: "BRIGADE.NS",     sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PHOENIXLTD",  name: "The Phoenix Mills",            yahooSymbol: "PHOENIXLTD.NS",  sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SOBHA",       name: "Sobha",                        yahooSymbol: "SOBHA.NS",       sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "MAHINDCIE",   name: "Mahindra CIE Automotive",      yahooSymbol: "MAHINDCIE.NS",   sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "IRB",         name: "IRB Infrastructure",           yahooSymbol: "IRB.NS",         sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "KNR",         name: "KNR Constructions",            yahooSymbol: "KNRCON.NS",      sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },

  // Communication Services
  { symbol: "IDEA",        name: "Vodafone Idea",                yahooSymbol: "IDEA.NS",        sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HFCL",        name: "HFCL",                         yahooSymbol: "HFCL.NS",        sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TATACOMM",    name: "Tata Communications",          yahooSymbol: "TATACOMM.NS",    sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AFFLE",       name: "Affle India",                  yahooSymbol: "AFFLE.NS",       sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: true  },

  // Diversified
  { symbol: "ADANITRANS",  name: "Adani Total Gas",              yahooSymbol: "ATGL.NS",        sector: "Diversified",              exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ADANIWILMAR", name: "Adani Wilmar",                 yahooSymbol: "AWL.NS",         sector: "Diversified",              exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GODREJIND",   name: "Godrej Industries",            yahooSymbol: "GODREJIND.NS",   sector: "Diversified",              exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "3MINDIA",     name: "3M India",                     yahooSymbol: "3MINDIA.NS",     sector: "Diversified",              exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── POWER (additional) ──────────────────────────────────────────────────────
  { symbol: "RPOWER",      name: "Reliance Power",               yahooSymbol: "RPOWER.NS",      sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ADANIPOWER",  name: "Adani Power",                  yahooSymbol: "ADANIPOWER.NS",  sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "JSWENERGY",   name: "JSW Energy",                   yahooSymbol: "JSWENERGY.NS",   sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ADANITRANS2", name: "Adani Transmission",           yahooSymbol: "ADANITRANS.NS",  sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "INDIAGRID",   name: "IndiGrid InvIT",               yahooSymbol: "INDIGRID.NS",    sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "GEPIL",       name: "GE Power India",               yahooSymbol: "GEPIL.NS",       sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "KEC",         name: "KEC International",            yahooSymbol: "KEC.NS",         sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── AVIATION ────────────────────────────────────────────────────────────────
  { symbol: "INDIGO",      name: "InterGlobe Aviation (IndiGo)", yahooSymbol: "INDIGO.NS",      sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SPICEJET",    name: "SpiceJet",                     yahooSymbol: "SPICEJET.NS",    sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── FINANCIAL SERVICES (additional) ─────────────────────────────────────────
  { symbol: "LICI",        name: "LIC India",                    yahooSymbol: "LICI.NS",        sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ANGELONE",    name: "Angel One",                    yahooSymbol: "ANGELONE.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ABSLAMC",     name: "Aditya Birla Sun Life AMC",    yahooSymbol: "ABSLAMC.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "UTIAMC",      name: "UTI Asset Management",         yahooSymbol: "UTIAMC.NS",      sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MFSL",        name: "Max Financial Services",       yahooSymbol: "MFSL.NS",        sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "LICHSGFIN",   name: "LIC Housing Finance",          yahooSymbol: "LICHSGFIN.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CANFINHOME",  name: "Can Fin Homes",                yahooSymbol: "CANFINHOME.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PNBHOUSING",  name: "PNB Housing Finance",          yahooSymbol: "PNBHOUSING.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "HUDCO",       name: "HUDCO",                        yahooSymbol: "HUDCO.NS",       sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "INFIBEAM",    name: "Infibeam Avenues",             yahooSymbol: "INFIBEAM.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "CREDITACC",   name: "CreditAccess Grameen",         yahooSymbol: "CREDITACC.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "UJJIVANSFB",  name: "Ujjivan Small Finance Bank",   yahooSymbol: "UJJIVANSFB.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "EQUITASBNK",  name: "Equitas Small Finance Bank",   yahooSymbol: "EQUITASBNK.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ESAFSFB",     name: "ESAF Small Finance Bank",      yahooSymbol: "ESAFSFB.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ZERODHABNK",  name: "IIFL Finance",                 yahooSymbol: "IIFL.NS",        sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MOTILALOFS",  name: "Motilal Oswal Financial",      yahooSymbol: "MOTILALOFS.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "5PAISA",      name: "5Paisa Capital",               yahooSymbol: "5PAISA.NS",      sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── HEALTHCARE (additional) ──────────────────────────────────────────────────
  { symbol: "ZYDUSLIFE",   name: "Zydus Lifesciences",           yahooSymbol: "ZYDUSLIFE.NS",   sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GRANULES",    name: "Granules India",               yahooSymbol: "GRANULES.NS",    sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SUVEN",       name: "Suven Pharmaceuticals",        yahooSymbol: "SUVENPHAR.NS",   sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ERIS",        name: "Eris Lifesciences",            yahooSymbol: "ERIS.NS",        sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "JBCHEPHARM",  name: "JB Chemicals & Pharma",        yahooSymbol: "JBCHEPHARM.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GLENMARK",    name: "Glenmark Pharmaceuticals",     yahooSymbol: "GLENMARK.NS",    sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NATCOPHARM",  name: "Natco Pharma",                 yahooSymbol: "NATCOPHARM.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "LAURUSLABS",  name: "Laurus Labs",                  yahooSymbol: "LAURUSLABS.NS",  sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PPLPHARMA",   name: "Piramal Pharma",               yahooSymbol: "PPLPHARMA.NS",   sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── CONSUMER / FMCG (additional) ────────────────────────────────────────────
  { symbol: "BATAINDIA",   name: "Bata India",                   yahooSymbol: "BATAINDIA.NS",   sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "PAGEIND",     name: "Page Industries (Jockey)",     yahooSymbol: "PAGEIND.NS",     sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RELAXO",      name: "Relaxo Footwears",             yahooSymbol: "RELAXO.NS",      sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "KANSAINER",   name: "Kansai Nerolac Paints",        yahooSymbol: "KANSAINER.NS",   sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "JYOTHYLAB",   name: "Jyothy Labs",                  yahooSymbol: "JYOTHYLAB.NS",   sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BAJAJCON",    name: "Bajaj Consumer Care",          yahooSymbol: "BAJAJCON.NS",    sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "HONASA",      name: "Honasa Consumer (Mamaearth)",  yahooSymbol: "HONASA.NS",      sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ZYDUSWELL",   name: "Zydus Wellness",               yahooSymbol: "ZYDUSWELL.NS",   sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SULA",        name: "Sula Vineyards",               yahooSymbol: "SULA.NS",        sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BALRAMCHIN",  name: "Balrampur Chini Mills",        yahooSymbol: "BALRAMCHIN.NS",  sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TRIVENI",     name: "Triveni Engineering",          yahooSymbol: "TRIVENI.NS",     sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── CHEMICALS (additional) ───────────────────────────────────────────────────
  { symbol: "PIIND",       name: "PI Industries",                yahooSymbol: "PIIND.NS",       sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "UPL",         name: "UPL",                          yahooSymbol: "UPL.NS",         sector: "Chemicals",                exchange: "NSE", isNifty50: true,  isNifty500: true  },
  { symbol: "RALLIS",      name: "Rallis India",                 yahooSymbol: "RALLIS.NS",      sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "TATACHEM",    name: "Tata Chemicals",               yahooSymbol: "TATACHEM.NS",    sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GHCL",        name: "GHCL",                         yahooSymbol: "GHCL.NS",        sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "FLUOROCHEM",  name: "Gujarat Fluorochemicals",      yahooSymbol: "FLUOROCHEM.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ANURAS",      name: "Anupam Rasayan",               yahooSymbol: "ANURAS.NS",      sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BASF",        name: "BASF India",                   yahooSymbol: "BASF.NS",        sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── CAPITAL GOODS (additional) ───────────────────────────────────────────────
  { symbol: "LAXMIMACH",   name: "Lakshmi Machine Works",        yahooSymbol: "LAXMIMACH.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "PRAJIND",     name: "Praj Industries",              yahooSymbol: "PRAJIND.NS",     sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CRAFTSMAN",   name: "Craftsman Automation",         yahooSymbol: "CRAFTSMAN.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ENDURANCE",   name: "Endurance Technologies",       yahooSymbol: "ENDURANCE.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RVNL",        name: "Rail Vikas Nigam",             yahooSymbol: "RVNL.NS",        sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "IRCON",       name: "IRCON International",          yahooSymbol: "IRCON.NS",       sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "RAILTEL",     name: "RailTel Corporation",          yahooSymbol: "RAILTEL.NS",     sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "NBCC",        name: "NBCC India",                   yahooSymbol: "NBCC.NS",        sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "VGUARD",      name: "V-Guard Industries",           yahooSymbol: "VGUARD.NS",      sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── MEDIA / ENTERTAINMENT ────────────────────────────────────────────────────
  { symbol: "ZEEL",        name: "Zee Entertainment",            yahooSymbol: "ZEEL.NS",        sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SUNTV",       name: "Sun TV Network",               yahooSymbol: "SUNTV.NS",       sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "NETWORK18",   name: "Network18 Media",              yahooSymbol: "NETWORK18.NS",   sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "NAZARA",      name: "Nazara Technologies",          yahooSymbol: "NAZARA.NS",      sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "DELTACORP",   name: "Delta Corp",                   yahooSymbol: "DELTACORP.NS",   sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── INFRASTRUCTURE / LOGISTICS ──────────────────────────────────────────────
  { symbol: "GMRINFRA",    name: "GMR Airports Infrastructure",  yahooSymbol: "GMRINFRA.NS",    sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MINDSPACE",   name: "Mindspace Business Parks REIT",yahooSymbol: "MINDSPACE.NS",   sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "DELHIVERY",   name: "Delhivery",                    yahooSymbol: "DELHIVERY.NS",   sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BLUEDART",    name: "Blue Dart Express",            yahooSymbol: "BLUEDART.NS",    sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GICRE",       name: "General Insurance Corp",       yahooSymbol: "GICRE.NS",       sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── AGRI / SPECIALTY ─────────────────────────────────────────────────────────
  { symbol: "COROMANDEL",  name: "Coromandel International",     yahooSymbol: "COROMANDEL.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CHAMBLFERT",  name: "Chambal Fertilisers",          yahooSymbol: "CHAMBLFERT.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GNFC",        name: "Gujarat Narmada Valley Fert",  yahooSymbol: "GNFC.NS",        sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "GSFC",        name: "Gujarat State Fertilizers",    yahooSymbol: "GSFC.NS",        sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── FINANCIAL INFRA / EXCHANGES ─────────────────────────────────────────────
  { symbol: "BSE",         name: "BSE (Bombay Stock Exchange)",  yahooSymbol: "BSE.NS",         sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "MCX",         name: "Multi Commodity Exchange",     yahooSymbol: "MCX.NS",         sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CDSL",        name: "Central Depository Services",  yahooSymbol: "CDSL.NS",        sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CAMS",        name: "Computer Age Management Svc",  yahooSymbol: "CAMS.NS",        sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "CRISIL",      name: "CRISIL",                       yahooSymbol: "CRISIL.NS",      sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "AUBANK",      name: "AU Small Finance Bank",        yahooSymbol: "AUBANK.NS",      sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "JIOFIN",      name: "Jio Financial Services",       yahooSymbol: "JIOFIN.NS",      sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "FINOPB",      name: "Fino Payments Bank",           yahooSymbol: "FINOPB.NS",      sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "GODIGIT",     name: "Go Digit General Insurance",   yahooSymbol: "GODIGIT.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ICICIAMC",    name: "ICICI Prudential AMC",         yahooSymbol: "ICICIAMC.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── JEWELLERY / LIFESTYLE ────────────────────────────────────────────────────
  { symbol: "KALYANKJIL",  name: "Kalyan Jewellers",             yahooSymbol: "KALYANKJIL.NS",  sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SENCO",       name: "Senco Gold",                   yahooSymbol: "SENCO.NS",       sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "PCJEWELLER",  name: "PC Jeweller",                  yahooSymbol: "PCJEWELLER.NS",  sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "THANGAMAYL",  name: "Thangamayil Jewellery",        yahooSymbol: "THANGAMAYL.NS",  sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "RAJESHEXPO",  name: "Rajesh Exports",               yahooSymbol: "RAJESHEXPO.NS",  sector: "Retail",                   exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── TEXTILES ─────────────────────────────────────────────────────────────────
  { symbol: "RAYMOND",     name: "Raymond",                      yahooSymbol: "RAYMOND.NS",     sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ARVIND",      name: "Arvind",                       yahooSymbol: "ARVIND.NS",      sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TRIDENT",     name: "Trident",                      yahooSymbol: "TRIDENT.NS",     sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "VARDHMAN",    name: "Vardhman Textiles",            yahooSymbol: "VTL.NS",         sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "WELSPUNIND",  name: "Welspun India",                yahooSymbol: "WELSPUNIND.NS",  sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "KITEX",       name: "Kitex Garments",               yahooSymbol: "KITEX.NS",       sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── DEFENCE & AEROSPACE ──────────────────────────────────────────────────────
  { symbol: "PARAS",       name: "Paras Defence & Space Tech",   yahooSymbol: "PARASDEFE.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "DATAPATTNS",  name: "Data Patterns India",          yahooSymbol: "DATAPATTNS.NS",  sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "MTAR",        name: "MTAR Technologies",            yahooSymbol: "MTARTECH.NS",    sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "IDEAFORGE",   name: "ideaForge Technology",         yahooSymbol: "IDEAFORGE.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BDL",         name: "Bharat Dynamics",              yahooSymbol: "BDL.NS",         sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "ASTRA",       name: "Astra Microwave Products",     yahooSymbol: "ASTRAMICRO.NS",  sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BEML",        name: "BEML",                         yahooSymbol: "BEML.NS",        sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── RENEWABLE / GREEN ENERGY ─────────────────────────────────────────────────
  { symbol: "WAAREE",      name: "Waaree Energies",              yahooSymbol: "WAAREEENER.NS",  sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "PREMIERENE",  name: "Premier Energies",             yahooSymbol: "PREMIERENE.NS",  sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "INOXWIND",    name: "Inox Wind",                    yahooSymbol: "INOXWIND.NS",    sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "WINDENERGY",  name: "Orient Green Power",           yahooSymbol: "GREENPOWER.NS",  sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BOROSIL",     name: "Borosil Renewables",           yahooSymbol: "BORORENEW.NS",   sector: "Power",                    exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── EV / NEW TECH ────────────────────────────────────────────────────────────
  { symbol: "OLECTRA",     name: "Olectra Greentech (EV Bus)",   yahooSymbol: "OLECTRA.NS",     sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "GREENLAM",    name: "Greenlam Industries",          yahooSymbol: "GREENLAM.NS",    sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TATTECH",     name: "Tata Technologies",            yahooSymbol: "TATATECH.NS",    sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SYRMA",       name: "Syrma SGS Technology",         yahooSymbol: "SYRMA.NS",       sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TATAELXSI2",  name: "Tata Elxsi (dup guard)",       yahooSymbol: "TATAELXSI.NS",   sector: "Information Technology",   exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── SUGAR / AGRI ─────────────────────────────────────────────────────────────
  { symbol: "DWARIKESH",   name: "Dwarikesh Sugar",              yahooSymbol: "DWARIKESH.NS",   sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SHREERENUKA", name: "Shree Renuka Sugars",          yahooSymbol: "RENUKA.NS",      sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "EID",         name: "EID Parry India",              yahooSymbol: "EIDPARRY.NS",    sector: "FMCG",                     exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "DCMSHRIRAM",  name: "DCM Shriram",                  yahooSymbol: "DCMSHRIRAM.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── PAPER / PACKAGING ────────────────────────────────────────────────────────
  { symbol: "TNPL",        name: "Tamil Nadu Newsprint",         yahooSymbol: "TNPL.NS",        sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "JKPAPER",     name: "JK Paper",                     yahooSymbol: "JKPAPER.NS",     sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "WESTCOAST",   name: "West Coast Paper Mills",       yahooSymbol: "WESTCOAST.NS",   sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "MANAKALUCO",  name: "Manaksia Aluminium",           yahooSymbol: "MANAKALUCO.NS",  sector: "Metals & Mining",          exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── HOTELS / HOSPITALITY ─────────────────────────────────────────────────────
  { symbol: "INDHOTEL",    name: "Indian Hotels (Taj)",          yahooSymbol: "INDHOTEL.NS",    sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "LEMONTRE",    name: "Lemon Tree Hotels",            yahooSymbol: "LEMONTREE.NS",   sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "EIHASSOC",    name: "EIH (Oberoi Hotels)",          yahooSymbol: "EIHASSOC.NS",    sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "CHALET",      name: "Chalet Hotels",                yahooSymbol: "CHALET.NS",      sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "MAHINDH",     name: "Mahindra Holidays",            yahooSymbol: "MHRIL.NS",       sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── LOGISTICS ────────────────────────────────────────────────────────────────
  { symbol: "ALLCARGO",    name: "Allcargo Logistics",           yahooSymbol: "ALLCARGO.NS",    sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "GATI",        name: "Gati (Allcargo Gati)",         yahooSymbol: "GATI.NS",        sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TCI",         name: "Transport Corp of India",      yahooSymbol: "TCI.NS",         sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "MAHLOG",      name: "Mahindra Logistics",           yahooSymbol: "MAHLOG.NS",      sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "VRL",         name: "VRL Logistics",                yahooSymbol: "VRLLOG.NS",      sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── HEALTHCARE DEVICES / DIAGNOSTICS ─────────────────────────────────────────
  { symbol: "POLYMED",     name: "Poly Medicure",                yahooSymbol: "POLYMED.NS",     sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "HCG",         name: "Healthcare Global Enterprises",yahooSymbol: "HCG.NS",         sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "THYROCARE",   name: "Thyrocare Technologies",       yahooSymbol: "THYROCARE.NS",   sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "KRSNAA",      name: "Krsnaa Diagnostics",           yahooSymbol: "KRSNAA.NS",      sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "VIJAYA",      name: "Vijaya Diagnostic Centre",     yahooSymbol: "VIJAYA.NS",      sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SUVENPHAR",   name: "Suven Pharmaceuticals",        yahooSymbol: "SUVENPHAR.NS",   sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SEQUENT",     name: "Sequent Scientific",           yahooSymbol: "SEQUENT.NS",     sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "STRIDES",     name: "Strides Pharma Science",       yahooSymbol: "STAR.NS",        sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SOLARA",      name: "Solara Active Pharma",         yahooSymbol: "SOLARA.NS",      sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── REAL ESTATE (additional) ─────────────────────────────────────────────────
  { symbol: "MAHLIFE",     name: "Mahindra Lifespace",           yahooSymbol: "MAHLIFE.NS",     sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "KOLTEPATIL",  name: "Kolte-Patil Developers",       yahooSymbol: "KOLTEPATIL.NS",  sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ANANTRAJ",    name: "Anant Raj",                    yahooSymbol: "ANANTRAJ.NS",    sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SUNTECK",     name: "Sunteck Realty",               yahooSymbol: "SUNTECK.NS",     sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "GODREJPROP2", name: "Godrej Properties",            yahooSymbol: "GODREJPROP.NS",  sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },

  // ── SPECIALTY CHEMICALS (additional) ────────────────────────────────────────
  { symbol: "ROSSARI",     name: "Rossari Biotech",              yahooSymbol: "ROSSARI.NS",     sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TATACHEM2",   name: "Tata Chemicals",               yahooSymbol: "TATACHEM.NS",    sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "SUDARSCHEM",  name: "Sudarshan Chemical",           yahooSymbol: "SUDARSCHEM.NS",  sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "ATUL",        name: "Atul",                         yahooSymbol: "ATUL.NS",        sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "BAYERCROP",   name: "Bayer CropScience",            yahooSymbol: "BAYERCROP.NS",   sector: "Chemicals",                exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── ELECTRIC EQUIPMENT ───────────────────────────────────────────────────────
  { symbol: "INOXINDIA",   name: "INOX India",                   yahooSymbol: "INOXINDIA.NS",   sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "KENNAMETAL",  name: "Kennametal India",             yahooSymbol: "KENNAMET.NS",    sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TDPOWERSYS",  name: "TD Power Systems",             yahooSymbol: "TDPOWERSYS.NS",  sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "POWERINDIA",  name: "Hitachi Energy India",         yahooSymbol: "POWERINDIA.NS",  sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "JYOTISTRUC",  name: "Jyoti Structures",             yahooSymbol: "JYOTISTRUC.NS",  sector: "Capital Goods",            exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── MINING / OIL FIELD SERVICES ──────────────────────────────────────────────
  { symbol: "RITES",       name: "RITES",                        yahooSymbol: "RITES.NS",       sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "WABCOINDIA",  name: "WABCO India",                  yahooSymbol: "WABCOINDIA.NS",  sector: "Automobile",               exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "BOROLTD",     name: "Borosil",                      yahooSymbol: "BOROLTD.NS",     sector: "Consumer Durables",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "DBREALTY",    name: "D B Realty",                   yahooSymbol: "DBREALTY.NS",    sector: "Infrastructure",           exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "PGHL",        name: "Procter & Gamble Health",      yahooSymbol: "PGHL.NS",        sector: "Healthcare",               exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── BANKING (additional small / private) ─────────────────────────────────────
  { symbol: "DCBBANK",     name: "DCB Bank",                     yahooSymbol: "DCBBANK.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "KARNATBNK",   name: "Karnataka Bank",               yahooSymbol: "KTKBANK.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SOUTHBNK",    name: "South Indian Bank",            yahooSymbol: "SOUTHBNK.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "J&KBANK",     name: "Jammu & Kashmir Bank",         yahooSymbol: "J%26KBANK.NS",   sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "CSBBANK",     name: "CSB Bank",                     yahooSymbol: "CSBBANK.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "SURYODAY",    name: "Suryoday Small Finance Bank",  yahooSymbol: "SURYODAY.NS",    sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "UTKARSHBNK",  name: "Utkarsh Small Finance Bank",   yahooSymbol: "UTKARSHBNK.NS",  sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "NJINDMF",     name: "NJ India Invest",              yahooSymbol: "NJINDMF.NS",     sector: "Financial Services",       exchange: "NSE", isNifty50: false, isNifty500: false },

  // ── MEDIA (additional) ───────────────────────────────────────────────────────
  { symbol: "PVRINOX",     name: "PVR Inox",                     yahooSymbol: "PVRINOX.NS",     sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: true  },
  { symbol: "INOX",        name: "INOX Leisure",                 yahooSymbol: "INOXLEISUR.NS",  sector: "Consumer Services",        exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TIPSINDLTD",  name: "Tips Industries",              yahooSymbol: "TIPSINDLTD.NS",  sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: false },
  { symbol: "TV18BRDCST",  name: "TV18 Broadcast",               yahooSymbol: "TV18BRDCST.NS",  sector: "Communication Services",   exchange: "NSE", isNifty50: false, isNifty500: false },
];

export const SECTORS = [
  "All Sectors",
  "Information Technology",
  "Financial Services",
  "Energy",
  "FMCG",
  "Healthcare",
  "Automobile",
  "Capital Goods",
  "Power",
  "Metals & Mining",
  "Consumer Durables",
  "Consumer Services",
  "Infrastructure",
  "Chemicals",
  "Retail",
  "Communication Services",
  "Diversified",
  "Cement",
];

export const MARKET_INDICES = [
  { name: "NIFTY 50",        symbol: "^NSEI",       description: "National Stock Exchange Index" },
  { name: "SENSEX",          symbol: "^BSESN",      description: "BSE Sensitive Index" },
  { name: "NIFTY BANK",      symbol: "^NSEBANK",    description: "Bank Nifty Index" },
  { name: "NIFTY IT",        symbol: "^CNXIT",      description: "IT Sector Index" },
  { name: "NIFTY MIDCAP 100",symbol: "^CNXMIDCAP",  description: "Midcap Index" },
];

export function getStockBySymbol(symbol: string): NSEStock | undefined {
  return INDIAN_STOCKS.find(
    (s) => s.symbol === symbol || s.yahooSymbol === symbol
  );
}

export function getStocksBySector(sector: string): NSEStock[] {
  if (sector === "All Sectors") return INDIAN_STOCKS;
  return INDIAN_STOCKS.filter((s) => s.sector === sector);
}

export function getNifty50Stocks(): NSEStock[] {
  return INDIAN_STOCKS.filter((s) => s.isNifty50);
}

export function getNifty500Stocks(): NSEStock[] {
  return INDIAN_STOCKS.filter((s) => s.isNifty500);
}

export function searchStocks(query: string, limit = 10): NSEStock[] {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return INDIAN_STOCKS.filter(
    (s) =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
  ).slice(0, limit);
}
