import React, { Component } from "react";
import { Bar } from 'react-chartjs-2';

class Dashboard extends Component {

    render() {
        const data = {
            labels: ['', '', '', '', '', '', ''],
            datasets: [
                {
                    label: '',
                    borderWidth: 1,
                    data: [65, 59, 80, 81, 56, 55, 40, 23]
                }
            ]
        };

        return (
            <main>
                <h3>Dashboard</h3>
                <div>
                    <Bar data={data} />
                </div>
            </main>
        );
    }
}

export default Dashboard;