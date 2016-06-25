# Angular 2 Starter Project

This tutorial will build an extremely simple seed project with Angular2. We will begin with the most basic application possible followed by an example that is a bit more functional.

### Overview 

Angular 2 applications are built by creating HTML templates that contain angular specific markup. Classes are then created to manage the templates and everything is wrapped into a module, which you piece together to create your application. These modules are referred to as **components** and are written in TypeScript.

Angular interprets these modules and uses them to present your application in the browser.

### Starter Application

Let's get started with a minimal application. We will begin with an application that contains a single module whose sole job is to display some text.

We will begin by creating a new folder called "app"
```
mkdir app
```
As mentioned above, our application will begin with a single module or **component** that will display some text to the screen. Let's learn how to create a component using TypeScript. 

Create a file called app.component.ts as shown below which will be the starting point of our app:
```
    import { Component } from '@angular/core';
    @Component({
      selector: 'my-app',
      template: '<h1>Free Code Camp Rocks!</h1>'
    })
    export class AppComponent { }
```
Every Angular 2 application has at least one component which is usually named **AppComponent**. A component manages a portion of the page using the template within it.

Our component demonstrates the basic structure of any component you will ever write. It contains:
* **import statements** to pull in other components we will need
* **component decorator** which lets angular know which template to use and how the component will be created
* **component class** which controls the components appearance and behavior

Let's take a closer look at each line in our component.

**Import**
```
import { Component } from '@angular/core';
```
Since angular applications are modular, we can import any other modules or libraries we may need. Here, we are importing the Angular 2 core module to give our component access to the @Component decorator. Every app will need this import to get started.

Since we imported the ***Component*** function above, we can now use it to associate metadata with our component class that will tell Angular how our component should be created and the actions it will provide.

**Component decorator**
```
    @Component({
      selector: 'my-app',
      template: '<h1>Free Code Camp Rocks!</h1>'
    })
```    
Our metadata object has selector and template fields.
* The ***selector*** specifies a CSS selector that indicates which HTML element will represent this component. The element we will use will be named "my-app". Angular will use this to create an instance of our component where it finds this element.
* The ***template*** tells angular what template it will use for this component. This can refer to other Components or just a form of HTML that tells how to display the view for our component. Our template is just displaying an h1 element containing the text "Free Code Camp Rocks!".

**Component Class**
Our final line provides an empty class named ***AppComponent***
```
export class AppComponent { }
```
If we want to build a more complex component we can add logic and properties to the class. This component is extremely basic and simply displays some html, so its class will remain empty.

We export our class so we can use it in other modules in our application.

We need to connect our root component to Angular and to do so we create another file in our app folder called main.ts that will have the following code:
```
    import { bootstrap }    from '@angular/platform-browser-dynamic';
    import { AppComponent } from './app.component';
    bootstrap(AppComponent);
```
This file imports the two items we need to start our app.
* ***bootstrap*** - Angulars built in function that connects to the browser 
* ***AppComponent*** - Our component we created above (which is why we exported it)
We then call **bootstrap** function with our AppComponent

**Finally, create index.html**

```
    <html>
      <head>
        <title>Free Code Camp - Angular 2 Tutorial</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="styles.css">
        <!-- 1. Load libraries -->
        <script src="https://npmcdn.com/core-js/client/shim.min.js"></script>

        <script src="https://npmcdn.com/zone.js@0.6.12?main=browser"></script>
        <script src="https://npmcdn.com/reflect-metadata@0.1.3"></script>
        <script src="https://npmcdn.com/systemjs@0.19.27/dist/system.src.js"></script>
        
        <!-- 2. Configure SystemJS -->
        <script src="systemjs.config.js"></script>
        <script>
          System.import('app').catch(function(err){ console.error(err); });
        </script>
      </head>
      
      <!-- Display app in my-app element -->
      <body>
        <my-app>Loading Your App...</my-app>
      </body>
    </html>
```
In commented section 1, we loaded several libraries that improve the compatibility of this tutorial with different browsers/versions. It also imports system.src.js which is used below.

In section 2, SystemJS is used to load our application and our various modules. In a production example we may want to use something else such as webpack. It was chosen here since we can use it with plunker.

This is all that is required to get our simple application running. <a href="http://plnkr.co/edit/tiyXWGNCZheydzsEYWpI" target="_blank">Here is a link to a plunker</a> that contains our working application. You can fork it into your own version and change whatever you'd like.

<a target="_blank" href="http://plnkr.co/edit/tiyXWGNCZheydzsEYWpI">VIEW APP</a>
