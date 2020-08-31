import React from 'react';
import { Link } from 'react-router-dom';

export default function BoardHandler(props) {
  return (
    <div className="board-wrap">
      <h1>Create new board</h1>
      <div className="board-input-wrap">
        <input
          onChange={(e) => props.handleChange(e)}
          onKeyUp={(e) => props.handleKeyDown(e)}
          maxLength="40"
        />

        <div onClick={props.createBoard} className="board-input-txt">
          Add board
        </div>
      </div>
      <div className="board-input-err">Can not be blank</div>
      <div className="my-boards-wrap">
        <div className="board-title">My boards:</div>
        <div className="board-btn-wrap">
          {props.boards.map((item) => {
            return (
              <div key={item.id} className="board-btn-inner">
                <Link
                  className="board-btn"
                  onClick={() => props.enterBoard(item.id)}
                  to={`/boards/${item.id}`}
                >
                  <div className="board-select-title">{item.name}</div>
                </Link>

                <button
                  onClick={() => props.removeBoard(item.id)}
                  className="board-remove-btn"
                >
                  <img src={require('../trash.png')} alt="" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
