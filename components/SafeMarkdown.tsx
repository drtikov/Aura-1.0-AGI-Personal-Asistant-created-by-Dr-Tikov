import React, { useMemo, useEffect, useState } from 'react';
import { loadSdk } from '../core/sdkLoader';

declare const katex: any;
declare const marked: any;

export const SafeMarkdown = React.memo(({ text }: { text: string }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadDependencies = async () => {
            try {
                await Promise.all([
                    loadSdk('marked'),
                    loadSdk('katex_css'),
                    loadSdk('katex')
                ]);
                if (isMounted) {
                    const renderer = {
                        blockquote(quote: string) {
                            return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
                        },
                        code(code: string, language: string) {
                            const validLanguage = language && /^[a-zA-Z0-9]+$/.test(language) ? language : 'plaintext';
                            return `<pre><code class="language-${validLanguage}">${code}</code></pre>`;
                        }
                    };
                    if (typeof marked !== 'undefined') {
                        marked.use({ renderer });
                    }
                    setIsReady(true);
                }
            } catch (error) {
                console.error("Failed to load markdown/katex libraries", error);
            }
        };
        loadDependencies();
        return () => { isMounted = false; };
    }, []);

    const elements = useMemo(() => {
        if (!isReady || typeof marked === 'undefined' || typeof katex === 'undefined') {
            return <pre><code>{text}</code></pre>;
        }
        
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
            try {
                const html = marked.parse(part, { gfm: true, breaks: true });
                return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
            } catch(e) {
                return <span key={index}>{part}</span>;
            }
        });
    }, [text, isReady]);

    if (!isReady) {
        return <span></span>; // Render nothing while loading to avoid layout shifts
    }

    return <div className="content-renderer">{elements}</div>;
});