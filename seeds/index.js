const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp')
  .then(() => console.log('Connected to DB'))
  .catch(err => console.error('Connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  try {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random()*20)+10;
      const camp = new Campground({
        author: '6725de572fefe2fc002fa7c1',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: `https://picsum.photos/400?random=${Math.random()}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero eligendi omnis nihil sequi facere molestiae quaerat numquam in, provident, ab voluptatem dignissimos. Rerum necessitatibus distinctio commodi, iste reprehenderit odit cum.',
        price
      });
      await camp.save();
    }
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

// Run the seed function and close the database connection
seedDB().then(() => mongoose.connection.close());
