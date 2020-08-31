import React, { Component } from 'react';
import Task from './Task';
import fire from '../fire';
import TaskModal from './TaskModal';

class TaskContainer extends Component {
  state = {
    items: [],
    draggedTask: {},
    showModal: false,
    modalInfo: {},
  };

  onModalActive = (event) => {
    if (event) {
      this.setState({
        modalInfo: {
          content: event.content,
          category: event.category,
          date: event.date,
          id: event.id,
          additionalText: event.additionalText,
        },
      });
    }
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  // Drag events - visual only //
  onDragOver = (event) => {
    event.preventDefault();
    event.target.classList.add('hovered');
  };
  onDragLeave = (event) => {
    event.preventDefault();
    event.target.classList.remove('hovered');
  };
  // Drag events - visual only //

  // Event that moves items between categories in database and state
  onDrop = (event) => {
    event.preventDefault();
    event.target.classList.remove('hovered');

    const { draggedTask } = this.state;
    const dropContainerName = event.target.className.replace(/ .*/, '');
    // Checks if the container being dropped on is a valid category container and if the dropped data is valid
    // Data is valid when it is an empty string and selected text and images can otherwise be dropped and will break the app if not included
    if (
      this.props.categories.includes(dropContainerName) &&
      event.dataTransfer.getData('text') === ''
    ) {
      // Updates the dragged elements category name
      draggedTask['category'] = dropContainerName;
      // Sets state with the updated category name for the dragged and dropped element
      this.setState({
        items: [
          ...this.state.items.filter((item) => item.id !== draggedTask.id),
          draggedTask,
        ],
        // Resets the draggedtask to be used again
        draggedTask: {},
      });

      // Updates the task in the database to the correct category
      fire
        .database()
        .ref(`boards/${this.props.activeId}/content/items/${draggedTask.id}`)
        .update({
          category: dropContainerName,
        });
    }
    // If the element is dropped on a non-category container the task will be reset and no changes will be made
    else {
      this.setState({
        draggedTask: {},
      });
    }
  };
  draggedTask = (e) => {
    this.setState({
      draggedTask: e,
    });
  };
  removeCategory = (id) => {
    // Checks clicked category and removes all items from removed category in database
    // Since the items are not stored IN the category we must remove them seperately
    fire
      .database()
      .ref(`boards/${this.props.activeId}/content/items/`)
      .once('value')
      .then((snapshot) => {
        snapshot.forEach((item) => {
          if (item.val().category === id) {
            fire
              .database()
              .ref(
                `boards/${this.props.activeId}/content/items/` + item.val().id
              )
              .remove();
          }
        });
        // Removes actual category
        fire
          .database()
          .ref(
            `boards/${this.props.activeId}/content/categories/` +
              id.toLowerCase()
          )
          .remove();
      });
  };
  getItems() {
    let id = this.props.activeId;
    // Get all items from DB and set them to state + listen to changes
    var db = fire.database().ref(`boards/${id}/content/items/`);
    db.on('value', (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      this.setState({
        items: arr,
      });
    });
  }
  componentDidMount() {
    this.getItems();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.activeId !== this.props.activeId) {
      this.getItems();
    }
  }

  render() {
    return (
      <div className="containers">
        {this.state.showModal && (
          <TaskModal
            info={this.state.modalInfo}
            modalActive={this.onModalActive}
            activeId={this.props.activeId}
          />
        )}
        {this.props.categories.map((item) => {
          return (
            <div
              onDrop={(event) => this.onDrop(event)}
              onDragOver={(event) => this.onDragOver(event)}
              onDragLeave={(event) => this.onDragLeave(event)}
              key={item}
              className={`${item} drag-drop category`}
            >
              <div className="title-remove-wrap">
                <h1>{item}</h1>
                <input
                  value="remove"
                  type="button"
                  onClick={(e) => this.removeCategory(item)}
                />
              </div>
              <div className="task-wrapper">
                {this.state.items.map((task) => {
                  if (task.category === item) {
                    return (
                      <Task
                        key={task.id}
                        activeId={this.props.activeId}
                        name={task.content}
                        task={task}
                        draggedTask={this.draggedTask}
                        modalActive={this.onModalActive}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default TaskContainer;
