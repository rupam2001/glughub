import { ENDPOINT } from "../../../utils/constanse"
import { useRouter } from 'next/router'
import Layout from "../../../components/layout"
import MarkDown from "../../../components/markdown"
import { useContext, useEffect, useState } from "react"
import Loader from 'react-loader-spinner'
import moment from 'moment'
import Cover from "../../../components/cover"
import UserPostSettings from "../../../components/userpostsettings"
import { checkWritePermission, deleteQuestion, doReact, getReaction } from "../../../utils/globalapicalls"
import Reactions from "../../../components/reactions"
import { AuthContext } from "../../../context/authcontext"
const getArticle = async (slug: string) => {
    try {
        const res = await fetch(ENDPOINT + "/question/article/" + slug, { method: "GET", headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
        return res
    } catch (e) {
        throw e
    }
}
const getAnswers = async (slug: string) => {
    try {
        const { anss } = await fetch(ENDPOINT + "/question/q/ans/" + slug, { method: "GET", headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
        return anss
    } catch (e) {
        return [] //dont throw error
    }
}


export const getStaticProps = async ({ params }) => {
    try {

        const res = await getArticle(params.slug)

        return {
            props: { res },
            revalidate: 60 * 60 * 24  //1day
        }
    } catch (e) {

        return {
            notFound: true
        }
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true,
    }
}


const Articles = (props) => {

    const router = useRouter()

    const authContext = useContext(AuthContext)

    const [isLogin, setIsLogin] = useState(authContext.isLogin)
    const [article_id, setArticle_id] = useState(null)

    useEffect(() => {
        setIsLogin(authContext.isLogin)
    }, [authContext])

    useEffect(() => {
        document.body.scrollTop = 0;
    }, [])


    useEffect(() => {
        const pathname = window.location.pathname
        const id = pathname.split("/")[pathname.split("/").length - 1]
        setArticle_id(id)
    }, [])


    if (router.isFallback) {
        return (
            <Layout>
                <div className="loading">
                    <Loader
                        type="Oval"
                        color="grey"
                        height={50}
                        width={50}
                    />
                </div>
            </Layout>
        )
    }
    return (
        <Layout>
            <div className="cr-preview-2" style={{ height: 'fit-content', padding: '0.5rem', zoom: 0.9, paddingLeft: '5rem' }}>
                <Cover
                    coverPhotoUrl={props.res.article.cover_photo}
                    article={props.res.article.body}
                    profile_pic={props.res.article.author_id.profile_pic}
                    readTimeStyle={{ fontSize: 'small' }}
                    name={props.res.article.author_id.name}
                />
                <div className="profile-pic">
                    <p>{moment(props.res.article.time).calendar()}</p>
                </div>
                <MarkDown
                    markdownText={props.res.article.title + "\n" + props.res.article.body}
                />
                <Reactions fetchFunc={getReaction} reactFunc={doReact} isAuthed={isLogin} id={article_id} num_clapps={null} />
                <UserPostSettings id={article_id} deleteFunc={deleteQuestion} fetchFunc={checkWritePermission} />
                <hr />
            </div>
        </Layout>
    )
}

export default Articles