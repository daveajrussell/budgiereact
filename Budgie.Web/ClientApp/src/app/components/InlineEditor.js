import React, { Component } from 'react';
import accounting from 'accounting';

export class InlineEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            value: ''
        }
    }

    componentDidMount() {
        const { value } = this.props;
        this.setState({
            value: accounting.unformat(value)
        });
    }

    saveChanges() {
        const { value } = this.state;
        this.props.handleSave(parseFloat(value));
        this.toggleEditor();
    }

    toggleEditor() {
        this.setState(prevState => ({
            isEditing: !prevState.isEditing
        }));
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render() {
        const { isEditing, value } = this.state;

        if (isEditing) {
            return (
                <input autoFocus type="text" name="value" className="input" value={value} onChange={(e) => this.handleChange(e)} onBlur={() => this.saveChanges()} />
            );
        } else {
            return (
                <span onClick={() => this.toggleEditor()}>{this.props.value}</span>
            );
        }
    }
}