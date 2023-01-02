import path from 'path'
import fs from 'fs'
import ts from 'rollup-plugin-typescript2'
import cjs from '@rollup/plugin-commonjs'

/** 当前目录为 ./scripts/rollup/utils.js，需要跳转到 ./packages */
const pkgPath = path.resolve(__dirname, '../../packages')
const distPath = path.resolve(__dirname, '../../dist/node_modules')

export function resolvePkgPath(pkgName, isDist) {
	// 如果是产物，就返回产物下的包名
	if (isDist) return `${distPath}/${pkgName}`
	// 否则就是包名
	return `${pkgPath}/${pkgName}`
}

export function getPackageJSON(pkgName) {
	// 包的路径
	const path = `${resolvePkgPath(pkgName)}/package.json`
	const str = fs.readFileSync(path, { encoding: 'utf-8' })
	// 序列化
	return JSON.parse(str)
}

/**
 * 基础plugins
 * 解析esmodule的plugin、解析ts的plugin
 *  */
export function getBaseRollPlugins({ typescript = {} } = {}) {
	return [cjs(), ts(typescript)]
}
