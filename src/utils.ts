export interface PostStats {
    wordCount: number;
    charCountWithSpaces: number;
    charCountNoSpaces: number;
    avgWordLength: number;
    sentenceCount: number;
    readabilityIndex: number;
    readingTime: number;
}

export const calculatePostStats = (text: string): PostStats => {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const charCountWithSpaces = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;
    const wordCount = words.length;
    
    const avgWordLength = wordCount > 0 ? charCountNoSpaces / wordCount : 0;
    const sentenceCount = sentences.length || 1;
    
    // Упрощенный индекс читаемости (ARI)
    // 4.71 * (chars/words) + 0.5 * (words/sentences) - 21.43
    const readabilityIndex = wordCount > 0 
        ? Math.round(4.71 * (charCountNoSpaces / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43)
        : 0;

    return {
        wordCount,
        charCountWithSpaces,
        charCountNoSpaces,
        avgWordLength: Number(avgWordLength.toFixed(1)),
        sentenceCount,
        readabilityIndex,
        readingTime: Math.ceil(wordCount / 200) // 200 слов в минуту
    };
};

export const formatSmartDate = (dateStr: string): { text: string, isToday: boolean } => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
        return { text: `${diffInHours} ч. назад`, isToday: true };
    } else if (diffInHours < 48 && date.getDate() === now.getDate() - 1) {
        return { text: "Вчера", isToday: false };
    } else {
        return { 
            text: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }), 
            isToday: false 
        };
    }
};