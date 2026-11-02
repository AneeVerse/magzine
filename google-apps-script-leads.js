/**
 * =========================================================================
 * SCRIPT 1: RISE Magazine — FORM LEADS (DEDICATED SHEET)
 * =========================================================================
 * 1. Create sheet: "RISE_BNI_Navi_Mumbai_Leads"
 * 2. Extensions → Apps Script → paste this file
 * 3. Select setupHeaders in the dropdown → click Run (headers appear in row 1)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me | Who has access: Anyone
 * 5. Paste URL in .env.local as GOOGLE_SHEETS_WEBHOOK_URL
 * =========================================================================
 */

var LEAD_HEADERS = [
  "Submitted At (IST)",
  "Full Name",
  "Email",
  "Phone",
  "Country Code",
  "Business",
  "Area",
  "BNI Status",
  "Action",
  "Form Source",
  "User Location",
  "City",
  "Region / State",
  "Country",
  "Pincode",
  "IP Address",
  "Page URL",
  "src",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "Consent Version",
];

/** Run this ONCE from the dropdown → Run. Creates styled header row automatically. */
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setValues([LEAD_HEADERS]);
  var headerRange = sheet.getRange(1, 1, 1, LEAD_HEADERS.length);
  headerRange.setBackground("#6b1d2a");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  for (var c = 1; c <= LEAD_HEADERS.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    setupHeaders();
  }
}

function cleanPhone_(phone) {
  if (!phone) return "";
  var s = String(phone).trim();
  if ((s.charAt(0) === "+" || s.charAt(0) === "=") && s.charAt(0) !== "'") {
    return "'" + s;
  }
  if (s.charAt(0) !== "'") return "'" + s;
  return s;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    ensureHeaders_(sheet);

    var location =
      data.userLocation ||
      [data.city, data.region, data.country].filter(Boolean).join(", ") ||
      "";

    sheet.appendRow([
      data.submittedAt ||
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.name || "",
      data.email || "",
      cleanPhone_(data.phone || data.googleSheetsPhone || ""),
      data.countryCode || "91",
      data.business || data.biz || "",
      data.area || "",
      data.bniStatus || data.status || "",
      data.action || "subscribe",
      data.formSource || data.from || "rise-magazine",
      location || "Unknown",
      data.city || "",
      data.region || "",
      data.country || "",
      data.userPincode || data.pincode || "",
      data.userIp || data.ip || "",
      data.pageUrl || "",
      data.src || "",
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.utm_content || "",
      data.utm_term || "",
      data.consentVersion || "rise-diwali-2026-v1",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "RISE lead recorded",
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "error",
        message: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "OK", service: "rise-leads" }),
  ).setMimeType(ContentService.MimeType.JSON);
}
