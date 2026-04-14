"use client";

interface CodeBlockProps {
  code: string;
  title?: string;
  alwaysOpen?: boolean;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, title, alwaysOpen, language, className }: CodeBlockProps) {
  return (
    <div className={`code-block ${className || ''}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="code-header">{title || "CODE"}</div>
      <pre className="code-pre" style={{ overflowY: 'auto', flex: 1 }}>
        <code className={language ? `language-${language}` : ''}>{code}</code>
      </pre>
    </div>
  );
}
