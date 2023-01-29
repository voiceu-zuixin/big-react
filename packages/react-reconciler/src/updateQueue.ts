import { Action } from 'shared/ReactTypes'

/** 代表更新的数据结构 */
export interface Update<State> {
	action: Action<State>
}

/** 消费Update的数据结构 */
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null
	}
}

// 范型在箭头函数里的用法：const fun = <T>(arr:T):number => {} ，表示传入一个范型T
// 在普通函数里是这样的：function fun <T>(arr:T):number {}
/** 创建Update实例的方法 */
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	}
}

// 写成这种对象的形式，是为了通过指针，共享同一份数据，所以名字叫shared
/** 创建UpdateQueue实例的方法 */
export const createUpdateQueue = <State>() => {
	return {
		shared: {
			pending: null
		}
	} as UpdateQueue<State>
}

/** 往UpdateQueue里增加Update */
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	updateQueue.shared.pending = update
}

/** UpdateQueue消费Update的方法，返回值是全新的Update */
export const processUpdateQueue = <State>(
	baseState: State, // 初始State
	pendingUpdate: Update<State> | null //要消费的Update
): { memoizedState: State } => {
	/** 学一下这种写法 ReturnType<typeof function<T>> */
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	}
	if (pendingUpdate !== null) {
		const action = pendingUpdate.action
		// 函数类型
		if (action instanceof Function) {
			// baseState 1 update (x)  ==> 4x  ==> memoizedState 4
			result.memoizedState = action(baseState)
		} else {
			// baseState 1 update 2  ==> memoizedState 2
			result.memoizedState = action
		}
	}

	return result
}
