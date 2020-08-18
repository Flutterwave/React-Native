# Contributing

Thank you for your interest in contributing! Please feel free to put up a PR for any issue or feature request.

## Creating issues

If you notice any bugs in the app, see some code that can be improved, or have features you would like to be added, please create an issue!

If you want to open a PR that fixes a bug or adds a feature, then we can't thank you enough! It is definitely appreciated if an issue has been created before-hand so it can be discussed first.

## Submitting pull requests

### Modifying flutterwave-react-native
1. Fork this repository
2. Clone your fork
3. Make a branch for your feature or bug fix (i.e. `git checkout -b what-im-adding`)
4. Work your magic

### Testing your changes
Depending on the changes you make you might want to test to see if the feature/fix works correctly.
Use the following steps to test your newly added feature/fix.
1. Set up your react-native example project or use one you already have.
2. Create a `.env` file in the root of the library (flutterwave-react-native).
3. Add **RN_FLW_EXAMPLE_PROJECT** to the `.env` file it's value should be an absolute path to the install destination in your example project.
**E.g.** `RN_FLW_EXAMPLE_PROJECT="/Users/your-name/projects/example-project/src"`.
4. Run the following command `npm run set-example`.

Following these steps will result in you building and copy the built version of the library in the following directory `/Users/your-name/projects/example-project/src/flutterwave-react-native`, you can then go ahead an import the library from within your example project from the location the library has been copied to.

### Writting Tests
We currently don't have strict rules for writting tests but when writting one be sure to make your tests and their captions clear and coincise, test only what you added, and then follow up with the dependencies if need be.
Tests are also not a prerequisite for making PRs but if you do add any for the feature you write, merging your PR will happen faster.

### Commiting
This project is [Commitzen](https://github.com/commitizen/cz-cli) friendly and uses the [Angular commit conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines) for creating commits, please ensure you use this when commiting your changes.
To start a commit simply run the following cli command from within the project `npm run commit` this will start a wizard that will walk you through the necessary steps for creating a commit.

### Opening the Pull Request

1. Commit your changes with a message following the [Angular commit conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
2. Push your branch to your fork
3. Create a pull request from your branch on your fork to `master` on this repo
4. Have your branch get merged in! :white_check_mark:

If you experience a problem at any point, please don't hesitate to file an issue to get some assistance!

With love from Flutterwave. :yellow_heart:
