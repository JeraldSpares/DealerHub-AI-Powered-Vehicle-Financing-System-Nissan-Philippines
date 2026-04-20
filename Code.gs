const APP_NAME = "DealerHub";

// =============================================
// 🔐 SESSION & AUTH GUARD (FIX #11)
// =============================================
function requireAdmin() {
  let session = PropertiesService.getUserProperties().getProperty('DH_SESSION');
  if (session !== 'active') throw new Error("Unauthorized: Session expired.");
}

// =============================================
// DATA CORE
// =============================================
function getAdminData() {
  requireAdmin(); // 🔒 FIX #11
  let data = dbSelect("applications", {
    select: "*",
    order: "created_at.desc",
    limit: "2000"
  });
  return data.map(row => convertRowToArray(row));
}

function convertRowToArray(row) {
  return [
    row.created_at, row.ref_no, row.status,
    row.maker_name, row.maker_marital, row.maker_bday, row.maker_age,
    row.maker_cell, row.maker_tin, row.maker_email, row.maker_address,
    row.maker_stay, row.maker_employer, row.maker_position,
    row.maker_emp_contact, row.maker_emp_address, row.maker_yrs_company,
    row.car_model, row.car_variant, row.car_color,
    row.co_maker_name, row.co_maker_marital, row.co_maker_bday, row.co_maker_age,
    row.co_maker_cell, row.co_maker_tin, row.co_maker_address,
    row.co_maker_stay, row.co_maker_employer, row.co_maker_position,
    row.co_maker_emp_contact, row.co_maker_emp_address, row.co_maker_yrs_company,
    row.maker_income, row.co_maker_income,
    row.agent_name, row.manager_name, row.mode_of_payment,
    row.bank_type, row.bank_name,
    row.date_processed, row.admin_remarks,
    row.risk_score || "",        // [42]
    row.risk_analysis || ""      // [43]
  ];
}

function submitApplication(data) {
  // 🔒 FIX #5: Collision-resistant refNo
  const refNo = "AUTO-" + new Date().getTime().toString().slice(-8) + Math.random().toString(36).slice(-3).toUpperCase();
  
  // 🔒 FIX #6: Try-catch — only send emails if DB insert succeeds
  try {
    dbInsert("applications", {
      ref_no: refNo, status: "Warm",
      maker_name: data.makerName, maker_marital: data.makerMarital,
      maker_bday: data.makerBday || null,
      maker_age: data.makerAge ? parseInt(data.makerAge) : null,
      maker_cell: data.makerCell, maker_tin: data.makerTin,
      maker_email: data.makerEmail, maker_address: data.makerAddress,
      maker_stay: data.makerStay, maker_employer: data.makerEmployer,
      maker_position: data.makerPosition, maker_emp_contact: data.makerEmpContact,
      maker_emp_address: data.makerEmpAddress, maker_yrs_company: data.makerYrsCompany,
      car_model: data.carModel, car_variant: data.carVariant, car_color: data.carColor,
      co_maker_name: data.coMakerName, co_maker_marital: data.coMakerMarital,
      co_maker_bday: data.coMakerBday || null,
      co_maker_age: data.coMakerAge ? parseInt(data.coMakerAge) : null,
      co_maker_cell: data.coMakerCell, co_maker_tin: data.coMakerTin,
      co_maker_address: data.coMakerAddress, co_maker_stay: data.coMakerStay,
      co_maker_employer: data.coMakerEmployer, co_maker_position: data.coMakerPosition,
      co_maker_emp_contact: data.coMakerEmpContact, co_maker_emp_address: data.coMakerEmpAddress,
      co_maker_yrs_company: data.coMakerYrsCompany,
      maker_income: data.makerIncome ? parseFloat(String(data.makerIncome).replace(/,/g, '')) : 0,
      co_maker_income: data.coMakerIncome ? parseFloat(String(data.coMakerIncome).replace(/,/g, '')) : 0,
      agent_name: data.agentName, manager_name: data.managerName,
      mode_of_payment: data.modeOfPayment,
      bank_type: data.bankType, bank_name: data.bankName
    });

    dbLog("New Application Submitted", refNo);
  } catch(e) {
    dbLog("FAILED Application Submit: " + e.message, "DB-ERROR");
    throw new Error("Failed to save application. Please try again.");
  }

  // ✅ Emails only run if DB insert succeeded
  const clientMsg = `
    <p>Dear <strong>${data.makerName.toUpperCase()}</strong>,</p>
    <p>Thank you for trusting us. We have officially received your application and our team is ready to process it.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0;">
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Your Reference Number</p>
      <p style="margin: 5px 0 0 0; font-size: 24px; color: #1e3c72; font-weight: bold; letter-spacing: 2px;">${refNo}</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #4a5568;">Target Vehicle: <strong>${data.carModel} ${data.carVariant} (${data.carColor})</strong></p>
    </div>
    <h3 style="color: #1e3c72; font-size: 16px; margin-top: 30px; margin-bottom: 10px;">What's Next?</h3>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 15px;">
    <ul style="padding-left: 20px; color: #4a5568; font-size: 14px; margin-bottom: 30px;">
      <li style="margin-bottom: 10px;">Our credit evaluation team is currently reviewing your details.</li>
      <li style="margin-bottom: 10px;">Please expect an official update within <strong>24 to 48 business hours</strong>.</li>
      <li>We may contact you via your mobile number if additional documents are required.</li>
    </ul>
    <p>Please keep your Reference Number safe. If you have any inquiries, you may reply directly to this email.</p>
    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,<br><strong style="color: #1e3c72;">Vehicle Financing Division</strong></p>
  `;
  
  const adminMsg = `
    <p>Dear <strong>Admin</strong>,</p>
    <p>A new application has been submitted and is currently waiting for your review.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0;">
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Reference Number</p>
      <p style="margin: 5px 0 0 0; font-size: 24px; color: #1e3c72; font-weight: bold; letter-spacing: 2px;">${refNo}</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #4a5568;">Applicant: <strong>${data.makerName}</strong></p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #4a5568;">Target Vehicle: <strong>${data.carModel} ${data.carVariant} (${data.carColor})</strong></p>
    </div>
    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,<br><strong style="color: #1e3c72;">System Automation</strong></p>
  `;

  const internalMsg = `
    <p>Dear <strong>${data.managerName || "Manager"} / ${data.agentName || "Agent"}</strong>,</p>
    <p>A new application has been encoded under your team. Here is the initial overview:</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0;">
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Reference Number: ${refNo}</p>
      <p style="margin: 5px 0 10px 0; font-size: 14px; color: #1e3c72; font-weight: bold;">Applicant: ${data.makerName}</p>
      <p style="margin: 0; font-size: 11px; color: #718096;">Target Vehicle: <strong>${data.carModel} ${data.carVariant} (${data.carColor})</strong></p>
      <p style="margin: 0; font-size: 11px; color: #718096;">Reported Income: PHP ${data.makerIncome}</p>
    </div>
    <p style="color: #4a5568; font-size: 13px;">Please coordinate closely with Admin for the progression of this lead.</p>
  `;

  sendPremiumEmail(data.makerEmail, "Application Received: " + refNo, "DealerHub Application", "Successfully Received", "#1e3c72", clientMsg, null);
  sendPremiumEmail(getAdminEmail(), "[NEW] Submission: " + refNo, "New Application Alert", "Pending Review", "#1e3c72", adminMsg, null);

  let teamEmails = getTeamEmails(data.agentName, data.managerName);
  if(teamEmails.agentEmail) sendPremiumEmail(teamEmails.agentEmail, "[LEAD ALERT] New App: " + refNo, "New Team Lead", "Pending", "#f59e0b", internalMsg, null);
  if(teamEmails.managerEmail && teamEmails.managerEmail !== teamEmails.agentEmail) sendPremiumEmail(teamEmails.managerEmail, "[LEAD ALERT] New App: " + refNo, "New Team Lead", "Pending", "#f59e0b", internalMsg, null);

  return refNo;
}

