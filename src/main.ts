import './style.css'; // Если у тебя есть стандартный css файл от Vite
import { getAppTemplate } from './templates';
import { BlogApp } from './core/app';

// 1. Внедряем HTML в DOM
const appContainer = document.getElementById('app');
if (appContainer) {
    appContainer.innerHTML = getAppTemplate();
}

// 2. Инициализируем логику
document.addEventListener('DOMContentLoaded', () => {
    new BlogApp();
});