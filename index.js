const { createTransport } = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { renderFile } = require('ejs')
const { join } = require('path')

let templateDir, SENDGRID_KEY, SENDGRID_FROM

const transporter = createTransport(
    sendgridTransport({
        auth: {
            api_key: SENDGRID_KEY,
        },
    })
)

const renderTemplate = async mail => {
    let html = ''
    try {
        html = await renderFile(
            join(
                templateDir,
                mail.template.endsWith('.ejs')
                    ? mail.template
                    : `${mail.template}.ejs`
            ),
            { ...mail.data, subject: mail.subject, to: mail.to },
            {
                async: true,
                views: templateDir,
            }
        )
        console.log(html)
    } catch (error) {
        console.error(error)
    }
    return html
}

class Mail {
    /**
     * Create a new email to send.
     *
     * Email content can be either plain text or EJS-rendered templates.
     *
     * @param {String|[String]} to An email address or list of email addresses to send to.
     * @param {String} subject The subject of the email.
     * @param {Object|String} data Data to use when rendering the email body from EJS or plaintext email body.
     * @param {String} [template] The EJS template to use in the email body.
     */
    constructor(to, subject, data, template) {
        if (Array.isArray(to)) this.to = to.map(x => x.toString())
        else this.to = to.toString()
        this.subject = subject.toString()
        if (template.toString() === template) {
            // EJS
            if (typeof data === 'object') this.data = { ...data }
            else throw 'data must be an object'
        } else {
            // PlainText
            this.data = data.toString()
        }
        this.data = data
        this.template = template ? template.toString() : template
    }

    /**
     * @callback callbackFunction
     * @param {Error|null} err Error.
     * @param {string} result Sent email body.
     * @returns {void}
     */

    /**
     * Send the email.
     *
     * @param {callbackFunction} [cb] Callback function.
     * @returns {Promise<string>}
     */
    async send(cb) {
        try {
            const html = this.template ? await renderTemplate(this) : this.data
            await transporter.sendMail({
                from: SENDGRID_FROM,
                to: Array.isArray(this.to) ? this.to.join(',') : this.to,
                subject: this.subject,
                html,
            })
            if (cb) cb(null, html)
            return Promise.resolve(html)
        } catch (error) {
            if (cb) cb(error, null)
            return Promise.reject(error)
        }
    }
}

/**
 * Initialize Mail with SendGrid information and views directory
 * @param {string} views Directory containing email ejs templates.
 * @param {string} from Email address to put in the from field (can be formatted: "SenderName <sender&#064;yourdomain.com>").
 * @param {string} api_key SendGrid API Key.
 */
module.exports = (views, from, api_key) => {
    templateDir = views
    SENDGRID_FROM = from
    SENDGRID_KEY = api_key
    return Mail
}
