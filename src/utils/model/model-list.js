import * as THREE from 'three'

export function test () {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
  // 根据几何体和材质创建物体
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(0, 0, 0)
  return cube
}
