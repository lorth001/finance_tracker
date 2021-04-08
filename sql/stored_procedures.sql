/* Stored procedure for getting all transactions between two dates */

CREATE PROCEDURE [dbo].[GET_TransactionsBetween]
  @TransactionDateStart date,
  @TransactionDateEnd date,
  @MacroUserId int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM all_transactions_and_details
    WHERE merchant_name not like '%PAYMENT - THANK YOU'
	AND transaction_date BETWEEN @TransactionDateStart AND @TransactionDateEnd
	AND macro_user_id = @MacroUserId
    ORDER BY transaction_date DESC
END;

------------------------------------------------------------------------

/* Stored procedure for getting all transactions for specific month */

CREATE PROCEDURE [dbo].[GET_TransactionsForMonth]
  @TransactionMonth nvarchar(50),
  @MacroUserId int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM all_transactions_and_details
    WHERE merchant_name not like '%PAYMENT - THANK YOU'
	AND transaction_date LIKE CONCAT(@TransactionMonth, '%')
	AND macro_user_id = @MacroUserId
    ORDER BY transaction_date DESC
END;

------------------------------------------------------------------------

/* Stored procedure for getting transaction by ID */

CREATE PROCEDURE [dbo].[GET_TransactionById]
  @TransactionId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT *
	FROM all_transactions_and_details
  WHERE transaction_id = @TransactionId
END

------------------------------------------------------------------------

/* Stored procedure for inserting records from AMEX Scraper */

CREATE PROCEDURE insert_transactions
  @AccountName nvarchar(10),        -- account_name [accounts]
  @TransactionDate date,            -- transaction_date [transactions]
  @MerchantName nvarchar(100),      -- merchant_name [merchants]
  @MemberName nvarchar(30),         -- member_name [user_map]
  @TransactionAmount decimal(19,4), -- transaction_amount [transactions]
  @Longitude decimal(12,9),         -- longitude [merchant_addresses]
  @Latitude decimal(12,9),          -- latitude [merchant_addresses]
  @Address nvarchar(200),           -- address [merchant_addresses]
  @CategoryName nvarchar(50),       -- category_name [categories] (need to get the category_id using this)
  @Email nvarchar(100)              -- email [macro_users]
AS
BEGIN
  DECLARE @MerchantId int,
          @MacroUserId int,
          @MicroUserId int,
          @CategoryColor int,
          @CategoryId int;

  SELECT @MacroUserId = macro_user_id -- account_id
  FROM macro_users
  WHERE email = @Email;

  SELECT @MicroUserId = micro_user_id
  FROM user_map
  WHERE member_name = @MemberName

  BEGIN TRY

    -- MERCHANT_IMPORT
    INSERT INTO merchant_import
    (merchant_title)
    VALUES
    (@MerchantName);

    -- MERCHANTS
    INSERT INTO merchants
    (merchant_name, longitude, latitude, address, macro_user_id)
    VALUES
    (@MerchantName, @Longitude, @Latitude, @Address, @MacroUserId);

    SET @MerchantId = SCOPE_IDENTITY(); -- merchant_id

    UPDATE merchant_import
    SET merchant_id = @MerchantId
    WHERE merchant_title = @MerchantName;

  END TRY
  BEGIN CATCH

    SELECT @MerchantId = merchant_id
    FROM merchant_import
    WHERE merchant_title = @MerchantName;
    
  END CATCH;
  BEGIN TRY

    -- CATEGORIES
    EXEC @CategoryColor = get_hex_code @Category = @CategoryName, @UserId = @MacroUserId;

    INSERT INTO categories
    (category_name, category_color, macro_user_id)
    VALUES
    (@CategoryName, @CategoryColor, @MacroUserId);

    SET @CategoryId = SCOPE_IDENTITY(); -- category_id

  END TRY
  BEGIN CATCH

    SELECT @CategoryId = category_id
    FROM categories
    WHERE macro_user_id = @MacroUserId
    AND category_name = @CategoryName;

  END CATCH;
  BEGIN TRY

    -- TRANSACTIONS
    INSERT INTO transactions
    (transaction_date, transaction_amount, merchant_id, account_name, micro_user_id, category_id)
    VALUES
    (@TransactionDate, @TransactionAmount, @MerchantId, @AccountName, @MicroUserId, @CategoryId);

  END TRY
  BEGIN CATCH
  END CATCH;
