#!/usr/bin/env node

const puppeteer = require('puppeteer')
const yargs = require('yargs')
const { Readability } = require('@mozilla/readability')
const JSDOM = require('jsdom').JSDOM
const turndown = require('turndown')
const turndownService = new turndown()
const fs = require('fs')
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
                    let reader = new Readability(doc.window.document)
                    let readerDoc = reader.parse()
                    fs.writeFileSync(`${defaultDirectory}/${readerDoc.title}.md`, turndownService.turndown(readerDoc.content))
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
