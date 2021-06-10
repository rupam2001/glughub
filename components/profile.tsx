import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/authcontext'
import style from '../styles/Layout.module.css'
import { AutoAuthProgressImg, NotLoginImg } from '../utils/constanse'
import { Button } from './stateless/stateless'
import GoogleLogin from 'react-google-login';
import { ToggleTheme } from '../utils/helpers'

import router from 'next/router'



export default function Profile() {
    const authContext = useContext(AuthContext)
    const ref = useRef(null)
    const googleSigninButtonRef = useRef(null)
    const [authInProgress, setAuthInProgress] = useState(true)

    const [isLogin, setIsLogin] = useState(authContext.isLogin)
    const [profile_pic, setProfile_pic] = useState('')

    useEffect(() => {
        setIsLogin(authContext.isLogin)
        setProfile_pic(authContext.AuthRespObj.profile_pic)
    }, [authContext])

    const handleOpen = (e) => {
        //to open the main menu body
        if (ref.current.style.display === 'none') {
            //open
            ref.current.style.display = 'block'

        } else {
            ref.current.style.display = 'none'
        }

    }
    useEffect(() => {
        //for enter press search
        const fn = (e) => {
            if (e.target.id !== 'myDropdown' && !e.target.classList.contains('dd-item') && e.target.id !== 'ignore') {
                // alert("i")
                console.log(e.target)
                ref.current.style.display = 'none'
            }
        }
        window.addEventListener("mousedown", fn)
        return () => {
            window.removeEventListener("mousedown", fn)
        }
    }, [])



    useEffect(() => {
        (
            async () => {
                if (!authContext.isLogin)
                    await authContext.AutoAuthFromTokenAsync()
                setAuthInProgress(false)
            }
        )()

    }, [])

    const handleSignin = () => {
        googleSigninButtonRef.current.click()
    }

    const responseSuccessGoogle = (response) => {
        authContext.AuthenticateAsync(response.tokenId)
    }
    const responseErrorGoogle = (response) => {
        // alert("Error")
    }

    const handleLogout = () => {
        setAuthInProgress(true);
        authContext.LogoutAsync()
            .then(success => {
                if (success) {
                    setAuthInProgress(false)
                } else {
                    alert("failed to logout :(")
                }
            })
    }
    const handleThemeClick = () => {
        ToggleTheme()
    }

    const handleMyQuestionClick = () => {
        router.push("/myquestions")
    }

    const [currTheme, setCurrTheme] = useState(null)
    useEffect(() => {
        const theme = localStorage.getItem('theme')
        setCurrTheme(theme)
        // alert(theme)
    }, [])

    const handleMyArticleClick = () => {
        router.push('/myarticles')
    }


    return (
        <div className="dropdown" >
            {
                isLogin ? (
                    <img className={style.profile} src={profile_pic} onClick={handleOpen} />
                ) : (
                        <>
                            { !authInProgress && <Button onclickCallBack={handleOpen} text="Signin" buttonStyle={{ backgroundColor: 'transparent', color: "green", fontWeight: 'bolder' }} />}
                            {authInProgress && <img className={style.profile} src={AutoAuthProgressImg} style={{ border: '1px solid grey' }} />}
                        </>
                    )
            }
            <div className="dropdown-content" style={{ right: 0 }} ref={ref} id="myDropdown">
                {
                    isLogin ? (
                        <>
                            <div className="dd-item" id="myDropdown" onClick={handleMyQuestionClick}>
                                <i className={'fa fa-clipboard'} aria-hidden="true"></i>
                                <span id="ignore">My questions</span>
                            </div>
                            <div className="dd-item" id="myDropdown" onClick={handleMyArticleClick}>
                                <i className={'fa fa-pencil-square-o'} aria-hidden="true"></i>
                                <span id="ignore">My Articles</span>
                            </div>
                            <div className="dd-item" id="myDropdown" onClick={handleThemeClick}>
                                <i className={"fa fa-paint-brush "} aria-hidden="true"></i>
                                <span id="ignore">Theme</span>
                            </div>
                            <div className="dd-item" id="myDropdown" onClick={handleLogout}>
                                <i className="fa fa-sign-out" aria-hidden="true"></i>
                                <span id="ignore">Logout</span>
                            </div>
                        </>
                    ) : (
                            <div id="myDropdown">
                                <div className="dd-item" id="myDropdown" onClick={handleThemeClick}>
                                    <i className={"fa fa-paint-brush"} aria-hidden="true"></i>
                                    <span id="ignore">Theme</span>
                                </div>
                                <GoogleLogin
                                    clientId="432827620544-earre7sba34jptupkvjuinarabmts09e.apps.googleusercontent.com"
                                    buttonText="Login"
                                    onSuccess={responseSuccessGoogle}
                                    onFailure={responseErrorGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    redirectUri="https://q-overflow.vercel.app/"
                                    // redirectUri="http://localhost:3000/"

                                    render={renderProps => (
                                        <div className="dd-item" id="myDropdown" onClick={renderProps.onClick} ref={googleSigninButtonRef}>
                                            <i className="fa fa-google" aria-hidden="true"></i>
                                            <span id="ignore"> With Google</span>
                                        </div>

                                    )}
                                />
                            </div>
                        )
                }
            </div>

        </div>
    )
}