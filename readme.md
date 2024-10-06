# Lodgify Assessment

This project is a Cypress-based end-to-end testing suites for the Lodgify assessment. It ensures the application's functionality through comprehensive test cases, including positive, negative and boundary scenarios. The suite generates detailed test reports for analysis.

## Table of Contents

- [Lodgify Assessment](#lodgify-assessment)
    - [Table of Contents](#table-of-contents)
    - [Installation](#installation)
    - [Usage](#usage)
        - [Running Cypress Tests](#running-cypress-tests)
        - [Running Tests with reporting](#running-tests-with-reporting)
        - [Other Commands](#other-commands)
    - [Project Structure](#project-structure)
    - [Configuration](#configuration)
        - [Cypress Configuration](#cypress-configuration)
        - [Reporter Configuration](#reporter-configuration)

## Installation

To set up the project locally, follow these steps:

1. Clone the git repository:
    ```sh
    git clone https://github.com/viktoriia-ignateva/lodgify-assessment.git
    cd lodgify-assessment
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a new ClickUp test user by signing up at [ClickUp Signup](https://app.clickup.com/signup).

4. Create a new `.env` file in the root directory of the project and add the username and password using the following commands:
    ```sh
    echo "USERNAME=your_username" >> .env
    echo "PASSWORD=your_password" >> .env
    ```

5. Obtain the API token for the user from the [ClickUp Developer Portal](https://clickup.com/api/developer-portal/authentication/#generate-your-personal-api-token) and add the `API_TOKEN` to the `.env` file:
    ```sh
    echo "API_TOKEN=your_api_token" >> .env
    ```

   Alternatively, you can manually create the `.env` file and add the following entries:

    ```
    USERNAME=your_username
    PASSWORD=your_password
    API_TOKEN=your_api_token
    ```

## Usage

> **Important Note:** During the test run, the login process might fail due to reCAPTCHA challenges. This needs to be manually handled by the user. If this occurs, please resolve the reCAPTCHA and run the test again.

### Running Cypress Tests

To open the Cypress Test Runner, use the following command:
```sh
npm run cy:open
```

The Cypress Test Runner allows you to run and debug your end-to-end tests interactively.
It provides a graphical interface where you can see the tests running in real-time,
inspect the DOM, and view detailed logs and screenshots for each test step.

### Running Tests with reporting

To run the tests and generate reports, use the following command:
```sh
npm run cy:report
```

This command runs the tests and generates reports, making it suitable for use in CI/CD pipelines. It ensures that the tests are executed in a headless mode and the results are also captured and saved inside directory `cypress/results` for further analysis. Screenshots for failed tests are stored in `cypress/screenshots`.

### Other Commands

In addition to the commands for running tests, the following scripts are available:

- `delete:reports`: This command deletes all files in the `cypress/results` directory. It is useful for cleaning up old test reports before generating new ones.
  ```sh
  npm run delete:reports
  ```

- `precy:report`: This command is a pre-script that runs before `cy:report`. It ensures that the `cypress/results` directory is cleaned up by running the `delete:reports` script.
  ```sh
  npm run precy:report
  ```

## Project Structure

- `cypress/`
    - `e2e/`: Contains the end-to-end test cases.
    - `fixtures/`: Contains test data and mock responses.
    - `support/`: Contains support files and custom commands.
    - `results/`: Contains the test results in XML format.
    - `screenshots/`: Contains screenshots taken during test execution.

- `cypress.config.js`: Cypress configuration file.
- `package.json`: Project dependencies and scripts.
- `reporter-config.json`: Configuration for the test reporters.

## Configuration

### Cypress Configuration

The Cypress configuration is defined in `cypress.config.js`. Key configurations include:

- `testIsolation`: Set to `false` to disable test isolation.
- `watchForFileChanges`: Set to `false` to disable watching for file changes.
- `numTestsKeptInMemory`: Set to `5` to avoid any memory consumption issues during a test run.
- `reporter`: Set to `cypress-multi-reporters` to use multiple reporters.
- `reporterOptions`: Specifies the configuration file for the reporters.

### Reporter Configuration

The reporter configuration is defined in `reporter-config.json`. It enables the `spec` and `mocha-junit-reporter` reporters and specifies the output file format.