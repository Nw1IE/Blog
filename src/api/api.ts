import type { User } from '../types/types';

export const logToServer = async (action: string, currentUser: User | null, details: any = {}) => {
    const username = currentUser ? currentUser.username : 'Guest';
    try {
        await fetch('http://localhost:8080/api/client-logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Client-Action': action,
                'X-Client-User': username
            },
            body: JSON.stringify({ action, user: username, timestamp: new Date().toISOString(), details })
        });
    } catch (e) {
        console.log(`[LOG_TO_SERVER] ${action}:`, details);
    }
};