AccountsTemplates.configureRoute('signIn',{
    name: 'signin',
    layoutTemplate: 'main',
    redirect: '/'
});

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    except: ['atSignIn', 'atSignUp', 'atForgotPassword']
});

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', function () {
    this.render('hello', {
        data: function () { return; }
    });
});