function updateApplicationStatus(refNo, newStatus, remarks) {
  requireAdmin(); // 🔒 FIX #11
  
  dbUpdate("applications", {
    status: newStatus,
    date_processed: new Date().toISOString(),
    admin_remarks: remarks
  }, { ref_no: "eq." + refNo });

  dbLog("Updated status to " + newStatus, refNo);

  let rows = dbSelect("applications", { ref_no: "eq." + refNo, select: "*" });
  if (rows.length === 0) throw new Error("Record not found.");
  let row = rows[0];

  let color = "#f59e0b"; 
  if (newStatus === "Warm") color = "#eab308";
  else if (newStatus === "Hot") color = "#f97316";
  else if (newStatus === "Approved") color = "#059669"; 
  else if (newStatus === "Good for Release") color = "#10b981"; 
  else if (newStatus === "Released" || newStatus === "Approved & Released") color = "#3b82f6"; 
  else if (newStatus === "Lost Sales" || newStatus === "Rejected") color = "#ef4444";

  const clientMsg = `
    <p>Dear <strong>${row.maker_name.toUpperCase()}</strong>,</p>
    <p>We are writing to inform you that the status of your Dealer Hub Application has been updated.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid ${color}; padding: 20px; margin: 25px 0;">
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Reference Number: ${refNo}</p>
      <p style="margin: 5px 0 10px 0; font-size: 20px; color: ${color}; font-weight: bold;">STATUS: ${newStatus.toUpperCase()}</p>
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Target Vehicle:</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e293b; font-weight: bold;">${row.car_model} ${row.car_variant} (${row.car_color})</p>
    </div>
    <div style="background-color: #f1f5f9; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 20px; margin-bottom: 20px; border-radius: 4px;">
      <h4 style="margin-top: 0; color: #1e3c72; font-size: 14px;">Administrator Remarks:</h4>
      <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.6;">${remarks}</p>
    </div>
    <p>If you have any questions regarding this update, please reply directly to this email.</p>
    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,<br><strong style="color: #1e3c72;">Vehicle Financing Division</strong></p>
  `;
  
  const adminMsg = `
    <p>Dear <strong>Admin</strong>,</p>
    <p>You have successfully processed an application.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid ${color}; padding: 20px; margin: 25px 0;">
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Reference Number: ${refNo}</p>
      <p style="margin: 5px 0 10px 0; font-size: 20px; color: ${color}; font-weight: bold;">UPDATED TO: ${newStatus.toUpperCase()}</p>
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Applicant Name:</p>
      <p style="margin: 5px 0 10px 0; font-size: 14px; color: #1e293b;">${row.maker_name}</p>
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Target Vehicle:</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e293b; font-weight: bold;">${row.car_model} ${row.car_variant} (${row.car_color})</p>
    </div>
    <p style="margin-top: 30px; margin-bottom: 0;">Best regards,<br><strong style="color: #1e3c72;">System Automation</strong></p>
  `;

  const internalMsg = `
    <p>Dear Team,</p>
    <p>The Administrator has officially updated the status of your lead: <strong>${row.maker_name}</strong>.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid ${color}; padding: 20px; margin: 25px 0;">
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700;">Reference Number: ${refNo}</p>
      <p style="margin: 5px 0 10px 0; font-size: 20px; color: ${color}; font-weight: bold;">STATUS: ${newStatus.toUpperCase()}</p>
      <p style="margin: 0; font-size: 11px; color: #718096; text-transform: uppercase; font-weight: 700; margin-top: 15px;">Admin Remarks:</p>
      <p style="margin: 5px 0 0 0; font-size: 13px; color: #1e293b;">${remarks}</p>
    </div>
  `;

  if (newStatus !== "Lost Sales" && newStatus !== "Rejected" && newStatus !== "Hot" && newStatus !== "Warm") {
    sendPremiumEmail(row.maker_email, "Update: Application " + refNo, "Application " + newStatus, newStatus, color, clientMsg, null);
  }
  
  sendPremiumEmail(getAdminEmail(), "[PROCESSED] " + refNo, "Status Update Confirmed", newStatus, color, adminMsg, null);

  let teamEmails = getTeamEmails(row.agent_name, row.manager_name);
  if(teamEmails.agentEmail) sendPremiumEmail(teamEmails.agentEmail, "[" + newStatus.toUpperCase() + "] Update: " + refNo, "Status Update", newStatus, color, internalMsg, null);
  if(teamEmails.managerEmail && teamEmails.managerEmail !== teamEmails.agentEmail) sendPremiumEmail(teamEmails.managerEmail, "[" + newStatus.toUpperCase() + "] Update: " + refNo, "Status Update", newStatus, color, internalMsg, null);

  return "Success";
}

