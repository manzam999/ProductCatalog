import React, { Component}  from 'react';
import { Table, Header, Icon, Image, Button, Container, Message } from 'semantic-ui-react';
import EditableLabel from '../../Utils/EditableLabel';
import {ProductCatalogServerUrl} from '../../constants/UrlConstants';
import axios from 'axios';
import Dropzone from 'react-dropzone';

class Product extends Component {
    constructor(props) {
        super(props);

        this.handleFocus = this.handleFocus.bind(this);
        this.handleFocusOut = this.handleFocusOut.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.state ={
            code: '',
            name: '',
            price: 0,
            photo: '',
            initialValue: '',
            files: [],
            validationErrors: []
        }
    }

    componentDidMount() {
        this.setProduct();
    }

    onDrop(files) {
        var filesInState = this.state.files;
        for (var i = 0; i < files.length; i++) {
            filesInState.push(files[i]);
        }

        this.setState({
            photo: filesInState[0].preview,
            files: filesInState
        }, () => this.updateProduct());
    }

    setProduct() {
        axios.get(`${ProductCatalogServerUrl}Products/${this.props.match.params.id}`)
            .then(res => {
                this.setState(res.data);
            })
    }

    updateProduct() {
        var productInfo = new FormData();
        productInfo.append('Code', this.state.code);
        productInfo.append('Name', this.state.name);
        productInfo.append('Price', this.state.price);
        productInfo.append('Photo', this.state.photo);
        if (this.state.files) {
            productInfo.append('', this.state.files[0]);
        } 

        axios(`${ProductCatalogServerUrl}/Products/${this.props.match.params.id}`, {
            method: 'put',
            data: productInfo,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .catch(error => {
            if (error.response) {
                this.setState({
                    validationErrors: error.response.data
                })
            }
        });;
    }

    handleFocus(text) {
        this.setState({
            initialValue: text
        })
    }
 
    handleFocusOut(text, name) {
        if (text && this.state.initialValue !== text) {
            this.setState({
                [name]: text
            }, () => this.updateProduct());
        }
    }

    handleInputChange(e) {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        if (value.length) {
            this.setState({
                [name]: value
            });
        }
    }

    removeImage() {
        this.setState({
            files: [],
            photo: ''
        }, () => this.updateProduct())
    }

    render() {
        return (
            <Container>
                {Object.keys(this.state.validationErrors).map((key, index) => (
                    <Message negative key={index}> <Message.Header>{key}</Message.Header> {this.state.validationErrors[key].map((error) => {
                        return <p> {error} </p>
                    })}
                    </Message>
                ))}
                <Table basic='very' celled collapsing>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Field</Table.HeaderCell>
                            <Table.HeaderCell>Value <Icon name='edit' /> </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>
                            <Header as='h4'>
                                <Header.Content>
                                    Code
                                </Header.Content>
                            </Header>
                            </Table.Cell>
                            <Table.Cell>
                                <div>
                                    <EditableLabel
                                        name="code"
                                        type="text"
                                        text={this.state.code}
                                        labelClassName='myLabelClass'
                                        inputClassName='myInputClass'
                                        inputWidth='150px'
                                        inputHeight='25px'
                                        inputMaxLength={450}
                                        labelFontWeight='bold'
                                        inputFontWeight='bold'
                                        onFocus={this.handleFocus}
                                        onFocusOut={this.handleFocusOut}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>
                                <Header as='h4'>
                                    <Header.Content>
                                        Name
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>
                                <div>
                                    <EditableLabel 
                                        name="name"
                                        type="text"
                                        text={this.state.name}
                                        labelClassName='myLabelClass'
                                        inputClassName='myInputClass'
                                        inputWidth='150px'
                                        inputHeight='px'
                                        inputMaxLength={450}
                                        labelFontWeight='bold'
                                        inputFontWeight='bold'
                                        onFocus={this.handleFocus}
                                        onFocusOut={this.handleFocusOut}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>
                                <Header as='h4'>
                                    <Header.Content>
                                        Price
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>
                                <div>
                                    <EditableLabel
                                        name="price" 
                                        type="number"
                                        step="0.01"
                                        text={this.state.price}
                                        labelClassName='myLabelClass'
                                        inputClassName='myInputClass'
                                        inputWidth='150px'
                                        inputHeight='25px'
                                        inputMaxLength={450}
                                        labelFontWeight='bold'
                                        inputFontWeight='bold'
                                        onFocus={this.handleFocus}
                                        onFocusOut={this.handleFocusOut}
                                        onChange={this.handleInputChange}
                                    />
                                </div>
                            </Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell>
                                <Header as='h4'>
                                    <Header.Content>
                                        Photo
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>
                                <div>
                                    {this.state.photo ? (<div> <Image style={{width: '200px', height: '200px'}} src={this.state.photo} /> <Button onClick={this.removeImage.bind(this)}> Remove Image</Button> </div>) :
                                    (<Dropzone accept="image/jpeg, image/png" multiple={false} onDrop={this.onDrop.bind(this)}>
                                        <div>Drag image here</div>
                                    </Dropzone>)}
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Container>
        );
    }
}

export default Product;