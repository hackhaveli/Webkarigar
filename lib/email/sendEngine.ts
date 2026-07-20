import nodemailer from 'nodemailer';
import { personalizeHtml, personalizeText, convertToHtml } from './editorjsParser';

export interface Recipient {
  name: string;
  email: string;
  business_name?: string;
  preview_url?: string;
}

export interface SenderAccount {
  email: string;
  password: string;
  provider: 'gmail' | 'outlook';
}

export interface SendOptions {
  senders: SenderAccount[];
  recipients: Recipient[];
  subject: string;
  htmlTemplate: string;
  delay: number;
  useGreeting?: boolean;
  onProgress: (event: ProgressEvent) => Promise<void> | void;
}

export interface ProgressEvent {
  status: 'success' | 'error' | 'complete';
  email?: string;
  senderEmail?: string;
  error?: string;
  sent: number;
  failed: number;
  total: number;
  failedEmails?: string[];
}

function getSmtpConfig(provider: 'gmail' | 'outlook') {
  if (provider === 'gmail') return { host: 'smtp.gmail.com', port: 587, secure: false };
  return { host: 'smtp.office365.com', port: 587, secure: false };
}

const MAX_RETRIES = 3;

export async function runCampaign(options: SendOptions): Promise<void> {
  const { senders, recipients, subject, htmlTemplate, delay, useGreeting, onProgress } = options;
  const delayMs = delay * 1000;

  let baseHtml = htmlTemplate;
  try {
    const parsedData = JSON.parse(htmlTemplate);
    if (parsedData && parsedData.blocks) {
      baseHtml = convertToHtml(parsedData);
    }
  } catch (e) {
    // If it's not JSON, it might already be raw HTML, which is fine
  }

  const transporters = senders.map((sender) => {
    const smtp = getSmtpConfig(sender.provider);
    return {
      sender,
      transporter: nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: sender.email, pass: sender.password },
        tls: { ciphers: 'SSLv3' },
      }),
    };
  });

  let sent = 0;
  let failed = 0;
  const failedEmails: string[] = [];

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];

    const personalizedSubject = personalizeText(subject, recipient);
    let personalizedHtml = personalizeHtml(baseHtml, recipient);

    if (useGreeting) {
      personalizedHtml = `<p style="margin:0 0 12px;">Dear ${recipient.name || 'Friend'},</p>${personalizedHtml}`;
    }

    const primaryIndex = i % transporters.length;
    let success = false;
    let senderUsed = '';

    for (let attempt = 0; attempt < transporters.length; attempt++) {
      const idx = (primaryIndex + attempt) % transporters.length;
      const { sender, transporter } = transporters[idx];

      let retries = 0;
      while (retries < MAX_RETRIES && !success) {
        try {
          await transporter.sendMail({
            from: sender.email,
            to: recipient.email,
            subject: personalizedSubject,
            html: personalizedHtml,
          });
          sent++;
          success = true;
          senderUsed = sender.email;
        } catch (err: any) {
          console.error(`[SMTP ERROR] sending to ${recipient.email} via ${sender.email}:`, err.message || err);
          retries++;
          if (retries < MAX_RETRIES) {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }
      }

      if (success) break;
    }

    if (success) {
      await onProgress({ status: 'success', email: recipient.email, senderEmail: senderUsed, sent, failed, total: recipients.length });
    } else {
      failed++;
      failedEmails.push(recipient.email);
      await onProgress({ status: 'error', email: recipient.email, error: 'All accounts failed', senderEmail: '', sent, failed, total: recipients.length });
    }

    if (i < recipients.length - 1) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  await onProgress({ status: 'complete', sent, failed, total: recipients.length, failedEmails });
}
