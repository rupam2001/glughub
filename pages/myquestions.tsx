import Head from 'next/head'
import Home from '../components/home'
import { getMyQuestionsAsync } from '../utils/globalapicalls'


export default function MyQuestions() {

    return (
        <div>
            <Home customeFetch={getMyQuestionsAsync} heading="My questions" hideAskbtn={true} />
        </div>
    )
}
