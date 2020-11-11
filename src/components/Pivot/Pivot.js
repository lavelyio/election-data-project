import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PivotInterface from './pivot.interface'
import './pivot.css'

/**
 * Verify data integrity by ensuring numbers are numbers
 * @param {Array} data
 */
const ensureDataTypes = data => {
  data.forEach(item => {
    item.year = parseInt(item.year)
    item.value = Number(item.value)
  })
  return data
}

/**
 * Default pivot template if the user's settings
 *  don't have it set for some reason
 */
const defaultTemplate = {
  rows: [
    {
      uniqueName: 'country_str',
    },
    {
      uniqueName: 'year',
    },
  ],
  columns: [
    {
      uniqueName: 'long_name',
    },
  ],
  measures: [
    {
      uniqueName: 'value',
      aggregation: 'sum',
    },
  ],
}

const Pivot = ({ data }) => {
  const user = useSelector(state => state.auth.user)
  const [_data, setData] = useState(ensureDataTypes(data))
  const template = user.pivotTemplate

  useEffect(() => {
    if (data !== _data) {
      const checked = ensureDataTypes(data)
      setData(checked)
    }
  }, [data])

  useEffect(() => {
    const checked = ensureDataTypes(data)
    setData(checked)
  }, [])

  return (
    <div id='pivot-container'>
      <PivotInterface
        toolbar={true}
        report={{
          dataSource: {
            data: _data,
          },
          slice: template ? template : defaultTemplate,
        }}
      />
    </div>
  )
}

export default Pivot
