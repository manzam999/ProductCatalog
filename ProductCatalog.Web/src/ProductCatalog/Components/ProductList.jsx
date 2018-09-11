import React, { Component}  from 'react';
import { Item } from 'semantic-ui-react';
import ProductItem from './ProductItem';

class ProductList extends Component {
    render() {
        return (
            <Item.Group>
                {this.props.products.map((product) => {
                    return <ProductItem key={product.id} product={product} removeProduct={this.props.removeProduct.bind(this)} />
                })}
            </Item.Group>
        );
    }
}

export default ProductList;