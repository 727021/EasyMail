# EasyMail

A simple wrapper for nodemailer and SendGrid

## Usage

```javascript
require('dotenv').config()
const { SENDGRID_KEY, SENDGRID_FROM } = process.env
const Mail = require('@_727021/easymail')('templates', SENDGRID_FROM, SENDGRID_KEY)

const message = new Mail(
    'to@example.com',
    'Subject',
    {
        msg: 'This is an example email.'
    },
    'template.ejs'
)
```

### With a Callback Function

```javascript
message.send((err, html) => {
    if (err) return console.error(err)
    console.log('Email Sent!')
})
```

### With a Promise

```javascript
message.send()
       .then(html => {
           console.log('Email Sent!')
       })
       .catch(err => console.error(err))
```

### With Async/Await

```javascript
;(async () => {
    try {
        const html = await message.send()
        console.log('Email Sent!')
    } catch (err) {
        console.error(err)
    }
})()
```