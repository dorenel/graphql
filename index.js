var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var restaurants = [
    {
      id: 1,
      name: "WoodsHill ",
      description:
        "American cuisine, farm to table, with fresh produce every day",
      dishes: [
        {
          name: "Swordfish grill",
          price: 27,
        },
        {
          name: "Roasted Broccily ",
          price: 11,
        },
      ],
    },
    {
      id: 2,
      name: "Fiorellas",
      description:
        "Italian-American home cooked food with fresh pasta and sauces",
      dishes: [
        {
          name: "Flatbread",
          price: 14,
        },
        {
          name: "Carbonara",
          price: 18,
        },
        {
          name: "Spaghetti",
          price: 19,
        },
      ],
    },
    {
      id: 3,
      name: "Karma",
      description:
        "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
      dishes: [
        {
          name: "Dragon Roll",
          price: 12,
        },
        {
          name: "Pancake roll ",
          price: 11,
        },
        {
          name: "Cod cakes",
          price: 13,
        },
      ],
    },
];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    restaurants: [Restaurant]
    restaurant(id: Int): Restaurant
  },
  type Mutation {
    setRestaurant(input: RestaurantInput): Restaurant
    deleteRestaurant(id: Int): DeleteResponse
    editRestaurant(id: Int, name: String): Restaurant
  },
  type Restaurant {
      id: Int
      name: String
      description: String
      dishes: [Dish]
  },
  type Dish {
      name: String
      price: Int
  },
  input RestaurantInput {
      name: String
      description: String
  },
  type DeleteResponse {
      ok: Boolean
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  restaurants: () => {
    return restaurants;
  },
  restaurant: ({id}) => {
      const restaurant = restaurants.find((item) => item.id === id);
      if (!restaurant) {
          throw new Error("No restaurant found with the provided id.")
      }
      return restaurant;
  },
  setRestaurant: ({input}) => {
      const restaurant = { name: input.name, description: input.description };
      restaurants.push(restaurant);
      return restaurant;
  },
  deleteRestaurant: ({id}) => {
      let ok = false;
      restaurants = restaurants.filter((item) => {
        // need to do this to toggle the ok flag.
        if (item.id === id) {
            ok = true;
            return false;
        } else {
            return true;
        }
      });
      return {ok};
  },
  editRestaurant: ({id, name}) => {
      let restaurant = restaurants.find((item) => item.id === id);
      if (!restaurant) {
          throw new Error("Cannot find restaurant with provided id.");
      }
      restaurant.name = name;
      return restaurant;
  }
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(5500, () => {
    console.log('Running a GraphQL API server at http://localhost:5500/graphql');
});
