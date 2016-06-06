
# runs with mongo 2.6

mongorestore --db ices --collection patients dump/ices/patients.bson
mongorestore --db ices --collection users dump/ices/users.bson