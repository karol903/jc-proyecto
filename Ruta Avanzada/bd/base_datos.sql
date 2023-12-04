create database jovenes_creativos;
use jovenes_creativos;


create database  Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    NombreUsuario VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Pasword VARCHAR(255) NOT NULL,
    FechaDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO Usuarios (NombreUsuario, Email, Pasword)
VALUES ('Valeria Sayago', 'valerysayago21@gmail.com', '123456');


CREATE TABLE IF NOT EXISTS Usuarios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    NombreUsuario VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Pasword VARCHAR(255) NOT NULL,
);

INSERT INTO Usuarios (NombreUsuario, Email, Pasword)
VALUES ('NuevoUsuario', 'valerysayago21@gmail.com', 'hash_de_la_contrasena_generado_por_la_aplicacion');


CREATE TABLE IF NOT EXISTS Tareas (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioID INT,
    Titulo VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado ENUM('Pendiente', 'En Progreso', 'Completada') DEFAULT 'Pendiente',
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(ID)
);

INSERT INTO Tareas (UsuarioID, Titulo, Descripcion, Estado)
VALUES (1, 'valeria sayago', 'compota', 'Pendiente');
