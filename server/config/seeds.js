const db = require("./connection");
const { User, Product, Category } = require("../models");
const cleanDB = require("./cleanDB");

db.once("open", async () => {
  await cleanDB("Category", "categories");
  await cleanDB("Product", "products");
  await cleanDB("User", "users");

  const categories = await Category.insertMany([
    { name: "Food" },
    { name: "Household Supplies" },
    { name: "Electronics" },
    { name: "Books" },
    { name: "Toys" },
  ]);

  console.log("categories seeded");

  const products = await Product.insertMany([
    {
      name: "Cookie Can-nundrum",
      description:
        "Embark on a perplexing journey through the enigmatic flavors of our Cookie Can-nundrum. A tin full of sweet mysteries awaits!",
      image: "cookie-tin.jpg",
      category: categories[0]._id,
      price: 2.99,
      quantity: 500,
    },
    {
      name: "Timeless Brew",
      category: categories[0]._id,
      description:
        "Experience the essence of eternity in every sip with our Timeless Brew.",
      image: "timeless-brew.jpg",
      price: 12.99,
      quantity: 300,
    },
    {
      name: "Plush Purity",
      category: categories[1]._id,
      description:
        "Indulge in the luxurious comfort of 'Plush Purity' toilet paper. Soft, strong, and crafted for your satisfaction. Elevate your bathroom experience with every roll.",
      image: "plush-purity.jpg",
      price: 7.99,
      quantity: 20,
    },
    {
      name: "Artisanal Suds Symphony",
      category: categories[1]._id,
      description:
        "Indulge in the melodious notes of our 'Artisanal Suds Symphony' handmade soap. Each wash is a harmonious journey, leaving you refreshed and in tune with cleanliness.",
      image: "soap.jpg",
      price: 3.99,
      quantity: 50,
    },
    {
      name: "Chef's Favored Spoons",
      category: categories[1]._id,
      description:
        "Achieve culinary favored with our 'Chef's Favored Spoons.' Crafted for every kitchen maestro, these spoons bring simplicity and elegance to your cooking experience.",
      image: "favored-spoons.jpg",
      price: 14.99,
      quantity: 100,
    },
    {
      name: "Snap Master",
      category: categories[2]._id,
      description:
        "Unleash your photography skills with 'Snap Master,' a camera designed to capture every moment effortlessly.",
      image: "snap-master.jpg",
      price: 399.99,
      quantity: 30,
    },
    {
      name: "ExploreMate Tablet",
      category: categories[2]._id,
      description:
        "Embark on enchanting journeys with the 'ExploreMate' tablet. From vivid adventures to immersive learning, it's your companion in the tales of exploration and knowledge.",
      image: "tablet.jpg",
      price: 199.99,
      quantity: 30,
    },
    {
      name: "Slumber Symphony - A Page Turner",
      category: categories[3]._id,
      description:
        "Dive into the lyrical world of 'Slumber Symphony - A Page Turner.' Each page unfolds a melodic tale, weaving dreams and lulling you into a peaceful bedtime serenade.",
      image: "bedtime-book.jpg",
      price: 9.99,
      quantity: 100,
    },
    {
      name: "Whirlwind Whiz - Mesmerizing Spinning Top",
      category: categories[4]._id,
      description:
        "Experience the enchantment of our 'Whirlwind Whiz' spinning top. Watch as it twirls and dances, creating a mesmerizing display of colors and motion.",
      image: "spinning-top.jpg",
      price: 1.99,
      quantity: 1000,
    },
    {
      name: "Galloping Gala - Set of Plastic Horses",
      category: categories[4]._id,
      description:
        "Add a touch of whimsy to your playtime with our 'Galloping Gala' set of plastic horses. Let your imagination run wild as these charming companions gallop into your adventures.",
      image: "plastic-horses.jpg",
      price: 2.99,
      quantity: 1000,
    },
    {
      name: "Hug Hub - Cozy Teddy Bear",
      category: categories[4]._id,
      description:
        "Embrace warmth and comfort with our 'Hug Hub' cozy teddy bear. With its soft fur and lovable presence, it's the perfect companion for cuddles and smiles.",
      image: "teddy-bear.jpg",
      price: 7.99,
      quantity: 100,
    },
    {
      name: "AlphaCrafters - Educational Alphabet Blocks",
      category: categories[4]._id,
      description:
        "Explore the world of letters with our 'AlphaCrafters' educational alphabet blocks. Each block is a stepping stone in the journey of learning and fun.",
      image: "alphabet-blocks.jpg",
      price: 9.99,
      quantity: 600,
    },
  ]);

  console.log("products seeded");

  await User.create({
    firstName: "Pamela",
    lastName: "Washington",
    email: "pamela@testmail.com",
    password: "password12345",
    orders: [
      {
        products: [products[0]._id, products[0]._id, products[1]._id],
      },
    ],
  });

  await User.create({
    firstName: "Elijah",
    lastName: "Holt",
    email: "eholt@testmail.com",
    password: "password12345",
  });

  console.log("users seeded");

  process.exit();
});
