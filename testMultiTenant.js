// Define our collection that will be used by multiple tenant
Foo = new Mongo.Collection("foo");

if (Meteor.isServer) {
    // Some security rules
    Foo.allow({
        insert: function (userId, doc) {
            // User must be logged
            return (userId);
        },
        update: function (userId, doc, fields, modifier) {
            // User can only change document that belong to his tenant
            return doc.tenant === Meteor.users.findOne({_id: userId}).profile.currentTenant;
        },
        remove: function (userId, doc) {
            // User can only delete document that delong to his tenant
            return doc.tenant === Meteor.users.findOne({_id: userId}).profile.currentTenant;
        },
        fetch: ['tenant']
    });

    Foo.deny({
        // Do not permit document's tenant change
        update: function (userId, docs, fields, modifier) {
            return _.contains(fields, 'tenant');
        }
    });


    // Collection hooks for multi-tenant support
    //

    // Force filter on current user tenant
    Foo.before.find(function (userId, selector, options) {
        if (userId) {
            selector.tenant = Meteor.users.findOne({_id: userId}).profile.currentTenant;
            console.log(selector);
        }
    });

    // Force tenant on newly created document
    Foo.before.insert(function (userId, doc) {
        if (userId) {
            doc.tenant = Meteor.users.findOne({_id: userId}).profile.currentTenant;
        }
    });

    // Force tenant on update.
    Foo.before.update(function (userId, doc, fieldNames, modifier, options) {
        if (userId) {
            modifier.$set = modifier.$set || {};
            modifier.$set.tenant = Meteor.users.findOne({_id: userId}).profile.currentTenant;
        }
    });

    // Add few dummy data
    if (Foo.find().count() == 0) {
        Foo.insert({name: 'Only for acme eyes1', tenant: 'acme'});
        Foo.insert({name: 'Only for acme eyes2', tenant: 'acme'});
        Foo.insert({name: 'Only for acme eyes3', tenant: 'acme'});
        Foo.insert({name: 'Only for secret eyes1', tenant: 'secret'});
        Foo.insert({name: 'Only for secret eyes1', tenant: 'secret'});
    }

    if (Meteor.users.find().count() == 0) {
        Accounts.createUser({email:'test1@test.com',password:'test1',profile:{currentTenant:'acme', tenants:['acme']}});
        Accounts.createUser({email:'test2@test.com',password:'test2',profile:{currentTenant:'secret', tenants:['secret']}});
        Accounts.createUser({email:'test3@test.com',password:'test3',profile:{currentTenant:'acme', tenants:['acme','secret']}});
    }
}
