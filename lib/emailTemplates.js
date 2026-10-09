export function elegantEmail(emoji, title, subtitle, body) {
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="background:#f0f4f8;margin:0;padding:0;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px"><tr><td align="center"><table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)"><tr><td style="background:linear-gradient(135deg,#0a1628,#0e4d8a);padding:36px 40px;text-align:center"><div style="font-size:36px;margin-bottom:12px">EMOJI</div><div style="font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Selective Crew</div><div style="font-size:22px;font-weight:800;color:#fff">TITLE</div><div style="font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px">SUBTITLE</div></td></tr><tr><td style="padding:40px">BODY</td></tr><tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e8eef8;text-align:center"><p style="font-size:12px;color:#94a3b8;line-height:1.8;margin:0">Selective Crew Recruitment Team &nbsp;·&nbsp; careers@selectivecrew.com<br>selectivecrew.com &nbsp;·&nbsp; WhatsApp: +57 318 847 4058</p></td></tr></table></td></tr></table></body></html>';
  html = html.replace('EMOJI', emoji).replace('TITLE', title).replace('SUBTITLE', subtitle || '').replace('BODY', body);
  return html;
}
export function getVideoEmail(name, email, applicationId) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p><p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>Please watch the following mandatory video before your interview. You will be asked about its content.</p><div style='background:#f0f7ff;border-radius:10px;padding:28px;margin:0 0 24px;text-align:center'><div style='font-size:40px;margin-bottom:16px'>&#9654;&#65039;</div><a href='https://app.altrulabs.com/player/14091370' target='_blank' style='display:inline-block;background:linear-gradient(135deg,#0a1628,#0e4d8a);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none'>Watch Video Now &#8594;</a></div><p style='font-size:14px;color:#374151;margin:0'>Questions? WhatsApp: <strong>+57 318 847 4058</strong></p>" +
    "<div style='background:#fffbeb;border-radius:10px;padding:18px 22px;margin:24px 0 0;border:2px solid #f59e0b;border-left:6px solid #d97706'><p style='font-size:15px;font-weight:800;color:#b45309;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px'>&#9888;&#65039; Action Required</p><p style='font-size:14px;color:#92400e;line-height:1.7;margin:0'>After watching the video, you <strong>MUST click the &quot;I have watched the video&quot; button below</strong> to confirm you watched it. <strong>If you do not click the button, you will not be contacted again.</strong></p></div>" +
    "<div style='text-align:center;margin:24px 0;padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0'><p style='font-size:14px;color:#16a34a;margin:0 0 12px;font-weight:600'>After watching the video, please confirm below:</p><a href='https://selectivecrew.com/confirmed?id=" + encodeURIComponent(applicationId||'') + "&type=video' style='display:inline-block;background:#16a34a;color:#fff;font-size:14px;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none'>&#10003; I have watched the video</a></div>";
  return elegantEmail("&#127916;", "Mandatory Pre-Interview Video", "Please watch before your interview", body);
}

export function getOmniaEmail(name, email, applicationId) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p><p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>Please complete the <strong>Omnia Personality Assessment</strong>. It takes 10-15 minutes. There are no right or wrong answers.</p><div style='background:#f5f3ff;border-radius:10px;padding:28px;margin:0 0 24px;text-align:center'><div style='font-size:40px;margin-bottom:16px'>&#128221;</div><a href='https://ois5.omniagroup.com/profile/client_profile.php?clientid=23-10585&cpid=894' target='_blank' style='display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none'>Start Assessment &#8594;</a></div><p style='font-size:14px;color:#374151;margin:0'>Questions? WhatsApp: <strong>+57 318 847 4058</strong></p>" +
    "<div style='background:#fffbeb;border-radius:10px;padding:18px 22px;margin:24px 0 0;border:2px solid #f59e0b;border-left:6px solid #d97706'><p style='font-size:15px;font-weight:800;color:#b45309;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px'>&#9888;&#65039; Action Required</p><p style='font-size:14px;color:#92400e;line-height:1.7;margin:0'>After completing the assessment, you <strong>MUST click the &quot;I have completed the assessment&quot; button below</strong> to confirm completion. <strong>If you do not click the button, you will not be contacted again.</strong></p></div>" +
    "<div style='text-align:center;margin:24px 0;padding:16px;background:#f0f7ff;border-radius:10px;border:1px solid #bfdbfe'><p style='font-size:14px;color:#0e4d8a;margin:0 0 12px;font-weight:600'>After completing the assessment, please confirm below:</p><a href='https://selectivecrew.com/confirmed?id=" + encodeURIComponent(applicationId||'') + "&type=omnia' style='display:inline-block;background:#0e4d8a;color:#fff;font-size:14px;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none'>&#10003; I have completed the assessment</a></div>";
  return elegantEmail("&#128202;", "Omnia Personality Assessment", "Complete before your interview", body);
}

export function getVisaEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>__NAME__</strong>,</p>\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Congratulations! You've been selected for a potential employment opportunity with <strong>Starboard Cruise Services</strong> (International Cruise Shops, LTD.).</p>\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Attached you will find your <strong>Letter of Employment (LOE)</strong>, which is required to support your C1/D visa application. Please note: this LOE is only for visa purposes and does not guarantee a job assignment at this stage. Once your visa is approved, we will issue your official assignment and employment contract.</p>\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px'>Action Required</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'><strong>1.</strong> Apply for your C1/D visa immediately at your nearest U.S. Embassy.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'><strong>2.</strong> Carefully follow all Embassy instructions and ensure your DS-160 and interview responses are consistent with your LOE.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'><strong>3.</strong> Read the attached C1/D Visa Guide before starting your application. It contains step-by-step instructions, common interview questions, and important tips to avoid mistakes.</p>\n</div>\n<div style='background:#fffbeb;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #f59e0b'>\n<p style='font-size:14px;color:#92400e;margin:0'><strong>Next Step:</strong> Once you have your visa appointment date, please inform us right away so we can track your progress.</p>\n</div>\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>If you have any questions, do not hesitate to reach out. We look forward to officially welcoming you aboard soon!</p>".replace('__NAME__', name || '');
  return elegantEmail('✈', 'C1/D Visa - Letter of Employment', 'Required for cruise ship employment', body);
  body = body.replace('__NAME__', name || '');
  return elegantEmail('✈', 'C1/D Visa - Letter of Employment', 'Required for cruise ship employment', body);
}

export function getFinalPrepEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p><p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>Congratulations on reaching your final interview! Please watch this preparation video before your interview.</p><div style='background:#f0fdf4;border-radius:10px;padding:28px;margin:0 0 16px;text-align:center'><a href='https://www.youtube.com/watch?v=wdwPuFeeWEw' target='_blank' style='display:inline-block;background:linear-gradient(135deg,#15803d,#16a34a);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none'>Watch Preparation Video &#8594;</a></div><div style='background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 16px'><ul style='padding-left:20px;color:#374151;font-size:14px;line-height:2.2'><li>Join the call <strong>5 minutes early</strong></li><li>Use a quiet place with <strong>good lighting</strong></li><li>Dress <strong>professionally</strong></li><li>Have your <strong>passport ready</strong></li><li>Speak in <strong>English</strong></li></ul></div><p style='font-size:14px;color:#374151;margin:0'>Cannot attend? WhatsApp: <strong>+57 318 847 4058</strong></p>";
  return elegantEmail("&#127942;", "Final Interview Preparation", "You are almost there!", body);
}

