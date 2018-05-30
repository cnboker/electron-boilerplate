module.exports = function () {
    const storedToken = localStorage.getItem('token')
    // if it exists
    if (storedToken) {
        // parse it down into an object
        const token = JSON.parse(storedToken)
        return token;
    }
    return null;
}