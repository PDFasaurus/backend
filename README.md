<p align="center">
  <a href="http://pdfasaurus" target="blank"><img src="https://pdfasaurus.com/assets/logo.png" height="75" alt="PDFasaurus Logo" /></a>
</p>

## Some notes!

- The repos on here only serve as a "code HQ"
- Feel free to submit pull requests
- No dinosaurs were harmed during the making of this software

For any support stuff, send to [support@pdfasaurus.com](mailto:support@pdfasaurus.com)

## Roadmap

- [x] Next bill date gets set from Paddle (not manually generated)
- [x] Image support
- [ ] More tests (when I get some more time)!!!
- [ ] Some pretty predefined templates for PDFs

---

## Build notes

Built with [Nest](https://github.com/nestjs/nest)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

Please see `package.json`, `ormconfig.json` & the `migration` folder. A note, you create migrations using the name as a parameter to the script. Eg.;

```
npm run migration:create "Initial"
```

TypeORM doesn't respect the `-n` migrations argument when using it as an NPM argument (reduces it to `n`, which breaks).