export function getSecurityEmail(name) {
  var body = "<p style='font-size:18px;color:#0A2540;margin-top:0'><strong>Dear " + name + ",</strong></p><p style='line-height:1.6'>Congratulations on being selected. The <strong>Security Awareness Course</strong> is mandatory for all embarking crew members and must be presented upon signing on to the ship.</p><p>Complete the course online at your own pace before your departure date:</p><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:30px 0'><a href='https://shipservice.pro/security-awareness-asynchronous-course' target='_blank' style='background-color:#0A2540;color:#fff;text-decoration:none;padding:14px 32px;border-radius:4px;display:inline-block;font-weight:600;font-size:16px'>Take the Online Course</a></td></tr></table><p>If you already have a valid certificate, bring the original physical document for embarkation.</p><p>Warm regards,<br><strong>The Recruitment Team</strong><br>Selective Crew</p>";
  return "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:40px 15px;background:#f4f6f9;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:600px;background:#fff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.05);overflow:hidden'><tr><td align='center' style='background-color:#0A2540;padding:35px 20px'><h1 style='margin:0;font-size:26px;font-weight:600;color:#fff;letter-spacing:1px'>Selective Crew</h1></td></tr><tr><td style='padding:40px 35px;color:#333;line-height:1.6;font-size:16px'>" + body + "</td></tr><tr><td align='center' style='background:#f8fafc;padding:25px 20px;color:#888;font-size:13px;border-top:1px solid #e2e8f0'><p style='margin:0'>2026 Selective Crew. All rights reserved.</p></td></tr></table></td></tr></table>";
}

export function getSTCWEmail(name) {
  var body = "<p style='font-size:18px;color:#0A2540;margin-top:0'><strong>Dear " + name + ",</strong></p><p style='line-height:1.6'>Congratulations on your selection to join <strong>Virgin Voyages</strong>! All crew members are required to hold a valid <strong>Basic STCW Certificate</strong> before boarding.</p><div style='background:#f0f4ff;border-left:4px solid #0A2540;border-radius:0 8px 8px 0;padding:20px 24px;margin:20px 0'><p style='font-size:14px;font-weight:700;color:#0A2540;margin:0 0 8px'>What is the Basic STCW?</p><p style='font-size:14px;color:#555;margin:0;line-height:1.7'>An internationally recognized maritime safety training covering personal survival, fire prevention, first aid, and personal safety responsibilities onboard.</p></div><p>Complete the course online before your departure:</p><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:30px 0'><a href='https://shipservice.pro/basic-stcws-asynchronous-course' target='_blank' style='background-color:#0A2540;color:#fff;text-decoration:none;padding:14px 32px;border-radius:4px;display:inline-block;font-weight:600;font-size:16px'>Take the Basic STCW Course</a></td></tr></table><div style='background:#fff8e1;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 24px'><p style='font-size:14px;color:#92400e;margin:0'>If you already have a valid Basic STCW Certificate, bring the original physical document for embarkation.</p></div><p>Warm regards,<br><strong>The Recruitment Team</strong><br>Selective Crew</p>";
  return "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:40px 15px;background:#f4f6f9;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif'><table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:600px;background:#fff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.05);overflow:hidden'><tr><td align='center' style='background-color:#0A2540;padding:35px 20px'><h1 style='margin:0;font-size:26px;font-weight:600;color:#fff;letter-spacing:1px'>Selective Crew</h1><p style='margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.75)'>Virgin Voyages Deployment</p></td></tr><tr><td style='padding:40px 35px;color:#333;line-height:1.6;font-size:16px'>" + body + "</td></tr><tr><td align='center' style='background:#f8fafc;padding:25px 20px;color:#888;font-size:13px;border-top:1px solid #e2e8f0'><p style='margin:0'>2026 Selective Crew. All rights reserved.</p></td></tr></table></td></tr></table>";
}

export function getSBBody(name, email, applicationId) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>I appreciate your interest in joining <strong>Starboard Cruise Services</strong>, a leading retail operator on board some of the world's most prestigious cruise lines.</p>" +
    "<div style='background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#0e4d8a;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>Compensation Package</div>" +
      "<table width='100%' cellpadding='0' cellspacing='0'>" +
        "<tr><td style='padding:8px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151'>Basic Salary</td><td style='padding:8px 0;border-bottom:1px solid #dbeafe;font-size:14px;font-weight:700;color:#0e4d8a;text-align:right'>USD 900 / month</td></tr>" +
        "<tr><td style='padding:8px 0;font-size:14px;color:#374151'>Commissions</td><td style='padding:8px 0;font-size:14px;font-weight:700;color:#0e4d8a;text-align:right'>Based on sales performance</td></tr>" +
      "</table>" +
      "<div style='background:#fffbeb;border-radius:8px;padding:12px 16px;margin-top:14px;border:1px solid #fde68a'>" +
        "<p style='font-size:13px;color:#92400e;margin:0'><strong>Important Note:</strong> During the first month you will undergo on-the-job training. Commissions begin from the second month onwards.</p>" +
      "</div>" +
      "<ul style='padding-left:20px;color:#374151;font-size:14px;line-height:2.2;margin:14px 0 0'>" +
        "<li>Accommodation onboard is completely <strong>FREE</strong> - no rent or utility bills to pay</li>" +
        "<li>All meals are provided <strong>FREE</strong> of charge while onboard</li>" +
        "<li>No living expenses during your contract</li>" +
      "</ul>" +
    "</div>" +
    "<div style='background:#fef2f2;border-radius:10px;padding:24px;margin:0 0 16px;border:1px solid #fecaca'>" +
      "<div style='font-size:13px;font-weight:800;color:#b91c1c;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>Important Notes</div>" +
      "<ul style='padding-left:20px;color:#374151;font-size:14px;line-height:2.2;margin:0'>" +
        "<li>Medical examinations are valid for two years</li>" +
        "<li>Medical examination costs are <strong>NOT</strong> reimbursable</li>" +
        "<li>STCW Basic Safety Training costs are <strong>NOT</strong> reimbursable</li>" +
        "<li>These are candidate responsibilities as part of joining requirements</li>" +
      "</ul>" +
    "</div>" +
    "<div style='background:#f0fdf4;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#15803d;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>Onboarding Requirements</div>" +
      "<ol style='padding-left:20px;color:#374151;font-size:14px;line-height:2.4;margin:0'>" +
        "<li>C1/D Visa at the US Embassy <span style='color:#64748b'>(reimbursed onboard)</span></li>" +
        "<li>Full medical exam by an approved doctor</li>" +
        "<li>Security Awareness course <span style='color:#64748b'>(Royal Caribbean / Celebrity / Carnival)</span> or STCW Courses <span style='color:#64748b'>(Virgin Voyages)</span></li>" +
      "</ol>" +
    "</div>" +
    "<div style='background:#f5f3ff;border-radius:10px;padding:16px 20px;margin:0 0 12px'>" +
      "<p style='font-size:14px;color:#7c3aed;margin:0'><strong>Travel:</strong> All flights provided by Starboard Cruise Services.</p>" +
    "</div>" +
    "<div style='background:#fff7ed;border-radius:10px;padding:16px 20px;margin:0 0 24px;border:1px solid #fed7aa'>" +
      "<p style='font-size:14px;color:#c2410c;margin:0'><strong>Key Requirement:</strong> Face-to-face retail sales experience is required.</p>" +
    "</div>" +
    "<div style='background:#f0f7ff;border-radius:10px;padding:16px 20px;margin:0 0 28px'>" +
      "<p style='font-size:14px;color:#0e4d8a;margin:0'><strong>Next Steps:</strong> Please click the button below to confirm you wish to continue with your application.</p>" +
    "</div>" +
    "<div style='background:#fffbeb;border-radius:10px;padding:18px 22px;margin:0 0 20px;border:2px solid #f59e0b;border-left:6px solid #d97706'>" +
      "<p style='font-size:15px;font-weight:800;color:#b45309;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px'>&#9888;&#65039; Action Required</p>" +
      "<p style='font-size:14px;color:#92400e;line-height:1.7;margin:0'>You <strong>MUST click the &quot;Yes, I wish to continue&quot; button below</strong> to confirm that you wish to continue with your application. <strong>If you do not click the button, you will not be contacted again.</strong></p>" +
    "</div>" +
    "<div style='text-align:center'>" +
      "<a href='https://selectivecrew.com/sb-interested?id=" + encodeURIComponent(applicationId||'') + "' style='display:inline-block;background:linear-gradient(135deg,#0a1628,#0e4d8a);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none'>Yes, I wish to continue &#8594;</a>" +
    "</div>";
  return elegantEmail("&#9875;", "Starboard Cruise Services", "Retail Sales Associate Opportunity", body);
}

