module.exports = {

    // Already logged in
    checkNotLogin: (ctx) => {
        if (ctx.session && ctx.session.user) {
            ctx.redirect('/posts')
            return false
        }
        return true
    },

    //Not logged in
    checkLogin: (ctx) => {
        if (!ctx.session || !ctx.session.user) {
            ctx.redirect('/signin')
            return false
        }
        console.log("Hey " + JSON.stringify(ctx.session))
        return true
    }
}
