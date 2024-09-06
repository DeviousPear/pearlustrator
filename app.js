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
        window.editorSelectedElement?.classList.remove("border")
        window.editorSelectedElement = svg
        document.getElementById("font-select").value = svg.getAttributeNS(null, "font-family") || "Times New Roman"
        svg.classList.add("border")
        if (svg.nodeName == "text") {
            let installedFont = document.getElementById("font-select").value
            document.getElementById("text-edit").style.setProperty("display", "block")
            document.getElementById("font-select").innerHTML = ""
            window.installedFonts.forEach(i => {
                let selectItem = document.createElement("option")
                selectItem.innerText = i
                document.getElementById("font-select").appendChild(selectItem)
            })
            document.getElementById("font-select").value = installedFont

        } else console.log(svg.nodeName)
        document.getElementById("font-select").value = svg.getAttributeNS(null, "font-family") || "Times New Roman"
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
    let svgText = `<svg xmlns="http://www.w3.org/2000/svg" >${renderer.innerHTML.replace("border", "")}</svg>`
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
            let newText = prompt("New text", elem.innerHTML)
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
        fetch(`https://fonts.googleapis.com/css2?family=${fontName.replace(" ", "+")}:wght@300..700&display=swap`, {}).then(res => {
            console.log(res)
            if (!res.ok) {
                alert("Font error.")
            } else {
                res.text().then(text => {
                    let style = document.createElementNS("http://www.w3.org/2000/svg", "style")
                    style.innerHTML = text
                    renderer.appendChild(style)
                    window.installedFonts.push(fontName)
                    let installedFont = document.getElementById("font-select").value
                    document.getElementById("font-select").innerHTML = ""
                    window.installedFonts.forEach(i => {
                        let selectItem = document.createElement("option")
                        selectItem.innerText = i
                        document.getElementById("font-select").appendChild(selectItem)
                    })
                    document.getElementById("font-select").value = installedFont
                })
            }
        })


    }
})
document.getElementById("collapse").addEventListener("click", () => {
    document.querySelectorAll(".edit").forEach(i => i.style.display = "none")
})
renderer.addEventListener("keydown", e => {
    if ((e.key == "Backspace" || e.key == "Delete")) window.editorSelectedElement.remove()
})
document.getElementById("font-select").addEventListener("input", () => {
    console.log(document.getElementById("font-select").value)
    window.editorSelectedElement.setAttributeNS(null, "font-family", document.getElementById("font-select").value)
})
document.getElementById("font-size").addEventListener("input", () => {
    window.editorSelectedElement.setAttributeNS(null, "font-size", document.getElementById("font-size").value)
})