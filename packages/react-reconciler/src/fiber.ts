import { Props, Key, Ref } from 'shared/ReactTypes'
import { WorkTag } from './workTags'
import { Flags, NoFlags } from './fiberFlags'
// 在tsconfig里配置了path，这样在其他的包，比如后续要写的react-dom里就可以直接引用'hostConfig'
import { Container } from 'hostConfig'

/** FiberNode数据结构，非常重要，每一个节点的虚拟存储数据结构，不同于DOM节点，用于diff的专属结构 */
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
	memoizedState: any
	updateQueue: unknown
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
		// 如果是HostComponent的话，比如是<div>，stateNode就保存的该div的DOM
		this.stateNode = null
		this.type = null

		// 构成树状结构
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
		this.memoizedState = null
		this.updateQueue = null
		this.alternate = null
		/** 副作用 */
		this.flags = NoFlags
	}
}

/** 根据传入的FiberNode创建FiberRootNode根节点的FiberNode */
export class FiberRootNode {
	/** 宿主环境有可能不是DOM的，所以要更抽象的Container来表达 */
	container: Container
	current: FiberNode
	/** 递归更新完毕后的FiberNode */
	finshedWork: FiberNode | null
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container
		// root.current = hostRootFiber
		this.current = hostRootFiber
		hostRootFiber.stateNode = this
		this.finshedWork = null
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate
	if (wip === null) {
		// mount首次挂载，创建一个新的FiberNode
		wip = new FiberNode(current.tag, pendingProps, current.key)
		// wip.type = current.type
		wip.stateNode = current.stateNode

		// 替换alternate
		wip.alternate = current
		current.alternate = wip
	} else {
		// update
		wip.pendingProps = pendingProps
		wip.flags = NoFlags
	}
	wip.type = current.type
	wip.updateQueue = current.updateQueue
	wip.child = current.child
	wip.memoizedProps = current.memoizedProps
	wip.memoizedState = current.memoizedState

	return wip
}
