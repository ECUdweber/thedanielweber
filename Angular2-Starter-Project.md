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
