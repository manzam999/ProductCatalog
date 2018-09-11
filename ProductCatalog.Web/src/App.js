import React, { Component } from 'react';
import {
  Route
} from 'react-router-dom';
import './App.css';
import Products from './ProductCatalog/Components/Products';
import Product from './ProductCatalog/Components/Product';
import * as paths from './constants/RouterConstants';

class App extends Component {
  render() {
    return (
      <div className="Site">
        <div className='Site-content'>
          <Route exact path={paths.APP_PATH} component={Products} />
          <Route path={paths.PRODUCT} component={Product} />
        </div>
      </div>
    );
  }
}

export default App;
