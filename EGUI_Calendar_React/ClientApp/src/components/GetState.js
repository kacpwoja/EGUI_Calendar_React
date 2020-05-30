import React, { Component } from 'react';
import moment from 'moment';

export var getState = function(date) {
    let today = new Date();

    return {
        date: date,
        days: moment(date).daysInMonth(),
        offset: moment(date).startOf('month').day() - 1,
        today: today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() ? today.getDate() : 0,
        busyDays: []
    };
}