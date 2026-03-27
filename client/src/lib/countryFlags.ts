/** Convert a 2-letter ISO 3166-1 alpha-2 code to a flag emoji. */
function codeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

/** Normalised country name → ISO 3166-1 alpha-2 code. */
const NAME_TO_CODE: Record<string, string> = {
  'afghanistan': 'AF', 'albania': 'AL', 'algeria': 'DZ', 'argentina': 'AR',
  'armenia': 'AM', 'australia': 'AU', 'austria': 'AT', 'azerbaijan': 'AZ',
  'bahrain': 'BH', 'bangladesh': 'BD', 'belarus': 'BY', 'belgium': 'BE',
  'bolivia': 'BO', 'bosnia': 'BA', 'bosnia and herzegovina': 'BA',
  'brazil': 'BR', 'bulgaria': 'BG', 'cambodia': 'KH', 'cameroon': 'CM',
  'canada': 'CA', 'chile': 'CL', 'china': 'CN', 'colombia': 'CO',
  'costa rica': 'CR', 'croatia': 'HR', 'cuba': 'CU', 'cyprus': 'CY',
  'czech republic': 'CZ', 'czechia': 'CZ', 'denmark': 'DK', 'ecuador': 'EC',
  'egypt': 'EG', 'el salvador': 'SV', 'estonia': 'EE', 'ethiopia': 'ET',
  'finland': 'FI', 'france': 'FR', 'georgia': 'GE', 'germany': 'DE',
  'ghana': 'GH', 'greece': 'GR', 'guatemala': 'GT', 'honduras': 'HN',
  'hungary': 'HU', 'iceland': 'IS', 'india': 'IN', 'indonesia': 'ID',
  'iran': 'IR', 'iraq': 'IQ', 'ireland': 'IE', 'israel': 'IL',
  'italy': 'IT', 'jamaica': 'JM', 'japan': 'JP', 'jordan': 'JO',
  'kazakhstan': 'KZ', 'kenya': 'KE', 'kuwait': 'KW', 'latvia': 'LV',
  'lebanon': 'LB', 'libya': 'LY', 'lithuania': 'LT', 'luxembourg': 'LU',
  'malaysia': 'MY', 'mexico': 'MX', 'moldova': 'MD', 'mongolia': 'MN',
  'morocco': 'MA', 'mozambique': 'MZ', 'myanmar': 'MM', 'nepal': 'NP',
  'netherlands': 'NL', 'holland': 'NL', 'new zealand': 'NZ', 'nicaragua': 'NI',
  'nigeria': 'NG', 'north korea': 'KP', 'norway': 'NO', 'oman': 'OM',
  'pakistan': 'PK', 'palestine': 'PS', 'panama': 'PA', 'paraguay': 'PY',
  'peru': 'PE', 'philippines': 'PH', 'poland': 'PL', 'portugal': 'PT',
  'qatar': 'QA', 'romania': 'RO', 'russia': 'RU', 'saudi arabia': 'SA',
  'senegal': 'SN', 'serbia': 'RS', 'singapore': 'SG', 'slovakia': 'SK',
  'slovenia': 'SI', 'somalia': 'SO', 'south africa': 'ZA', 'south korea': 'KR',
  'korea': 'KR', 'spain': 'ES', 'sri lanka': 'LK', 'sudan': 'SD',
  'sweden': 'SE', 'switzerland': 'CH', 'syria': 'SY', 'taiwan': 'TW',
  'tajikistan': 'TJ', 'tanzania': 'TZ', 'thailand': 'TH', 'tunisia': 'TN',
  'turkey': 'TR', 'turkiye': 'TR', 'uganda': 'UG', 'ukraine': 'UA',
  'united arab emirates': 'AE', 'uae': 'AE', 'united kingdom': 'GB',
  'uk': 'GB', 'england': 'GB', 'scotland': 'GB', 'wales': 'GB',
  'united states': 'US', 'usa': 'US', 'us': 'US', 'america': 'US',
  'uruguay': 'UY', 'uzbekistan': 'UZ', 'venezuela': 'VE', 'vietnam': 'VN',
  'yemen': 'YE', 'zimbabwe': 'ZW',
};

/**
 * Returns a flag emoji for a country name string.
 * Case-insensitive, trims whitespace.
 * Returns empty string if the country is unknown.
 */
export function countryToFlag(country: string | null | undefined): string {
  if (!country) return '';
  const key = country.trim().toLowerCase();
  const code = NAME_TO_CODE[key];
  return code ? codeToFlag(code) : '';
}
