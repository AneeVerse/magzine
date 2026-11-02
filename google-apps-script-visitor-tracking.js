/**
 * =========================================================================
 * SCRIPT 2: RISE Magazine — VISITOR TRACKING (DEDICATED SHEET)
 * =========================================================================
 * 1. Create sheet: "RISE_BNI_Navi_Mumbai_Visitor_Tracking"
 * 2. Extensions → Apps Script → paste this file
 * 3. Select setupHeaders in the dropdown → click Run (headers appear in row 1)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me | Who has access: Anyone
 * 5. Paste URL in .env.local as VISITOR_TRACKING_WEBHOOK_URL
 * =========================================================================
 */

var VISITOR_HEADERS = [
  "Visit Time (IST)",
  "IP Address",
  "Pincode",
  "City",
  "Region / State",
  "Country",
  "Page URL",
  "Referrer",
  "Browser User-Agent",
  "src",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "Device",
];

/** Run this ONCE from the dropdown → Run. Creates styled header row automatically. */
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.getRange(1, 1, 1, VISITOR_HEADERS.length).setValues([VISITOR_HEADERS]);
  var headerRange = sheet.getRange(1, 1, 1, VISITOR_HEADERS.length);
  headerRange.setBackground("#059669");
  headerRange.setFontColor("#FFFFFF");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  for (var c = 1; c <= VISITOR_HEADERS.length; c++) {
    sheet.autoResizeColumn(c);
  }
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    setupHeaders();
  }
}

function detectDevice_(ua) {
  var s = String(ua || "").toLowerCase();
  if (!s) return "Unknown";
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(s)) return "Tablet";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/i.test(s)) return "Mobile";
  return "Desktop";
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    ensureHeaders_(sheet);

    var userAgent = data.userAgent || "";

    sheet.appendRow([
      data.timestamp ||
        new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.ip || "Unknown",
      data.pincode || "Unknown",
      data.city || "Unknown",
      data.region || "Unknown",
      data.country || "Unknown",
      data.pageUrl || "",
      data.referrer || "Direct",
      userAgent,
      data.src || "",
      data.utm_source || "",
      data.utm_medium || "",
      data.utm_campaign || "",
      data.device || detectDevice_(userAgent),
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Visitor tracked successfully",
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
    JSON.stringify({ status: "OK", service: "rise-visitors" }),
  ).setMimeType(ContentService.MimeType.JSON);
}
