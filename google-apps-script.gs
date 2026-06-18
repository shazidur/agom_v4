/**
 * AGOM Form Handler — paste into Google Sheets > Extensions > Apps Script
 *
 * SETUP (follow every step):
 * 1. Create a Google Sheet with two tabs named exactly: "Admissions" and "Contact"
 * 2. Paste this entire file, Save
 * 3. Run > testSetup (first time only — authorize when prompted)
 * 4. Deploy > New deployment > Web app
 *      Execute as: Me
 *      Who has access: Anyone   <-- MUST be "Anyone"
 * 5. Copy Web App URL (ends with /exec) into form-config.js
 *
 * TEST in incognito (not logged into Google):
 *   Open the URL — should show: AGOM form handler is ready.
 *   If you see Google sign-in, deployment access is WRONG.
 */

const SHEETS = {
  admission: 'Admissions',
  contact: 'Contact',
};

const HEADERS = {
  Admissions: ['Timestamp', 'Student Name', 'Father Name', 'Age', 'Phone', 'Email', 'Course'],
  Contact: ['Timestamp', 'Name', 'Email', 'Subject', 'Message'],
};

/** Run once from Apps Script editor to verify sheet setup */
function testSetup() {
  getSheet(SHEETS.admission);
  getSheet(SHEETS.contact);
  Logger.log('Setup OK — both sheets exist and headers are ready.');
}

function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var callback = params.callback;

  try {
    if (params.formType) {
      handleSubmission(params);
      return respond({ success: true }, callback);
    }

    return respond({ status: 'ready', message: 'AGOM form handler is ready.' }, callback);
  } catch (err) {
    return respond({ success: false, error: err.message }, callback);
  }
}

function doPost(e) {
  var callback = (e && e.parameter) ? e.parameter.callback : null;

  try {
    var data = parseRequestData(e);
    handleSubmission(data);
    return respond({ success: true }, callback);
  } catch (err) {
    return respond({ success: false, error: err.message }, callback);
  }
}

function respond(payload, callback) {
  var json = JSON.stringify(payload);

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function handleSubmission(data) {
  var formType = data.formType;

  if (formType === 'admission') {
    appendAdmission(data);
  } else if (formType === 'contact') {
    appendContact(data);
  } else {
    throw new Error('Unknown form type: ' + formType);
  }
}

function parseRequestData(e) {
  if (e && e.parameter && e.parameter.formType) {
    return e.parameter;
  }

  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }

  throw new Error('No form data received');
}

function getSheet(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) {
    throw new Error('Sheet "' + name + '" not found. Create a tab named exactly "' + name + '".');
  }

  ensureHeaders(sheet, HEADERS[name]);
  return sheet;
}

function ensureHeaders(sheet, headers) {
  if (!sheet.getRange(1, 1).getValue()) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function appendAdmission(data) {
  getSheet(SHEETS.admission).appendRow([
    new Date(),
    data.studentName || '',
    data.fatherName || '',
    data.age || '',
    data.phone || '',
    data.email || '',
    data.course || '',
  ]);
}

function appendContact(data) {
  getSheet(SHEETS.contact).appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.subject || '',
    data.message || '',
  ]);
}
