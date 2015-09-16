import React from "react";
import ReactDom from "react-dom";

class App extends React.Component {
  // App is your "global store"
  state = {
    auth: null
  }

  handleDispatch(action) {
    // Handle dispatched actions by changing state
    if (action.type === 'AUTH')
      this.setState({auth: action.payload})
  }

  render() {
    // new state goes to `AppContext`
    return (
      <AppContext
        state={this.state}
        onDispatch={(action) => this.handleDispatch(action)}
        >
        <AppView />
      </AppContext>
    )
  }
}

class AppContext extends React.Component {
  // receives state and dispatch from `App`
  static propTypes = {
    state: React.PropTypes.object,
    onDispatch: React.PropTypes.func
  }

  // makes app state and dispatch available to all components
  // via context
  static childContextTypes = {
    state: React.PropTypes.object,
    dispatch: React.PropTypes.func
  }

  getChildContext() {
    return {
      state: this.props.state,
      dispatch: (action) => this.props.onDispatch(action)
    }
  }

  render() {
    return this.props.children
  }
}


class AppView extends React.Component {
  render() {
    return (
      <div>
        <Header />
      </div>
    )
  }
}


class Header extends React.Component {

  // ask for global state with context types
  static contextTypes = {
    state: React.PropTypes.object,
    dispatch: React.PropTypes.func
  }

  state = {
    isLoggingIn: false
  }

  login() {
    this.setState({isLoggingIn: true})
    // dispatch change to app state
    this.context.dispatch({
      type: 'AUTH',
      payload: {
        name: "FooBar"
      }
    });
    this.setState({isLoggingIn: false});
  }

  logout() {
    //"An exercise for the user";
  }

  render() {
    let { auth } = this.context.state;
    return (
      <div>
        <h1>
          {this.context.state.auth ?
            `Welcome ${auth.name}` :
            'You are not logged in'
          }
        </h1>

        {this.context.state.auth === null ? (
          <button
            onClick={() => this.login()}
            disabled={this.state.isLoggingIn}
            >Login</button>
        ) : (
          <button onClick={() => this.logout()}>Logout</button>
        )}
      </div>
    )
  }
}

ReactDom.render(<App />, document.getElementById("app"));


