// Налаштування шаблону
import templateConfig from '../template.config.js'
// Логгер
import logger from './logger.js'

import PluginCritical from 'rollup-plugin-critical';

import { normalizePath } from 'vite'
import { globSync } from 'glob'

const criticalPages = []

// Список сторінок беремо з src/, а не з dist/ — dist/ ще порожній у момент
// завантаження конфігу (до старту самої збірки). На CI/Vercel, де dist/
// завжди чистий перед білдом, глоб по dist/ раніше знаходив 0 файлів і
// critical CSS мовчки не генерувався взагалі (працювало лише локально,
// бо dist/ лишався заповненим від попередніх ручних збірок). Значення
// uri/template лише рядки на цьому етапі — самі файли critical реально
// читає пізніше, коли dist/ вже заповнений цим-таки білдом.
globSync('src/{*.html,ua/*.html}').forEach((file) => {
	file = normalizePath(file)
	const relative = file.replace(/^src\//, '')
	criticalPages.push({
		uri: `dist/${relative}`,
		template: relative.replace('.html', '')
	})
})

export const rollupPlugins = [
	// Генерація критичних стилів
	...((templateConfig.styles.critical) ?
		[PluginCritical({
			criticalUrl: './',
			criticalBase: './dist/',
			criticalPages: criticalPages,
			criticalConfig: {
				// Мобільний viewport, а не десктопний — PageSpeed оцінює саме
				// мобільну версію, і "above the fold" на телефоні інакший.
				width: 390,
				height: 844,
				inline: true,
			},
		})] : []),
]