/**
 * GOOGLE APPS SCRIPT FOR: JAIN CONNECT 360 DEGREE
 * Subtitle: Connecting Every Jain
 * 
 * Setup Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. In the menu, go to: Extensions > Apps Script
 * 3. Delete any placeholder code and paste this script.
 * 4. Click "Deploy" (top right) > "New deployment"
 * 5. Under "Select type" (gear icon) select "Web app"
 * 6. Set Description: "Jain Connect 360 Webhook"
 * 7. Set "Execute as": "Me (your Google email)"
 * 8. Set "Who has access": "Anyone"  <-- CRITICAL for accepting submissions
 * 9. Click "Deploy" and authorize permissions.
 * 10. Copy the "Web app URL" and paste it into public.html (line 282) or index.html!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Setup headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Record ID",
        "Full Name",
        "Contact Number",
        "Whats App Number",
        "Jain Sampradaya / Panth",
        "Name of Sammaj",
        "State",
        "City / Town",
        "Business Name / Occupation",
        "Language",
        "Status"
      ]);
      
      // Style headers: Amber/Gold theme with bold white text
      var headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight("bold")
                 .setBackground("#D97706")
                 .setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Parse the submitted JSON
    var data = JSON.parse(e.postData.contents);

    // Append new member record
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.id || "N/A",
      data.fullName || "",
      data.number || "",
      data.whatsappNumber || "",
      data.sampradaya || "",
      data.sammajName || "",
      data.state || "",
      data.city || "",
      data.businessName || "",
      data.languageUsed || "en",
      "VERIFIED"
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Jain Connect 360 Degree Webhook is active and running.");
}
