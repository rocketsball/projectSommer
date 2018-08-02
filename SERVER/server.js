const Hapi = require('hapi');
const Boom = require('boom');

// Create a server with a host and port
const server = Hapi.server({
    host: 'localhost',
    port: 8000,
    routes: {
        cors: true
    }
});

const launchServer = async function() {

    const dbOpts = {
        url: 'mongodb://rockets2225:onjira2225@ds261521.mlab.com:61521/code',
        settings: {
            poolSize: 10
        },
        decorate: true
    };



    await server.register({
        plugin: require('hapi-mongodb'),
        options: dbOpts
    });
    server.route({
        method: 'GET',
        path: '/',
        async handler(request) {

            const db = request.mongo.db;
            const ObjectID = request.mongo.ObjectID;

            try {

                const result = await db.collection('code').find().toArray();
                return result;
            } catch (err) {

                throw Boom.internal('Internal MongoDB error', err);
            }
        }

    });
    server.route({
        method: 'GET',
        path: '/name/{id}',
        async handler(request) {

            const db = request.mongo.db;
            const ObjectID = request.mongo.ObjectID;

            try {
                const result = await db.collection('code').find({ _id: new ObjectID(request.params.id) }).toArray();
                return result;
            } catch (err) {
                throw Boom.internal('Internal MongoDB error', err);
            }
        }

    });
    server.route({
        method: 'POST',
        path: '/add',

        async handler(request, reply) {
            console.log("insert")
            const db = request.mongo.db;
            const ObjectID = request.mongo.ObjectID;

            try {
                const result = await db.collection('code').insert(request.payload);
                console.log(result)
                return result;
            } catch (err) {
                console.log(err);
                throw Boom.internal('Internal MongoDB error', err);
            }
        }

    });

    server.route({
        method: 'DELETE',
        path: '/remove',
        async handler(request) {

            const db = request.mongo.db;
            const ObjectID = request.mongo.ObjectID;
            console.log(request)
            try {
                const result = await db.collection('code').remove({ name: request.payload.name });
                return result;
            } catch (err) {
                throw Boom.internal('Internal MongoDB error', err);
            }
        }

    });
    server.route({
        method: 'PUT',
        path: '/update/{_id}',
        async handler(request) {

            const db = request.mongo.db;
            const ObjectID = request.mongo.ObjectID;
            console.log(request)
            try {
                const result = await db.collection('code').update({ name: (request.params._id) }, { $set: request.payload });
                return result;
            } catch (err) {
                throw Boom.internal('Internal MongoDB error', err);
            }
        }

    });
    await server.start();
    console.log(`Server started at ${server.info.uri}`);
};

launchServer().catch((err) => {
    console.error(err);
    process.exit(1);
});