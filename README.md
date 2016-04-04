# Gulp experiment starter kit
---

Starter made to experiment some great stuff in css, javascript and html !

## Getting started
---

```
npm install
```

`bower install` will be executed automatically after any `npm install` call

### Configure your project
---

Configure your project paths with the __PATH AND FILES VARIABLES__ from
`gulpfile.js`

### Adding library dependencies
---

Using bower, use :

```
bower install jquery --save
```

`gulp inject` task will be executed automatocally after any `bower install`
call. This task basically add each dependancy to your FILES.inject
files (cf. *__Configure your project__*).

## Usage
---

### Global syntax requirements
---

- All CSS classes used in javascript must be prefixed by `js-` to pass through
UnCSS Gulp task

### Development
---

Run `gulp`

This command will be enough to start a server from your src folder. It will
watch each scss, js and images files to work like a boss with BrowserSync.

### Production
---

```gulp build```

This command will build your project in the build folder specified in the config
of `gulpfile.js`

You can then run `gulp serve --env=prod` to run a server from the build
directory in order to see the result of your awesome work.