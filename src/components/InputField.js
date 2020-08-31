import React, { Component } from 'react';
import fire from '../fire';

const db = fire.database();

class InputField extends Component {
  state = {
    input: '',
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };
  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.addItem();
      e.target.value = '';
    }
  };
  clearInput = () => {
    document.querySelector('.input-bar').value = '';
    this.setState({
      input: '',
    });
  };

  addItem = () => {
    if (this.state.input.trim() !== '') {
      // Create unique id for new item
      let id = new Date().getTime().toString().slice(0, -1);
      // Creates new item in database
      db.ref(`boards/${this.props.activeId}/content/items/${id}`).set({
        content: this.state.input,
        id: id,
        // New items are always added to backlog
        category: 'backlog',
        date: new Date().getTime(),
        additionalText: '',
      });
      this.clearInput();
    }
  };
  addCategory = () => {
    // Conditional prevents duplicates
    if (
      !this.props.categories.includes(
        this.state.input.replace(/\s+/g, '-').toLowerCase()
      ) &&
      this.state.input.trim() !== ''
    ) {
      // Replaces whitespace in category name with a dash - items are not droppable otherwise
      const category_name = this.state.input.replace(/\s+/g, '-');
      // Create new category in database
      db.ref(
        `boards/${this.props.activeId}/content/categories/` +
          category_name.toLowerCase()
      ).set({
        category: category_name,
        date: new Date().getTime(),
      });
      // Updates state in App with new category
      this.props.onCategoryAdd(category_name.toLowerCase());
      this.clearInput();
    }
  };

  render() {
    return (
      <div className="input-btn">
        <input
          className="input-bar"
          onKeyUp={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Build website..."
          maxLength="40"
        />
        <div className="btn-wrap">
          <button className="add-btn" onClick={this.addItem}>
            Add task
          </button>
          <button className="add-btn-cat" onClick={this.addCategory}>
            Add Category
          </button>
          <button
            className="remove-board"
            onClick={() => this.props.removeBoard(this.props.activeId)}
          >
            Remove Board
          </button>
        </div>
      </div>
    );
  }
}

export default InputField;
