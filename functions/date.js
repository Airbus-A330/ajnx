const _month = () => {
    let monthObj = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
    };

    return new Date()
        .getMonth()
        .toString()
        .replace(
            new Date().getMonth().toString(),
            monthObj[new Date().getMonth().toString()],
        );
};

module.exports = () => {
    return `${_month()} ${new Date().getDate()}, ${new Date(new Date().getTime()).toLocaleTimeString("en-US")}`;
};
