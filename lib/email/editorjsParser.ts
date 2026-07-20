import { OutputData } from '@editorjs/editorjs';

export function convertToHtml(data: OutputData): string {
  return data.blocks
    .map((block) => {
      switch (block.type) {
        case 'header':
          return `<h${block.data.level} style="margin:0 0 12px;font-weight:700;">${block.data.text}</h${block.data.level}>`;
        case 'paragraph':
          return `<p style="margin:0 0 12px;line-height:1.6;">${block.data.text}</p>`;
        case 'list': {
          const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const items = block.data.items
            .map((item: any) => {
              const htmlContent = typeof item === 'string' ? item : (item.content || '');
              return `<li style="margin-bottom:4px;">${htmlContent}</li>`;
            })
            .join('');
          return `<${tag} style="margin:0 0 12px;padding-left:20px;">${items}</${tag}>`;
        }
        case 'checklist':
          return `<ul style="list-style:none;padding:0;margin:0 0 12px;">${block.data.items
            .map(
              (item: { text: string; checked: boolean }) =>
                `<li style="padding:2px 0;">${item.checked ? '✅' : '⬜'} ${item.text}</li>`
            )
            .join('')}</ul>`;
        case 'quote':
          return `<blockquote style="border-left:4px solid #6366f1;margin:0 0 12px;padding:8px 16px;color:#6b7280;font-style:italic;">${block.data.text}${block.data.caption ? `<footer style="margin-top:4px;font-size:0.85em;">— ${block.data.caption}</footer>` : ''}</blockquote>`;
        case 'code':
          return `<pre style="background:#1e1e2e;color:#cdd6f4;padding:12px;border-radius:6px;overflow-x:auto;margin:0 0 12px;"><code>${block.data.code}</code></pre>`;
        case 'image':
          return `<figure style="margin:0 0 12px;"><img src="${block.data.file.url}" alt="${block.data.caption || ''}" style="max-width:100%;border-radius:6px;" />${block.data.caption ? `<figcaption style="text-align:center;font-size:0.85em;color:#6b7280;margin-top:4px;">${block.data.caption}</figcaption>` : ''}</figure>`;
        default:
          return '';
      }
    })
    .join('');
}

export function personalizeHtml(
  html: string,
  recipient: { name?: string; email?: string; business_name?: string; preview_url?: string }
): string {
  const businessSlug = (recipient.business_name || 'your-business')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Decode any URL-encoded curly braces (from EditorJS link hrefs) back to standard template variables
  let normalizedHtml = html.replace(/%7B/gi, '{').replace(/%7D/gi, '}');

  return normalizedHtml
    .replace(/\{\{name\}\}/gi, recipient.name || 'Friend')
    .replace(/\{\{email\}\}/gi, recipient.email || '')
    .replace(/\{\{business_name\}\}/gi, recipient.business_name || 'Your Business')
    .replace(/\{\{business_slug\}\}/gi, businessSlug)
    .replace(/\{\{preview_url\}\}/gi, recipient.preview_url || '#');
}

export function personalizeText(
  template: string,
  recipient: { name?: string; email?: string; business_name?: string }
): string {
  return template
    .replace(/\{\{name\}\}/gi, recipient.name || 'Friend')
    .replace(/\{\{email\}\}/gi, recipient.email || '')
    .replace(/\{\{business_name\}\}/gi, recipient.business_name || 'Your Business');
}
