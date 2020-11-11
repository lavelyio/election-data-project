import React from 'react'

const SaveTemplate = ({ handleTemplateNameChange, handleSetAsDefault }) => (
  <div className='uk-form-stacked'>
    <div className='uk-margin'>
      <label>Template Name</label>
      <input
        type='text'
        className='uk-input'
        onChange={handleTemplateNameChange}
      />
    </div>
    <div className='uk-margin'>
      <label>Set as my default</label>
      <input
        type='checkbox'
        className='uk-margin-left uk-checkbox'
        onChange={handleSetAsDefault}
      />
    </div>
  </div>
)

export default SaveTemplate
