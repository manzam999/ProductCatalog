import React, { Component}  from 'react';
import { Link } from 'react-router-dom';
import { Item, Button } from 'semantic-ui-react';
import {ProductCatalogServerUrl} from '../../constants/UrlConstants';
import * as paths from '../../constants/RouterConstants';
import moment from 'moment';
import axios from 'axios';
import NoImage from '../../images/NoImage.png';

class ProductItem extends Component {
    deleteProduct(id) {
        axios.delete(`${ProductCatalogServerUrl}Products/${id}`)
            .then(res => {
                if (res.status === 204) {
                    this.props.removeProduct(id);
                }
            })
    }

    render() {
        const product = this.props.product;

        return (
            <Item>
                {product.photo ? <Item.Image size='tiny' src={product.photo} /> : <Item.Image size='tiny' src={NoImage} />}
                <Item.Content>
                    <Item.Header> 
                        <Link to={paths.PRODUCT.replace(':id', product.id)}> 
                            {product.code} - {product.name} 
                        </Link> 
                    </Item.Header>
                    <Item.Meta>
                        <span className='price'> Price: {product.price} </span>
                    </Item.Meta>
                    <Item.Extra>
                        {product.lastUpdated ? `Last Updated:  ${moment(product.lastUpdated.toLocaleString()).fromNow()}` : null}
                        <Button onClick={() => this.deleteProduct(product.id)} color='red' floated='right'>
                            Delete
                        </Button>
                    </Item.Extra>
                </Item.Content>
            </Item>
        )
    }
}

export default ProductItem;