export function getNclPhotoBody(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p><p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>Join NCL as a <strong>Shipboard Photographer</strong> and turn your passion into a global adventure.</p><div style='background:#f0fdf9;border-radius:10px;padding:24px;margin:0 0 16px'><ul style='padding-left:20px;color:#374151;font-size:14px;line-height:2.2'><li>USD 1,000/month + commission</li><li>Free accommodation and meals</li><li>Paid flights to/from ship</li><li>Travel the world</li><li>Career growth opportunities</li></ul></div><div style='text-align:center;margin:24px 0'><a href='mailto:careers@selectivecrew.com' style='display:inline-block;background:linear-gradient(135deg,#0a1628,#0e4d8a);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none'>I Am Interested &#8594;</a></div>";
  return elegantEmail("&#128247;", "NCL Shipboard Photographer", "Norwegian Cruise Line Opportunity", body);
}

export function getRCLCELMedicalEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>To help you prepare for upcoming opportunities, we recommend that you begin your pre-employment medical examinations in advance. Please find the relevant information and instructions below.</p>" +

    "<div style='background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#0e4d8a;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>1. Laboratory Examinations</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 12px'>Please complete your laboratory tests at the following clinic:</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse'>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b;width:140px'>Clinic</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151;font-weight:600'>Bio Clinique Pasteur</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b'>Address</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151'>Calle 34 # 13A-96, 2nd floor, Bogota</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b'>Phone</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151'>601 288 7176</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b'>Mobile</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151'>314 419 0182</td></tr>" +
        "<tr><td style='padding:6px 0;font-size:14px;color:#64748b'>Contact</td><td style='padding:6px 0;font-size:14px;color:#374151'>Nurse Leonor Mendez</td></tr>" +
      "</table>" +
    "</div>" +

    "<div style='background:#f5f3ff;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#7c3aed;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>2. Doctor's Appointment</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 12px'>Once you have all laboratory results printed or saved, schedule a medical appointment with the following doctor:</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse'>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b;width:140px'>Doctor</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151;font-weight:600'>Dr. Vladimir Baron</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b'>Address</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151'>Calle 127 # 20-78, Office 417</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b'>Phone</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151'>601 759 9757</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b'>Mobile</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151'>316 470 7458</td></tr>" +
        "<tr><td style='padding:6px 0;font-size:14px;color:#64748b'>Appointments</td><td style='padding:6px 0;font-size:14px;color:#374151'>Angelica (Secretary) - WhatsApp: +57 316 470 7458</td></tr>" +
      "</table>" +
      "<div style='background:#ede9fe;border-radius:8px;padding:12px 16px;margin-top:14px'>" +
        "<p style='font-size:13px;color:#6d28d9;margin:0'>Please bring or send all lab results to the doctor on the day of your consultation.</p>" +
      "</div>" +
    "</div>" +

    "<div style='background:#f0fdf4;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#15803d;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>3. How to Submit Your Documents</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 16px'>After your medical process is fully completed, please send your documents electronically using the structure below:</p>" +

      "<div style='background:#fff;border-radius:8px;padding:16px 20px;margin:0 0 12px;border:1px solid #bbf7d0'>" +
        "<p style='font-size:13px;font-weight:800;color:#15803d;margin:0 0 10px'>A. One Combined PDF File (Medical Book) - in this order:</p>" +
        "<ol style='padding-left:20px;color:#374151;font-size:14px;line-height:2'>" +
          "<li>All cruise line medical forms</li>" +
          "<li>All laboratory test results</li>" +
          "<li>All vaccination records</li>" +
        "</ol>" +
      "</div>" +

      "<div style='background:#fff;border-radius:8px;padding:16px 20px;margin:0 0 16px;border:1px solid #bbf7d0'>" +
        "<p style='font-size:13px;font-weight:800;color:#15803d;margin:0 0 10px'>B. Four Separate PDF Files:</p>" +
        "<ol style='padding-left:20px;color:#374151;font-size:14px;line-height:2'>" +
          "<li>Visa copy</li>" +
          "<li>Police clearance certificate</li>" +
          "<li>Passport copy</li>" +
          "<li>Medical certificate</li>" +
        "</ol>" +
      "</div>" +

      "<div style='background:#fef9ec;border-radius:8px;padding:14px 18px;border:1px solid #fde68a'>" +
        "<p style='font-size:13px;font-weight:700;color:#92400e;margin:0 0 6px'>File Naming Convention:</p>" +
        "<p style='font-size:13px;color:#374151;margin:0'><strong>[Your Full Name] - [Document Type]</strong><br>Example: <em>John Doe - Cruise Line Medicals</em></p>" +
      "</div>" +
    "</div>" +

    "<div style='background:#f0f7ff;border-radius:10px;padding:16px 20px;margin:0 0 24px'>" +
      "<p style='font-size:14px;color:#0e4d8a;margin:0'>Once your medicals are complete and files submitted, please let us know so we can update your application status.</p>" +
    "</div>" +

    "<p style='font-size:14px;color:#374151;margin:0'>Questions? WhatsApp: <strong>+57 318 847 4058</strong></p>";

  return "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:40px 15px;background:#f4f6f9;font-family:Arial,sans-serif'>" +
    "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)'>" +
    "<tr><td style='background:linear-gradient(135deg,#0a1628,#0e4d8a);padding:36px 40px;text-align:center'>" +
      "<div style='font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px'>Selective Crew</div>" +
      "<div style='font-size:22px;font-weight:800;color:#fff'>Pre-Employment Medical Guide</div>" +
      "<div style='font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px'>RCL &amp; CEL - Important Instructions</div>" +
    "</td></tr>" +
    "<tr><td style='padding:40px'>" + body + "</td></tr>" +
    "<tr><td style='background:#f8fafc;padding:20px 40px;border-top:1px solid #e8eef8;text-align:center'>" +
      "<p style='font-size:12px;color:#94a3b8;line-height:1.8;margin:0'>Selective Crew Recruitment Team &nbsp;&#183;&nbsp; careers@selectivecrew.com<br>selectivecrew.com &nbsp;&#183;&nbsp; WhatsApp: +57 318 847 4058</p>" +
    "</td></tr>" +
    "</table></td></tr></table>";
}
export function getVirginVoyagesMedicalEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>To move forward with your application, please find below the information you need to complete your pre-employment medical examinations.</p>" +

    "<div style='background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#0e4d8a;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>1. Laboratory Examinations</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 12px'>Please complete your laboratory tests at the following clinic:</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse'>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b;width:140px'>Clinic</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151;font-weight:600'>Bio Clinico Pasteur</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b'>Address</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151'>Calle 34 # 13A-96, 2nd floor, Bogota, Colombia</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b'>Phone</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151'>601 288 7176</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b'>Mobile</td><td style='padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151'>314 419 0182</td></tr>" +
        "<tr><td style='padding:6px 0;font-size:14px;color:#64748b'>Contact</td><td style='padding:6px 0;font-size:14px;color:#374151'>Nurse Leonor Mendez</td></tr>" +
      "</table>" +
    "</div>" +

    "<div style='background:#f5f3ff;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#7c3aed;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>2. Doctor's Appointment</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 12px'>Once all laboratory tests are completed and you have the results, schedule a medical appointment with the following doctor:</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0' style='border-collapse:collapse'>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b;width:140px'>Doctor</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151;font-weight:600'>Dr. Andres De Vivero Camacho</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b'>Clinic</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151'>Clinica Marly</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b'>Address</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151'>Carrera 13 # 49-40, Office 210, Bogota, Colombia</td></tr>" +
        "<tr><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b'>Contact</td><td style='padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151'>Nubia (Doctor's assistant)</td></tr>" +
        "<tr><td style='padding:6px 0;font-size:14px;color:#64748b'>WhatsApp</td><td style='padding:6px 0;font-size:14px;color:#374151'>318 401 4131</td></tr>" +
      "</table>" +
      "<div style='background:#ede9fe;border-radius:8px;padding:12px 16px;margin-top:14px'>" +
        "<p style='font-size:13px;color:#6d28d9;margin:0'>Please bring or send all lab results to the doctor on the day of your consultation.</p>" +
      "</div>" +
    "</div>" +

    "<div style='background:#f0fdf4;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#15803d;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>3. Document Submission Format</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 16px'>After your medical process is fully completed, please send your documents electronically using the structure below:</p>" +

      "<div style='background:#fff;border-radius:8px;padding:16px 20px;margin:0 0 12px;border:1px solid #bbf7d0'>" +
        "<p style='font-size:13px;font-weight:800;color:#15803d;margin:0 0 10px'>A. One Combined PDF File (Medical Book) - in this order:</p>" +
        "<ol style='padding-left:20px;color:#374151;font-size:14px;line-height:2'>" +
          "<li>All cruise line medical forms</li>" +
          "<li>All laboratory test results</li>" +
          "<li>All vaccination records</li>" +
        "</ol>" +
      "</div>" +

      "<div style='background:#fff;border-radius:8px;padding:16px 20px;margin:0 0 16px;border:1px solid #bbf7d0'>" +
        "<p style='font-size:13px;font-weight:800;color:#15803d;margin:0 0 10px'>B. Four Separate PDF Files:</p>" +
        "<ol style='padding-left:20px;color:#374151;font-size:14px;line-height:2'>" +
          "<li>Visa copy</li>" +
          "<li>Police clearance certificate</li>" +
          "<li>Passport copy</li>" +
          "<li>Medical certificate</li>" +
        "</ol>" +
      "</div>" +

      "<div style='background:#fef9ec;border-radius:8px;padding:14px 18px;border:1px solid #fde68a'>" +
        "<p style='font-size:13px;font-weight:700;color:#92400e;margin:0 0 8px'>File Naming Convention:</p>" +
        "<p style='font-size:13px;color:#374151;margin:0'><strong>[Your Full Name] - [Document Type]</strong><br>" +
        "Examples:<br>" +
        "<em>John Doe - Cruise Line Medicals</em><br>" +
        "<em>John Doe - Visa</em><br>" +
        "<em>John Doe - Police Clearance</em></p>" +
      "</div>" +
    "</div>" +

    "<div style='background:#f0f7ff;border-radius:10px;padding:16px 20px;margin:0 0 24px'>" +
      "<p style='font-size:14px;color:#0e4d8a;margin:0'>Please confirm by email once your medicals are complete and all files have been sent, so we can update your application status.</p>" +
    "</div>" +

    "<p style='font-size:14px;color:#374151;margin:0'>Questions? WhatsApp: <strong>+57 318 847 4058</strong></p>";

  return "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:40px 15px;background:#f4f6f9;font-family:Arial,sans-serif'>" +
    "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)'>" +
    "<tr><td style='background:linear-gradient(135deg,#0a1628,#0e4d8a);padding:36px 40px;text-align:center'>" +
      "<div style='font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px'>Selective Crew</div>" +
      "<div style='font-size:22px;font-weight:800;color:#fff'>Pre-Employment Medical Guide</div>" +
      "<div style='font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px'>Virgin Voyages - Important Instructions</div>" +
    "</td></tr>" +
    "<tr><td style='padding:40px'>" + body + "</td></tr>" +
    "<tr><td style='background:#f8fafc;padding:20px 40px;border-top:1px solid #e8eef8;text-align:center'>" +
      "<p style='font-size:12px;color:#94a3b8;line-height:1.8;margin:0'>Selective Crew Recruitment Team &nbsp;&#183;&nbsp; careers@selectivecrew.com<br>selectivecrew.com &nbsp;&#183;&nbsp; WhatsApp: +57 318 847 4058</p>" +
    "</td></tr>" +
    "</table></td></tr></table>";
}
export function getSparkVideoEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>Thank you again for taking the time to speak with us about the <strong>Photographer position</strong>. Based on your pre-interview, we are pleased to invite you to the next step in our selection process: a short one-way video interview.</p>" +

    "<div style='background:#f5f3ff;border-radius:10px;padding:28px;margin:0 0 20px;text-align:center'>" +
      "<div style='font-size:40px;margin-bottom:12px'>&#127916;</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 20px'>Please complete your Spark video interview by clicking the link below and following the on-screen instructions:</p>" +
      "<a href='' + 'https://selectivecrew.com/sb-interested?email=' + encodeURIComponent(email || '') + '&name=' + encodeURIComponent(name || '') + ' target='_blank' style='display:inline-block;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;text-decoration:none'>Start Video Interview &#8594;</a>" +
      "<p style='font-size:12px;color:#94a3b8;margin:16px 0 0'>https://hire.li/zAYoZ8QhA0zPSFg2RXxK5</p>" +
    "</div>" +

    "<div style='background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#0e4d8a;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>Tips for Your Video Interview</div>" +
      "<ul style='padding-left:20px;color:#374151;font-size:14px;line-height:2.2;margin:0'>" +
        "<li>You can record your answers <strong>at any time before the deadline</strong></li>" +
        "<li>Use a <strong>computer or mobile device</strong> with a camera and microphone</li>" +
        "<li>Choose a <strong>quiet place with good lighting</strong></li>" +
        "<li><strong>Test your audio and video</strong> before you begin</li>" +
      "</ul>" +
    "</div>" +

    "<div style='background:#f0fdf4;border-radius:10px;padding:16px 20px;margin:0 0 24px'>" +
      "<p style='font-size:14px;color:#15803d;margin:0'>Once you have submitted your video, our team will review it together with your previous interview and portfolio, and we will contact you regarding next steps.</p>" +
    "</div>" +

    "<div style='background:#fffbeb;border-radius:10px;padding:14px 18px;margin:0 0 24px;border:1px solid #fde68a'>" +
      "<p style='font-size:13px;color:#92400e;margin:0'>If you experience any technical issues with the link or the platform, please let us know so we can assist you.</p>" +
    "</div>" +

    "<div style='background:#f0fdf4;border-radius:10px;padding:16px 20px;margin:0 0 16px;border:1px solid #bbf7d0'><p style='font-size:14px;color:#15803d;font-weight:700;margin:0 0 6px'>Please let us know when you are done!</p><p style='font-size:14px;color:#374151;margin:0'>Once you have submitted your video, please reply to this email or send us a WhatsApp message so we can review your submission promptly.</p></div><p style='font-size:14px;color:#374151;margin:0'>Kind regards,<br><strong>Selective Crew Recruitment Team</strong></p>";

  return "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:40px 15px;background:#f4f6f9;font-family:Arial,sans-serif'>" +
    "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)'>" +
    "<tr><td style='background:linear-gradient(135deg,#0a1628,#7c3aed);padding:36px 40px;text-align:center'>" +
      "<div style='font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px'>Selective Crew</div>" +
      "<div style='font-size:22px;font-weight:800;color:#fff'>Spark Video Interview</div>" +
      "<div style='font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px'>Next Step - Photographer Position</div>" +
    "</td></tr>" +
    "<tr><td style='padding:40px'>" + body + "</td></tr>" +
    "<tr><td style='background:#f8fafc;padding:20px 40px;border-top:1px solid #e8eef8;text-align:center'>" +
      "<p style='font-size:12px;color:#94a3b8;line-height:1.8;margin:0'>Selective Crew Recruitment Team &nbsp;&#183;&nbsp; careers@selectivecrew.com<br>selectivecrew.com &nbsp;&#183;&nbsp; WhatsApp: +57 318 847 4058</p>" +
    "</td></tr>" +
    "</table></td></tr></table>";
}
export function getSelectedStarboardEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>We are pleased to inform you that you have been <strong>selected to join the retail family of Starboard Cruise Services</strong> aboard our luxury cruise ships. Welcome aboard!</p>" +

    "<div style='background:#f0fdf4;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#15803d;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>Required Documents</div>" +
      "<p style='font-size:14px;color:#374151;margin:0 0 14px'>To move forward with your onboarding process, please submit the following documents so we can upload them to our system:</p>" +
      "<table width='100%' cellpadding='0' cellspacing='0'>" +
        "<tr><td style='padding:10px 0;border-bottom:1px solid #bbf7d0;font-size:14px;color:#374151;vertical-align:top'><span style='display:inline-block;width:24px;height:24px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;margin-right:10px'>1</span>Passport copy</td></tr>" +
        "<tr><td style='padding:10px 0;border-bottom:1px solid #bbf7d0;font-size:14px;color:#374151;vertical-align:top'><span style='display:inline-block;width:24px;height:24px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;margin-right:10px'>2</span>Police Clearance Certificate (Pasado Judicial)</td></tr>" +
        "<tr><td style='padding:10px 0;border-bottom:1px solid #bbf7d0;font-size:14px;color:#374151;vertical-align:top'><span style='display:inline-block;width:24px;height:24px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;margin-right:10px'>3</span>C1/D Visa copy <span style='color:#64748b'>(if applicable)</span></td></tr>" +
        "<tr><td style='padding:10px 0;font-size:14px;color:#374151;vertical-align:top'><span style='display:inline-block;width:24px;height:24px;background:#16a34a;color:#fff;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;margin-right:10px'>4</span>Full home address including Zip Code (Codigo Postal) <span style='color:#64748b'>— may be included in the body of your email</span></td></tr>" +
      "</table>" +
    "</div>" +

    "<div style='background:#fffbeb;border-radius:10px;padding:14px 20px;margin:0 0 24px;border:1px solid #fde68a'>" +
      "<p style='font-size:14px;color:#92400e;margin:0'><strong>Important:</strong> All documents must be submitted in <strong>PDF format</strong>.</p>" +
    "</div>" +

    "<div style='background:#f0f7ff;border-radius:10px;padding:16px 20px;margin:0 0 24px'>" +
      "<p style='font-size:14px;color:#0e4d8a;margin:0'>We look forward to welcoming you to the team and will be in touch shortly with next steps.</p>" +
    "</div>" +

    "<p style='font-size:14px;color:#374151;margin:0'>Warm regards,<br><strong>Selective Crew Recruitment Team</strong><br>careers@selectivecrew.com</p>";

  return "<table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' style='padding:40px 15px;background:#f4f6f9;font-family:Arial,sans-serif'>" +
    "<table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)'>" +
    "<tr><td style='background:linear-gradient(135deg,#0a1628,#0e4d8a);padding:36px 40px;text-align:center'>" +
      "<div style='font-size:36px;margin-bottom:12px'>&#127881;</div>" +
      "<div style='font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px'>Selective Crew</div>" +
      "<div style='font-size:22px;font-weight:800;color:#fff'>Congratulations - You've Been Selected!</div>" +
      "<div style='font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px'>Starboard Cruise Services</div>" +
    "</td></tr>" +
    "<tr><td style='padding:40px'>" + body + "</td></tr>" +
    "<tr><td style='background:#f8fafc;padding:20px 40px;border-top:1px solid #e8eef8;text-align:center'>" +
      "<p style='font-size:12px;color:#94a3b8;line-height:1.8;margin:0'>Selective Crew Recruitment Team &nbsp;&#183;&nbsp; careers@selectivecrew.com<br>selectivecrew.com &nbsp;&#183;&nbsp; WhatsApp: +57 318 847 4058</p>" +
    "</td></tr>" +
    "</table></td></tr></table>";
}
export function getCarnivalVirginMedicalEmail(name) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="background:#f0f4f8;margin:0;padding:0;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px"><tr><td align="center"><table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)"><tr><td style="background:linear-gradient(135deg,#0a1628,#0e4d8a);padding:36px 40px;text-align:center"><div style="font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Selective Crew</div><div style="font-size:22px;font-weight:800;color:#fff">Pre-Employment Medical Guide</div><div style="font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px">Carnival Cruise Line &amp; Virgin Voyages</div></td></tr><tr><td style="padding:40px"><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px">Dear <strong>' + name + '</strong>,</p><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px">Thank you for taking this important step in your application process with Selective Crew. Please find below all the information you need to complete your pre-employment medical examinations in Bogot&aacute; for Carnival Cruise Line and Virgin Voyages.</p><div style="background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 16px"><div style="font-size:13px;font-weight:800;color:#0e4d8a;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Step 1 &mdash; Complete Your Laboratory Exams</div><p style="font-size:14px;color:#374151;margin:0 0 12px">Please schedule and complete all laboratory tests at the following clinic:</p><table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b;width:140px">Clinic</td><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151;font-weight:600">Bio Clinique Pasteur</td></tr><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b">Address</td><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">Calle 34 # 13A-96, 2nd Floor, Bogot&aacute;, Colombia</td></tr><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b">Phone</td><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">601 288 7176</td></tr><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#64748b">Cell</td><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">314 419 0182</td></tr><tr><td style="padding:6px 0;font-size:14px;color:#64748b">Contact</td><td style="padding:6px 0;font-size:14px;color:#374151">Nurse Leonor M&eacute;ndez</td></tr></table></div><div style="background:#f5f3ff;border-radius:10px;padding:24px;margin:0 0 16px"><div style="font-size:13px;font-weight:800;color:#7c3aed;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Step 2 &mdash; Schedule Your Medical Appointment</div><div style="background:#fffbeb;border-radius:8px;padding:12px 16px;margin-bottom:14px;border:1px solid #fde68a"><p style="font-size:13px;color:#92400e;margin:0"><strong>&#9888; Important:</strong> Only schedule your appointment with the physician once all laboratory results are completed and in your possession.</p></div><p style="font-size:14px;color:#374151;margin:0 0 12px">For candidates applying to Carnival Cruise Line and Virgin Voyages:</p><table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b;width:140px">Doctor</td><td style="padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151;font-weight:600">Dr. Andr&eacute;s De Vivero Camacho</td></tr><tr><td style="padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#64748b">Clinic</td><td style="padding:6px 0;border-bottom:1px solid #ddd6fe;font-size:14px;color:#374151">Cl&iacute;nica Marly</td></tr><tr><td style="padding:6px 0;font-size:14px;color:#64748b">Address</td><td style="padding:6px 0;font-size:14px;color:#374151">Calle 50 # 9-67, Bogot&aacute;</td></tr></table><div style="background:#ede9fe;border-radius:8px;padding:12px 16px;margin-top:14px"><p style="font-size:13px;color:#6d28d9;margin:0">Please call Cl&iacute;nica Marly main switchboard and ask for Dr. De Vivero Camacho office and current availability.</p></div></div><div style="background:#f0fdf4;border-radius:10px;padding:24px;margin:0 0 16px"><div style="font-size:13px;font-weight:800;color:#15803d;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px">Step 3 &mdash; Submit Your Medical Documents</div><p style="font-size:14px;color:#374151;margin:0 0 14px">Once all exams are complete, please compile and send your documents as <strong>one single PDF file</strong>, in the following order:</p><ol style="padding-left:20px;color:#374151;font-size:14px;line-height:2"><li>All cruise line forms (Carnival Cruise Line / Virgin Voyages)</li><li>All laboratory test results</li><li>All vaccination records</li></ol></div><div style="background:#f0f7ff;border-radius:10px;padding:16px 20px;margin:0 0 24px"><p style="font-size:14px;color:#0e4d8a;margin:0">Please reply to this email once your documents have been submitted so we can update your status and keep you on track for upcoming embarkation dates.</p></div><p style="font-size:14px;color:#374151;margin:0 0 8px">If you have any questions at any point in this process, do not hesitate to reach out &mdash; we are here to help.</p><p style="font-size:14px;color:#374151;margin:0">Kind regards,<br><strong>Selective Crew Recruitment Team</strong><br>careers@selectivecrew.com</p></td></tr><tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e8eef8;text-align:center"><p style="font-size:12px;color:#94a3b8;line-height:1.8;margin:0">Selective Crew Recruitment Team &nbsp;&#183;&nbsp; careers@selectivecrew.com<br>selectivecrew.com &nbsp;&#183;&nbsp; WhatsApp: +57 318 847 4058</p></td></tr></table></td></tr></table></body></html>';
}


