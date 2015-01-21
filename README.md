# angular-osd-form

This modules provides easy form validation in AngularJS. There are three directives included in the module:

  - osd-submit (accepts a function to be called if validation passes)
  - osd-field (accepts a name attribute and adds error messages if field is invalid)
  - osd-error (

### Version
0.1.0

### Installation

This package can be install using bower:
```sh
$ bower install angular-osd-form
```

### Example

Here is an example of a registration form to be validated using angular-osd-form:

```html
<form role="form" name="regForm" osd-submit="userCtrl.register(userCtrl.currentUser)" novalidate>
    <osd-field attr="firstName">
        <label class="control-label">First Name</label>
        <input type="text" class="form-control" name="firstName"
               ng-model="userCtrl.currentUser.firstName" required="required">
        <osd-error msg="First name required"></osd-error>
    </osd-field>

    <osd-field attr="lastName">
        <label class="control-label">Last Name</label>
        <input type="text" class="form-control" name="lastName"
               ng-model="userCtrl.currentUser.lastName" required="required">
        <osd-error msg="Last name required"></osd-error>
    </osd-field>

    <osd-field attr="email">
        <label class="control-label">Email</label>
        <input type="email" class="form-control" name="email"
               ng-model="userCtrl.currentUser.email" required="required"
               ng-change="userCtrl.setEmail(userCtrl.currentUser.email)">
        <osd-error msg="Email required"></osd-error>
        <osd-error error-type="email" msg="Email must be valid"></osd-error>
        <osd-error validator="userCtrl.asyncEmailValidator()" msg="Email already taken"></osd-error>
    </osd-field>

    <osd-field attr="password">
        <label class="control-label">Password</label>
        <input type="password" class="form-control" name="password"
               ng-model="userCtrl.currentUser.password" required="required">
        <osd-error msg="Password required"></osd-error>
        <osd-error validator="userCtrl.passwordsMatchValidator()" msg="Passwords do not match"></osd-error>
    </osd-field>

    <osd-field attr="confirmation">
        <label class="control-label">Password Confirmation</label>
        <input type="password" class="form-control" name="confirmation"
               ng-model="userCtrl.currentUser.password_confirmation" required="required">
        <osd-error msg="Password confirmation required"></osd-error>
    </osd-field>

    <button type="submit" class="btn">Continue</button>
</form>
```

### Todo's
TODO

### License
MIT

