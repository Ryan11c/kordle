<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
![Python][python-url]
![Django][django-url]
![Django REST Framework][djangorest-url]
![JavaScript][js-url]
![HTML5][html-url]
![PostgreSQL][postgres-url]
![Heroku][heroku-url]
![Bootstrap][bootstrap-url]
![Amazon][amazon-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
    <img src="https://github.com/user-attachments/assets/9a6db567-c3e9-46d9-af35-362e246f9aae" alt="Logo" width="80" height="80">
    <h3 align="center">Kordle</h3>
    <p align="center">
        Wordle inspired K-pop idol guessing game
        <br />
        <br />
        <a href="https://www.playkordle.com/">Live server</a>
    </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#database-and-deployment">Database and Deployment</a></li>
      </ul>
    </li>
    <li>
      <a href="#run-on-local-machine">Run On Local Machine</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#configure-the-project">Configure the Project</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

<div align="center">
  <img src="https://github.com/user-attachments/assets/7359efc2-3d0d-4252-8c16-d23b2911bd18" alt="Logo">
</div>

This project was inspired by <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>, a game where you have to guess the correct word through the hints you get. Wordle was fun to play and I wanted to see how I can make my own version and put a twist to it. Being a K-pop fan, I wanted to create a fun and interactive game that combines the logic of Wordle with the massive world of K-pop idols! One <strong>important</strong> thing to mention is that this repository is for local development purposes and the production version of this application is on a private repository.

### Frontend
Frontend is made with HTML, CSS, JavaScript, and Bootstrap5. JavaScript fetches idol data from the backend through API calls and works with the frontend to display hints. Mostly used Bootstrap5 to style the application as it is much faster to code compared to CSS. However, CSS was used in the home page to create the animations for the game.

### Backend
Backend is made with Django and Django Rest Framework. Created a RESTful API that fetches both a random idol and the complete dataset from a local JSON file, which is then serialized for the frontend. Django handles authentication and user profile management. This includes login, registration, user-profile uploads, and win counts. Also integrated Amazon S3 to store user uploaded media.

### Database and Deployment
Database is PostgreSQL managed by Heroku and the application is also deployed on Heroku. Heroku Dynos manage server processes and Gunicorn is used as the production WSGI server which handles incoming requests. The domain name playkordle.com is bought from <a href="https://www.godaddy.com">godaddy</a>, and routes traffic directly to my deployed application.


<!-- GETTING STARTED -->
## Run On Local Machine
### Prerequisites

1. Create a folder for the project and clone the repository into that folder:
    
   ```bash
   git clone https://github.com/Ryan11c/kordle.git
   ```
2. Navigate to the folder. Create and activate a virtual environment making sure to use python version 3.12.3. This ensures all packages will work:
   
   ```bash
   python -m venv venv # <- on windows or on mac/linux -> python3 -m venv venv
   . venv/Scripts/activate               #on mac/linux -> source venv/bin/activate
   ```

### Installation

1. Navigate into the `kordle` folder and install required packages:

   ```bash
   cd kordle
   pip install -r requirements.txt
   ```
   
### Configure the Project

1. Create a `.env` file in the root directory of Kordle and put your secret key inside the `.env` file:
   ```
   DEBUG=True
   SECRET_KEY=*******
   ```
2. Apply migrations:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
3. Create new superuser:

   ```bash
   python manage.py createsuperuser
   Username: admin
   Email address: admin@example.com
   Password: **********
   Password (again): *********
   Superuser created successfully.
   ```
4. Start the development server:

   ```bash
   python manage.py runserver
   ```
5. Open your web browser and go to [http://127.0.0.1:8000/](http://127.0.0.1:8000/) to explore the application.


<!-- USAGE -->
## Usage

The main objective of this game is to guess the random kpop idol generated by the backend. First we type the name of a K-pop idol and see the feedback we get. Every idol has these categories: Icon, Group, Birthday, Height(cm), Gender, Company, and Nationality. The game will see which categories are correct or incorrect and display accordingly. If you guess correctly and you are logged in, your win count increases and is saved to your profile.


<!-- Features -->
## Features

### Stats
Displays various statistics such as leaderboard, sign-up chart, and request-per-day chart. Leaderboard was created using bootstrap and django template tags while the charts were made from chart.js
<div align="center">
    <img src="https://github.com/user-attachments/assets/fc648cbd-1618-4021-bab7-f0a631ead2cc" alt="Logo">
</div>
<div align="center">
    <img src="https://github.com/user-attachments/assets/61f6c12d-95d0-4db4-bbd4-893b477f2abd" alt="Logo">
</div>
<div align="center">
    <img src="https://github.com/user-attachments/assets/c8e62dcd-5597-48ae-b052-c0bdcf15e7ae" alt="Logo">
</div>

### Profile lists
Django template tags loop through the Profile objects and dynamically render each profile on the page. To enhance performance I added pagination to display 10 profiles per page.
<div align="center">
    <img src="https://github.com/user-attachments/assets/95f1beed-6855-40b9-8c15-d8527ac92367" alt="Logo">
</div>

### Register and Sign-in
Simple bootstrap template to create the register and sign-in pages. You can check it out <a href="https://mdbootstrap.com/docs/standard/extended/login/">here</a>.
<div align="center">
    <img src="https://github.com/user-attachments/assets/8914584e-ede3-4977-8638-18eab70401be" alt="Logo">
    <img src="https://github.com/user-attachments/assets/852efe64-fdcc-443a-be77-01b729a19576" alt="Logo">
</div>


<!-- CONTRIBUTING -->
## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


<!-- CONTACT -->
## Contact

Ryan Choi - ryanchoi4421@gamil.com

Project Link: [https://github.com/Ryan11c/kordle](https://github.com/Ryan11c/kordle)

[python-url]: https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue
[django-url]: https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green
[djangorest-url]: https://img.shields.io/badge/django%20rest-ff1709?style=for-the-badge&logo=django&logoColor=white
[js-url]: https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E
[html-url]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[postgres-url]: https://img.shields.io/badge/PostgreSQL-green?style=for-the-badge
[heroku-url]: https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white
[bootstrap-url]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[amazon-url]: https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white