// 🔒 FIX #8 & #14: Save original status + preserve remarks on archive
function archiveApplication(refNo) {
  requireAdmin(); // 🔒 FIX #11
  
  let rows = dbSelect("applications", { ref_no: "eq." + refNo, select: "status,admin_remarks" });
  let prevStatus = rows.length > 0 ? (rows[0].status || "Unknown") : "Unknown";
  let prevRemarks = rows.length > 0 ? (rows[0].admin_remarks || "") : "";
  
  dbUpdate("applications", { 
    status: "Archived", 
    date_processed: new Date().toISOString(), 
    admin_remarks: prevRemarks + (prevRemarks ? "\n" : "") + "[ARCHIVED from " + prevStatus + " on " + new Date().toLocaleString() + "]"
  }, { ref_no: "eq." + refNo });
  
  dbLog("Archived Application (was: " + prevStatus + ")", refNo);
  return "Success";
}

// 🔒 FIX #14: Restore to original status instead of always "Pending"
function restoreApplication(refNo) {
  requireAdmin(); // 🔒 FIX #11
  
  let rows = dbSelect("applications", { ref_no: "eq." + refNo, select: "admin_remarks" });
  let remarks = rows.length > 0 ? (rows[0].admin_remarks || "") : "";
  
  // Extract previous status from archive note
  let prevStatusMatch = remarks.match(/\[ARCHIVED from (.+?) on/);
  let restoreStatus = prevStatusMatch ? prevStatusMatch[1] : "Pending";
  
  // Remove the archive note but keep older remarks
  let cleanRemarks = remarks.replace(/\n?\[ARCHIVED from .+?\]/, '').trim();
  
  dbUpdate("applications", { 
    status: restoreStatus, 
    date_processed: null, 
    admin_remarks: cleanRemarks + (cleanRemarks ? "\n" : "") + "[RESTORED on " + new Date().toLocaleString() + "]"
  }, { ref_no: "eq." + refNo });
  
  dbLog("Restored Application (to: " + restoreStatus + ")", refNo);
  return "Success";
}

// =============================================
// EMAIL ENGINE
// =============================================
function sendPremiumEmail(to, subject, title, statusText, color, messageBody, pdf) {
  const html = `<div style="font-family:'Segoe UI',sans-serif;background:#f4f7f6;padding:40px 20px;"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);"><div style="background:${color};padding:30px;text-align:center;"><h2 style="color:#fff;margin:0;">${title}</h2></div><div style="padding:35px;color:#333;line-height:1.6;font-size:14px;">${messageBody}</div><div style="background:#e2e8f0;padding:25px;text-align:center;font-size:11px;color:#718096;">This is an automated message.</div></div></div>`;
  let mailOptions = { to: to, name: APP_NAME, subject: subject, htmlBody: html };
  if (pdf != null) mailOptions.attachments = [pdf];
  try { MailApp.sendEmail(mailOptions); } catch(e) { dbLog("Email failed to " + to + ": " + e.message, "EMAIL ERROR"); }
}

// =============================================
// AI INSIGHTS
// =============================================
function getAIInsights(stats) {
  requireAdmin(); // 🔒 FIX #11
  
  // 🔒 FIX #9: API key from PropertiesService
  const API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') || "AIzaSyBMhK6X2Ft5iHgE5rADAvIYYCi0lt68-Zw";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;
  const prompt = "You are a financial analyst for DealerHub. Analyze the current dashboard pipeline: Total Leads:" + stats.total + " In Progress:" + stats.pending + " Approved/Released:" + stats.approved + " Lost Sales:" + stats.rejected + ". Give 2-3 short, actionable insights for the sales team.";
  try {
    let res = UrlFetchApp.fetch(url, { method: "post", contentType: "application/json", payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0, topK: 1, topP: 1 } }), muteHttpExceptions: true });
    let json = JSON.parse(res.getContentText());
    if (json.candidates && json.candidates.length > 0) {
      let raw = json.candidates[0].content.parts[0].text;
      return { success: true, data: raw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') };
    }
    return { success: false, error: "No AI response." };
  } catch(e) { return { success: false, error: e.message }; }
}

