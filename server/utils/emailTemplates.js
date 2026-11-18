// server/utils/emailTemplates.js
// Branded HTML emails (table layout + inline styles, so Gmail, Outlook and phones all render them).

const escapeHtml = (value = '') =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const renderEmail = ({ preheader, heading, name, paragraphs, buttonLabel, buttonUrl, footnote }) => {
  const safeName = escapeHtml(name || 'there');

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Segoe UI,Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f1f5f9;">${escapeHtml(preheader)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
            <tr>
              <td align="center" style="padding-bottom:18px;">
                <span style="display:inline-block;background:#4f46e5;color:#ffffff;font-size:18px;line-height:1;border-radius:10px;padding:9px 10px;vertical-align:middle;">&#128218;</span>
                <span style="font-size:19px;font-weight:800;color:#0f172a;vertical-align:middle;margin-left:8px;">Campus <span style="color:#4f46e5;">Hub</span></span>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:34px 30px;">
                <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:#0f172a;">${escapeHtml(heading)}</h1>
                <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">Hi ${safeName},</p>
                ${paragraphs
                  .map((text) => `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#334155;">${escapeHtml(text)}</p>`)
                  .join('\n                ')}
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0;">
                  <tr>
                    <td style="background:#4f46e5;border-radius:12px;">
                      <a href="${escapeHtml(buttonUrl)}" style="display:inline-block;padding:13px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(buttonLabel)}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 6px;font-size:12px;line-height:1.6;color:#64748b;">Button not working? Copy this link into your browser:</p>
                <p style="margin:0 0 20px;font-size:12px;line-height:1.5;color:#4f46e5;word-break:break-all;">${escapeHtml(buttonUrl)}</p>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 16px;" />
                <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">${escapeHtml(footnote)}</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:18px;font-size:12px;color:#94a3b8;">Campus Hub &middot; free for every student</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    heading,
    '',
    `Hi ${name || 'there'},`,
    '',
    ...paragraphs.flatMap((paragraph) => [paragraph, '']),
    `${buttonLabel}: ${buttonUrl}`,
    '',
    footnote,
  ].join('\n');

  return { html, text };
};

export const verificationEmail = ({ name, link }) => ({
  subject: 'Verify your email for Campus Hub',
  ...renderEmail({
    preheader: 'Confirm your email address to start sharing resources.',
    heading: 'Verify your email address',
    name,
    paragraphs: [
      'Welcome to Campus Hub! Please confirm that this email address is yours. You need to do this once before you can share resources.',
    ],
    buttonLabel: 'Verify my email',
    buttonUrl: link,
    footnote: 'If you did not create a Campus Hub account, you can safely ignore this email.',
  }),
});

export const passwordResetEmail = ({ name, link }) => ({
  subject: 'Reset your Campus Hub password',
  ...renderEmail({
    preheader: 'Use this link to choose a new password.',
    heading: 'Reset your password',
    name,
    paragraphs: [
      'We received a request to reset the password for your Campus Hub account. Press the button below to choose a new one.',
      'For your safety, this link works for a short time only.',
    ],
    buttonLabel: 'Choose a new password',
    buttonUrl: link,
    footnote: 'If you did not ask for a password reset, ignore this email. Your password will stay the same.',
  }),
});