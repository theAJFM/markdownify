# Markdownify

Simple app to extract markdown files out of pages, given a list of urls.

## Getting Started
### Installing Dependencies
To use the application, install the dependencies first via your preferred package manager.
#### NPM
```
$ npm install
```
#### Yarn
```
$ yarn install
```

### Installing the App as a CLI
#### NPM
```
$ npm install -g .
```
#### Yarn
```
$ yarn global add file:$PWD
```

### Setup output directory
By default, the markdown files will be put inside your `$HOME` directory. If you want to modify it, just set the following environment variable in your terminal's profile:
```
$ export MARKDOWNIFY_DIR='<preferred directory>'
```
## Description
```
Commands:
  markdownify convert [urls...]  Convert url(s) to markdown
```
To extract markdown files, use the `convert` command and pass url(s) as the command argument like so:
```
markdownify convert http://example.com/
```

## Options
```
Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```