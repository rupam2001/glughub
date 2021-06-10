import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authcontext"
import { coverPhotoPlacHolder, profilePicPlaceHolder } from "../utils/constanse"
import { calcArticleReadTime } from "../utils/helpers"
import css from 'csstype'

interface propTypes {
    coverPhotoUrl: string,
    profile_pic?: string,
    article?: string,
    name?: string,
    readTimeStyle?: css.Properties
}

const Cover = (props: propTypes) => {
    // const authContext = useContext(AuthContext)
    const [profile_pic, setProfile_pic] = useState(props.profile_pic || profilePicPlaceHolder)
    const [name, setName] = useState(props.name || '')
    useEffect(() => {
        setProfile_pic(props.profile_pic || profilePicPlaceHolder)
        setName(props.name)
    }, [props])

    const [article, setArticle] = useState(props.article || null)
    useEffect(() => {
        setArticle(props.article)
    }, [props.article])

    return (

        <div className="cover-photo-wrapper">
            <img src={props.coverPhotoUrl || coverPhotoPlacHolder} className="cover-main" />
            <div className="cover-pf-wrapper">
                <img src={profile_pic} className="cover-profile" />
                <p>{name}</p>
            </div>
            <p className="cover-read-time" style={props.readTimeStyle}>
                {article && "~" + calcArticleReadTime(article)}
            </p>
        </div>

    )
}

export default Cover