export function getTrainingInviteEmail(name) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="background:#f0f4f8;margin:0;padding:0;font-family:Arial,sans-serif"><table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px"><tr><td align="center"><table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.10)"><tr><td style="background:linear-gradient(135deg,#0a1628,#0e4d8a);padding:36px 40px;text-align:center"><div style="font-size:11px;font-weight:700;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Selective Crew</div><div style="font-size:22px;font-weight:800;color:#fff">Free Retail Sales Training</div><div style="font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px">Duty-Free Sales Excellence Course</div></td></tr><tr><td style="padding:40px"><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px">Dear <strong>' + name + '</strong>,</p><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px">Thank you for your interest in working with Selective Crew. To be considered for any of our <strong>Duty-Free Sales positions</strong> with Starboard Cruise Services, Norwegian Cruise Line, and our other cruise line partners, retail sales experience is a <strong>mandatory requirement</strong>.</p><p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px">To help you complement and demonstrate your retail experience, we are offering you access to our <strong>free Duty-Free Sales Excellence course</strong> — the same training used to prepare candidates before they board the ship.</p><div style="background:#f0f7ff;border-radius:12px;padding:24px;margin:0 0 24px"><div style="font-size:13px;font-weight:800;color:#0e4d8a;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px">What the course covers</div><table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">&#10003; &nbsp;Duty-free product knowledge — spirits, perfumes, cosmetics, watches &amp; jewelry</td></tr><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">&#10003; &nbsp;The ACES sales method — Ask, Connect, Educate, Sell</td></tr><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">&#10003; &nbsp;Guest interaction and objection handling techniques</td></tr><tr><td style="padding:6px 0;border-bottom:1px solid #dbeafe;font-size:14px;color:#374151">&#10003; &nbsp;Onboard retail regulations and compliance</td></tr><tr><td style="padding:6px 0;font-size:14px;color:#374151">&#10003; &nbsp;How to hit and exceed your sales targets on board</td></tr></table></div><div style="background:#fff8e1;border:1px solid #e8d5a0;border-radius:10px;padding:16px 20px;margin:0 0 28px"><p style="font-size:13px;color:#6b5515;margin:0"><strong>&#9888; Important:</strong> Candidates who complete the course and earn their certificate are reviewed <strong>first</strong> by our recruitment team. The course takes only <strong>25 minutes</strong> and is completely <strong>free</strong>.</p></div><div style="text-align:center;margin:0 0 28px"><a href="https://selectivecrew.com/training" style="display:inline-block;background:#c9a84c;color:#0a1628;padding:16px 40px;border-radius:12px;font-size:16px;font-weight:800;text-decoration:none">Start the Free Course Now &rarr;</a><p style="font-size:12px;color:#94a3b8;margin:12px 0 0">selectivecrew.com/training &nbsp;&#183;&nbsp; Free &nbsp;&#183;&nbsp; 25 minutes &nbsp;&#183;&nbsp; Official certificate</p></div><p style="font-size:14px;color:#374151;line-height:1.75;margin:0 0 8px">Once you complete the course and receive your certificate, please reply to this email and we will prioritize your application for our current open positions.</p><p style="font-size:14px;color:#374151;margin:0">Kind regards,<br><strong>Selective Crew Recruitment Team</strong><br>careers@selectivecrew.com</p></td></tr><tr><td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #e8eef8;text-align:center"><p style="font-size:12px;color:#94a3b8;line-height:1.8;margin:0">Selective Crew Recruitment Team &nbsp;&#183;&nbsp; careers@selectivecrew.com<br>selectivecrew.com &nbsp;&#183;&nbsp; WhatsApp: +57 318 847 4058</p></td></tr></table></td></tr></table></body></html>';
}

