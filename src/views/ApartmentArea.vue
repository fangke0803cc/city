<template>
  <div>
<el-container>
  <el-aside width="150px" style="height:900px">
    <el-menu
    @select="handleSelect"
    >
      <div class="user_box">
        <div class="username">
          <i class="el-icon-user-solid"></i> admin
        </div>
      </div>
      <el-menu-item
      v-for="(item,index) in menuList"
      :key="item.text"
      :index="index.toString()"
      >
      <i :class="item.icon"></i>
      <span>{{item.text}}</span>
      </el-menu-item>
      <el-submenu index="1-4">
          <template slot="title"><i class="el-icon-s-help"></i>生活服务</template>
          <el-menu-item index="1-4-1">建筑详情</el-menu-item>
          <el-menu-item index="1-4-2">选项4-1</el-menu-item>
          <el-menu-item index="1-4-3">选项4-1</el-menu-item>
      </el-submenu>
      <el-submenu index="1-5">
          <template slot="title"><i class="el-icon-s-ticket"></i>社区管理</template>
          <el-menu-item index="1-5-1">选项4-1</el-menu-item>
          <el-menu-item index="1-5-2">选项4-1</el-menu-item>
          <el-menu-item index="1-5-3">选项4-1</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
  <el-main id="container">
    <el-card style="width:300px" class="label">
      <div v-for="(info,index) in dataInfo" :key="index">
        <span>{{info.key}}</span>
        <span >{{info.value}}</span>
      </div>
    </el-card>
  </el-main>
</el-container>
  </div>
</template>

<script>
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { initControls, initRenderer } from '@/utils/baseElement.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { clickPick } from '../../public/js/clickPlick'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

