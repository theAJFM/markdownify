<div align="center">

![markdownify](./logo.png)
## Markdownify
Simple app to extract markdown files out of web pages, given a list of urls.
</div>

## Getting Started
### Installing Dependencies
To use the application, install the dependencies first via your preferred package manager.
#### NPM
```bash
$ npm install
```
#### Yarn
```bash
$ yarn install
```

### Installing the App as a CLI
#### NPM
```bash
$ npm install -g .
```
#### Yarn
```bash
$ yarn global add file:$PWD
```

### Setup output directory
By default, the markdown files will be put inside your `$HOME` directory. If you want to modify it, just set the following environment variable in your terminal's profile:
```bash
$ export MARKDOWNIFY_DIR='<preferred directory>'
```
## Description
```
Commands:
  markdownify convert [urls...]  Convert url(s) to markdown
```
To extract markdown files, use the `convert` command and pass url(s) as the command argument like so:
```bash
markdownify convert http://example.com/
```

## Options
```bash
Options:
      --version  Show version number                                   [boolean]
  -t, --tags     Add tags to markdown                                   [string]
  -h, --help     Show help                                             [boolean]
```