// =============================================
// 1. AUTHENTICATION (FIX #10 & #11 & #12)
// =============================================
function hashPassword(pass) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pass)
    .map(b => ('0' + (b & 0xFF).toString(16)).slice(-2)).join('');
}

function authenticateAdmin(username, password, recaptchaResponse) {
  // 🔒 FIX #12: reCAPTCHA secret from PropertiesService
  const RECAPTCHA_SECRET = PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET') || "6LcffXosAAAAAFdSjYyC7YqkDQXqjMriaTKDRYnC";
  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
  const options = { method: "post", payload: { secret: RECAPTCHA_SECRET, response: recaptchaResponse } };
  const response = UrlFetchApp.fetch(verifyUrl, options);
  const json = JSON.parse(response.getContentText());
  if (!json.success) return { success: false, message: "Please complete the security check." };

  const validUser = dbGetSetting('ADMIN_USER') || "admin";
  const storedPass = dbGetSetting('ADMIN_PASS') || hashPassword("admin123");
  
  // 🔒 FIX #10: Compare hashed passwords
  // Support both old plaintext and new hashed format
  let passwordMatch = false;
  if (storedPass.length === 64) {
    // New hashed format (SHA-256 = 64 hex chars)
    passwordMatch = (hashPassword(password) === storedPass);
  } else {
    // Legacy plaintext — auto-migrate to hashed on next save
    passwordMatch = (password === storedPass);
  }

  if (username === validUser && passwordMatch) {
    // 🔒 FIX #11: Set server-side session
    PropertiesService.getUserProperties().setProperty('DH_SESSION', 'active');
    dbLog("Successful Admin Login", "SECURITY-AUTH");
    return { success: true };
  } else {
    dbLog("Failed login attempt (Username: " + username + ")", "SECURITY-ALERT");
    return { success: false, message: "Invalid username or password." };
  }
}

function logoutAdmin() {
  PropertiesService.getUserProperties().deleteProperty('DH_SESSION');
  return true;
}

// =============================================
// 2. ADMIN EMAIL
// =============================================
function getAdminEmail() {
  return dbGetSetting('ADMIN_EMAIL') || "workflows@enderuncolleges.com";
}

// =============================================
// 3. LOGS
// =============================================
function logActivity(action, refNo) {
  requireAdmin(); // 🔒 FIX #11
  dbLog(action, refNo);
}

function getLogsData() {
  requireAdmin(); // 🔒 FIX #11
  let data = dbSelect("logs", {
    select: "created_at,ref_no,action,user_name",
    order: "created_at.desc",
    limit: "500"
  });
  return data.map(row => [row.created_at, row.ref_no, row.action, row.user_name]);
}

function clearAllAuditLogs() {
  requireAdmin(); // 🔒 FIX #11
  dbDelete("logs", { id: "gt.0" });
  dbLog("Admin forcefully cleared all audit logs", "SYSTEM-VAULT");
  return "Success";
}

// =============================================
// 4. UPDATE BASIC FIELD (Inline Edit)
// =============================================
function updateBasicField(refNo, fieldId, newValue) {
  requireAdmin(); // 🔒 FIX #11 & #13
  
  const mapping = {
    'md_Name': 'maker_name', 'md_Marital': 'maker_marital',
    'md_Bday': 'maker_bday', 'md_Age': 'maker_age',
    'md_Cell': 'maker_cell', 'md_Tin': 'maker_tin',
    'md_Email': 'maker_email', 'md_Address': 'maker_address',
    'md_Stay': 'maker_stay', 'md_Emp': 'maker_employer',
    'md_Pos': 'maker_position', 'md_EmpCont': 'maker_emp_contact',
    'md_EmpAdd': 'maker_emp_address', 'md_Yrs': 'maker_yrs_company',
    'md_CarModel': 'car_model', 'md_Variant': 'car_variant', 'md_Color': 'car_color',
    'cd_Name': 'co_maker_name', 'cd_Marital': 'co_maker_marital',
    'cd_Bday': 'co_maker_bday', 'cd_Age': 'co_maker_age',
    'cd_Cell': 'co_maker_cell', 'cd_Tin': 'co_maker_tin',
    'cd_Address': 'co_maker_address', 'cd_Stay': 'co_maker_stay',
    'cd_Emp': 'co_maker_employer', 'cd_Pos': 'co_maker_position',
    'cd_EmpCont': 'co_maker_emp_contact', 'cd_EmpAdd': 'co_maker_emp_address',
    'cd_Yrs': 'co_maker_yrs_company',
    'fd_MakerInc': 'maker_income', 'fd_CoInc': 'co_maker_income',
    'fd_Agent': 'agent_name', 'fd_Manager': 'manager_name',
    'fd_MOP': 'mode_of_payment', 'fd_BankType': 'bank_type', 'fd_BankName': 'bank_name'
  };

  let column = mapping[fieldId];
  if (!column) return "Invalid field";

  let updateObj = {};
  updateObj[column] = newValue;
  dbUpdate("applications", updateObj, { ref_no: "eq." + refNo });
  dbLog("Edited field: " + column, refNo);
  return "Success";
}

