import React, {useState} from 'react'
import {useAsyncDebounce} from 'react-table'

const GlobalFilter = ({filter, setFilter}) => {
  const [value, setValue] = useState(filter)

  const onChange = useAsyncDebounce(value => {
    setFilter(value || undefined)
  }, 200) // increase this number if the searches become too glitchy
  return (
    <form>
      <input type="text" placeholder="Global Search..." value={value || ''} onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
      />
    </form>
  )
}

export default GlobalFilter