import '@/styles/globals.css'
import SiswaInputProvider from '@/component/GlobalState/SiswaInputProvider'
import DisplaySiswaProvider from '@/component/GlobalState/DisplaySiswaProvider'

export default function App({ Component, pageProps }) {
  return (
    <SiswaInputProvider>
      <DisplaySiswaProvider>
        <Component {...pageProps} />
      </DisplaySiswaProvider>
    </SiswaInputProvider>
  )
}

