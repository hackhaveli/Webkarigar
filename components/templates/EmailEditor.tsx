'use client';
import { useEffect, useRef, useState } from 'react';
import EditorJS, { ToolConstructable } from '@editorjs/editorjs';
import { Link2, ExternalLink, X } from 'lucide-react';


interface CampaignTemplate {
  templateId: string;
  templateName: string;
  niche: string;
  previewUrl: string;
  previewLinkPattern: string;
}

interface EmailEditorProps {
  initialData?: any;
  onChange: (data: any) => void;
}

export function EmailEditor({ initialData, onChange }: EmailEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const isInitializingRef = useRef(false);
  const [attachedTemplates, setAttachedTemplates] = useState<CampaignTemplate[]>([]);
  const attachedTemplate = attachedTemplates[0] ?? null;

  // Load attached templates from session
  useEffect(() => {
    try {
      const storedMultiple = sessionStorage.getItem('selected-campaign-templates');
      if (storedMultiple) {
        const parsed = JSON.parse(storedMultiple);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAttachedTemplates(parsed);
          return;
        }
      }
      
      const storedSingle = sessionStorage.getItem('selected-campaign-template');
      if (storedSingle) {
        const parsed = JSON.parse(storedSingle);
        setAttachedTemplates([parsed]);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const initEditor = async () => {
      if (editorRef.current || isInitializingRef.current) return;
      isInitializingRef.current = true;

      const Header = (await import('@editorjs/header')).default;
      const List = (await import('@editorjs/list')).default;
      const Quote = (await import('@editorjs/quote')).default;
      const Marker = (await import('@editorjs/marker')).default;

      if (!editorRef.current) {
        editorRef.current = new EditorJS({
          holder: 'editorjs-container',
          data: initialData,
          placeholder: `Hey {{name}},\n\nI made a quick website for your business:\n{{preview_link}}\n\nLet me know if you'd like this live.\n\n— Rohit\n\n[Use {{name}}, {{business_name}}, {{preview_link}} for personalization]`,
          tools: {
            header: { class: Header as unknown as ToolConstructable, config: { levels: [2, 3, 4], defaultLevel: 2 } },
            list: { class: List as unknown as ToolConstructable, inlineToolbar: true },
            quote: { class: Quote as unknown as ToolConstructable, inlineToolbar: true },
            marker: { class: Marker as unknown as ToolConstructable, inlineToolbar: true },
          },
          onChange: async () => {
            if (editorRef.current) {
              const savedData = await editorRef.current.save();
              onChange(savedData);
            }
          },
        });
      }
    };

    initEditor();

    return () => {
      if (editorRef.current?.destroy) {
        try {
          editorRef.current.destroy();
        } catch (e) {
          console.error('Error destroying EditorJS:', e);
        }
        editorRef.current = null;
      }
    };
  }, []);

  const insertPreviewLinkBlock = async () => {
    if (!editorRef.current || attachedTemplates.length === 0) return;
    try {
      if (attachedTemplates.length === 1) {
        await editorRef.current.blocks.insert('paragraph', {
          text: `👉 I built a quick website specifically for your business — <a href="${attachedTemplates[0].previewLinkPattern}">View Your Client Website →</a>`,
        });
      } else {
        await editorRef.current.blocks.insert('paragraph', {
          text: `👉 I built ${attachedTemplates.length} distinct website variations specifically for your business. Check them out:`,
        });
        
        for (let i = 0; i < attachedTemplates.length; i++) {
          await editorRef.current.blocks.insert('paragraph', {
            text: `• <a href="${attachedTemplates[i].previewLinkPattern}">View Variation ${i + 1} (${attachedTemplates[i].templateName}) →</a>`
          });
        }
      }
    } catch (e) {
      navigator.clipboard.writeText(attachedTemplates[0].previewLinkPattern);
      alert('Copied preview link to clipboard. Paste it into the editor.');
    }
  };

  const detachTemplate = () => {
    sessionStorage.removeItem('selected-campaign-template');
    sessionStorage.removeItem('selected-campaign-templates');
    setAttachedTemplates([]);
  };

  return (
    <div className="w-full bg-background border rounded-lg overflow-hidden">
      {/* Toolbar: Template attachment panel */}
      <div className="border-b border-white/5 bg-[#0f1420]">
        {attachedTemplate ? (
          <div className="px-4 py-2.5 flex items-center gap-3 overflow-x-auto">
            {/* Template badge */}
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 flex-1 min-w-0">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
              <span className="text-xs text-primary font-semibold truncate">
                {attachedTemplates.length > 1 ? `${attachedTemplates.length} Templates Attached` : attachedTemplate.templateName}
              </span>
              <span className="text-[10px] text-gray-500 capitalize hidden sm:inline truncate">
                · {attachedTemplates.length > 1 ? 'Multi-variant tracking' : attachedTemplate.niche}
              </span>
            </div>

            {/* Insert Button */}
            <button
              onClick={insertPreviewLinkBlock}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 shadow-sm"
            >
              <Link2 className="h-3.5 w-3.5" />
              {attachedTemplates.length > 1 ? 'Insert All Preview Links' : 'Insert Preview Link'}
            </button>

            {/* View preview */}
            <button
              onClick={() => window.open(attachedTemplate.previewUrl, '_blank')}
              className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="View template preview"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </button>

            {/* Detach */}
            <button
              onClick={detachTemplate}
              className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
              title="Detach template"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="px-4 py-2 flex items-center gap-2">
            <Link2 className="h-3.5 w-3.5 text-gray-600" />
            <span className="text-xs text-gray-600">
              No template attached.{' '}
              <a href="/dashboard/templates" className="text-primary/70 hover:text-primary underline underline-offset-2">
                Browse Marketplace →
              </a>
            </span>
          </div>
        )}
      </div>

      {/* EditorJS Container */}
      <div id="editorjs-container" className="min-h-[370px] p-6 focus:outline-none bg-white text-black dark:bg-[#1e1e2e] dark:text-[#cdd6f4] prose prose-sm dark:prose-invert max-w-none" />
    </div>
  );
}
