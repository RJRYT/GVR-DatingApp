const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
const Schema = require('./src/app/models');
const User = Schema.user;
const Preferences = Schema.preferences;

const connectToDatabase = async () => {
    try {
        await Schema.mongoose.connect(Schema.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("[Database]: Connected to the database!");
    } catch (err) {
        console.error("[Database]: Cannot connect to the database!", err);
        process.exit(1);
    }
};

const deleteFakeUsersAndPreferences = async () => {
    try {
        await Preferences.deleteMany({ fake: true });
        const res = await User.deleteMany({ fake: true });
        console.log("Deleted all fake users and their preferences. Response: ", res);
    } catch (err) {
        console.error("Error deleting fake users and preferences:", err);
    }
};

const generateRandomUser = async () => {
    const _randomUser = {
        firstName: faker.person.firstName(),
        middleName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        googleId: faker.string.uuid(),
        phoneNumber: faker.phone.number(),
        date: faker.date.past(),
        numberVerified: faker.helpers.arrayElement([false, true]),
        emailVerified: faker.helpers.arrayElement([false, true]),
        personalInfoSubmitted: faker.helpers.arrayElement([true, true]),
        professionalInfoSubmitted: faker.helpers.arrayElement([true, true]),
        purposeSubmitted: faker.helpers.arrayElement([true, true]),
        age: faker.number.int({ min: 20, max: 40 }),
        dateOfBirth: faker.date.between({ from: '1983-01-01T00:00:00.000Z', to: '2003-12-31T00:00:00.000Z' }),
        gender: faker.person.sexType(),
        hobbies: faker.helpers.arrayElements(['Reading', 'Cooking', 'Traveling', 'Swimming', 'Hiking', 'Painting', 'Dancing'], 3),
        interests: faker.helpers.arrayElements(['Music', 'Movies', 'Sports', 'Art', 'Technology', 'Literature'], 3),
        smokingHabits: faker.helpers.arrayElement(['yes', 'no', 'planningToQuit']),
        drinkingHabits: faker.helpers.arrayElement(['regular', 'planningToQuit', 'socially', 'occasionally', 'teeToTaler']),
        qualification: faker.helpers.arrayElements(['High School', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Associate Degree'], 2),
        profilePic: [{
            url: faker.image.avatar(),
            uploadedAt: faker.date.past(),
        }],
        shortReel: {
            url: "https://www.example.com/shortreel.mp4",
            uploadedAt: faker.date.past(),
        },
        professionType: faker.helpers.arrayElement(['Employee', 'Employer', 'Jobseeker']),
        companyName: faker.company.name(),
        designation: faker.person.jobTitle(),
        location: faker.location.city(),
        expertiseLevel: faker.helpers.arrayElement(['Beginner', 'Intern', 'Expert']),
        purpose: faker.helpers.arrayElement(['longTermRelationShip', 'shortTermRelationShip']),
        fake: true,
    };
    const _user = new User(_randomUser);
    await _user.save();
    _randomUser._id = _user._id;
    return _randomUser;
};

const generateRandomUserPreferences = async (userId) => {
    return new Preferences({
        userId,
        preferredAgeRange: {
            min: faker.number.int({ min: 20, max: 30 }),
            max: faker.number.int({ min: 31, max: 40 })
        },
        preferredLocation: faker.location.city(),
        preferredInterests: faker.helpers.arrayElements(['Music', 'Movies', 'Sports', 'Art', 'Technology', 'Literature'], 3),
        preferredGender: faker.helpers.arrayElement(['male', 'female', 'other']),
        fake: true
    }).save();
};

const generateUsers = async (numUsers) => {
    const users = [];
    const preferences = [];
    for (let i = 0; i < numUsers; i++) {
        const user = await generateRandomUser();
        users.push(user);
        const userPreferences = await generateRandomUserPreferences(user._id);
        preferences.push(userPreferences);
    }
    return { users, preferences };
};

const run = async () => {
    console.log("[Script]: Running...");
    await connectToDatabase();
    await deleteFakeUsersAndPreferences();
    try {
        const { users, preferences } = await generateUsers(50);

        fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
        fs.writeFileSync(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences, null, 2));

        console.log('Fake user data and matching preferences generated and saved to users.json and preferences.json');
    } catch (err) {
        console.error('Error generating user data or preferences:', err);
    } finally {
        Schema.mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

run();
