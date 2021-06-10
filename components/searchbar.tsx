import { useEffect, useRef, useState } from 'react'
import style from '../styles/Layout.module.css'
import { NoSearchResImg, questionWindowSize } from '../utils/constanse'
import { searchRemoteAsync } from '../utils/globalapicalls'
import { progressBarRef } from './refs'
import moment from 'moment'
import { useRouter } from 'next/router'
import { Button } from './stateless/stateless'

interface searchDataTypes {
    _id: string,
    title: string,
    time: Date,
    type: string
}

export default function Searchbar() {
    const searchResultDropDownRef = useRef(null)

    const [searchData, setSearchData] = useState<Array<searchDataTypes>>([])

    const [skip, setSkip] = useState(0)
    const [range, setRange] = useState({ skip: 0, limit: questionWindowSize })

    const router = useRouter()

    const [searchItem, setSearchItem] = useState('')


    const handleSearch = (e) => {
        setEnd(false)
        let item = e.target.value
        if (e.key === 'Enter' || e.keyCode === 13) {
            //validate 
            if (item.length === 0) return
            //search
            progressBarRef.current.staticStart()
            searchRemoteAsync(item, range.skip, range.limit)
                .then(questions => {
                    searchResultDropDownRef.current.style.display = 'block'
                    setSearchData([...searchData, ...questions])
                    progressBarRef.current.complete()
                })
                .catch(err => {
                    searchResultDropDownRef.current.style.display = 'block'
                    progressBarRef.current.complete();
                    setSearchData(searchData);
                })
        }
    }
    const [end, setEnd] = useState(false)
    useEffect(() => {
        if (searchData.length === 0 || range.skip == 0) return
        progressBarRef.current.staticStart()
        searchRemoteAsync(searchItem, range.skip, range.limit)
            .then(questions => {
                if (questions.length < questionWindowSize) {
                    setEnd(true)
                }
                searchResultDropDownRef.current.style.display = 'block'
                setSearchData([...searchData, ...questions])
                progressBarRef.current.complete()
            })
            .catch(err => {
                searchResultDropDownRef.current.style.display = 'block'
                progressBarRef.current.complete();
                setSearchData(searchData);
            })
    }, [range])

    useEffect(() => {
        const fn = (e) => {
            if (e.target.id !== 'myDropdown' && e.target.id !== "ignore") {
                searchResultDropDownRef.current.style.display = 'none'
            }
        }
        window.addEventListener("mousedown", fn)

        return () => {
            window.removeEventListener("mousedown", fn)
        }
    }, [])

    const handleItemClick = (item) => {
        switch (item.type) {
            case 'question':
                router.push("/posts/questions/" + item._id)

                break;
            case 'article':
                router.push("/posts/articles/" + item._id)

                break;

            default:
                break;
        }
    }
    useEffect(() => {
        setRange({ skip: 0, limit: questionWindowSize })
    }, [searchItem])


    return (
        <div className="dropdown">
            <input className={style.searchInput} placeholder="search by title or tags or both" onKeyUp={handleSearch} onChange={(e) => { setSearchItem(e.target.value); }} />
            <div id="myDropdown" className={"dropdown-content " + style.searchDropDown} ref={searchResultDropDownRef}>
                {
                    searchData.map(each => (
                        <div className="dd-item" key={each._id} onClick={() => { handleItemClick(each) }} id="ignore">
                            <div className={style.searchItemHead} id="ignore">
                                <p className={style[each.type]}>({each.type})</p>
                                <span id="ignore">{moment(each.time).calendar()}</span>
                            </div>
                            <span id="ignore">
                                {each.title.substring(2)}
                            </span>
                        </div>
                    ))
                }
                {
                    searchData.length === 0 && <img
                        src={NoSearchResImg} style={{ width: '100%', }}
                    />
                }
                {
                    searchData.length !== 0 && !end && <Button text="load more"
                        onclickCallBack={(e) => {
                            setRange({ skip: range.skip + questionWindowSize, limit: questionWindowSize })
                        }}
                        buttonStyle={{ textAlign: 'center', backgroundColor: 'transparent', color: '#088abd' }}
                    />
                }

            </div>
        </div>
    )
}