function updateVehicleData(refNo, model, variant, color) {
  requireAdmin(); // 🔒 FIX #11
  dbUpdate("applications", {
    car_model: model,
    car_variant: variant,
    car_color: color
  }, { ref_no: "eq." + refNo });
  dbLog("Updated Vehicle Details", refNo);
  return true;
}

// =============================================
// 5. ENTERPRISE SETTINGS
// =============================================
function getEnterpriseSettings() {
  requireAdmin(); // 🔒 FIX #11
  
  let allSettings = dbSelect("settings", { select: "key,value" });
  let s = {};
  allSettings.forEach(row => s[row.key] = row.value);

  let catalogData = dbSelect("catalog", { select: "*", order: "brand,model" });
  
  let teamData = dbSelect("team", { select: "*" });
  let teamMap = {};
  teamData.forEach(row => {
    let key = row.manager_name + "_" + row.manager_email;
    if (!teamMap[key]) teamMap[key] = {
      id: row.id, managerName: row.manager_name,
      managerEmail: row.manager_email, status: row.status, agents: []
    };
    if (row.agent_name) teamMap[key].agents.push({ name: row.agent_name, email: row.agent_email });
  });

  let countResult = dbSelect("applications", { select: "id" });

  let lastLoginRows = dbSelect("logs", {
    select: "created_at",
    action: "eq.Successful Admin Login",
    order: "created_at.desc",
    limit: "1"
  });

  return {
    email: s['ADMIN_EMAIL'] || "workflows@enderuncolleges.com",
    formActive: s['FORM_ACTIVE'] !== "false",
    companyName: s['COMPANY_NAME'] || "DealerHub",
    emailSignature: s['EMAIL_SIGNATURE'] || "Vehicle Financing Division",
    maintenanceMsg: s['MAINTENANCE_MSG'] || "Under maintenance.",
    supportContact: s['SUPPORT_CONTACT'] || "+63 XXX XXX XXXX",
    banks: s['PARTNER_BANKS'] || "BDO, BPI, Metrobank",
    retentionDays: s['LOG_RETENTION'] || "30",
    dbTotalRows: countResult ? countResult.length : 0,
    lastLogin: lastLoginRows.length > 0 ? new Date(lastLoginRows[0].created_at).toLocaleString() : "No record",
    catalogMaster: JSON.stringify(catalogData.map(c => ({
      id: c.id, brand: c.brand, model: c.model,
      variant: c.variant, colors: c.colors, status: c.status
    }))),
    teamMaster: JSON.stringify(Object.values(teamMap))
  };
}

function saveEnterpriseGeneral(data) {
  requireAdmin(); // 🔒 FIX #11
  dbSetSetting('FORM_ACTIVE', String(data.formActive));
  dbSetSetting('COMPANY_NAME', data.companyName);
  dbSetSetting('SUPPORT_CONTACT', data.supportContact);
  dbSetSetting('LOG_RETENTION', data.retentionDays);
  dbSetSetting('EMAIL_SIGNATURE', data.emailSignature);
  dbSetSetting('MAINTENANCE_MSG', data.maintenanceMsg);
  dbLog("Updated General System Settings", "SYSTEM");
  return true;
}

function saveEnterpriseLists(models, banks) {
  requireAdmin(); // 🔒 FIX #11
  dbSetSetting('PARTNER_BANKS', banks);
  dbLog("Updated Dropdown Lists", "SYSTEM");
  return true;
}

function saveEnterpriseSecurity(email, user, pass) {
  requireAdmin(); // 🔒 FIX #11
  dbSetSetting('ADMIN_EMAIL', email);
  if (user && pass) {
    dbSetSetting('ADMIN_USER', user);
    // 🔒 FIX #10: Store HASHED password
    dbSetSetting('ADMIN_PASS', hashPassword(pass));
  }
  dbLog("Updated Security Settings", "SECURITY");
  return true;
}

// =============================================
// 6. CATALOG MANAGEMENT (FIX #2)
// =============================================
function saveCarCatalog(catalogMasterJson) {
  requireAdmin(); // 🔒 FIX #11
  
  try {
    let catalogMaster = JSON.parse(catalogMasterJson);
    if (!Array.isArray(catalogMaster)) {
      throw new Error("Invalid Catalog Format: Data is not an array.");
    }
    
    let bulkData = catalogMaster.map(item => ({
      brand: item.brand,
      model: item.model,
      variant: item.variant,
      colors: item.colors,
      status: item.status
    }));

    if (bulkData.length > 0) {
      // 🔒 FIX #2: BACKUP BEFORE DELETE — restore if insert fails
      let backup = dbSelect("catalog", { select: "brand,model,variant,colors,status" });
      
      try {
        dbDelete("catalog", { id: "gt.0" });
        dbInsert("catalog", bulkData);
      } catch(insertError) {
        // EMERGENCY RESTORE: Put back old data
        dbLog("CATALOG INSERT FAILED — Restoring backup (" + backup.length + " items): " + insertError.message, "SYSTEM-EMERGENCY");
        if (backup.length > 0) {
          try { dbInsert("catalog", backup); } catch(restoreError) {
            dbLog("CRITICAL: Catalog restore ALSO failed: " + restoreError.message, "SYSTEM-CRITICAL");
          }
        }
        throw new Error("Catalog sync failed. Previous data has been restored. Error: " + insertError.message);
      }
    }

    dbLog("Sync Car Catalog (Total: " + bulkData.length + ")", "SYSTEM");
    return true;
  } catch(e) {
    throw new Error("Catalog Sync Failed: " + e.message);
  }
}

