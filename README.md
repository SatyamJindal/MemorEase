# Photo-album :sunglasses:

**MemorEase** is a web app which is built using Node js and is used to add memories into an album. 


**Technologies Used**
+ Node JS 
+ Bcryptjs
+ Multer (For Handling Images)
+ Express
+ bcryptjs (For encryting password)
+ Pug
+ Sequelize (For handling databases in an easy way)
+ HTML
+ CSS
+ Bootstrap
+ MySQL (Database)


# Set Up Instruction :exclamation:
+ Download the contents of this repository and extract the files in a suitable location.
+ Download Node JS ( Link : - https://nodejs.org/en/download/) as per your OS.
+ Download MySQL Database (Link for Windows : - https://dev.mysql.com/downloads/windows/installer/8.0.html).

**_Note:_**- In case if you get an error **"caching_sha2_password"**. Execute **"ALTER USER 'yourusername'@'localhost' IDENTIFIED WITH mysql_native_password BY 'youpassword';"** on MYSQL.

+ Set the **Database Name** as :  **photo_album**
+ Set the **Database Password** as: **satyam**
+ Open the folder where you extracted the files and open up a power shell window there. The PowerShell Window can be open inside the folder as shown below: - 

![](https://github.com/SatyamJindal/MemorEase/blob/master/screenshots/Screenshot%20(28).png "PowerShell")

+ To download all the dependencies execute the command **"npm init"**. After executing just keep pressing "Enter" untill all the dependencies are installed. You should see a window like below after you execute the command.
+ Next execute **"npm install express"**


![](https://github.com/SatyamJindal/MemorEase/blob/master/screenshots/Screenshot%20(30).png "PowerShell")

+ After setting up the database and the node JS. The application can be run by executing the command **"node server.js"**.
+ Open your browser and go to **"http://localhost:3000/".**

+ After completing all the steps you should see the page below: - 

![](https://github.com/SatyamJindal/MemorEase/blob/master/screenshots/memor_ease.PNG "PowerShell")

# Features of the Web-Application :computer:

+ The Application has Registration and a Login Page.

![](https://github.com/SatyamJindal/MemorEase/blob/master/screenshots/signup.PNG "Registration")

+ The application has a Dashboard Page to Display all the albums.

![](https://github.com/SatyamJindal/MemorEase/blob/master/screenshots/Album_Page.PNG "Album_Page")

+ Each album has its own page where a user can add any number of Photos.
+ The application has a User Profile Page for every user which also facilitates Edit options.

![](https://github.com/SatyamJindal/MemorEase/blob/master/screenshots/Profile_Page.PNG "Profile_Page")
















