import React, { useState } from 'react';
const StoreContext = React.createContext(null)


//not in use

export default function StoreProvider(props) {

    const [homeQuestions, setHomeQuestions] = useState([])

    return (
        <StoreContext.Provider
            value={{
                homeQuestions, setHomeQuestions
            }}
        >
            {props.children}
        </StoreContext.Provider>
    )
}