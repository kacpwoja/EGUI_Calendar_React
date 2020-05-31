import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import moment from "moment";
import { getState } from "./GetState"

export class Day extends Component {
    constructor(props) {
        super(props);

        this.state = props.location.state;
        if (this.state === undefined || this.state === null) {
            let date = new Date();
            this.state = getState(date);
        }

        this.state.events = [];
        this.getData(this.state.date).then(o => {
            let state = {
                events: o
            };
            this.setState(state);
        });

        document.title = `${moment(this.state.date).format("DD MMMM YYYY")} - Calendar`
    }

    async getData(date) {
        const response = await fetch(`api/GetEvents?year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}`);
        const data = await response.json();
        return data;
    }

    getCreateRoute() {
        let state = Object.assign({}, this.state);
        state.event = null;
        return { pathname: "event", state: state }
    }

    getEditRoute(event) {
        let state = Object.assign({}, this.state);
        state.event = event;
        return { pathname: "event", state: state };
    }

    deleteEvent(event) {
        let date = this.state.date;
        fetch(`api/RemoveEvent?year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}&id=${event.id}`, {
            method: 'POST'
        }).then(() => {
            this.getData(this.state.date).then(o => {
                let state = {
                    events: o
                };
                this.setState(state);
            });
        });
    }

    dayContent() {
        let rows = []
        if (this.state.events.length == 0) {
            rows.push(
                <div className="row text-chonk text-left">
                    No Events.
                </div>
            );
        }
        for (let i = 0; i < this.state.events.length; i++) {
            rows.push(
                <div key={i} className="row text-chonk">
                    <div class="col-1 text-left">
                        {this.state.events[i].time.substring(0, 5)}
                    </div>
                    <div class="col text-left">
                        {this.state.events[i].name}
                    </div>
                    <div class="col-1 text-right">
                        <Link className="hyperlink" to={this.getEditRoute(this.state.events[i])}>
                            Edit
                        </Link>
                    </div>
                    <div class="col-1 text-right">
                        <a className="hyperlink" href="javascript:undefined" onClick={() => this.deleteEvent(this.state.events[i])}>
                            Delete
                        </a>
                    </div>
                </div>
            );
        }

        return rows;
    }

    render() {
        return (
            <div>
                <div className="row headerbar text-chonker">
                    <Link className="col hyperlink text-left" to={{ pathname: "/", state: this.state }}>
                        {"<"}
                    </Link>
                    <div className="col-8 text-center">
                        {moment(this.state.date).format('dddd, Do [of] MMMM YYYY')}
                    </div>
                    <Link className="col hyperlink text-right" to={this.getCreateRoute()}>
                        {"+"}
                    </Link>
                </div>

                {this.dayContent()}
            </div>
        );
    }
}