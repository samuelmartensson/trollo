import React from 'react';
import Board from './components/Board';
import InputField from './components/InputField';
import BoardHandler from './components/BoardHandler';
import NotFound from './components/NotFound';
import fire from './fire';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Loader from './components/Loader';

class App extends React.Component {
  state = {
    categories: [],
    boards: [],
    activeId: '',
    input: '',
    exists: null,
    loaded: false,
  };

  componentDidMount = () => {
    let boardDb = fire.database().ref('boards/');
    let existing = false;

    boardDb.on('value', (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      this.setState({
        boards: [...arr],
        loaded: true,
      });
    });
    // Checks if the current board id exists in database, React Router uses
    // exists state variable to redirect to 404 if the active id does
    // not match any board ids in the database. See redirect functions for more info
    boardDb
      .once('value')
      .then((snap) => {
        snap.forEach((item) => {
          if (
            // Compares each existing board id to current activeId
            item.val().id.toString() === this.state.activeId &&
            this.state.activeId !== ''
          ) {
            existing = true;
          }
        });
      })
      .then(() => {
        this.setState({
          exists: existing,
        });
      });
  };

  onCategoryAdd = (new_category) => {
    this.setState({
      categories: [...this.state.categories, new_category],
    });
  };

  createBoard = () => {
    if (this.state.input.trim() !== '') {
      let newBoard_id = new Date().getTime();
      let newBoard = fire.database().ref('boards/' + newBoard_id);
      this.setState({
        input: '',
        activeId: newBoard_id,
        categories: ['backlog'],
        exists: true,
      });

      newBoard.set({
        id: newBoard_id,
        name: this.state.input,
      });
    } else {
      document.querySelector('.board-input-err').classList.add('visible');
    }
  };
  enterBoard = (id) => {
    // Listener for categories being added or removed
    let catDb = fire.database().ref(`boards/${id}/content/categories/`);
    catDb.on('value', (snapshot) => {
      // Gets all categories from DB and adds to an array
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.toJSON());
      });
      let sortedArr = [];
      // Sorts by time added to make them appear in correct order on reload
      arr
        .sort((a, b) => a.date - b.date)
        .forEach((item) => {
          sortedArr.push(item.category.toLowerCase());
        });
      // Set state to category array, active id and that the board exists
      this.setState({
        categories: ['backlog', ...sortedArr],
        activeId: id,
        exists: true,
      });
    });
  };
  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.createBoard(e);
      e.target.value = '';
    }
  };
  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };
  clearActiveBoard = () => {
    this.setState({
      activeId: '',
    });
  };
  removeBoard = (id) => {
    let remove = window.confirm(
      'Are you sure you want to remove current board?'
    );

    if (remove) {
      fire.database().ref(`boards/${id}`).remove();

      this.clearActiveBoard();
    }
  };
  renderRedirects = () => {
    /* this.state.exists will only be set to true if a board is successfully matched with an id in the database.
      ---
      When a board is removed from within the board, active id is set to "" and the second redirect
      will be executed  */
    if (this.state.activeId !== '' && this.state.exists) {
      return <Redirect to={`/boards/${this.state.activeId}`} />;
    } else {
      return <Redirect to="/" />;
    }
  };
  renderPageNotFound = () => {
    /*  If the exists state is not true the board does not exist therefore user will be redirected to 404 page.
      The exsist state variable is set in Board.js component by using the :id slug from React Router Props */
    if (this.state.activeId !== '' && !this.state.exists) {
      return <Redirect to="/not_found" />;
    }
  };
  renderInputField = () => {
    if (this.state.activeId !== '' && this.state.exists) {
      return (
        <InputField
          onCategoryAdd={this.onCategoryAdd}
          categories={this.state.categories}
          activeId={this.state.activeId}
          removeBoard={this.removeBoard}
        />
      );
    }
  };
  render() {
    return (
      <div className="App">
        {!this.state.loaded && <Loader />}
        <Router basename="/build">
          <header>
            {this.renderInputField()}
            <div className="logo">
              <img src="/build/sfdesign.png" alt="logo" />
            </div>
          </header>

          {this.renderRedirects()}
          {this.renderPageNotFound()}
          <Switch>
            <Route
              path={`/boards/:id`}
              render={(props) => (
                <Board
                  {...props}
                  categories={this.state.categories}
                  enterBoard={this.enterBoard}
                  boards={this.state.boards}
                  clearActiveBoard={this.clearActiveBoard}
                  activeId={this.state.activeId}
                />
              )}
            />
            <Route
              path="/"
              exact
              render={() => (
                <BoardHandler
                  boards={this.state.boards}
                  handleChange={this.handleChange}
                  handleKeyDown={this.handleKeyDown}
                  createBoard={this.createBoard}
                  enterBoard={this.enterBoard}
                  removeBoard={this.removeBoard}
                />
              )}
            />
            <Route path="/not_found" component={NotFound} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
