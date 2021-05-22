import React from 'react';

export default class InputField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.isChecked ? this.props.isChecked : '',
            value: this.props.value ? this.props.value : ''
        }
    }

    handleUpdate = (e, inputType) => {
        if(inputType === 'checkbox') {
            this.setState({ checked: e.target.checked });
        } else {
            this.setState({ value: e.target.value });
        }
        this.props.updateInputValue(e, inputType);
    }

    render() {
        const { label, inputType, inputName, isRequired, hasError, id, placeholder } = this.props;
        return (
            <React.Fragment>   
                {inputType === 'checkbox' ? (
                    <div>
                        <label>
                            <input 
                                type="checkbox"
                                name={inputName}
                                onChange={(e) => {this.handleUpdate(e, inputType)}}
                                checked={this.state.checked}
                            />
                            <span>{label}</span>
                        </label>
                    </div>
                ) : inputType === 'text' ? (
                    <div>
                        <label>
                            <div>{label}</div>
                            <input 
                                required={isRequired}
                                value={this.state.value ? this.state.value : ''}
                                onChange={(e) => {this.handleUpdate(e, inputType)}}
                                name={inputName}
                                id={id}
                                type="text"
                                placeholder={placeholder}
                            />
                        </label>
                        {hasError ? (
                            <div>
                                This field is required.
                            </div>
                        ):('')}
                    </div>
                ) : inputType === 'select' ? (
                    <div>
                        <div>
                            <label htmlFor={id}>
                                {label}
                            </label>
                        </div>
                        <select
                            required={isRequired}
                            value={this.state.value ? this.state.value : ''}
                            onChange={(e) => {this.handleUpdate(e, inputType)}}
                            name={inputName}
                            id={id}
                            type="select"
                        >
                            {this.props.inputSelectData ? (
                                this.props.inputSelectData.map((item, i) => {
                                    return <option key={i} value={item.value}>{item.label}</option>
                                })
                            ) : (
                             ''   
                            )}
                        </select>
                        {hasError ? (
                            <div>
                                This field is required.
                            </div>
                        ):('')}
                    </div>
                ) : ''}
            </React.Fragment>
        )
    }
}