END;

------------------------------------------------------------------------

/* Stored procedure for creating a transaction */

CREATE PROCEDURE [dbo].[POST_CreateTransaction]
  @TransactionDate date,
  @TransactionAmount decimal(19,4),
  @MerchantName nvarchar(100),
  @CategoryName nvarchar(50),
  @Longitude decimal(12,9),
  @Latitude decimal(12,9),
  @Address nvarchar(200),
  @MemberName nvarchar(30),
  @AccountName nvarchar(10),
  @MacroUserId int
AS
BEGIN
  DECLARE @MerchantId int,
          @MicroUserId int,
          @CategoryColor int,
          @CategoryId int;

  -- MICRO_USERS
  BEGIN TRY

    INSERT INTO micro_users
    (macro_user_id, full_name, active)
    VALUES
    (@MacroUserId, @MemberName, 'Y');

    SET @MicroUserId = SCOPE_IDENTITY();

  END TRY
  BEGIN CATCH

    SELECT @MicroUserId = micro_user_id
    FROM micro_users
    WHERE full_name = @MemberName
    AND macro_user_id = @MacroUserId;

  END CATCH

  -- MERCHANTS
  BEGIN TRY

    INSERT INTO merchants
    (merchant_name, longitude, latitude, address, macro_user_id)
    VALUES
    (@MerchantName, @Longitude, @Latitude, @Address, @MacroUserId);

    SET @MerchantId = SCOPE_IDENTITY();       -- merchant_id

  END TRY
  BEGIN CATCH

    SELECT @MerchantId = merchant_id          -- merchant_id
    FROM merchants
    WHERE merchant_name = @MerchantName
    AND macro_user_id = @MacroUserId;

    UPDATE merchants
    SET longitude = @Longitude,
        latitude = @Latitude,
        address = @Address
    WHERE merchant_id = @MerchantId;

  END CATCH;
  BEGIN TRY

    -- CATEGORIES
    EXEC @CategoryColor = get_hex_code @Category = @CategoryName, @UserId = @MacroUserId;

    INSERT INTO categories
    (category_name, category_color, macro_user_id)
    VALUES
    (@CategoryName, @CategoryColor, @MacroUserId);

    SET @CategoryId = SCOPE_IDENTITY(); -- category_id

  END TRY
  BEGIN CATCH

    SELECT @CategoryId = category_id
    FROM categories
    WHERE macro_user_id = @MacroUserId
    AND category_name = @CategoryName;

  END CATCH;
  BEGIN TRY

    -- TRANSACTIONS
    INSERT INTO transactions
    (transaction_date, transaction_amount, merchant_id, account_name, micro_user_id, category_id)
    OUTPUT Inserted.transaction_id, @CategoryColor 
    VALUES
    (@TransactionDate, @TransactionAmount, @MerchantId, @AccountName, @MicroUserId, @CategoryId);

  END TRY
  BEGIN CATCH
  END CATCH;
END;

------------------------------------------------------------------------

/* Stored procedure for updating a transaction by ID */

CREATE PROCEDURE [dbo].[PUT_UpdateTransaction]
  @TransactionId int,
  @TransactionDate date,
  @TransactionAmount decimal(19,4),
  @MerchantName nvarchar(100),
  @CategoryName nvarchar(50),
  @Longitude decimal(12,9),
  @Latitude decimal(12,9),
  @Address nvarchar(200),
  @MemberName nvarchar(30),
  @AccountName nvarchar(10),
  @MacroUserId int
