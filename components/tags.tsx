
import React, { useContext, useEffect, useState } from 'react';
import { ENDPOINT, TagsRoute } from '../utils/constanse';
import Loader from 'react-loader-spinner'
import { AuthContext } from '../context/authcontext';

interface propTypes {
    onClickTagsCallBack: Function,
}


export default function Tags(props: propTypes) {
    const authContext = useContext(AuthContext)

    const [tagData, setTagData] = useState<Array<string>>([]) //varies according to the search
    const [tagDataBackups, setTagDataBackups] = useState<Array<string>>([])  //is constant

    const [selectedTags, setSelectedTags] = useState({}) //holds the currenty selcted tags in hashmap


    useEffect(() => {
        if (authContext.isLogin)
            fetchTagsAsync().then(tags => {
                setTagData(tags)
                setTagDataBackups(tags)
            })
    }, [authContext])

    const handleTagSelect = (tag) => {
        let previousSeletedTags = { ...selectedTags }
        if (previousSeletedTags.hasOwnProperty(tag)) {
            //remove
            delete previousSeletedTags[tag]
        } else {
            //add
            previousSeletedTags[tag] = true
        }
        setSelectedTags(previousSeletedTags)
        let selectedTagsArray = []
        for (const [key, value] of Object.entries(previousSeletedTags)) {
            selectedTagsArray.push(key)
        }
        props.onClickTagsCallBack(selectedTagsArray)
    }
    const onChangeSearch = (e) => {
        if (e.target.value.length == 0) {
            setTagData(tagDataBackups);
        } else {
            let filteredTags = tagDataBackups.filter(tg => tg.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            setTagData(filteredTags)
        }
    }

    return (
        <div id="tags-wrapper">
            <div className="tag-header">
                <h3>Select tags <span>({Object.getOwnPropertyNames(selectedTags).length})</span></h3>
                <input placeholder="Search tags" onChange={onChangeSearch} />
            </div>
            <div className="tag-main" >
                {
                    tagData.map(each => (
                        <div className={selectedTags.hasOwnProperty(each) ? "tag-each tag-selected" : "tag-each"} onClick={() => { handleTagSelect(each) }}>
                            {each}
                        </div>
                    ))
                }
                {
                    tagDataBackups.length === 0 && <>
                        <Loader
                            type="Oval"
                            color="#e6ebea"
                            height={50}
                            width={50}
                        // timeout={3000} //3 secs
                        />
                    </>
                }
            </div>
        </div>
    )
}




const fetchTagsAsync = async (): Promise<Array<string>> => {
    try {
        const { tags } = await fetch(ENDPOINT + TagsRoute, { method: 'GET', headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
        // alert(tags)
        return tags
    } catch (e) {
        console.log(e)
        return []
    }
}