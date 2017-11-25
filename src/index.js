import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux'
import reducer from './reducers'
import { Provider } from 'react-redux'

const store = createStore(
	reducer,
	//if redux devtools exist in window, invoke redux devtools
	window.__REDUX_DEVTOOLS__EXTENSION__ && window.__REDUX__DEVTOOLS__EXTENSION__()
)

console.log("Store", store.getState())

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, document.getElementById('root')
);
registerServiceWorker();
