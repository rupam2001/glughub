import React, { useEffect } from 'react';
import style from '../styles/Layout.module.css'
import Footer from './footer';
import RightMenu from './rightmenu';
import SideMenu from './sidemenu';
import Link from 'next/link'
import NavBar from './navbar';
import SigninAlert from './signinAlert'

export default function Layout(props) {

    useEffect(() => {

    })


    return (
        <div className={style.container}>
            <NavBar />
            <div className={style.leftcontainer}>
                <div className={style.left}>
                    <SideMenu />
                </div>
                <div className={style.middle}>
                    {props.children}
                </div>
                <div className={style.right}>
                    <RightMenu />
                </div>
            </div>

            <Footer />
        </div>
    )
}

