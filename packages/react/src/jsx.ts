import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import {
	Type,
	Key,
	Ref,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes'

/** ReactElement需要是唯一的值，防止滥用 */
const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		/** 自定义标记，原生react是没有这个的 */
		__mark: 'Voiceu'
	}
	return element
}

/**
 * type：标签类型，比如'div'、'span'
 * config：该标签的配置，比如 id、classname、children、其中key、ref需要注意
 * maybeChildren：第三个参数开始都当做children来处理，有可能传，也有可能不传
 */
export const jsx = (type: ElementType, config: any, ...maybeChildren: any) => {
	let key: Key = null // 没传入key，则默认为null
	let ref: Ref = null
	const props: Props = {}

	// 将config上的配置，复制给props
	for (const prop in config) {
		const val = config[prop]
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val // 转为string
			}
			continue
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = '' + val // 转为string
			}
			continue
		}
		// config其他的prop，需要判断是否是自己的属性，而不是原型上的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}

	// TODO 这里的children，如果 config里也有了怎么办，然后config里还是一个children，这里就直接覆盖？
	const maybeChildrenLength = maybeChildren.length
	if (maybeChildrenLength) {
		if (maybeChildrenLength === 1) {
			props.children = maybeChildren[0]
		} else {
			props.children = maybeChildren
		}
	}

	return ReactElement(type, key, ref, props)
}

export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null // 没传入key，则默认为null
	let ref: Ref = null
	const props: Props = {}

	// 将config上的配置，复制给props
	for (const prop in config) {
		const val = config[prop]
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val // 转为string
			}
			continue
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = '' + val // 转为string
			}
			continue
		}
		// config其他的prop，需要判断是否是自己的属性，而不是原型上的属性
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val
		}
	}

	return ReactElement(type, key, ref, props)
}
