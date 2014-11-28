Template.hello.helpers({
  foos: function() {
    return Foo.find();
  }
});

Template.hello.events({
  'click #savebutton' : function(e,t) {
    Foo.insert({name: t.find('#fooinput').value});
  },
  'click .deleteanchor': function(e, t) {
    debugger;
    Foo.remove({_id:this._id});
  }
});

var foosSubscribe;

Deps.autorun(function() {
  if (Meteor.user()) {
    if (foosSubscribe)
      foosSubscribe.stop();
    foosSubscribe = Meteor.subscribe("foos");
  }
});



