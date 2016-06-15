# Critical Care Database

## Contributing

### Setup
```
nvm use # Optional
npm install -g bower
npm install -g grunt
npm install
```

#### Mongo
Start mongod
```
mongod 1> mongod-log.tmp 2> mongod-log.err.tmp &
```

You may have to crate the db folder:
```
sudo mkdir -p /data/db
sudo chown -R $USER /data/db
```

If you run mongo in a docker container, or port forward 8080 turn off docker-machine:
```
docker-machine stop default
```


### Running Locally
```
./database_restore.sh
grunt cleanup
```