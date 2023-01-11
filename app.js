//nodemon doesn't work, but node does

const express = require("express");
const app = express();
// const path = require('path')
const morgan = require('morgan')
const postBank = require('./postBank')

app.use(morgan('dev'));

// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'))

app.get("/", (req, res) => {
  const posts = postBank.list(); //get our list of posts (the copy of all the data!)
  //html sent as output to the page
  const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class ='news-position'>${post.id}. ▲</span>
            <a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class='news-info'>
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </body>
    </html>`;
//sending a response
res.send(html)
})

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    res.send(errorHandler)
  }
  const html = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
        <div class='news-item'>
          <p>
            <span class ='news-position'>${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <p>${post.content}</p>
          <small class='news-info'>
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>
      </div>
    </body>
    </html>`;
  res.send(html);
});

const errorHandler = ((err, req, res, next) => {
  console.error(err.stack)
  res.status(404)

  const html = `
  <!DOCTYPE html>
  <html>
  <body>
  We lost you :( Page not found!
  </body>
  </html>`

  res.send(html)
})

app.use(errorHandler);

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
