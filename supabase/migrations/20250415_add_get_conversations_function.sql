
-- Function to efficiently get all conversations with latest message for a user
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
AS $$
WITH conversation_partners AS (
  -- Get all unique conversation partners
  SELECT DISTINCT
    CASE
      WHEN sender_id = user_id THEN recipient_id
      ELSE sender_id
    END AS partner_id
  FROM messages
  WHERE sender_id = user_id OR recipient_id = user_id
),
latest_messages AS (
  -- Get the latest message for each conversation
  SELECT
    partner_id,
    first_value(content) OVER (
      PARTITION BY partner_id
      ORDER BY created_at DESC
    ) AS latest_message,
    first_value(created_at) OVER (
      PARTITION BY partner_id
      ORDER BY created_at DESC
    ) AS latest_timestamp
  FROM (
    SELECT
      CASE
        WHEN sender_id = user_id THEN recipient_id
        ELSE sender_id
      END AS partner_id,
      content,
      created_at
    FROM messages
    WHERE sender_id = user_id OR recipient_id = user_id
  ) m
),
unread_counts AS (
  -- Count unread messages for each conversation
  SELECT
    sender_id AS partner_id,
    COUNT(*) AS unread_count
  FROM messages
  WHERE recipient_id = user_id AND read_at IS NULL
  GROUP BY sender_id
)

-- Join everything together with employee information
SELECT DISTINCT ON (cp.partner_id)
  e.id AS employee_id,
  e.first_name,
  e.last_name,
  lm.latest_message,
  lm.latest_timestamp,
  COALESCE(uc.unread_count, 0) AS unread_count
FROM conversation_partners cp
JOIN employees e ON e.id = cp.partner_id
JOIN latest_messages lm ON lm.partner_id = cp.partner_id
LEFT JOIN unread_counts uc ON uc.partner_id = cp.partner_id
ORDER BY cp.partner_id, lm.latest_timestamp DESC;
$$;

-- Enable RLS on the messages table to ensure proper security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view messages they've sent or received
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE employee_id = sender_id OR employee_id = recipient_id
  ));

-- Policy to allow users to insert messages they're sending
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE employee_id = sender_id
  ));

-- Policy to allow users to update read status of messages they've received
CREATE POLICY "Users can mark received messages as read" ON public.messages
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE employee_id = recipient_id
  ))
  WITH CHECK (
    -- Only allow updating the read_at field
    (NEW.content = OLD.content AND
     NEW.sender_id = OLD.sender_id AND
     NEW.recipient_id = OLD.recipient_id)
  );
