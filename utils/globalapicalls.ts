import Cookie from 'js-cookie'
import { ENDPOINT, QuestionCreateRoute } from './constanse'


interface questionPropType {
    title: string,
    body: string,
    tags: Array<string>
    type: string,
    time: Date
}
interface articlePropType {
    cover_photo: string,
    title: string,
    body: string,
    tags: Array<string>,
}



async function createQuestionAsync(question: questionPropType): Promise<{ success: boolean, newQuestion: any }> {

    const token = Cookie.get('token')
    if (!token) return { success: false, newQuestion: {} }

    const { success, newQuestion } = await fetch(ENDPOINT + QuestionCreateRoute, { method: 'POST', body: JSON.stringify({ token, ...question }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return { success, newQuestion }
}

async function createAnswerAsync({ body, q_id }): Promise<{ success: boolean, newAns: any }> {

    const token = Cookie.get('token')

    if (!token || !q_id || !body) return { success: false, newAns: {} }

    const time = new Date

    const { success, newAns } = await fetch(ENDPOINT + "/question/ans/create", { method: 'POST', body: JSON.stringify({ token, body, time, q_id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return { success, newAns }
}

async function createArticleAsync(article: articlePropType): Promise<{ success: boolean, newArticle: any }> {

    const token = Cookie.get('token')

    if (!token) return { success: false, newArticle: {} }
    // alert(token)

    const time = new Date

    const { success, newArticle } = await fetch(ENDPOINT + "/question/article/create", { method: 'POST', body: JSON.stringify({ ...article, time, type: 'article', token }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return { success, newArticle }
}



async function getQuestionsAsync(skip: Number, limit: Number): Promise<Array<any>> {
    const { questions } = await fetch(ENDPOINT + "/question/getall/" + skip + "/" + limit, { method: 'GET', headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return questions
}
async function getArticleAsync(skip: Number, limit: Number): Promise<Array<any>> {
    const { articles } = await fetch(ENDPOINT + "/question/article/getall/" + skip + "/" + limit, { method: 'GET', headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return articles
}

async function getMyQuestionsAsync(skip: Number, limit: Number): Promise<Array<any>> {
    const token = Cookie.get('token')
    if (!token) throw new Error("token not found")
    const { questions } = await fetch(ENDPOINT + "/question/getall/mine/" + skip + "/" + limit, { method: 'POST', body: JSON.stringify({ token: token }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return questions
}

async function getMyArticleAsync(skip: Number, limit: Number): Promise<Array<any>> {
    const token = Cookie.get('token')
    if (!token) throw new Error("token not found")
    const { articles } = await fetch(ENDPOINT + "/question/article/getall/mine/" + skip + "/" + limit, { method: 'POST', body: JSON.stringify({ token: token }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return articles
}


async function getNotificationsAsync(skip: Number, limit: Number): Promise<Array<any>> {
    const token = Cookie.get('token')
    if (!token) throw new Error("token not found")

    const { notifications } = await fetch(ENDPOINT + "/notification/get/" + skip + "/" + limit, { method: 'POST', body: JSON.stringify({ token, skip, limit }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return notifications
}


async function searchRemoteAsync(query: string, skip: Number, limit: Number): Promise<Array<any>> {
    const { questions } = await fetch(ENDPOINT + "/search/question", { method: 'POST', body: JSON.stringify({ query, skip, limit }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return questions
}


async function checkWritePermission(q_id: string): Promise<{ isAllowed: boolean }> {
    const token = Cookie.get('token')
    if (!token) throw new Error("token not found")

    const { isAllowed } = await fetch(ENDPOINT + "/question/permission/write", { method: "POST", body: JSON.stringify({ token, q_id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return { isAllowed }
}

async function deleteQuestion(q_id: string): Promise<{ success: boolean }> {
    const token = Cookie.get('token')
    if (!token) throw new Error("token not found")

    const { success } = await fetch(ENDPOINT + "/question/delete", { method: "DELETE", body: JSON.stringify({ token, q_id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return { success }
}

async function deleteArticle(article_id: string): Promise<{ success: boolean }> {
    const token = Cookie.get('token')
    if (!token) throw new Error("token not found")

    const { success } = await fetch(ENDPOINT + "/question/article/delete", { method: "DELETE", body: JSON.stringify({ token, article_id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return { success }
}


async function checkArticleWritePermission(article_id: string): Promise<{ isAllowed: boolean }> {
    const token = Cookie.get('token')
    if (!token) throw new Error("token not found")

    const { isAllowed } = await fetch(ENDPOINT + "/reaction/article/permission/write", { method: "POST", body: JSON.stringify({ token, article_id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return { isAllowed }
}

async function getReaction(id: string) {
    const token = Cookie.get('token')
    if (!token) {
        //for user who is not authenticated
        // throw new Error("token not found")
        const { nums } = await fetch(ENDPOINT + "/reaction/article/get/" + id, { method: "GET", headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
        return { nums, myreaction: null }
    }

    const { nums, myreaction } = await fetch(ENDPOINT + "/reaction/article/get", { method: "POST", body: JSON.stringify({ token, id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return { nums, myreaction }
}

async function doReact(id: string): Promise<any> {
    const token = Cookie.get('token')
    if (!token) {
        //for user who is not authenticated
        throw new Error("token not found")
    }

    const { } = await fetch(ENDPOINT + "/reaction/article/clap", { method: "POST", body: JSON.stringify({ token, id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
    return {}
}



export {
    createQuestionAsync, getQuestionsAsync, searchRemoteAsync,
    createAnswerAsync, getMyQuestionsAsync, createArticleAsync, getArticleAsync, getMyArticleAsync,
    getNotificationsAsync, checkWritePermission, deleteQuestion, getReaction, doReact
}