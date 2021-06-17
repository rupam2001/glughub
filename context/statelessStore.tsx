
let QUESTIONS_STORE = []
let ARTICLES_STORE = []


function setARTICLES_STORE(data) {
    ARTICLES_STORE = data
}
function setQUESTIONS_STORE(data) {
    QUESTIONS_STORE = data
}




export {
    QUESTIONS_STORE, setQUESTIONS_STORE,
    ARTICLES_STORE, setARTICLES_STORE
}