const Gpio = require('onoff').Gpio;
const telebot = require('telebot');
const dotenv = require('dotenv');

dotenv.config();

let motion = null;
let bot = null;



const setupMotion = () => {
    if (!valid(motion)) {
        console.error(`Motion detector not set up correctly.`);
        return;
    }

    motion.watch(
        (err, value) => {
            if (err) {
                console.error(`Error occurred in motion watch -- ${err}`);
                return;
            }

            console.debug(`Motion has been detected.`)
        }
    );
}

const init = async () => {
    console.debug(`Hello! Starting init function.`);

    console.debug(`Token: ${process.env.TOKEN}`);

    try {
        motion = new Gpio(21, `in`, `rising`);
    } catch (error) {
        console.error(`Error occurred setting motion detector -- ${error}`);
        return;
    }

    if (!valid(motion)) {
        console.error(`Error occurred setting motion detector.`);
        return;
    }

    console.debug(`Setting up telebot.`);
    const token = process.env.TOKEN;
    if (!valid(token)) {
        console.error(`Token for telegram is not valid or defined.`);
        return;
    }

    bot = new telebot(token);

    bot.on(`/hello`, (msg) => {
        console.dir(msg);
    });
    
    bot.start();

    console.debug(`Sleeping for 30 seconds to let the detector warm up.`);
    await sleep(30000);

    console.debug(`Calling setupMotion`);
    setupMotion();
}

const valid = (obj) => {
    return obj !== null && obj !== undefined;
}

function sleep(time) {
    return new Promise(
        (resolve) => {
            setTimeout(
                () => {
                    resolve();
                },
                time
            );
        }
    );
}

init();