import React from 'react';
import fire from '../fire';

export default function TaskModal({ info, modalActive, activeId }) {
  const modalActiveInner = () => {
    const textareaTitle = document.querySelector('.modal-title').value;
    const textareaInfo = document.querySelector('.modal-textarea').value;

    fire
      .database()
      .ref(`boards/${activeId}/content/items/` + info.id)
      .update({
        content: textareaTitle,
        additionalText: textareaInfo,
      });
    document.querySelector('.modal-bg').classList.add('fade-out');
    setTimeout(() => {
      document.querySelector('.modal-bg').classList.remove('fade-out');
      modalActive();
    }, 120);
  };

  const outsideClick = (event) => {
    if (event.target.className.includes('modal-bg')) {
      modalActiveInner();
    }
  };

  return (
    <div className="modal-bg" onClick={(e) => outsideClick(e)}>
      <div className="modal-wrap">
        <div className="modal-inner-wrap">
          <input
            className="modal-title"
            defaultValue={info.content}
            maxLength="40"
          />
          <div className="modal-category">Category: {info.category}</div>
          <div className="modal-date">
            Created: {new Date(info.date).toLocaleDateString()}
          </div>
          <div className="modal-additional">Additional information</div>
          <textarea
            className="modal-textarea"
            placeholder="Also, do these things..."
            defaultValue={info.additionalText}
          ></textarea>
        </div>

        <button onClick={modalActiveInner}>Save and Close</button>
      </div>
    </div>
  );
}
