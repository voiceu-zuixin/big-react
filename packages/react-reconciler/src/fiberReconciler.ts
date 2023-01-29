import { Container } from 'hostConfig'
import { ReactElementType } from 'shared/ReactTypes'
import { FiberNode, FiberRootNode } from './fiber'
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	UpdateQueue
} from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'
import { HostRoot } from './workTags'

/** 当执行ReactDOM.createRoot时会执行该函数，返回root */
export function createContainer(container: Container) {
	// 创建一个FiberNode，传入HostRoot
	const hostRootFiber = new FiberNode(HostRoot, {}, null)

	// 利用hostRootFiber，创建一个FiberRootNode，绑定container
	const root = new FiberRootNode(container, hostRootFiber)

	// 新建一个UpdateQueue实例，赋值给hostRootFiber.updateQueue
	hostRootFiber.updateQueue = createUpdateQueue()

	// 返回root，供外部使用，比如root.render()方法
	return root
}

/** 当执行root.render()的时候，会执行该函数，更新container */
export function updateContainer(
	element: ReactElementType | null,
	root: FiberRootNode
) {
	// 拿到 hostRootFiber
	const hostRootFiber = root.current

	// 构造一个Update数据
	const update = createUpdate<ReactElementType | null>(element)

	// 插入Update中，把hostRootFiber.updateQueue中的shared.pending添加上update
	enqueueUpdate(
		hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
		update
	)

	// 串联起render方法
	scheduleUpdateOnFiber(hostRootFiber)

	// 返回 element
	return element
}
