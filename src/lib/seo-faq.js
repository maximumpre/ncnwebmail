/**
 * Entity-grounded FAQ copy for the crawler twin + FAQPage JSON-LD.
 * Answers derive from Northwest Communications public webmail (SurgeWeb on
 * webmail.ncn.net) and ncn.net customer support information.
 */

import { SITE_DISPLAY_NAME } from "./site-config.js";

export const SEO_FAQS = [
  {
    id: "faq-sign-in",
    question: `How do I sign in to ${SITE_DISPLAY_NAME}?`,
    answer:
      `Open the ${SITE_DISPLAY_NAME} sign-in page and enter the email username and password assigned to your Northwest Communications mailbox. After authentication, SurgeWeb loads your inbox using the standard Ajax web interface. Use a modern browser such as current Chrome, Firefox, Safari, or Microsoft Edge for the full experience.`,
  },
  {
    id: "faq-username",
    question: "What username and password do I use for NCN webmail?",
    answer:
      "Your username is typically your full email address (for example name@ncn-mail or your hosted domain address). Your password is the mailbox password Northwest Communications provided when your email account was set up. If you use a third-party email app, the same credentials apply to IMAP or POP where enabled.",
  },
  {
    id: "faq-recovery",
    question: "What if I forgot my webmail password or cannot log in?",
    answer:
      "Contact Northwest Communications Tech Support at 800.249.5251 or 712.776.2222. Support hours are Monday through Friday, 7:00 a.m. to 8:00 p.m. Office staff at 844 Wood Street, Havelock, Iowa can also assist Monday through Friday, 8:00 a.m. to 4:30 p.m. Do not share your password in email or with unsolicited callers.",
  },
  {
    id: "faq-browser",
    question: "Which browsers work with SurgeWeb on NCN Webmail?",
    answer:
      "SurgeWeb’s standard Ajax interface is tested with Internet Explorer 7 and later, Safari 3.1+, Firefox 3.0+, and Google Chrome 1+. Recent versions of Opera and other modern browsers usually work but may need compatibility checks. Internet Explorer 6 and very old browsers are not supported for the full webmail interface.",
  },
  {
    id: "faq-services",
    question: `What can I do after signing in to ${SITE_DISPLAY_NAME}?`,
    answer:
      "After login, SurgeWeb lets you read and send email, manage folders, search messages, and work with contacts and calendar features available on your account. You can compose new mail, reply, forward, and handle attachments from any supported browser without installing desktop software.",
  },
  {
    id: "faq-support",
    question: "Who do I contact for NCN email or webmail support?",
    answer:
      "For webmail login help, password resets, and email troubleshooting, call Northwest Communications Tech Support at 800.249.5251 (8002495251) or 712.776.2222. General office inquiries use the same toll-free number or visit the Northwest Communications website. Northwest Communications is your local Iowa provider for internet, phone, and email services from Havelock, Iowa.",
  },
];
