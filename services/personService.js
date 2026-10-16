const Person = require('../models/Person');

/**
 * 1. Create and Save a Record of a Model
 */
const createAndSavePerson = async (personData = { name: 'Darius Ange', age: 24, favoriteFoods: ['Attiéké', 'Alloco', 'Pizza'] }, done) => {
  try {
    const person = new Person(personData);
    const data = await person.save();
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 2. Create Many Records with model.create()
 */
const createManyPeople = async (arrayOfPeople, done) => {
  try {
    const data = await Person.create(arrayOfPeople);
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 3. Use model.find() to Search Your Database by Name
 */
const findPeopleByName = async (personName, done) => {
  try {
    const data = await Person.find({ name: personName });
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 4. Use model.findOne() to Return a Single Matching Document by Food
 */
const findOneByFood = async (food, done) => {
  try {
    const data = await Person.findOne({ favoriteFoods: food });
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 5. Use model.findById() to Search Your Database by _id
 */
const findPersonById = async (personId, done) => {
  try {
    const data = await Person.findById(personId);
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 6. Perform Classic Updates by Running Find, Edit, then Save
 * Adds "hamburger" to the favoriteFoods array and saves.
 */
const performClassicUpdate = async (personId, done) => {
  const foodToAdd = 'hamburger';
  try {
    const person = await Person.findById(personId);
    if (!person) {
      const err = new Error(`Person with id ${personId} not found`);
      if (done) return done(err);
      throw err;
    }
    person.favoriteFoods.push(foodToAdd);
    const data = await person.save();
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 7. Perform New Updates on a Document Using model.findOneAndUpdate()
 * Updates the person's age to 20 and returns the updated document.
 */
const performNewUpdate = async (personName, done) => {
  const ageToSet = 20;
  try {
    const data = await Person.findOneAndUpdate(
      { name: personName },
      { $set: { age: ageToSet } },
      { new: true, runValidators: true }
    );
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 8. Delete One Document Using model.findByIdAndDelete() / findByIdAndRemove()
 */
const removeById = async (personId, done) => {
  try {
    const data = await Person.findByIdAndDelete(personId);
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 9. Delete Many Documents with model.deleteMany() / model.remove()
 * Deletes all people whose name is "Mary"
 */
const removeManyMary = async (done) => {
  const nameToRemove = 'Mary';
  try {
    const data = await Person.deleteMany({ name: nameToRemove });
    if (done) return done(null, data);
    return data;
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

/**
 * 10. Chain Search Query Helpers to Narrow Search Results
 * - Find people who like "burritos"
 * - Sort them by name
 * - Limit results to 2 documents
 * - Hide their numeric age (select('-age'))
 * - Execute via .exec()
 */
const queryChain = async (done) => {
  const foodToSearch = 'burritos';
  try {
    const query = Person.find({ favoriteFoods: foodToSearch })
      .sort({ name: 1 })
      .limit(2)
      .select('-age');

    if (done) {
      return query.exec(done);
    }
    return await query.exec();
  } catch (err) {
    if (done) return done(err);
    throw err;
  }
};

module.exports = {
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  performClassicUpdate,
  performNewUpdate,
  removeById,
  removeManyMary,
  queryChain
};
