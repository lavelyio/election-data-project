import React, { useState, useEffect } from 'react'
import { getAllPivotTemplates } from 'common/Utilities'
import { Notify } from 'common/Notifier'

const SelectTemplate = ({
  handleSelectedTemplate,
  onTemplates,
  availableTemplates = null,
}) => {
  //const dispatch = useDispatch()
  //const templates = useSelector(state => state.pivotTemplates)

  const [templates, setTemplates] = useState(availableTemplates)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getTemplates() {
      const { status, statusText, data } = await getAllPivotTemplates()
      if (status === 200) {
        onTemplates(data)
        setTemplates(data)
      } else {
        const err = `Unable to get templates. Status Code: ${status}. Error: ${statusText}`
        setError(err)
        Notify.error(err)
      }
    }
    if (!templates) {
      getTemplates()
    }
  }, [templates])

  const handleSelect = e => {
    const { value } = e.target
    const template = templates[value]
    handleSelectedTemplate(template)
  }

  return (
    <div>
      {!error && !templates && <div uk-spinner='true' />}
      <select className='uk-select' onChange={handleSelect}>
        {templates &&
          templates.map((t, key) => {
            return (
              <option value={key} key={key} style={{ textAlign: 'center' }}>
                {'  Name: '} {t.name}, {'   Created: '}{' '}
                {new Date(t.created_at).toLocaleDateString()}
              </option>
            )
          })}
      </select>
    </div>
  )
}

export default SelectTemplate
