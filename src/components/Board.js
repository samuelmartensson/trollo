import React, { Component } from 'react';
import TaskContainer from './TaskContainer';
import fire from '../fire';
import { Link } from 'react-router-dom';

class Board extends Component {
  state = {
    title: '',
    input: '',
  };

  componentDidMount = () => {
    // On refresh of page or if you have opened a board through a direct link
    // the categories will initially be empty. Therefore the specific board is loaded
    // through the url parameter which is equal to the board id
    if (this.props.categories.length === 0) {
      this.props.enterBoard(this.props.match.params.id);
    }
    // Sets the correct board name by checking boardname in board state by comparing active id
    if (this.props.boards.length > 0) {
      this.setState({
        title: this.props.boards.filter(
          (item) => item.id === this.props.activeId
        )[0].name,
      });
    }
  };

  componentDidUpdate(prevProps) {
    // Sets the correct board name if loaded on refresh or through direct link
    // this.props.boards will not be loaded from database on mount so it must be done here
    if (this.props.boards && prevProps.boards !== this.props.boards) {
      try {
        let boardName = this.props.boards.filter(
          (item) => item.id.toString() === this.props.match.params.id
        )[0].name;
        this.setState({
          title: boardName,
        });
      } catch (err) {
        console.log('Can not read property of empty board');
      }
    }
  }

  updateBoardName = () => {
    fire.database().ref(`boards/${this.props.activeId}`).update({
      name: this.state.input,
    });
  };
  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.updateBoardName();
      e.target.blur();
    }
  };
  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div className="current-board">
          <div>Current:</div>
          <input
            className="board-title-input"
            onKeyUp={(e) => this.handleKeyDown(e)}
            onChange={(e) => this.handleChange(e)}
            onBlur={this.updateBoardName}
            defaultValue={this.state.title}
            maxLength="40"
          />
          <Link to="/">
            <button onClick={this.props.clearActiveBoard}>Change board</button>
          </Link>
        </div>
        <div className="board">
          {this.props.activeId !== '' ? (
            <TaskContainer
              activeId={this.props.activeId}
              categories={this.props.categories}
              boards={this.props.boards}
            />
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default Board;
