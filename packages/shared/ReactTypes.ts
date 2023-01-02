export type Type = any
export type Key = any
export type Ref = any
export type Props = any
export type ElementType = any

export interface ReactElementType {
	$$typeof: symbol | number
	type: ElementType
	key: Key
	ref: Ref
	props: Props
	__mark: string
}

/** setState的参数类型 */
export type Action<State> = State | ((preState: State) => State)
