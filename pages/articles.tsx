/**
 * Glughub
 * from Q-overflow
 * Developed by Rupam jyoti Das 
 */

import Article from '../components/article'
import { getArticleAsync } from '../utils/globalapicalls'

export default function Articles() {
    return (
        <Article customeFetch={getArticleAsync} heading="New Articles" />
    )
}
