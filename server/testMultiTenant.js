Meteor.publish("foos", function() {
  return Foo.find();
});

AccountsTemplates.configure({
  // Redirects
  homeRoutePath: '/home',
  redirectTimeout: 4000
});

Meteor.methods({'changeCurrentTenant' : function(tenant) {
  if (this.userId && Meteor.user().profile.tenants.indexOf(tenant) != -1)
    Meteor.users.update({_id:this.userId}, {$set:{'profile.currentTenant':tenant}});
}});

