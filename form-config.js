// Replace scriptUrl with YOUR deployed Web App URL (must end with /exec)
//
// GOOGLE SETUP (do all steps):
// 1. Google Sheet → two tabs: "Admissions" and "Contact"
// 2. Extensions → Apps Script → paste ALL of google-apps-script.gs → Save
// 3. Run function "testSetup" once → Authorize
// 4. Deploy → New deployment → Web app
//      Execute as: Me
//      Who has access: Anyone (even anonymous)
// 5. Copy URL here
//
// TEST: open scriptUrl in incognito browser.
//   OK  → shows: AGOM form handler is ready.
//   BAD → Google login page OR error page

const FORM_CONFIG = {
  scriptUrl: 'https://script.google.com/macros/s/AKfycbx50I5nmSwy5WKsTT8h7_OmE7-_E4Kb7P6w4PvuUtuMLv3o-fT8PGquWcWwnvvcIuWX/exec',
};
