Template.main.events({
    'change #tenant': function(e, t) {
        Meteor.call('changeCurrentTenant', e.target.value);
    },
    'click #logout': function(e, t) {
        AccountsTemplates.logout();
    }
});

Template.main.helpers({
    tenantSelected: function() {
        return this == Meteor.user().profile.currentTenant ? {selected:'selected'}:{};
    },
    isTenants: function() {
        return Meteor.user().profile.tenants.length > 1;
    }
});