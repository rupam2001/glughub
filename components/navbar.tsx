import style from '../styles/Layout.module.css'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import LoadingBar from 'react-top-loading-bar'
import { progressBarRef } from './refs'
import Profile from './profile'
import Searchbar from './searchbar'
import Notification from './notification'

export default function NavBar() {

    return (
        <div className={style.navbar}>
            <LoadingBar color='#f11946' ref={progressBarRef} />
            <Link href="/">
                <span className={style.title}>Q-Overflow</span>
            </Link>
            <Searchbar />
            <Notification />
            <Profile />
        </div>
    )
}
