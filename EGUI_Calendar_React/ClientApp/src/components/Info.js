import React, { Component } from 'react'

export class Info extends Component {
    constructor(props) {
        super(props);

        document.title = `Info - Calendar`;
    }
    render() {
        return (
            <div>
                <div className="row headerbar text-chonker">
                    <div className="col">
                        {"Calendar in React with .NET Core"}
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="col">
                        {"This is a Calendar program for the Graphical User Interfaces (EGUI) course 2020L, Project no. 3."}<br />
                        {"Made by Kacper Wojakowski, 293064 in React with a .NET Core backend."}
                    </div>
                </div>
            </div>
        );
    }
}