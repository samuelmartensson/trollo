import React from 'react';
import fire from '../fire';

export default function Task(props) {
  const onDrag = (event, task) => {
    event.preventDefault();
    props.draggedTask(task);
  };
  const onDragStart = (event) => {
    let img = new Image();
    event.dataTransfer.setDragImage(img, 0, 0);
    event.target.parentElement.classList.add('invisible');
  };
  const onDragEnd = (event) => {
    event.target.parentElement.style =
      'clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);';
    event.target.parentElement.classList.remove('invisible');
    event.target.parentElement.classList.remove('left');
    event.target.parentElement.classList.remove('right');
  };
  const removeTask = () => {
    fire
      .database()
      .ref(`boards/${props.activeId}/content/items/${props.task.id}`)
      .remove();
  };
  const modalActive = () => {
    props.modalActive(props.task);
  };

  return (
    <div className="task">
      <div
        className="task-drag"
        draggable
        onDrag={(event) => onDrag(event, props.task)}
        onDragStart={(event) => onDragStart(event)}
        onDragEnd={(event) => onDragEnd(event)}
      >
        <div className="task-title">{props.name}</div>
        <div className="task-edit" onClick={modalActive}>
          <img src={require('../edit.png')} alt="" />
        </div>
      </div>
      <div className="task-date">
        {new Date(props.task.date).toLocaleDateString()}
      </div>
      <button onClick={removeTask}>
        <img src={require('../trash.png')} alt="" />
      </button>
    </div>
  );
}