export function getStarboardSystemEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + name + "</strong>,</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 24px'>You will receive a system-generated email to register on the <strong>Starboard Cruise Platform (iCIMS)</strong>. Please check your <strong>Spam Folder</strong> if you haven't received it in your inbox.</p>" +

    "<div style='background:#f0f7ff;border-radius:10px;padding:24px;margin:0 0 16px'>" +
      "<div style='font-size:13px;font-weight:800;color:#0e4d8a;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px'>Action Required</div>" +
      "<p style='font-size:14px;color:#374151;margin:0'>We have attached to this email <strong>two forms</strong> that need to be completed and returned as soon as possible.</p>" +
    "</div>" +

    "<div style='background:#f0fdf4;border-radius:10px;padding:16px 20px;margin:0 0 28px'>" +
      "<p style='font-size:14px;color:#15803d;margin:0'>Please let us know as soon as you complete it.</p>" +
    "</div>" +

    "<p style='font-size:14px;color:#374151;margin:0'>Many thanks,<br><strong>Selective Crew Recruitment Team</strong></p>";

  return elegantEmail("&#128231;", "Starboard Group", "System Generated Email", body);
}

export function getTrainingCourseEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>__NAME__</strong>,</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>We would like to invite you to take our <strong>free Duty-Free Sales Excellence course</strong> — a 25-minute training designed to help you stand out in the Selective Crew selection process and prepare you for a successful career at sea.</p>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px'>What You Will Learn</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Duty-free sales techniques used on cruise ships</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Product knowledge: perfumes, watches, cosmetics &amp; accessories</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Customer service and upselling strategies</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; How to pass the Starboard interview</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'>&#10003; Certificate of completion included</p>\n</div>\n\n<div style='text-align:center;margin:0 0 24px'>\n<a href='https://selectivecrew.com/training' target='_blank'\n   style='display:inline-block;background:linear-gradient(135deg,#0a1628,#0e4d8a);color:#fff;font-size:15px;font-weight:700;padding:16px 40px;border-radius:10px;text-decoration:none;letter-spacing:0.3px'>\n  Start Free Training &#8594;\n</a>\n<p style='font-size:12px;color:#888;margin:10px 0 0'>5 modules &middot; ~25 minutes &middot; Free certificate &middot; No registration required</p>\n</div>\n\n<div style='background:#fffbeb;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #f59e0b'>\n<p style='font-size:14px;color:#92400e;margin:0'><strong>Tip:</strong> Candidates who complete the training course stand out in our interviews. We highly recommend completing it before your next interview.</p>\n</div>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>If you have any questions, do not hesitate to reach out via WhatsApp at <strong>+57 318 847 4058</strong> or reply to this email.</p>".replace('__NAME__', name || '');
  return elegantEmail('🎓', 'Free Duty-Free Sales Training', 'Prepare for your cruise ship career', body);
}


