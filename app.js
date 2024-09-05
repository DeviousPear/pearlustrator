/**@type {SVGElement} */
const renderer = document.getElementById("renderer")
window.installedFonts = [
    "Arial",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Garamond",
    "Courier New",
    "Brush Script MT"
]
function bindPropertyToDom() {

}
function makeDraggable(elem) {
    /** @type {SVGElement} */
    let svg = elem
    svg.addEventListener('mousedown', (evt) => {
        window.selectedElement = evt.target
    })
    svg.addEventListener('mousemove', (evt) => {
        if (evt.target == window.selectedElement) {
            evt.preventDefault()
            let x = parseFloat(selectedElement.getAttributeNS(null, "x")) || 0
            window.selectedElement.setAttributeNS(null, "x", x + evt.movementX)
            let y = parseFloat(selectedElement.getAttributeNS(null, "y")) || 0
            window.selectedElement.setAttributeNS(null, "y", y + evt.movementY)
        }
        
    });
    svg.addEventListener('mouseup', () => window.selectedElement = null)
    svg.addEventListener('mouseleave', () => window.selectedElement = null)
}
document.getElementById("upload").addEventListener("click", () => {
    let elem = document.createElement("input")
    elem.type = "file"
    elem.onchange = () => {
        let url = URL.createObjectURL(elem.files[0])
        let image = document.createElementNS("http://www.w3.org/2000/svg", "image")
        image.setAttribute("href", url)
        makeDraggable(image)
        renderer.appendChild(image)
    }
    elem.click()
})
document.getElementById("download").addEventListener("click", () => {
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")
    let svgText = `<svg xmlns="http://www.w3.org/2000/svg" >${renderer.innerHTML}</svg>`
    let svg = new Blob([svgText], {
        type: "image/svg+xml;charset=utf-8"
    })
    let url = URL.createObjectURL(svg)
    let image = new Image(50, 50)
    image.src = url
    document.body.appendChild(image)
    ctx.drawImage()
})
document.getElementById("view").addEventListener("click", () => {
    let svgText = `<svg xmlns="http://www.w3.org/2000/svg" >${renderer.innerHTML}</svg>`
    let svg = new Blob([svgText], {
        type: "image/svg+xml;charset=utf-8"
    })
    let url = URL.createObjectURL(svg)
    window.open(url)
})
document.getElementById("type").addEventListener("click", () => {
    let text = prompt("Enter text")
    if (text) {
        let elem = document.createElementNS("http://www.w3.org/2000/svg", "text")
        elem.innerHTML = text
        elem.setAttributeNS(null, "font-family", "Comfortaa")
        elem.setAttributeNS(null, "x", "50")
        elem.setAttributeNS(null, "y", "90")
        elem.addEventListener("dblclick", () => {
            let newText = prompt("New text")
            if (newText) {
                elem.innerHTML = newText
            }
        })
        renderer.appendChild(elem)
        makeDraggable(elem)
    }
})
renderer.addEventListener("wheel", (evt) => {
    if (getComputedStyle(renderer).width.replace("px", "") > 500 || evt.deltaY > 0) {
        renderer.style.setProperty("width", parseFloat(getComputedStyle(renderer).width.replace("px", "")) + (evt.deltaY * 0.7))
        renderer.style.setProperty("height", parseFloat(getComputedStyle(renderer).height.replace("px", "")) + (evt.deltaY * 0.7))
    }
    
})
document.getElementById("add-font").addEventListener("click", async () => {
    let fontName = prompt("Enter a valid Google Fonts name")
    if (fontName) {
        let res = await fetch(`https://fonts.googleapis.com/css2?family=${fontName.replace(" ", "+")}:wght@300..700&display=swap`)
        if (res.status !== 200) {
            alert("Font error.") 
        } else {
            renderer.querySelector("style").append(
                `@import url('https://fonts.googleapis.com/css2?family=${fontName.replace(" ", "+")}:wght@300..700&display=swap')`
            )
        }

    }
})
document.getElementById("collapse").addEventListener("click", () => {
    document.querySelectorAll(".edit").forEach(i => i.style.display = "none")
})