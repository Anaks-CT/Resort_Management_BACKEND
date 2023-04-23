"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateInRange = void 0;
const getDateInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
    const date = new Date(start.getTime());
    const dates = [];
    while (date <= end) {
        dates.push(new Date(date.getTime()));
        date.setDate(date.getDate() + 1);
    }
    return dates;
};
exports.getDateInRange = getDateInRange;
