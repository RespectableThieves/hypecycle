// This hides logging for passing tests and only
// prints it for failing tests
const {DefaultReporter} = require('@jest/reporters');

class Reporter extends DefaultReporter {
  constructor() {
    super(...arguments);
  }

  printTestFileHeader(_testPath, config, result) {
    const console = result.console;

    if (result.numFailingTests === 0 && !result.testExecError) {
      result.console = null;
    }

    super.printTestFileHeader(...arguments);

    result.console = console;
  }
}

module.exports = Reporter;
