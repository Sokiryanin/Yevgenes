// Налаштування шаблону
import templateConfig from '../template.config.js'
// Логгер
import logger from './logger.js'

import PluginCritical from 'rollup-plugin-critical';

import { normalizePath } from 'vite'
import { globSync } from 'glob'

const criticalPages = []

globSync('dist/{*.html,ua/*.html}').forEach((file) => {
	file = normalizePath(file)
	criticalPages.push({
		uri: file,
		template: file.replace('dist/', '').replace('.html', '')
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