import React, {createContext, useState} from 'react'

export const SiswaInput = createContext();

export default function SiswaInputProvider(props) {

    const [dataSiswaInput, setDataSiswaInput] = useState([])

  return (
    <SiswaInput.Provider value={[dataSiswaInput, setDataSiswaInput]}>
        {props.children}
    </SiswaInput.Provider>
  )
}
