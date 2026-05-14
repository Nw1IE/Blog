// Типы для каррированных функций
type TruncateFn = (text: string) => string;
type HighlightFn = (text: string) => string;

/**
 * Экранирование HTML (XSS Protection)
 */
export const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Обрезка текста (Поддерживает каррирование)
 */
export function truncate(maxLength: number, ellipsis: string = '...'): TruncateFn {
    return (text: string): string => {
        return text.length > maxLength ? text.slice(0, maxLength) + ellipsis : text;
    };
}

/**
 * Подсветка ключевых слов (Поддерживает каррирование)
 */
export function highlightKeywords(keywords: string[], className: string = 'highlight'): HighlightFn {
    return (text: string): string => {
        if (!keywords.length) return text;
        const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');
        return text.replace(pattern, `<span class="${className}">$1</span>`);
    };
}

/**
 * Базовая подсветка синтаксиса
 */
export const formatCodeBlock = (code: string, language: string = 'javascript'): string => {
    const escaped = escapeHtml(code);
    const keywords = /\b(const|let|var|function|class|return|if|else|public|private|string|int|void)\b/g;
    const highlighted = escaped.replace(keywords, '<span class="text-blue-600 font-bold">$1</span>');
    
    // Используем 'language' в разметке, чтобы убрать предупреждение
    return `
        <figure class="my-4">
            <figcaption class="text-[10px] font-bold uppercase bg-gray-900 text-white inline-block px-2 py-0.5">${language}</figcaption>
            <pre class="bg-gray-100 p-3 font-mono text-sm border-l-4 border-gray-900 overflow-x-auto"><code>${highlighted}</code></pre>
        </figure>
    `;
};