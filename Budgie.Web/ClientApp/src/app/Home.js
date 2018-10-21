import React, { Component } from "react";

class Home extends Component {

    render() {
        return (
            <div>
                <section className="hero is-medium is-primary">
                    <div className="hero-body">
                        <div className="container">
                            <div className="columns">
                                <div className="column is-8-desktop is-offset-2-desktop">
                                    <h1 className="title is-2 is-spaced">
                                        Hero
                                    </h1>
                                    <h2 className="subtitle is-4">
                                        Some sort of <strong>interesting</strong> text.
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="columns">
                            <div className="column is-8-desktop is-offset-2-desktop">
                                <div className="content">
                                    <h3>Title</h3>
                                    <p>
                                        Some sort of interesting text.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Home;