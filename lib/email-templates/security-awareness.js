export const generateSecurityCourseEmail = (candidateName = "[Candidate Name]") => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Security Awareness Course</title>
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
            table { border-collapse: collapse !important; }
            body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; }
            a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        </style>
    </head>
    <body style="background-color: #f4f6f9; margin: 0 !important; padding: 0 !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="padding: 40px 15px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
                        <tr>
                            <td align="center" style="background-color: #0A2540; padding: 35px 20px;">
                                <h1 style="margin: 0; font-size: 26px; font-weight: 600; color: #ffffff; letter-spacing: 1px;">Selective Crew</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 35px; color: #333333; line-height: 1.6; font-size: 16px;">
                                <p style="margin-top: 0; font-size: 18px; color: #0A2540;"><strong>Dear ${candidateName},</strong></p>
                                
                                <p>Congratulations once again on being selected. As we proceed with the next steps for your upcoming deployment, we want to bring your attention to a vital pre-boarding requirement.</p>
                                
                                <p>Please be advised that the <strong>Security Awareness Course</strong> is mandatory for all embarking crew members. You are required to hold a valid certificate for this training, and it must be presented immediately upon signing on to the ship.</p>
                                
                                <p>To help you meet this requirement efficiently, we recommend completing an online, asynchronous version of the course. This allows you to finish the training at your own pace before your departure date.</p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 30px 0;">
                                            <a href="https://shipservice.pro/" target="_blank" style="background-color: #0A2540; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; display: inline-block; font-weight: 600; font-size: 16px; letter-spacing: 0.5px;">Take the Online Course</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin-bottom: 0;">If you already possess a valid Security Awareness Certificate, please ensure you have the original, physical document with you for your embarkation.</p>
                                
                                <p>Should you have any questions or need further assistance, please do not hesitate to reach out to us.</p>
                                
                                <br>
                                <p style="margin: 0;">Warm regards,</p>
                                <p style="margin: 5px 0 0 0; font-weight: 600; color: #0A2540;">The Recruitment Team</p>
                                <p style="margin: 0; color: #666666;">Selective Crew</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color: #f8fafc; padding: 25px 20px; color: #888888; font-size: 13px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0;">© ${new Date().getFullYear()} Selective Crew. All rights reserved.</p>
                                <p style="margin: 5px 0 0 0;">You are receiving this email because you are a selected candidate for maritime deployment.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};
