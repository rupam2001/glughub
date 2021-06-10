import Layout from '../components/layout'
import { Button } from '../components/stateless/stateless'
import styles from '../styles/Home.module.scss'
import router from 'next/router'
import Article from '../components/article'
import { getArticleAsync } from '../utils/globalapicalls'

export default function Articles() {
    return (
        <Article customeFetch={getArticleAsync} heading="New Articles" />
    )
}
