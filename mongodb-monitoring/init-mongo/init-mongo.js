db = db.getSiblingDB("admin");

db.createUser({
  user: "monitoring",
  pwd: "monitoringpassword",
  roles: [
    { role: "readAnyDatabase", db: "admin" }
  ]
});
