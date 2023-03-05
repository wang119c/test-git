import { gsap } from 'gsap'

const select = e => document.querySelector(e);
let fontSize = gsap.getProperty(":root","--fontSize");
let txt = select(".txt");
let frame = select(".frame");
let face = select(".face--front");
let numLines = 10;

function cloneTxt(){
    for (let i=0; i<numLines - 1 ; i ++){
        var clone = txt.cloneNode(true);
        face.appendChild(clone)
    }
}
cloneTxt()

gsap.set('.container', { autoAlpha: 1 });
gsap.set([".frame",'.etc'], {rotateX: 55})

let tl = gsap.timeline()
tl.to(".txt", {
    fontWeight: 900,
    opacity: 1,
    fontStretch: '10%',
    stagger: {
        yoyo: true,
        each: 0.07,
        repeat: -1
    },
    duration: 0.7,
    ease: 'sine.inOut'
})

gsap.to(".etc", {
    fontWeight: "100%",
    yoyo: true,
    repeat: -1,
    duration: 9,
    ease: "sine.inOut"
})

gsap.to(".container",{
    perspective: '300px',
    yoyo: true,
    repeat: -1,
    duration: 4,
    ease: "sine.inOut"
})