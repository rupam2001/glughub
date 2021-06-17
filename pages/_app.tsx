import '../styles/globals.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import AuthContextProvider from '../context/authcontext'
// import StoreContext from 


import { useEffect } from 'react';
import { applyCurrentTheme } from '../utils/helpers';
import DeviceAlert from '../components/deviceAlert';
import Head from 'next/head'



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
    <>
      <Head>
        <meta name="viewport" content="width=1024" />
      </Head>
      <AuthContextProvider>
        <Component {...pageProps} />
        <DeviceAlert />
      </AuthContextProvider>
    </>

  )
}

export default MyApp
