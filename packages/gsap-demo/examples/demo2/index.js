import {gsap , Power2} from 'gsap'
var styleVars = getComputedStyle(document.documentElement),
	cubeWidth = styleVars.getPropertyValue('--cube-size').replace("px", ""),
	stepDuration = 0.6;

gsap.set('.container', { y: "10vh" });

function walk() {
	gsap.timeline({ repeat: -1, defaults:{ ease:"power2.inOut", duration:stepDuration }})
		.to('.cube--2', { rotationZ: -180, transformOrigin: "left top" })
		.set('.cube--2', { x: -cubeWidth*2, transformOrigin: "right top" })
		.to('.cube--2', { rotationZ: -360 })
		.to('.cube--1', { rotationZ: -180, transformOrigin: "left top" })
		.set('.cube--1', { x: -cubeWidth*2, transformOrigin: "right top" })
		.to('.cube--1', { rotationZ: -360 })
		.to('.track', { x: cubeWidth*2, duration: stepDuration*4, ease: "none" }, 0)
}

function intro() {
	gsap.timeline({ onComplete: walk, delay: 0.5, defaults:{ ease:"power1.in" } })
		.set('.container', { autoAlpha: 1 })
		.from('.cube--1', { scaleY: 0, x: -cubeWidth*2, transformOrigin: "50% 100%", duration: 0.3 })
		.to('.cube--1', { keyframes:[{ y: -cubeWidth*2, ease: Power2.easeOut, duration: 0.4 }, { y: 0, ease: "power2.in" }]})
		.from('.cube--2', { scaleY: 0, x: cubeWidth*2, transformOrigin: "50% 100%", duration: 0.3 }, 0.1)
		.to('.cube--2', { keyframes:[{ y: -cubeWidth*2, ease: Power2.easeOut, duration: 0.4 }, { y: 0, ease: "power2.in" }]}, 0.4)
		.to('.track', { rotationY: 360, duration: 1.2, ease: "power4.inOut" }, 0)
		.from('.face', { opacity: 0, duration: 1.2, ease: "power2" }, 0)
}

window.onload = (event) => {
	intro();
};