// import screenfull from 'screenfull'
export default {
  data () {
    return {
      menuList: [
        { text: '社区观光', icon: 'el-icon-video-camera-solid' },
        { text: '视角切换', icon: 'el-icon-place' },
        { text: '初始化', icon: 'el-icon-refresh' }
      ],
      // 正常视角
      // normalView: true
      dataInfo: [
        { key: '车辆名称', value: 123 },
        { key: '行驶公里数', value: Math.round(Math.random() * 20000) }
      ],
      normalView: true,
      spriteLabelArr: [],
      t: 0,
      isShowFire: false
    }
  },
  mounted () {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.css2dRender = null
    this.controls = null
    this.lockcontrols = null
    this.moveForward = false
    this.moveBackward = false
    this.moveLeft = false
    this.moveRight = false
    this.canJump = false
    this.texture = null
    this.scanEffect = null
    this.prevTime = performance.now()
    this.velocity = new THREE.Vector3()
    this.direction = new THREE.Vector3()
    this.gui = null
    this.axesHelper = null
    this.container = document.querySelector('#container')
    this.init()
  },
  methods: {
    handleSelect (index) {
      switch (index) {
        case '0':
          this.tourCity()
          break
        case '2':
          this.initViewpoint()
          break
        case '1-4-1':
          this.$router.push('/buildingdetail')
          break
        case '1-5-1':
          this.addCamera()
          break
        case '1-5-2':
          this.earlyWaring()
          break
      }
    },
    tourCity () {
      this.normalView = false
      // this.camera.position.y = 100
      // this.camera.lookAt(0, 0, 0)
      // this.lockcontrols.getObject().position.x = 0
      // this.lockcontrols.getObject().position.y = 0
      // this.lockcontrols.getObject().position.z = -500

      // this.lockcontrols.getObject().position.x = -200
      // this.lockcontrols.getObject().position.y = 1200
      // this.lockcontrols.getObject().position.z = -400
      this.lockcontrols.lock()
    },
    // 初始化方法
    init () {
      this.initSceneMed()
      this.initCamera()
      this.initLight()
      this.initRendererMed()
      this.initControlsMed()
      this.AsyncInitModel()
      this.initClickPick()
      this.initPointLockControl()
      this.initAxesHelper()
      window.addEventListener('resize', this.onWindowResize)
      // window.addEventListener('click', this.initClickPick)
    },
    // 初始化场景
    initSceneMed () {
      this.scene = new THREE.Scene()
    },
    // 初始化相机
    initCamera () {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.container.clientWidth / this.container.clientHeight,
        0.1,
        10000
      )
      this.camera.position.set(-400, 500, -800)
    },
    // 使用async方法加载模型
    async AsyncInitModel () {
      await this.testModel()
      this.render()
    },
    // 加载模型
    testModel () {
      new GLTFLoader()
        .setPath('./assets/model/梦幻卡通mafer_city/')
        .load('scene.gltf', (gltf) => {
          const city = gltf.scene
          city.scale.set(1, 1, 1)
          city.traverse((res) => {
            res.name = 'city'
            if (res.type === 'Mesh') {
              res.material.emissive = res.material.color
              res.material.emissiveMap = res.material.map
            }
          })
          city.rotateY(-Math.PI / 2)
          // city.position.set(1100, 10, 850);
          city.position.set(0, 0, 0)
          this.scene.add(city)
        })
    },
    // 初始化控制器
    initControlsMed () {
      // 轨道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      initControls(this.controls)
    },
    // 初始化灯光
    initLight () {
      // // 点光源(灯泡)
      // const PointLight = new THREE.PointLight(0xff0000, 0.6)
      // this.scene.add(PointLight)
      // 环境光
      const ambient = new THREE.AmbientLightProbe(0xff0000, 1)
      this.scene.add(ambient)
      // this.camera.add(PointLight)
    },
    // 初始化渲染器
    initRendererMed () {
      // // css2d渲染器
      this.css2dRender = new CSS2DRenderer()

      // 场景渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true
      })
      initRenderer(this.css2dRender, this.container, this.renderer)
      // this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      // // console.log(renderer);
      // // 将webgl渲染的canvas内容添加到body
      // this.container.appendChild(this.renderer.domElement)
    },
    // 初始化视角
    initViewpoint () {
      this.normalView = true
      // 初始化视图
      this.controls.reset()
    },
    // 添加点击效果
    initClickPick () {
      clickPick(this)
    },
    // 定义全屏方法
    launchIntoFullscreen (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    // 初始化指针控制器，监听键盘事件
    initPointLockControl () {
      this.lockcontrols = new PointerLockControls(this.camera, document.body)
      this.lockcontrols.addEventListener('lock', () => this.launchIntoFullscreen(this.container))
      // this.scene.add(this.lockcontrols.getObject())
      const onKeyDown = (event) => {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            this.moveForward = true

            break
          case 'ArrowLeft':
          case 'KeyA':
            this.moveLeft = true
            console.log(this.moveLeft)

            break

          case 'ArrowDown':
          case 'KeyS':
            this.moveBackward = true
            break

          case 'ArrowRight':
          case 'KeyD':
            this.moveRight = true
            console.log(this.moveRight)

            break

          case 'Space':
            if (this.canJump === true) this.velocity.y += 350
            this.canJump = false
            break
        }
      }
      const onKeyUp = (event) => {
        switch (event.code) {
          case 'ArrowUp':
          case 'KeyW':
            this.moveForward = false

            break

          case 'ArrowLeft':
          case 'KeyA':
            this.moveLeft = false
            console.log(this.moveLeft)

            break

          case 'ArrowDown':
          case 'KeyS':
            this.moveBackward = false

            break

          case 'ArrowRight':
          case 'KeyD':
            this.moveRight = false
            console.log(this.moveRight)

            break
        }
      }
      document.addEventListener('keydown', onKeyDown, false)
      document.addEventListener('keyup', onKeyUp, false)
    },
    // 第一人称移动，需要在render()里面实时更新位置
    firstPersonMove () {
      const time = performance.now()

      const delta = (time - this.prevTime) / 1000
      this.velocity.x -= this.velocity.x * 10.0 * delta
      this.velocity.z -= this.velocity.z * 10.0 * delta
      this.velocity.y -= 9.8 * 100.0 * delta // 100.0 = mass

      this.direction.z = Number(this.moveForward) - Number(this.moveBackward)
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft)
      // console.log(this.direction)
      this.direction.normalize() // this ensures consistent movements in all directions

      if (this.moveForward || this.moveBackward) { this.velocity.z -= this.direction.z * 2000.0 * delta }

      if (this.moveLeft || this.moveRight) {
        this.velocity.x -= this.direction.x * 2000.0 * delta
      }
      // this.lockcontrols.moveRight(-this.velocity.x * delta)
      // this.lockcontrols.moveForward(-this.velocity.z * delta)

      this.lockcontrols.getObject().translateX(this.velocity.x * delta) // new behavior
      this.lockcontrols.getObject().position.y += this.velocity.y * delta // new behavior
      this.lockcontrols.getObject().translateZ(this.velocity.z * delta) // new behavior
      if (this.lockcontrols.getObject().position.y < 10) {
        this.velocity.y = 0
        this.lockcontrols.getObject().position.y = 0

        this.canJump = true
      }
      this.prevTime = time
    },
    // 监控摄像头
    addCamera () {
      // 定义监控摄像机所在的模型的name数组
      const trr = [
        { x: -10, y: 178, z: 3 },
        { x: -148, y: 158, z: 150 }
      ]
      const imgUrl = require('../../public/assets/images/video.png')
      // 为什么要加这个判断？
      if (this.spriteLabelArr.length) {
        for (const label of this.spriteLabelArr) {
          label.parent.remove(label)
        }
        this.spriteLabelArr.splice(0)
      } else {
        trr.forEach(item => {
          const { x, y, z } = item
          const spriteMaterial = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(imgUrl),
            transparent: true
          })
          const sprite = new THREE.Sprite(spriteMaterial)
          sprite.name = 'spriteCamera'
          sprite.scale.set(50, 50, 50)
          sprite.position.set(x, y, z)
          console.log(sprite.position)
          this.spriteLabelArr.push(sprite)

          this.scene.add(sprite)
        })
        // this.initGui()
      }
    },
    // 初始化控制面板
    initGui () {
      this.gui = new dat.GUI()
      this.gui.add(this.spriteLabelArr[0].position, 'x').min(-200).max(10).step(0.1)
      this.gui.add(this.spriteLabelArr[0].position, 'y').min(-5).max(200).step(0.1)
      this.gui.add(this.spriteLabelArr[0].position, 'z').min(-5).max(300).step(0.1)
    },
    // 初始化坐标系
    initAxesHelper () {
      this.axesHelper = new THREE.AxesHelper(1000)
      this.scene.add(this.axesHelper)
    },
    // 预警
    earlyWaring () {
      // 具体模型位置根据修改后模型更改
      const obj = this.scene.children[2].children[0]
      console.log(this.scene.children)
      const label = this.tag('depModel失火啦！！！')
      console.log(obj.position)
      label.position.set(obj.position)
      const fire = this.createFire(
        8,
        obj.position.x,
        obj.position.y,
        obj.position.z
      )
      // label.scale.set(50, 50, 50)
      obj.add(label, fire)
      this.isShowFire = true
      this.createScanEffect()
      // console.log(this.scene.children)
      // console.log(label)
    },
    // 渲染
    render () {
      this.renderer.render(this.scene, this.camera)
      this.css2dRender.render(this.scene, this.camera)
      if (this.normalView) {
        this.controls.update()
      }
      if (this.lockcontrols.isLocked) {
        this.firstPersonMove()
      }
      if (this.isShowFire) {
        this.updateLoop(15)
      }
      requestAnimationFrame(this.render)
    },
    tag (msg) {
      const div = document.createElement('div')
      div.innerHTML = msg
      div.style.display = 'block'
      div.classList.add('tag')
      // 样式冲突，div不显示
      // this.container.appendChild(div)
      // div.style.zIndex = '100'

      const label = new CSS2DObject(div)
      label.name = 'fireLabel'
      div.style.pointerEvents = 'none'// 避免HTML标签遮挡三维场景的鼠标事件
      // 设置HTML元素标签在three.js世界坐标中位置
      // label.position.set(x, y, z);
      return label
    },
    // 创建火焰
    createFire (size, x, y, z) {
      const w = size
      const h = 1.6 * w
      const geometry = new THREE.PlaneGeometry(w, h)
      geometry.rotateX(Math.PI / 2)
      const textureLoader = new THREE.TextureLoader()
      this.texture = textureLoader.setPath('/assets/images/').load('fire.png')
      const num = 15 // 火焰多少帧图
      // .repeat方法设置uv两个方向纹理重复数量
      this.texture.repeat.set(1 / num, 1) // 1/num：从图像上截图一帧火焰
      const material = new THREE.MeshBasicMaterial({
        map: this.texture,
        transparent: true,
        opacity: 0.4, // 整体调节透明度 和三维场景相融合
        side: THREE.DoubleSide, // 双面可见
        depthWrite: false // 是否对深度缓冲区有任何的影响
      })
      const fire = new THREE.Mesh(geometry, material) // 火焰网格模型
      const group = new THREE.Group()
      fire.name = 'fire'
      fire.scale.set(10, 10, 10)
      fire.position.set(120, 120, 220)
      group.add(
        fire,
        fire.clone().rotateZ(Math.PI / 2),
        fire.clone().rotateZ(Math.PI / 4)
      )
      return group
    },
    // 火焰动画
    updateLoop (num) {
      this.t += 0.1 // 调节火焰切换速度
      if (this.t > num) this.t = 0
      //  Math.floor(t)取整 保证一帧一帧切换
      this.texture.offset.x = Math.floor(this.t) / num // 动态更新纹理偏移 播放关键帧动画 产生火焰然后效果
    },
    // 创建扫描雷达
    createScanEffect () {
      const planeGeometry = new THREE.PlaneBufferGeometry(50, 50)
      planeGeometry.rotateX(Math.PI / 2)
      const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
      })
      this.scanEffect = new THREE.Mesh(planeGeometry, material)
      this.scanEffect.position.set(-180, 90, 110)
      this.scene.add(this.scanEffect)
    },
    // 屏幕自适应
    onWindowResize () {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      //   更新渲染器
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      //   设置渲染器的像素比
      // this.renderer.setPixelRatio(window.devicePixelRatio)
    }
  }
}

</script>

<style>
@import "@/assets/CSS/page/apartmentArea.css";
</style>
