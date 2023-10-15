import React from 'react'

export default function NoteItem(props) {
  return (
    <div className='note'>
      <div className="note-header">
        <div>
          <p className="note-title">{props.title}</p>
        </div>
        <div>
          <button className='close' onClick={() => props.onClick(props.noteId)}>X</button>
        </div>
      </div>
      <div className="note-content">
        <p>{props.content}</p>
      </div>
    </div>
  )
}
