/**
 * =========================================================================
 * Jain Connect 360° - Google Apps Script Webhook
 * =========================================================================
 * This script receives form submissions from your Jain Connect 360 form
 * and saves each submission as a clean, formatted row in your Google Sheet.
 *
 * Cost: 100% Free (hosted on Google's cloud)
 * Privacy: 100% Private (only you and your Google account have access)
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse received submission data
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // If the sheet is empty, create formatted column headers automatically
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Record ID",
        "Submission Time (IST)",
        "Full Name",
        "Calling Number",
        "WhatsApp Number",
        "Jain Sampradaya / Panth",
        "Name of Samaj",
        "State",
        "City / Town",
        "Business / Occupation",
        "Volunteer for Jinshashan?",
        "Language"
      ];
      sheet.appendRow(headers);
      
      // Style headers: Bold text, warm amber background, centered, freeze top row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#FDE68A"); // Warm Amber
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    // Indian Standard Time (IST) timestamp (DD/MM/YYYY hh:mm:ss AM/PM)
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a");
    
    // Append data row
    // Note: Numbers are prefixed with ' so Google Sheets does not strip leading zeroes
    sheet.appendRow([
      data.id || ("JC360_" + new Date().getTime()),
      timestamp,
      data.fullName || "",
      data.number ? "'" + data.number : "",
      data.whatsappNumber ? "'" + data.whatsappNumber : "",
      data.sampradaya || "",
      data.sammajName || "",
      data.state || "",
      data.city || "",
      data.businessName || "",
      data.volunteer || "Not Specified",
      data.languageUsed ? data.languageUsed.toUpperCase() : "EN"
    ]);
    
    // Auto-fit columns for readability
    sheet.autoResizeColumns(1, 12);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Record saved successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check endpoint (for testing in browser)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "active", 
      message: "Jain Connect 360° Google Webhook is live and ready to receive submissions!" 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
