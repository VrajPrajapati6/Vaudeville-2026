# Merch Google Sheet Setup Guide

Follow these steps to connect a dedicated Google Sheet for your Merch orders.

## 1. Environment Variable
Add the following variable to your `.env` file in the root directory:

```env
MERCH_APPS_SCRIPT_URL=YOUR_NEW_APPS_SCRIPT_DEPLOYMENT_URL
```

## 2. Google Sheet Preparation
Create a new Google Sheet and add the following headers in the first row (A1 to H1):

| A | B | C | D | E | F | G | H |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Name** | **Email** | **Transaction ID** | **Mobile Number** | **Roll Number** | **Size** | **Screenshot URL** | **Ordered At** |

## 3. Google Apps Script
1. In your new Google Sheet, go to **Extensions** > **Apps Script**.
2. Delete any existing code and paste the following:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Append a new row with the merch order data
    sheet.appendRow([
      data.name,
      data.email,
      data.transactionId,
      data.mobileNumber,
      data.rollNumber,
      data.size,
      data.screenshotUrl,
      data.orderedAt
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the disk icon to save.
4. Click **Deploy** > **New Deployment**.
5. Select **Web App**.
6. Set **Execute as** to "Me".
7. Set **Who has access** to "Anyone".
8. Copy the **Web App URL** and paste it into your `.env` file for `MERCH_APPS_SCRIPT_URL`.

> [!IMPORTANT]
> Make sure to re-deploy and use the NEW URL every time you make changes to the Apps Script.
