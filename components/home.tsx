import Layout from '../components/layout'
import styles from '../styles/Home.module.scss'
import { Button } from './stateless/stateless'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'
import { getDrafts } from './draftPanel'
import { getQuestionsAsync } from '../utils/globalapicalls'
import moment from 'moment'
import Loader from 'react-loader-spinner'
import { questionWindowSize, randomSuffixForQuestions } from '../utils/constanse'
import { progressBarRef } from './refs'

// import { Button } from '../components/stateless/stateless'
interface propTypes {
    customeFetch?(skip: number, limit: number): Promise<Array<any>>,
    heading?: string,
    hideAskbtn?: boolean
}

export default function Home(props: propTypes) {
    const router = useRouter()

    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showLoadMore, setShowLoadMore] = useState(false)


    const [range, setRange] = useState({ skip: 0, limit: questionWindowSize })

    const handleAskQuestion = () => {
        progressBarRef.current.continuousStart()
        router.push("/create")
    }

    useEffect(() => {

    }, [])

    useEffect(() => {
        setLoading(true)
        setShowLoadMore(false)

        const fetchFunc = props.customeFetch ? props.customeFetch : getQuestionsAsync

        fetchFunc(range.skip, range.limit)
            .then(qs => {
                setQuestions([...questions, ...qs])
                // console.log(questions)
                setShowLoadMore(qs.length !== 0)
                setLoading(false)

            }).catch(err => {
                // alert("Error while fetching")
                setLoading(false)
            })

    }, [range])

    const handleQuestionCLicked = (slug: string) => {
        progressBarRef.current.continuousStart()
        router.push("/posts/questions/" + slug)
    }
    return (
        <Layout>
            <div>
                <div className={styles.head}>
                    <h4>{props.heading}</h4>
                    {
                        !props.hideAskbtn &&
                        <Button text="Ask a question" onclickCallBack={handleAskQuestion} />
                    }
                </div>
                <div className={styles.feed}>
                    {
                        questions.map(each => (
                            <div onClick={() => { handleQuestionCLicked(each._id) }} className={styles.eachquestion}>
                                <div className={styles.qhead}>
                                    <div className={styles.author}>
                                        <img src={each.author_id.profile_pic} />
                                        <span>
                                            <strong>{each.author_id.name}</strong>
                                            <span className={styles.randomPrefix}>
                                                {randomSuffixForQuestions[Math.floor(Math.random() * randomSuffixForQuestions.length)]}
                                            </span>
                                        </span>
                                    </div>
                                    <small>{moment(each.time).fromNow()}</small>
                                </div>
                                <span className={styles.qtitle}>
                                    {each.title.substring(2)}
                                </span>
                                <div className={styles.tagBox}>
                                    {
                                        each.tags.map(tg => (
                                            <div className={"tag-each " + styles.tagEach}>
                                                {tg}
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                    {
                        loading &&
                        <div className={styles.loading}>
                            <Loader
                                type="Oval"
                                color="grey"
                                height={50}
                                width={50}
                            // timeout={3000} //3 secs
                            />
                        </div>
                    }{
                        showLoadMore && <Button text="load more" onclickCallBack={() => { setRange({ skip: range.skip + questionWindowSize, limit: questionWindowSize }) }}
                            buttonStyle={{ textAlign: 'center', backgroundColor: 'transparent', color: 'dodgerblue' }}
                        />

                    }
                </div>
                <div >
                </div>
            </div>
        </Layout>
    )
}