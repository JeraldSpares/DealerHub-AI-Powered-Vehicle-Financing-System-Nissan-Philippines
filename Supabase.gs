// =============================================
// Supabase.gs - DATABASE HELPER MODULE
// =============================================

// ✅ GANITO:
const SUPABASE_URL = PropertiesService.getScriptProperties().getProperty('SUPABASE_URL');
const SUPABASE_KEY = PropertiesService.getScriptProperties().getProperty('SUPABASE_KEY');

/**
 * UNIVERSAL SUPABASE API CALLER
 * Ito ang puso ng lahat ng database calls.
 */
function supabaseRequest(endpoint, method, body, queryParams) {
  let url = SUPABASE_URL + "/rest/v1/" + endpoint;
  
  // Dagdagan ng query parameters kung meron
  if (queryParams) {
    let params = [];
    for (let key in queryParams) {
      params.push(key + "=" + encodeURIComponent(queryParams[key]));
    }
    url += "?" + params.join("&");
  }
  
  let options = {
    method: method || "GET",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": "return=representation"  // Ibabalik niya yung data after insert/update
    },
    muteHttpExceptions: true
  };
  
  if (body && (method === "POST" || method === "PATCH" || method === "DELETE")) {
    options.payload = JSON.stringify(body);
  }
  
  let response = UrlFetchApp.fetch(url, options);
  let code = response.getResponseCode();
  let text = response.getContentText();
  
  if (code >= 400) {
    throw new Error("Supabase Error (" + code + "): " + text);
  }
  
  return text ? JSON.parse(text) : null;
}

// =============================================
// SHORTCUT FUNCTIONS
// =============================================

/** SELECT - Kumuha ng data */
function dbSelect(table, queryParams) {
  return supabaseRequest(table, "GET", null, queryParams);
}

/** INSERT - Maglagay ng bagong record */
function dbInsert(table, data) {
  // Sinisigurado natin na kahit Array o Object ang ipasa, gagana siya.
  return supabaseRequest(table, "POST", data);
}

/** UPDATE - I-update ang existing record */
function dbUpdate(table, data, queryParams) {
  return supabaseRequest(table, "PATCH", data, queryParams);
}

/** DELETE - Burahin ang record */
function dbDelete(table, queryParams) {
  return supabaseRequest(table, "DELETE", null, queryParams);
}

/** LOG - Shortcut para sa audit logging */
function dbLog(action, refNo) {
  dbInsert("logs", {
    ref_no: refNo || "N/A",
    action: action,
    user_name: "Admin"
  });
}

// =============================================
// SETTINGS HELPERS
// =============================================

function dbGetSetting(key) {
  let result = dbSelect("settings", { key: "eq." + key, select: "value" });
  return (result && result.length > 0) ? result[0].value : null;
}

function dbSetSetting(key, value) {
  // ✨ FRIDAY FIX: Smart Upsert (Check muna bago mag-update o insert)
  let existing = dbSelect("settings", { select: "key", key: "eq." + key });
  
  if (existing && existing.length > 0) {
    // Kung meron na, i-UPDATE lang natin
    dbUpdate("settings", { value: value }, { key: "eq." + key });
  } else {
    // Kung wala pa, tsaka tayo mag-INSERT
    dbInsert("settings", { key: key, value: value });
  }
}

// ISANG BESES LANG PATAKBUHIN ITO!
// Pumunta sa Apps Script → Run → migrateToSupabase()

