/**
 * Site keyword system — the single list every consumer reads.
 *
 * Consumers:
 *   `SITE_KEYWORDS`        → `<meta name="keywords">` on `/` and the twin
 *   `SITE_VISIBLE_KEYWORDS`→ the `Related searches:` block in the twin's BODY
 *
 * WHY THE SPLIT: Google ignores `<meta name="keywords">` and Bing officially
 * ignores it too, but Yandex documents that it can influence relevance — so the
 * host tokens are kept in the meta tag only. A raw domain printed in visible
 * body copy is filler for readers and crawlers alike, so it never appears there.
 *
 * ARCHETYPE — ISP / hosted email (SurgeWeb webmail gateway).
 * Six semantic clusters (quota 60–120+). Append-only; never delete.
 *
 * SCOPE — addressable by a webmail login gateway only:
 *   Email username / password auth, password recovery, SurgeWeb sign-in,
 *   browser-based mail access, contacts and calendar after login.
 */

import { SITE_DISPLAY_NAME, canonicalHostFromOrigin, isLocalOrigin } from "./site-config.js";

export function buildHostKeywords() {
  if (isLocalOrigin()) return [];
  const host = canonicalHostFromOrigin().toLowerCase();
  const apex = host.replace(/^www\./, "");
  const webmailHost = apex ? `webmail.${apex}` : "";
  return [...new Set([host, apex, webmailHost].filter(Boolean))];
}

const FULL_BRAND_NAME = "Northwest Communications";
const SURGEWEB = "SurgeWeb";

/**
 * Cluster 1 — Corporate entity & brand variants.
 */
export const CORPORATE_BRAND_KEYWORDS = [
  `${SITE_DISPLAY_NAME} login`,
  `${FULL_BRAND_NAME} webmail login`,
  `${FULL_BRAND_NAME} email login`,
  `${SITE_DISPLAY_NAME} sign in`,
  `${FULL_BRAND_NAME} mail login`,
  "ncn webmail login",
  "NCN net webmail",
  "ncn mail login",
  "northwest communications webmail",
  "northwest communications email login",
  `${SITE_DISPLAY_NAME} portal`,
  `${FULL_BRAND_NAME} webmail portal`,
  `${SITE_DISPLAY_NAME} online mail`,
  `${FULL_BRAND_NAME} online email access`,
  `${SITE_DISPLAY_NAME} login page`,
  `${FULL_BRAND_NAME} login page`,
  `${SITE_DISPLAY_NAME} customer webmail`,
  `${FULL_BRAND_NAME} hosted email login`,
  `${SITE_DISPLAY_NAME} Iowa webmail`,
  `${FULL_BRAND_NAME} Iowa email`,
  "NCN mail sign in",
  "ncn email portal",
  `${SITE_DISPLAY_NAME} secure login`,
  `${FULL_BRAND_NAME} secure webmail`,
  `${SITE_DISPLAY_NAME} log in`,
  `${FULL_BRAND_NAME} log in webmail`,
  `${SITE_DISPLAY_NAME} account login`,
  "northwest communications ncn webmail",
  `${SITE_DISPLAY_NAME} homepage login`,
  `${FULL_BRAND_NAME} subscriber email login`,
];

/**
 * Cluster 2 — Email services reachable after SurgeWeb sign-in.
 */
export const ACCOUNT_SERVICES_KEYWORDS = [
  `${SITE_DISPLAY_NAME} read email online`,
  `${SURGEWEB} read mail`,
  `${SITE_DISPLAY_NAME} compose email`,
  `${SURGEWEB} compose message`,
  `${SITE_DISPLAY_NAME} email folders`,
  `${SURGEWEB} folder management`,
  `${SITE_DISPLAY_NAME} contacts login`,
  `${SURGEWEB} address book`,
  `${SITE_DISPLAY_NAME} calendar webmail`,
  `${SURGEWEB} calendar access`,
  `${SITE_DISPLAY_NAME} check email browser`,
  `${FULL_BRAND_NAME} webmail inbox`,
  `${SITE_DISPLAY_NAME} sent items`,
  `${SITE_DISPLAY_NAME} draft messages webmail`,
  `${SURGEWEB} search mail`,
  `${SITE_DISPLAY_NAME} email attachments`,
  `${FULL_BRAND_NAME} hosted mailbox login`,
  `${SITE_DISPLAY_NAME} spam folder webmail`,
  `${SURGEWEB} junk mail settings`,
  `${SITE_DISPLAY_NAME} email settings login`,
];

/**
 * Cluster 3 — Authentication & recovery intents.
 */
export const AUTH_ACTION_KEYWORDS = [
  `${SITE_DISPLAY_NAME} username password`,
  `${SURGEWEB} username password login`,
  `${SITE_DISPLAY_NAME} email username`,
  `${FULL_BRAND_NAME} email password`,
  `${SITE_DISPLAY_NAME} forgot password`,
  `${SURGEWEB} forgot password`,
  `${SITE_DISPLAY_NAME} reset password webmail`,
  `${FULL_BRAND_NAME} password reset email`,
  `${SITE_DISPLAY_NAME} change password webmail`,
  `${SITE_DISPLAY_NAME} login not working`,
  `${SURGEWEB} login error`,
  `${SITE_DISPLAY_NAME} trouble logging in`,
  `${FULL_BRAND_NAME} webmail login issues`,
  `${SITE_DISPLAY_NAME} account locked webmail`,
  `${SITE_DISPLAY_NAME} invalid password webmail`,
  `${SURGEWEB} authentication failed`,
  `${SITE_DISPLAY_NAME} session expired login`,
  `${FULL_BRAND_NAME} email login help`,
  `${SITE_DISPLAY_NAME} first time webmail login`,
  `${SURGEWEB} new user login`,
  `${SITE_DISPLAY_NAME} password expired`,
  `${FULL_BRAND_NAME} recover email access`,
  `${SITE_DISPLAY_NAME} login problems today`,
  `${SITE_DISPLAY_NAME} cannot sign in webmail`,
  `${SURGEWEB} sign in failed`,
];

