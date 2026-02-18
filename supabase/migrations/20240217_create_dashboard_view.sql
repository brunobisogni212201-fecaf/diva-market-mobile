
-- Create a view for admin dashboard metrics
-- This view aggregates orders to calculate GMV, Total Orders, and Average Ticket
-- It also provides daily sales data for charts

CREATE OR REPLACE VIEW view_dashboard_admin AS
WITH daily_sales AS (
    SELECT
        DATE(created_at) as sale_date,
        COUNT(*) as daily_orders,
        SUM(total_amount) as daily_revenue
    FROM
        public.orders
    WHERE
        status != 'cancelled' -- Exclude cancelled orders
    GROUP BY
        DATE(created_at)
)
SELECT
    -- Overall Metrics
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders WHERE status != 'cancelled') as gmv_total,
    (SELECT COUNT(*) FROM public.orders WHERE status != 'cancelled') as total_orders,
    (
        SELECT COALESCE(AVG(total_amount), 0) 
        FROM public.orders 
        WHERE status != 'cancelled'
    ) as avg_ticket,
    
    -- Recent Sales History (JSON array for charts)
    (
        SELECT json_agg(t) FROM (
            SELECT sale_date, daily_orders, daily_revenue
            FROM daily_sales
            ORDER BY sale_date DESC
            LIMIT 30
        ) t
    ) as sales_history;

-- Grant access to authenticated users (RLS will filter if needed, but this is an admin view)
GRANT SELECT ON view_dashboard_admin TO authenticated;
GRANT SELECT ON view_dashboard_admin TO service_role;
