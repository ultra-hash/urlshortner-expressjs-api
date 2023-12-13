const jwt = require("jsonwebtoken");
const QueryUsers = require("../db/users");
const bcrypt = require("bcrypt");

module.exports = (config) => {
  const {
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserByPhoneNumber,
    getUserByUsername,
    addNewUser,
    updatePasswordByUsername,
    updateUserDetailsByUsername,
  } = QueryUsers(config);
  const { addChangeInUserDetails } = require("../db/analytics")(config);

  async function listUsers(req, res) {
    try {
      const result = await getAllUsers();
      res.json(result);
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async function userDetials(req, res) {
    const { id, email, phoneNumber, username } = req.query;
    try {
      if (
        (id && (email || username || phoneNumber)) ||
        (email && (id || username || phoneNumber)) ||
        (username && (id || email || phoneNumber)) ||
        (phoneNumber && (id || email || username)) ||
        (!id && !email && !phoneNumber && !username)
      ) {
        res.status(400).json({ error: "Invalid Request" });
      } else if (id) {
        res.json(await getUserById(id));
      } else if (email) {
        res.json(await getUserByEmail(email));
      } else if (phoneNumber) {
        res.json(await getUserByPhoneNumber(phoneNumber));
      } else {
        res.json(await getUserByUsername(username));
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async function createUser(req, res) {
    const { firstName, lastName, username, emailId, password, phoneNumber } =
      req.body;
    try {
      if (
        !firstName ||
        !lastName ||
        !username ||
        !emailId ||
        !password ||
        !phoneNumber
      ) {
        res.status(400).json({ error: "Invalid Request" });
      } else if (await getUserByUsername(username)) {
        res.json({ error: "user already exist" });
      } else if (await getUserByEmail(emailId)) {
        res.json({ error: "Email already exist" });
      } else if (await getUserByPhoneNumber(phoneNumber)) {
        res.json({ error: "Phone number already exist" });
      } else {
        const hashed_password = await bcrypt.hash(password, 10);
        const result = await addNewUser(
          firstName,
          lastName,
          username,
          emailId,
          hashed_password,
          phoneNumber
        );
        res.json(result);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async function login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await getUserByUsername(username);
      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashed_password
      );
      // console.log(isPasswordValid)
      if (!isPasswordValid) {
        res.json({ error: "Invalid Username or password" });
      } else {
        const jwtToken = jwt.sign({ id: user.id, username }, config.JWT_SECRET);
        res.json({ id: user.id, jwtToken });
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async function updatePassword(req, res) {
    const { password } = req.body;
    const payload = req.payload;
    let hashed_password = null;

    try {
      hashed_password = await bcrypt.hash(password, 10);
    } catch (error) {
      console.error(`error : ${error.message}`);
      return res.json({ error: "Invalid token" });
    }

    try {
      res.json(
        await updatePasswordByUsername(payload.username, hashed_password)
      );
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async function updateUserDetails(req, res) {
    const payload = req.payload;

    let { firstName, lastName, emailId, phoneNumber } = req.body;
    const { username } = payload;
    try {
      const userData = await getUserByUsername(username);

      const updatedColumnsData = [];

      if (userData.first_name !== firstName && firstName !== undefined) {
        updatedColumnsData.push([
          userData.id,
          "first_name",
          "VARCHAR(50)",
          userData.first_name,
        ]);
      } else {
        firstName = userData.first_name;
      }

      if (userData.last_name !== lastName && lastName !== undefined) {
        updatedColumnsData.push([
          userData.id,
          "last_name",
          "VARCHAR(50)",
          userData.last_name,
        ]);
      } else {
        lastName = userData.last_name;
      }

      if (userData.email_id !== emailId && emailId !== undefined) {
        updatedColumnsData.push([
          userData.id,
          "email_id",
          "VARCHAR(320)",
          userData.email_id,
        ]);
      } else {
        emailId = userData.email_id;
      }

      if (userData.phone_number !== phoneNumber && phoneNumber !== undefined) {
        updatedColumnsData.push([
          userData.id,
          "phone_number",
          "BIGINT",
          userData.phone_number,
        ]);
      } else {
        phoneNumber = userData.phone_number;
      }

      if (updatedColumnsData.length === 0) {
        res.json({ error: "northing to update" });
      } else {
        const result = await updateUserDetailsByUsername(
          firstName,
          lastName,
          emailId,
          phoneNumber,
          userData.username
        );
        // console.log(result)
        // console.log(updatedColumnsData)
        if (result.affectedRows) {
          await addChangeInUserDetails(updatedColumnsData);
        }

        res.json({ status: "success", message: "change's have been saved" });
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return {
    listUsers,
    userDetials,
    createUser,
    login,
    updatePassword,
    updateUserDetails,
  };
};
