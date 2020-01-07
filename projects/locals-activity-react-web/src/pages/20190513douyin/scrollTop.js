export const scrollTop = (number = 0, time) => {
    if (!time) {
        document.body.scrollTop = document.documentElement.scrollTop = number;
        return number;
    }
};
