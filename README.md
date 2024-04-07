# Strength Stuδi/o

A training tool

Strength Stuδi/o is an Open Source Strength Training App.
It is a mobile first Progressive Web Application written mostly in TypeScript using Vue and the Quasar Framework. 

![Screenshot_20240407-184356_Chrome](https://github.com/empirical-dan/strength/assets/52764820/a1546f41-6174-4093-83a9-3f1df576d82b)

![Screenshot 2024-04-07 183917](https://github.com/empirical-dan/strength/assets/52764820/c7fa2d98-b904-401b-b4ad-85ab32507705)

Strength Stuδi/o's design philosophy is to put the User eXperience first and foremost. It is a Strength Training App which is easy to use and has functionality beyond primarily commercial apps. The focus is on facilitating strength training using up to date methods such as percentage max and rate of perceived exertion (RPE). The app is aimed at trainees and trainers who would benefit from documenting their workouts in a logical and structured way i.e. almost everyone. Strength Stuδi/o prioritises usability and utility whilst it continues to evolve into a tool that is as funcitonal as the most advanced spreadsheet and beyond. 

There are many commercial fitness apps. Strength Stuδi/o has the benefit of not needing to focus on selling a particular product or service. 

Other Open Source strength and conditioning style apps do exist. Strength Stuδi/o welcomes collaboration and others are free to use Strength Stuδi/o's code to enhance their projects. Strength Stuδi/o welcomes contributions and suggestions from everyone. You are the community.


# RPE Training

Rate of perceived exertion (RPE) training has been used extensively by Strength Stuδi/o's contributors. Rather than rely on relatively simplistic linear models, such as the Epsley formula, Strength Stuδi/o utlises a unique log-linear algorithm for calculating 1 rep max based on real data analysed using R. This is consistent with recently published data: https://doi.org/10.1007/s40279-023-01937-7


# Web Technology

Front end:
Strength Stuδi/o was initially developed mainly using TypeScript with Vue 3, the Quasar Framework and Material icons/symbols. This choice was based on the level reactivity that is desirable for a mobile first web UI/UX. TypeScript was chosen to make it easier to write less error-prone code, especially in a collaborative environment. The initial code base was developed using Vue 3 Composition API as it appeared to promote readability and be likely to have long-term support by Vue. Pinia setup stores were also incorporated into the early code base which are similar in structure to Vue Composition API. Form validation for the Registration Page was implemented inside the Vue component using Quasar's built-in validation facilities in conjunction with a simple validation composable. Validation of workout data is implemented inside the Pinia stores e.g. the Sets store. A separate validation library was considered but custom validation was favoured over relying on another library that would need to be customised anyway for the specifics of strength training data.

Back end:
A back end framework with a RESTful API such as Python Django Ninja was considered at the outset of the project. The initial vision was to achieve as much separation as possible between models and views and to use an Object Relational Model rather than interacting with a relational database directly. The early code was based on a desktop GUI developed developed in Qt for Python that uses an SQL database (SQLite/PostgreSQL). It was found that Vue 3 and TypeScript make it quite possible to separate the logic in code well. Also, Backend as a Service facilites (specifically Supabase) appeared to be relatively mature and cheap/free for the amount of usage at the time (early 2024). Developing a separate RESTful API would have been an additional barrier to producing a working prototype. Supabase provides a useful JavaScript/TypeScript API and developing a separate RESTful API may not add much.


# How to use Strength Stuδi/o
Please try out Strength Stuδi/o by following the link to the website: https://strength-seven.vercel.app
This will be connected to a test database prior to the first production release. Strength Stuδi/o will make every effort to migrate any data safely to the production database but are unable to guarantee that all data will remain intact. Whilst every effort will be made, Strength Stuδi/o cannot guarantee the privacy of data that is entered so please don't enter any sensitive data.

You can also download your own copy of Strength Stuδi/o from this repository to try out. It is recommended to follow the most up to date installation instructions for installing the Quasar CLI which are well documented on the website: https://quasar.dev/start/quasar-cli

You will also either need to connect to your own supabase instance or ask one of the Strength Stuδi/o developers for the URL and anon key. 


# How to contribute
Strength Stuδi/o welcomes contributions from all and aspires to be a thriving community project. Please contribute comments, suggestions and code but please aim to always be open, friendly and respecteful to everyone. Strength Stuδi/o's primary philosphy is to grow and become more usable over time. This is open to interpretation and involves making difficult and sometimes relatively arbitrary decisions that will not always please everyone. Please don't take this personally.

# 


![Screenshot 2024-04-07 213025](https://github.com/empirical-dan/strength/assets/52764820/b2778611-76fc-4002-9baa-42f8a57584e6)

![Screenshot 2024-04-07 213231](https://github.com/empirical-dan/strength/assets/52764820/b0d57d6c-cc0f-40a3-a8b2-0fb00675e949)

![Screenshot 2024-04-07 213231](https://github.com/empirical-dan/strength/assets/52764820/c2979dc8-28db-4073-983d-0b1d782339e6)


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
