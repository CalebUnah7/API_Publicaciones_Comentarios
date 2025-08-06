CREATE TABLE publicaciones (
    id char(36) primary key,
    titulo varchar(255) not null,
    contenido text not null,
    autorID BINARY(16) not null,
    fecha_creacion timestamp default current_timestamp,
    activo boolean default true,
    publica boolean default true,
    FOREIGN KEY (autorID) REFERENCES users(id)
);
CREATE TABLE comentariosPublicaciones (
    id char(36) primary key,
    publicacion_id char(36) NOT NULL,
    user_id BINARY(16) NOT NULL,
    comentario TEXT,
    activo BOOLEAN DEFAULT TRUE,    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (publicacion_id) REFERENCES publicaciones(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
  id BINARY(16) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  must_change_password BOOLEAN DEFAULT TRUE,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Insert into publicaciones (id, titulo, contenido, autorID) values 
(UUID(), 'Como utilizar tu tarjeta de credito de manera inteligente', 'Analiza bien tus compras y los gastos necesarios de cada mes...', 'Abrahan'),
(UUID(), 'Reseña de productos de belleza en tendencia', 'Comparamos precio-calidad, hay otro productos que se le parecen..', 'BeautyBlogger'),
(UUID(), 'Países que debes de visitar si o si', 'Te muestro lugares y tips de viaje...', 'Un_ViajeroxElMundo');


