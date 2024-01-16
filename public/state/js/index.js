// 获取视频元素
const video = document.getElementById('rtc_media_player')
// 获取截图容器
const screenshotContainer = document.getElementById('screenshot_container')
// 定义列数变量
let columnCount = 2
// 初始化截图索引
let screenshotIndex = 1

// 添加捕获按钮点击事件的事件监听器
const captureButton = document.getElementById('btn_capture')
captureButton.addEventListener('click', function() {
	// 创建一个新画布以容纳截图
	const newScreenshotCanvas = document.createElement('canvas')
	newScreenshotCanvas.width = video.videoWidth
	newScreenshotCanvas.height = video.videoHeight
	const newScreenshotContext = newScreenshotCanvas.getContext('2d')

	// 在新的截图画布上绘制当前视频帧
	newScreenshotContext.drawImage(video, 0, 0)

	// 将截图转换为数据URL
	const screenshotUrl = newScreenshotCanvas.toDataURL()

	// 创建截图的图像元素
	const div = document.createElement('div')
	div.className = 'imgs'
	const screenshotImage = document.createElement('img')
	screenshotImage.src = screenshotUrl
	screenshotImage.alt = `Screenshot ${screenshotIndex}`
	screenshotImage.className = 'screenshot-image'
	div.appendChild(screenshotImage)

	// 创建删除图标元素
	const deleteIcon = document.createElement('i')
	deleteIcon.className = 'bi bi-trash'
	div.appendChild(deleteIcon)

	// 将截图图像及删除图标添加到截图容器中
	screenshotContainer.insertBefore(div, screenshotContainer.firstChild)

	// 增加截图索引
	screenshotIndex++

	// 设置div的网格布局样式
	screenshotContainer.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`

	// 点击图像进行预览
	screenshotImage.addEventListener('click', function() {
		// 创建一个模态框元素
		const modal = document.createElement('div')
		modal.className = 'yulang'

		// 创建一个图片元素
		const previewImage = document.createElement('img')
		previewImage.src = screenshotImage.src
		previewImage.className = 'preview-image'

		// 初始放大倍数
		let scale = 1

		// 监听鼠标滚动事件
		previewImage.addEventListener('wheel', function(event) {
			event.preventDefault()

			// 根据滚动方向调整放大倍数
			if (event.deltaY < 0) {
				scale += 0.1
			} else {
				scale -= 0.1
				if (scale < 0.1) {
					scale = 0.1
				}
			}

			// 应用放大倍数到图片样式
			previewImage.style.transform = `scale(${scale})`
		})


		// 将图片元素添加到模态框中
		modal.appendChild(previewImage)

		// 将模态框添加到页面中
		document.body.appendChild(modal)

		// 关闭模态框的函数
		function closeModal() {
			document.body.removeChild(modal)
		}

		// 单击任意位置时关闭模态框
		modal.addEventListener('click', function(event) {
			if (event.target !== previewImage) {
				closeModal()
			}
		})
	})

	// 点击删除图标删除图片
	deleteIcon.addEventListener('click', function() {
		// 在这里实现删除截图的逻辑，可以从截图容器中移除该截图元素
		screenshotContainer.removeChild(div)
	})
})

// 添加窗口大小变化事件的事件监听器(适配)
// window.addEventListener('resize', function() {
// 	// 根据窗口宽度调整列数
// 	if (window.innerWidth < 950) {
// 		columnCount = 1
// 	} else if (window.innerWidth < 1100) {
// 		columnCount = 2
// 	} else {
// 		columnCount = 3
// 	}

// 	// 设置div的网格布局样式
// 	screenshotContainer.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`
// })