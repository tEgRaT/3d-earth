document.addEventListener('DOMContentLoaded', function() {
    threeStart()
})

// scene
let scene
function initScene() {
    scene = new THREE.Scene()
}

// camera
// PerspectiveCamera(fov, aspect, near, far)
// fov(Number):仰角的角度
// aspect(Number): 截平面的长宽比，多为画布的长宽比
// near(Number): 近面的距离
// far(Number): 远面的距离
let camera
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
    camera.position.x = -500
    camera.position.y = 500
    camera.position.z = -500
}

// renderer
let renderer
function initThree() {
    width = document.getElementById('canvas-frame').clientWidth
    height = document.getElementById('canvas-frame').clientHeight
    
    // instantiate THREE.WebGLRenderer object
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 抗锯齿化
        alpha: true, // alpha 缓冲区
        canvas: renderer // 渲染器绘制输出的那个 canvas，这对应于下面的 domElement 属性，如果没有设置，则会创建一个新的画布元素
    })

    //sets size of renderer
    renderer.setSize(width, height)

    // load to domElement
    document.getElementById('canvas-frame').appendChild(renderer.domElement)

    // sets the clear color and opacity
    renderer.setClearColor(0x000000, 1.0)
}

// earth
let earthMesh
function initEarth() {
    // instantiate a sphere with radius 200
    let earthGeo = new THREE.SphereGeometry(200, 100, 100)
    let earthMater = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('/images/earth.jpg')
    })
    earthMesh = new THREE.Mesh(earthGeo, earthMater)
    scene.add(earthMesh)
}

// clouds
let cloudsMesh
function initClouds() {
    // instantiate a sphere which radius is a bit bigger than earth
    let cloudsGeo = new THREE.SphereGeometry(201, 100, 100)

    // transparent 与 opacity 搭配使用，设置材质的透明度，当 transparent 设为 true 时，会对材质特殊处理，对性能会有些损耗
    let cloudsMater = new THREE.MeshPhongMaterial({
        alphaMap: new THREE.TextureLoader().load('/images/clouds.jpg'),
        transparent: true,
        opacity: 0.2
    })

    cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater)
    scene.add(cloudsMesh)
}

// light
let light
function initLight() {
    // A light source positioned directly above the scene, with color fading from the sky color to the ground color
    // light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1)
    // scene.add(light)

    // envirenment light
    light = new THREE.AmbientLight(0xFFFFFF)
    light.position.set(100, 100, 200)
    scene.add(light)

    // 平行光
    // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
    // light = new THREE.DirectionalLight(0xFFFFBB, 1)
    // light.position.set(-1, 1, 1)
    // scene.add(light)
}

let controls
function threeStart() {
    initThree()
    initCamera()
    initScene()
    initLight()
    initEarth()
    initClouds()
    // load controler
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    renderer.clear()
    animate()
}

function animate() {
    controls.update()
    // 地球自转
    earthMesh.rotation.y -= 0.0005

    // 漂浮的云层
    cloudsMesh.rotation.y -= 0.00051
    cloudsMesh.rotation.z += 0.00051

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