// =============================================
// 7. TEAM MANAGEMENT (FIX #3)
// =============================================
function getTeamEmails(agentName, managerName) {
  let res = { agentEmail: null, managerEmail: null };
  
  if (agentName) {
    let agtRows = dbSelect("team", { agent_name: "eq." + agentName, select: "agent_email", limit: "1" });
    if (agtRows.length > 0) res.agentEmail = agtRows[0].agent_email;
  }
  if (managerName) {
    let mgrRows = dbSelect("team", { manager_name: "eq." + managerName, select: "manager_email", limit: "1" });
    if (mgrRows.length > 0) res.managerEmail = mgrRows[0].manager_email;
  }
  return res;
}

function saveTeamDirectory(teamMasterJson) {
  requireAdmin(); // 🔒 FIX #11
  
  try {
    let teamMaster = JSON.parse(teamMasterJson);
    if (!Array.isArray(teamMaster)) throw new Error("Invalid Format: Not an array.");
    
    let bulkData = [];
    
    teamMaster.forEach(mgr => {
      if (mgr.agents && mgr.agents.length > 0) {
        mgr.agents.forEach(agt => {
          bulkData.push({
            manager_name: mgr.managerName,
            manager_email: mgr.managerEmail,
            agent_name: agt.name,
            agent_email: agt.email,
            status: mgr.status
          });
        });
      } else {
        bulkData.push({
          manager_name: mgr.managerName,
          manager_email: mgr.managerEmail,
          agent_name: "",
          agent_email: "",
          status: mgr.status
        });
      }
    });

    if (bulkData.length > 0) {
      // 🔒 FIX #3: BACKUP BEFORE DELETE — restore if insert fails
      let backup = dbSelect("team", { select: "manager_name,manager_email,agent_name,agent_email,status" });
      
      try {
        dbDelete("team", { id: "gt.0" });
        dbInsert("team", bulkData);
      } catch(insertError) {
        // EMERGENCY RESTORE
        dbLog("TEAM INSERT FAILED — Restoring backup (" + backup.length + " entries): " + insertError.message, "SYSTEM-EMERGENCY");
        if (backup.length > 0) {
          try { dbInsert("team", backup); } catch(restoreError) {
            dbLog("CRITICAL: Team restore ALSO failed: " + restoreError.message, "SYSTEM-CRITICAL");
          }
        }
        throw new Error("Team sync failed. Previous data has been restored. Error: " + insertError.message);
      }
      
      dbLog("Sync Team Directory (Total Entries: " + bulkData.length + ")", "SYSTEM");
    } else {
      throw new Error("No data processed. Sync aborted to prevent data loss.");
    }

    return true;
  } catch(e) {
    throw new Error("Team Sync Failed: " + e.message);
  }
}

// =============================================
// 8. DATABASE EXPORT & FACTORY RESET (FIX #1)
// =============================================
function getFullDatabaseArray() {
  requireAdmin(); // 🔒 FIX #11
  
  let data = dbSelect("applications", { select: "*", order: "created_at.desc" });
  
  let headers = ["Date", "Ref No", "Status", "Maker Name", "Marital", "Bday", "Age", "Cell", "TIN", "Email", "Address", "Stay", "Employer", "Position", "Emp Contact", "Emp Address", "Yrs Company", "Car Model", "Variant", "Color", "Co-Maker Name", "Co-Marital", "Co-Bday", "Co-Age", "Co-Cell", "Co-TIN", "Co-Address", "Co-Stay", "Co-Employer", "Co-Position", "Co-Emp Contact", "Co-Emp Address", "Co-Yrs", "Maker Income", "Co-Maker Income", "Agent", "Manager", "MOP", "Bank Type", "Bank Name", "Date Processed", "Remarks"];
  
  let rows = data.map(row => convertRowToArray(row));
  return [headers, ...rows];
}

function executeFactoryReset() {
  requireAdmin(); // 🔒 FIX #11
  
  try {
    // 🔒 FIX #1: Use proper filter to keep BOTH Pending AND On Hold
    // The old code had duplicate "status" keys which only kept On Hold!
    dbDelete("applications", { status: "not.in.(Pending,On Hold)" });
    
    dbDelete("logs", { id: "gt.0" });
    dbLog("System Factory Reset Executed", "SYSTEM");
    
    return "Success";
  } catch(e) {
    throw new Error("Reset Failed: " + e.message);
  }
}

// =============================================
// 9. LIVE FORM DATA (Para sa Public Form)
// =============================================
function getLiveDropdownData() {
  let catData = dbSelect("catalog", { select: "*", status: "eq.Active" });
  let compiledObj = {};
  catData.forEach(row => {
    let fullModel = (row.brand + " " + row.model).trim();
    if (!compiledObj[fullModel]) compiledObj[fullModel] = {};
    compiledObj[fullModel][row.variant] = row.colors ? row.colors.split(',').map(c => c.trim()).filter(c => c !== "") : [];
  });

  let tData = dbSelect("team", { select: "*", status: "eq.Active" });
  let teamMap = {};
  tData.forEach(row => {
    if (!teamMap[row.manager_name]) teamMap[row.manager_name] = [];
    if (row.agent_name && !teamMap[row.manager_name].includes(row.agent_name)) {
      teamMap[row.manager_name].push(row.agent_name);
    }
  });

  return {
    carCatalog: JSON.stringify(compiledObj),
    teamHierarchy: JSON.stringify(teamMap)
  };
}

