# MobileSoft Examples

Please see some example files of code I have written.

## Laravel 4 Examples

Here you'll find a few examples of code from a previous engagement. Note the comment styles here are more per-line than docblock. This is due to the fast, agile, nature of development for this project. This is *not* how I would prefer to document code, but one must work within the environment one finds themselves.

`EmbedController.php`

This file represents a small controller to handle requests for users to access iframe embeddable views of their equipment.

`Embed-Model.php`

(The suffix -Model applied to make clearer its purpose)
Note in this file the large raw SQL query. The nature of this query made using Laravel 4s Query Builder somewhat cumbersome, writing the query raw made it clearer and more readable in this case. 

`FileStream.php`

This file is self explanatory, it is a class that is callable to access S3 files within application.

`ModalController.php`
Because application used a heavily modified Bootstrap theme, we used the native Modal method to display modals to user. 

This class allowed access to these modals to display both static and dynamic data. Note that for Dynamic data it was possible to define, from the view, the Model and its method to retrieve data needed to properly display and render modal. This was very useful because some of our codebase had been written using static and object classes.


## Laravel 5 Examples

Here you'll find two simple examples from a Laravel 5 project I am working on at the moment. These have somewhat better documentation due to the nature of the project, unlike the Laravel 4 examples, I have had a great deal more time to be more thoughtful in documenting code. 
Please also note that these are very *slim* controllers. This is my preferred practice, creating lean and clean controllers that are easy to read and understand. 

`UserProfileController.php`

A lightweight controller for handling display of a logged in user's profile as well as accepting `POST` of updated user data and storing using Eloquent Model properties to access relational table models.

`SurveyController.php`

This is an example of a controller that handles the display of a Typeform.io generated form that uses Guzzle to call out to Typeform.io API and generate form on the fly. The production code for this will allow passing of custom data to the form that can be pulled from the User model to personalize and customize their form. I have used dummy data here to reduce size and confusion as well as avoid violating client NDA.


## JavaScript Examples

Here are a couple of files I've thrown in just to show a little of my JS coding chops. These files are from my previous engagement as well.

`native\embed-index.js`

This file is related to the `Embed*` files referenced above. This was written in native javascript and included with the returned view allowing users to embed an iframe into their own applications as opposed to accessing the full application.

`native\localstorage.js`

A simple method of caching into memory changes to user's localStorage until `beforeunload` event is fired when user leaves dashboard either by close or navigation. Written to accomplish a few things, first it improves performance in not having to `JSON.stringify()` and `JSON.parse()` data during the life of the user's session as well as avoiding constant writing to disk. 

`native\grid.js`

This is a grid layout that accepted handlebars and raw html and arranged them using a tree structure similar to the i3 window manager's layout. This was useful in making sure that you could display any number and combination of 'widgets' or 'modules' on a page without concern for collision and overlap.

`jQuery-views\labadmin-index.js`

Here is a massive file that represents the control of a flexbox based view for administration of labs and equipment. Normally I would prefer to break this up into a series of modules that could be compiled through a build process, but due to the constraints of our application's structure and lack of CI build processes, this had to be written as a single file. 
