import { useEffect } from 'react';
import { PassengerContextProvider } from "../context/passenger-context";
import '../styles/globals.css'
import { Layout } from "../components/layout"
import '../styles/glitch.scss';

function MyApp({ Component, pageProps }) {
  
  useEffect(() => {
    const localLightMode = window.localStorage.getItem('lightMode');
    if(localLightMode === 'true') {
        document.body.classList.add('lightMode');
    }
}, []);

  return (
  <PassengerContextProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </PassengerContextProvider>  
  )
}

export default MyApp
