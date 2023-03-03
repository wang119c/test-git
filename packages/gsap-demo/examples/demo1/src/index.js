import * as THREE from "three";
import { gsap } from "gsap";

// data

const config = {
  gridSize: 20,
};

// app

class App {
  resetting = false;
  looping = false;

  constructor() {
    this.initTHREE();
    this.createScene();
  }

  initTHREE() {
    this.container = document.querySelector(".container");
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      pixelRatio: window.devicePixelRatio,
    });
    this.renderer.setClearColor("#f1f1f1");
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera();
    this.camera.near = 0;
    this.camera.far = 10000;
    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(new THREE.Vector3(0, config.gridSize * 0.25, 0));

    this.resize();
  }

  createScene() {
    this.createLights();
    this.createBoxes();
  }

  createLights() {
    this.mainLight = new THREE.DirectionalLight();
    this.mainLight.position.set(1, 0.5, 0.25);

    this.scene.add(this.mainLight);
  }

  createBoxes() {
    const { gridSize } = config;
    const sideCount = gridSize * gridSize;

    this.boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    this.boxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 1,
      color: 0xffffff,
    });

    const makeSide = (x, y, z) => {
      const boxes = [];

      for (let i = 0; i < sideCount; i++) {
        const a = i % gridSize;
        const b = (i / gridSize) | 0;
        const c = gridSize * 0.5;

        const box = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
        box.position[x] = a;
        box.position[y] = b;
        box.position[z] = c;

        box.userData = {
          startPosition: { ...box.position },
          startScale: { ...box.scale },
        };

        this.scene.add(box);

        boxes.push(box);
      }

      return boxes;
    };

    this.leftBoxes = makeSide("x", "y", "z");
    this.rightBoxes = makeSide("z", "y", "x");
    this.topBoxes = makeSide("x", "z", "y");

    this.allBoxes = [...this.leftBoxes, ...this.rightBoxes, ...this.topBoxes];
  }

  animate = () => {
    if (this.looping) {
      this.reset();
    } else if (!this.resetting) {
      this.loop();
    }
  };

  reset = () => {
    this.resetting = true;
    this.looping = false;

    if (this.loopTimeline) {
      this.loopTimeline.kill();
      this.loopTimeline = null;
    }

    this.resetTimeline = gsap.timeline({
      onComplete: this.loop,
      defaults: {
        duration: 0.5,
        ease: "power2.out",
      },
    });

    this.allBoxes.forEach((box) => {
      this.resetTimeline.to(
        box.position,
        {
          ...box.userData.startPosition,
        },
        0
      );
      this.resetTimeline.to(
        box.scale,
        {
          ...box.userData.startScale,
        },
        0
      );
    });
  };

  loop = () => {
    this.resetting = false;
    this.looping = true;

    this.loopTimeline = gsap.timeline({
      defaults: {
        repeat: -1,
        yoyo: true,
        duration: gsap.utils.random(0.5, 4.0),
        ease: gsap.utils.random([
          "power3.inOut",
          "power4.inOut",
          "expo.inOut",
          "back.inOut",
        ]),
        stagger: {
          amount: gsap.utils.random(0.1, 2.0),
          // let gsap know what our grid size is
          grid: [config.gridSize, config.gridSize],
          // pick a random starting index between 0 and max index
          from: gsap.utils.random(0, config.gridSize * config.gridSize, 1),
          // stagger just along the x axis, just the y axis, or both
          axis: gsap.utils.random(["x", "y", null]),
        },
      },
    });

    const targetPosition = config.gridSize * 1.5 - 1;

    const transitionSide = (boxes, axis) => {
      this.loopTimeline.to(
        boxes.map((box) => box.position),
        {
          [axis]: targetPosition,
        },
        0
      );
      this.loopTimeline.to(
        boxes.map((box) => box.scale),
        {
          [axis]: config.gridSize,
        },
        0
      );
    };

    transitionSide(this.leftBoxes, "z");
    transitionSide(this.rightBoxes, "x");
    transitionSide(this.topBoxes, "y");
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };

  resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const orthoWidth = 100;
    const orthoHeight = orthoWidth * (h / w);

    this.renderer.setSize(w, h);
    this.camera.left = -orthoWidth * 0.5;
    this.camera.right = orthoWidth * 0.5;
    this.camera.top = orthoHeight * 0.5;
    this.camera.bottom = -orthoHeight * 0.5;
    this.camera.updateProjectionMatrix();

    this.render();
  };
}

const app = new App();
app.animate();

window.addEventListener("click", app.animate);
window.addEventListener("resize", app.resize);

gsap.ticker.add(app.render);
