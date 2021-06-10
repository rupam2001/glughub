import styels from '../styles/sidemenu.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function SideMenu() {
    const router = useRouter()

    return (
        <div className={styels.container}>
            <div className={styels.box}>
                <div>
                    <Link href="/" >
                        <div className={styels.route + (router.pathname == '/' ? " " + styels.active : "")}>
                            {/* <span>Home</span> */}
                            <span>Questions</span>
                        </div>
                    </Link>
                    <Link href="/articles">
                        <div className={styels.route + (router.pathname == '/articles' ? " " + styels.active : "")}>
                            <span>Articles</span>
                        </div>
                    </Link>
                    {/* <Link href="/tags">
                        <div className={styels.route + (router.pathname == '/tags' ? " " + styels.active : "")}>
                            <span>Tags</span>
                        </div>
                    </Link> */}
                    {/* <Link href="/peoples">
                        <div className={styels.route + (router.pathname == '/peoples' ? " " + styels.active : "")}>
                            <span>Peoples</span>
                        </div>
                    </Link> */}
                    {/* <Link href="/create">
                        <div className={styels.route + (router.pathname == '/create' ? " " + styels.active : "") + " " + styels.compose}>
                            <span>Compose <big>+</big></span>
                        </div>
                    </Link> */}
                </div>
            </div>

        </div>
    )
}