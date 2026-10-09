export const securityAwarenessTemplate = {
  id: "security-awareness",
  name: "Security Awareness Course",
  subject: "Security Awareness Course",
  body: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            table { border-collapse: collapse !important; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
        </style>
    </head>
    <body style="background-color: #f4f6f9; margin: 0; padding: 0;">
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
                                
                                <p>To help you meet this requirement efficiently, we recommend completing an online, asynchronous version of the course.</p>
                                
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 30px 0;">
                                            <a href="https://shipservice.pro/" target="_blank" style="background-color: #0A2540; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; display: inline-block; font-weight: 600; font-size: 16px;">Take the Online Course</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin-bottom: 0;">If you already possess a valid Security Awareness Certificate, please ensure you have the original physical document with you for embarkation.</p>
                                
                                <br>
                                <p style="margin: 0;">Warm regards,</p>
                                <p style="margin: 5px 0 0 0; font-weight: 600; color: #0A2540;">The Recruitment Team</p>
                                <p style="margin: 0; color: #666666;">Selective Crew</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `
};
