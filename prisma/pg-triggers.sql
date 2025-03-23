-- 首先，创建一个触发器函数
CREATE OR REPLACE FUNCTION update_dao_status()
    RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.is_graduated = true THEN
        UPDATE t_dao
        SET status = 'LAUNCHED' -- 假设 'GRADUATED' 是你想要设置的状态
        WHERE token_id = NEW.token_id; -- 假设 dao_id 是 t_dao_token_info 表中关联 t_dao 的外键
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 然后，创建触发器
CREATE TRIGGER trigger_update_dao_status
    AFTER UPDATE OF is_graduated
    ON t_dao_token_info
    FOR EACH ROW
    WHEN (NEW.is_graduated = true)
EXECUTE FUNCTION update_dao_status();
