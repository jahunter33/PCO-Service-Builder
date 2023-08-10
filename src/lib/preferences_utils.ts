import { writeJson } from "./debug_utils";
import { Person, getPeople } from "./data_fetch_utils";

interface Preferences {
  person_id: string;
  person_name: string;
  priority: number;
}

function createPreferences(people: Person[]): void {
  const preferences: Preferences[] = [];
  for (const person of people) {
    const preference: Preferences = {
      person_id: person.person_id,
      person_name: person.person_name,
      priority: 0,
    };

    preferences.push(preference);
  }
  writeJson(preferences, "preferences.json");
}

async function main(): Promise<void> {
  const people: Person[] = await getPeople();
  createPreferences(people);
}

main();
