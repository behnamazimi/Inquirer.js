import { from } from 'rxjs';
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

const observable = from(questions);

inquirer.prompt(observable).ui.process.subscribe({
  next: (ans) => {
    console.log('Answer is:', ans);
  },
  error: (err) => {
    console.log('Error:', err);
  },
  complete: () => {
    console.log('Completed');
  },
});
