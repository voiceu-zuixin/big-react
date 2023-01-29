/** 什么类型的fiberNode节点 */
export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText

/** 函数式组件 */
export const FunctionComponent = 0
/** 根节点，比如ReactDOM.render() */
export const HostRoot = 3
/** 节点组件，比如一个<div></div> */
export const HostComponent = 5
/** <div>123</div>下面的一些文本123 */
export const HostText = 6
