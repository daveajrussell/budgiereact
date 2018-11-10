import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './../store/categories/actions';
import { Modal } from './components';

const types = {
    1: 'Income',
    2: 'Dedicated',
    3: 'Variable',
    4: 'Savings'
}

const modes = {
    edit: 'edit',
    new: 'new'
}

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: '',
            type: '',
            submitted: false,
            valid: false,
            show: false,
            mode: modes.new
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        if (this.props.categories.items.length === 0)
            this.props.getAllCategories();
    }

    showModal = (item) => {
        if (!!item) {
            this.setState({
                submitted: false,
                show: true,
                mode: modes.edit,
                id: item.id,
                name: item.name,
                type: item.type
            });
        } else {
            this.setState({
                submitted: false,
                show: true,
                mode: modes.new,
                name: '',
                type: ''
            });
        }
    };

    hideModal = () => {
        this.setState({
            submitted: false,
            show: false,
            id: 0,
            name: '',
            type: ''
        });
    };

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    isModalShown() {
        const { loading } = this.props.categories;
        const { submitted, valid, show } = this.state;

        if (submitted && valid && !loading) return false;

        return show;
    }

    handleSave() {
        const { mode, id, name, type } = this.state;

        if (name && type) {
            this.setState({
                submitted: true,
                valid: true
            });

            if (mode === modes.new) {
                this.props.createNewCategory(name, type);
            } else if (mode === modes.edit) {
                this.props.editCategory(id, name, type);
            }
        } else {
            this.setState({
                submitted: true,
                valid: false
            });
        }
    }

    handleDelete(item) {
        this.props.deleteCategory(item);
    }

    render() {
        const { items, loading } = this.props.categories;
        const { mode, id, type, name, valid, submitted } = this.state;
        return (
            <main>
                <h3>
                    Categories
                    <a className="button is-small is-primary is-pulled-right" onClick={() => this.showModal()}>New</a>
                </h3>
                {
                    loading ?
                        <main>
                            <div>Loading...</div>
                        </main>
                        :
                        <main>
                            {
                                items && items.length >= 1 ?
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item) =>
                                                <tr key={item.id}>
                                                    <td>{item.name}</td>
                                                    <td>{types[item.type]}</td>
                                                    <td>
                                                        <div className="field is-grouped is-pulled-right">
                                                            <p className="control">
                                                                <button className={'button is-small is-primary ' + (item.editing ? 'is-loading' : '')}
                                                                    onClick={() => !item.editing && this.showModal(item)}>Edit</button>
                                                            </p>
                                                            <p className="control">
                                                                <button className={'button is-small is-danger ' + (item.deleting ? 'is-loading' : '')}
                                                                    onClick={() => !item.deleting && this.handleDelete(item)}>Delete</button>
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    :
                                    <div>No categories</div>
                            }
                        </main>
                }
                <Modal buttonClass={submitted && !valid ? 'is-danger' : 'is-primary'}
                    show={this.isModalShown()}
                    loading={loading}
                    title={mode === modes.new ? 'Add new category' : 'Edit category'}
                    handleClose={this.hideModal}
                    handleSave={this.handleSave}>
                    <div className="field">
                        <label className="label">Name</label>
                        <div className="control">
                            <input className={submitted && !valid && !name ? 'input is-danger' : 'input'}
                                name="name"
                                value={name}
                                type="text"
                                placeholder="The name of your category"
                                onChange={this.handleChange} />
                        </div>
                        {
                            submitted && !valid && !name &&
                            <p className="help is-danger">
                                This field is required
                            </p>
                        }
                    </div>
                    <div className="field">
                        <label className="label">Type</label>
                        <div className={submitted && !valid && !type ? 'select is-fullwidth is-danger' : 'select is-fullwidth'}>
                            <select name="type"
                                value={type}
                                onChange={this.handleChange}>
                                <option value="">Please select</option>
                                <option value="1">Income</option>
                                <option value="2">Dedicated</option>
                                <option value="3">Variable</option>
                                <option value="4">Savings</option>
                            </select>
                        </div>
                        {
                            submitted && !valid && !type &&
                            <p className="help is-danger">
                                This field is required
                            </p>
                        }
                    </div>
                </Modal>
            </main>
        )
    }
}

export default connect(
    state => state,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Categories);