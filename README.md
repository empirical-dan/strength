# Strength Stuδi/o

A training tool

Strength Stuδi/o is an Open Source Strength Training App.
It is a mobile first Progressive Web Application written mostly in TypeScript using Vue and the Quasar Framework. 

![Screenshot_20240407-184356_Chrome](https://github.com/empirical-dan/strength/assets/52764820/a1546f41-6174-4093-83a9-3f1df576d82b)

![Screenshot 2024-04-07 183917](https://github.com/empirical-dan/strength/assets/52764820/c7fa2d98-b904-401b-b4ad-85ab32507705)

Strength Stuδi/o's design philosophy is to put the User eXperience first and foremost. It is a Strength Training App which is easy to use and has functionality beyond primarily commercial apps. The focus is on facilitating strength training using up to date methods such as percentage max and rate of perceived exertion (RPE). The app is aimed at trainees and trainers who would benefit from documenting their workouts in a logical and structured way i.e. almost everyone. Strength Stuδi/o prioritises usability and utility whilst it continues to evolve into a tool that is as funcitonal as the most customised spreadsheet and beyond. 

There are many commercial fitness apps. Strength Stuδi/o benefits from not being reliant on selling a particular product or service. Its purpose is for the greater good as well as the learning and other positive experiences garnered by those involved in its community.  

Strength Stuδi/o welcomes collaboration with any other developers and projects in the Open Source strength and fitness domain. Others are free to benefit from Strength Stuδi/o's code and knowledge base to enhance their projects. Strength Stuδi/o welcomes contributions and suggestions from everyone. You are the community.

# User eXperience

Strength Stuδi/o is designed to put the ease, accuracy and efficiency of adding real workout records at the centre of the User eXperience. It was initially designed in parallel with a native desktop GUI that went through months of testing by recording and planning real workouts that would be typical for Strength Stuδi/o's target audience. 

# Data Driven

Strength Stuδi/o is driven by the utility of easily documenting, recalling and analysing workout data that is beneficial to the user. It provides a platform to both input and consume valuable data such as a comprehensive and precise history of each specific exercise. 

For example, Strength Stuδi/o has a sound scientific basis for predicting and recording workout metrics for both percentage and RPE based training simultaneously:
Strength training is often programmed by percentage of maximum lifts e.g. "perform 5 squats at 75% of your 1 repitition max". Often, it is useful to estimate maximum lifts (estimated 1 rep max, e1RM) as it may not be practical or desirable to test every exercise to maximum on a frequent basis. Typically, linear models such as the Brzycki or Epley formulae are used to calculate e1RM. Strength Stuδi/o utlises a log-linear algorithm for calculating 1 rep max based on real data analysed using R. This is consistent with recently published data: https://doi.org/10.1007/s40279-023-01937-7.
More recently, refinement of the Rate of Perceived Exertion (RPE) scale has been used extensively in strength and conditioning training. The modern definition in this context is that RPE 8 (out of 10) means that you could have performed two more repetitions. RPE is at the heart of Strength Stuδi/o's User Interface although it is not mandatory to use it. 

# Web Technology

Front end:
Strength Stuδi/o was initially developed mainly using TypeScript with Vue 3, the Quasar Framework and Material Design icons by Google. This choice was based on the level reactivity that is desirable for a mobile first web UI/UX. TypeScript was chosen to make it easier to write less error-prone code, especially in a collaborative environment. The initial code base was developed using Vue 3 Composition API to promote readability with likely long-term support by Vue. Pinia setup stores were also incorporated into the early code base which are similar in structure to Vue Composition API. Form validation for the Registration Page was implemented inside the Vue component using Quasar's built-in validation facilities in conjunction with a simple validation composable. Validation of workout data is implemented inside the Pinia stores e.g. the Sets store. A separate validation library was considered but custom validation was favoured over relying on another library that would need to be customised anyway for the specifics of strength training data.

Back end:
A back end framework with a RESTful API such as Python Django Ninja was considered at the outset of the project. The initial vision was to achieve as much separation as possible between models and views and to use an Object Relational Model (ORM) rather than interacting with a relational database directly. The early code was based on a desktop GUI developed in Qt for Python that uses an SQL database (SQLite/PostgreSQL). It was found that Vue 3 and TypeScript make it quite possible to separate the logic in code well. Also, Backend as a Service facilites (specifically Supabase which uses Postgres) appeared to be relatively mature and cheap/free for the amount of usage at the time (early 2024). Developing a separate RESTful API would have been an additional barrier to producing a working prototype. Supabase provides a useful JavaScript/TypeScript API and developing a separate RESTful API with an ORM may not add much.

The structure of the data is highly relational. The smallest unit is the Set and a collection of Sets belong to an Exercise that is performed during a particular Workout. Exercises may be repeated as part of different Workouts. Exercises can have different modifiers that can be applied to customise them. Exercises are also members of particular categories/classifications. There is some natural overlap when classifying exercises either using distinct names or by decorating more basic movements with modifiers. For example, should you just have a general "Raise" Exercise (under the bodybuilding category) and frequently apply modifiers such as "Front", "Lateral" and "Calf". This may be the more generalisable approach. However, "Lateral Raise" is such a commonly performed exercise in some circles that it may be easier for users to give it its own exercise designation rather than always having to apply modifiers. Do you build this in as standard and do you allow individuals to customise the settings or let the direction be driven by the majority of users? The initial relational structure was developed on the back of experience using SQL for mining of large biological datasets. The data structures continue to evolve to provide the best possible foundation for the UI. For example, database RPE lookup tables were replaced with a (probably more accurate) formula that can easily be implemented in the front end without querying the back end at all.       


# How to use Strength Stuδi/o
Please try out Strength Stuδi/o by following the link to the website: https://strength-seven.vercel.app
This will be connected to a test database prior to the first production release. Strength Stuδi/o will make every effort to migrate any data safely to the production database but are unable to guarantee that all data will remain intact. Whilst every effort will be made, Strength Stuδi/o cannot guarantee the privacy of data that is entered so please don't enter any sensitive data.

You can also download your own copy of Strength Stuδi/o from this repository to try out. It is recommended to follow the most up to date installation instructions for installing the Quasar CLI which are well documented on the website: https://quasar.dev/start/quasar-cli

You will also either need to connect to your own supabase instance or ask one of the Strength Stuδi/o developers for the URL and anon key. 


# How to participate
Strength Stuδi/o welcomes contributions from all and aspires to be a thriving community project. Please contribute comments, suggestions and code via GitHub but please aim to always be open, friendly and respecteful to everyone. Strength Stuδi/o's primary philosphy is to grow and become more usable over time. This is open to interpretation and involves making difficult and sometimes relatively arbitrary decisions that will not always please everyone. Please don't take this personally. Participation is a form of collaborative appreciation.
Strength Stuδi/o is seeking developers to help maintain the project. It was started as a solo hobby project with aims for the greater good. Any future sponsorship would be spent exclusively on developing Strength Strength Stuδi/o - please contact danhornan@gmail.com for details.


# Todos/Wishlist
Basic workout documenting:
- Calendar (open/copy/save/new workout)
- Add Exercise
- Add modifiers
- Exercise history, particularly facility to add sets from history
- Exercise planner i.e. working sets based on particular number of reps and RPE/percentage

Login/Registration
- Basic forgot/reset password 

Biometrics
- Graphs and/or tables of progress in estimated maxes/real maxes/training load
- Recording and visualisation of other biometrics such as body weight and VO2 max

Training block planning
- Facility to plan more than one workout at a time i.e. a series of workouts
- Custom training blocks
- Assisted planning e.g. basic periodisation and/or templates without being too prescriptive

Import/export
- Facility to import/export to spreadsheets

Basic desktop GUI illustration:

![Screenshot 2024-04-07 213025](https://github.com/empirical-dan/strength/assets/52764820/b2778611-76fc-4002-9baa-42f8a57584e6)
![Screenshot 2024-04-07 213231](https://github.com/empirical-dan/strength/assets/52764820/b0d57d6c-cc0f-40a3-a8b2-0fb00675e949)
![Screenshot 2024-04-07 213335](https://github.com/empirical-dan/strength/assets/52764820/c6e8de00-0834-49b4-8d3a-bb3278a3294f)

Example of desktop GUI New Exercise menu:
https://github.com/empirical-dan/strength/assets/52764820/6a7e1be9-44e9-4c7d-9e25-0f458e9d1d08





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