AS
BEGIN
  DECLARE @MerchantId int,
          @MicroUserId int,
		      @CategoryId int,
          @CategoryColor int;

  -- MICRO_USERS
  BEGIN TRY

    INSERT INTO micro_users
    (macro_user_id, full_name, active)
    VALUES
    (@MacroUserId, @MemberName, 'Y');

    SET @MicroUserId = SCOPE_IDENTITY();

  END TRY
  BEGIN CATCH

    SELECT @MicroUserId = micro_user_id
    FROM micro_users
    WHERE full_name = @MemberName
    AND macro_user_id = @MacroUserId;

  END CATCH

  -- MERCHANTS
  BEGIN TRY

    INSERT INTO merchants
    (merchant_name, longitude, latitude, address, macro_user_id)
    VALUES
    (@MerchantName, @Longitude, @Latitude, @Address, @MacroUserId);

    SET @MerchantId = SCOPE_IDENTITY();       -- merchant_id

  END TRY
  BEGIN CATCH

    SELECT @MerchantId = merchant_id          -- merchant_id
    FROM merchants
    WHERE merchant_name = @MerchantName
    AND macro_user_id = @MacroUserId;

    UPDATE merchants
    SET longitude = @Longitude,
        latitude = @Latitude,
        address = @Address
    WHERE merchant_id = @MerchantId;
  END CATCH;

  -- CATEGORIES
  BEGIN TRY
    
    EXEC @CategoryColor = get_hex_code @Category = @CategoryName, @UserId = @MacroUserId;

    INSERT INTO categories
    (category_name, category_color, macro_user_id)
    VALUES
    (@CategoryName, @CategoryColor, @MacroUserId);

    SET @CategoryId = SCOPE_IDENTITY();       -- category_id
  
  END TRY
  BEGIN CATCH

    SELECT @CategoryId = category_id
    FROM categories
    WHERE macro_user_id = @MacroUserId
    AND category_name = @CategoryName;

  END CATCH;
  
  -- TRANSACTIONS
  BEGIN TRY

    UPDATE transactions
    SET transaction_date = @TransactionDate,
        transaction_amount = @TransactionAmount,
        merchant_id = @MerchantId,
        account_name = @AccountName,
        micro_user_id = @MicroUserId,
        category_id = @CategoryId
	  OUTPUT @CategoryColor
    WHERE transaction_id = @TransactionId;

  END TRY
  BEGIN CATCH
  END CATCH;
END;

------------------------------------------------------------------------

/* Stored procedure for deleting a transaction by ID */

CREATE PROCEDURE [dbo].[DELETE_DeleteTransaction]
  @TransactionId int
AS
BEGIN
  BEGIN TRY
    DELETE FROM transactions
    WHERE transaction_id = @TransactionId;
  END TRY
  BEGIN CATCH
  END CATCH;
END;

------------------------------------------------------------------------

/* Stored procedure for updating a category */

CREATE PROCEDURE [dbo].[PUT_UpdateCategory]
  @CategoryId int,
  @CategoryName nvarchar(50)
AS
BEGIN
  BEGIN TRY
    UPDATE categories
    SET category_name = @CategoryName
    WHERE category_id = @CategoryId;
  END TRY
  BEGIN CATCH
  END CATCH;
END;

------------------------------------------------------------------------

/* Stored procedure for getting all categories */

CREATE PROCEDURE [dbo].[GET_CategoriesBetween]
  @TransactionDateStart date,
  @TransactionDateEnd date,
  @MacroUserId int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT category_id, category_name, COUNT(category_id) category_count, category_color, SUM(transaction_amount) sum_transaction_amount, macro_user_id
	FROM all_categories_and_details a
	WHERE a.transaction_date BETWEEN @TransactionDateStart AND @TransactionDateEnd
	AND a.macro_user_id = @MacroUserId
	GROUP BY a.category_id, a.category_name, a.category_color, macro_user_id
	ORDER BY category_count DESC
END;

------------------------------------------------------------------------

/* Stored procedure for getting all categories for specific month */

CREATE PROCEDURE [dbo].[GET_CategoriesForMonth]
  @TransactionMonth nvarchar(50),
  @MacroUserId int
AS
BEGIN
	SET NOCOUNT ON;

  SELECT category_id, category_name, COUNT(category_id) category_count, category_color, SUM(transaction_amount) sum_transaction_amount, macro_user_id
	FROM all_categories_and_details a
	WHERE a.transaction_date LIKE CONCAT(@TransactionMonth, '%')
	AND a.macro_user_id = @MacroUserId
	GROUP BY a.category_id, a.category_name, a.category_color, macro_user_id
	ORDER BY category_count DESC
END;

------------------------------------------------------------------------

/* Stored procedure for getting category by ID */

CREATE PROCEDURE [dbo].[GET_CategoryById]
  @CategoryId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT category_id, category_name, 1 category_count, category_color, transaction_amount sum_transaction_amount, macro_user_id
	FROM all_categories_and_details
  WHERE category_id = @CategoryId
END;

------------------------------------------------------------------------

/* Stored procedure for getting all merchants */

