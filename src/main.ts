import './style.css';
import { getAppTemplate } from './views/templates';
import { BlogApp } from './core/app';

const appContainer = document.getElementById('app');
if (appContainer) {
    appContainer.innerHTML = getAppTemplate();
}

document.addEventListener('DOMContentLoaded', () => {
    new BlogApp();
});