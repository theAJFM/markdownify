#!/usr/bin/env node

const puppeteer = require('puppeteer')
const yargs = require('yargs')
const { Readability } = require('@mozilla/readability')
const JSDOM = require('jsdom').JSDOM
const turndown = require('turndown')
const turndownService = new turndown()
const fs = require('fs')
const ora = require('ora')
const chalk = require('chalk');
const defaultDirectory = process.env.MARKDOWNIFY_DIR || process.env.HOME

const spinner = ora();

yargs
    .scriptName('markdownify')
    .showHelpOnFail(true)
    .command('convert [urls...]', 'Convert url(s) to markdown', (args) => {
        args.positional('urls', {
            type: 'array',
            describe: 'the urls to be converted'
        })
    }, async (argv) => {
        if (argv.urls.length == 0) {
            console.error('No url(s) supplied')
            yargs.showHelp()
        } else {
            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            if (argv['js-disabled']) {
                await page.setJavaScriptEnabled(false)
            }
            for (const url of argv.urls) {
                spinner.start(`Generating markdown from ${url}`);
                await page.goto(url, { waitUntil: 'networkidle0' })
                try {
                    const data = await page.evaluate(() => document.querySelector('*').outerHTML)
                    const doc = new JSDOM(data, { url: url })
                    const reader = new Readability(doc.window.document)
                    const readerDoc = reader.parse()
                    let markdownData = `*[View Original](${url})*\n\n` + turndownService.turndown(readerDoc.content)
                    if (argv.tags) {
                        const tagsList = argv.tags.split(',')
                        const hashtags = tagsList.map((a) => `#${a}`)
                        markdownData = hashtags.join(' ') + '\n\n' + markdownData
                    }
                    const filename = readerDoc.title != '' && readerDoc.title != null ? readerDoc.title : Date.now()
                    try {
                        writeMarkdown(`${defaultDirectory}/${filename}.md`, markdownData, url)
                    } catch (fe) {
                        spinner.warn(`${chalk.yellow('Filename is invalid, using timestamp as a fallback filename.')}`)
                        writeMarkdown(`${defaultDirectory}/${Date.now()}.md`, markdownData, url)
                    }
                } catch (e) {
                    const errorMessage = chalk.red(`Error extracting markdown from ${url}`);
                    spinner.fail(errorMessage)
                    console.error(e);
                }
            }
            await browser.close()
        }
    })
    .options({
        'tags' : {
            alias: 't',
            type: 'string',
            description: 'Add tags to markdown',
        },
        'js-disabled': {
            alias: 'j',
            type: 'boolean',
            description: 'Disable javascript on page',
        }
    })
    .help()
    .alias('help', 'h')
    .demandCommand()
    .argv

function writeMarkdown(dir, data, url) {
    fs.writeFileSync(dir, data)
    const successMessage = chalk.green(`${dir} has been created for the url: ${url}.`);
    spinner.succeed(successMessage,)
}