CREATE PROCEDURE [dbo].[GET_MerchantsBetween]
  @TransactionDateStart date,
  @TransactionDateEnd date,
  @MacroUserId int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT merchant_id, merchant_name, COUNT(merchant_id) merchant_count, category_color, SUM(transaction_amount) sum_transaction_amount, macro_user_id
	FROM all_merchants_and_details
	WHERE transaction_date BETWEEN @TransactionDateStart AND @TransactionDateEnd
	AND macro_user_id = @MacroUserId
	GROUP BY merchant_id, merchant_name, category_color, macro_user_id
	ORDER BY merchant_count DESC
END;

------------------------------------------------------------------------

/* Stored procedure for getting all merchants for specific month */

CREATE PROCEDURE [dbo].[GET_MerchantsForMonth]
  @TransactionMonth nvarchar(50),
  @MacroUserId int
AS
BEGIN
	SET NOCOUNT ON;

  SELECT merchant_id, merchant_name, COUNT(merchant_id) merchant_count, category_color, SUM(transaction_amount) sum_transaction_amount, macro_user_id
	FROM all_merchants_and_details
	WHERE transaction_date LIKE CONCAT(@TransactionMonth, '%')
	AND macro_user_id = @MacroUserId
	GROUP BY merchant_id, merchant_name, category_color, macro_user_id
	ORDER BY merchant_count DESC
END;

------------------------------------------------------------------------

/* Stored procedure for getting merchant by ID */

CREATE PROCEDURE [dbo].[GET_MerchantById]
  @MerchantId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT merchant_id, merchant_name, 1 merchant_count, category_color, transaction_amount sum_transaction_amount, macro_user_id
	FROM all_merchants_and_details
  WHERE merchant_id = @MerchantId
END;

------------------------------------------------------------------------

/* Stored procedure for getting user by macroUserId */

CREATE PROCEDURE [dbo].[GET_UserById]
  @MacroUserId INT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT micro_user_id, macro_user_id, member_name, email, password
  FROM user_details
  WHERE macro_user_id = @MacroUserId
END;

------------------------------------------------------------------------

/* Stored procedure for creating a macro user */

CREATE PROCEDURE [dbo].[POST_CreateMacroUser]
  @FullName nvarchar(60),
  @Email nvarchar(100),
  @Password nvarchar(100)
AS
BEGIN
  DECLARE @MacroUserId int,
		  @MicroUserId int;

  -- MACRO_USERS
  BEGIN TRY

    INSERT INTO macro_users
    (email, password)
    OUTPUT Inserted.macro_user_id, Inserted.password 
    VALUES
    (@Email, @Password);

    SET @MacroUserId = SCOPE_IDENTITY();

  END TRY
  BEGIN CATCH
  END CATCH;

  -- MICRO_USERS
  BEGIN TRY

    INSERT INTO micro_users
    (macro_user_id, full_name, active)
    VALUES
    (@MacroUserId, @FullName, 'Y');

    SET @MicroUserId = SCOPE_IDENTITY();

  END TRY
  BEGIN CATCH
  END CATCH;
END;

------------------------------------------------------------------------

/* Stored procedure to authenticate user */

CREATE PROCEDURE [dbo].[GET_AuthenticateUser]
  @Email nvarchar(100)
AS
BEGIN
  SET NOCOUNT ON;

  SELECT macro_user_id, micro_user_id, member_name, email, password
  FROM user_details
  WHERE email = @Email
END;

------------------------------------------------------------------------

/* Stored procedure for getting hex colors for categories */

CREATE PROCEDURE get_hex_code
  @Category nvarchar(50),
  @UserId int
AS
BEGIN
  DECLARE @CategoryCount int,
          @CategoryColor int;

  SELECT @CategoryColor = category_color
  FROM categories
  WHERE macro_user_id = @UserId
  AND category_name = @Category;

  IF @CategoryColor IS NOT NULL
    RETURN @CategoryColor;
  ELSE
    SELECT @CategoryCount = COUNT(DISTINCT category_name)
    FROM categories
    WHERE macro_user_id = @UserId;

    RETURN (
      SELECT hex_color
      FROM hex_colors
	  WHERE hex_color_id = (SELECT (@CategoryCount + COUNT(hex_color_id)) % COUNT(hex_color_id) + 1 FROM hex_colors)
    );
END;