export function getNclVisaEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>__NAME__</strong>,</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Congratulations on progressing in the selection process for the <strong>Shipboard Photographer position with Norwegian Cruise Line (NCL)</strong>. To join the ship, you will need a <strong>C1/D US Crew Visa</strong>. Please follow the steps below carefully.</p>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px'>What is the C1/D Visa?</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'>The C1/D is a US Transit/Crew visa required to board cruise ships departing from US ports. As an NCL photographer, your ship will depart from US ports, so this visa is mandatory. The cost is approximately <strong>USD 185</strong> and will be <strong>reimbursed by NCL</strong> once you are onboard — keep your receipt.</p>\n</div>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px'>Step-by-Step Application Process</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 10px'><strong>Step 1 — Complete the DS-160 Form</strong><br>Fill out your DS-160 online at <a href=\"https://ceac.state.gov/genniv/\" style=\"color:#0e4d8a\">ceac.state.gov</a>. Answer all questions honestly and consistently with your Letter of Employment (LOE). Print the confirmation page with the barcode.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 10px'><strong>Step 2 — Pay the Visa Fee</strong><br>Pay the MRV fee of approximately USD 185 at your local payment point. Keep the receipt — NCL will reimburse this amount once you board.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 10px'><strong>Step 3 — Schedule Your Interview</strong><br>Book your visa interview at the nearest US Embassy. Appointments can take several weeks — schedule as soon as possible.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 10px'><strong>Step 4 — Prepare Your Documents</strong><br>Bring the following to your interview:</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 4px'>&#10003; Valid passport (at least 6 months validity)</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 4px'>&#10003; DS-160 confirmation page</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 4px'>&#10003; Visa fee payment receipt</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 4px'>&#10003; Letter of Employment (LOE) from NCL via Selective Crew</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 4px'>&#10003; Recent passport-size photo</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 10px'>&#10003; Proof of ties to your home country (bank statements, property, family)</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 10px'><strong>Step 5 — Attend the Interview</strong><br>At the Embassy, you will be asked about your employment. Be clear: you are a crew member joining a cruise ship as a photographer. Your employer is Norwegian Cruise Line. The duration is one contract (approximately 4-6 months).</p>\n</div>\n\n<div style='background:#fffbeb;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #f59e0b'>\n<p style='font-size:14px;color:#92400e;margin:0 0 8px'><strong>Important Tips for the Embassy Interview:</strong></p>\n<p style='font-size:14px;color:#92400e;line-height:1.7;margin:0 0 4px'>&#10003; Be honest and consistent with your LOE at all times</p>\n<p style='font-size:14px;color:#92400e;line-height:1.7;margin:0 0 4px'>&#10003; Do not mention tourism or vacation — you are traveling as crew</p>\n<p style='font-size:14px;color:#92400e;line-height:1.7;margin:0 0 4px'>&#10003; Dress professionally and arrive early</p>\n<p style='font-size:14px;color:#92400e;line-height:1.7;margin:0'>&#10003; Once you have your appointment date, inform us immediately</p>\n</div>\n\n<div style='background:#f0fdf4;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #16a34a'>\n<p style='font-size:14px;color:#166534;margin:0'><strong>Reimbursement:</strong> NCL will reimburse your visa fee once you are onboard. Keep all receipts and present them to the ship administration upon joining.</p>\n</div>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>Once you have your visa appointment date, please inform us immediately so we can track your progress. If you have any questions do not hesitate to contact us on WhatsApp at <strong>+57 318 847 4058</strong>.</p>".replace('__NAME__', name || '');
  return elegantEmail('📸', 'C1/D Visa Guide - NCL Photographer', 'Norwegian Cruise Line Crew Visa Application', body);
}


