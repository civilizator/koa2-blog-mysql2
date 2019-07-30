const mysql = require('mysql2');
const config = require('../config/default.js')

let pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
})

let query = (sql, values) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })

}

// let query = function( sql, values ) {
// pool.getConnection(function(err, connection) {
//   // Use connection
//   connection.query( sql,values, function(err, rows) {
//     // Execute a query using a connection
//     console.log(rows)
//     connection.release();
//     //The connection is no longer used, returning to the connection pool
//   });
// });
// }

let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT 'Username',
     pass VARCHAR(100) NOT NULL COMMENT 'Password',
     avator VARCHAR(100) NOT NULL COMMENT 'Avatar',
     moment VARCHAR(100) NOT NULL COMMENT 'Registration time',
     PRIMARY KEY ( id )
    );`

let posts =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT 'Article author',
     title TEXT(0) NOT NULL COMMENT 'Comment topic',
     content TEXT(0) NOT NULL COMMENT 'Comments',
     md TEXT(0) NOT NULL COMMENT 'Markdown',
     uid VARCHAR(40) NOT NULL COMMENT 'User id',
     moment VARCHAR(100) NOT NULL COMMENT 'Issuing time',
     comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT 'Article comments',
     pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT 'Pageviews',
     avator VARCHAR(100) NOT NULL COMMENT 'Profile picture',
     PRIMARY KEY(id)
    );`

let comment =
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT 'User name',
     content TEXT(0) NOT NULL COMMENT 'Comments',
     moment VARCHAR(40) NOT NULL COMMENT 'Comment time',
     postid VARCHAR(40) NOT NULL COMMENT 'Article id',
     avator VARCHAR(100) NOT NULL COMMENT 'Profile picture',
     PRIMARY KEY(id) 
    );`

let createTable = (sql) => {
    return query(sql, [])
}

// Building a table
createTable(users)
createTable(posts)
createTable(comment)

// Registered user
exports.insertData = (value) => {
    let _sql = "insert into users set name=?,pass=?,avator=?,moment=?;"
    return query(_sql, value)
}

// Delete users
exports.deleteUserData = (name) => {
    let _sql = `delete from users where name="${name}";`
    return query(_sql)
}

// Find users
exports.findUserData = (name) => {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}

// Publish an article
exports.insertPost = (value) => {
    let _sql = "insert into posts set name=?,title=?,content=?,md=?,uid=?,moment=?,avator=?;"
    return query(_sql, value)
}

// Increase the number of article comments
exports.addPostCommentCount = (value) => {
    let _sql = "update posts set comments = comments + 1 where id=?"
    return query(_sql, value)
}

// Reduce the number of article comments
exports.reducePostCommentCount = (value) => {
    let _sql = "update posts set comments = comments - 1 where id=?"
    return query(_sql, value)
}

// Update views
exports.updatePostPv = (value) => {
    let _sql = "update posts set pv= pv + 1 where id=?"
    return query(_sql, value)
}

// Comment
exports.insertComment = (value) => {
    let _sql = "insert into comment set name=?,content=?,moment=?,postid=?,avator=?;"
    return query(_sql, value)
}

// Find users by name
exports.findDataByName = (name) => {
    let _sql = `select * from users where name="${name}";`
    return query(_sql)
}

// Find the number of users by name to determine whether it already exists.
exports.findDataCountByName = (name) => {
    let _sql = `select count(*) as count from users where name="${name}";`
    return query(_sql)
}

// Find users by their name
exports.findDataByUser = (name) => {
    let _sql = `select * from posts where name="${name}";`
    return query(_sql)
}

// Find by article id
exports.findDataById = (id) => {
    let _sql = `select * from posts where id="${id}";`
    return query(_sql)
}

// Find by article id
exports.findCommentById = (id) => {
    let _sql = `select * from comment where postid="${id}";`
    return query(_sql)
}

// Find the number of comments by article id
exports.findCommentCountById = (id) => {
    let _sql = `select count(*) as count from comment where postid="${id}";`
    return query(_sql)
}

// Find by comment id
exports.findComment = (id) => {
    let _sql = `select * from comment where id="${id}";`
    return query(_sql)
}

// Query all articles
exports.findAllPost = () => {
    let _sql = `select * from posts;`
    return query(_sql)
}

// Query the number of all articles
exports.findAllPostCount = () => {
    let _sql = `select count(*) as count from posts;`
    return query(_sql)
}

// Query pagination articles
exports.findPostByPage = (page) => {
    let _sql = ` select * from posts limit ${(page - 1) * 10},10;`
    return query(_sql)
}

// Query the number of all individual user articles
exports.findPostCountByName = (name) => {
    let _sql = `select count(*) as count from posts where name="${name}";`
    return query(_sql)
}

// Query personal pagination articles
exports.findPostByUserPage = (name, page) => {
    let _sql = ` select * from posts where name="${name}" order by id desc limit ${(page - 1) * 10},10 ;`
    return query(_sql)
}

// Update and modify the article
exports.updatePost = (values) => {
    let _sql = `update posts set title=?,content=?,md=? where id=?`
    return query(_sql, values)
}

// Delete article
exports.deletePost = (id) => {
    let _sql = `delete from posts where id = ${id}`
    return query(_sql)
}

// Delete comment
exports.deleteComment = (id) => {
    let _sql = `delete from comment where id=${id}`
    return query(_sql)
}

// Delete all comments
exports.deleteAllPostComment = (id) => {
    let _sql = `delete from comment where postid=${id}`
    return query(_sql)
}

// Scroll infinitely loading data
exports.findPageById = (page) => {
    let _sql = `select * from posts limit ${(page - 1) * 5},5;`
    return query(_sql)
}

// Comment page
exports.findCommentByPage = (page, postId) => {
    let _sql = `select * from comment where postid=${postId} order by id desc limit ${(page - 1) * 10},10;`
    return query(_sql)
}
