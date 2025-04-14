import { animate, hover, inView } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

let windowX = window.scrollX
let windowY = window.scrollY

const updateScrollState = () => {
    windowX = window.scrollX;
    windowY = window.scrollY;
};

inView(".reveal", (element) => {
    animate(element, { opacity: 1, translateX: 0 })
  })

document.addEventListener('scroll', updateScrollState);

document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.glow-effect');
    const glowUp = document.querySelector('.glow-effect2')

    const adjustedX = windowX + e.clientX;
    const adjustedY = windowY + e.clientY;

    animate(glow,{left:adjustedX, top:adjustedY}, {duration: 0})
    animate(glowUp,{left:adjustedX, top:adjustedY}, {duration: 0})
    });

window.addEventListener("DOMContentLoaded", () => {
    hover(".opacity-container", (element) => {
        animate('.glow-effect', { opacity: 1 },{ease:[ "easeIn"]});
        animate('.glow-effect2', { opacity: 1 }, {ease:[ "easeOut"], delay:0.2});

        return () => {
            animate('.glow-effect', { opacity: 0 },{duration:0.05,ease:[ "easeOut"]})
            animate('.glow-effect2', { opacity: 0 },{ease:[ "easeOut"]});
        };
    });
});

