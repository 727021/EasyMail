require('dotenv').config()
const { SENDGRID_KEY, SENDGRID_FROM, TEST_EMAIL } = process.env
const Mail = require('./index')('templates', SENDGRID_FROM, SENDGRID_KEY)

const testMail = new Mail(
    TEST_EMAIL,
    'Test Email',
    {
        msg: 'This is a test email.',
    },
    'test'
)

;(async () => {
    try {
        await testMail.send()
        console.log('Email Sent')
    } catch (error) {
        console.error(error)
    }
})()
