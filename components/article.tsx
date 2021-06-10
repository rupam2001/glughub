import Layout from '../components/layout'
import styles from '../styles/Home.module.scss'
import { Button } from '../components/stateless/stateless'
import { useRouter } from 'next/router'

import { useContext, useEffect, useState } from 'react'
import { getQuestionsAsync } from '../utils/globalapicalls'
import moment from 'moment'
import Loader from 'react-loader-spinner'
import { coverPhotoPlacHolder, questionWindowSize, randomSuffixForQuestions } from '../utils/constanse'
import { AuthContext } from '../context/authcontext'
import { calcArticleReadTime } from '../utils/helpers'
import { progressBarRef } from './refs'

// import { Button } from '../components/stateless/stateless'
interface propTypes {
    customeFetch?(skip: number, limit: number): Promise<Array<any>>,
    heading?: string,
    hideAskbtn?: boolean
}

export default function Article(props: propTypes) {
    const router = useRouter()

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [showLoadMore, setShowLoadMore] = useState(false)

    const authContext = useContext(AuthContext)


    const [range, setRange] = useState({ skip: 0, limit: questionWindowSize })

    const handleWriteArticle = () => {
        progressBarRef.current.continuousStart()
        router.push("/create_article")
    }

    useEffect(() => {

    }, [])

    useEffect(() => {
        setLoading(true)
        setShowLoadMore(false)

        const fetchFunc = props.customeFetch ? props.customeFetch : getQuestionsAsync

        fetchFunc(range.skip, range.limit)
            .then(qs => {
                setArticles([...articles, ...qs])
                // console.log(articles)
                setShowLoadMore(qs.length !== 0)
                setLoading(false)

            }).catch(err => {
                // alert("Error while fetching")
                setLoading(false)
            })

    }, [range])

    const handleArticleClicked = (slug: string) => {
        progressBarRef.current.continuousStart()
        router.push("/posts/articles/" + slug)
    }
    return (
        <Layout>
            <div>
                <div className={styles.head}>
                    <h4>{props.heading}</h4>
                    {
                        !props.hideAskbtn &&
                        <Button text="Write an Article" onclickCallBack={handleWriteArticle} buttonStyle={{}} />
                    }
                </div>
                <div className={styles.articleFeed}>
                    {
                        articles.map(each => (
                            <div className={styles.eachArticleMain} onClick={() => handleArticleClicked(each._id)}>
                                <div key={each._id} className={styles.eachArticle}>
                                    <div className={styles.coverPhotWrapper}>
                                        <img src={each.cover_photo} className={styles.coverPhoto} />
                                    </div>
                                    <div className={styles.profilePicWrapper}>
                                        <img src={each.author_id.profile_pic} alt="" className={styles.profilePic} />
                                        <span>{each.author_id.name}</span>
                                    </div>
                                </div>
                                <div className={styles.articleTitle}>
                                    <p>{each.title.substring(2).slice(0, 70)}{each.title.substring(2).length > 70 ? "..." : ""}</p>
                                </div>
                                <div className={styles.articletagBox}>
                                    {each.tags.map(tg => (
                                        <div className={styles.articletagEach + " tag-each"} key={tg}>
                                            {tg}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    }

                </div>
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
                <div >
                </div>
            </div>
        </Layout>
    )
}


