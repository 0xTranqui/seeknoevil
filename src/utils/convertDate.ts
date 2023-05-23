// @ts-nocheck

export const convertDate = (date) => {
    const dateObj = new Date(date);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj
        .toLocaleDateString("en-US", options)
        .toLowerCase();
    return formattedDate;
};