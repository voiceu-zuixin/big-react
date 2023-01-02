/** 判断当前的宿主环境是否支持symbol */
const supportSymbol = typeof Symbol === 'function' && Symbol.for

export const REACT_ELEMENT_TYPE = supportSymbol
	? Symbol.for('react.element')
	: 0xeac7
