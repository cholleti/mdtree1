# README #

MDTree connects the Patients with Doctors, and manages the appointment schedule of them.

### Stack

* Persistence store: [MongoDB](http://www.mongodb.org/)
* Backend: [Node.js](http://nodejs.org/) 
* Server Framework: [Hapi.js](http://hapijs.com/)
* Frontend: [AngularJS](http://www.angularjs.org/) on the client
* CSS based on [Twitter's bootstrap](http://getbootstrap.com/)

### How do I get set up? ###

* Install Node.js, you can download the installer based on your OS from here: http://nodejs.org/download/. This will install node and npm tools. Node will act as our application server. npm is a package manager, it helps us to automatically updated our project dependencies. You can also refer this step by step guid to set up the Node on windows os: http://dailyjs.com/2012/05/03/windows-and-node-1/
* Install MongoDB, please refer the official document: http://docs.mongodb.org/manual/installation/
* Install bower. You can install bower using the command: npm install -g bower

### Get the Code

Either clone this repository using the below git command:

```
git clone https://bitbucket.org/aksamy/mdtree-deliverable.git
cd mdtree-deliverable
```

### App Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:

* Install local dependencies (from the project root folder):

    ```
    npm install
    ```

  (This will install the dependencies declared in the package.json file)

### Client App

Our client application is a straight HTML/Javascript application that relies upon some 3rd party bower packages.  We need to install these as local dependencies using bower.

* Install local dependencies (from the project root folder):

    ```
    bower install
    ```

  (This will install the dependencies declared in the bower.json file)

### Start the Server
* Run the server (from the project root folder):

    ```
    node server.js
    ```

* Browse to the application at [http://localhost:8000]