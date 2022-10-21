import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import HDR from '../static/sepulchral_chapel_rotunda_2k.hdr';
import Glass from '../static/Safe_Logo_Symbol_2.glb';
import {dumpObject} from './common';

const params = {
  color: 0x12ff80,
  transmission: 0.5,
  opacity: 1,
  metalness: 0.5,
  roughness: 0,
  ior: 1.52,
  thickness: 0.1,
  specularIntensity: 0.5,
  specularColor: 0xffffff,
  lightIntensity: 1,
  exposure: 1
};

let camera, scene, renderer;

let wineGlass;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

const hdrEquirect = new RGBELoader()
  .load( HDR, function () {

    hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;

    init();
    animate();
    //render();

  } );

function init() {

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = params.exposure;

  document.addEventListener( 'mousemove', onDocumentMouseMove ); 

  window.addEventListener( 'resize', onWindowResize );

  renderer.outputEncoding = THREE.sRGBEncoding;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 1, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 0, 0, 120 );

  //Load background texture
const loader = new THREE.TextureLoader();
loader.load('../static/background.jpg' , function(texture)
            {
             scene.background = texture;  
            });
  //scene.background = hdrEquirect;
  scene.environment = hdrEquirect;

  const material = new THREE.MeshPhysicalMaterial( {
    color: params.color,
    metalness: params.metalness,
    roughness: params.roughness,
    ior: params.ior,
    transmission: params.transmission,
    specularIntensity: params.specularIntensity,
    specularColor: params.specularColor,
    opacity: params.opacity,
    side: THREE.DoubleSide,
  } );

  const gltf_loader = new GLTFLoader();
  gltf_loader.load(Glass, (gltf) => {
    const root = gltf.scene
    scene.add( root )
    console.log(dumpObject(root).join('\n'))

    wineGlass = root.getObjectByName('Cylinder')

    wineGlass.material = material
    render()
  })

  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(dirLight);

  //const controls = new OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // use if there is no animation loop
  //controls.minDistance = 10;
  //controls.maxDistance = 150;


}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );
  render();

}

function render() {
  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;

  camera.lookAt( scene.position );
  renderer.render( scene, camera );

}