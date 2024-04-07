# Strength Stuδi/o (strength)

A training tool

Strength Stuδi/o is an Open Source Strength Training App.
It is a mobile first Progressive Web Application written mostly in TypeScript using Vue and the Quasar Framework. 

![Screenshot_20240407-184356_Chrome](https://github.com/empirical-dan/strength/assets/52764820/a1546f41-6174-4093-83a9-3f1df576d82b)

![Screenshot 2024-04-07 183917](https://github.com/empirical-dan/strength/assets/52764820/c7fa2d98-b904-401b-b4ad-85ab32507705)

Strength Stuδi/o's design philosophy is to put the user experience foremost. It is a Strength Training App which is easy to use and has functionality beyond primarily commercial apps. The focus is on facilitating strength training using up to date methods such as percentage max and rate of perceived exertion (RPE). The app is aimed at trainees and trainers who would benefit from documenting their workouts in a logical and structured way i.e. almost everyone.

There are many commercial fitness apps. Strength Stuδi/o has the benefit of not needing to focus on selling a particular product or service. 

Other Open Source strength and conditioning style apps do exist. Strength Stuδi/o welcomes collaboration and others are free to use Strength Stuδi/o's code.

# RPE training

Rate of perceived exertion (RPE) training has been used extensively by Strength Stuδi/o's contributors. Rather than rely on relatively simplistic linear models, such as the Epsley formula, Strength Stuδi/o utlises a unique log-linear algorithm for calculating 1 rep max based on real data analysed using R. This is consistent with recently published data: https://doi.org/10.1007/s40279-023-01937-7




## Install the dependencies
```bash
yarn
# or
npm install
```


### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
