import React, {Fragment} from 'react'

const ColumnFilter = ({column}) => {
  const {filterValue, setFilter} = column

  return (
    <Fragment>
      <form>
        <input type="text" placeholder="Search..." value={filterValue || ''} onChange={(e) => {setFilter(e.target.value)}}/>
      </form>
    </Fragment>
  )
}

export default ColumnFilter