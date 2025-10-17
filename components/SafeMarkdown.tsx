import React, { useMemo } from 'react';

declare const katex: any;

const MarkdownFragment: React.FC<{ text: string }> = ({ text }) => {
    // This regex now also handles backticks for inline code
    const markdownRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const parts = text.split(markdownRegex).filter(Boolean);

    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('*') && part.endsWith('*')) {
                    return <em key={i}>{part.slice(1, -1)}</em>;
                }
                 if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={i} className="inline-code">{part.slice(1, -1)}</code>;
                }
                // Handle newlines within normal text parts
                return part.split('\n').map((line, j) => (
                    <React.Fragment key={`${i}-${j}`}>
                        {line}
                        {j < part.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ));
            })}
        </>
    );
};

export const SafeMarkdown = React.memo(({ text }: { text: string }) => {
    const elements = useMemo(() => {
        if (typeof katex === 'undefined') {
            // Fallback if KaTeX library isn't loaded
            return <MarkdownFragment text={text} />;
        }
        
        // Regex to find both inline ($...$) and display ($$...$$) LaTeX blocks
        const mathRegex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
        const parts = text.split(mathRegex);

        return parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
                const math = part.slice(2, -2);
                try {
                    const html = katex.renderToString(math, {
                        displayMode: true,
                        throwOnError: false
                    });
                    // display-mode math needs a block-level element
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                } catch (e) {
                    // In case of error, render as plain code
                    return <code key={index}>{part}</code>;
                }
            }
            if (part.startsWith('$') && part.endsWith('$')) {
                const math = part.slice(1, -1);
                 try {
                    const html = katex.renderToString(math, {
                        displayMode: false,
                        throwOnError: false
                    });
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                 } catch (e) {
                     return <code key={index}>{part}</code>;
                 }
            }
            // If it's not a math part, process it for markdown
            return <MarkdownFragment key={index} text={part} />;
        });
    }, [text]);

    // Use a div instead of a p to be a valid container for block-level elements from KaTeX
    return <div className="content-renderer">{elements}</div>;
});
