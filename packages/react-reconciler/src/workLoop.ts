// workLoop是用于fiber深度遍历的工作循环
import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTags'

/** 全局指针，触发更新后，正在reconciler中计算的fiberNode树，深度遍历的具体fiber位置 */
let workInProgress: FiberNode | null = null

/** 初始化fiberNode */
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {})
}

/** 调度Fiber方法，链接render和renderRoot的方式 */
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	// 拿到fiberRootNode
	const root = markUpdateFromFiberToRoot(fiber)

	// 开始执行更新流程
	renderRoot(root)

	// 对于首次渲染，必然是根节点，但是如果是后续的话，通过setState更新，就不一定是根节点了，
	// 所以需要先向上找到根节点，再进行根节点的递归向下遍历
	function markUpdateFromFiberToRoot(fiber: FiberNode) {
		let node = fiber
		let parent = node.return

		// 如果有父级结构，就往上走，指向父级
		while (parent !== null) {
			node = parent
			parent = node.return
		}

		// 如果是root了，就返回 stateNode 指向的 fiberRootNode
		if (node.tag === HostRoot) {
			return node.stateNode
		}

		// 否则返回 null
		return null
	}
}

/**
 * 更新的主流程
 * 调用renderRoot的，是需要触发更新的api的函数
 * workLoop的主要函数，其余用到的函数，根据用到的顺序，依次写在了下面 */
function renderRoot(root: FiberRootNode) {
	// 指向第一个fiberNode
	prepareFreshStack(root)

	/** TODO 为什么要写do while，又立马写了break，直接写正常函数不行吗 */
	// 开始递归
	do {
		try {
			workLoop()
			// 执行完毕之后break掉
			break
		} catch (e) {
			// 重制 workInProgress
			console.warn('workLoop发生错误', e)
			workInProgress = null
		}
	} while (true)
}

function workLoop() {
	// 只要 workInProgress 不为 null，就执行循环单元工作
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress)
	}
}

/** 单元工作 */
function performUnitOfWork(fiber: FiberNode) {
	// 在beginWork里会进行判断是否有子fiber，有就返回该子fiber，否则返回null，那么next就是fiber | null
	const next = beginWork(fiber)
	// 并且beginWork执行完毕后pendingProps发生了改变，就要赋值给memoizedProps
	fiber.memoizedProps = fiber.pendingProps

	// 没有子节点，就遍历兄弟节点
	if (next === null) {
		// 开始递归的归阶段
		completeUnitOfWork(fiber)
	} else {
		// 否则继续向下遍历
		workInProgress = next
	}
}

/** 递归的归阶段，需要遍历兄弟节点 */
function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber
	do {
		completeWork(node)
		const sibling = node.sibling
		// 如果存在兄弟节点，就需要去遍历兄弟节点
		if (sibling !== null) {
			workInProgress = sibling
			return
		}
		// 如果不存在兄弟节点，就往上归到父节点，该分支已经遍历结束
		node = node.return
		workInProgress = node
	} while (node !== null)
}
