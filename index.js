#! /usr/bin/env node

// Folder Structure

/*

    root
      |-- models
            |-- Model.js
      |-- routes
            |-- routename
                    |-- controllers.js
                    |-- index.js
                    |-- services.js
            |-- index.js
      |-- app.js

*/

const fs = require('fs');
const inquirer = require('inquirer');
const ejs = require('ejs');

// Helpers
const { makeInitialUppercase } = require('./helpers/string');
const { DIR_ROUTES, DIR_MODELS } = require('./helpers/constants');

//
function generate(dir, file, content) {
    if (!fs.existsSync(`${dir}/${file}.js`)) {
        fs.mkdirSync(dir, {
            recursive: true,
        });
        fs.writeFileSync(`${dir}/${file}.js`, content, {
            recursive: true,
        });
    } else {
        console.log(`Directory already exists`);
    }
}

function main() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'endpoint',
                message: 'What is name of your api endpoint?',
            },
        ])
        .then((answers) => {
            const { endpoint } = answers;
            const MODEL = makeInitialUppercase(endpoint);
            const FOLDER = endpoint.toLowerCase();

            // Routes
            const routeTemplate = fs.readFileSync(
                `${__dirname}/ejs/route.ejs`,
                'utf-8'
            );
            const renderedRoute = ejs.render(routeTemplate, {
                modelName: MODEL,
            });

            // Controllers
            const controllerTemplate = fs.readFileSync(
                `${__dirname}/ejs/controller.ejs`,
                'utf-8'
            );
            const renderedController = ejs.render(controllerTemplate, {
                modelName: MODEL,
            });

            // Model
            const modelTemplate = fs.readFileSync(
                `${__dirname}/ejs/model.ejs`,
                'utf-8'
            );
            const renderedModel = ejs.render(modelTemplate, {
                modelName: MODEL,
            });

            // Services
            const servicesTemplate = fs.readFileSync(
                `${__dirname}/ejs/services.ejs`,
                'utf-8'
            );
            const renderedServices = ejs.render(servicesTemplate, {
                modelName: MODEL,
            });

            generate(`${DIR_ROUTES}/${FOLDER}`, 'index', renderedRoute);
            generate(`${DIR_MODELS}`, `${MODEL}`, renderedModel);
            generate(
                `${DIR_ROUTES}/${FOLDER}`,
                `controllers`,
                renderedController
            );
            generate(`${DIR_ROUTES}/${FOLDER}`, `services`, renderedServices);
        });
}

main();
