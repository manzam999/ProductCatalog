import React from 'react';
import PropTypes from 'prop-types';

export default class EditableLabel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        	isEditing: false,
        };
        
        this._handleFocus = this._handleFocus.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }
    
    _handleFocus() {
    	if(this.state.isEditing) {
        	if(typeof this.props.onFocusOut === 'function') {
        		this.props.onFocusOut(this.props.text, this.props.name);
            }
        }
        else {
        	if(typeof this.props.onFocus === 'function') {
	        	this.props.onFocus(this.props.text, this.props.name);
            }
        }
    
    	this.setState({
        	isEditing: !this.state.isEditing,
        });
    }
	
    _handleChange(e) {
        this.props.onChange(e);
    }

    render() {
    	if(this.state.isEditing) {
        	return <div>
                <input type={this.props.type}
                    name={this.props.name}
                    step={this.props.step}
                    className={this.props.inputClassName}
                    ref={(input) => { this.textInput = input; }}
                    value={this.props.text} 
                    onChange={this._handleChange}
                    onBlur={this._handleFocus}
                    style={{ 
                    	width: this.props.inputWidth,
                        height: this.props.inputHeight,
                        fontSize: this.props.inputFontSize,
                        fontWeight: this.props.inputFontWeight,
                        borderWidth: this.props.inputBorderWidth,
               			
                    }}
                    maxLength={this.props.inputMaxLength}
                    placeholder={this.props.inputPlaceHolder}
                    tabIndex={this.props.inputTabIndex}
                    autoFocus/>
        	</div>
        }
    
        return <div>
            <label className={this.props.labelClassName}
                onClick={this._handleFocus}
                style={{
                	fontSize: this.props.labelFontSize,
                    fontWeight: this.props.labelFontWeight,
                }}>
                {this.props.text}
            </label>
        </div>;
    }
}

EditableLabel.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    isEditing: PropTypes.bool,

    labelClassName: PropTypes.string,
    labelFontSize: PropTypes.string,
    labelFontWeight: PropTypes.string,

    inputMaxLength: PropTypes.number,
    inputPlaceHolder: PropTypes.string,
    inputTabIndex: PropTypes.number,
    inputWidth: PropTypes.string,
    inputHeight: PropTypes.string,
    inputFontSize: PropTypes.string,
    inputFontWeight: PropTypes.string,
    inputClassName: PropTypes.string,
    inputBorderWidth: PropTypes.string,

    onFocus: PropTypes.func,
    onFocusOut: PropTypes.func,
    onChange: PropTypes.func
};
