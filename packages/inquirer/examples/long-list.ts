/**
 * Paginated list
 */

import inquirer from 'inquirer';

// @ts-expect-error - TS has issues with Apply.apply signature
const choices: Array<
  string | inquirer.Separator | { name: string; value: string; short: string }
> = Array.apply(0, Array.from({ length: 26 })).map((_x, y) =>
  String.fromCodePoint(y + 65),
);
choices.push(
  'Multiline option 1\n  super cool feature \n  more lines',
  'Multiline option 2\n  super cool feature \n  more lines',
  'Multiline option 3\n  super cool feature \n  more lines',
  'Multiline option 4\n  super cool feature \n  more lines',
  'Multiline option 5\n  super cool feature \n  more lines',
  new inquirer.Separator(),
  'Multiline option \n  super cool feature',
  {
    name: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.',
    value: 'foo',
    short: 'The long option',
  },
);

void inquirer
  // @ts-expect-error - TS has issues with inferring the correct type for arrays of questions
  .prompt([
    {
      type: 'list' as const,
      loop: false,
      name: 'letter',
      message: "What's your favorite letter?",
      choices,
    },
    {
      type: 'checkbox' as const,
      name: 'name',
      message: 'Select the letter contained in your name:',
      choices,
    },
  ])
  .then((answers) => {
    console.log(JSON.stringify(answers, null, '  '));
  });
