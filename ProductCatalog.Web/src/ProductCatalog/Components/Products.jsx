import React, { Component}  from 'react';
import { Button, Modal, Image, Icon, Container, Message } from 'semantic-ui-react';
import ProductList from './ProductList';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import {ProductCatalogServerUrl} from '../../constants/UrlConstants';
import { Form, Text } from 'react-form';
import {DebounceInput} from 'react-debounce-input';

class Products extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            confirmModalOpen: false,
            files: [],
            products: [],
            productToBeAdded: {},
            validationErrors: []
        }
    }

    componentDidMount() {
        this.setProducts();
    }

    exportProducts() {
        axios.get(`${ProductCatalogServerUrl}Products/Export`, {
            responseType: 'blob'
        }).then((response) => {
            let blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
            url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Products.xlsx');
            document.body.appendChild(link);
            link.click();
        });
    }

    removeProduct(id) {
        var array = [...this.state.products]; 
        var index = array.findIndex(i => i.id === id);

        if (index !== -1) {
            array.splice(index, 1);

            this.setState({
                products: array
            });
        }
    }

    setProducts(search) {
        axios.get(`${ProductCatalogServerUrl}Products${search ? `?search=${search}`: ``}`)
            .then(res => {
                const products = res.data;
                this.setState({ 
                    products: products 
                });
            })
    }

    handleClose = () => { this.setState({modalOpen: false}); };
    handleOpen = () => { this.setState({modalOpen: true}); };

    handleConfirmModalOpen = (product) => { this.setState({confirmModalOpen: true, productToBeAdded: product}); };
    handleConfirmModalClose = () => { this.setState({confirmModalOpen: false, productToBeAdded: {}}); };

    submitData(product) {
        var productInfo = new FormData();
        productInfo.append('Code', product.code);
        productInfo.append('Name', product.name);
        productInfo.append('Price', product.price);
        productInfo.append('', this.state.files[0]);

        axios(`${ProductCatalogServerUrl}/Products`, {
            method: 'post',
            data: productInfo,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(res => {
            this.handleClose();
            this.handleConfirmModalClose();
            this.removeImage();
            this.setState(prevState => ({
                products: [...prevState.products, res.data]
            }))
        })
        .catch(error => {
            if (error.response) {
                this.setState({
                    validationErrors: error.response.data
                })
            }
        });
    }

    submit(values) {
        if (parseFloat(values.price) < 999) {
            this.submitData(values);
        } else {
            this.handleConfirmModalOpen(values);
        }
    }

    onDrop(files) {
        var filesInState = this.state.files;
        for (var i = 0; i < files.length; i++) {
            filesInState.push(files[i]);
        }

        this.setState({
            files: filesInState
        });
    }

    removeImage() {
        this.setState({
          files: []
        })
    }

    render() {
        debugger;
        return (
            <Container>
                <Button content='Add New' onClick={() => this.handleOpen()} />
                <Button content='Export' onClick={() => this.exportProducts()}/>
                <div className="ui input">
                    <DebounceInput
                        minLength={2}
                        placeholder='Search'
                        debounceTimeout={500}
                        onChange={event => this.setProducts(event.target.value)} 
                        />
                </div>
                <ProductList products={this.state.products} removeProduct={this.removeProduct.bind(this)} />
                <Modal
                    open={this.state.confirmModalOpen}
                    onClose={this.handleConfirmModalClose}
                    basic
                    size='small'
                >
                    <Modal.Content>
                        <h3> Price is higher than 999 shall we proceed? </h3>
                    </Modal.Content>
                    <Modal.Actions>
                    <Button color='green' onClick={this.submitData.bind(this.state.productToBeAdded)} inverted>
                        <Icon name='checkmark' /> Yes
                    </Button>
                    <Button color='red' onClick={this.handleConfirmModalClose} inverted>
                        <Icon name='cancel' /> No
                    </Button>
                    </Modal.Actions>
                </Modal>
                <Modal open={this.state.modalOpen} onClose={this.handleClose}>
                    <Modal.Header> Add Product </Modal.Header>
                    {Object.keys(this.state.validationErrors).map((key, index) => ( 
                        <Message negative key={index}> <Message.Header>{key}</Message.Header> {this.state.validationErrors[key].map((error) => {
                            return <p> {error} </p>
                        })}
                        </Message> 
                    ))}
                    <Modal.Content>
                        <Form 
                            onSubmit={(v, s, p, f) => { this.submit(v); }}
                            asyncValidators={this.asyncValidators}>
                            {formApi => (
                                <form className="ui form" onSubmit={formApi.submitForm} id="form1">
                                <div className="field">
                                    <label>Code</label>
                                    <div className="field">
                                    <Text field="code" id="code" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Name</label>
                                    <div className="field">
                                    <Text field="name" id="name" />
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Price</label>
                                    <div className="field">
                                    <Text type="number" field="price" id="price" />
                                    </div>
                                </div>
                                {this.state.files.length ? (<div> <Image style={{width: '200px', height: '200px'}} src={this.state.files[0].preview} /> <Button onClick={this.removeImage.bind(this)}> Remove Image</Button> </div>) :
                                (<Dropzone accept="image/jpeg, image/png" multiple={false} onDrop={this.onDrop.bind(this)}>
                                    <div>Drag image here</div>
                                </Dropzone>)}
                                <Modal.Actions>
                                    <Button type="submit" color='green' inverted>
                                        <Icon name='checkmark' /> Submit
                                    </Button>
                                </Modal.Actions>
                                </form>
                            )}
                        </Form>
                    </Modal.Content>
                </Modal> 
            </Container>
        )
    }
}

export default Products;