const SERVER_URL = 'http://localhost:8081';

export async function logToServer(action: string, user: any, payload: any) {
    const logData = {
        timestamp: new Date().toISOString(),
        action: action,
        username: user ? user.username : 'GUEST',
        role: user ? user.role : 'none',
        details: typeof payload === 'string' ? payload : JSON.stringify(payload)
    };

    console.log(
        `%c[LOG SERVER] %c${logData.timestamp} %c[${logData.action}] %cby ${logData.username} (${logData.role}): %c${logData.details}`,
        'color: #bef264; font-weight: 950; background: #000; padding: 2px 4px; border: 1px solid #000;',
        'color: #9ca3af;',
        'color: #f43f5e; font-weight: bold;',
        'color: #38bdf8;',
        'color: #fff;'
    );

    try {
        await fetch(`${SERVER_URL}/api/logs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(logData)
        });
    } catch (error) {
        console.error('%c[SERVER CONNECT ERROR] Не удалось отправить лог на бэкенд!', 'color: red; font-weight: bold;', error);
    }
}