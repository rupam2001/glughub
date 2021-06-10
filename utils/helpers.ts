
export function ToggleTheme() {
    const theme = localStorage.getItem("theme")
    let r = document.querySelector(":root")
    if (!theme || theme == 'white') {
        localStorage.setItem("theme", "dark");
        r['style'].setProperty("--first", "rgb(31, 33, 34)")
        r['style'].setProperty("--second", "rgb(51, 57, 58)")
        r['style'].setProperty("--third", "rgb(157, 165, 167)")
        r['style'].setProperty("--hover", "rgb(57, 61, 66)")
        r['style'].setProperty("--btn", "rgb(78, 78, 78)")
        r['style'].setProperty("--tag", "#161d1c")
        r['style'].setProperty("--pres", "black")
    } else {
        localStorage.setItem("theme", "white");
        r['style'].setProperty("--first", "white")
        r['style'].setProperty("--second", "whitesmoke")
        r['style'].setProperty("--third", "black")
        r['style'].setProperty("--hover", "rgb(231, 239, 240)")
        r['style'].setProperty("--btn", "#088abd")
        r['style'].setProperty("--tag", "#DFF5F4")
        r['style'].setProperty("--pres", "#F5F2F0")
    }
}

export function applyCurrentTheme() {
    const theme = localStorage.getItem("theme")
    let r = document.querySelector(":root")
    if (!theme || theme == 'white') {
        localStorage.setItem("theme", "white");
        r['style'].setProperty("--first", "white")
        r['style'].setProperty("--second", "whitesmoke")
        r['style'].setProperty("--third", "black")
        r['style'].setProperty("--hover", "rgb(231, 239, 240)")
        r['style'].setProperty("--btn", "#088abd")
        r['style'].setProperty("--tag", "#DFF5F4")
        r['style'].setProperty("--pres", "#F5F2F0")
    } else {
        r['style'].setProperty("--first", "rgb(31, 33, 34)")
        r['style'].setProperty("--second", "rgb(51, 57, 58)")
        r['style'].setProperty("--third", "rgb(157, 165, 167)")
        r['style'].setProperty("--hover", "rgb(57, 61, 66)")
        r['style'].setProperty("--btn", "rgb(78, 78, 78)")
        r['style'].setProperty("--tag", "#161d1c")
        r['style'].setProperty("--pres", "black")
    }
}

export function calcArticleReadTime(article: string): string {
    const wordsPerMin = 200
    let words = article.split(" ")
    let totalWords = words.length
    let readTimeinMin = Math.ceil(totalWords / wordsPerMin)
    return `${readTimeinMin} min`

}