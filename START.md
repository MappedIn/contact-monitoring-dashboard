# Getting Started

-   [ ] clone this project into a directory `new-microservice` (use the name you will be using for this service)

## Project Repo Setup

`git clone git@github.com:MappedIn/microservice-template.git new-microservice`

`cd new-microservice/`

our remote will still be pointing to the old microservice-template repo
`git remote -v`

> origin git@github.com:MappedIn/microservice-template.git (fetch)\
> origin git@github.com:MappedIn/microservice-template.git (push)

set our origin to be the new repo for this project
`git remote set-url origin git@github.com:MappedIn/new-microservice.git`

because we can't seem to fork repos privately, we need to set the upstream project to be the microservice template so that we can pull changes (if we feel like it)
`git remote add upstream git@github.com:MappedIn/microservice-template.git`

`git remote -v`

> origin git@github.com:MappedIn/new-microservice.git (fetch)\
> origin git@github.com:MappedIn/new-microservice.git (push)
> upstream git@github.com:MappedIn/microservice-template.git (fetch)
> upstream git@github.com:MappedIn/microservice-template.git (push)

to pull changes from the microservice template later
`git pull upstream master`

`git push`

> Counting objects: 801, done.\
> Delta compression using up to 4 threads.\
> Compressing objects: 100% (341/341), done.\
> Writing objects: 100% (801/801), 743.61 KiB | 37.18 MiB/s, done.\
> Total 801 (delta 426), reused 796 (delta 425)\
> remote: Resolving deltas: 100% (426/426), done.\
> To github.com:MappedIn/new-microservice.git\
>
> -   [new branch] master -> master\

## Project Configuration

-   [ ] replace all references to microservice template with the name of this new service in:
    -   [ ] `./.env.example`
    -   [ ] `./package.json`
    -   [ ] `./Jenkinsfile.staging.groovy`
    -   [ ] `./README.md`
    -   [ ] `./client/README.md`
-   [ ] commit `git commit -a -m "I did a thing"` <- but with better comment
-   [ ] add new app in permission manager (you will need admin access to permission manager)
-   [ ] add new single page application entry in auth0 management (you will need admin access to auth0)
-   [ ] `cp ./.env.example ./.env` then update APP\_\* envs with your app data from permission manager
-   [ ] `yarn && yarn client` to install all dependencies
-   [ ] if you are using redis in docker on mac: add `127.0.0.1 host.docker.internal` entry to your `/etc/hosts` file, then set in your .env `USER_CACHE_REDIS_CONNECTION="redis://host.docker.internal:6379"`
-   [ ] `yarn dev` and open `http://localhost:8080` in browser assuming you didn't change the `PORT` in your .env

## Implementing

For now, I have nothing. But soon I will have some tutorials for basic tasks like getting data from other resources, or attaching another database.

## Jenkins

Set up CI/CD:

-   [ ] In github repo -> Settings -> Collaborators & Teams - [ ] Add a Team
        CI - Write
        CI-Pull-Only - Read
        Dev - Write

-   [ ] In jenkins select `New item` - [ ] Copy from: microservice-template-ci - [ ] Change the Description - [ ] Set the repository to use:
        Branch Source -> Repository and select this repo - [ ] Save - now your PRs and master branch should have CI

-   [ ] delete this file. (optional)
