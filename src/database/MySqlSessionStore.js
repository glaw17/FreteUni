const { createHash } = require("node:crypto");
const { Store } = require("express-session");
const { getConnection } = require("./database");

function sessionKey(id) {
  return createHash("sha256").update(id).digest("hex");
}

class MySqlSessionStore extends Store {
  get(id, callback) {
    getConnection()
      .then((connection) =>
        connection("sessions")
          .select("data")
          .where({ sid: sessionKey(id) })
          .where("expires_at", ">", new Date())
          .first(),
      )
      .then((row) => (row ? JSON.parse(row.data) : null))
      .then((data) => callback(null, data), callback);
  }

  set(id, session, callback) {
    getConnection()
      .then((connection) =>
        connection("sessions")
          .insert({
            sid: sessionKey(id),
            data: JSON.stringify(session),
            expires_at: new Date(session.cookie.expires),
          })
          .onConflict("sid")
          .merge(),
      )
      .then(() => callback(null), callback);
  }

  touch(id, session, callback) {
    const expiresAt = new Date(session.cookie.expires);
    getConnection()
      .then((connection) =>
        connection("sessions")
          .where({ sid: sessionKey(id) })
          .where("expires_at", ">", new Date())
          .where("expires_at", "<", expiresAt)
          .update({ expires_at: expiresAt }),
      )
      .then(() => callback(null), callback);
  }

  destroy(id, callback) {
    getConnection()
      .then((connection) => connection("sessions").where({ sid: sessionKey(id) }).del())
      .then(() => callback(null), callback);
  }

  async deleteExpired() {
    const connection = await getConnection();
    await connection("sessions").where("expires_at", "<=", new Date()).del();
  }
}

module.exports = MySqlSessionStore;
