import React, { useMemo, useEffect } from 'react';

declare const katex: any;
declare const marked: any;

// A custom renderer for marked to add specific classes or behaviors
const renderer = {
  // Example: Add a class to blockquotes
  blockquote(quote: string) {
    return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
  },
  // Example: Add a class to code blocks for syntax highlighting later
  code(code: string, language: string) {
    const validLanguage = language && /^[a-zA-Z0-9]+$/.test(language) ? language : 'plaintext';
    return `<pre><code class="language-${validLanguage}">${code}</code></pre>`;
  }
};

// Set up marked with the custom renderer
if (typeof marked !== 'undefined') {
  marked.use({ renderer });
}

export const SafeMarkdown = React.memo(({ text }: { text: string }) => {
    const elements = useMemo(() => {
        if (typeof marked === 'undefined' || typeof katex === 'undefined') {
            // Fallback if libraries aren't loaded
            return <pre><code>{text}</code></pre>;
        }
        
        // Regex to find both inline ($...$) and display ($$...$$) LaTeX blocks
        const mathRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
        const parts = text.split(mathRegex);

        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                const math = part.slice(2, -2);
                try {
                    const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                } catch (e) {
                    return <code key={index}>{part}</code>;
                }
            }
            if (part.startsWith('$') && part.endsWith('$')) {
                const math = part.slice(1, -1);
                 try {
                    const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                 } catch (e) {
                     return <code key={index}>{part}</code>;
                 }
            }
            // If it's not a math part, process it for markdown using marked.js
            try {
                const html = marked.parse(part, { gfm: true, breaks: true });
                return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch(e) {
                // In case of a marked error, render as plain text
                return <span key={index}>{part}</span>;
            }
        });
    }, [text]);

    return <div className="content-renderer">{elements}</div>;
});