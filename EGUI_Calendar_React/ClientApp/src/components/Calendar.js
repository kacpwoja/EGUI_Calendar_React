import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { getState } from "./GetState"

export class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = props.location.state;
        if (this.state === undefined || this.state === null) {
            let date = new Date();
            this.state = getState(date);
        }

        this.getData(this.state.date).then(o => {
            let state = {
                busyDays: o
            };
            this.setState(state);
        });

        document.title = `${moment(this.state.date).format("MMMM YYYY")} - Calendar`
    }

    async getData(date) {
        console.a = date;
        const response = await fetch(`api/GetBusyDays?year=${date.getFullYear()}&month=${date.getMonth() + 1}`);
        const data = await response.json();
        return data;
    }

    previousMonth() {
        let date = moment(this.state.date).add(-1, 'months').toDate();
        this.getData(date).then(o => {
            let state = getState(date);
            state.busyDays = o;
            this.setState(state);
        });
        document.title = `${moment(date).format("MMMM YYYY")} - Calendar`
    }

    nextMonth() {
        let date = moment(this.state.date).add(1, 'months').toDate();
        this.getData(date).then(o => {
            let state = getState(date);
            state.busyDays = o;
            this.setState(state);
        });
        document.title = `${moment(date).format("MMMM YYYY")} - Calendar`
    }

    getDayRoute(day) {
        let date = moment(this.state.date).set("date", day).toDate();
        let state = getState(date);

        return { pathname: "day", state: state };
    }

    calendarContent() {
        let rows = [];
        for (let i = 0; i < 6; i++) {
            let columns = [];
            for (let j = 0; j < 7; j++) {
                let inx = i * 7 + j;
                let day = inx - this.state.offset - 6;
                let tileClass = `hyperlink calendar-day
                                ${inx % 7 == 6 ? "calendar-day-sun" : ""}
                                ${this.state.busyDays.find(o => o === day) > 0 && day != this.state.today ? "calendar-day-busy" : ""}
                                ${day > 0 && day == this.state.today ? "calendar-day-today" : ""}`

                let tile = inx >= this.state.offset + 7 && inx < this.state.offset + this.state.days + 7 ?
                    <Link to={this.getDayRoute(day)} className={tileClass}>
                        <div className="text-chonk">
                            {day}
                        </div>
                    </Link>
                    : null;

                columns.push(
                    <div key={j} className="col">
                        {tile}
                    </div>
                );
            }

            rows.push(
                <div key={i} className="row">
                    {columns}
                </div>
            );
        }

        return rows;
    }

    render() {
        return (
            <div>
                <div className="row headerbar text-chonker">
                    <a className="col hyperlink" href="javascript:undefined" onClick={this.previousMonth.bind(this)}>
                        <div className="text-left">
                            {"<"}
                        </div>
                    </a>
                    <div className="col-8">
                        <div className="text-center">
                            {moment(this.state.date).format('MMMM YYYY')}
                        </div>
                    </div>
                    <a className="col hyperlink" href="javascript:undefined" onClick={this.nextMonth.bind(this)}>
                        <div className="text-right">
                            {">"}
                        </div>
                    </a>
                </div>

                <div className="row text-chonk">
                    <div className="col">Mon</div>
                    <div className="col">Tue</div>
                    <div className="col">Wed</div>
                    <div className="col">Thu</div>
                    <div className="col">Fri</div>
                    <div className="col">Sat</div>
                    <div className="col calendar-day-sun">Sun</div>
                </div>

                {this.calendarContent()}
            </div>
        );
    }
}