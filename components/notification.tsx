import { DOMElement, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { AuthContext } from '../context/authcontext'
import style from '../styles/Layout.module.css'
import router from 'next/router'
import { getNotificationsAsync } from '../utils/globalapicalls'
import { notificationWindowSize, questionWindowSize } from '../utils/constanse'
import { progressBarRef, signinAlertRef } from './refs'
import { Button } from './stateless/stateless'
// import { JsxChild, JsxFragment } from 'typescript'
import moment from 'moment'

interface notificationsRespType {
    _id: string,
    from_user_id?: any,
    body: string,
    time: Date,
    type: string,
    is_read: boolean,
    on_id: string
}

export default function Notification() {
    const ref = useRef(null)
    const authContext = useContext(AuthContext)

    const [notifications, setNotifications] = useState<Array<notificationsRespType>>([])

    const [skip, setSkip] = useState(0)
    const [end, setEnd] = useState(false)



    const handleOpen = (e) => {
        //to open the main menu body
        if (ref.current.style.display === 'none') {
            //open 
            if (!authContext.isLogin) {
                signinAlertRef.current.style.display = 'flex'
                return
            }
            if (notifications.length != 0 || end) {
                //to stop the user from sending reuest on every click on the bell icon  (in that case  old datas will be displayed)
                ref.current.style.display = 'block'
                return
            }

            progressBarRef.current.staticStart()

            getNotificationsAsync(skip, notificationWindowSize)
                .then(ntfs => {
                    if (ntfs.length == 0 || ntfs.length < notificationWindowSize) {
                        setEnd(true)
                    }
                    setNotifications(ntfs)
                    progressBarRef.current.complete()
                    ref.current.style.display = 'block'
                }).catch(err => {
                    progressBarRef.current.complete()
                    // alert("Something went wrong :(")
                })

        } else {
            ref.current.style.display = 'none'
        }
    }
    useEffect(() => {
        //for enter press search

        const fn = (e) => {
            if (e.target.id !== 'myDropdown' && !e.target.classList.contains('dd-item') && e.target.id !== 'ignore') {

                console.log(e.target)
                ref.current.style.display = 'none'
            }
        }
        window.addEventListener("mousedown", fn)
        return () => {
            window.removeEventListener("mousedown", fn)
        }
    }, [])

    const handleClickNotification = (slug: string, type: string) => {
        switch (type) {
            case 'answer':
                router.push('/posts/questions/' + slug)
                break;
            case 'article':
                router.push('/posts/articles/' + slug)
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (ref.current.style.display == 'block') {

            progressBarRef.current.staticStart()

            getNotificationsAsync(skip, notificationWindowSize)
                .then(ntfs => {
                    if (ntfs.length == 0 || ntfs.length < notificationWindowSize) {
                        setEnd(true)
                    }
                    setNotifications([...notifications, ...ntfs])
                    progressBarRef.current.complete()

                }).catch(err => {
                    progressBarRef.current.complete()
                    // alert("Something went wrong :(")
                })
        }
    }, [skip])

    // const formateBody = (body:string, type:string):string=>{
    //     switch (type) {
    //         case :

    //             break;

    //         default:
    //             break;
    //     }
    // }

    const formateIcon = (type: string) => {
        switch (type) {
            case 'answer':
                return <i className="fa fa-question-circle" aria-hidden="true"></i>
            case 'article':
                return <i className="fa fa-question-circle" aria-hidden="true"></i>

            default:
                break;
        }
    }

    return (
        <div className="dropdown">
            {/* <span className={style.notifIcon}></span> */}
            <i className={style.notifIcon + " " + style.icos} aria-hidden="true" onClick={handleOpen}></i>
            <div className='dropdown-content' style={{ right: 0, width: '30rem' }} ref={ref} id="myDropdown">
                {
                    notifications.map(ntf => (
                        <div className="dd-item" id="myDropdown" key={ntf._id} onClick={() => { handleClickNotification(ntf.on_id, ntf.type) }}>
                            <div className={style.searchItemHead} id="ignore">
                                <p className={style[ntf.type]}>({ntf.type})</p>
                                <span id="ignore">{moment(ntf.time).calendar()}</span>
                            </div>
                            {formateIcon(ntf.type)}
                            <span id="ignore" onClick={() => { handleClickNotification(ntf.on_id, ntf.type) }}>{ntf.body}</span>
                        </div>
                    ))
                }
                {
                    notifications.length == 0 && end &&
                    (<div className="dd-item" id="myDropdown">
                        <span>No notifications</span>
                    </div>)
                }
                {
                    notifications.length !== 0 && !end && <Button text="load more"
                        onclickCallBack={(e) => {
                            setSkip(skip + notificationWindowSize)
                        }}
                        buttonStyle={{ textAlign: 'center', backgroundColor: 'transparent', color: '#088abd' }}
                    />
                }
            </div>
        </div>
    )
}