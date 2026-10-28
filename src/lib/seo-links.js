/**
 * Twin link reconciliation for NCN Webmail / Northwest Communications.
 * Track A logout / approve destination: https://www.ncn.net/
 * Auxiliary footer and help links route through /api/login-out until
 * authentic deep URLs are harvested from the live SurgeWeb portal.
 */

export const NCN_AUTHENTIC_ORIGIN = "https://www.ncn.net";

/** Final post-approval / logout destination used by authenticating.astro. */
export const LOGOUT_DESTINATION = `${NCN_AUTHENTIC_ORIGIN}/`;

/** Dead-end auxiliary actions — safe serverless redirect to the brand homepage. */
const AUX = "/api/login-out";

export const TWIN_LINKS = {
  home: "/",
  terms: AUX,
  help: AUX,
  privacy: AUX,
  dataProtection: AUX,
  internetBanking: AUX,
  retrieveRegistration: AUX,
  mobileBanking: AUX,
  appStore: AUX,
  playStore: AUX,
  troubleLoggingIn: AUX,
  contactTel: "tel:8002495251",
  /** Safe fallback for unhandled auxiliary actions (Astro serverless). */
  loginOut: "/api/login-out",
};
