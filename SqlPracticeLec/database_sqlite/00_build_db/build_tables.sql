create table movies (
      id         INT NOT NULL UNIQUE,
      title      CHAR NOT NULL,
      year       INT NOT NULL,
      length     INT NOT NULL,
      studioId    INT NOT NULL,
      cost       INT NOT NULL         );

create table stars (
      id         INT NOT NULL UNIQUE,
      name       CHAR NOT NULL,
      born       INT NOT NULL,
      father     CHAR NOT NULL,
      mother     CHAR NOT NULL        );

create table studios (
      id         INT NOT NULL UNIQUE,
      name       CHAR NOT NULL,
      founded    INT NOT NULL,
      founder    INT NOT NULL,
      website    CHAR NOT NULL        );

create table starIn (
      movieId    INT NOT NULL,
      starId     INT NOT NULL         );

.separator ","
.mode csv
.import "00_build_db/movies.csv"  movies
.import "00_build_db/stars.csv"   stars
.import "00_build_db/studios.csv" studios
.import "00_build_db/starIn.csv"  starIn

