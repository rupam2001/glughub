import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { AuthContext } from '../context/authcontext'
import styles from '../styles/Layout.module.css'
import { Button } from './stateless/stateless'

import router from 'next/router'
import { progressBarRef } from './refs'


interface propTypes {
    fetchFunc(id: string): Promise<{ isAllowed: boolean }>
    id: string,
    deleteFunc(id: string): Promise<{ success: boolean }>
}


export default function UserPostSettings(props: propTypes) {
    const [haveWritePermission, setWritePermission] = useState(false)

    const modalref = useRef(null)
    const authContext = useContext(AuthContext)
    const [isLogin, setIsLogin] = useState(authContext.isLogin)

    useEffect(() => {
        setIsLogin(authContext.isLogin)
    }, [authContext])

    useEffect(() => {
        if (isLogin || props.id) {

            props.fetchFunc(props.id)
                .then(({ isAllowed }) => {
                    setWritePermission(isAllowed)
                }).catch(err => { })
        }
        return () => {
            document.querySelector("body").style.overflow = 'auto'
        }
    }, [isLogin, props.id])



    const handleDeleteModalButton = () => {
        //delete the post and redirect
        modalref.current.style.display = 'none';
        progressBarRef.current.staticStart()
        props.deleteFunc(props.id)
            .then(({ success }) => {
                progressBarRef.current.complete()
                if (success) {
                    router.push("/")
                } else {
                    alert("Unable to delete")
                }
            }).catch(err => {
                progressBarRef.current.complete()
                alert("Something went wrong")
            })

    }


    const ModalDelete = () => (
        <div className="ed-modal" ref={modalref}>
            <div className="ed-main" style={{ width: '30vw' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => { modalref.current.style.display = 'none'; document.querySelector("body").style.overflow = 'auto' }}></i>
                </div>
                <p>Are you sure ?</p>
                <p>it may take few minutes to remove the page from the server</p>
                <div className="ed-btns">
                    <div>
                        <Button text="Yes" onclickCallBack={() => { handleDeleteModalButton() }} buttonStyle={{ backgroundColor: 'red' }} />
                    </div>
                </div>
            </div>
        </div>
    )


    if (haveWritePermission) {
        return (
            <div className={styles.deletebox}>
                <div>
                    <i className="fa fa-trash" aria-hidden="true"
                        onClick={() => {
                            modalref.current.style.display = 'flex';
                            document.documentElement.scrollTop = 0;
                            document.querySelector("body").style.overflow = 'hidden'
                        }}
                    ></i>

                </div>
                {ModalDelete()}
            </div>
        )
    }
    return <div></div>
}