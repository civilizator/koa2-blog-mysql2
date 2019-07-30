# Koa2-blog
node+koa2+mysql (Welcome star: https://github.com/wclimb/Koa2-blog)

> Latest code is now changing，Please refer to the latest code，Added upload avatar、Pagination、Markdown syntax, etc.


Tutorial [Node+Koa2+Mysql Build a simple blog](http://www.wclimb.site/2017/07/12/Node-Koa2-Mysql-%E6%90%AD%E5%BB%BA%E7%AE%80%E6%98%93%E5%8D%9A%E5%AE%A2/)

### Create a database

Login database
```
$ mysql -u root -p
```
create a database
```
$ create database nodesql;
```
use created database
```
$ use nodesql;
```

> If unable to connect to database, then execute
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345'
```

#### database: nodesql  tables: users posts comment  (lib/mysql)

| users   | posts   | comment   |
| :----:  | :----:  | :----:    |
| id      | id      | id        |
| name    | name    | name      |
| pass    | title   | content   |
| avator  | content | moment    |
| moment  | md      | postid    |
| -       | uid     | avator    |
| -       | moment  | -         |
| -       | comments| -         |    
| -       | pv      | -         |    
| -       | avator  | -         |  


* id: primary key increment
* name: username
* pass: password
* avator: avatar
* title: article title
* content: article content and comments
* md: markdown syntax
* uid: user id of article
* moment: creation time
* comments: article comments
* pv: article views
* postid: article id

```
$ git clone https://github.com/wclimb/Koa2-blog.git
```
```
$ cd Koa2-blog
```
```
$ npm i nodemon
```
or
```
$ npm i supervisor -g
```
> Check "nodemon". If "nodemon" is not recognized then specify path in variable environments. Find out path
```
$ npm config get prefix
```

Install dependencies
```
$ npm i
```
Running server
```
$ nodemon
```
 or
```
$ npm run dev
```
```
$ npm test(Test items)
```
### Demonstration

![](http://www.wclimb.site/cdn/blog1.gif)

### Registered

![](http://www.wclimb.site/cdn/signup1.png)

### Landing

![](http://www.wclimb.site/cdn/signin1.png)

### Publish an article

![](http://www.wclimb.site/cdn/create1.png)

### Article details

![](http://www.wclimb.site/cdn/postcontent1.png)

### Article list

![](http://www.wclimb.site/cdn/posts1.png)

### Personal article pages and normal edits to remove articles and comments

### Personal applet

![img](http://www.wclimb.site/cdn/xcx.jpeg?v=1) 

