
# runs with mongo 2.6

mongorestore --db ccdb --collection patients dump/ices/patients.bson
mongorestore --db ccdb --collection users dump/ices/users.bson