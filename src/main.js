import { mount } from 'svelte';
import App from './App.svelte';
import './style.css';
import './docs.css';

mount(App, { target: /** @type {HTMLElement} */ (document.getElementById('app')) });
