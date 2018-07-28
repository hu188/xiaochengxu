export default {
    price(number, suffix = 2) {
        if (number < 0) {
            return '-' + (Number((Math.abs(number)) || 0).toFixed(suffix || 1))
        } else {
            return Number((number) || 0).toFixed(suffix || 1)
        }
    }
}