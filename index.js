import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

async function getCats() {
  try {
    const facts = await axios.get(`https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3`);
    let fact = facts.data.map((data) => {
      return data.text;
    });
    return fact;
  } catch (error) {
    console.error(`no cats here budy : ${error}`);
    return null;
  }
}

async function getFox() {
  try {
    const foxy = await axios.get(`https://randomfox.ca/floof/`);
    return foxy.data.image;
  } catch (error) {
    console.error(`what does the fox says ?? : ${error}`);
    return null;
  }
}

async function getCountryOfMyChoice(countryCode) {
  try {
    const date = new Date(Date.now());
    const year = date.getFullYear();
    const dayOff = await axios.get(`https://date.nager.at/api/v2/PublicHolidays/2021/${countryCode}`);
    return dayOff.data;
  } catch (error) {
    console.error(`no holidays for you... : ${error}`);
    return null;
  }
}


async function gettingApi(countryCode) {
  const catFacts = await getCats();
  const foxImage = await getFox();
  const dayOff = await getCountryOfMyChoice(countryCode);

  return {
    catFacts: catFacts,
    foxImage: foxImage,
    dayOff: dayOff
  };
}

app.post('/', async (req, res) => {
  return await gettingApi(req.body.countryCode);
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
