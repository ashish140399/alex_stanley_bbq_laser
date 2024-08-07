CREATE TABLE IF NOT EXISTS user_data(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userdetails JSON,
    itemname  JSON,
    customizeInfo JSON,
    canvasuri TEXT,
    texttouser JSON ,
    usagetime INTEGER,
    updationtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
ALTER TABLE user_data
ADD COLUMN status VARCHAR(10) DEFAULT 'pending';
ALTER TABLE user_data
ADD COLUMN status_text VARCHAR(10) DEFAULT 'pending';


CREATE TABLE IF NOT EXISTS inventory_list(
    iv INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255),
    img_name  VARCHAR(255),
    used_count INTEGER,
    available_items INTEGER,
    updation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)



INSERT INTO `inventory_list` ( `item_name`, `img_name`, `used_count`,`available_items`, `updation_time`) VALUES
('30oz', 'Goldenrod', 0,100, CURRENT_TIMESTAMP),
( '30oz', 'Chili', 0,100, CURRENT_TIMESTAMP),
('30oz', 'TropicalTeal', 0,100, CURRENT_TIMESTAMP),
('30oz', 'VividViolet', 0,100, CURRENT_TIMESTAMP),
('30oz', 'PassionPink', 0,100, CURRENT_TIMESTAMP);

INSERT INTO `inventory_list` ( `item_name`, `img_name`, `used_count`,`available_items`, `updation_time`) VALUES
('40oz', 'Goldenrod', 0,100, CURRENT_TIMESTAMP),
( '40oz', 'Chili', 0,100, CURRENT_TIMESTAMP),
('40oz', 'TropicalTeal', 0,100, CURRENT_TIMESTAMP),
('40oz', 'VividViolet', 0,100, CURRENT_TIMESTAMP),
('40oz', 'PassionPink', 0,100, CURRENT_TIMESTAMP),
('40oz', 'BrightLime', 0,100, CURRENT_TIMESTAMP);

INSERT INTO `inventory_list` ( `item_name`, `img_name`, `used_count`,`available_items`, `updation_time`) VALUES
('iceflow', 'TropicalTeal', 0,100, CURRENT_TIMESTAMP),
( 'iceflow', 'VividViolet', 0,100, CURRENT_TIMESTAMP);



CREATE TABLE IF NOT EXISTS graphic_list(
    ig INT AUTO_INCREMENT PRIMARY KEY,
    graphic_name VARCHAR(255),
    graphic_img_name  VARCHAR(255),
    graphic_used_count INTEGER
)

INSERT INTO `graphic_list` (`ig`, `graphic_name`, `graphic_img_name`, `graphic_used_count`) VALUES
(1, 'Flower Tiger', '1', 0),
(2, 'Flowers', '2', 0),
(3, 'Flower Smiles', '3', 0),
(4, 'Smile Face', '4', 0),
(5, 'Snowboarder', '5', 0),
(6, 'Basketball Headphones', '6', 0),
(7, 'Mountain Sun', '7', 0),
(8, 'Roses', '8', 0),
(9, 'Baseball Cross Bones', '9', 0),
(10, 'Tress', '10', 0),
(11, 'Good Vibes', '11', 0),
(12, 'Heart', '12', 0),
(13, 'Multiple Flowers', '13', 0),
(14, 'Goggles and Hat', '14', 0),
(15, 'ButterFly', '15', 0),
(16, 'Solo ButterFly', '16', 0);