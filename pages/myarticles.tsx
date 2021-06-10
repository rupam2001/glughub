import Head from 'next/head'
import Article from '../components/article'
import Home from '../components/home'
import { getMyArticleAsync, getMyQuestionsAsync } from '../utils/globalapicalls'


export default function MyArticles() {

    return (
        <div>
            <Article customeFetch={getMyArticleAsync} heading="My articles" hideAskbtn={true} />
        </div>
    )
}