// =============================================
// 10. doGet
// =============================================
function doGet(e) {
  let page = e.parameter.view === 'admin' ? 'Admin' : 'Form';
  
  let formActive = dbGetSetting('FORM_ACTIVE') !== "false";

  if (page === 'Form' && !formActive) {
    let maintMsg = dbGetSetting('MAINTENANCE_MSG') || "Sorry, the portal is currently under maintenance.";
    return HtmlService.createHtmlOutput("<div style='font-family:sans-serif; text-align:center; padding:60px;'><h2>System Maintenance</h2><p>" + maintMsg + "</p></div>").setTitle("DealerHub | Maintenance");
  }

  let iconUrl = 'https://cdn-icons-png.flaticon.com/512/741/741407.png';
  let title = (page === 'Admin') ? 'DealerHub | Administrator' : 'DealerHub | Application Form';

  let template = HtmlService.createTemplateFromFile(page);
  
  if (page === 'Form') {
    let liveData = getLiveDropdownData();
    template.carCatalog = liveData.carCatalog;
    template.banksList = dbGetSetting('PARTNER_BANKS') || "BDO Unibank, BPI, Metrobank";
    template.teamHierarchy = liveData.teamHierarchy;
  }

  return template.evaluate()
    .setTitle(title)
    .setFaviconUrl(iconUrl)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// =============================================
// AI RISK ASSESSMENT ENGINE
// =============================================

function getAIRiskRules() {
  return {
    minIncome: parseInt(dbGetSetting('AI_MIN_INCOME') || '30000'),
    minAge: parseInt(dbGetSetting('AI_MIN_AGE') || '21'),
    maxAge: parseInt(dbGetSetting('AI_MAX_AGE') || '65'),
    minEmploymentYears: parseInt(dbGetSetting('AI_MIN_EMPLOYMENT_YEARS') || '1'),
    requireCoMaker: dbGetSetting('AI_REQUIRE_COMAKER') === 'true',
    requireTIN: dbGetSetting('AI_REQUIRE_TIN') === 'true',
    customRules: dbGetSetting('AI_CUSTOM_RULES') || ''
  };
}

function analyzeApplication(refNo) {
  requireAdmin(); // 🔒 FIX #11
  
  let rows = dbSelect("applications", { ref_no: "eq." + refNo, select: "*" });
  if (rows.length === 0) throw new Error("Record not found.");
  let app = rows[0];
  let rules = getAIRiskRules();

  let flags = [];
  let income = parseFloat(app.maker_income) || 0;
  let coIncome = parseFloat(app.co_maker_income) || 0;
  let totalIncome = income + coIncome;
  let age = parseInt(app.maker_age) || 0;
  let yrsCompany = parseFloat(app.maker_yrs_company) || 0;

  if (income < rules.minIncome) flags.push("Maker income (PHP " + income.toLocaleString() + ") is below minimum threshold of PHP " + rules.minIncome.toLocaleString());
  if (age < rules.minAge) flags.push("Applicant age (" + age + ") is below minimum of " + rules.minAge);
  if (age > rules.maxAge) flags.push("Applicant age (" + age + ") exceeds maximum of " + rules.maxAge);
  if (yrsCompany < rules.minEmploymentYears) flags.push("Employment tenure (" + yrsCompany + " yrs) is below minimum of " + rules.minEmploymentYears + " year(s)");
  if (rules.requireTIN && (!app.maker_tin || app.maker_tin === "N/A")) flags.push("TIN number is missing (required by policy)");
  if (rules.requireCoMaker && (!app.co_maker_name || app.co_maker_name === "N/A" || app.co_maker_name === "")) flags.push("Co-Maker is required but not provided");
  if (!app.maker_employer || app.maker_employer === "N/A" || app.maker_employer === "") flags.push("No employer information provided");
  if (!app.maker_email || app.maker_email === "N/A") flags.push("No email address provided");

  let fields = [app.maker_name, app.maker_marital, app.maker_bday, app.maker_cell, app.maker_tin, app.maker_email, app.maker_address, app.maker_employer, app.maker_position, app.maker_yrs_company];
  let filled = fields.filter(f => f && f !== "" && f !== "N/A" && f !== "null").length;
  let completeness = Math.round((filled / fields.length) * 100);

  let prompt = `You are a senior credit risk analyst for a vehicle financing company called DealerHub in the Philippines.

APPLICANT DATA:
- Full Name: ${app.maker_name || "N/A"}
- Age: ${age}
- Marital Status: ${app.maker_marital || "N/A"}
- Monthly Income: PHP ${income.toLocaleString()}
- Co-Maker Income: PHP ${coIncome.toLocaleString()}
- Combined Monthly Income: PHP ${totalIncome.toLocaleString()}
- Employer: ${app.maker_employer || "N/A"}
- Position: ${app.maker_position || "N/A"}
- Years in Company: ${app.maker_yrs_company || "N/A"}
- TIN: ${app.maker_tin ? "Provided" : "Missing"}
- Home Address: ${app.maker_address || "N/A"}
- Target Vehicle: ${app.car_model} ${app.car_variant} (${app.car_color})
- Mode of Payment: ${app.mode_of_payment || "N/A"}
- Preferred Bank: ${app.bank_name || "N/A"}
- Co-Maker Name: ${app.co_maker_name || "None"}
- Co-Maker Employer: ${app.co_maker_employer || "None"}
- Document Completeness: ${completeness}%

SYSTEM RED FLAGS DETECTED:
${flags.length > 0 ? flags.map((f, i) => (i+1) + ". " + f).join("\n") : "None detected."}

COMPANY CUSTOM RULES:
${rules.customRules || "No additional rules."}

TASK:
1. Assign a RISK SCORE: LOW RISK, MEDIUM RISK, or HIGH RISK
2. Give an APPROVAL RECOMMENDATION: RECOMMEND APPROVE, RECOMMEND WITH CONDITIONS, or RECOMMEND DENY
3. Provide exactly 3-4 bullet points explaining your reasoning
4. If RECOMMEND WITH CONDITIONS, specify what conditions

RESPOND IN THIS EXACT FORMAT:
RISK: [LOW RISK/MEDIUM RISK/HIGH RISK]
RECOMMENDATION: [RECOMMEND APPROVE/RECOMMEND WITH CONDITIONS/RECOMMEND DENY]
ANALYSIS:
- [Point 1]
- [Point 2]
- [Point 3]
- [Point 4 - optional]
CONDITIONS: [Only if RECOMMEND WITH CONDITIONS, otherwise write "None"]`;

  // 🔒 FIX #9: API key from PropertiesService
  const API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY') || "AIzaSyBMhK6X2Ft5iHgE5rADAvIYYCi0lt68-Zw";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY;

  try {
    let res = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      muteHttpExceptions: true
    });

    let json = JSON.parse(res.getContentText());
    if (!json.candidates || json.candidates.length === 0) throw new Error("No AI response");

    let raw = json.candidates[0].content.parts[0].text;

    let riskMatch = raw.match(/RISK:\s*(LOW RISK|MEDIUM RISK|HIGH RISK)/i);
    let riskScore = riskMatch ? riskMatch[1].toUpperCase() : "MEDIUM RISK";

    dbUpdate("applications", {
      risk_score: riskScore,
      risk_analysis: raw
    }, { ref_no: "eq." + refNo });

    dbLog("AI Risk Assessment: " + riskScore, refNo);

    return {
      success: true,
      riskScore: riskScore,
      analysis: raw.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>').replace(/•/g, '&#8226;'),
      flags: flags,
      completeness: completeness
    };

  } catch(e) {
    return { success: false, error: e.message };
  }
}

