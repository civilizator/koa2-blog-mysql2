const router = require('koa-router')();
const controller = require('../controller/c-posts')

// Reset to article page
router.get('/', controller.getRedirectPosts)

// Article page
router.get('/posts', controller.getPosts)

// Home page, 10 output each time
router.post('/posts/page', controller.postPostsPage)

// Personal article pagination, output 10 each time
router.post('/posts/self/page', controller.postSelfPage)

// Single article page
router.get('/posts/:postId', controller.getSinglePosts)

// Publish article page
router.get('/create', controller.getCreate)

// post publish an article
router.post('/create', controller.postCreate)

// Comment
router.post('/:postId', controller.postComment)

// Edit a single article page
router.get('/posts/:postId/edit', controller.getEditPage)

// post Edit a single article
router.post('/posts/:postId/edit', controller.postEditPage)

// Delete a single article
router.post('/posts/:postId/remove', controller.postDeletePost)

// Delete comment
router.post('/posts/:postId/comment/:commentId/remove', controller.postDeleteComment)

// Comment page
router.post('/posts/:postId/commentPage', controller.postCommentPage)


module.exports = router
