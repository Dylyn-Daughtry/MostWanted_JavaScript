"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application

function app(people){
  let searchType = promptFor("Do you know the full name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchType = promptFor("Do you know the first name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase(); 
      switch(searchType){
        case 'yes':
          searchResults = searchByFirstName(people);
          break;
        case 'no':
          searchType = promptFor("Do you know the last name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase(); 
          switch(searchType){
            case 'yes':
              searchResults = searchByLastName(people);
              break;
            case 'no':
              searchType = promptFor("Do you know the 'eye color', 'gender', or 'occupation' of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase(); 
              switch(searchType){
                case 'yes':
                  searchResults = narrowDownSearch(people)
                  break;
                case 'no':
                  alert('Here is a list of everyone in the database...')
                  displayPeople(people)
                  app(people);
                  break;
                default:
                  app(people); // restart app
                  break;
              }
          }
      }
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  let inData;

  inData = people.includes(person[0]);

  if(inData == false){
      alert("Could not find that individual.");
      return app(people); // restart
  }

  else if(inData == true){

    if(person.length > 1){

      let searchResults;

      displayPeople(person)

      searchResults = searchByName(person)

      mainMenu(searchResults, person);

    }

    else{

      let displayOption;
      let userSatisfaction = false

      while(userSatisfaction == false){

        for(const el of person ){
          displayOption = promptFor("Found " + el.firstName + " " + el.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid)
        }

        switch(displayOption){
          case "info":
          // TODO: get person's info
            for(const el of person){
              displayPerson(el)};
          break;

          case "family":
          // TODO: get person's family
            immediateFamily(person[0], people)
          break;
          case "descendants":
          // TODO: get person's descendants
            displayPeople(findDescendants(person[0], people))
          break;
          case "restart":
          app(people); // restart
          break;
          case "quit":
          return; // stop execution
          default:
          return mainMenu(person, people); // ask again
        }
      }
    }
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.

function searchByFirstName(people){
  let firstName = promptFor("What is the person's first name?", autoValid);
  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName.toLowerCase() === firstName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return foundPerson;
}

function searchByLastName(people){
  let lastName = promptFor("What is the person's last name?", autoValid);
  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.lastName.toLowerCase() === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return foundPerson;
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", autoValid);
  let lastName = promptFor("What is the person's last name?", autoValid);

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName.toLowerCase() === firstName && potentialMatch.lastName.toLowerCase() === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return foundPerson;
}

//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByEyeColor(people){
  let eyeColor = promptFor("What is the person's eye color?", autoValid)
  let foundPerson = people.filter(function(potentialMatch){
      if(potentialMatch.eyeColor === eyeColor){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson
}

function searchByGender(people){
  let gender = promptFor("What is the person's gender?", autoValid)
  let foundPerson = people.filter(function(potentialMatch){
      if(potentialMatch.gender === gender){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson
}

function searchByOccupation(people){
  let occupation = promptFor("What is the person's occupation?", autoValid)
  let foundPerson = people.filter(function(potentialMatch){
      if(potentialMatch.occupation === occupation){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson
}

function findDescendants(subject, people){
  let foundDescendants = people.filter(function(person){
    if (person.parents.includes(subject.id)){
      return true
    }
    else{
      return false
    }
  })
  return foundDescendants
}

//TODO: add other trait filter functions here.
function immediateFamily(subject, people){
  let spouseList = [];
  let parentList = [];
  let childrenList = [];
  //siblings
  let siblingList = findSiblings(subject,people);
  let foundFamily = people.filter(function(person){
    //spouse
    if(person.currentSpouse === subject.id){
      spouseList.push(person)
      return true;
    }
    //parents
    else if(subject.parents.includes(person.id)){
      parentList.push(person)
      return true;
    }
    //children
    else if(person.parents.includes(subject.id)){
      childrenList.push(person)
      return true;
    }
    else{
      return false;
    }
  });
  alert("Siblings: " + ("\n") +  
          siblingList.map(function(person){
            return person.firstName + " " + person.lastName;
          }).join("\n") + ' ' + ("\n") + ("\n") +

        "Parents: " + ("\n") +  
          parentList.map(function(person){
            return person.firstName + " " + person.lastName;
          }).join("\n") + ' ' + ("\n") + ("\n") +

        "Children: " + ("\n") +  
          childrenList.map(function(person){
            return person.firstName + " " + person.lastName;
          }).join("\n") + ' ' + ("\n") + ("\n") +

        "Spouse: " + ("\n") +  
          spouseList.map(function(person){
            return person.firstName + " " + person.lastName;
          }).join("\n")
  );
  // foundFamily = foundFamily.concat(findSiblings(subject, people));
  // return foundFamily;
}

function findSiblings(subject, people){
  if(subject.parents.length === 0){
    return [];
  }
  else{
    let foundSiblings = []
    for(let i = 0; i < subject.parents.length; i++){
      foundSiblings = foundSiblings.concat(
        people.filter(function(person){
          if(person.parents.includes(subject.parents[i]) && !foundSiblings.includes(person) && person.id !== subject.id){
            return true;
          }
          else{
            return false;
          }

        })

      )
    }
    return foundSiblings;
  }
}

function narrowDownSearch(people){

  let searchResults;
  let answerOne = false
  let answerTwo = false
  let answerThree = false

  

  while(answerOne == false){

    searchResults = promptFor("Do you know the eye color of the person you are looking for? Enter 'yes' or 'no'", autoValid);
    
    if(searchResults.toLowerCase() === 'no'){
      answerOne = true
    }
    else if(searchResults.toLowerCase() === 'yes'){
      people = searchByEyeColor(people)
      answerOne = true
    }
    else{
      answerOne = false
    }
  }

  

  while(answerTwo == false){

    searchResults = promptFor("Do you know the gender of the person you are looking for? Enter 'yes' or 'no'", autoValid);

    if(searchResults.toLowerCase() === 'no'){
      answerTwo = true
    }
    else if(searchResults.toLowerCase() === 'yes'){
      people = searchByGender(people)
      answerTwo = true
    }
    else{
      answerTwo = false
    }
  }

  

  while(answerThree == false){

    searchResults = promptFor("Do you know the occupation of the person you are looking for? Enter 'yes' or 'no'", autoValid);

    if(searchResults.toLowerCase() === 'no'){
      answerThree = true
    }
    else if(searchResults.toLowerCase() === 'yes'){
      people = searchByOccupation(people)
      answerThree = true
    }
    else{
      answerThree = false
    }
  }

  return people
}

//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people){
  alert("Potential matches: " + ("\n") + people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Age" + ageCalculator(person) + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  // TODO: finish getting the rest of the information to display.
  alert(personInfo);
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  let isValid;
  do{
    var response = prompt(question).trim();
    isValid = valid(response);
  } while(response === ""  ||  isValid === false)
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input){
  
}
function ageCalculator(person){
  let birthdate = new Date(person.dob);
  let current = new Date();
  let diff = current-birthdate; 
  let age = Math.floor(diff/31557600000);
  return age
}
//#endregion