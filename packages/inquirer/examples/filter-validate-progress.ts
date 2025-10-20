/**
 * Filter and validate progress example
 */

import inquirer from 'inquirer';

const questions = [
  {
    type: 'input' as const,
    name: 'first_question',
    message: 'Question with filtering and validating text',
    async validate() {
      await new Promise((r) => setTimeout(r, 3000));
      return true;
    },
    async filter(answer: string) {
      await new Promise((r) => setTimeout(r, 3000));
      return `filtered${answer}`;
    },
    filteringText: 'Filtering your answer...',
    validatingText: 'Validating what you wrote...',
  },
  {
    type: 'input' as const,
    name: 'second_question',
    message: 'Question without filtering and validating text',
    async validate() {
      await new Promise((r) => setTimeout(r, 3000));
      return true;
    },
    async filter(answer: string) {
      await new Promise((r) => setTimeout(r, 3000));
      return `filtered${answer}`;
    },
  },
];

void inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '));
});
