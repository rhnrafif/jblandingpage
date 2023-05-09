import '@/styles/globals.css'
import SiswaInputProvider from '@/component/GlobalState/SiswaInputProvider'
import DisplaySiswaProvider from '@/component/GlobalState/DisplaySiswaProvider'
import IsLoadingProvider from '@/component/GlobalState/IsLoadingProvider'

export default function App({ Component, pageProps }) {
  return (
    <SiswaInputProvider>
      <DisplaySiswaProvider>
        <IsLoadingProvider>
          <Component {...pageProps} />
        </IsLoadingProvider>
      </DisplaySiswaProvider>
    </SiswaInputProvider>
  )
}

