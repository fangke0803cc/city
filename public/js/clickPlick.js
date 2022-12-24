import * as THREE from 'three'
export const clickPick = (_this) => {
  const rayCaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let x
  let y
  const label = document.querySelector('.label')
  window.addEventListener('click', onMouseClick)
  window.addEventListener('dblclick', onMouseDblClick)

  function showCard (element) {
    element.style.display = 'block'
    element.style.position = 'absolute'
    element.style.left = '170px'
    element.style.top = '60px'
  }
  function onMouseClick (event) {
    // console.log(event)
    x = event.clientX
    y = event.clientY
    const rect = _this.container.getBoundingClientRect()
    mouse.x = ((x - rect.left) / this.container.clientWidth) * 2 - 1
    mouse.y = -((y - rect.top) / this.container.clientHeight) * 2 + 1
    rayCaster.setFromCamera(mouse, _this.camera)
    const intersects = rayCaster.intersectObjects(_this.scene.children)
    // console.log(intersects)
    if (intersects.length > 0) {
      const objectName = intersects[0].object.name
      if (objectName.includes('sprite')) {
        const parentDiv = document.createElement('div')
        parentDiv.className = 'parentVideo'
        parentDiv.style.position = 'absolute'
        parentDiv.style.display = 'none'
        parentDiv.style.backgroundColor = 'rgba(25,25,25,0.5)'
        const titleDiv = document.createElement('div')
        titleDiv.style.cssText =
          'height: 24px;inline-height: 24px;float: left;color: #FFFFFF;font-size:20px;margin:10px 0 10px 20px'
        titleDiv.textContent = '监控录像'
        const closeDiv = document.createElement('div')
        closeDiv.className = 'videoImg'
        closeDiv.addEventListener('click', () => {
          const videoDiv = document.querySelectorAll('.parentVideo')
          for (const e of videoDiv) {
            e.remove()
          }
        })
        parentDiv.appendChild(titleDiv)
        parentDiv.appendChild(closeDiv)
        const videoLabel = document.createElement('video')
        videoLabel.autoplay = true
        videoLabel.muted = true
        videoLabel.controls = true
        videoLabel.loop = true
        videoLabel.style.width = '100%'
        videoLabel.style.height = '350px'
        const videoSource = document.createElement('source')
        videoSource.src = 'assets/video/watch.mp4'
        videoSource.type = 'video/mp4'
        videoLabel.appendChild(videoSource)
        parentDiv.appendChild(videoLabel)
        document.body.appendChild(parentDiv)
        showCard(parentDiv, x, y)
      }
    }
    showCard(label)
  }

  function onMouseDblClick (event) {
    x = event.clientX
    y = event.clientY
    event.preventDefault()

    const rect = _this.container.getBoundingClientRect()
    mouse.x = ((x - rect.left) / this.container.clientWidth) * 2 - 1
    mouse.y = -((y - rect.top) / this.container.clientHeight) * 2 + 1
    rayCaster.setFromCamera(mouse, _this.camera)
    const intersects = rayCaster.intersectObjects(_this.scene.children)
    if (intersects.length > 0) {
      const objectName = intersects[0].object.name
      if (objectName.substring(0, 3) === 'cit') {
        _this.$router.push({
          path: '/buildingdetail',
          query: {
            name: objectName
          }
        })
      }
    }
  }
}
