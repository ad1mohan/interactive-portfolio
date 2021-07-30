
			import * as THREE from './build/three.module.js';

			import { GUI } from './jsm/libs/dat.gui.module.js';

			import { MapControls } from './jsm/controls/OrbitControls.js';

			let camera, controls, scene, renderer;
			

			init();
			//render(); // remove when using next line for animation loop (requestAnimationFrame)
			animate();

			function init() {

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xcccccc );
				scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 200, 100, 0 );

				// controls

				controls = new MapControls( camera, renderer.domElement );

				//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.05;

				controls.screenSpacePanning = false;

				controls.minDistance = 100;
				controls.maxDistance = 500;

				controls.maxPolarAngle = Math.PI / 2;
				controls.enableRotate = false;
				var minPan = new THREE.Vector3( - 200, - 200, - 200 );
				var maxPan = new THREE.Vector3( 200, 200, 200 );
				var _v = new THREE.Vector3();
				
				controls.addEventListener("change", function() {
					_v.copy(controls.target);
					controls.target.clamp(minPan, maxPan);
					_v.sub(controls.target);
					camera.position.sub(_v);
				})

				const axesHelper = new THREE.AxesHelper( 5 );
				scene.add( axesHelper );

				// world

				const geometry = new THREE.BoxGeometry( 1, 1, 1 );
				geometry.translate( 0, 0.5, 0 );
				const material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

				for ( let i = 0; i < 50; i ++ ) {

					const mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = Math.random() * 1600 - 800;
					mesh.position.y = 0;
					mesh.position.z = i*5;
					mesh.scale.x = 40;
					mesh.scale.y = 5;
					mesh.scale.z = 40;
					mesh.updateMatrix();
					mesh.matrixAutoUpdate = false;
					scene.add( mesh );

				}

				// lights

				const dirLight1 = new THREE.DirectionalLight( 0xffffff );
				dirLight1.position.set( 1, 1, 1 );
				scene.add( dirLight1 );

				const dirLight2 = new THREE.DirectionalLight( 0x002288 );
				dirLight2.position.set( - 1, - 1, - 1 );
				scene.add( dirLight2 );

				const ambientLight = new THREE.AmbientLight( 0x222222 );
				scene.add( ambientLight );

				//

				window.addEventListener( 'resize', onWindowResize );


				const gui = new GUI();
				gui.hide();
				gui.add( controls, 'screenSpacePanning' );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );
				console.log(camera.position)
				controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
				
				render();

			}

			function render() {

				renderer.render( scene, camera );

			}