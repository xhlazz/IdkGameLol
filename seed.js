const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
});
const User = mongoose.model("User", userSchema);

mongoose.connect("mongodb://localhost:27017/chaty", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  const users = [
    { username: "xhlazz", password: "101520" },
    { username: "Mikunef", password: "Miku" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.create({ username: user.username, password: hashedPassword });
  }

  console.log("Database seeded!");
  mongoose.connection.close();
}

seedDatabase();