function migrateToSupabase() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheets = ss.getSheets();
  let migrated = 0;
  
  sheets.forEach(sheet => {
    let name = sheet.getName();
    if (name === "Database" || name.includes("_Archive")) {
      let data = sheet.getDataRange().getValues();
      
      for (let i = 1; i < data.length; i++) {
        let row = data[i];
        if (!row[1]) continue; // Skip kung walang ref_no
        
        try {
          dbInsert("applications", {
            created_at: row[0] ? new Date(row[0]).toISOString() : new Date().toISOString(),
            ref_no: row[1],
            status: row[2] || "Pending",
            maker_name: row[3] || null,
            maker_marital: row[4] || null,
            maker_bday: row[5] ? new Date(row[5]).toISOString().split('T')[0] : null,
            maker_age: row[6] ? parseInt(row[6]) : null,
            maker_cell: row[7] || null,
            maker_tin: row[8] || null,
            maker_email: row[9] || null,
            maker_address: row[10] || null,
            maker_stay: row[11] || null,
            maker_employer: row[12] || null,
            maker_position: row[13] || null,
            maker_emp_contact: row[14] || null,
            maker_emp_address: row[15] || null,
            maker_yrs_company: row[16] || null,
            car_model: row[17] || null,
            car_variant: row[18] || null,
            car_color: row[19] || null,
            co_maker_name: row[20] || null,
            co_maker_marital: row[21] || null,
            co_maker_bday: row[22] ? new Date(row[22]).toISOString().split('T')[0] : null,
            co_maker_age: row[23] ? parseInt(row[23]) : null,
            co_maker_cell: row[24] || null,
            co_maker_tin: row[25] || null,
            co_maker_address: row[26] || null,
            co_maker_stay: row[27] || null,
            co_maker_employer: row[28] || null,
            co_maker_position: row[29] || null,
            co_maker_emp_contact: row[30] || null,
            co_maker_emp_address: row[31] || null,
            co_maker_yrs_company: row[32] || null,
            maker_income: row[33] ? parseFloat(String(row[33]).replace(/,/g, '')) : 0,
            co_maker_income: row[34] ? parseFloat(String(row[34]).replace(/,/g, '')) : 0,
            agent_name: row[35] || null,
            manager_name: row[36] || null,
            mode_of_payment: row[37] || null,
            bank_type: row[38] || null,
            bank_name: row[39] || null,
            date_processed: row[40] ? new Date(row[40]).toISOString() : null,
            admin_remarks: row[41] || null
          });
          migrated++;
        } catch(e) {
          Logger.log("Skip duplicate or error: " + row[1] + " -> " + e.message);
        }
        
        // Pahinga ng konti kada 50 records para hindi ma-timeout
        if (migrated % 50 === 0) Utilities.sleep(1000);
      }
    }
  });
  
  Logger.log("Migration Complete! Total migrated: " + migrated);
  return migrated;
}

// =============================================
// ISANG BESES LANG PATAKBUHIN: MIGRATE CATALOG
// Run → migrateCatalog()
// =============================================
function migrateCatalog() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Catalog");
  if (!sheet) { Logger.log("Walang Catalog sheet!"); return 0; }
  
  let data = sheet.getDataRange().getValues();
  let migrated = 0;
  
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    if (!row[1]) continue; // Skip kung walang brand
    
    try {
      dbInsert("catalog", {
        brand: row[1] || "",
        model: row[2] || "",
        variant: row[3] || "",
        colors: row[4] || "",
        status: row[5] || "Active"
      });
      migrated++;
    } catch(e) {
      Logger.log("Catalog skip: " + row[1] + " " + row[2] + " -> " + e.message);
    }
  }
  
  Logger.log("Catalog Migration Complete! Total: " + migrated);
  return migrated;
}

// =============================================
// ISANG BESES LANG PATAKBUHIN: MIGRATE TEAM
// Run → migrateTeam()
// =============================================
function migrateTeam() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Team");
  if (!sheet) { Logger.log("Walang Team sheet!"); return 0; }
  
  let data = sheet.getDataRange().getValues();
  let migrated = 0;
  
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    if (!row[1]) continue; // Skip kung walang manager name
    
    try {
      dbInsert("team", {
        manager_name: row[1] || "",
        manager_email: row[2] || "",
        agent_name: row[3] || "",
        agent_email: row[4] || "",
        status: row[5] || "Active"
      });
      migrated++;
    } catch(e) {
      Logger.log("Team skip: " + row[1] + " -> " + e.message);
    }
  }
  
  Logger.log("Team Migration Complete! Total: " + migrated);
  return migrated;
}
