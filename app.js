import readline from "readline-sync";
import { getPeopleList, getRecordsTranscriptions, searchPeoplebyName, searchPeoplebyAge, findDangerousPeople } from "./utils.js";

// readline.question("What is your name? ")

function menu() {
  console.log(`
        ---menu---
        1. Get People List
        2. Get Call Records/Transcriptions
        3. Search People by Name
        4. Search People by Age
        5. Find Dangerous People
        `);

  let choice = readline.question("What is your choice? ");
  switch (choice) {
    case "1":
      getPeopleList();
      break;
    case "2":
      getRecordsTranscriptions();
      break;
    case "3":
        const name = readline.question("enter a name: ")
        searchPeoplebyName(name)
      break;
    case "4":
        const age = readline.question("enter a age: ")
        searchPeoplebyAge(age)
      break;
    case "5":
        findDangerousPeople()
      break;
  }
}

menu();