export function getRejectionEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>__NAME__</strong>,</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Thank you for your interest in joining the cruise ship industry through Selective Crew and for the time you invested in our selection process. We truly appreciate your enthusiasm and effort.</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. This decision was not easy, as we received many strong applications, and we want you to know that this does not reflect on your value as a professional.</p>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 10px'>What This Means For You</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; This decision is specific to this current opening and does not close the door permanently.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; We encourage you to continue developing your retail and customer service skills.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'>&#10003; You are welcome to reapply in the future when new positions open.</p>\n</div>\n\n<div style='background:#fffbeb;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #f59e0b'>\n<p style='font-size:14px;color:#92400e;margin:0'><strong>Free Training:</strong> While you wait for future opportunities, we invite you to complete our free Duty-Free Sales Excellence course at <a href='https://selectivecrew.com/training' style='color:#92400e'>selectivecrew.com/training</a>. Completing this course will strengthen your profile for future applications.</p>\n</div>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>We wish you all the best in your career journey and hope to have the opportunity to work with you in the future.</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>With warm regards,</p>".replace('__NAME__', name || '');
  return elegantEmail('💙', 'Update on Your Application', 'Selective Crew Recruitment', body);
}


export function getTrainingCompletionEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>__NAME__</strong>,</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Congratulations on completing the <strong>Duty-Free Sales Excellence course</strong>! This shows initiative and commitment — qualities we look for in our candidates.</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>To move forward with your application, we now require you to submit your <strong>resume/CV in English</strong>. This is a mandatory requirement as your file will be reviewed by our cruise line partners whose working language is English.</p>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px'>Resume Requirements</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; <strong>Language:</strong> Must be written entirely in English</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; <strong>Format:</strong> PDF preferred (DOC or DOCX also accepted)</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; <strong>Include:</strong> Full name, contact details, work experience, education</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; <strong>Highlight:</strong> Any face-to-face retail sales experience</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'>&#10003; <strong>Photo:</strong> Include a professional headshot if possible</p>\n</div>\n\n<div style='background:#fffbeb;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #f59e0b'>\n<p style='font-size:14px;color:#92400e;margin:0'><strong>Important:</strong> Resumes submitted in Spanish or any other language will not be considered. Please ensure your resume is fully translated to English before sending.</p>\n</div>\n\n<div style='background:#f0fdf4;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #16a34a'>\n<p style='font-size:14px;color:#166534;margin:0'><strong>How to Submit:</strong> Please reply to this email with your English resume attached, or upload it directly at <a href='https://selectivecrew.com/apply' style='color:#166534'>selectivecrew.com/apply</a></p>\n</div>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>We look forward to reviewing your profile. If you need help translating your resume, please let us know. Do not hesitate to contact us on WhatsApp at <strong>+57 318 847 4058</strong>.</p>".replace('__NAME__', name || '');
  return elegantEmail('🎓', 'Next Step: Submit Your English Resume', 'Training Completed - Action Required', body);
}







