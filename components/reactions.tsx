import { useEffect, useState } from 'react'
import styles from '../styles/Layout.module.css'
import { signinAlertRef } from './refs'

interface propType {
    fetchFunc(id: string): Promise<{ nums: Number, myreaction: boolean }>,  //fetch my reaction and number of reactions
    reactFunc(id: string): Promise<any>,
    num_clapps: any,
    isAuthed: boolean,
    id: string

}

export default function Reactions(props: propType) {

    const [numReaction, setNumReaction] = useState<any>(props.num_clapps)

    const [myReaction, setMyReaction] = useState(false)

    useEffect(() => {
        if (!props.id) return

        props.fetchFunc(props.id)
            .then(({ myreaction, nums }) => {
                setNumReaction(nums)
                setMyReaction(myreaction)
            })
            .catch(err => {
                // alert("reaction fetch failed")
            })
        return () => {
            document.querySelector("body").style.overflow = 'auto'
        }

    }, [props.id])

    const handleReact = () => {
        if (!props.isAuthed) {
            document.documentElement.scrollTop = 0
            document.querySelector("body").style.overflow = 'hidden'
            signinAlertRef.current.style.display = 'flex'
            return
        }
        props.reactFunc(props.id).then(r => { }).catch(err => { }) //we don't care about errors or if the reaction is success
        setMyReaction(true)
        setNumReaction(numReaction + 1)
    }

    return (
        <div className={styles.reactionContainer}>
            <div className={styles.eachReaction}>
                {
                    myReaction ? (<span className={styles.clapActive}></span>)
                        : (<span className={styles.clap} onClick={handleReact}></span>)
                }

                <span>{numReaction}</span>
            </div>
        </div>
    )
}