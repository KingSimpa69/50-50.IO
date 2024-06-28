import moment from "moment";

const timeTill = (seconds) => {
    const duration = moment.duration(seconds, 'seconds');
    const months = duration.months() + duration.years() * 12;
    const weeks = Math.floor(duration.asWeeks());
    const days = duration.days();
    const timeString = moment.utc(duration.asMilliseconds()).format('HH:mm:ss');
    if (months > 0) {
        const grammar = months === 1 ? "Month" : "Months"
        return `${months} ${grammar}`;
    } else if (weeks > 0) {
        const grammar = weeks === 1 ? "Week" : "Weeks"
        return `${weeks} ${grammar}`;
    } else if (days > 0) {
        const grammar = days === 1 ? "Day" : "Days"
        return `${days} ${grammar}`;
    } else {
        return timeString;
    }
}

export default timeTill