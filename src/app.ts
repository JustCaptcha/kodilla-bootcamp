import inquirer from "inquirer";

const COLOR = {
    reset: '\x1b[0m',
    FgCyan: "\x1b[36m",
    BgMagenta: "\x1b[45m",
}

const chosenNumbers: Array<number> = [];
const randomNumbers: Array<number> = [];

const startApp = async (): Promise<void> => {
    let matchCounter = 0; 
    do {
        const result = await inquirer.prompt([{
            name: 'number',
            type: 'input',
            message: 'Pick a number from 0 to 49...'
        }]);
    
        if (validateInput(result.number)) {
            chosenNumbers.push(parseInt(result.number));
        } 
    } while (chosenNumbers.length < 6);

    do {
        const randomNumber = Math.floor(Math.random() * (49 + 1));
        if (validateRandomNumber(randomNumber)) randomNumbers.push(randomNumber);
    } while (randomNumbers.length < 6);

    chosenNumbers.forEach((num, numIndex) => (randomNumbers.includes(num)) ? matchCounter += 1 : {});

    console.log(`${COLOR.BgMagenta}Your lottery ticket:${COLOR.reset}`);
    console.table(chosenNumbers);
    console.log(`${COLOR.BgMagenta}Lottery winner:${COLOR.reset}`);
    console.table(randomNumbers);
    console.log(`${COLOR.FgCyan}Matches counter: ${matchCounter}${COLOR.reset}`);
};

const validateInput = (text: string): boolean => {
    const result = parseInt(text);
    const isNumber = (typeof result === 'number' && result >= 0 && result <= 49) ? true : false;
    const isAlreadyPresent = chosenNumbers.includes(result);
    if (!isNumber) console.log('Incorrect input. Please pick a number from 0 to 49.');
    if (isAlreadyPresent) console.log('This number is alredy in use.');
    return (isNumber && chosenNumbers.length === 0 || !isAlreadyPresent); 
};

const validateRandomNumber = (randomNumber: number): boolean => (randomNumbers.length === 0) ? true : !randomNumbers.includes(randomNumber);

startApp();
