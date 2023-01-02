import { Props, Key, Ref } from 'shared/ReactTypes'
import { WorkTag } from './workTags'
import { Flags, NoFlags } from './fiberFlags'

export class FiberNode {
	// 实例的状态
	/** 类型，如果是FunctionComponent，那么type就是函数本身() => {} */
	type: any
	/** fiberNode是什么类型的节点 */
	tag: WorkTag
	/** 如果是HostComponent的话，比如是<div>，stateNode就保存的该div的DOM */
	stateNode: any
	/** 当前的属性，包含了有哪些props需要改变 */
	pendingProps: Props
	/** 工作流结束后保存的一些属性 */
	memoizedProps: Props | null
	key: Key
	ref: Ref

	// 节点间的关系
	/** 父节点 */
	return: FiberNode | null
	/** 兄弟节点 */
	sibling: FiberNode | null
	/** 子节点 */
	child: FiberNode | null
	/** 同级的index */
	index: number

	/** 用于替换，指向current（与真实UI对应的fiberNode树）或者workInProgress（触发更新后，正在计算的fiberNode树） */
	alternate: FiberNode | null

	/** 标记，比如这个fiber的动作，新增还是删除 */
	flags: Flags

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例的属性
		this.tag = tag
		this.key = key
		this.stateNode = null
		this.type = null

		// 指向父fiberNode
		this.return = null
		this.sibling = null
		this.child = null
		// 同级的标签，比如li
		this.index = 0

		this.ref = null

		// 作为工作单元
		/** 刚开始工作的时候的属性 */
		this.pendingProps = pendingProps
		/** 工作结束后的一些属性（计算结束后的props） */
		this.memoizedProps = null

		this.alternate = null
		/** 副作用 */
		this.flags = NoFlags
	}
}
