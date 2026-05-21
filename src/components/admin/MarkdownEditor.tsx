import MDEditor, { commands } from "@uiw/react-md-editor";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
  preview?: "live" | "edit" | "preview";
  autoFocus?: boolean;
}

/**
 * Themed markdown editor for HQ.
 * - Toolbar: headings, bold, italic, lists, links, quotes, code
 * - Live preview by default
 * - Inherits project tokens via the .hq-md-editor CSS shim in index.css
 */
const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Start writing… **bold**, # heading, - list, [link](url)",
  minHeight = 240,
  preview = "edit",
  autoFocus,
}: Props) => {
  useEffect(() => {
    if (!autoFocus) return;
    const t = setTimeout(() => {
      const ta = document.querySelector<HTMLTextAreaElement>(".hq-md-editor textarea");
      ta?.focus();
      if (ta) ta.selectionStart = ta.selectionEnd = ta.value.length;
    }, 50);
    return () => clearTimeout(t);
  }, [autoFocus]);

  return (
    <div className="hq-md-editor" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        preview={preview}
        height={minHeight}
        textareaProps={{ placeholder }}
        visibleDragbar={false}
        commands={[
          commands.title2,
          commands.title3,
          commands.bold,
          commands.italic,
          commands.divider,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
          commands.divider,
          commands.link,
          commands.quote,
          commands.code,
          commands.codeBlock,
        ]}
        extraCommands={[commands.codeEdit, commands.codeLive, commands.codePreview]}
      />
    </div>
  );
};

export default MarkdownEditor;
