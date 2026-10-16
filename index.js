require('dotenv').config();
const mongoose = require('mongoose');
const Person = require('./models/Person');
const {
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
} = require('./services/personService');

async function main() {
  console.log('🍃 GoMyCode Mongoose & NodeJS VS MongoDB Checkpoint');
  console.log('👤 Développeur : Darius Ange (Karma-22)\n');

  const uri = process.env.MONGO_URI;

  if (uri && !uri.includes('<password>')) {
    try {
      console.log('🔗 Connexion à MongoDB Atlas...');
      await mongoose.connect(uri);
      console.log('✅ Connecté avec succès à MongoDB distant !');
    } catch (err) {
      console.warn('⚠️ Connexion distante impossible, exécution du rapport statique :', err.message);
    }
  } else {
    console.log('ℹ️ Aucune variable MONGO_URI active configurée dans .env.');
    console.log('ℹ️ Toutes les méthodes du service sont prêtes et validées par la suite de tests.\n');
  }

  console.log('📋 Récapitulatif des 10 fonctions Mongoose implémentées :');
  console.log('  1. createAndSavePerson(personData, done) -> new Person() + save()');
  console.log('  2. createManyPeople(arrayOfPeople, done)  -> Person.create()');
  console.log('  3. findPeopleByName(personName, done)    -> Person.find({ name })');
  console.log('  4. findOneByFood(food, done)             -> Person.findOne({ favoriteFoods })');
  console.log('  5. findPersonById(personId, done)        -> Person.findById(id)');
  console.log('  6. performClassicUpdate(personId, done)  -> findById + push("hamburger") + save()');
  console.log('  7. performNewUpdate(personName, done)    -> findOneAndUpdate({ name }, { age: 20 }, { new: true })');
  console.log('  8. removeById(personId, done)            -> findByIdAndDelete(id)');
  console.log('  9. removeManyMary(done)                  -> deleteMany({ name: "Mary" })');
  console.log(' 10. queryChain(done)                      -> find({ favoriteFoods: "burritos" }).sort().limit(2).select("-age").exec()');
  console.log('\n🚀 Pour lancer la validation complète des 10 opérations : npm test');

  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
