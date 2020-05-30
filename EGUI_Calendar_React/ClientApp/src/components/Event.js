import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment';
import { getState } from './GetState'

export class Event extends Component {
    constructor(props) {
        super(props);

        this.timeRef = React.createRef();
        this.nameRef = React.createRef();

        this.state = props.location.state;
        if (this.state === undefined || this.state === null) {
            let date = new Date();
            this.state = getState(date);
        }

        if (this.state.event === null) {
            this.title = `New Event at ${moment(this.state.date).format('YYYY-MM-DD')}`;
            this.state.event = {
                id: null,
                time: "00:00",
                name: ""
            };
        }
        else {
            this.title = `${this.state.event.name} at ${moment(this.state.date).format('YYYY-MM-DD')}`;
        }
    }

    newEvent() {
        let date = this.state.date;
        let time = this.timeRef.current.value;
        let name = this.nameRef.current.value;

        fetch(`api/NewEvent?year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                time: `${time}:00`,
                name: name
            }),
        }).then(() => {
            this.props.history.push({ pathname: "day", state: this.state });
        });
    }

    editEvent() {

    }

    sumbitHandler(e) {
        e.preventDefault();

        if (this.state.event.id !== null) {
            this.editEvent();
        }
        else {
            this.newEvent();
        }
    }

    render() {
        if (this.state === undefined || this.state === null) {
            return null;
        }

        return (
            <div>
                <div className="row headerbar text-chonker">
                    <div className="col text-left">
                        <Link className="hyperlink" to={{ pathname: "day", state: this.state }}>
                            {"<"}
                        </Link>
                    </div>
                    <div className="col-10 text-center">
                        {this.title}
                    </div>
                    <div className="col text-right">
                    </div>
                </div>
                <br/>
                <form onSubmit={this.sumbitHandler.bind(this)}>
                    <div className="row text-chonk">
                        <div className="col-2">
                            Time
                        </div>
                        <div className="col">
                            <input ref={this.timeRef} className="input" type="time" name="time" defaultValue={this.state.event.time.substring(0, 5)} required />
                        </div>
                    </div>
                    <div className="row text-chonk">
                        <div className="col-2">
                            Name
                        </div>
                        <div className="col">
                            <input ref={this.nameRef} className="input" type="name" name="name" maxLength="150" defaultValue={this.state.event.name} required />
                        </div>
                    </div>
                    <div className="row text-chonk">
                        <div className="col">
                            <input className="hyperlink submit-button" type="submit" value={this.state.event.id !== null ? "Confirm Edit" : "Create Event" } />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}