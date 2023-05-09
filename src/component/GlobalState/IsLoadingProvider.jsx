import React, {useState, createContext} from 'react'

export const LoadingState = createContext();

export default function IsLoadingProvider(props) {

    const [isLoading, setIsLoading] = useState(false)

  return (
    <LoadingState.Provider value={[isLoading, setIsLoading]}>
        {props.children}
    </LoadingState.Provider>
  )
}
