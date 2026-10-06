# Step-by-Step Guide: Google Sheets Setup & Live Deployment

This guide explains how to connect your **Jain Connect 360°** form to your personal **Google Sheet** so that all entries filled by community members automatically arrive in real-time on your sheet, completely **free of cost** and **100% private to you**.

---

## Part 1: Connect Form to Google Sheets (Collect Submissions)

### Step 1: Create a New Google Sheet
1. Open your browser and go to: [sheets.new](https://sheets.new) (or Google Drive -> New -> Google Sheets).
2. Name the sheet in the top-left: **`Jain Connect 360 - Submissions`**.
3. *(Optional)* You do not need to type any column headers — the script will automatically create, format, and freeze the 12 columns for you upon the first submission!

---

### Step 2: Open Google Apps Script
1. In the top menu of your Google Sheet, click **Extensions** -> **Apps Script**.
2. A new tab will open with code editor showing `function myFunction() { ... }`.
3. Select and delete everything in that editor.

---

### Step 3: Paste the Webhook Code
1. Open the file [`google_apps_script.js`](./google_apps_script.js) from this repository.
2. Copy the entire code and paste it into the Apps Script editor:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
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
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#FDE68A");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }
    
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy hh:mm:ss a");
    
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

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "active", 
      message: "Jain Connect 360° Google Webhook is live and ready to receive submissions!" 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click the disk icon 💾 (**Save project**).

---

### Step 4: Deploy as a Web App
1. In the top-right corner of the Apps Script window, click the blue **Deploy** button -> **New deployment**.
2. Click the gear icon ⚙️ beside **Select type** and choose **Web app**.
3. Configure the fields:
   - **Description**: `Jain Connect 360 Webhook`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: **`Anyone`**  
     *(⚠️ Critical: This must be set to "Anyone" so that community users filling the form on their mobile phones can send their data without logging into your Google account).*
4. Click **Deploy**.

---

### Step 5: Grant Google Authorization
1. A dialog box will say *"Authorization required"*. Click **Authorize access**.
2. Choose your Google Account.
3. If you see *"Google hasn't verified this app"*:
   - Click **Advanced** (bottom left).
   - Click **Go to Untitled project (unsafe)**.
   - Click **Allow**.
4. Once completed, Google will display your **Web App URL**:
   It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`
5. **Copy this URL**.

---

### Step 6: Paste the URL in the Form
Your webhook URL is already configured in all files:
`https://script.google.com/macros/s/AKfycbx_gKg7VwmgAIAovuZHZTs1hlzZBX6x8XhSkjCVj9OF35ocBAGH-tWwLUNZHyNX0FJYkw/exec`

> [!IMPORTANT]
> **If Google Apps Script shows "Script function not found: doPost":**
> In the Apps Script window:
> 1. Click 💾 **Save**.
> 2. Click **Deploy** → **Manage deployments**.
> 3. Click the pencil ✏️ **Edit** icon.
> 4. Change **Version** dropdown to **New version**.
> 5. Click **Deploy**.
> *(This publishes your latest pasted code to the existing URL).*

---

## Part 2: Free Hosting on GitHub Pages (Public Live Link)

1. Open your repository on GitHub:
   [https://github.com/variyanirav/jain-connect-360](https://github.com/variyanirav/jain-connect-360)
2. Go to **Settings** (top tabs) -> click **Pages** (on the left sidebar).
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: select `main` and folder `/(root)`
   - Click **Save**.
4. Wait 1 to 2 minutes. GitHub will generate your live public link:
   - Public Form URL:  
     `https://variyanirav.github.io/jain-connect-360/public.html`
   - Admin Portal URL:  
     `https://variyanirav.github.io/jain-connect-360/index.html`

---

## Part 3: Test and Verify
1. Open `public.html` on your phone or PC.
2. Fill out a test submission with:
   - Name: `Nirav Variya (Test)`
   - Calling Number: `9876543210`
   - Select your Samaj, State, City, Business.
   - Click **Submit Details**.
3. Open your Google Sheet — the row with all details will immediately appear with an IST timestamp!
