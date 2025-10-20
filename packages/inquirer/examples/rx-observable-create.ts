import { Observable } from 'rxjs';
import inquirer from 'inquirer';

const observe = new Observable((subscriber) => {
  subscriber.next({
    type: 'input' as const,
    name: 'first_name',
    message: "What's your first name",
  });

  subscriber.next({
    type: 'input' as const,
    name: 'last_name',
    message: "What's your last name",
    default() {
      return 'Doe';
    },
  });

  subscriber.next({
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
  });
  subscriber.complete();
});

// @ts-expect-error - TS has issues with inferring the correct type for Observable questions
void inquirer.prompt(observe).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '));
});
