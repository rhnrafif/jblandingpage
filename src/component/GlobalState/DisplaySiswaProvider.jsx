import React, {useState, createContext} from 'react'

export const DisplaySiswa = createContext();

export default function DisplaySiswaProvider(props) {
    //state
    const [isInputSiswa, setIsInputSiswa] = useState(false)

  return (
    <DisplaySiswa.Provider value={[isInputSiswa, setIsInputSiswa]}>
        {props.children}
    </DisplaySiswa.Provider>
  )
}