function batchAnalyzePending() {
  requireAdmin(); // 🔒 FIX #11
  
  let allApps = dbSelect("applications", {
    select: "ref_no,status,risk_score"
  });
  
  let needsAnalysis = allApps.filter(app => 
    (app.status === "Warm" || app.status === "Pending" || app.status === "Hot" || app.status === "On Hold") && 
    (!app.risk_score || app.risk_score === "")
  ).slice(0, 10);

  let results = [];
  needsAnalysis.forEach(app => {
    try {
      let result = analyzeApplication(app.ref_no);
      results.push({ ref: app.ref_no, score: result.riskScore });
      Utilities.sleep(2000);
    } catch(e) {
      results.push({ ref: app.ref_no, error: e.message });
    }
  });

  return results;
}

function saveAIRiskRules(rulesObj) {
  requireAdmin(); // 🔒 FIX #11
  dbSetSetting('AI_MIN_INCOME', String(rulesObj.minIncome));
  dbSetSetting('AI_MIN_AGE', String(rulesObj.minAge));
  dbSetSetting('AI_MAX_AGE', String(rulesObj.maxAge));
  dbSetSetting('AI_MIN_EMPLOYMENT_YEARS', String(rulesObj.minEmploymentYears));
  dbSetSetting('AI_REQUIRE_COMAKER', String(rulesObj.requireCoMaker));
  dbSetSetting('AI_REQUIRE_TIN', String(rulesObj.requireTIN));
  dbSetSetting('AI_CUSTOM_RULES', rulesObj.customRules);
  dbLog("Updated AI Risk Assessment Rules", "SYSTEM-AI");
  return true;
}

function getAIRiskSettings() {
  requireAdmin(); // 🔒 FIX #11
  return getAIRiskRules();
}

// =============================================
// MIGRATION HELPER: One-time password hash migration
// Run this once after deploying the fixed code
// =============================================
function migratePasswordToHash() {
  let currentPass = dbGetSetting('ADMIN_PASS');
  if (currentPass && currentPass.length !== 64) {
    // Still plaintext, migrate to SHA-256
    dbSetSetting('ADMIN_PASS', hashPassword(currentPass));
    dbLog("Migrated admin password to SHA-256 hash", "SECURITY-MIGRATION");
    return "Password hashed successfully.";
  }
  return "Password already hashed.";
}

// =============================================
// SETUP HELPER: Store secrets in PropertiesService
// Run this once to move API keys out of source code
// =============================================
function setupSecrets() {
  let props = PropertiesService.getScriptProperties();
  // Only set if not already configured
  if (!props.getProperty('GEMINI_API_KEY')) {
    props.setProperty('GEMINI_API_KEY', 'AIzaSyBMhK6X2Ft5iHgE5rADAvIYYCi0lt68-Zw');
  }
  if (!props.getProperty('RECAPTCHA_SECRET')) {
    props.setProperty('RECAPTCHA_SECRET', '6LcffXosAAAAAFdSjYyC7YqkDQXqjMriaTKDRYnC');
  }
  return "Secrets stored in PropertiesService. You can now remove them from Code.gs.";
}
