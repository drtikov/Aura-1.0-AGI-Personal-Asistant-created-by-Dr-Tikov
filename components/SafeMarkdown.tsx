
import React from 'react';

export const SafeMarkdown = React.memo(({ text }: { text: string }) => {
    // Use a regex to split the string by markdown delimiters, keeping the delimiters
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);

    const elements = parts.flatMap((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`strong-${i}`}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={`em-${i}`}>{part.slice(1, -1)}</em>;
        }
        // Handle newlines within normal text parts
        return part.split('\n').map((line, j) => (
            <React.Fragment key={`line-${i}-${j}`}>
                {line}
                {j < part.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    });

    return <p>{elements}</p>;
});
