/**
 * Input prompt example
 */

import inquirer from 'inquirer';

const questions = [
  {
    type: 'input' as const,
    name: 'first_name',
    message: "What's your first name",
  },
  {
    type: 'input' as const,
    name: 'last_name',
    message: "What's your last name",
    default() {
      return 'Doe';
    },
  },
  {
    type: 'input' as const,
    name: 'fav_color',
    message: "What's your favorite color",
    transformer(
      color: string,
      _answers: Record<string, unknown>,
      flags: { isFinal: boolean },
    ) {
      if (flags.isFinal) {
        return color + '!';
      }

      return color;
    },
  },
  {
    type: 'input' as const,
    name: 'phone',
    message: "What's your phone number",
    validate(value: string) {
      const pass = value.match(
        /^([01])?[\s.-]?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?)(?:\d+)?)?$/i,
      );
      if (pass) {
        return true;
      }

      return 'Please enter a valid phone number';
    },
  },
];

// @ts-expect-error - TS has issues with inferring the correct type for arrays of questions
void inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '));
});
