-- macro_users
CREATE TABLE macro_users (
	macro_user_id INT NOT NULL IDENTITY PRIMARY KEY,
	email NVARCHAR(100) NOT NULL UNIQUE,
	password NVARCHAR(100) NOT NULL
);

-- micro_users
CREATE TABLE micro_users (
	micro_user_id INT NOT NULL IDENTITY PRIMARY KEY,
	macro_user_id INT NOT NULL FOREIGN KEY REFERENCES macro_users(macro_user_id),
	full_name NVARCHAR(60),
	active CHAR(1) NOT NULL
);
ALTER TABLE micro_users
	ADD CONSTRAINT uq_micro_users UNIQUE(macro_user_id, full_name);

-- user_map
CREATE TABLE user_map (
	user_map_id INT NOT NULL IDENTITY PRIMARY KEY,
	micro_user_id INT NOT NULL UNIQUE,
	member_name NVARCHAR(50) NOT NULL UNIQUE
);

-- merchants
CREATE TABLE merchants (
	merchant_id	INT NOT NULL IDENTITY PRIMARY KEY,
	merchant_name	NVARCHAR(100)	NOT NULL,
	longitude DECIMAL(12,9),
	latitude DECIMAL(12,9),
	address NVARCHAR(200),
	macro_user_id INT NOT NULL FOREIGN KEY REFERENCES macro_users(macro_user_id)
);
ALTER TABLE merchants
	ADD CONSTRAINT uq_merchants UNIQUE(merchant_name, macro_user_id);

-- merchant_import
CREATE TABLE merchant_import (
	merchant_import_id INT NOT NULL IDENTITY PRIMARY KEY,
	merchant_title NVARCHAR(100) NOT NULL UNIQUE,
	merchant_id	INT FOREIGN KEY REFERENCES merchants(merchant_id)
);

-- hex_colors
CREATE TABLE hex_colors (
	hex_color_id INT NOT NULL IDENTITY PRIMARY KEY,
	hex_color INT NOT NULL UNIQUE
);

-- categories
CREATE TABLE categories (
	category_id INT NOT NULL IDENTITY PRIMARY KEY,
	category_name NVARCHAR(50) NOT NULL,
	category_color INT NOT NULL,
	macro_user_id INT NOT NULL
);
ALTER TABLE categories
	ADD CONSTRAINT uq_categories UNIQUE(category_name, macro_user_id);

-- transactions
CREATE TABLE transactions (
	transaction_id INT NOT NULL IDENTITY PRIMARY KEY,
	transaction_date DATE NOT NULL,
	transaction_amount DECIMAL(19,4)	NOT NULL,
	merchant_id	INT NOT NULL FOREIGN KEY REFERENCES merchants(merchant_id),
	account_name NVARCHAR(20) NOT NULL,
	micro_user_id INT NOT NULL FOREIGN KEY REFERENCES micro_users(micro_user_id),
	category_id INT NOT NULL FOREIGN KEY REFERENCES categories(category_id)
);
ALTER TABLE transactions
	ADD CONSTRAINT uq_transactions UNIQUE(transaction_date, transaction_amount, merchant_id, account_name, micro_user_id);