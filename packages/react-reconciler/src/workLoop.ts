// workLoop是用于fiber深度遍历的工作循环
import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { FiberNode } from './fiber'

/** 触发更新后，正在reconciler中计算的fiberNode树，深度遍历的具体fiber位置 */
let workInProgress: FiberNode | null

/** 初始化fiberNode */
function prepareFreshStack(fiber: FiberNode) {
	workInProgress = fiber
}

/**
 * 更新的主流程
 * 调用renderRoot的，是需要触发更新的api的函数
 * workLoop的主要函数，其余用到的函数，根据用到的顺序，依次写在了下面 */
function renderRoot(root: FiberNode) {
	// 指向第一个fiberNode
	prepareFreshStack(root)

	// 开始递归
	do {
		try {
			workLoop()
			break
		} catch (e) {
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
	// 并且beginWork执行完毕后pendingProps就是memoizedProps
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