/**
 * Cluster 4 — Customer / participant roles.
 */
export const CUSTOMER_ROLE_KEYWORDS = [
  `${SITE_DISPLAY_NAME} residential email login`,
  `${FULL_BRAND_NAME} home email webmail`,
  `${SITE_DISPLAY_NAME} business email login`,
  `${FULL_BRAND_NAME} business webmail`,
  `${SITE_DISPLAY_NAME} subscriber mail login`,
  `${FULL_BRAND_NAME} customer email portal`,
  `${SITE_DISPLAY_NAME} employee webmail`,
  `${FULL_BRAND_NAME} hosted domain email login`,
  `${SITE_DISPLAY_NAME} family email account login`,
  `${FULL_BRAND_NAME} Iowa customer webmail`,
  `${SITE_DISPLAY_NAME} local email login`,
  `${FULL_BRAND_NAME} rural broadband email`,
];

/**
 * Cluster 5 — Platform & SurgeWeb / browser channel.
 */
export const PLATFORM_SYNERGY_KEYWORDS = [
  `${SURGEWEB} login`,
  `${SURGEWEB} webmail login`,
  `${SURGEWEB} NCN mail`,
  "ncn surgeweb login",
  "surgeweb ncn webmail",
  `${SURGEWEB} ajax interface`,
  `${SURGEWEB} web 2.0 mail interface`,
  `${SITE_DISPLAY_NAME} modern browser login`,
  `${SURGEWEB} firefox login`,
  `${SURGEWEB} chrome webmail`,
  `${SURGEWEB} safari email login`,
  `${SURGEWEB} edge webmail`,
  `${SITE_DISPLAY_NAME} desktop webmail`,
  `${SITE_DISPLAY_NAME} mobile browser email`,
  `${SURGEWEB} standard interface login`,
  `${FULL_BRAND_NAME} browser email access`,
  `${SITE_DISPLAY_NAME} secure web portal`,
  `${SURGEWEB} secure mail portal`,
  `${SITE_DISPLAY_NAME} web based email Iowa`,
  `${FULL_BRAND_NAME} internet mail login`,
  `${SURGEWEB} email client alternative`,
  `${SITE_DISPLAY_NAME} no outlook webmail`,
];

/**
 * Cluster 6 — Self-service & support.
 */
export const SELF_SERVICE_MOBILE_KEYWORDS = [
  `${FULL_BRAND_NAME} tech support webmail`,
  `${SITE_DISPLAY_NAME} customer support login help`,
  "NCN tech support email",
  `${FULL_BRAND_NAME} 8002495251 webmail`,
  `${FULL_BRAND_NAME} Havelock Iowa support`,
  `${SITE_DISPLAY_NAME} office hours email help`,
  `${FULL_BRAND_NAME} password assistance`,
  `${SITE_DISPLAY_NAME} webmail setup help`,
  `${SURGEWEB} configuration help`,
  `${SITE_DISPLAY_NAME} email on new device`,
  `${FULL_BRAND_NAME} configure email client`,
  `${SITE_DISPLAY_NAME} IMAP settings after login`,
  `${SITE_DISPLAY_NAME} POP webmail access`,
  `${FULL_BRAND_NAME} email troubleshooting`,
  `${SITE_DISPLAY_NAME} spam filter webmail help`,
  `${SURGEWEB} vacation message login`,
];

/** @deprecated Alias — preserved for any external imports of the old name. */
export const BRAND_ACCESS_KEYWORDS = CORPORATE_BRAND_KEYWORDS;
/** @deprecated Alias */
export const CREDENTIAL_KEYWORDS = AUTH_ACTION_KEYWORDS.filter((k) =>
  /username|password|forgot|reset/i.test(k),
);
/** @deprecated Alias */
export const RECOVERY_KEYWORDS = AUTH_ACTION_KEYWORDS.filter((k) =>
  /forgot|reset|locked|issues|help|not working|problems|error|recover/i.test(k),
);
/** @deprecated Alias */
export const SECURE_ACCESS_KEYWORDS = PLATFORM_SYNERGY_KEYWORDS;

function mergeKeywords(...lists) {
  const seen = new Set();
  const out = [];
  for (const list of lists) {
    for (const keyword of list) {
      const key = keyword.trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(keyword.trim());
    }
  }
  return out;
}

export const HOST_KEYWORDS = buildHostKeywords();

export function buildSiteKeywords() {
  return mergeKeywords(
    HOST_KEYWORDS,
    CORPORATE_BRAND_KEYWORDS,
    ACCOUNT_SERVICES_KEYWORDS,
    AUTH_ACTION_KEYWORDS,
    CUSTOMER_ROLE_KEYWORDS,
    PLATFORM_SYNERGY_KEYWORDS,
    SELF_SERVICE_MOBILE_KEYWORDS,
  );
}

/** Full list for `<meta name="keywords">` — includes the host tokens (Yandex). */
export const SITE_KEYWORDS = buildSiteKeywords();

export function buildVisibleKeywords() {
  const hosts = new Set(HOST_KEYWORDS.map((h) => h.toLowerCase()));
  return SITE_KEYWORDS.filter((k) => !hosts.has(k.toLowerCase()));
}

export const SITE_VISIBLE_KEYWORDS = buildVisibleKeywords();

/** Branded H1, shared by the human landing and the crawler twin (one constant). */
export const PAGE_H1_HEADING = `${SITE_DISPLAY_NAME} Login`;
