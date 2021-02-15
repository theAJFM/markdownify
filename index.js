#!/usr/bin/env node

const puppeteer = require('puppeteer')
const yargs = require('yargs')
const { Readability } = require('@mozilla/readability')
const JSDOM = require('jsdom').JSDOM
const turndown = require('turndown')
const turndownService = new turndown()
const fs = require('fs')
const path = require('path')
const defaultDirectory = process.env.MARKDOWNIFY_DIR || process.env.HOME

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
            const page = await browser.newPage();
            for (const url of argv.urls) {
                await page.goto(url, { waitUntil: 'networkidle0' })
                try {
                    const data = await page.evaluate(() => document.querySelector('*').outerHTML);
                    const doc = new JSDOM(data, {url: url})
                    const reader = new Readability(doc.window.document)
                    const readerDoc = reader.parse()
                    const markdownData = turndownService.turndown(readerDoc.content)
                    const filename = readerDoc.title != '' && readerDoc.title != null ? readerDoc.title : Date.now()
                    try {
                        writeMarkdown(`${defaultDirectory}/${filename}.md`, markdownData, url)
                    } catch(fe) {
                        console.warn("Filename is invalid, using timestamp as a fallback filename.")
                        writeMarkdown(`${defaultDirectory}/${Date.now()}.md`, markdownData, url)
                    }
                } catch(e) {
                    console.error(`Error extracting markdown from ${url}`, e)
                }
            }
            await browser.close()
        }
    })
    .help()
    .alias('help', 'h')
    .demandCommand()
    .argv

function writeMarkdown(dir, data, url) {
    fs.writeFileSync(dir, data)
    console.log(`${dir} has been created for the url: ${url}.`)
}
