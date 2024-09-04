# Tạo database
#abc
CREATE DATABASE node44;
USE node44;
# tạo table
CREATE TABLE users(
	user_id INT,
	full_name VARCHAR(50),
	email VARCHAR(50),
	pass_word VARCHAR(255),
	age INT
)


INSERT INTO users (user_id, full_name, email, pass_word, age) VALUES
(1, 'John Doe', 'johndoe@example.com', 'password123', 28),
(2, 'Jane Smith', 'janesmith@example.com', 'password123', 34),
(3, 'Michael Johnson', 'michaelj@example.com', 'password123', 40),
(4, 'Emily Davis', 'emilyd@example.com', 'password123', 25),
(5, 'Chris Brown', 'chrisb@example.com', 'password123', 31),
(6, 'Sarah Wilson', 'sarahw@example.com', 'password123', 27),
(7, 'David Miller', 'davidm@example.com', 'password123', 45),
(8, 'Jessica Taylor', 'jessicat@example.com', 'password123', 22),
(9, 'Daniel Anderson', 'daniela@example.com', 'password123', 33),
(10, 'Laura Thomas', 'laurat@example.com', 'password123', 29),
(11, 'Paul Moore', 'paulm@example.com', 'password123', 36),
(12, 'Anna Jackson', 'annaj@example.com', 'password123', 24),
(13, 'Mark Lee', 'markl@example.com', 'password123', 38),
(14, 'Sophia Harris', 'sophiah@example.com', 'password123', 26),
(15, 'Peter Clark', 'peterc@example.com', 'password123', 32),
(16, 'Olivia Lewis', 'olivial@example.com', 'password123', 30),
(17, 'James Walker', 'jamesw@example.com', 'password123', 42),
(18, 'Linda Young', 'linday@example.com', 'password123', 37),
(19, 'Robert Hall', 'roberth@example.com', 'password123', 50),
(20, 'Susan Allen', 'susana@example.com', 'password123', 28);

SELECT * FROM users
WHERE age BETWEEN 25 AND 30

SELECT * FROM users
WHERE (full_name like '%John%') AND (BETWEEN 25 AND 30)

SELECT * FROM users
ORDER BY age DESC
LIMIT 5

#Thêm constraint (ràng buộc) cho column
ALTER TABLE users
MODIFY COLUMN full_name VARCHAR(255) NOTNULL,

# update date
UPDATE users
SET full_name= 'Vo Van'
WHERE user_id = 1

SELECT * FROM users
WHERE user_id = 1

# Delete data
DELETE FROM users
WHERE user_id =2


#soft delete -> thêm flag is_deleted để không show dât
ALTER TABLE users
ADD COLUMN is_deleted INT NOT NULL DEFAULT 1

# tìm những người có tuổi lớn nhất
SELECT * from users
WHERE age=(
	SELECT age FROM users
	ORDER BY age DESC
	LIMIT 1
)


SELECT * FROM users
SELECT full_name as 'Họ tên' from users
# thêm column tuổi cho table users
ALTER TABLE users
ADD COLUMN age INT

# Đổi kiểu dữ liệu cho column full_name
ALTER TABLE users
MODIFY COLUMN full_name VARCHAR(50) NOT NULL,
MODIFY COLUMN email VARCHAR(50) NOT NULL,
MODIFY COLUMN pass_word VARCHAR(255) NOT NULL

# thêm khóa chính (PRIMARY KEY) cho column users_id
ALTER TABLE users
MODIFY COLUMN user_id INT PRIMARY KEY AUTO_INCREMENT
# tạo data

# Tương tác với data

# Query (lấy dữ diệu)


# Thêm, xóa, sửa
#them gi dogit st
#test

#tesstttttttt