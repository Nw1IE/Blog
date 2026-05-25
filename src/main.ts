<<<<<<< HEAD
import './style.css';
import { getAppTemplate } from './views/templates';
import { BlogApp } from './core/app';

=======
import './style.css'; // Если у тебя есть стандартный css файл от Vite
import { getAppTemplate } from './templates';
import { BlogApp } from './core/app';

// 1. Внедряем HTML в DOM
>>>>>>> 9a9714a6e53131407cac6a555236384881661d4d
const appContainer = document.getElementById('app');
if (appContainer) {
    appContainer.innerHTML = getAppTemplate();
}

<<<<<<< HEAD
=======
// 2. Инициализируем логику
>>>>>>> 9a9714a6e53131407cac6a555236384881661d4d
document.addEventListener('DOMContentLoaded', () => {
    new BlogApp();
});