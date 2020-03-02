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
        console.error(`Motion detector not set up correctly.`);
        return;
    }

    motion.watch(
        (err, value) => {
            if (err) {
                console.error(`Error occurred in motion watch -- ${err}`);
                return;
            }

            const date = new Date();
            console.debug(`Motion has been detected at ${date.toString()}`);
            publish();
        }
    );
}

const publish = () => {
    if (!valid(mqtt_client)) {
        console.error(`MQTT Client not set up.`);
        return;
    }

    mqtt_client.publish(
        process.env.TOPIC,
        `motion_detected`
    );
    console.debug(`Published MQTT message to HomeAssistant`);
}

const init = async () => {
    const PIN_NUMBER = process.env.PIN_NUMBER;
    const TOPIC = process.env.TOPIC;
    const HOST = process.env.HOST;
    const PORT = process.env.PORT;
    const USERNAME = process.env.USERNAME;
    const PASSWORD = process.env.PASSWORD;

    if (!valid(TOPIC) || !valid(PIN_NUMBER) || !valid(HOST) || !valid(PORT)
        || !valid(USERNAME) || !valid(PASSWORD)) {
        console.error(`error in .env file.`);
        process.exit();
    }

    // Set up MQTT
    try {
        const options = {
            host: `${HOST}`,
            port: parseInt(PORT),
            username: `${USERNAME}`,
            password: `${PASSWORD}`
        };

        mqtt_client = mqtt.connect(options);
    } catch (error) {
        console.error(`Error connecting to mqtt service on ${HOST}:${PORT}`);
        mqtt_client = null;
        process.exit();
    }


    // Set up the motion detector. Sleeps for 30 seconds
    try {
        motion = new Gpio(parseInt(PIN_NUMBER), `in`, `rising`);

        if (!valid(motion)) {
            console.error(`Error occurred setting motion detector.`);
            process.exit();
        }

        console.debug(`Sleeping for 30 seconds to let the detector warm up.`);
        await sleep(30000);

        console.debug(`Calling setupMotion`);
        setupMotion();
    } catch (error) {
        console.error(`Error occurred setting motion detector -- ${error}`);
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