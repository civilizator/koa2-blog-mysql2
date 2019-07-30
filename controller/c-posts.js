const userModel = require('../lib/mysql.js')
const moment = require('moment')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();

//Reset to article page
exports.getRedirectPosts = async (ctx) => {
    ctx.redirect('/posts')
}

//Article page
exports.getPosts = async (ctx) => {
    let res,
        postCount,
        name = decodeURIComponent(ctx.request.querystring.split('=')[1]);
    if (ctx.request.querystring) {
        await userModel.findPostCountByName(name)
            .then(result => {
                postCount = result[0].count
            })
        await userModel.findPostByUserPage(name, 1)
            .then(result => {
                res = result
            })
        await ctx.render('selfPosts', {
            session: ctx.session,
            posts: res,
            postsPageLength: Math.ceil(postCount / 10),
        })
    } else {
        await userModel.findPostByPage(1)
            .then(result => {
                res = result
            })
        await userModel.findAllPostCount()
            .then(result => {
                postCount = result[0].count
            })
        await ctx.render('posts', {
            session: ctx.session,
            posts: res,
            postsLength: postCount,
            postsPageLength: Math.ceil(postCount / 10),

        })
    }
}

//Home page, 10 output each time
exports.postPostsPage = async (ctx) => {
    let page = ctx.request.body.page;
    await userModel.findPostByPage(page)
        .then(result => {
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
}

//Personal article pagination, output 10 pieces at a time
exports.postSelfPage = async ctx => {
    let data = ctx.request.body
    await userModel.findPostByUserPage(decodeURIComponent(data.name), data.page)
        .then(result => {
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
}
/**
 * Single article page
 */
exports.getSinglePosts = async ctx => {
    let postId = ctx.params.postId,
        count,
        res,
        pageOne;

    await userModel.findDataById(postId)
        .then(result => {
            res = result
        })

    await userModel.updatePostPv(postId)

    await userModel.findCommentByPage(1, postId)
        .then(result => {
            pageOne = result
        })

    await userModel.findCommentCountById(postId)
        .then(result => {
            count = result[0].count
        })

    await ctx.render('sPost', {
        session: ctx.session,
        posts: res[0],
        commentLength: count,
        commentPageLength: Math.ceil(count / 10),
        pageOne: pageOne
    })
}

//Publish article page
exports.getCreate = async (ctx) => {
    await checkLogin(ctx)
    await ctx.render('create', {
        session: ctx.session,
    })
}

//Publish an article
exports.postCreate = async (ctx) => {

    let {title, content} = ctx.request.body,
        id = ctx.session.id,
        name = ctx.session.user,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        avator

    // Now use markdown without separate escaping
    let newContent = content.replace(/[<">']/g, (target) => {
        return {
            '<': '&lt;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
        }[target]
    })

    let newTitle = title.replace(/[<">']/g, (target) => {
        return {
            '<': '&lt;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
        }[target]
    });

    await userModel.findUserData(ctx.session.user)
        .then(res => {
            avator = res[0]['avator']
        })

    await userModel.insertPost([name, newTitle, md.render(content), content, id, time, avator])
        .then(() => {
            ctx.body = {
                code: 200,
                message: 'Published an article successfully'
            }
        }).catch(() => {
            ctx.body = {
                code: 500,
                message: 'Publishing article failed'
            }
        })
}
/**
 * Comment
 */
exports.postComment = async ctx => {
    let name = ctx.session.user,
        content = ctx.request.body.content,
        postId = ctx.params.postId,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        avator;
    await userModel.findUserData(ctx.session.user)
        .then(res => {
            avator = res[0]['avator']
        })
    await userModel.insertComment([name, md.render(content), time, postId, avator])
    await userModel.addPostCommentCount(postId)
        .then(() => {
            ctx.body = {
                code: 200,
                message: 'Comment successful'
            }
        }).catch(() => {
            ctx.body = {
                code: 500,
                message: 'Comment failed'
            }
        })
}
/**
 * Edit a single article page
 */
exports.getEditPage = async ctx => {
    let name = ctx.session.user,
        postId = ctx.params.postId,
        res;
    await checkLogin(ctx)
    await userModel.findDataById(postId)
        .then(result => {
            res = result[0]
        })
    await ctx.render('edit', {
        session: ctx.session,
        postsContent: res.md,
        postsTitle: res.title
    })

}
/**
 * post Edit a single article
 */
exports.postEditPage = async ctx => {
    let title = ctx.request.body.title,
        content = ctx.request.body.content,
        id = ctx.session.id,
        postId = ctx.params.postId,
        allowEdit = true,
        // Now use markdown without separate escaping
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        }),
        newContent = content.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    await userModel.findDataById(postId)
        .then(res => {
            if (res[0].name != ctx.session.user) {
                allowEdit = false
            } else {
                allowEdit = true
            }
        })
    if (allowEdit) {
        await userModel.updatePost([newTitle, md.render(content), content, postId])
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: 'Successful editing'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: 'Edit failed'
                }
            })
    } else {
        ctx.body = {
            code: 404,
            message: 'No permission'
        }
    }
}
/**
 * Delete a single article
 */
exports.postDeletePost = async ctx => {
    let postId = ctx.params.postId,
        allow;
    await userModel.findDataById(postId)
        .then(res => {
            if (res[0].name != ctx.session.user) {
                allow = false
            } else {
                allow = true
            }
        })
    if (allow) {
        await userModel.deleteAllPostComment(postId)
        await userModel.deletePost(postId)
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: 'Delete article successfully'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: 'Delete article failed'
                }
            })
    } else {
        ctx.body = {
            code: 404,
            message: 'No permission'
        }
    }
}
/**
 * Delete comment
 */
exports.postDeleteComment = async ctx => {
    let postId = ctx.params.postId,
        commentId = ctx.params.commentId,
        allow;
    await userModel.findComment(commentId)
        .then(res => {
            if (res[0].name != ctx.session.user) {
                allow = false
            } else {
                allow = true
            }
        })
    if (allow) {
        await userModel.reducePostCommentCount(postId)
        await userModel.deleteComment(commentId)
            .then(() => {
                ctx.body = {
                    code: 200,
                    message: 'Delete comment successfully'
                }
            }).catch(() => {
                ctx.body = {
                    code: 500,
                    message: 'Delete comment failed'
                }

            })
    } else {
        ctx.body = {
            code: 404,
            message: 'No permission'
        }
    }
}
/**
 * Comment page
 */
exports.postCommentPage = async function (ctx) {
    let postId = ctx.params.postId,
        page = ctx.request.body.page;
    await userModel.findCommentByPage(page, postId)
        .then(res => {
            ctx.body = res
        }).catch(() => {
            ctx.body = 'error'
        })
}