const Gpio = require('onoff').Gpio;
const dotenv = require('dotenv');
const mqtt = require('mqtt');

dotenv.config();

let motion = null;
let mqtt_client = null;

/**
 * setupMotion sets up a hook on the onoff GPIO pin to
 * send MQTT messages when motion is detected
 */
const setupMotion = () => {
    if (!valid(motion)) {
        console.error(`Motion detector not set up correctly. Cannot continue.`);
        process.exit();
    }

    console.log(`Calling motion.watch().`);
    motion.watch(
        (err, value) => {
            if (err) {
                console.error(`Error occurred in motion watch -- ${err}.`);
                return;
            }

            const date = new Date();
            console.log(`Motion has been detected at time ${date.toString()}.`);
            publish();
        }
    );
}

const publish = () => {
    if (!valid(mqtt_client)) {
        console.error(`MQTT connection is not set up - cannot publish motion notification. Exiting...`);
        process.exit();
    }

    try {
        mqtt_client.publish(
            process.env.TOPIC,
            `motion_detected`
        );
        console.log(`MQTT motion notification on topic '${process.env.TOPIC}' has been published.`);
    } catch (error) {
        console.error(`MQTT motion notification on topic '${process.env.TOPIC}' errored out.`);
    }
}

const connectToMQTT = () => {
    return new Promise(
        (resolve) => {
            // These environmental variables should already be checked at this point in the program.
            // However, we shall check again
            const USERNAME = process.env.USERNAME;
            const PASSWORD = process.env.PASSWORD;
            const HOST = process.env.HOST;
            const PORT = process.env.PORT;

            if (!valid(USERNAME) || !valid(PASSWORD) || !valid(HOST) || !valid(PORT)) {
                return resolve({success: false, message: `The USERNAME, PASSWORD, HOST, or PORT environment variable is unset.`});
            }

            const options = {
                host: `${HOST}`,
                port: parseInt(PORT),
                username: `${USERNAME}`,
                password: `${PASSWORD}`
            };

            try {
                mqtt_client = mqtt.connect(options);
                return resolve({success: true, message: `MQTT instance connected successfully.`});
            } catch (error) {
                console.error(``);
                return resolve({success: false, message: `Error connecting to mqtt service on ${HOST}:${PORT}. Exiting...`});
            }
        }
    );
}

const init = async () => {
    console.log(`Starting...`);
    const PIN_NUMBER = process.env.PIN_NUMBER;
    const TOPIC = process.env.TOPIC;
    const HOST = process.env.HOST;
    const PORT = process.env.PORT;
    const USERNAME = process.env.USERNAME;
    const PASSWORD = process.env.PASSWORD;

    if (!valid(TOPIC) || !valid(PIN_NUMBER) || !valid(HOST) || !valid(PORT)
        || !valid(USERNAME) || !valid(PASSWORD)) {
        console.error(`Error in .env file - must supply environmental variables for PIN_NUMBER, TOPIC, HOST, PORT, USERNAME, and PASSWORD. Exiting...`);
        process.exit();
    }

    // Start up MQTT
    console.log(`Starting MQTT instance.`);
    const result = await connectToMQTT();
    const message = result[`message`];
    if (result['success'] === true) {
        console.log(`${message}`);
    } else {
        console.error(`${message}`);
        process.exit();
    }


    // Set up the motion detector. Sleeps for 30 seconds
    try {
        motion = new Gpio(parseInt(PIN_NUMBER), `in`, `rising`);

        if (!valid(motion)) {
            console.error(`Error thrown while setting up motion detector -- Gpio instance from pin ${PIN_NUMBER} ('in' and 'rising') is null.`);
            process.exit();
        }

        console.log(`Sleeping for 30 seconds to let the detector warm up.`);
        await sleep(30000);
        console.log(`30 seconds has passed. Continuing setup.`);
        setupMotion();
    } catch (error) {
        console.error(`Error thrown while setting up motion detector -- ${error}`);
        process.exit();
    }
}

/**
 * 
 * @param {object} obj The object to check.
 */
const valid = (obj) => {
    return obj !== null && obj !== undefined;
}

/**
 * Sleep for a certain amount of time.
 * 
 * @param {integer} time The time to sleep
 */
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

// Call the init function
init();