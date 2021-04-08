/* View for querying all transactions and their relevant details */
CREATE VIEW all_transactions_and_details
AS
	SELECT t.transaction_id, 
				 t.transaction_date, 
				 t.transaction_amount,
				 m.merchant_name,
				 c.category_name,
				 c.category_color,
				 m.longitude, 
				 m.latitude, 
				 m.address,
				 u.micro_user_id,
				 u.macro_user_id,
				 u.full_name member_name,
				 t.account_name
	FROM transactions t
	JOIN merchants m
	ON t.merchant_id = m.merchant_id
	JOIN categories c
	ON t.category_id = c.category_id
	JOIN micro_users u
	ON t.micro_user_id = u.micro_user_id

------------------------------------------------------------------------

/* View for querying all categories and their relevant details */
CREATE VIEW all_categories_and_details
AS
	SELECT c.category_id,
		   	 CASE WHEN c.category_name='' THEN 'NONE' ELSE c.category_name END category_name,
		   	 c.category_color,
		   	 t.transaction_amount,
		   	 t.transaction_date,
		   	 m.macro_user_id
	FROM transactions t
	JOIN categories c
	ON t.category_id = c.category_id
	JOIN micro_users m
	ON t.micro_user_id = m.micro_user_id

------------------------------------------------------------------------

/* View for querying all merchants and their relevant details */
CREATE VIEW all_merchants_and_details
AS
	SELECT m.merchant_id,
	     	 m.merchant_name,
	     	 t.transaction_amount,
	     	 t.transaction_date,
	     	 c.category_color,
	     	 mic.macro_user_id
	FROM transactions t
	JOIN merchants m
	ON t.merchant_id = m.merchant_id
	JOIN categories c
	ON t.category_id = c.category_id
	JOIN micro_users mic
	ON t.micro_user_id = mic.micro_user_id

------------------------------------------------------------------------

/* View for querying all users */
CREATE VIEW user_details
AS
	SELECT macro.macro_user_id,
				 micro.micro_user_id,
				 macro.email,
				 macro.password,
				 micro.full_name member_name
	FROM macro_users macro
	JOIN micro_users micro
	ON macro.macro_user_id = micro.macro_user_id