export function getStarboardDocsEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>" + (name||'Candidate') + "</strong>,</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Welcome to Selective Crew, and thank you for completing your initial application for <strong>Starboard Retail Group</strong>. We are excited to guide you through the next steps of your recruitment and onboarding process.</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>To proceed with your file and ensure a smooth review by the hiring team, please send us the following documents at your earliest convenience:</p>" +
    "<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>" +
      "<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px'>Required Documents</p>" +
      "<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Copy of your valid passport</p>" +
      "<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Updated CV/Resume</p>" +
      "<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Police Clearance Certificate (issued within the last 6 months)</p>" +
      "<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'>&#10003; Full address including zip code</p>" +
    "</div>" +
    "<div style='background:#fffbeb;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #f59e0b'>" +
      "<p style='font-size:14px;color:#92400e;margin:0'>You may reply directly to this email with the requested documents attached.</p>" +
    "</div>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 16px'>If you have any questions or need support during this stage, feel free to reach out - we are here to help!</p>" +
    "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>We look forward to assisting you throughout your journey toward an exciting career at sea.</p>";
  return elegantEmail('&#9875;', 'Starboard Retail Group', 'Document Collection - Selective Crew', body);
}


export function getFollowUpEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>__NAME__</strong>,</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>We hope this message finds you well. We are reaching out because we have not received any update from you regarding your onboarding process with <strong>Selective Crew</strong>.</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>We want to ensure that your application remains active and that you do not miss this opportunity. Please let us know if you are still interested in pursuing a career at sea with our cruise line partners.</p>\n\n<div style='background:#fff8e1;border-radius:10px;padding:20px 24px;margin:0 0 20px;border-left:4px solid #f59e0b'>\n<p style='font-size:15px;font-weight:700;color:#92400e;margin:0 0 8px'>&#9888;&#65039; Important Notice</p>\n<p style='font-size:14px;color:#92400e;line-height:1.7;margin:0'>If we do not receive a reply from you within the next <strong>24 hours</strong>, we will assume you are no longer interested and your file will be permanently deleted from our system. This action cannot be undone.</p>\n</div>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 10px'>To keep your application active, simply:</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Reply to this email confirming you are still interested</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'>&#10003; Send any pending documents that were requested</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'>&#10003; Contact us on WhatsApp at <strong>+57 318 847 4058</strong></p>\n</div>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>We have invested time in your profile and genuinely believe you have the potential for a successful career at sea. We would hate to lose your application due to lack of communication.</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>Please respond at your earliest convenience.</p>".replace('__NAME__', name || '');
  return elegantEmail('⏰', 'Action Required - Your Application', 'Selective Crew Recruitment', body);
}

export function getPhotographerDocsEmail(name) {
  var body = "<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Dear <strong>__NAME__</strong>,</p>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0 0 20px'>Thank you for your interest in the photographer opportunities with our partner cruise lines through Selective Crew. To move forward with your application, please send the following pre-employment documents. If you are currently applying for any new documents, include the date of your appointments in your reply.</p>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px'>Required Pre-Employment Documents</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'><strong>1. Completed Crew Data Form</strong><br><a href='https://www.kingsrecruit.com/wp-content/uploads/2013/11/Crew-Data-Form.xls' style='color:#0e4d8a'>Download here</a></p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'><strong>2. Copy of Passport</strong></p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'><strong>3. Police Clearance Certificate</strong><br><a href='https://selectivecrew.com/documents' style='color:#0e4d8a'>Submit via our documents portal</a></p>\n</div>\n\n<div style='background:#fffbeb;border-radius:10px;padding:16px 20px;margin:0 0 20px;border-left:4px solid #f59e0b'>\n<p style='font-size:14px;color:#92400e;margin:0'><strong>Important:</strong> The police clearance certificate must be issued in English, or accompanied by an official English translation from a certified translator, as your file may be reviewed by the medical department and security team on board.</p>\n</div>\n\n<div style='background:#f0f7ff;border-radius:10px;padding:20px 24px;margin:0 0 20px'>\n<p style='font-size:14px;font-weight:700;color:#0e4d8a;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px'>Next Steps</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'><strong>1.</strong> Email clear, legible scans of each document to: <a href='mailto:careers@selectivecrew.com' style='color:#0e4d8a'>careers@selectivecrew.com</a></p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0 0 8px'><strong>2.</strong> Indicate any upcoming appointment dates for documents still in process.</p>\n<p style='font-size:14px;color:#374151;line-height:1.7;margin:0'><strong>3.</strong> Once we receive and review your documents, we will send you instructions for your <strong>medical examination</strong>, which is required to complete your pre-employment process.</p>\n</div>\n\n<p style='font-size:15px;color:#374151;line-height:1.8;margin:0'>Thank you for your cooperation, and have a blessed day ahead.</p>".replace('__NAME__', name || '');
  return elegantEmail('📸', 'Pre-Employment Documents', 'Photographer Position - Selective Crew', body);
}
