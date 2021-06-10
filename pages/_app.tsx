import '../styles/globals.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import AuthContextProvider from '../context/authcontext'
// import StoreContext from 

import router from 'next/router'
import { progressBarRef } from '../components/refs';
import { useEffect } from 'react';
import { applyCurrentTheme } from '../utils/helpers';


// router.onRouteChangeStart = () => {
//   progressBarRef.current.continuousStart()
// };

// router.onRouteChangeComplete = () => {
//   progressBarRef.current.complete()
// };

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    applyCurrentTheme()
  }, [])


  return (

    <AuthContextProvider>

      <Component {...pageProps} />
    </AuthContextProvider>

  )
}

export default MyApp
