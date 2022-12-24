
export function initRenderer (CSS2Drenderer, container, renderer) {
  CSS2Drenderer.setSize(container.clientWidth, container.clientHeight)
  CSS2Drenderer.domElement.style.position = 'absolute'
  CSS2Drenderer.domElement.style.top = '-20px'
  CSS2Drenderer.domElement.style.right = '-20px'
  CSS2Drenderer.domElement.className = 'css2dRenderer'
  // CSS2Drenderer.domElement.style.zIndex = '10'
  // 设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
  CSS2Drenderer.domElement.style.pointerEvents = 'none'
  container.appendChild(CSS2Drenderer.domElement)
  console.log(CSS2Drenderer.domElement)

  renderer.setSize(container.clientWidth, container.clientHeight)
  // console.log(renderer);
  // 将webgl渲染的canvas内容添加到body
  container.appendChild(renderer.domElement)
}
export function initControls (controls) {
  // controls.enableDamping = true
}
