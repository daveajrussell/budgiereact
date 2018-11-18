import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from './../store/dashboard/actions';
import { Bar } from 'react-chartjs-2';
import accounting from 'accounting';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            range: 0
        }
    }

    componentDidMount() {
        const { range } = this.state;
        this.props.getDashboard({
            range: range
        });
    }

    changeRange(range) {
        this.setState({
            range: range
        });

        this.props.getDashboard({
            range: range
        });
    }

    getClassNameForRange(buttonRange) {
        const { range } = this.state;
        buttonRange = buttonRange || 0;
        let className = 'button is-small';

        if (buttonRange === range)
            className += ' is-primary is-selected';

        return className;
    }

    render() {
        const { loading, dashboard } = this.props;

        const options = {
            tooltips: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (tooltipItem, data) => {
                        let label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) label += ': ';
                        label += accounting.formatMoney(tooltipItem.yLabel);

                        return label;
                    }
                }
            },
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }

        // so react-chartjs2 internally calls set state
        // which should never be called within render
        // as it leads to an infinite loop
        // is this is a bug in react chartjs 2?
        // are you even supposed to use it with redux?
        // maybe I should write my own chartjs2 impementation for react-redux
        // anyway, here is a shitty deep copy of our
        // props object so we can render a chart
        const data = JSON.parse(JSON.stringify(dashboard));

        return (
            <main>
                <h3>
                    Dashboard
                    <div className="buttons has-addons is-pulled-right">
                        <span className={this.getClassNameForRange(0)} onClick={() => this.changeRange(0)}>7 days</span>
                        <span className={this.getClassNameForRange(1)} onClick={() => this.changeRange(1)}>1 month</span>
                        <span className={this.getClassNameForRange(2)} onClick={() => this.changeRange(2)}>3 months</span>
                        <span className={this.getClassNameForRange(3)} onClick={() => this.changeRange(3)}>1 year</span>
                    </div>
                </h3>
                <div>
                    {
                        loading ? '' : <Bar data={data} options={options} />
                    }
                </div>
            </main >
        );
    }
}

export default connect(
    state => state.dashboard,
    dispatch => bindActionCreators(actionCreators, dispatch),

)(Dashboard);