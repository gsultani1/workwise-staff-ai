
-- This function gets a list of all conversations for a user with the latest message and unread count
CREATE OR REPLACE FUNCTION public.get_conversations(user_id UUID)
RETURNS TABLE (
  employee_id UUID,
  first_name TEXT,
  last_name TEXT,
  latest_message TEXT,
  latest_timestamp TIMESTAMPTZ,
  unread_count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  WITH conversations AS (
    SELECT 
      CASE 
        WHEN sender_id = user_id THEN recipient_id
        ELSE sender_id
      END AS contact_id,
      MAX(created_at) AS latest_msg_time
    FROM 
      messages
    WHERE 
      sender_id = user_id OR recipient_id = user_id
    GROUP BY 
      contact_id
  ),
  unread_counts AS (
    SELECT 
      sender_id AS contact_id,
      COUNT(*) AS unread_count
    FROM 
      messages
    WHERE 
      recipient_id = user_id AND 
      read_at IS NULL
    GROUP BY 
      sender_id
  )
  SELECT 
    c.contact_id AS employee_id,
    e.first_name,
    e.last_name,
    m.content AS latest_message,
    m.created_at AS latest_timestamp,
    COALESCE(u.unread_count, 0) AS unread_count
  FROM 
    conversations c
  JOIN 
    employees e ON c.contact_id = e.id
  JOIN 
    messages m ON (
      (m.sender_id = user_id AND m.recipient_id = c.contact_id) OR 
      (m.sender_id = c.contact_id AND m.recipient_id = user_id)
    ) AND m.created_at = c.latest_msg_time
  LEFT JOIN 
    unread_counts u ON c.contact_id = u.contact_id
  ORDER BY 
    m.created_at DESC;
$$;
