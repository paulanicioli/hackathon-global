import logo from './logo.svg';
import './App.css';

import Signup from './components/auth/Signup';

function App() {
  return (
    <div className="App">
      <Route exact path="/signup" component={Signup} />
    </div>
  );
}

export default App;
