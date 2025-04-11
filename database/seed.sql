-- SEEDING SQL SCRIPT TO POPULATE DATABASE

-- instering categories
INSERT INTO categories (name) VALUES ('Star Wars');
INSERT INTO categories (name) VALUES ('Construction');
INSERT INTO categories (name) VALUES ('Heros');
INSERT INTO categories (name) VALUES ('Need for Speed');


-- instering users
INSERT INTO users (name, email, password, user_type)
VALUES ('Admin User', 'admin@legostore.com', 'adminpassword', 'admin');

INSERT INTO users (name, email, password, user_type)
VALUES ('John Doe', 'john@mail.com', 'johnpassword', 'customer');



INSERT INTO products (name, description, image_url, price, num_pieces, age_rating, item_num, category_id)
VALUES ('Star Wars Millennium Falcon', 'Build and play with the iconic Millennium Falcon from Star Wars.', 'https://example.com/millennium-falcon.jpg', 159.99, 1351, '14+', '75192', 1);

INSERT INTO products (name, description, image_url, price, num_pieces, age_rating, item_num, category_id)
VALUES ('Star Wars X-Wing Starfighter', 'Construct the legendary X-Wing Starfighter from Star Wars.', 'https://example.com/x-wing-starfighter.jpg', 89.99, 731, '9+', '75218', 1);

INSERT INTO products (name, description, image_url, price, num_pieces, age_rating, item_num, category_id)
VALUES ('IRON Man', 'lego set of iron man in mark 3', 'https://example.com/ironmanmark3.jgpg', 49.99, 375, '8+', '76125', 3);

INSERT INTO products (name, description, image_url, price, num_pieces, age_rating, item_num, category_id)
VALUES ('Bulldozer', 'lego set of bulldozer', 'https://example.com/bulldozer.jpg', 29.99, 250, '6+', '42121', 2);

INSERT INTO products (name, description, image_url, price, num_pieces, age_rating, item_num, category_id)
VALUES ('Need for Speed Car', 'lego set of a racing car from need for speed', 'https://example.com/nfs-car.jpg', 39.99, 500, '10+', '42122', 4);

INSERT INTO products (name, description, image_url, price, num_pieces, age_rating, item_num, category_id)   
VALUES ('Bugatti Chiron', 'Build the ultimate Bugatti Chiron with this detailed LEGO set.', 'https://example.com/bugatti-chiron.jpg', 349.99, 3599, '16+', '42083', 4);

