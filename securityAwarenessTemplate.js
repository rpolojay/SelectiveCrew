export const securityAwarenessTemplate = {
  id: "security-awareness",
  name: "Security Awareness Course",
  subject: "Security Awareness Course",
  body: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9; margin: 0; padding: 0; }
        </style>
    </head>
    <body style="background-color: #f4f6f9; margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td align="center" style="padding: 40px 15px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px;">
                        <tr>
                            <td align="center" style="background-color: #0A2540; padding: 35px 20px;">
                                <h1 style="margin: 0; font-size: 26px; color: #ffffff;">Selective Crew</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 35px; color: #333333; line-height: 1.6; font-size: 16px;">
                                <p style="font-size: 18px; color: #0A2540;"><strong>Dear ${candidateName},</strong></p>
                                <p>Please be advised that the <strong>Security Awareness Course</strong> is mandatory for all embarking crew members.</p>
                                <p>To help you meet this requirement, we recommend completing an online, asynchronous version of the course.</p>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 30px 0;">
                                            <a href="https://shipservice.pro/" target="_blank" style="background-color: #0A2540; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 4px; display: inline-block; font-weight: 600;">Take the Online Course</a>
                                        </td>
                                    </tr>
                                </table>
                                <p>Warm regards,<br>Selective Crew</p>
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
